# Cycling Manager Tour v0.25+ WT Historical

Ampliación de v0.24+/v0.25 con archivo anual de grandes equipos masculinos desde 1990 hasta 2026, selector por año y enfrentamientos entre épocas. Se conservan todos los módulos anteriores del simulador.

## Instalación en GitHub Pages

1. Descomprime el ZIP.
2. Sube **todos** los archivos y carpetas a la raíz del repositorio.
3. Mantén `historical-data/` junto a `index.html`.
4. Activa GitHub Pages desde la rama principal y la carpeta raíz.
5. Abre la web y pulsa **Borrar guardado** una vez.

No abras solamente `index.html` desde el sistema de archivos: los packs anuales se cargan mediante `fetch` y deben ejecutarse desde GitHub Pages o un servidor local.

## Archivo histórico incluido

- **1990-2004:** equipos masculinos de élite equivalentes a la máxima categoría de la época, centrados en las estructuras presentes en el Tour de Francia.
- **2005-2014:** era UCI ProTeam/ProTour, con archivo anual del pelotón élite.
- **2015-2025:** era UCI WorldTeam, más las estructuras históricas relevantes necesarias para conservar equipos solicitados como Cofidis o Kelme cuando su estatus varió.
- **2026:** los 18 UCI WorldTeams, con 10 figuras principales reales por equipo. Se han eliminado los nombres de relleno sintéticos.

El paquete contiene **37 archivos anuales**, **790 equipos-temporada** y **6.306 entradas de corredor**. Entre 1990 y 2025 hay 6.126 entradas documentales; 2026 incorpora 180 corredores principales reales, diez por WorldTeam.

## Equipos históricos destacados

Incluye, entre otros:

- ONCE / ONCE-Deutsche Bank / ONCE-Eroski.
- Banesto / iBanesto.com.
- US Postal Service y Discovery Channel.
- Kelme / Kelme-Costa Blanca.
- Caisse d'Epargne y Movistar.
- Team Deutsche Telekom / Team Telekom / T-Mobile.
- Astana, Astana-Würth y XDS Astana.
- Trek Factory Racing, Trek-Segafredo y Lidl-Trek.
- Cofidis.
- Saunier Duval-Prodir y Saunier Duval-Scott.
- Festina, Mapei, Carrera, Mercatone Uno, Rabobank, CSC/Saxo, Quick-Step, Lampre/UAE, Liquigas, BMC, Phonak, Gerolsteiner, Fassa Bortolo, Euskaltel, Team Sky/INEOS y otras estructuras de primer nivel.

La pantalla histórica incorpora accesos rápidos para localizar las estructuras solicitadas aunque el nombre comercial cambie o use puntos, guiones y apóstrofes.

## Corredores y habilidades

Los packs históricos contienen nombres reales del archivo utilizado. Cuando una alineación documental es menor de ocho corredores, se añaden reservas reales de la misma continuidad deportiva en temporadas cercanas, identificadas con `archivalReserve` y `sourceSeason`.

Cada corredor dispone de ratings para:

- llano;
- sprint;
- montaña;
- colinas;
- pavé;
- CRI;
- CRE;
- resistencia;
- recuperación;
- aceleración;
- colocación;
- descenso.

Las figuras históricas más importantes tienen arquetipos y valores revisados manualmente. Las capacidades no pretenden ser mediciones fisiológicas oficiales: son ratings de simulación reproducibles basados en especialidad y rendimiento histórico.

## Modos compatibles

- Carrera individual histórica.
- Temporada encadenada con los equipos del año seleccionado.
- Carrera especial multi-era.
- Temporada especial multi-era, por ejemplo 1992 contra 2026.
- Igualación de capacidades entre épocas o diferencia tecnológica histórica.

## Maillots 3D

Cada estructura histórica obtiene representación 3D con año, abreviatura, colores y patrón determinista. Las estructuras icónicas tienen paletas específicas para que ONCE, Banesto, US Postal, Telekom, Kelme, Astana, Trek, Cofidis y Saunier Duval sean visualmente reconocibles.

## Funcionalidades conservadas

Se mantienen Race Director, clima, estado de la carretera, amenaza táctica, recomendación del director, retransmisión TV, motor CP/W′, grupos, ataques, corredores puente, abanicos, autobús, pavé, descensos, nutrición, material, neumáticos, CRI, CRE, objetivos A/B/C, calendario individual, staff nominal, contratos, scouting, cantera, mentoría, logística, telemetría, gráficos, alertas y palmarés.

## Límites de la base

La base 1990-2025 se apoya en un archivo histórico del Tour. Es una cobertura amplia del pelotón élite y de los equipos solicitados, pero no una base contractual universal con todos los profesionales inscritos en cada estructura durante los 37 años. Consulta `DATA_SOURCES.md`.
