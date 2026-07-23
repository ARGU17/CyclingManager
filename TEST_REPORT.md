# Informe de validación — v0.26 Director Suite

## Resultado

**VALIDACIÓN SUPERADA**

## Base de datos

- 37 temporadas cargables: 1990–2026.
- 806 equipos-temporada.
- 7.053 registros de corredor.
- 2026 restaurado con 34 equipos, 927 registros de corredor y 36 carreras.
- Manifiesto, `historical-data/2026.json` y archivo de carga inmediata sincronizados.

## Asistente de inicio

- La primera pantalla contiene únicamente la elección de modo.
- La segunda pantalla contiene año y carrera/calendario.
- En modo multi-anual aparece una ventana independiente de selección del pelotón.
- La selección de equipo se muestra después de cerrar los pasos anteriores.
- La convocatoria de ocho corredores confirma y abre el juego.

## Límites de equipos

- Carrera de un día probada con 25 equipos.
- Tour de France probado con 22 equipos.
- Temporada multi-anual con grandes vueltas limitada a 22 equipos.
- El equipo del jugador permanece incluido en la selección automática.

## Staff y gestión

- 1.000 perfiles de staff cargados.
- 57 perfiles nominales/documentados y 943 generados.
- Mercado, filtros y paginación renderizados.
- Fichaje de un profesional desde otro equipo validado.
- Eliminación correcta de su plantilla anterior y asignación al nuevo equipo.
- Contratos, cláusulas y presupuesto actualizados.

## Infraestructura

- Ocho autobuses cargados.
- Diez coches cargados.
- Compra y activación de autobús validada.
- Diez departamentos disponibles.
- Apertura/mejora de departamento y descuento de presupuesto validados.

## Cantera

- 1.000 jóvenes cargados.
- 35 nombres documentados y 965 generados.
- Base máxima: 77.
- Perfiles con potencial 94 o superior: 1/1.000.
- Fichaje U23 probado: incorporación a plantilla y contrato correctos.

## Simulación y persistencia

- Simulación rápida completada con resultados.
- Todos los tiempos son finitos; sin `NaN`.
- Guardado y carga de una temporada especial 1992 + 2026 validados.
- La carga restaura equipos, carreras, convocatoria y modo multi-era.
- Sintaxis comprobada en todos los archivos JavaScript.
- Compilación de herramientas Python comprobada.
- ZIP verificado sin archivos dañados.

Prueba principal: `tools/smoke_test_v026_full.js`.
