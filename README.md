# Cycling Manager Tour v0.14

Versión estable corregida para GitHub Pages.

## Instalación

Sube estos archivos al repositorio:

- `index.html`
- `data.js`
- `game.js`
- `styles.css`

Después abre la web y pulsa **Borrar guardado** para limpiar partidas antiguas.

## Corrección principal v0.14

- Simulación de tiempos corregida: no debe volver a aparecer `NaN:NaN`.
- Validación numérica interna en todos los tiempos de carrera.
- Guardado versionado: no carga partidas antiguas incompatibles.
- CRI: cada corredor corre solo, con salida cada 2 minutos, sin grupos ni rebufo.
- CRE: cada equipo sale cada 5 minutos, tiempo del equipo por el 4º corredor.
- CRE de carreras de una semana corregida: distancia realista de crono por equipos.
- Fallback de seguridad: si un tiempo se corrompe, el simulador recalcula un tiempo válido.
- Nutrición, clima, fugas, grupos, W/kg, velocidad y perfil 2D por kilómetro conservados.

## Nota

Si vienes de v0.13 o anterior, no uses el botón Cargar. Pulsa primero **Borrar guardado**.
