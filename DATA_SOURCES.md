# Fuentes y trazabilidad de datos

## ProCyclingStats

La arquitectura de packs está diseñada para utilizar temporadas y plantillas de ProCyclingStats. El proveedor mantiene páginas de equipos por año y ofrece acceso a API previa solicitud.

El generador conserva en cada equipo y corredor:

- URL de origen;
- proveedor;
- método de rating;
- estado de completitud;
- fallos de descarga;
- avisos de validación.

## Pack 2018

El pack preinstalado utiliza `RidersInfo2018.csv` del repositorio público `josselingirault/procyclingstats.com-webscraper`, publicado con licencia MIT. El propio repositorio indica que los datos fueron extraídos de PCS. Incluye 1.005 corredores y 51 equipos.

Los nombres, equipo, país, fecha de nacimiento, altura y peso proceden del dataset. Las habilidades son estimaciones deterministas; el pack debe enriquecerse para obtener categorías PCS por corredor.

## Pack 2026

Proviene de la base de datos incluida en Cycling Manager Tour v0.24+. Contiene 34 equipos y 927 corredores del simulador. El campo `source` permite distinguir datos curados y estimados.

## Regla de integridad

La aplicación no marca una temporada como completa si detecta:

- IDs duplicados;
- corredores sin equipo;
- plantillas anormalmente cortas o largas;
- ratings fuera de rango;
- errores de descarga.

Los años sin pack aparecen como **pendientes de generación**, en vez de rellenarse con nombres inventados.
