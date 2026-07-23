# Changelog

## v0.27 · GPX Stage Lab

### Integración

- Fusionado Grand Tour Stage Lab con v0.26 Director Suite.
- Stage Lab se abre después de seleccionar equipo y antes de la convocatoria.
- Compatible con carrera individual, temporada, carrera multi-era y temporada multi-era.
- Compatible con eventos de una etapa, vueltas cortas y grandes vueltas.
- Las pantallas y sistemas de v0.26 no se sustituyen.

### Motor GPX

- Física por pendiente cada 250 m.
- Pendiente interpolada desde el track real.
- Viento efectivo según orientación de la carretera.
- Riesgo de viento lateral y abanicos sobre la geometría GPX.
- Simulación específica para carretera, CRI y CRE.
- Detección automática de puertos y finales en alto.
- Sectores generados según ascenso, descenso y pendiente máxima.
- Integración con CP, W′, energía, hidratación, telemetría y grupos.

### Visualización

- Perfil GPX interactivo.
- Mapa del recorrido.
- Scrubber de distancia.
- Lectura de km, distancia restante, altitud y pendiente.
- Grupos sincronizados sobre perfil y recorrido.
- Leyenda de pendientes.
- Tarjetas de sectores GPX.

### Stage Lab

- Generación procedural de eventos completos.
- Condicionantes en lenguaje natural.
- Importación GPX local.
- Enrutado opcional por carreteras reales.
- Exportación ZIP.
- Recuperación adaptativa de rutas rechazadas.
- Mapa 3D y perfil sincronizados.

### Base incluida

- Añadidos 18 GPX del Tour aportados por el usuario.
- Añadida base preprocesada `gpx-stage-data.js`.
- Añadido evento Tour GPX adicional.

### Correcciones

- Corregida la identificación de grandes vueltas.
- `uae_tour` ya no se clasifica como Tour de France.
- Tour, Giro y Vuelta mantienen 22 equipos; UAE Tour y otras pruebas permiten hasta 25.
- Baselines de etapas capturados dinámicamente para años históricos y cruces multi-era.
- Carga asíncrona de partidas adaptada para restaurar el GPX antes del render final.
- Eliminada la dependencia del hotfix antiguo `v024PlusPersist`.

### Compatibilidad

- Mantiene la clave y el esquema de guardado v0.26.
- Conserva la base histórica, base 2026, staff, U23, infraestructura y todos los sistemas deportivos anteriores.
