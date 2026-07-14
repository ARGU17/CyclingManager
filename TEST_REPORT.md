# Informe de validación v0.24+

## Objetivo principal

Validar que la selección de ocho corredores permite iniciar la carrera aunque el navegador bloquee el almacenamiento local.

## Pruebas de navegador real

Ejecutadas en Chromium headless con DOM real y `localStorage` deliberadamente inaccesible:

- Carrera única: selección automática de 8 corredores → confirmación → Race Director cargado.
- Temporada: selección automática de 8 corredores → confirmación → primera carrera de temporada cargada.
- No se produjeron errores de página.
- La imposibilidad de guardar se trató como aviso y no bloqueó la navegación.
- Simulación rápida posterior a la confirmación: clasificación completa, tiempos finitos y sin `NaN`.

## Matriz de convocatoria

- 34 equipos probados en la primera carrera del calendario.
- 36 carreras probadas con un equipo de referencia.
- Modo temporada probado por separado.
- 71 flujos de confirmación completados sin fallos.

## Sintaxis

- `data.js`: correcta.
- `v024-data.js`: correcta.
- `game.js`: correcta.
- `v024-expansion.js`: correcta.

## Sistemas conservados

- Carrera única y temporada.
- Selección y bloqueo de ocho corredores.
- Race Director y simulación rápida.
- CRI y CRE.
- Motor físico CP/W′ y grupos.
- Clima, fugas, nutrición y material.
- Manager, objetivos, contratos, staff, scouting, mentoría y logística.
- Vista TV, telemetría, análisis, alertas, récords y palmarés.

## Guardado

- Clave nueva: `cyclingManager_v024plus`.
- Los guardados anteriores se pueden borrar desde la pantalla inicial.
- Si Safari, modo privado o una política del navegador impide usar `localStorage`, el juego sigue funcionando durante la sesión.
