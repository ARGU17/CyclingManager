# Cycling Manager Tour v0.26 — Director Suite

Actualización integral de v0.25+ WT Historical. Mantiene el motor y todos los módulos anteriores, reorganiza el inicio del juego y añade dirección de club, mercado global de personal, infraestructura y cantera ampliada.

## Instalación en GitHub Pages

1. Descomprime el ZIP.
2. Sube **todos los archivos y carpetas** a la raíz del repositorio.
3. Mantén `historical-data/` junto a `index.html`.
4. Activa GitHub Pages desde la rama principal y la carpeta raíz.
5. Abre la web y pulsa **Borrar guardado** una vez para evitar estados incompatibles de versiones anteriores.

Los packs históricos se cargan con `fetch`; utiliza GitHub Pages o un servidor local, no abras únicamente `index.html` mediante `file://`.

## Nuevo flujo de inicio

La interfaz inicial funciona como un asistente secuencial:

1. **Tipo de juego**: carrera individual, temporada histórica, carrera multi-anual o temporada multi-anual.
2. **Carrera o calendario**: selección de año y prueba; en temporada pueden encadenarse varias carreras.
3. **Pelotón multi-anual**: solo aparece en modos especiales y obliga a elegir los equipos participantes.
4. **Equipo gestionado**.
5. **Convocatoria de ocho corredores**.

Al avanzar, las pantallas anteriores desaparecen. Una vez confirmada la convocatoria, se abre directamente el simulador normal.

## Límites de participación

- **Tour de France, Giro d’Italia y Vuelta a España: máximo 22 equipos.**
- **Resto de carreras y temporadas: máximo 25 equipos.**
- En modo normal, la IA completa el pelotón e incluye siempre al equipo del jugador.
- En modo multi-anual, el jugador selecciona expresamente entre 2 y el máximo reglamentario.

## Base histórica

- **37 temporadas:** 1990–2026.
- **806 equipos-temporada.**
- **7.053 registros de corredor.**
- Entre 1990 y 2025 se conservan los 772 equipos-temporada y 6.126 corredores del archivo histórico anterior.
- En 2026 se restaura **íntegramente la base de v0.24: 34 equipos, 927 registros de corredor y 36 carreras**.

La restauración 2026 reproduce exactamente el dataset del simulador v0.24 para preservar compatibilidad y profundidad. Parte de las ampliaciones de plantilla de aquella versión fueron generadas por el propio simulador; no se presentan como una verificación contractual externa de cada corredor.

Se mantienen ONCE, Banesto, US Postal, Kelme, Caisse d’Epargne, Telekom/T-Mobile, Cofidis, Saunier Duval, Astana, Trek y el resto del archivo histórico ya incluido.

## Mercado global de staff

El mercado contiene **1.000 profesionales**:

- **57 perfiles con nombre y función documentados** en fuentes oficiales de equipos.
- **943 perfiles ficticios generados**, claramente identificados como tales.
- Directores, entrenadores, médicos, fisioterapeutas, nutricionistas, mecánicos, ingenieros, analistas de datos e IA, responsables logísticos y ojeadores.
- Contratos, salarios, coste de contratación, cláusula de salida y años restantes.
- Posibilidad de contratar agentes libres o **fichar personal de otro equipo pagando su cláusula**.
- Asignación inicial de personal real cuando existe una correspondencia fiable con el equipo seleccionado.

Los nombres y cargos marcados como verificados proceden de fuentes publicadas por los equipos. Las habilidades, salarios, cláusulas y efectos son valores de videojuego, no datos laborales reales.

## Centro de operaciones del club

Nueva pestaña **Club / Infraestructura**:

- Ocho modelos de autobús, desde estructuras pequeñas hasta unidades de recuperación de gran vuelta.
- Diez coches de equipo con capacidad, fiabilidad, conectividad y retorno de patrocinio.
- Compra, activación y costes operativos.
- Acuerdos de vehículo oficial; la asociación CUPRA–Movistar se marca como documentada y las demás propuestas como simulaciones comerciales.
- Configuración inicial de activos para los equipos actuales y valores coherentes para equipos históricos.

### Departamentos ampliables

Diez áreas con cinco niveles de desarrollo:

- Datos.
- Análisis de IA.
- Aerodinámica.
- Ciencia del rendimiento.
- Nutrición.
- Medicina y recuperación.
- Scouting.
- Logística.
- Fiabilidad de material.
- Academia de desarrollo.

Las inversiones modifican previsión táctica, pacing, recuperación, entrenamiento, scouting, material y recomendaciones del director.

## Mercado U23 y categorías inferiores

El mercado contiene **1.000 jóvenes**:

- **35 nombres documentados** de estructuras de desarrollo; sus ratings son siempre simulados.
- **965 corredores ficticios generados**.
- Base inicial máxima de **77**.
- Solo **un perfil de cada 1.000** alcanza potencial 94 o superior: exactamente el 0,1 %.
- Filtros por nombre, país, especialidad y origen del dato.
- Coste de formación/fichaje, salario, potencial, personalidad, progresión e incertidumbre del scouting.
- Los fichajes se incorporan a la plantilla y reciben contrato de desarrollo.

## Funcionalidades preservadas

Se conservan Race Director, clima, carretera, amenaza táctica, recomendación del director, retransmisión TV, perfil 2D, motor por pendiente, CP/W′, recuperación anaeróbica, grupos, formaciones, ataques y respuestas, corredores puente, abanicos, autobús de sprinters, descensos, pavé, CRI, CRE, material, neumáticos, nutrición, objetivos A/B/C, calendario individual, contratos, promesas, scouting, mentoría, logística, telemetría, gráficos, alertas, récords y palmarés.

## Guardado

Nueva clave de almacenamiento:

```text
cyclingManager_v026_director_suite
```

El guardado y la carga reconstruyen también las competiciones multi-anuales y su pelotón seleccionado.
