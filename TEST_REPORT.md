# Informe de validación v0.24

Validación ejecutada sobre los archivos incluidos en este paquete.

## Sintaxis

- `data.js`: correcta.
- `v024-data.js`: correcta.
- `game.js`: correcta.
- `v024-expansion.js`: correcta.

## Carga y datos

- 34 equipos.
- 927 corredores.
- 36 eventos/carreras.
- Pantalla inicial renderizada correctamente.

## Simulación

- Etapa normal: 272 corredores, tiempos numéricos y clasificación completa.
- Telemetría postetapa: 272 informes individuales.
- CRI: tiempos finitos, salida individual y offsets de dos minutos.
- CRE: tiempos finitos, bloques separados y tiempo común para los cuatro primeros del equipo.
- Alta montaña: ganador de perfil GC y cero sprinters en el top 10 de la prueba ejecutada.
- Aleatoriedad: tres ejecuciones produjeron ganadores y top 5 diferentes.

## Manager y persistencia

- Guardado/carga con clave `cyclingManager_v024`.
- 927 contratos y promesas.
- 927 calendarios individuales.
- 927 perfiles fisiológicos CP/W′.
- Staff para los 34 equipos.
- Alertas, scouting, mentoría, palmarés y récords inicializados.

## Pantallas comprobadas

- Race Director.
- Vista TV.
- Estrategia.
- Alimentación.
- Material.
- Equipo.
- Clasificaciones.
- Objetivos.
- Plan anual.
- Contratos/cantera.
- Staff/logística.
- Análisis.
- Alertas.
- Récords.
- Historial.

La validación se realizó con un entorno JavaScript Node/VM que simula el DOM y ejecuta el motor completo. No sustituye una prueba visual manual en cada navegador, pero verifica carga, sintaxis, estado, simulación y renderizado de las vistas principales.
