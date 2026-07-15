# Changelog · Cycling Manager Tour v0.25

## Grand Tour Stage Lab

- Integración de Grand Tour Stage Lab como pantalla intermedia después de escoger competición y equipo.
- Apertura automática antes de cada carrera en modo temporada.
- Configuración específica para los 36 eventos del calendario.
- Conservación del número, orden, formato y distancias objetivo de las etapas.
- Soporte geográfico ampliado a Francia, España, Italia, Australia, Emiratos Árabes Unidos, Bélgica, Países Bajos, Benelux, Alemania, Suiza, Dinamarca, Polonia, Canadá, China y eventos mundiales.
- Transferencia del recorrido generado al motor nativo de Cycling Manager mediante un puente seguro `postMessage`.
- Opción de continuar con los recorridos ya existentes sin generar uno nuevo.

## Perfil y visualización

- Perfil de alta frecuencia con diez intervalos de color estilo Radial.
- Colorimetría idéntica en Stage Lab y en la pantalla de carrera.
- Cursor, zoom, desplazamiento, lectura de pendiente, altitud, km y distancia restante.
- Sincronización entre perfil, mapa y grupos de carrera.
- Mapa 2D/3D y enrutado opcional por carreteras OpenStreetMap/Valhalla.

## Motor GPX

- Conversión automática de las etapas generadas al formato del simulador.
- Compactación de geometría para persistencia y rendimiento.
- Detección automática de puertos y sectores.
- Física GPX cada 250 m.
- Pendiente y rumbo real aplicados a potencia, CP/W′, velocidad, viento y abanicos.
- Preservación de formatos especiales: pavé, CRI y CRE.

## Compatibilidad

- Conservados todos los sistemas de v0.24 y v0.24+.
- Conservado el hotfix de confirmación de ocho corredores.
- Conservada la clave de guardado `cyclingManager_v024`.
- La geometría completa se limita al evento activo para contener el tamaño del guardado.
