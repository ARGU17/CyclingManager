# Informe de validación v0.25 Historical

Fecha: 22-07-2026

## Sintaxis

- `data.js`: correcto.
- `v024-data.js`: correcto.
- `game.js`: correcto.
- `v024-expansion.js`: correcto.
- `historical-manifest.js`: correcto.
- `staff-database.js`: correcto.
- `historical-engine.js`: correcto.

## Packs

### 2018
- 51 equipos.
- 1.005 corredores.
- 0 IDs duplicados.
- 0 corredores huérfanos.
- 0 ratings inválidos.
- 5 avisos por equipos de desarrollo con menos de seis corredores en el dataset fuente.

### 2026
- 34 equipos.
- 927 corredores.
- 0 IDs duplicados.
- 0 corredores huérfanos.
- 0 ratings inválidos.

## Flujos probados

- Renderizado de la pantalla inicial histórica.
- Carga asíncrona del pack 2018.
- Cambio de 2026 a 2018.
- Selección automática de ocho corredores.
- Confirmación y bloqueo del roster.
- Renderizado del mercado de staff nominal.
- Renderizado de operaciones y asignación por profesión.
- Cruce 2018 + 2026.
- 85 equipos combinados sin colisión de IDs.
- Guardado separado de v0.24+.

Prueba automatizada: `node tools/smoke_test_v025.js`.
