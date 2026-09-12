#!/usr/bin/env node
/* ==========================================================================
   Vuelca CONFIG al HTML estático.

   POR QUÉ EXISTE ESTO
   La web toma sus datos del bloque CONFIG de main.js y los escribe en la
   página al cargar. Eso está bien para el visitante, pero los rastreadores
   de las IA (GPTBot, ClaudeBot, PerplexityBot...) NO ejecutan JavaScript:
   leían el HTML en crudo y veían "+34 000 000 000" y "Calle de ejemplo".
   Es decir, la web era invisible para ellos justo en lo que importa.

   Este script escribe los valores reales dentro del HTML. CONFIG sigue
   siendo la única fuente de verdad; el HTML es su reflejo.

   CUÁNDO EJECUTARLO
   Siempre que se toque CONFIG (precios, horarios, teléfono, sedes):

       node herramientas/sincronizar.js

   Y confirmar el resultado junto al cambio de CONFIG.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const PUBLICO = path.join(RAIZ, 'public');

/* ------------------------------------------------ Leer CONFIG de main.js --
   No se puede requerir main.js: al final se ejecuta solo y toca `document`,
   que en Node no existe. Se recorta el bloque CONFIG y se evalúa aparte.   */

function leerConfig() {
  const fuente = fs.readFileSync(path.join(PUBLICO, 'assets/js/main.js'), 'utf8');
  const desde = fuente.indexOf('var CONFIG = {');
  const hasta = fuente.indexOf('\n};', desde);
  if (desde === -1 || hasta === -1) {
    throw new Error('No encuentro el bloque CONFIG en main.js');
  }
  const bloque = fuente.slice(desde, hasta + 3);
  return new Function(bloque + '\nreturn CONFIG;')();
}

/* ------------------------------------------------------------ Utilidades -- */

const paraTel = v => String(v || '').replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
const paraWa  = v => String(v || '').replace(/\D/g, '');
const escapar = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const atrib   = t => escapar(t).replace(/"/g, '&quot;');

function precioTexto(v) {
  if (typeof v !== 'number' || !isFinite(v)) return 'Consultar';
  return v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €/g';
}

/* Sustituye el texto interior de los elementos con un data-* concreto. */
function ponerTexto(html, atributo, clave, valor) {
  const re = new RegExp(
    '(<(\\w+)[^>]*\\b' + atributo + '="' + clave + '"[^>]*>)([^<]*)(</\\2>)', 'g');
  return html.replace(re, (_, abre, etiqueta, __, cierra) => abre + escapar(valor) + cierra);
}

/* Sustituye un atributo dentro de los elementos marcados con un data-*. */
function ponerAtributo(html, marca, atributo, valor) {
  const re = new RegExp('<[^>]*\\b' + marca + '[^>]*>', 'g');
  return html.replace(re, etiqueta => {
    const yaEsta = new RegExp('\\b' + atributo + '="[^"]*"');
    if (yaEsta.test(etiqueta)) {
      return etiqueta.replace(yaEsta, atributo + '="' + atrib(valor) + '"');
    }
    return etiqueta.replace(/\/?>$/, m => ' ' + atributo + '="' + atrib(valor) + '"' + m);
  });
}

/* ------------------------------------------------------------- Proceso ---- */

function sincronizar(html, CONFIG) {
  const tel = paraTel(CONFIG.telefono);
  const wa  = paraWa(CONFIG.whatsapp);

  // Enlaces de teléfono y WhatsApp
  if (tel) html = html.replace(/href="tel:\+?[\d\s]*"/g, 'href="tel:' + tel + '"');
  if (wa) {
    const url = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(CONFIG.saludoWhatsapp || '');
    html = html.replace(/href="https:\/\/wa\.me\/[^"]*"/g, 'href="' + atrib(url) + '"');
  }

  // Textos sueltos: teléfono, fecha y cotización
  if (CONFIG.telefono) html = ponerTexto(html, 'data-dato', 'telefono', CONFIG.telefono);
  html = ponerTexto(html, 'data-dato', 'fechaPrecios',
                    CONFIG.fechaPrecios ? 'Actualizado el ' + CONFIG.fechaPrecios : '');
  Object.keys(CONFIG.precios || {}).forEach(k => {
    html = ponerTexto(html, 'data-dato', k, precioTexto(CONFIG.precios[k]));
  });

  // Sin correo, fuera las líneas que lo enseñan
  if (!CONFIG.email) {
    html = html.replace(/^[ \t]*<li>\s*<a[^>]*data-enlace="email"[\s\S]*?<\/li>\s*\n/gm, '');
    html = html.replace(/^[ \t]*<a[^>]*data-enlace="email"[\s\S]*?<\/a>\s*\n/gm, '');
  } else {
    html = ponerTexto(html, 'data-dato', 'email', CONFIG.email);
    html = html.replace(/href="mailto:[^"]*"/g, 'href="mailto:' + atrib(CONFIG.email) + '"');
  }

  // Cada bloque de sede, con sus propios datos
  const trozos = html.split(/(?=<div class="tienda"[^>]*data-sede="\d+")/);
  html = trozos.map(trozo => {
    const m = trozo.match(/^<div class="tienda"[^>]*data-sede="(\d+)"/);
    if (!m) return trozo;
    const sede = (CONFIG.sedes || [])[Number(m[1])];
    if (!sede) return trozo;

    let t = trozo;
    if (sede.nombre)    t = ponerTexto(t, 'data-sede-campo', 'nombre', sede.nombre);
    if (sede.direccion) t = ponerTexto(t, 'data-sede-campo', 'direccion', sede.direccion);
    if (sede.telefono) {
      t = ponerTexto(t, 'data-sede-campo', 'telefono', sede.telefono);
      t = t.replace(/href="tel:\+?[\d\s]*"/g, 'href="tel:' + paraTel(sede.telefono) + '"');
    }
    if (sede.comoLlegar) t = ponerAtributo(t, 'data-sede-enlace="comollegar"', 'href', sede.comoLlegar);
    if (sede.pagina)     t = ponerAtributo(t, 'data-sede-enlace="pagina"', 'href', sede.pagina);
    if (sede.mapa)       t = ponerAtributo(t, 'data-sede-mapa', 'src', sede.mapa);

    if (sede.horario && sede.horario.length) {
      const filas = sede.horario
        .map(f => '            <li><span>' + escapar(f[0]) + '</span><span>' + escapar(f[1]) + '</span></li>')
        .join('\n');
      t = t.replace(/(<ul class="horario" data-sede-horario>)[\s\S]*?(<\/ul>)/,
                    '$1\n' + filas + '\n          $2');
    }

    if (sede.foto) {
      t = t.replace(/(<div class="sede__foto foto" data-sede-foto)\s+hidden(>)/, '$1$2');
      t = t.replace(/(<div class="sede__foto foto" data-sede-foto>\s*<img)([^>]*)(>)/,
        (_, a, attrs, c) => a
          + attrs.replace(/\s*alt="[^"]*"/, '')
          + ' src="' + atrib(sede.foto) + '" alt="' + atrib(sede.fotoAlt || '') + '"' + c);
    }
    return t;
  }).join('');

  return html;
}


/* ==========================================================================
   PARA LOS BUSCADORES CON IA

   ChatGPT, Perplexity, Gemini y compañía leen el HTML en crudo y premian el
   contenido que pueden extraer sin ambigüedad. Dos cosas ayudan mucho:

   1. FAQPage en JSON-LD, generado a partir de los <details> de cada página.
      Se regenera aquí para que nunca se desvíe del texto visible: si alguien
      cambia una respuesta y no toca el JSON-LD, el dato estructurado miente.

   2. llms.txt en la raíz (convención de llmstxt.org): un resumen en texto
      plano del negocio y sus datos, que un modelo puede leer de una vez.
   ========================================================================== */

function preguntasDe(html) {
  const re = /<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g;
  const fuera = t => t.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const salida = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    salida.push({ pregunta: fuera(m[1]), respuesta: fuera(m[2]) });
  }
  return salida;
}

function ponerFaq(html) {
  const preguntas = preguntasDe(html);
  // Fuera el bloque anterior, lo haya o no
  html = html.replace(/\n?<script type="application\/ld\+json" data-faq>[\s\S]*?<\/script>/, '');
  if (!preguntas.length) return html;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map(p => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta }
    }))
  };
  const bloque = '\n<script type="application/ld+json" data-faq>\n'
               + JSON.stringify(ld, null, 2) + '\n</script>';
  return html.replace('</head>', bloque + '\n</head>');
}

function escribirLlmsTxt(CONFIG) {
  const sedes = (CONFIG.sedes || []).map(s => {
    const horas = (s.horario || []).map(f => '  - ' + f[0] + ': ' + f[1]).join('\n');
    return '### ' + s.nombre + '\n'
         + '- Dirección: ' + (s.direccion || 'por confirmar') + '\n'
         + '- Teléfono: ' + (s.telefono || CONFIG.telefono) + '\n'
         + (horas ? '- Horario:\n' + horas + '\n' : '')
         + (s.pagina ? '- Página: https://valeriasantosoro.com/' + s.pagina + '\n' : '');
  }).join('\n');

  const precios = Object.keys(CONFIG.precios || {}).map(k => {
    const v = CONFIG.precios[k];
    const nombres = { oro24:'Oro 24 kt (999)', oro22:'Oro 22 kt (916)', oro18:'Oro 18 kt (750)',
                      oro14:'Oro 14 kt (585)', oro9:'Oro 9 kt (375)', plata925:'Plata de ley (925)' };
    return '- ' + (nombres[k] || k) + ': '
         + (typeof v === 'number' ? v.toLocaleString('es-ES', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €/g' : 'consultar');
  }).join('\n');

  const texto = `# Valeria Santos Oro

> Compraventa de oro y plata con dos tiendas en la costa entre Murcia y
> Alicante. Tasación gratuita, pesaje a la vista del cliente en balanza
> homologada y pago en el momento.

## Qué hace el negocio

- Compra de joyas de oro, monedas de inversión, lingotes, plata de ley,
  cubertería, oro dental, relojes de alta gama y joyería con diamantes.
- Empeños: adelanto de dinero sobre la pieza, que queda en custodia.
- Venta de lingotes de inversión y arreglos de joyería.
- La tasación es gratuita y sin compromiso. Se exige DNI o NIE para vender,
  por la normativa de compraventa de metales preciosos.

## Tiendas

${sedes}
## Cotización del oro

Actualizada el ${CONFIG.fechaPrecios || 'sin fecha'}. **Es el valor de mercado
del metal puro por gramo, no el precio que paga la tienda.** El importe real se
fija tras comprobar la pureza y pesar cada pieza, y es menor.

${precios}

## Contacto

- Teléfono y WhatsApp: ${CONFIG.telefono}
- Instagram, TikTok y Facebook: @valeriasantosoro

## Páginas

- https://valeriasantosoro.com/ — portada, con el proceso de tasación completo,
  la calculadora de peso por ley y las preguntas frecuentes.
- https://valeriasantosoro.com/compro-oro-los-alcazares.html — tienda de Los Alcázares.
- https://valeriasantosoro.com/compro-oro-pilar-de-la-horadada.html — tienda de Pilar de la Horadada.
- https://valeriasantosoro.com/aviso-legal.html
- https://valeriasantosoro.com/privacidad.html
- https://valeriasantosoro.com/politica-cookies.html
`;
  fs.writeFileSync(path.join(PUBLICO, 'llms.txt'), texto);
  console.log('  generado     llms.txt');
}

/* ------------------------------------------------------------- Arranque --- */

const CONFIG = leerConfig();
const paginas = fs.readdirSync(PUBLICO).filter(f => f.endsWith('.html'));
let tocados = 0;

paginas.forEach(f => {
  const ruta = path.join(PUBLICO, f);
  const antes = fs.readFileSync(ruta, 'utf8');
  const despues = ponerFaq(sincronizar(antes, CONFIG));
  if (antes !== despues) {
    fs.writeFileSync(ruta, despues);
    tocados++;
    console.log('  actualizado  ' + f);
  } else {
    console.log('  sin cambios  ' + f);
  }
});

escribirLlmsTxt(CONFIG);

console.log('\n' + tocados + ' de ' + paginas.length + ' páginas actualizadas desde CONFIG.');
