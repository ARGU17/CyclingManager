# Cycling Manager Tour v0.25 Historical

Versión ampliada de **v0.24+** preparada para GitHub Pages. Conserva el motor anterior y añade una arquitectura de temporadas históricas, selector por año, cruce de épocas y staff nominal.

## Inicio rápido

1. Sube **todos los archivos y carpetas** a la raíz del repositorio.
2. Activa GitHub Pages desde la rama principal.
3. Abre `index.html` a través de la URL de GitHub Pages.
4. Pulsa **Borrar guardado** una vez si vienes de v0.24+.

> Los packs JSON se cargan con `fetch`; por ello, la selección histórica debe abrirse desde GitHub Pages o un servidor local. Abrir `index.html` directamente como `file://` puede bloquear la carga de JSON por seguridad del navegador.

## Modos históricos

- **Carrera única histórica:** equipos del año elegido.
- **Temporada histórica:** calendario encadenado y equipos de una única temporada.
- **Carrera especial multi-era:** mezcla equipos de varias temporadas.
- **Temporada especial multi-era:** calendario completo con generaciones enfrentadas.
- **Normalización igualada:** compara capacidades deportivas sin penalización tecnológica.
- **Tecnología de época:** aplica una pequeña diferencia en aerodinámica y crono a épocas antiguas.

## Cobertura incluida en el ZIP

| Año | Equipos | Corredores | Estado |
|---:|---:|---:|---|
| 2018 | 51 | 1.005 | Nombres/equipos procedentes de un dataset abierto derivado de PCS; ratings estimados |
| 2026 | 34 | 927 | Base completa del simulador v0.24+ |

La interfaz muestra de forma explícita qué años están incluidos y cuáles requieren generación. **No se inventan corredores para aparentar una base completa.**

## Generar 1990-2026

ProCyclingStats ofrece acceso a datos mediante solicitud de API y limita las peticiones durante 2026. El repositorio incluye un generador con caché, reintentos, validación y rate limiting.

### Desde GitHub Actions

1. Abre **Actions**.
2. Selecciona **Build historical database**.
3. Pulsa **Run workflow**.
4. Indica el rango de años.
5. Para construir nombres y plantillas rápidamente, deja `enrich_profiles = false`.
6. Para ratings más precisos basados en las páginas individuales de PCS, ejecuta uno o pocos años con `enrich_profiles = true`.

La acción crea `historical-data/AÑO.json`, actualiza el manifiesto y hace commit automático.

### Desde un ordenador

```bash
pip install requests beautifulsoup4 lxml
python tools/build_historical_database.py \
  --start-year 1990 \
  --end-year 2026 \
  --output historical-data \
  --cache .cache/pcs \
  --delay 1.5 \
  --rosters-only \
  --resume
```

Enriquecimiento de una temporada con perfiles individuales:

```bash
python tools/build_historical_database.py \
  --year 1992 \
  --output historical-data \
  --cache .cache/pcs \
  --delay 1.5
```

Validación:

```bash
python tools/validate_historical_database.py historical-data
```

## Formato de pack

```json
{
  "schemaVersion": 2,
  "season": 1992,
  "completeness": {
    "status": "complete",
    "teamCount": 32,
    "riderCount": 640
  },
  "teams": [],
  "riders": [],
  "calendar": []
}
```

Los packs también pueden importarse desde la pantalla inicial mediante **Importar pack JSON**.

## Ratings

Cuando se ejecuta el enriquecimiento completo, el generador intenta leer las categorías PCS de cada corredor:

- carreras de un día;
- general;
- contrarreloj;
- sprint;
- escalada;
- colinas.

A partir de ellas genera las capacidades del simulador:

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

Los packs creados con `--rosters-only` mantienen nombres y equipos, pero marcan los ratings como estimados hasta enriquecerse.

## Staff nominal

Se han añadido 23 profesionales ficticios y realistas, cada uno con:

- nombre;
- edad y nacionalidad;
- profesión;
- experiencia;
- coste;
- rasgos;
- habilidades específicas;
- efectos de carrera.

La selección de staff filtra candidatos según el puesto: director, entrenador, nutricionista, mecánico, analista u ojeador.

## Funciones anteriores conservadas

- Race Director y vista TV.
- Amenaza táctica y recomendación del director.
- Clima y estado de carretera.
- Motor de grupos, ataques y respuestas.
- CP/W′, potencia y pendiente.
- Fugas persistentes.
- Autobús, abanicos, descensos y pavé.
- CRI y CRE con salidas separadas.
- Nutrición automática/manual.
- Cuadros, ruedas, neumáticos y presiones.
- Calendario individual y objetivos A/B/C.
- Contratos, promesas, mentoría y scouting.
- Logística y staff por carrera.
- Telemetría, gráficos, alertas y palmarés.
- Selección bloqueada de ocho corredores.

## Uso responsable de datos

Revisa los términos de la fuente antes de ejecutar extracciones masivas. El generador usa una espera mínima, caché y reintentos. Para un proyecto público o comercial, solicita acceso oficial a la API de PCS.
