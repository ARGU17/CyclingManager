# Informe de validación · v0.27

## Validaciones de sintaxis

- Todos los JavaScript de la raíz: correctos.
- Todos los JavaScript de `stage-lab`: correctos.
- Herramientas Python: compilación correcta.
- Referencias CSS/JS de `index.html`: sin archivos ausentes.
- Referencias CSS/JS de `stage-lab/index.html`: sin archivos ausentes.

## Prueba integral v0.27

Ejecutada con:

```bash
node tools/smoke_test_v027.js
```

Resultado:

- Asistente inicial v0.26 preservado.
- Módulos GPX cargados.
- 34 equipos 2026.
- 927 registros de corredor 2026.
- 1.000 perfiles de staff.
- 1.000 corredores U23.
- Stage Lab abre antes de la convocatoria.
- Aceptación GPX correcta.
- Conversión a perfil y sectores correcta.
- Convocatoria confirmada.
- Perfil GPX visible en Race Director.
- Simulación rápida con tiempos finitos.
- Telemetría postetapa disponible.
- Temporada abre Stage Lab en la carrera activa.
- Multi-era mantiene su selector de pelotón.
- UAE Tour no se confunde con Tour de France.

## Prueba de vuelta completa

Ejecutada con:

```bash
node tools/test_v027_stage_lab_multistage.js
```

Resultado:

- Tour de France generado con 21 etapas.
- 21/21 etapas convertidas a GPX.
- 6.699 puntos de recorrido integrados en la prueba.
- Todas las etapas con perfil y sectores.
- Convocatoria confirmada.
- Motor por sectores iniciado correctamente.

## Pruebas propias de Stage Lab

Ejecutadas con:

```bash
cd stage-lab
npm test
```

Resultados:

- Generación de vueltas validada.
- Exportación GPX validada.
- Progreso por etapas validado.
- Sincronización del mapa validada.
- Recuperación adaptativa de enrutado validada.

## Regresión v0.26

Ejecutada con:

```bash
node tools/smoke_test_v026_full.js
```

Resultados:

- Carrera normal: 25 equipos.
- Tour: 22 equipos.
- Multi-era: 22 equipos en calendario con gran vuelta.
- Base 2026 completa.
- Mercado de staff funcional.
- Mercado U23 funcional.
- Compra de autobús funcional.
- Mejora de departamentos funcional.
- Simulación con tiempos válidos.
- Guardado y carga multi-era funcionales.

## Archivos servibles

Comprobados mediante servidor HTTP local:

- `/index.html`: 200 OK.
- `/stage-lab/index.html`: 200 OK.
- `/gpx-stage-data.js`: 200 OK.
