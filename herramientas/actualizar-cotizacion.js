#!/usr/bin/env node
/* ==========================================================================
   Actualiza la cotización del oro y la plata en CONFIG.

   Lo ejecuta solo la GitHub Action .github/workflows/cotizacion.yml, todos
   los días. También se puede lanzar a mano:

       node herramientas/actualizar-cotizacion.js

   FUENTES (las dos gratuitas y sin clave)
   - api.gold-api.com    onza de oro y de plata en dólares
   - api.frankfurter.dev cambio dólar/euro, que publica el Banco Central Europeo

   QUÉ ESCRIBE
   El valor de mercado del metal puro por gramo de cada ley. Recuerda: NO es
   el precio que paga la tienda, y la web lo dice así de claro. Si algún día
   se quiere publicar el precio de compra real, hay que multiplicar por el
   porcentaje que aplique Valeria, no tocar esto.

   POR QUÉ TIENE TANTAS COMPROBACIONES
   Esto escribe sin supervisión en la web de un cliente. Una API que devuelva
   una cifra absurda publicaría un precio absurdo. Antes de tocar nada se
   comprueba que los números son plausibles y que no se han movido más de un
   10 % desde la última vez; si algo no cuadra, falla y no escribe.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const MAIN = path.join(__dirname, '..', 'public', 'assets', 'js', 'main.js');

const ONZA = 31.1034768;          // gramos de una onza troy
const LEYES = { oro24: 0.999, oro22: 0.916, oro18: 0.750, oro14: 0.585, oro9: 0.375 };
const LEY_PLATA = 0.925;

// Márgenes de cordura. Si la cotización se sale de aquí, algo va mal en la
// fuente, no en el mercado.
const RANGO_ORO   = [20, 400];    // €/g de oro puro
const RANGO_PLATA = [0.2, 10];    // €/g de plata de ley
const SALTO_MAXIMO = 0.10;        // 10 % de variación diaria

async function traer(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'valeriasantosoro-web/1.0' } });
  if (!r.ok) throw new Error(url + ' respondió ' + r.status);
  return r.json();
}

function redondear(n) { return Math.round(n * 100) / 100; }

function leerConfigActual() {
  const fuente = fs.readFileSync(MAIN, 'utf8');
  const desde = fuente.indexOf('var CONFIG = {');
  const hasta = fuente.indexOf('\n};', desde);
  const CONFIG = new Function(fuente.slice(desde, hasta + 3) + '\nreturn CONFIG;')();
  return { fuente, CONFIG };
}

async function principal() {
  const [oro, plata, cambio] = await Promise.all([
    traer('https://api.gold-api.com/price/XAU'),
    traer('https://api.gold-api.com/price/XAG'),
    traer('https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR'),
  ]);

  const usdEur = cambio && cambio.rates && cambio.rates.EUR;
  if (!(usdEur > 0.5 && usdEur < 1.5)) {
    throw new Error('Cambio dólar/euro fuera de lo razonable: ' + usdEur);
  }
  if (!(oro.price > 0) || !(plata.price > 0)) {
    throw new Error('La cotización no trae precio');
  }

  const oroGramo   = (oro.price   * usdEur) / ONZA;   // oro puro, €/g
  const plataGramo = (plata.price * usdEur) / ONZA;   // plata pura, €/g

  if (oroGramo < RANGO_ORO[0] || oroGramo > RANGO_ORO[1]) {
    throw new Error('Oro fuera de rango: ' + oroGramo.toFixed(2) + ' €/g');
  }
  const plata925 = plataGramo * LEY_PLATA;
  if (plata925 < RANGO_PLATA[0] || plata925 > RANGO_PLATA[1]) {
    throw new Error('Plata fuera de rango: ' + plata925.toFixed(2) + ' €/g');
  }

  const nuevos = { plata925: redondear(plata925) };
  Object.keys(LEYES).forEach(k => { nuevos[k] = redondear(oroGramo * LEYES[k]); });

  const { fuente, CONFIG } = leerConfigActual();
  const antes = CONFIG.precios || {};

  // Salto brusco: se para y se avisa, en vez de publicar un disparate
  for (const k of Object.keys(nuevos)) {
    const viejo = antes[k];
    if (typeof viejo === 'number' && viejo > 0) {
      const salto = Math.abs(nuevos[k] - viejo) / viejo;
      if (salto > SALTO_MAXIMO) {
        throw new Error(
          'La cotización de ' + k + ' salta un ' + (salto * 100).toFixed(1) + '% ' +
          '(' + viejo + ' -> ' + nuevos[k] + '). No se escribe nada. ' +
          'Si el movimiento es real, actualiza CONFIG a mano.');
      }
    }
  }

  // ¿Merece la pena el commit?
  const cambiaAlgo = Object.keys(nuevos).some(k => nuevos[k] !== antes[k]);
  if (!cambiaAlgo) {
    console.log('La cotización no ha variado. No se toca nada.');
    return 0;
  }

  const hoy = new Date();
  const fecha = String(hoy.getDate()).padStart(2, '0') + '/' +
                String(hoy.getMonth() + 1).padStart(2, '0') + '/' + hoy.getFullYear();

  // Se reescribe el bloque entero en vez de parchear línea a línea. La
  // primera versión iba clave por clave con una expresión regular que exigía
  // coma final, y plata925 —la última, sin coma— se quedaba sin actualizar
  // en silencio. Generar el bloque completo evita esa clase de fallo y
  // mantiene la alineación y los comentarios siempre coherentes.
  const ORDEN = [
    ['oro24',    '999'],
    ['oro22',    '916'],
    ['oro18',    '750'],
    ['oro14',    '585'],
    ['oro9',     '375'],
    ['plata925', 'plata de ley'],
  ];
  const lineas = ORDEN.map(([k, ley], i) => {
    const coma = i < ORDEN.length - 1 ? ',' : ' ';
    return '    ' + (k + ':').padEnd(10, ' ')
         + nuevos[k].toFixed(2).padStart(7, ' ') + coma
         + '   // ' + ley;
  }).join('\n');

  const bloque = '  precios: {\n' + lineas + '\n  },';
  const reBloque = /  precios: \{[\s\S]*?\n  \},/;
  if (!reBloque.test(fuente)) {
    throw new Error('No encuentro el bloque precios en CONFIG: ¿ha cambiado el formato?');
  }

  let salida = fuente.replace(reBloque, bloque);
  salida = salida.replace(/(fechaPrecios:\s*')[^']*(')/, '$1' + fecha + '$2');
  if (salida === fuente) throw new Error('No he podido escribir en CONFIG');

  fs.writeFileSync(MAIN, salida);

  // Releer y comprobar clave por clave. Un fallo parcial silencioso es
  // peor que un fallo ruidoso: publicaría precios a medio actualizar.
  const comprobacion = leerConfigActual().CONFIG;
  for (const k of Object.keys(nuevos)) {
    if (comprobacion.precios[k] !== nuevos[k]) {
      throw new Error('No se escribió ' + k + ': esperaba ' + nuevos[k] +
                      ' y quedó ' + comprobacion.precios[k]);
    }
  }
  if (comprobacion.fechaPrecios !== fecha) {
    throw new Error('No se escribió la fecha');
  }

  console.log('Cotización del ' + fecha + ' (1 $ = ' + usdEur + ' €):');
  Object.keys(nuevos).forEach(k => {
    const v = antes[k];
    console.log('  ' + k.padEnd(9) + (typeof v === 'number' ? v.toFixed(2) + ' -> ' : '') + nuevos[k].toFixed(2) + ' €/g');
  });
  return 1;
}

principal().then(
  n => process.exit(0),
  e => { console.error('ERROR: ' + e.message); process.exit(1); }
);
