# Valeria Santos Oro — web v2

Web estática (una portada larga más tres páginas legales). Se sube tal cual a
cualquier hosting: no necesita base de datos ni PHP.

## 1. Poner los datos reales

Todo está en el bloque `CONFIG`, arriba de `assets/js/main.js`:
teléfono, WhatsApp, email, redes, las sedes (nombre, dirección, teléfono, mapa y
horario de cada una) y los precios por gramo. Cambias esos valores, subes el
archivo y se actualiza toda la web.

Ya están puestos el teléfono, el WhatsApp, las redes, las dos sedes y sus mapas.
Falta rellenar:

- `precios` y `fechaPrecios` — es la **cotización de mercado**, no el precio de
  compra; el tablón lo dice así de claro. Repasarla cada semana: cambiar `oro24`
  y recalcular el resto por su ley (0,916 · 0,750 · 0,585 · 0,375).
- `email` — confirmar el correo real.
- `sedes[0].direccion` — falta el número de portal de Los Alcázares.
- `sedes[].horario` — el de Los Alcázares sale de su ficha de Google; el de
  Pilar de la Horadada sigue sin confirmar. Cuidado al editarlos: de ahí sale el
  chip de "Abierto / Cerrado" de cada tienda, y si se escribe con otro formato el
  chip desaparece (no muestra nada falso, simplemente no sale).

Los dos mapas usan coordenadas (`maps.google.com/maps?q=lat,lng&output=embed`),
que no necesitan clave de API. Para mover un pin basta cambiar el par lat,lng.

Para añadir una tercera tienda: copiar un bloque `<div class="tienda" data-sede="2">`
en `index.html` y añadir su objeto a `CONFIG.sedes`.

## 2. Antes de publicar

- **Reseñas**: ya están puestas las tres reales de Google. Si se añaden más,
  tienen que ser reales: inventarlas es publicidad engañosa y puede acabar en
  sanción de Consumo.
- **Páginas legales**: `aviso-legal.html`, `privacidad.html` y `politica-cookies.html`
  son plantillas. Lo resaltado en amarillo lo rellena el cliente con su razón social,
  NIF y domicilio, y lo revisa su gestoría.
- **Afirmaciones**: la web dice balanza homologada, piedra de toque y pago el mismo
  día. Confirma que es exactamente lo que hacen.
- **Horario y pesos orientativos**: están escritos en `index.html`
  (busca `class="horario"` y `class="ejemplos"`).

## 3. Fotos

Las ocho de `assets/img/` son de relleno, descargadas de Wikimedia Commons y todas
en dominio público o CC0, así que se pueden usar comercialmente sin atribución.
El detalle de cada una está en el `CLAUDE.md`.

En cuanto la clienta pase fotos suyas, sustituirlas: mismos nombres de archivo en
`assets/img/` y no hay que tocar nada más. Las fotos propias del mostrador y de la
balanza convierten mucho mejor que cualquier banco de imágenes.

## 4. La calculadora

Sale de `CONFIG.precios`: no hay nada que configurar aparte. Los pesos de los
seis ejemplos están en el `index.html`, en los `data-peso` y `data-ley` de cada
botón `.ejemplo`. Si se cambia un peso en el texto, cambiar también el `data-peso`.

## 5. El menú de móvil

A partir de 900 px de ancho hacia abajo, el menú pasa a desplegable. Si se añade
o quita un enlace del `<nav class="menu">` del `index.html`, hay que hacerlo
también en las tres páginas legales, que llevan su propia copia apuntando a
`index.html#seccion`.

## 6. Siguientes pasos

Duplicar la portada en una página por ciudad (`compro-oro-los-alcazares.html` y
`compro-oro-pilar-de-la-horadada.html`) con textos propios, y comprobar la ficha de
Google Business Profile de cada tienda. Ahí está el tráfico de verdad.

El logo ya está puesto: `assets/img/logo.png` en la cabecera (fondo recortado, se
ve bien sobre cualquier color) y `favicon.png` como icono de pestaña. Vienen del
archivo de 150×150 que pasó la clienta, así que para cartelería o rótulo hay que
pedirle el original vectorial.

## Estructura

```
index.html               portada completa
aviso-legal.html
privacidad.html
politica-cookies.html
assets/css/estilo.css    colores y tipografías arriba del todo
assets/js/main.js        CONFIG + formulario de WhatsApp
assets/img/              fotos + logo.png
favicon.png              icono de pestaña
```
