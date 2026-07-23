# Cycling Manager Tour v0.27 · GPX Stage Lab

Versión integrada de **Cycling Manager Tour v0.26 Director Suite** y el proyecto paralelo **Grand Tour Stage Lab**.

La v0.27 conserva el archivo histórico, la base completa 2026, los modos multi-era, la gestión de staff, infraestructura, mercado U23, contratos, entrenamiento, Race Director y telemetría. Sobre esa base añade generación, importación, visualización y simulación física de recorridos GPX para cualquier carrera o temporada seleccionada.

## Flujo de juego

1. Seleccionar tipo de partida.
2. Seleccionar carrera o calendario.
3. En multi-era, seleccionar los equipos participantes.
4. Seleccionar el equipo gestionado.
5. Se abre **Grand Tour Stage Lab** para el evento actual.
6. Generar, importar o enrutar los recorridos.
7. Pulsar **Usar GPX en Cycling Manager** o continuar con el recorrido existente.
8. Seleccionar la convocatoria.
9. Iniciar la carrera y utilizar el Race Director normalmente.

En modo temporada, Stage Lab vuelve a abrirse antes de cada nueva carrera. Los resultados, forma, fatiga, contratos, presupuesto, material, staff y clasificaciones permanecen encadenados.

## Funciones GPX integradas

- Generación de carreras de un día, vueltas cortas y grandes vueltas.
- Configuración por país, número de etapas, distancia y distribución deportiva.
- Generación mediante lenguaje natural.
- Importación de archivos GPX locales.
- Enrutado opcional por carreteras mediante Valhalla/OpenStreetMap.
- Exportación ZIP de los GPX generados.
- Mapa del recorrido sincronizado con el perfil.
- Perfil altimétrico interactivo con lectura de:
  - distancia recorrida;
  - distancia restante;
  - altitud;
  - pendiente instantánea.
- Colores de pendiente desde descenso hasta rampas superiores al 9 %.
- Detección automática de puertos.
- Generación de sectores físicos según el relieve real.
- Conversión del recorrido al formato nativo del simulador.
- Física GPX cada **250 metros**.
- Cálculo de pendiente, viento efectivo, viento lateral y orientación de la carretera.
- Motor GPX para etapas en línea, CRI y CRE.
- Perfil y mapa con los grupos de carrera sincronizados por distancia.
- Telemetría y resultados postetapa compatibles con la v0.24+.

## Recorridos incluidos

Se incluyen los archivos GPX aportados para 18 etapas del Tour, además de una base JavaScript preprocesada para evitar que el navegador tenga que analizar los XML durante cada carga.

La versión conserva dos posibilidades:

- Tour original con los GPX disponibles y perfiles de respaldo para las etapas sin archivo.
- Evento adicional compuesto únicamente por las etapas GPX incluidas.

## Compatibilidad preservada

La integración no sustituye los sistemas de la v0.26. Se conservan:

- 37 temporadas históricas, 1990–2026.
- Base 2026 de 34 equipos y 927 registros de corredor.
- Carrera y temporada histórica.
- Carrera y temporada multi-era.
- Límites de 25 equipos y 22 en Giro, Tour de France y Vuelta a España.
- Convocatoria de ocho corredores.
- Race Director y vista TV.
- Panel de amenaza táctica y recomendación del director.
- Clima, carretera, viento y abanicos.
- Motor CP/W′ y recuperación anaeróbica.
- Grupos, formaciones, ataques, respuestas y corredores puente.
- Autobús de sprinters.
- Descensos y pavé avanzado.
- Nutrición, material, neumáticos y presiones.
- CRI y CRE.
- Objetivos A/B/C y calendario individual.
- Contratos, promesas, mercado y cantera.
- Mercado de 1.000 profesionales de staff.
- Mercado de 1.000 corredores U23.
- Autobuses, coches, patrocinio y departamentos.
- Scouting, mentoría y logística.
- Telemetría, gráficos, alertas, récords y palmarés.

## Corrección adicional v0.27

La v0.26 interpretaba identificadores como `uae_tour` como si fueran el Tour de France. Esto podía aplicar incorrectamente el límite de 22 equipos al UAE Tour. La v0.27 distingue correctamente:

- UAE Tour: hasta 25 equipos.
- Tour de France: 22 equipos.
- Giro d'Italia: 22 equipos.
- Vuelta a España: 22 equipos.

## Instalación en GitHub Pages

1. Descomprimir el ZIP.
2. Subir **todo el contenido de la carpeta `cycling-manager-v027`** a la raíz del repositorio.
3. Mantener las carpetas `stage-lab`, `gpx`, `historical-data`, `tools` y `.github`.
4. Activar GitHub Pages desde la rama principal y la carpeta raíz.
5. Abrir `index.html` mediante GitHub Pages.

No deben eliminarse:

- `.nojekyll`
- `gpx-stage-data.js`
- `gpx-engine.js`
- `gpx-integration-v027.js`
- `stage-lab-integration-v027.js`
- la carpeta `stage-lab`
- la carpeta `gpx`

## Enrutado por carreteras

El generador funciona sin servidor para crear recorridos locales. El enrutado real por carretera es opcional y usa el endpoint configurado en Stage Lab.

Para producción puede utilizarse:

- un servidor Valhalla propio;
- un proxy Cloudflare Worker basado en `stage-lab/valhalla-proxy.js`;
- otro endpoint compatible configurado desde Stage Lab.

La generación local, importación de GPX, perfiles y simulación no dependen de ese servicio.

## Guardado

La v0.27 mantiene el esquema de guardado de la v0.26 para conservar compatibilidad. Los datos propios de Stage Lab se guardan dentro de `Game.stageLab`.

Los recorridos muy grandes pueden superar el límite de `localStorage` de algunos navegadores. La carrera continúa aunque el navegador bloquee el guardado. Para recorridos extensos se recomienda guardar tras aceptar el evento y utilizar un navegador con almacenamiento local habilitado.

## Herramientas incluidas

- `tools/build_stage_data.py`: procesa GPX y crea la base JavaScript.
- `tools/rebuild_gpx_data.py`: reconstruye `gpx-stage-data.js`.
- `tools/smoke_test_v027.js`: prueba integración general.
- `tools/test_v027_stage_lab_multistage.js`: prueba una vuelta completa de 21 etapas.
- Pruebas históricas, de mercado y de base 2026 procedentes de v0.26.

## Versión

`v0.27-gpx-stage-lab`
