# Fuentes y metodología

## Categoría deportiva

La primera división masculina se denominó UCI ProTeam durante la etapa ProTour y UCI WorldTeam desde 2015. Antes de 2005 no existía una licencia WorldTeam equivalente; el simulador utiliza el pelotón profesional de élite de la época, centrado en las estructuras presentes en el Tour de Francia.

La denominación “WT Historical” se usa como simplificación jugable. Algunos equipos solicitados —por ejemplo Cofidis o Kelme— cambiaron de categoría a lo largo del tiempo, pero se conservan cuando forman parte del archivo élite y de la continuidad histórica solicitada.

## Corredores 1990-2025

Fuente base: LeTourDataSet, archivo `TDF_Riders_History.csv`, con ciclistas y equipos registrados en el histórico del Tour de Francia. Se conservan los nombres reales presentes en la fuente para 1990-2025.

Limitación: el archivo representa participantes y resultados históricos del Tour; no es una lista contractual universal de todos los corredores inscritos en todos los equipos del mundo.

## Restauración de equipos y figuras

El archivo se amplía manualmente cuando una estructura o figura histórica importante falta por retirada, descalificación, ausencia del Tour o limitación de la clasificación de origen. Estas entradas se marcan como `curatedHistoricalRoster`.

## Reservas de archivo

Cuando una plantilla documental ofrece menos de ocho corredores, el generador busca corredores reales de la misma continuidad de equipo en temporadas cercanas. No crea nombres ficticios. Los registros incluyen:

- `archivalReserve: true`
- `sourceSeason`: temporada real de procedencia

## Ratings

Las capacidades se generan de forma determinista mediante especialidad, arquetipo y rendimiento histórico disponible. Se incluyen llano, sprint, montaña, colinas, pavé, CRI, CRE, resistencia, recuperación, aceleración, colocación y descenso. Las grandes figuras tienen perfiles revisados manualmente.

Los ratings son una representación de videojuego y no datos fisiológicos oficiales.

## 2026

El pack 2026 contiene los 18 UCI WorldTeams registrados para la temporada y diez corredores principales reales por equipo. La selección compacta prioriza líderes, sprinters, clasicómanos, croners y jóvenes determinantes. Los antiguos nombres de relleno sintéticos de la base inicial han sido eliminados.

La plantilla 2026 se incorpora además en `current-2026-major.js` para que el simulador cargue correctamente las figuras reales incluso antes de solicitar el JSON anual.
