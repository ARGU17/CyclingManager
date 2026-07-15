# Cycling Manager Tour v0.25 · Grand Tour Stage Lab

Esta versión integra **Grand Tour Stage Lab** dentro del simulador completo v0.24+, sin sustituir ni eliminar sus sistemas de gestión, táctica o simulación.

El flujo de juego pasa a ser:

```text
Modo de juego
→ competición
→ equipo
→ Grand Tour Stage Lab
→ generación/revisión/enrutado de GPX
→ selección de 8 corredores
→ desarrollo normal de la competición
```

En modo temporada, Stage Lab vuelve a abrirse antes de cada evento del calendario.

---

## Instalación en GitHub Pages

1. Descomprime el ZIP.
2. Sube **todo el contenido de la carpeta** a la raíz del repositorio.
3. Mantén la carpeta `stage-lab/` junto al `index.html` principal.
4. Activa GitHub Pages desde la rama principal y la carpeta raíz.
5. Realiza una recarga forzada del navegador después de sustituir una versión anterior.

También puede ejecutarse localmente:

```bash
python -m http.server 8080
```

Después abre:

```text
http://localhost:8080
```

No se recomienda abrir `index.html` directamente con `file://`, porque los navegadores pueden restringir el iframe, el mapa y algunos recursos locales.

---

## Integración con el calendario

Stage Lab está conectado a los **36 eventos** del calendario de Cycling Manager:

- carreras de un día;
- vueltas por etapas;
- Giro d'Italia;
- Tour de France;
- Vuelta a España;
- CRI;
- CRE;
- clásicas de pavé;
- pruebas llanas, quebradas y de montaña.

La configuración enviada a Stage Lab conserva la estructura deportiva de cada evento:

- número de etapas;
- orden de los tipos de etapa;
- distancias objetivo de las etapas;
- formato de carretera, pavé, CRI o CRE;
- país o región de la carrera;
- semilla determinista específica del evento.

Stage Lab genera la geometría, elevación, pendiente, puertos y puntos GPX. Al aceptar el recorrido, estos datos sustituyen únicamente el trazado físico del evento seleccionado.

---

## Qué se conserva de v0.24+

Se mantienen los sistemas anteriores:

- selección y bloqueo de ocho corredores;
- carrera única y temporada completa;
- motor físico CP/W′;
- potencia, masa, aerodinámica, rodadura, pendiente y viento;
- drafting y posición dentro de los grupos;
- ataques, respuestas, contraataques y corredores puente;
- fugas, pelotón, favoritos, autobús y cortados;
- IA de directores deportivos rivales;
- abanicos, descensos, pavé y riesgo técnico;
- nutrición manual y automática;
- neumáticos, presión, cuadros y ruedas;
- telemetría, análisis y vista TV;
- objetivos A/B/C y calendario individual;
- contratos, promesas, scouting, cantera y mentoría;
- staff, logística, clasificaciones y persistencia;
- hotfix v0.24+ para confirmar correctamente ocho corredores.

---

## Motor GPX

Cada etapa aceptada desde Stage Lab se convierte al formato interno del simulador con:

- latitud y longitud;
- altitud filtrada;
- distancia acumulada;
- pendiente local;
- puertos detectados;
- sectores físicos;
- puntos de perfil;
- geometría compactada para guardado y renderizado.

### Resolución física

Las etapas GPX se simulan mediante subpasos de:

```text
250 m
```

En cada subpaso se actualizan:

- pendiente;
- velocidad;
- potencia requerida;
- CP y W′;
- gasto energético;
- hidratación;
- drafting;
- formación y posición de grupo;
- viento frontal y lateral según rumbo real;
- fatiga;
- telemetría.

Los eventos aleatorios permanecen normalizados para evitar que una mayor resolución multiplique artificialmente ataques, caídas o incidencias.

---

## Perfil estilo Radial

La colorimetría se utiliza tanto en Grand Tour Stage Lab como en la pantalla de competición:

| Pendiente | Color |
|---:|---|
| ≤ −9 % | `#1a4bff` |
| −9 a −6 % | `#2c7cff` |
| −6 a −3 % | `#2bb2ff` |
| −3 a −1 % | `#24c6c6` |
| −1 a 1,5 % | `#14b81f` |
| 1,5 a 3 % | `#63cf15` |
| 3 a 5 % | `#b5c718` |
| 5 a 7 % | `#e4c625` |
| 7 a 9 % | `#ee9430` |
| > 9 % | `#dd5a22` |

El perfil se rellena con bandas verticales de alta frecuencia recortadas por la silueta altimétrica. Permite:

- pasar el cursor por el perfil;
- consultar km recorrido y km restantes;
- consultar altitud y pendiente;
- hacer zoom;
- desplazarse horizontalmente;
- sincronizar el punto seleccionado con el mapa;
- seguir grupos y situación de carrera sobre el recorrido.

---

## Grand Tour Stage Lab integrado

La carpeta `stage-lab/` mantiene las funciones del generador original:

- generación local sin API;
- configuración de una carrera o vuelta;
- petición en lenguaje natural;
- regeneración de etapa;
- mapa 2D/3D;
- perfil interactivo;
- enrutado opcional por carreteras de OpenStreetMap mediante Valhalla;
- exportación GPX por etapa;
- exportación ZIP de la vuelta;
- selección de cualquier etapa del libro de ruta;
- transferencia del evento completo a Cycling Manager.

### Enrutado real

La generación local funciona sin conexión. El botón de recalcular/enrutar consulta un servidor público Valhalla/OpenStreetMap. Esta función:

- necesita conexión a Internet;
- no necesita clave API;
- puede verse limitada temporalmente por el servidor público;
- no es necesaria para continuar al simulador.

---

## Archivos principales

```text
index.html
styles.css
v024.css
gpx.css
stage-lab-integration.css

data.js
v024-data.js
gpx-stage-data.js
gpx-engine.js
game.js
v024-expansion.js
gpx-integration.js
v024-plus-fix.js
stage-lab-integration.js

stage-lab/
```

El orden de carga del `index.html` es intencionado. `stage-lab-integration.js` se carga después del motor v0.24+, del runtime GPX y del hotfix de convocatoria.

---

## Guardado

Se mantiene la compatibilidad con la clave:

```text
cyclingManager_v024
```

La ruta GPX activa se almacena dentro del estado de partida. Para limitar el tamaño del guardado en temporada, solo se conserva la geometría completa del evento activo.

Si `localStorage` está bloqueado o sin espacio, el hotfix v0.24+ permite continuar la carrera y mantiene un respaldo temporal en memoria durante la sesión.

Para la primera ejecución tras sustituir una versión anterior, es recomendable pulsar **Borrar guardado** y comenzar una partida nueva.
