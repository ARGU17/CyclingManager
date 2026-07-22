# Informe de validación — v0.25+ WT Historical

## Resultado

**VALIDACIÓN SUPERADA**

## Base histórica

- 37 temporadas cargables: 1990-2026.
- 790 equipos-temporada.
- 6.306 entradas de corredor.
- 772 equipos-temporada y 6.126 entradas entre 1990 y 2025.
- 18 UCI WorldTeams y 180 figuras principales reales en 2026.
- 10 corredores curados por cada WorldTeam 2026.
- 103 incorporaciones históricas curadas para restaurar equipos o figuras ausentes de la clasificación final del Tour.
- 794 reservas reales de estructuras equivalentes en temporadas cercanas, identificadas mediante `archivalReserve`.

## Integridad

- IDs de equipo únicos por temporada.
- IDs de corredor únicos por temporada.
- Cero corredores huérfanos.
- Todas las referencias `teamId` válidas.
- Todas las habilidades entre 35 y 99.
- Manifiesto y packs anuales sincronizados.
- Ningún nombre sintético de relleno en el pack 2026.
- Cada uno de los 18 WorldTeams 2026 contiene exactamente diez corredores principales.

## Equipos históricos comprobados

- 1992: ONCE y Banesto.
- 1998: ONCE, Banesto, Kelme y Festina.
- 2000: US Postal, Telekom y Kelme.
- 2006: Astana-Würth, Caisse d'Epargne, T-Mobile, Cofidis y Saunier Duval.
- 2007: Astana, Cofidis y Unibet.com.
- 2008: Astana y Saunier Duval.
- 2014 y 2025: Trek y Astana.

## Pruebas de aplicación

- Inicio directo con 18 WorldTeams y 180 corredores principales de 2026.
- Carga dinámica de 1992, 2006 y 2026.
- Selector de equipos por año.
- Búsqueda normalizada: `ONCE`, `O.N.C.E`, `US Postal`, `U.S Postal`, apóstrofes y guiones.
- Ausencia de falsos positivos de `ONCE` en `VITAL CONCEPT`.
- Confirmación de convocatorias de ocho corredores.
- Convocatorias históricas adaptativas para archivos documentales menores.
- Simulación completa con tiempos finitos.
- Cruce multi-era 1992 + 2026 con 40 equipos y sin colisiones de IDs.
- Staff nominal: 23 profesionales.
- Sintaxis JavaScript validada con Node.js.
- Validación de datos ejecutada con `tools/validate_wt_archive.py`.
- Smoke test ejecutado con `tools/smoke_test_v025plus.js`.

## Compatibilidad

Se mantienen Race Director, panel de amenaza, recomendación del director, clima, retransmisión, CP/W′, grupos, ataques, abanicos, autobús, pavé, descenso, material, nutrición, mercado, contratos, scouting, staff, telemetría, gráficos, alertas y palmarés.
