# Changelog — v0.26 Director Suite

## Interfaz y modos

- Sustituido el inicio anterior por un asistente secuencial: modo → carrera/calendario → pelotón multi-anual → equipo → convocatoria.
- Las ventanas de modo y carrera desaparecen después de avanzar.
- Añadida selección obligatoria del pelotón en carrera y temporada multi-anual.
- Aplicado límite de 25 equipos en pruebas normales y 22 en Tour, Giro y Vuelta.
- Corregida la reconstrucción de calendarios y equipos multi-era al cargar una partida.

## Base de datos

- Restaurada íntegramente la base 2026 de v0.24: 34 equipos, 927 registros de corredor y 36 carreras.
- Reemplazado el pack compacto 2026 de 180 corredores en el manifiesto, JSON anual y archivo de carga inmediata.
- Mantenidos los packs históricos 1990–2025.
- Total actualizado: 806 equipos-temporada y 7.053 registros de corredor.

## Staff

- Añadido mercado de 1.000 profesionales.
- 57 nombres/cargos documentados y 943 perfiles ficticios generados.
- Añadidos salarios, contratos, cláusulas, habilidades por profesión y procedencia.
- Añadido fichaje de staff perteneciente a otros equipos.
- Añadida asignación inicial por equipo cuando existe correspondencia documental.

## Club e infraestructura

- Añadidos ocho autobuses de equipo.
- Añadidos diez coches de dirección y acuerdos de patrocinio.
- Añadidos diez departamentos ampliables: datos, IA, aero, rendimiento, nutrición, medicina, scouting, logística, material y academia.
- Añadidos efectos de infraestructura sobre recuperación, táctica, rendimiento y fiabilidad.

## Cantera

- Añadido mercado U23 de 1.000 corredores.
- 35 nombres documentados de academias y 965 perfiles generados.
- Base inicial limitada a 77.
- Regla de supertalento limitada exactamente al 0,1 %.
- Añadido fichaje directo e incorporación a plantilla y contratos.

## Compatibilidad

- Conservados todos los módulos de v0.24+, v0.25 Historical y v0.25+ WT Historical.
- Nueva clave de guardado `cyclingManager_v026_director_suite`.
