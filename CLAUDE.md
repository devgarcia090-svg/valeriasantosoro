# valeriasantosoro.com

Web para un cliente de compraventa de oro y plata. La referencia que dio el cliente
es tuorovalemas.com, pero **sin tienda online**.

## Estado

Web estática a nivel de v2. No hay build, no hay dependencias, no hay framework.
Se edita el HTML/CSS a mano y se sube por FTP.

Datos reales ya puestos: teléfono y WhatsApp (691 932 411), redes sociales, las
dos sedes (Los Alcázares y Pilar de la Horadada) y sus dos mapas. Siguen
pendientes los precios, el número de portal de Los Alcázares, el email, las fotos
y los datos legales.

```
index.html               portada completa (una sola página larga)
aviso-legal.html         plantilla legal
privacidad.html          plantilla legal
politica-cookies.html    plantilla legal
assets/css/estilo.css    tokens de color y tipografía al principio del archivo
assets/js/main.js        bloque CONFIG + formulario que abre WhatsApp
assets/img/              fotos de relleno + logo.png
favicon.png              monograma VS sobre negro
robots.txt
sitemap.xml
compro-oro-los-alcazares.html
compro-oro-pilar-de-la-horadada.html
```

Todo lo publicable cuelga de `public/`. Ver la sección de despliegue.

Abrir `index.html` en el navegador es suficiente para ver cambios. No hace falta
servidor local salvo para probar el iframe del mapa.

## AVISO: qué viene de la clienta y qué no

**Valeria no ha dado ninguna instrucción de diseño.** Lo que las versiones
anteriores de este archivo presentaban como "decisiones tomadas con el cliente"
—la paleta, el rechazo del verde, el `border-radius: 2px`, el "nada de
degradados ni brillos"— es interpretación de quien montó la v1 y la v2, no un
encargo. Se documentó como si fuera cerrado y no lo estaba.

Lo único que viene de la clienta de verdad, comprobado, es:

- El monograma VS en oro sobre negro (de ahí sale la paleta de oro).
- Los datos de contacto, las dos sedes, el horario de Los Alcázares y las redes.
- Lo que anuncia en su Linktree y en el rótulo de la tienda: compra y venta de
  oro y plata, relojes de alta gama, joyería exclusiva, diamantes y **empeños**.

Todo lo demás son decisiones nuestras y se pueden cambiar sin pedir permiso.
El encargo real es sorprenderla. No trates lo de abajo como un contrato.

## Decisiones de diseño (nuestras, revisables)

**v3, registro oscuro.** La v2 era crema con una banda oscura y se veía floja:
demasiado aire, poco peso, y unas fotos de museo que no pegaban. Se invirtió.

- **Paleta**: negro cálido `#0e0b08`, carbón `#17120d`, carbón-2 `#201a13`,
  marfil `#f2ece0`, tenue `#9b8e7b`, línea `#2c241b`. El fondo es oscuro en
  TODA la web, no solo en una sección.
- **Oro**: `#ceb358` medio, `#ebc968` claro, `#9c8541` hondo. No son inventados:
  están muestreados del propio monograma VS de la clienta, para que la web haga
  juego con la marca. El `#a87f45` de la v2 era más bronce y desentonaba.
- **Tipografías**: se sirven **desde el propio dominio** (`public/assets/fuentes/`,
  cargadas por `public/assets/css/fuentes.css`), no desde Google. Antes salían de
  `fonts.googleapis.com`, lo que enviaba la IP de cada visitante a Google y
  obligaba a declararlo como destinatario en la política de privacidad. Ambas
  están bajo SIL Open Font License, que permite alojarlas. Solo se incluyen los
  subconjuntos latin y latin-ext. **Marcellus** para titulares (capital romana inscrita: el
  registro de la moneda acuñada y el punzón de contraste) y **Archivo** para
  texto. Se quitó Bodoni Moda: en titulares largos se quedaba flaca.
  Por eso el h1 también se acortó a dos frases.
- Hubo una v1 en verde joyería. La descartó la sesión anterior, no la clienta.
- **Registro**: joyería clásica y sobria. El oro se reserva para precios,
  botones y filetes; no se usa como relleno.
- **Esquinas**: paneles a `4px`, botones en píldora (`--radio-pildora`). El
  `2px` de la v2 contribuía a que la web pareciera rígida y sin vida.

### v3.4: calculadora, acciones y servicios del rótulo

- **Calculadora** en "Cuánto suele pesar cada pieza": peso × ley contra
  `CONFIG.precios`. Los seis ejemplos son botones y al pulsarlos la rellenan.
  Si la ley elegida no tiene precio en CONFIG, dice "Consultar"; nunca inventa.
- **Fuera los teléfonos en crudo.** El número suelto en negro sobre oro se veía
  barato en tres sitios (cabecera, ficha de tienda, formulario). Ahora todos
  usan la misma píldora con icono: `.tel-cabecera` y `.accion` comparten receta.
  En cada tienda hay además **"Cómo llegar"** (`CONFIG.sedes[].comoLlegar`, que
  abre Google Maps con la ruta) y en el formulario un botón de WhatsApp.
- **Foto de la tienda de Los Alcázares** (`CONFIG.sedes[].foto`), encima de su
  mapa. Es la fachada real que pasó el cliente. **Pilar de la Horadada no tiene
  foto**: su bloque se queda solo con el mapa, sin hueco vacío.
- **Sección "También en la tienda"**: lingotes de inversión, arreglos de joyería
  y dinero al instante. Salen del **rótulo lateral de la propia tienda**, que
  anuncia "EMPEÑOS · DIAMANTES · RELOJES / MÁXIMA TASACIÓN / SE COMPRA ORO Y
  PLATA / LINGOTES DE INVERSIÓN / DINERO AL INSTANTE / ARREGLOS DE JOYERÍA".
  Los textos son deliberadamente vagos ("pregúntanos por gramajes", "se
  presupuesta antes de tocar nada") porque **no se conocen los detalles**:
  confirmar con Valeria qué gramajes vende y qué arreglos hace.

  Ojo: que venda lingotes no contradice el "sin tienda online" del brief. Es
  venta en mostrador, no un catálogo con carrito.

### v3.3: cabecera de móvil

La v3.2 apilaba en móvil marca, rótulo "Tasación gratuita", píldora del teléfono
y una fila de menú desplazable: **unos 200 px de cabecera antes de ver nada**.
Venía de una decisión vieja ("no hay hamburguesa porque no hay JS de
navegación") que dejó de ser cierta en cuanto el proyecto tuvo JavaScript, y que
no se revisó.

Ahora en móvil la cabecera son **79 px**: marca y botón de menú. El botón abre un
desplegable anclado bajo la cabecera, con los enlaces en Marcellus y el teléfono
al final; las tres barras se cruzan en aspa al abrir. La píldora del teléfono se
oculta porque ya está dentro del desplegable y en la barra fija de abajo.

Mismo criterio que con las animaciones: **sin JS tiene que seguir navegándose**.
El desplegable solo existe si `main.js` ha puesto la clase `js` en el `<html>`
(lo hace un script en línea en el `<head>`, antes de pintar, para que no se vea
el salto). Sin esa clase el menú se queda como fila desplazable: feo, pero
usable. Y `montarMenu()` va fuera del bloque de movimiento a propósito: las
animaciones se desactivan con `prefers-reduced-motion`, pero poder abrir el menú
no es un adorno.

Las tres páginas legales también tienen menú ahora; antes solo llevaban el
teléfono.

### v3.1: movimiento

La v3 estaba bien resuelta pero se veía estática. Se añadió una capa de
movimiento **con una regla dura**: la web tiene que verse completa sin
JavaScript. `main.js` añade la clase `anim` al `<html>` y solo entonces se
aplica el estado previo de las entradas. Hay tres redes por debajo:

1. `IntersectionObserver` como mecanismo principal.
2. Un barrido por geometría en `scroll`/`resize`, por si el observer falla.
3. Un seguro a los 8 segundos que revela lo que quede oculto.

Comprobado: 0 elementos invisibles sin JS, sin `IntersectionObserver`, y con el
seguro. Una animación que no se ve es un detalle; un texto que no se ve es un
fallo.

Lo que se mueve: entrada escalonada de cada bloque, cabecera que encoge al
bajar, botones píldora con relieve y un barrido de luz al pasar por encima,
tarjetas que se levantan encendiendo su filete superior, fotos con acercamiento
lento, y **las cifras del tablón contando desde cero** la primera vez que se
ven. Todo se desactiva con `prefers-reduced-motion`.

### Fotografía

Solo quedan **dos** imágenes en toda la web: la de portada y la del joyero. Las
dos llevan el mismo virado a oro (`.foto img`, un `filter` de grayscale + sepia)
para que hagan juego aunque vengan de sitios distintos.

La parrilla de seis fotos de "Qué compramos" se eliminó: eran piezas de museo
sobre fondos dispares y parecían un catálogo de anticuario, no un compro-oro.
Ahora esa sección es una rejilla tipográfica con la ley de cada categoría
(18 kt, 999, 925…), como una tabla de contrastes. Si algún día hay fotos propias
del mostrador, se puede volver a meter imagen ahí.

## SEO y buscadores con IA

### El HTML servido tiene que traer los datos, no solo el JavaScript

Este fue un fallo de bulto que estuvo en el proyecto mucho tiempo. La web toma
sus datos de `CONFIG` y los escribe al cargar, pero **los rastreadores de las
IA (GPTBot, ClaudeBot, PerplexityBot) no ejecutan JavaScript**: leían el HTML
en crudo y veían `+34 000 000 000` y `Calle de ejemplo, 00`. Google renderiza,
pero ellos no. La web era invisible para ellos justo en lo que importa.

Se resuelve con `herramientas/sincronizar.js`:

    node herramientas/sincronizar.js

Vuelca `CONFIG` al HTML estático. **Hay que ejecutarlo siempre que se toque
`CONFIG`** —precios, horarios, teléfono, sedes— y confirmar el resultado junto
al cambio. `CONFIG` sigue siendo la única fuente de verdad; el HTML es su
reflejo. El JavaScript sigue funcionando igual: al cargar reescribe los mismos
valores, así que no hay conflicto.

El mismo script genera además, para que nunca se desvíen del texto visible:

- **`FAQPage` en JSON-LD** en cada página, a partir de sus `<details>`. Es lo
  que alimenta las respuestas de los buscadores con IA y los resultados
  enriquecidos de Google. Si alguien cambia una respuesta y el dato
  estructurado no se regenera, el JSON-LD miente.
- **`public/llms.txt`**, la convención de llmstxt.org: un resumen del negocio
  en texto plano que un modelo puede leer de una vez.

### Otros datos estructurados

- Portada: `Organization` con las dos sedes.
- Páginas de ciudad: `JewelryStore` con dirección y coordenadas.
- El horario de Pilar de la Horadada **no se declara** mientras siga sin
  confirmar: un horario erróneo en los resultados de búsqueda es peor que
  ninguno.

### robots.txt

Lista uno a uno los rastreadores de IA. El comodín ya los permitiría, pero
dejarlo explícito evita que un cambio futuro los excluya sin querer. Si alguna
vez no se quisiera aparecer en los resúmenes con IA de Google, se cambia
`Google-Extended` a `Disallow`.

## Despliegue

Cloudflare, proyecto **Workers** (no Pages): ejecuta `npx wrangler deploy` y lee
el `wrangler.toml` de la raíz.

**Se publica solo `./public`.** No mover la web a la raíz ni apuntar `directory`
a `"./"`: el `CLAUDE.md` incluye el presupuesto y las condiciones de cobro, y
acabaría servido en abierto. Hubo un primer intento con `.assetsignore` que se
descartó porque wrangler decía leer 126 entradas de un repo de 21 archivos
—estaba metiendo `.git`— y el contador no cambiaba al añadir exclusiones: no
había forma de verificar que se respetaran. La separación por carpetas no
depende de que nadie mantenga una lista.

Para FTP, lo que se sube es el contenido de `public/`.

## Cuidado con el CSS

`.contenedor` lleva `padding: 0 22px`. Cualquier elemento que sea a la vez
`.contenedor` y tenga una regla propia con `padding: X 0` se come el margen lateral.
Ya pasó dos veces. Usar `padding-top` / `padding-bottom` por separado en esos casos.

## Pendiente

1. **Datos reales**: todo en el bloque `CONFIG` de `assets/js/main.js`.
   Falta el **email** (ver el punto de la LSSI) y confirmar el **horario de
   Pilar de la Horadada**, que sigue siendo el de plantilla.

### La cotización se actualiza sola

`.github/workflows/cotizacion.yml` se ejecuta todos los días a las 07:00 UTC
(09:00 en España en verano). Consulta la onza de oro y de plata en
`api.gold-api.com` y el cambio dólar/euro en `api.frankfurter.dev` —las dos
gratuitas y sin clave—, escribe el valor por gramo de cada ley en `CONFIG`,
ejecuta el sincronizador y hace commit. Ese push dispara el build de
Cloudflare: la web se actualiza sin tocar nada.

También se puede lanzar a mano desde la pestaña Actions, o en local con
`node herramientas/actualizar-cotizacion.js`.

**Guardas.** Esto escribe sin supervisión en la web de un cliente, así que el
script se niega a publicar si algo huele mal: si una fuente falla, si el
cambio dólar/euro sale de [0,5 – 1,5], si el oro se sale de 20–400 €/g, si la
plata se sale de 0,2–10 €/g, o **si algún precio salta más de un 10 % respecto
al día anterior**. En cualquiera de esos casos falla, no escribe nada y GitHub
manda un aviso por correo. Un tablón de ayer es mejor que un tablón con un
disparate. Si el salto es real (el oro se mueve de verdad), se actualiza
`CONFIG` a mano y al día siguiente el automatismo sigue solo.

Tras escribir, el script **relee `CONFIG` y comprueba clave por clave** que se
guardó lo que tocaba. Esto viene de un fallo real: la primera versión iba con
una expresión regular por clave que exigía coma final, y `plata925` —la
última, sin coma— se quedaba sin actualizar en silencio.

### El tablón NO es una lista de precios de compra

Esto es importante y se decidió a mitad del proyecto. `CONFIG.precios` contiene
la **cotización de mercado** del metal puro por gramo, no lo que Valeria paga.
Un compro-oro paga siempre una fracción de la cotización, así que publicar la
cotización como "precio de compra" sería prometer de más.

Por eso el tablón se titula "Cotización del oro hoy" y su nota dice, en negrita,
que no es una oferta y que el precio real se fija en tienda tras comprobar la
pureza y pesar la pieza.

Última toma: 12/09/2026, oro 24 kt a 120,52 €/g, contrastada entre
livepriceofgold.com y goldpricedata.com. Para actualizarla basta cambiar `oro24`
y recalcular el resto por su ley. Conviene repasarla cada semana: un tablón
viejo resta más credibilidad de la que suma.

### Abierto / cerrado en vivo

Cada sede muestra un chip con su estado, calculado en `main.js` a partir de
`CONFIG.sedes[].horario` y con la hora de **Europe/Madrid**, no la del visitante.
Interpreta etiquetas tipo "Lunes a viernes" / "Sábados" y tramos tipo
"10:00 – 14:00 / 17:00 – 20:00". **Si el horario se escribe de otra manera y no
lo entiende, el chip no aparece**: nunca inventa un estado. Si al cambiar un
horario desaparece el chip, es que se ha roto el formato.
2. **Reseñas**: hechas. Son tres reseñas **reales** de la ficha de Google, de
   cinco estrellas: peris17, Elisenda Provencio Roig e Iván Zamorano. El texto
   está copiado literal. Las fechas del `<cite>` se dedujeron del "hace N meses"
   que mostraba Google el 12/09/2026, así que pueden bailar un mes. Si se añaden
   más, tienen que ser reales: inventarlas es publicidad engañosa.
3. **Legales**: ya no hay nada resaltado en amarillo. Lo llevaba y parecía una
   obra a medio hacer justo en las páginas que ve el cliente. Ahora lo que falta
   va en gris discreto (`.pendiente`) y el recordatorio con el detalle va en un
   **comentario HTML al lado**, visible solo en el código.

   Relleno ya: teléfono, dirección, el fuero (reescrito para no depender de una
   ciudad) y **Destinatarios**, que nombra a Cloudflare como alojamiento, a
   Google por el mapa incrustado y a WhatsApp, con la nota de transferencia
   internacional a EE. UU.

   Sigue faltando, y hay que pedírselo a la clienta: **razón social, NIF,
   domicilio fiscal, datos registrales** (si es sociedad; si es autónoma esa
   línea se borra) y el **correo electrónico**. Buscar `PENDIENTE:` en los
   HTML para verlo todo. Revisión final de su gestoría.
4. **Fotos propias**: las ocho de `assets/img/` son de relleno. Sustituirlas por
   fotos del mostrador, la balanza y las piezas, con los mismos nombres de archivo
   y sin tocar nada más.
5. **Sedes**: hechas. `compro-oro-los-alcazares.html` y
   `compro-oro-pilar-de-la-horadada.html`, enlazadas desde la portada (botón
   "Ver esta tienda" en cada ficha, vía `CONFIG.sedes[].pagina`) y desde el pie.
   Cada una lleva titular, entradilla, zona de influencia y preguntas propias:
   si se copian entre sí, Google las trata como contenido duplicado y no
   posicionan. Llevan también `JewelryStore` en JSON-LD, con dirección y
   coordenadas.

   **El horario de Pilar de la Horadada NO se declara en el JSON-LD** porque
   sigue sin confirmar: publicar un horario sin verificar haría que Google lo
   mostrara mal en las búsquedas. En cuanto se confirme, añadirlo.

   **Aviso de mantenimiento**: el tablón de precios, la franja de reclamos y la
   rejilla de categorías están duplicados en las tres páginas. No hay plantillas
   porque no hay build. Si se toca uno, hay que tocar los tres.

   Falta dar de alta o revisar la ficha de Google Business Profile de cada
   tienda y enlazarla a su página.


6. **Favicon y logo**: hechos. El monograma VS va en la cabecera de las cuatro
   páginas (`assets/img/logo.png`, con el fondo negro recortado para que sirva
   sobre marfil) y como favicon (`favicon.png`, 180×180 sobre negro cálido).
   El original que pasó la clienta era de 150×150, así que `logo.png` está
   reescalado a 300 px y no da para mucho más: si hace falta a mayor tamaño
   (cartelería, rótulo), pedirle el vectorial.
7. **Analítica**: no hay ninguna instalada, por eso no hay banner de cookies. Si se
   instala Analytics o el píxel de Meta, hace falta banner de consentimiento previo
   y completar `politica-cookies.html`.

## Afirmaciones que hay que confirmar con el cliente

La web dice: balanza homologada y verificada por Industria, comprobación de pureza
con piedra de toque, pago el mismo día, DNI obligatorio, tasación gratuita sin
compromiso. Son afirmaciones que luego se le pueden exigir.

Añadidas en v2.1, a confirmar también: **compra de relojes de alta gama** y
**compra de joyería exclusiva y diamantes**. Salen del propio Linktree de la
clienta ("oro y plata, relojes de alta gama y joyería exclusiva"), pero conviene
que confirme que los tasa en tienda y con qué criterio, porque un diamante o un
Rolex no se valoran por peso de metal.

## Servicios: qué se copió de tuorovalemas.com y qué no

La referencia del cliente es tuorovalemas.com. Comparados los servicios:

- Ya estaban: joyas de oro, plata (cubertería, bandejas), monedas de inversión,
  lingotes, oro dental, tasación gratuita, pesaje a la vista con balanza
  homologada, pago en el acto.
- Añadidos: relojes de alta gama, joyería y diamantes.
- **No añadido — vender desde casa por envío postal.** tuorovalemas.com lo ofrece.
  No se ha puesto porque no consta que la clienta lo haga y porque es venta a
  distancia: obliga a condiciones de contratación, desistimiento y un seguro de
  transporte. Si lo quiere, hay que redactarlo aparte.
- **No añadido — tienda online de lingotes y monedas y asesoramiento de
  inversión.** Excluido por el brief desde el principio ("sin tienda online").
  Además el asesoramiento de inversión es terreno regulado.

## Fotos actuales

Todas descargadas de Wikimedia Commons, dominio público o CC0, uso comercial sin
atribución. Archivo original de Commons entre paréntesis:

- `portada.jpg` — "Gold bullion bars" (CC0)
- `lingotes.jpg` — "Gold Ingots on white background" (dominio público)
- `joyas.jpg` — "Necklace, chain MET sf9515260", MET (CC0)
- `monedas.jpg` — "1975 1 oz krugerrand obverse" (CC0)
- `plata.jpg` — "Personnal Cutlery Maria Theresia Vienna 1" (CC0)
- `joyero.jpg` — "Jeweller in Old City. Arab jeweller (without tarboush) LOC
  matpc.17140", Library of Congress (dominio público)
- `relojes.jpg` — "Ultradun zakhorloge met cilindergang en een emaildecor van
  bloemen, objectnr KA 3601", Amsterdam Museum (CC0)
- `joyeria.jpg` — "Ring met een grote diamant, objectnr KA 3379",
  Amsterdam Museum (CC0)

Se descartó "Patek Philippe Ellipse gold wristwatch" por ser CC BY-SA 4.0: obliga
a atribuir y a compartir igual, y todo el resto del set es libre de atribución.

Pendiente de retoque: `joyero.jpg` es un negativo y conserva los bordes de
película arriba y abajo. El `object-fit: cover` se come los laterales, pero
convendría recortarlo bien con un editor de imagen.

## Presupuesto acordado con el cliente

Referencia de mercado para este tipo de web: 2.500–4.500 € por el proyecto, más
mantenimiento de 40–150 €/mes (hosting, dominio, actualizaciones, backups y unas
horas de cambios). SEO y contenido se factura aparte. Cobro 50 % al firmar y 50 %
antes de publicar, con 2-3 revisiones incluidas por escrito.
