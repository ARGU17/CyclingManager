# Informe de validación · v0.29.1 Interaction Hotfix

## Diagnóstico del bloqueo

La v0.29 heredaba de v0.27 un `MutationObserver` sobre `#app`. El observador ejecutaba dinámicamente `decorateV027Interface`, reasignada posteriormente a `decorateV029Interface`. Esta última escribía `textContent = "V0.29"` en cada ejecución, incluso cuando el texto ya era idéntico. Cada escritura generaba una nueva mutación, que volvía a ejecutar el observador. El resultado era un bucle infinito de microtareas y una interfaz visualmente cargada pero sin respuesta a clics.

## Validación en navegador real

Prueba ejecutada con Chromium mediante Chrome DevTools Protocol:

- Los veinte scripts principales cargan sin excepción.
- `v029-club.js` termina su ejecución; ya no bloquea el hilo principal.
- Se renderizan las tarjetas Graphite v0.28/v0.29 con sus iconos SVG.
- Existen seis botones interactivos en el primer paso.
- La tarjeta `Carrera individual` responde al clic.
- El asistente avanza a la pantalla de selección de carrera.
- Se renderizan 37 tarjetas de carrera.
- El título y la marca visible muestran v0.29.1.

## Regresión automatizada

- `node tools/smoke_test_v029.js`: superado.
- `node tools/smoke_test_v028.js`: superado.
- `node tools/smoke_test_v027.js`: superado.
- Sintaxis de todos los JavaScript raíz: válida.

---

## Informe heredado · v0.29 Club HQ & Sponsors

## Integridad de archivos

Comparación directa con v0.28:

- Archivos funcionales de v0.28, excluyendo cachés Python generadas: **134**.
- Archivos funcionales de v0.29: **140**.
- Archivos funcionales heredados eliminados: **0**.
- Archivos aditivos: `v029-data.js`, `v029-club.js`, `v029.css`, `club-showcase.html` y `tools/smoke_test_v029.js`.

Los documentos de versión se actualizaron sin eliminar módulos funcionales.

## Sintaxis

- Todos los JavaScript de la raíz: válidos.
- Todos los JavaScript directos de `stage-lab`: válidos.
- `v029-data.js`: válido.
- `v029-club.js`: válido.
- `tools/smoke_test_v029.js`: válido.
- Referencias de `index.html`: presentes.

## Prueba integral v0.29

Ejecutada con:

```bash
node tools/smoke_test_v029.js
```

Resultado:

- Estado v0.29 inicializado.
- 18 sedes cargadas.
- 10 instalaciones cargadas.
- Elección de Girona validada.
- Onboarding previo a la convocatoria validado.
- Stage Lab compatible.
- Convocatoria de ocho corredores funcional.
- 13 ofertas comerciales generadas en la ronda inicial.
- Contrato de patrocinio aceptado.
- Construcción de instalación iniciada.
- Dashboard `Sede & Sponsors` renderizado.
- Simulación de carrera completada.
- Exposición comercial postcarrera registrada.
- Satisfacción de patrocinadores actualizada.
- Guardado y carga del estado empresarial validados.
- 34 equipos 2026.
- 927 corredores 2026.

## Regresión v0.26

Ejecutada con:

```bash
node tools/smoke_test_v026_full.js
```

Resultado:

- 34 equipos y 927 corredores en 2026.
- Mercado de 1.000 profesionales de staff.
- Mercado de 1.000 corredores U23.
- Carrera normal limitada a 25 equipos.
- Tour limitado a 22 equipos.
- Temporada multi-era con gran vuelta limitada a 22 equipos.
- Fichaje de staff rival funcional.
- Incorporación U23 funcional.
- Compra de autobús funcional.
- Departamentos actualizables.
- Guardado multi-era funcional.

## Regresión v0.27 GPX

Ejecutada con:

```bash
node tools/test_v027_stage_lab_multistage.js
```

Resultado:

- Tour generado con 21 etapas.
- 6.699 puntos de perfil integrados.
- Primera etapa dividida en 22 sectores.
- Conversión Stage Lab → motor de carrera operativa.

## Stage Lab

Ejecutadas:

```bash
node stage-lab/smoke-test.js
node stage-lab/map-sync-test.js
node stage-lab/routing-recovery-test.js
```

Resultado:

- Generación de vueltas validada.
- GPX validado.
- Progreso y estructura plana validados.
- Mapa sincronizado aunque las teselas o DEM estén pendientes.
- Recuperación adaptativa de rutas rechazadas validada.

## Archivo histórico

Ejecutado con:

```bash
python tools/validate_historical_database.py historical-data
```

Resultado:

- Temporadas 1990–2026 procesadas.
- Cero errores de integridad.
- 2026: 34 equipos y 927 corredores.
- Se conservan advertencias informativas de plantillas históricas cortas en algunos años; no bloquean la carga.

## Compatibilidad

- Ninguna función anterior se sustituye por datos ficticios de patrocinio.
- Los nombres comerciales nuevos están marcados como contenido de simulación.
- La pestaña anterior de Club / Infraestructura sigue disponible.
- La v0.29 amplía la interfaz y el estado; no reemplaza el motor deportivo.
