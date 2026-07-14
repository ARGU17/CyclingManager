# Changelog v0.24+

## Corrección crítica de convocatoria

- Corregido el bloqueo que podía dejar la aplicación en la pantalla de selección después de elegir ocho corredores.
- La transición a la carrera ya no depende de que `localStorage` esté disponible.
- El flujo funciona tanto en **carrera única** como en **modo temporada**.
- La confirmación limpia IDs duplicados o inválidos antes de iniciar.
- La selección rival se limita y valida equipo por equipo.
- La pantalla de carrera se renderiza antes de intentar guardar.
- Si el navegador bloquea el almacenamiento, la partida continúa con normalidad y se muestra un aviso únicamente al guardar.

## Estabilidad adicional

- Nueva capa segura para leer, escribir y borrar guardados sin lanzar excepciones.
- Eliminada la doble preparación de convocatoria introducida por la expansión v0.24.
- Nueva clave de guardado: `cyclingManager_v024plus`.
- Mensajes de versión actualizados a v0.24+.

## Sistemas conservados

La versión mantiene íntegramente la base v0.24: motor CP/W′, Race Director, IA rival, grupos, clima, nutrición, material, CRI/CRE, temporada, staff, contratos, scouting, mentoría, logística, TV, telemetría, análisis, alertas, récords y palmarés.
