# Changelog

## v0.25 Historical

### Base histórica
- Selector de temporada entre 1990 y 2026.
- Equipos filtrados por año.
- Temporada y carrera única por año.
- Cruce de épocas en carrera única o temporada.
- Normalización igualada o tecnología de época.
- IDs aislados por temporada para impedir colisiones.
- Importación manual de packs JSON.
- Manifiesto de cobertura y estado de completitud.

### Datos incluidos
- Pack 2018: 51 equipos y 1.005 corredores de un dataset abierto derivado de PCS.
- Pack 2026: 34 equipos y 927 corredores de la base v0.24+.
- Generador 1990-2026 con caché, rate limit, reintentos y validación.
- GitHub Action manual para crear y confirmar packs.

### Visual
- Maillot 3D generado por equipo y temporada.
- Cuatro patrones de maillot.
- Badge del año en cada equipo.
- Buscador y filtro de nivel.
- Panel de procedencia y cobertura de datos.

### Staff
- 23 profesionales nominales ficticios.
- Profesión, nacionalidad, edad, experiencia, coste y rasgos.
- Habilidades visualizadas por barras.
- Candidatos filtrados según el puesto de carrera.

### Compatibilidad
- Conservadas todas las funciones de v0.24+.
- Nueva clave de guardado `cyclingManager_v025historical`.
