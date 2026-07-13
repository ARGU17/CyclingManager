# Cycling Manager Tour v0.12

Archivos listos para publicar en GitHub Pages.

## Cómo usar

1. Sustituye en tu repositorio:
   - `index.html`
   - `data.js`
   - `game.js`
   - `styles.css`
2. Sube los cambios a GitHub Pages.
3. Abre la web y pulsa **Borrar guardado** una vez para limpiar partidas de versiones anteriores.

## Cambios v0.12

- 18 WorldTeams + 16 ProTeams 2026 incluidos como equipos seleccionables.
- Calendario de temporada reordenado según calendario UCI WorldTour 2026 de ProCyclingStats.
- CRI corregida: salida individual cada 2 minutos, sin rebufo ni agrupamientos.
- CRE corregida: equipos salen cada 5 minutos, con controles de relevos e intensidad.
- CRE: el tiempo lo marca el 4º corredor y el equipo no se divide salvo descolgados.
- Nutrición automática mejorada por sector, con stock de coche ampliado.
- Clima explícito: temperatura, lluvia, humedad de carretera, viento y viento lateral aplican a velocidad/riesgo.
- Fugas más estables: una fuga con ventaja grande ya no desaparece de golpe antes del último sector.
- Perfil 2D con un punto por kilómetro.
- Grupos con km, velocidad media y W/kg estimado.
- Más realismo montaña: los sprinters quedan penalizados en puertos y finales en alto.
- Entrenamientos ampliados con camps: Teide, Sierra Nevada, Andorra, pavé, crono, calor, CRE, etc.

## Nota sobre datos

La estructura de equipos, clases y calendario se ha basado en ProCyclingStats/UCI 2026. Los ratings deportivos son internos del simulador. En equipos sin plantilla completa introducida manualmente, el archivo completa hasta el tamaño de plantilla PCS con neo-pros generados para mantener la escala del pelotón y permitir simulaciones grandes sin romper el juego.
