# Informe de validación · Cycling Manager v0.25 Stage Lab

## Sintaxis

Se ejecutó `node --check` sobre todos los archivos JavaScript del paquete principal y de `stage-lab/`.

Resultado: **correcto**.

## Generador Stage Lab

Pruebas originales del generador ejecutadas:

- generación y exportación GPX;
- progreso y estructura plana;
- sincronización del mapa;
- actualización GeoJSON con teselas/DEM pendientes;
- recuperación adaptativa del enrutado Valhalla.

Resultado: **correcto**.

## Calendario completo

Se validaron los 36 eventos del calendario:

- modo geográfico compatible;
- número de etapas;
- vector de tipos de etapa;
- vector de distancias objetivo;
- configuración Stage Lab específica.

Además, se generaron y convirtieron automáticamente:

```text
36 eventos
164 etapas
54.746 puntos GPX compactados
```

Todas las etapas produjeron:

- GPX válido;
- al menos dos puntos de geometría;
- sectores físicos;
- tipo de etapa preservado;
- integración con el formato del simulador.

## Casos específicos

- Milano-Sanremo: clásica de un día, GPX integrado y convocatoria confirmada.
- Omloop Het Nieuwsblad: tipo `cobbles` preservado.
- Paris-Nice: ocho etapas y CRE preservada.
- Tour de France: 21 etapas generadas y convertidas.
- Giro d'Italia: 21 etapas generadas y convertidas.
- Vuelta a España: 21 etapas generadas y convertidas.

## Prueba de flujo en navegador

Mediante Chromium con contenido y scripts inyectados localmente se verificó:

### Carrera única

```text
selección de carrera
→ selección de equipo
→ apertura Stage Lab
→ generación del evento
→ aceptación GPX
→ convocatoria 8/8
→ confirmación
→ pantalla de carrera GPX
```

Resultado: **correcto**.

### Temporada

```text
primera carrera
→ Stage Lab
→ aceptación GPX
→ convocatoria
→ carrera
→ entre carreras
→ siguiente evento
→ nueva apertura automática de Stage Lab
```

Resultado: **correcto**.

## Perfil

Se comprobó la presencia de los diez colores requeridos:

```text
#1a4bff #2c7cff #2bb2ff #24c6c6 #14b81f
#63cf15 #b5c718 #e4c625 #ee9430 #dd5a22
```

Se verificó el renderizado SVG local de respaldo y la estructura ECharts de alta frecuencia.

## Limitación del entorno de prueba

La navegación directa a una URL local o `file://` mediante el navegador automatizado estaba bloqueada por la política del entorno. Por ello, las pruebas de navegador se ejecutaron con el HTML y los scripts inyectados en Chromium. La ejecución normal mediante servidor estático y GitHub Pages sigue siendo el método de despliegue previsto.
