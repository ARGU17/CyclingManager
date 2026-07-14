# Cycling Manager Tour v0.24

Versión integrada que conserva la base funcional v0.19 y añade los sistemas previstos para v0.21, v0.23 y v0.24.

## Instalación en GitHub Pages

1. Sube **todos los archivos de esta carpeta** a la raíz de tu repositorio.
2. Comprueba que `index.html`, `data.js`, `v024-data.js`, `game.js`, `v024-expansion.js`, `styles.css` y `v024.css` están en la misma carpeta.
3. Activa GitHub Pages desde la rama principal y la carpeta raíz.
4. Al abrir la app, pulsa **Borrar guardado** antes de empezar una partida v0.24.

## Archivos

- `index.html`: entrada de la aplicación.
- `data.js`: datos completos heredados de v0.19, equipos, corredores, calendario, material y carreras.
- `v024-data.js`: definiciones nuevas de fisiología, calendarios, contratos, neumáticos, scouting y alertas.
- `game.js`: motor y funcionalidades completas de v0.19.
- `v024-expansion.js`: ampliación v0.24, sin eliminar los sistemas anteriores.
- `styles.css`: estilos completos heredados.
- `v024.css`: estilos de los sistemas nuevos.

## Sistemas conservados

- Carrera única y temporada 2026.
- Selección y bloqueo de ocho corredores por carrera.
- Race Director por sectores y simulación rápida.
- Panel de clima, control de carrera, amenaza táctica y recomendación del director.
- Grupos, fugas e IA rival v0.17/v0.19.
- CRI con salidas individuales cada dos minutos.
- CRE con equipos separados cinco minutos y tiempo por el cuarto corredor.
- Controles de intensidad, longitud de relevo y formación CRE.
- Alimentación manual y automática, stock del coche y clima aplicado.
- Material, cuadros, ruedas y maillots 3D.
- Clasificaciones, UCI, sponsor, objetivos, mercado, contratos, staff, scouting y training camps.
- Vista TV y perfil 2D de un punto por kilómetro.

## Nuevos sistemas v0.24

### Motor físico y táctico

- CP, W′, VO₂max estimado y curvas fisiológicas por rol/calidad.
- Recuperación anaeróbica diferente al ir a rueda, tirar, bajar o atacar.
- Cálculo por kilómetro y pendiente mediante potencia, masa, aerodinámica, rodadura y viento.
- Posiciones reales en el grupo: cabeza, relevos, protegido, centro, cola y en dificultad.
- Ataques de prueba, ataques duros, a bloque, largo alcance y puentes.
- Respuestas: inmediata, progresiva, tempo, gregario, dejar marchar o contraataque.
- Corredor satélite, puente del líder, relevos en valle y doble ataque.
- Autobús de sprinters con estimación del fuera de control.
- Abanicos por viento lateral, exposición, colocación y anchura efectiva del grupo.
- Descensos seguros, normales, agresivos o atacando.
- Pavé detallado con severidad y riesgo técnico.

### Manager

- Calendario individual por corredor.
- Presets para GC, Giro, clásicas, sprint, crono y desarrollo.
- Objetivos A/B/C y curvas de pico de forma.
- Carga, frescura y readiness por carrera.
- Contratos con salario, años, rol prometido, cláusula y bonus.
- Promesas de Tour, liderazgo, libertad, tren de sprint y días mínimos.
- Misiones de scouting con duración, precisión e intervalo de potencial.
- Academia mejorable, curvas de desarrollo y rasgos de jóvenes.
- Mentoría entre veteranos y sub-23.
- Staff asignable específicamente a cada carrera.
- Logística económica, estándar, rendimiento o élite, con llegada anticipada.

### Material técnico

- Cubiertas de 28, 30, 32 y 34 mm.
- Tubeless, tubular y cubierta con cámara.
- Compuestos rápido, equilibrado, lluvia y pavé.
- Protección ligera, estándar, reforzada o inserto.
- Presión delantera y trasera individual.

### TV, análisis y persistencia

- Cámaras seleccionables por grupo, líder, sprinter o autobús.
- Narración dinámica basada en el estado real de la carrera.
- Timeline de ataques, cortes, incidentes y alertas.
- Alertas configurables.
- Telemetría postetapa: potencia, NP estimada, W/kg, velocidad, kJ, CHO/h, ml/h, drafting, W′ y ataques.
- Gráficos SVG de potencia, velocidad, energía, forma y fatiga.
- Récords y palmarés persistentes.

## Nota de compatibilidad

La clave de guardado es `cyclingManager_v024`. Los guardados anteriores no se cargan automáticamente para evitar estados incompatibles.
