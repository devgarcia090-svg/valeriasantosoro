/* ==========================================================================
   Valeria Santos Oro — main.js

   TODO LO QUE HAY QUE TOCAR ESTÁ EN EL BLOQUE CONFIG DE AQUÍ ABAJO.
   Se cambian esos valores, se sube el archivo y se actualiza toda la web:
   teléfono, WhatsApp, email, dirección, mapa y precios por gramo.

   El resto del archivo no hace falta tocarlo.
   ========================================================================== */

var CONFIG = {

  /* --- Contacto -------------------------------------------------------- */

  // Teléfono general, el que sale en cabecera, pie y botones de llamada.
  telefono: '+34 691 932 411',

  // Número de WhatsApp con prefijo de país. Puede llevar espacios: se limpian.
  // Si se deja vacío, los botones de WhatsApp se ocultan.
  whatsapp: '+34 691 932 411',

  // La clienta no tiene correo. Vacío = los enlaces de email desaparecen
  // solos de la web.
  //
  // OJO: el aviso legal sí necesita uno. El artículo 10 de la LSSI
  // (Ley 34/2002) exige publicar "su dirección de correo electrónico" del
  // titular del sitio, y la política de privacidad necesita un canal para
  // ejercer los derechos de protección de datos. Con el dominio contratado
  // sale gratis crear info@valeriasantosoro.com; hay que hacerlo antes de
  // publicar.
  email: '',

  /* --- Sedes -----------------------------------------------------------
     Una entrada por tienda, en el mismo orden que los bloques
     data-sede="0", data-sede="1"... del index.html. Para añadir una
     tercera tienda: copiar un bloque .tienda en el HTML con
     data-sede="2" y añadir aquí su objeto.

     mapa: los dos que hay puestos usan coordenadas, que no necesitan clave
     de API: cambiando el par lat,lng de la URL se mueve el pin. Si se
     prefiere la URL oficial: Google Maps > buscar la tienda > Compartir >
     "Insertar un mapa" > copiar solo el valor del src="...". Si se deja
     vacío, esa sede se muestra sin mapa y a una sola columna, en vez de
     con un recuadro roto. */

  sedes: [
    {
      nombre: 'Los Alcázares',
      // Dirección y horario tomados de la ficha de Google del negocio.
      direccion: 'Av. de la Libertad, 50 · 30710 Los Alcázares, Murcia',
      telefono: '+34 691 932 411',
      mapa: 'https://maps.google.com/maps?q=37.7410142,-0.8511023&z=17&hl=es&output=embed',
      comoLlegar: 'https://www.google.com/maps/dir/?api=1&destination=37.7410142%2C-0.8511023',
      pagina: 'compro-oro-los-alcazares.html',
      foto: 'assets/img/tienda-alcazares.jpg',
      fotoAlt: 'Fachada de la tienda de Valeria Santos Oro en Los Alcázares',
      horario: [
        ['Lunes a viernes', '10:00 – 14:00'],
        ['Sábados',         'Cerrado'],
        ['Domingos',        'Cerrado']
      ]
    },
    {
      nombre: 'Pilar de la Horadada',
      direccion: 'C/ Calvo Sotelo, 4, local 2 · 03190 Pilar de la Horadada, Alicante',
      telefono: '+34 691 932 411',
      // PENDIENTE: este horario sigue siendo el de plantilla, sin confirmar.
      mapa: 'https://maps.google.com/maps?q=37.8630323,-0.7899997&z=17&hl=es&output=embed',
      comoLlegar: 'https://www.google.com/maps/dir/?api=1&destination=37.8630323%2C-0.7899997',
      pagina: 'compro-oro-pilar-de-la-horadada.html',
      foto: '',            // PENDIENTE: falta una foto de esta tienda
      fotoAlt: '',
      horario: [
        ['Lunes a viernes', '10:00 – 14:00 / 17:00 – 20:00'],
        ['Sábados',         '10:00 – 14:00'],
        ['Domingos',        'Cerrado']
      ]
    }
  ],

  // Redes sociales del pie. Poner en '' la que no se use y desaparece.
  redes: {
    Instagram: 'https://www.instagram.com/valeriasantosoro/',
    TikTok:    'https://www.tiktok.com/@valeriasantosoro',
    Facebook:  'https://www.facebook.com/valeriasantosoro'
  },

  /* --- Cotización del oro, en €/gramo ------------------------------------
     OJO: esto NO es lo que se paga en tienda. Es el valor de mercado del
     metal puro contenido en un gramo de cada ley, y así lo dice el tablón.
     El precio real de compra lo fija Valeria tras comprobar la pureza y
     pesar la pieza, y siempre es menor.

     Cómo actualizarla: basta con cambiar `oro24` y recalcular el resto
     multiplicando por la ley (0,916 · 0,750 · 0,585 · 0,375). La plata va
     aparte. Conviene repasarla al menos una vez por semana: si el tablón
     se queda viejo, resta más credibilidad de la que suma.

     Números con punto decimal (120.52), no coma: la coma la pone la web.
     Un valor null sale como "Consultar".

     Última toma: 12/09/2026, oro 24 kt a 120,52 €/g, contrastado entre
     livepriceofgold.com y goldpricedata.com.                            */

  precios: {
    oro24:     122.73,   // 999
    oro22:     112.53,   // 916
    oro18:      92.14,   // 750
    oro14:      71.87,   // 585
    oro9:       46.07,   // 375
    plata925:    1.72    // plata de ley
  },

  // Fecha de la última actualización, como se quiere que se lea.
  // Vacío = no se muestra la línea "Actualizado el ...".
  fechaPrecios: '19/09/2026',

  /* --- Textos del WhatsApp --------------------------------------------- */

  // Encabezado del mensaje que se abre desde los botones de WhatsApp.
  saludoWhatsapp: 'Hola, me gustaría pedir una tasación orientativa.'

};

/* ==========================================================================
   A partir de aquí no hace falta tocar nada.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------- Utilidades -- */

  // Deja solo dígitos y el + inicial, para href="tel:"
  function paraTel(valor) {
    var limpio = String(valor || '').replace(/[^\d+]/g, '');
    return limpio.replace(/(?!^)\+/g, '');
  }

  // wa.me solo admite dígitos, sin + ni espacios
  function paraWhatsapp(valor) {
    return String(valor || '').replace(/\D/g, '');
  }

  // 62.4 -> "62,40 €/g"
  function formatoPrecio(valor) {
    if (typeof valor !== 'number' || !isFinite(valor)) return 'Consultar';
    return valor.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' €/g';
  }

  function cada(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  /* ------------------------------------------------- Volcado de los datos -- */

  // Valores que puede pedir un data-dato="..." del HTML
  function tablaDeDatos() {
    var t = {
      telefono:     CONFIG.telefono,
      email:        CONFIG.email,
      fechaPrecios: CONFIG.fechaPrecios
    };
    var precios = CONFIG.precios || {};
    Object.keys(precios).forEach(function (clave) {
      t[clave] = formatoPrecio(precios[clave]);
    });
    return t;
  }

  function volcarDatos() {
    var datos = tablaDeDatos();

    cada('[data-dato]', function (el) {
      var clave = el.getAttribute('data-dato');
      if (!(clave in datos)) return;

      var valor = datos[clave];

      // fechaPrecios vacía: se oculta la línea entera en vez de dejar
      // "Actualizado el" a medias.
      if (clave === 'fechaPrecios') {
        if (valor) {
          el.textContent = 'Actualizado el ' + valor;
        } else {
          el.hidden = true;
        }
        return;
      }

      if (valor) el.textContent = valor;
    });
  }

  function volcarEnlaces() {
    var tel = paraTel(CONFIG.telefono);
    var wa  = paraWhatsapp(CONFIG.whatsapp);

    cada('[data-enlace="telefono"]', function (el) {
      if (tel) el.setAttribute('href', 'tel:' + tel);
    });

    cada('[data-enlace="email"]', function (el) {
      if (CONFIG.email) {
        el.setAttribute('href', 'mailto:' + CONFIG.email);
        return;
      }
      // Sin correo configurado: fuera el enlace, y si vivía solo dentro de
      // un <li> del pie, fuera el <li> entero para no dejar una viñeta suelta.
      var li = el.closest ? el.closest('li') : null;
      if (li && li.children.length === 1) {
        if (li.parentNode) li.parentNode.removeChild(li);
      } else if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    cada('[data-enlace="whatsapp"]', function (el) {
      if (wa) {
        el.setAttribute('href', enlaceWhatsapp(CONFIG.saludoWhatsapp));
      } else {
        // Sin número configurado el botón no lleva a ningún sitio: fuera.
        if (el.parentNode) el.parentNode.removeChild(el);
      }
    });
  }

  function enlaceWhatsapp(mensaje) {
    var wa = paraWhatsapp(CONFIG.whatsapp);
    if (!wa) return '';
    return 'https://wa.me/' + wa + '?text=' + encodeURIComponent(mensaje || '');
  }


  /* ------------------------------------------------ Abierto / cerrado ------
     Lee los horarios de CONFIG.sedes tal y como están escritos y decide si
     la tienda está abierta ahora mismo. Se usa la hora de Madrid, no la del
     visitante, para que sea correcto desde cualquier país.

     Si algún horario no se puede interpretar (porque se ha escrito de otra
     manera), la sede simplemente no muestra el chip. Nunca inventa.       */

  var DIAS = { domingo:0, lunes:1, martes:2, miercoles:3, jueves:4, viernes:5, sabado:6 };
  var NOMBRE_DIA = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

  function sinTildes(t) {
    return String(t).normalize ? String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                               : String(t);
  }

  // "Lunes a viernes" -> [1,2,3,4,5]   |   "Sábados" -> [6]
  function diasDeEtiqueta(etiqueta) {
    var t = sinTildes(etiqueta).toLowerCase();
    var re = /(domingo|lunes|martes|miercoles|jueves|viernes|sabado)/g;
    var hallados = [], m;
    while ((m = re.exec(t)) !== null) hallados.push(DIAS[m[1]]);
    if (!hallados.length) return null;

    if (hallados.length >= 2 && /\sa\s|-|–|—/.test(t)) {
      var d = hallados[0], fin = hallados[hallados.length - 1], salida = [];
      for (var i = 0; i < 8; i++) {
        salida.push(d);
        if (d === fin) break;
        d = (d + 1) % 7;
      }
      return salida;
    }
    return hallados;
  }

  // "10:00 – 14:00 / 17:00 – 20:00" -> [[600,840],[1020,1200]]  |  "Cerrado" -> []
  function tramosDeTexto(texto) {
    if (/cerrad/i.test(sinTildes(texto).toLowerCase())) return [];
    var re = /(\d{1,2})[:.](\d{2})\s*(?:-|–|—|a)\s*(\d{1,2})[:.](\d{2})/g;
    var tramos = [], m;
    while ((m = re.exec(texto)) !== null) {
      tramos.push([ (+m[1]) * 60 + (+m[2]), (+m[3]) * 60 + (+m[4]) ]);
    }
    return tramos;
  }

  function ahoraEnMadrid() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Madrid', weekday: 'short',
        hour: '2-digit', minute: '2-digit', hour12: false
      });
      var partes = {};
      f.formatToParts(new Date()).forEach(function (p) { partes[p.type] = p.value; });
      var mapa = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
      if (!(partes.weekday in mapa)) return null;
      return { dia: mapa[partes.weekday], minuto: (+partes.hour) * 60 + (+partes.minute) };
    } catch (e) {
      return null;   // navegador sin soporte de zonas horarias: no se muestra nada
    }
  }

  function hhmm(minutos) {
    var h = Math.floor(minutos / 60), m = minutos % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  function estadoDeSede(sede) {
    var reloj = ahoraEnMadrid();
    if (!reloj || !sede.horario || !sede.horario.length) return null;

    var porDia = {}, algunTramo = false, algunDia = false;

    sede.horario.forEach(function (fila) {
      var dias = diasDeEtiqueta(fila[0]);
      if (!dias) return;
      algunDia = true;
      var tramos = tramosDeTexto(fila[1]);
      if (tramos.length) algunTramo = true;
      dias.forEach(function (d) { porDia[d] = (porDia[d] || []).concat(tramos); });
    });

    if (!algunDia || !algunTramo) return null;   // no se ha entendido el horario

    var hoy = porDia[reloj.dia] || [];
    for (var i = 0; i < hoy.length; i++) {
      if (reloj.minuto >= hoy[i][0] && reloj.minuto < hoy[i][1]) {
        return { abierto: true, texto: 'Abierto · cierra a las ' + hhmm(hoy[i][1]) };
      }
    }

    // Siguiente apertura: lo que quede de hoy y después hasta siete días
    for (var j = 0; j < hoy.length; j++) {
      if (hoy[j][0] > reloj.minuto) {
        return { abierto: false, texto: 'Cerrado · abre a las ' + hhmm(hoy[j][0]) };
      }
    }
    for (var k = 1; k <= 7; k++) {
      var d = (reloj.dia + k) % 7;
      var tramos = porDia[d] || [];
      if (!tramos.length) continue;
      var cuando = k === 1 ? 'mañana' : 'el ' + NOMBRE_DIA[d];
      return { abierto: false, texto: 'Cerrado · abre ' + cuando + ' a las ' + hhmm(tramos[0][0]) };
    }

    return { abierto: false, texto: 'Cerrado' };
  }

  function pintarEstado(bloque, sede) {
    var chip = bloque.querySelector('[data-sede-estado]');
    if (!chip) return;

    var estado = estadoDeSede(sede);
    if (!estado) { chip.hidden = true; return; }

    var texto = chip.querySelector('b');
    if (texto) texto.textContent = estado.texto;
    chip.classList.toggle('estado--abierto', estado.abierto);
    chip.hidden = false;
  }

  function volcarSedes() {
    var sedes = CONFIG.sedes || [];

    cada('[data-sede]', function (bloque) {
      var sede = sedes[Number(bloque.getAttribute('data-sede'))];

      // Bloque de HTML sin sede en CONFIG: se quita entero en vez de
      // dejar la tienda de ejemplo publicada.
      if (!sede) {
        if (bloque.parentNode) bloque.parentNode.removeChild(bloque);
        return;
      }

      Array.prototype.forEach.call(
        bloque.querySelectorAll('[data-sede-campo]'),
        function (el) {
          var valor = sede[el.getAttribute('data-sede-campo')];
          if (valor) el.textContent = valor;
          else if (el.getAttribute('data-sede-campo') === 'direccion') el.hidden = true;
        }
      );

      Array.prototype.forEach.call(
        bloque.querySelectorAll('[data-sede-enlace="telefono"]'),
        function (el) {
          var tel = paraTel(sede.telefono || CONFIG.telefono);
          if (tel) el.setAttribute('href', 'tel:' + tel);
        }
      );

      var horario = bloque.querySelector('[data-sede-horario]');
      if (horario && sede.horario && sede.horario.length) {
        horario.innerHTML = '';
        sede.horario.forEach(function (fila) {
          var li = document.createElement('li');
          var dia = document.createElement('span');
          var hora = document.createElement('span');
          dia.textContent = fila[0];
          hora.textContent = fila[1];
          li.appendChild(dia);
          li.appendChild(hora);
          horario.appendChild(li);
        });
      }

      Array.prototype.forEach.call(
        bloque.querySelectorAll('[data-sede-enlace="comollegar"]'),
        function (el) {
          if (sede.comoLlegar) el.setAttribute('href', sede.comoLlegar);
          else if (el.parentNode) el.parentNode.removeChild(el);   // sin enlace, fuera el botón
        }
      );

      Array.prototype.forEach.call(
        bloque.querySelectorAll('[data-sede-enlace="pagina"]'),
        function (el) {
          if (sede.pagina) el.setAttribute('href', sede.pagina);
          else if (el.parentNode) el.parentNode.removeChild(el);
        }
      );

      var caja = bloque.querySelector('[data-sede-foto]');
      if (caja) {
        var img = caja.querySelector('img');
        if (sede.foto && img) {
          img.setAttribute('src', sede.foto);
          img.setAttribute('alt', sede.fotoAlt || '');
          caja.hidden = false;
        } else if (caja.parentNode) {
          caja.parentNode.removeChild(caja);   // sede sin foto: solo mapa
        }
      }

      pintarEstado(bloque, sede);

      var iframe = bloque.querySelector('[data-sede-mapa]');
      if (!iframe) return;

      if (sede.mapa) {
        iframe.setAttribute('src', sede.mapa);
        iframe.setAttribute('title', 'Mapa de la tienda de ' + (sede.nombre || ''));
      } else {
        // Sin URL de mapa: se quita el recuadro y la sede pasa a una columna.
        bloque.classList.add('tienda--sin-mapa');
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }
    });
  }

  function volcarRedes() {
    var lista = document.querySelector('[data-redes]');
    if (!lista) return;

    var redes = CONFIG.redes || {};
    var hay = false;

    Array.prototype.forEach.call(lista.querySelectorAll('li'), function (li) {
      var enlace = li.querySelector('a');
      if (!enlace) return;
      var url = redes[enlace.textContent.trim()];
      if (url) { enlace.setAttribute('href', url); hay = true; }
      else if (li.parentNode) li.parentNode.removeChild(li);
    });

    if (!hay && lista.parentNode) lista.parentNode.removeChild(lista);
  }

  function volcarAnio() {
    var anio = String(new Date().getFullYear());
    cada('[data-anio]', function (el) { el.textContent = anio; });
  }

  /* ------------------------------------------ Formulario -> WhatsApp ------ */

  function contenedorDeCampo(campo) {
    if (campo.type === 'checkbox') {
      return campo.closest ? campo.closest('.consentimiento') : null;
    }
    return campo.closest ? campo.closest('.campo') : null;
  }

  function limpiarError(campo) {
    var caja = contenedorDeCampo(campo);
    campo.removeAttribute('aria-invalid');
    if (!caja) return;
    caja.classList.remove('campo--error');
    var aviso = caja.querySelector('.campo__error');
    if (aviso) caja.removeChild(aviso);
  }

  function marcarError(campo, texto) {
    var caja = contenedorDeCampo(campo);
    campo.setAttribute('aria-invalid', 'true');
    if (!caja || caja.querySelector('.campo__error')) return;
    caja.classList.add('campo--error');
    var aviso = document.createElement('span');
    aviso.className = 'campo__error';
    aviso.textContent = texto;
    caja.appendChild(aviso);
  }

  function montarFormulario() {
    var form = document.getElementById('formulario-tasacion');
    if (!form) return;

    var nombre       = form.querySelector('#nombre');
    var telefono     = form.querySelector('#telefono');
    var pieza        = form.querySelector('#pieza');
    var peso         = form.querySelector('#peso');
    var detalle      = form.querySelector('#detalle');
    var consentiment = form.querySelector('.consentimiento input[type="checkbox"]');

    // Sin número de WhatsApp el formulario no puede hacer su trabajo.
    if (!paraWhatsapp(CONFIG.whatsapp)) {
      var boton = form.querySelector('button[type="submit"]');
      if (boton) {
        boton.disabled = true;
        boton.textContent = 'WhatsApp sin configurar';
      }
      return;
    }

    // El error se quita en cuanto el usuario corrige
    [nombre, telefono, consentiment].forEach(function (campo) {
      if (!campo) return;
      campo.addEventListener('input', function () { limpiarError(campo); });
      campo.addEventListener('change', function () { limpiarError(campo); });
    });

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();

      var fallos = [];

      if (nombre && !nombre.value.trim()) {
        marcarError(nombre, 'Dinos cómo te llamas.');
        fallos.push(nombre);
      }

      if (telefono) {
        var digitos = telefono.value.replace(/\D/g, '');
        if (digitos.length < 9) {
          marcarError(telefono, 'Escribe un teléfono de contacto válido.');
          fallos.push(telefono);
        }
      }

      if (consentiment && !consentiment.checked) {
        marcarError(consentiment, 'Necesitamos que aceptes la política de privacidad.');
        fallos.push(consentiment);
      }

      if (fallos.length) {
        fallos[0].focus();
        return;
      }

      window.open(enlaceWhatsapp(mensajeDeTasacion({
        nombre:   nombre   ? nombre.value.trim()   : '',
        telefono: telefono ? telefono.value.trim() : '',
        pieza:    pieza    ? pieza.value           : '',
        peso:     peso     ? peso.value.trim()     : '',
        detalle:  detalle  ? detalle.value.trim()  : ''
      })), '_blank', 'noopener');
    });
  }

  function mensajeDeTasacion(d) {
    var lineas = [CONFIG.saludoWhatsapp, ''];

    if (d.nombre)   lineas.push('Nombre: ' + d.nombre);
    if (d.telefono) lineas.push('Teléfono: ' + d.telefono);
    if (d.pieza)    lineas.push('Qué quiero tasar: ' + d.pieza);
    if (d.peso)     lineas.push('Peso aproximado: ' + d.peso + ' g');
    if (d.detalle)  lineas.push('Detalle: ' + d.detalle);

    lineas.push('');
    lineas.push('(Mensaje enviado desde la web)');

    return lineas.join('\n');
  }

  /* ------------------------------------------------------------- Arranque -- */

  /* ================================================================ MOVIMIENTO ==
     Todo lo de aquí abajo es decorativo. Si falla, o si el usuario tiene
     activado "reducir movimiento", la web se ve entera y quieta: el estado
     previo de las animaciones solo se aplica cuando añadimos .anim al <html>.
     ============================================================================ */

  var CURVA = 'cubic-bezier(.22,.61,.36,1)';

  function quiereMenosMovimiento() {
    return window.matchMedia &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Entradas escalonadas al entrar en pantalla
  function montarEntradas() {
    var piezas = document.querySelectorAll('[data-anim]');
    if (!piezas.length) return;

    // Escalonado: a los hermanos del mismo bloque se les va retrasando
    var porPadre = {};
    Array.prototype.forEach.call(piezas, function (el) {
      var padre = el.parentNode;
      var clave = padre.getAttribute('data-grupo');
      if (!clave) {
        clave = 'g' + Object.keys(porPadre).length;
        padre.setAttribute('data-grupo', clave);
      }
      porPadre[clave] = (porPadre[clave] || 0);
      el.style.setProperty('--retardo', Math.min(porPadre[clave] * 80, 400) + 'ms');
      porPadre[clave]++;
    });

    var pendientes = Array.prototype.slice.call(piezas);

    function revelar(el) {
      el.classList.add('visible');
      var i = pendientes.indexOf(el);
      if (i !== -1) pendientes.splice(i, 1);
      if (!pendientes.length) desmontar();
    }

    function revelarTodo() {
      pendientes.slice().forEach(revelar);
    }

    // Respaldo por geometría: hace el mismo trabajo que el observer pero
    // midiendo a mano. Si el IntersectionObserver falla o no existe, esto
    // mantiene la web usable en vez de dejar el contenido invisible.
    function barrer() {
      var alto = window.innerHeight || document.documentElement.clientHeight;
      pendientes.slice().forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < alto * 0.92 && r.bottom > -40) revelar(el);
      });
    }

    var pedido = false;
    function alMover() {
      if (pedido) return;
      pedido = true;
      window.requestAnimationFrame(function () { pedido = false; barrer(); });
    }

    var vigia = null;
    var seguro = null;

    function desmontar() {
      window.removeEventListener('scroll', alMover);
      window.removeEventListener('resize', alMover);
      if (vigia) { vigia.disconnect(); vigia = null; }
      if (seguro) { window.clearTimeout(seguro); seguro = null; }
    }

    if ('IntersectionObserver' in window) {
      vigia = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          if (vigia) vigia.unobserve(e.target);
          revelar(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

      Array.prototype.forEach.call(piezas, function (el) { vigia.observe(el); });
    }

    window.addEventListener('scroll', alMover, { passive: true });
    window.addEventListener('resize', alMover);
    barrer();

    // Último seguro: pase lo que pase, a los 8 segundos no queda nada oculto.
    // Una animación que no se ve es un detalle; un texto que no se ve es un fallo.
    seguro = window.setTimeout(revelarTodo, 8000);
  }

  // La cabecera se encoge en cuanto se baja un poco
  function montarCabecera() {
    var cabecera = document.querySelector('.cabecera');
    if (!cabecera) return;
    var pedido = false;

    function revisar() {
      pedido = false;
      cabecera.classList.toggle('cabecera--reducida', window.pageYOffset > 40);
    }

    window.addEventListener('scroll', function () {
      if (pedido) return;
      pedido = true;
      window.requestAnimationFrame(revisar);
    }, { passive: true });

    revisar();
  }

  // Las cifras del tablón suben desde cero la primera vez que se ven
  function montarContadorDePrecios() {
    var tablon = document.querySelector('.tablon');
    if (!tablon || !('IntersectionObserver' in window)) return;

    var precios = CONFIG.precios || {};
    var celdas = [];

    cada('.tablon__precio[data-dato]', function (el) {
      var valor = precios[el.getAttribute('data-dato')];
      if (typeof valor === 'number' && isFinite(valor)) celdas.push({ el: el, fin: valor });
    });

    if (!celdas.length) return;   // con los precios en null no hay nada que contar

    celdas.forEach(function (c) { c.el.textContent = formatoPrecio(0); });

    var vigia = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      vigia.disconnect();
      celdas.forEach(function (c, i) { contar(c, 120 + i * 90); });
    }, { threshold: 0.3 });

    vigia.observe(tablon);
  }

  function contar(celda, espera) {
    var DURACION = 820;
    window.setTimeout(function () {
      var inicio = null;
      function paso(ahora) {
        if (inicio === null) inicio = ahora;
        var t = Math.min((ahora - inicio) / DURACION, 1);
        var suave = 1 - Math.pow(1 - t, 3);          // easeOutCubic
        celda.el.textContent = formatoPrecio(celda.fin * suave);
        if (t < 1) window.requestAnimationFrame(paso);
        else celda.el.textContent = formatoPrecio(celda.fin);
      }
      window.requestAnimationFrame(paso);
    }, espera);
  }

  // <details> no anima solo: medimos el alto real y lo desplegamos
  function montarPreguntas() {
    cada('.preguntas details', function (det) {
      var cuerpo = det.querySelector('p');
      if (!cuerpo) return;

      det.addEventListener('toggle', function () {
        if (!det.open) return;
        var alto = cuerpo.scrollHeight;
        cuerpo.style.height = '0px';
        cuerpo.style.opacity = '0';
        cuerpo.getBoundingClientRect();               // fuerza el reflujo
        cuerpo.style.transition = 'height .34s ' + CURVA + ', opacity .3s ' + CURVA;
        cuerpo.style.height = alto + 'px';
        cuerpo.style.opacity = '1';
        window.setTimeout(function () {
          cuerpo.style.height = '';
          cuerpo.style.opacity = '';
          cuerpo.style.transition = '';
        }, 400);
      });
    });
  }



  /* -------------------------------------------------------- Calculadora ----
     Peso x cotización. No inventa nada: si la ley elegida no tiene precio en
     CONFIG, dice "Consultar" en vez de dar una cifra.                      */

  function formatoEuros(valor) {
    return valor.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' €';
  }

  function montarCalculadora() {
    var caja  = document.querySelector('.calculadora');
    if (!caja) return;

    var peso  = document.getElementById('calc-peso');
    var ley   = document.getElementById('calc-ley');
    var cifra = caja.querySelector('[data-calc-cifra]');
    var fecha = caja.querySelector('[data-calc-fecha]');
    if (!peso || !ley || !cifra) return;

    if (fecha) {
      if (CONFIG.fechaPrecios) fecha.textContent = CONFIG.fechaPrecios;
      else if (fecha.parentNode) fecha.parentNode.removeChild(fecha);
    }

    function calcular() {
      var gramos = parseFloat(String(peso.value).replace(',', '.'));
      var precio = (CONFIG.precios || {})[ley.value];

      if (typeof precio !== 'number' || !isFinite(precio)) {
        cifra.textContent = 'Consultar';
        return;
      }
      if (!isFinite(gramos) || gramos <= 0) {
        cifra.textContent = '—';
        return;
      }
      cifra.textContent = formatoEuros(gramos * precio);
    }

    peso.addEventListener('input', calcular);
    ley.addEventListener('change', calcular);

    // Los ejemplos rellenan la calculadora
    cada('.ejemplo[data-peso]', function (boton) {
      boton.addEventListener('click', function () {
        peso.value = boton.getAttribute('data-peso');
        ley.value  = boton.getAttribute('data-ley');
        calcular();

        cada('.ejemplo--cargado', function (otro) { otro.classList.remove('ejemplo--cargado'); });
        boton.classList.add('ejemplo--cargado');

        caja.scrollIntoView({ behavior: quiereMenosMovimiento() ? 'auto' : 'smooth', block: 'center' });
      });
    });

    calcular();
  }

  /* ------------------------------------------------------ Menú de móvil ----
     Va aparte del bloque de movimiento a propósito: las animaciones se
     desactivan con `prefers-reduced-motion`, pero poder abrir el menú no es
     un adorno. Esto tiene que funcionar siempre.                          */

  function montarMenu() {
    var boton = document.querySelector('.menu-boton');
    var menu  = document.getElementById('menu-principal');
    if (!boton || !menu) return;

    function abierto() {
      return boton.getAttribute('aria-expanded') === 'true';
    }

    function poner(estado) {
      boton.setAttribute('aria-expanded', estado ? 'true' : 'false');
      menu.classList.toggle('menu--abierto', estado);
    }

    boton.addEventListener('click', function () { poner(!abierto()); });

    // Al elegir destino, se cierra
    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { poner(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !abierto()) return;
      poner(false);
      boton.focus();
    });

    // Tocar fuera del menú también lo cierra
    document.addEventListener('click', function (e) {
      if (!abierto()) return;
      if (menu.contains(e.target) || boton.contains(e.target)) return;
      poner(false);
    });

    // Al pasar a escritorio el desplegable no pinta nada: se reinicia
    var ancho = window.matchMedia('(min-width: 901px)');
    function alCambiar() { if (ancho.matches) poner(false); }
    if (ancho.addEventListener) ancho.addEventListener('change', alCambiar);
    else if (ancho.addListener) ancho.addListener(alCambiar);

    poner(false);
  }

  function montarMovimiento() {
    if (quiereMenosMovimiento()) return;
    document.documentElement.classList.add('anim');
    montarEntradas();
    montarCabecera();
    montarContadorDePrecios();
    montarPreguntas();
  }

  /* ------------------------------------------------------------- Arranque -- */

  function arrancar() {
    volcarDatos();
    volcarEnlaces();
    volcarSedes();
    volcarRedes();
    volcarAnio();
    montarFormulario();
    montarCalculadora();
    montarMenu();
    montarMovimiento();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }

})();
