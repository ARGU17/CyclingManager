# Changelog

## v0.29.1 · Interaction Hotfix

- Corregido el bloqueo total de la pantalla inicial.
- Eliminado el bucle infinito entre `MutationObserver` y `decorateV029Interface()`.
- El decorador visual ahora es idempotente: no reescribe clases, título ni texto si ya tienen el valor correcto.
- Restaurada la interacción de las cuatro tarjetas de modo.
- Validado el avance desde Modo a Carrera en Chromium real.
- Añadido cache-busting para `v029-club.js?v=0.29.1`.
- Conservada la clave de guardado v0.29 y todas las funciones heredadas.

## v0.29 · Club HQ & Sponsors

### Arquitectura

- Implementación aditiva cargada después de v0.28.
- Ningún archivo heredado eliminado.
- Estado persistente aislado en `Game.v029`.
- Compatibilidad con el guardado principal anterior.
- Integración con carrera única, temporada, histórico y multi-era.

### Sede

- 18 posibles ciudades de sede.
- Diez atributos territoriales por ciudad.
- Coste operativo y coste de traslado.
- Historial de reubicaciones.
- Elección inicial antes de la convocatoria.
- Modificadores de entrenamiento, talento, ciencia, logística y mercado.

### Campus

- Nuevo mapa visual del campus.
- 10 instalaciones con niveles 0–5.
- CAPEX, OPEX, capacidad, duración y condición.
- Proyectos simultáneos y avance temporal.
- Aceleración de obra.
- Mantenimiento extraordinario.
- Efectos conectados al motor deportivo y a la gestión.

### Bases secundarias

- 10 bases satélite internacionales.
- Coste de apertura y mantenimiento anual.
- Especializaciones en altitud, clásicas, calor, scouting, logística y aerodinámica.

### Patrocinadores

- Mercado de 61 empresas ficticias de simulación.
- 13 sectores comerciales.
- Title sponsor, co-title, secundarios, técnicos e institucionales.
- Ofertas dinámicas.
- Prima de firma, fijo, variables, duración y activaciones.
- Derechos de nombre y color.
- Exclusividades y límites de activos comerciales.
- Contraofertas y probabilidad de aceptación.
- Rescisión con penalización.
- Satisfacción individual por contrato.
- Renovación y cierre de temporada.

### Socios técnicos

- 9 categorías de producto.
- 45 marcas ficticias de simulación.
- Contratos asociados a materiales, vehículos, datos, nutrición y medicina.

### Finanzas

- Cuenta de resultados proyectada.
- Separación de caja, ingresos y gastos comprometidos.
- OPEX de campus, bases y flota.
- Salarios de corredores y staff.
- Ledger persistente.
- Línea de crédito, deuda y amortización.
- Cálculo de valor del club.

### Organización

- Organigrama de 10 puestos ejecutivos.
- Asignación desde el staff ya contratado.
- Calidad organizativa, moral departamental y carga de trabajo.
- Acceso directo al mercado de staff anterior.

### Marca y aficionados

- 10 identidades de club.
- Gestión de colores y nombre comercial.
- 12 mercados regionales de aficionados.
- Seguidores sociales.
- Precio de merchandising.
- Estrategia de contenido.
- Campañas digitales, regionales, documentales y hospitality.

### Exposición y eventos

- Cálculo postcarrera de exposición comercial.
- Impacto sobre satisfacción, aficionados, ventas y valor.
- 12 tipos de eventos dinámicos.
- Tres respuestas posibles por evento.
- Historial de decisiones.

### Interfaz

- Nueva pestaña `Sede & Sponsors`.
- Dashboard de club.
- Vista de sede, campus, patrocinadores, finanzas, marca, organigrama, bases e historial.
- Estilo Graphite Performance coherente con v0.28.
- Acceso al Club HQ entre carreras y desde la pantalla final.

### Compatibilidad

- Stage Lab y GPX sin modificaciones destructivas.
- Motor físico, CP/W′ y Race Director preservados.
- Archivo histórico y base 2026 preservados.
- Mercados de staff y U23 preservados.
- Infraestructura, autobuses, coches y departamentos de v0.26 preservados.
