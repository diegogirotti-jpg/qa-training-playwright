# Métricas y baseline

El 03/11 se comprobó en el tablero oficial de Arturia un baseline existente del 30/10: 10 casos UI, 2 API y 55.9 segundos para nueve UI sin login. No se reemplazó ni se retrodató. Fuente histórica: [revisión del refactor](../toolshop-refactor.md), commit 8713611; es un registro documental, no un JSON original de esa corrida.

Se agregó el registro del 03/11 con inventario confirmado 10 UI y 2 API y una nueva corrida de nueve UI sin login: 9 aprobados, 0 fallidos, 0 omitidos, 58.414619 segundos. Ver [snapshot verificable](snapshot-20261103.json), [cálculo](calcular.py), [resultado](metricas.json) y [captura de Arturia](arturia-baseline-20261103.png).

## Definiciones

| Métrica | Fuente y cálculo | Alcance |
| --- | --- | --- |
| Casos UI automatizados | Casos detectados en `e2e/toolshop`, un proyecto Chromium | Inventario implementado, no aprobaciones ni cobertura de requisitos |
| Casos API automatizados | Casos detectados en `e2e/api`, un proyecto Chromium | Inventario implementado; no se ejecutaron en esta corrida |
| Duración de 9 UI sin login | `stats.duration / 1000` del ejecutor Playwright | Tiempo total de una corrida local de carrito, búsqueda y orden; 1 worker, 0 retries |

Recalcular desde la raíz: `python3 evidencias/baseline/calcular.py`. El snapshot se extrajo del JSON emitido por Playwright; conserva los títulos, estados, intentos, duraciones y total necesarios para revisar el cálculo, sin incluir configuración de credenciales.

Las dos comprobaciones de bugs sembrados y los cuatro controles internos del generador están separados de estos conteos. Tampoco se incluyen el seed ni el ejercicio inicial. El login negativo está implementado y cuenta en inventario, pero no se ejecutó ahora.

La duración aumentó 4.5% respecto del registro histórico. Dos observaciones no establecen tendencia; la demo compartida, red y equipo pueden variar. No se midieron tiempo manual, ahorro, cobertura porcentual, defectos escapados ni flakiness histórica. No asignamos cero a esos datos desconocidos.

El tablero se observó con estado Guardado. Su texto indica almacenamiento local para el usuario; la captura y esta copia versionada respaldan la entrega, sin afirmar sincronización entre dispositivos. Las referencias sugeridas de la plantilla pueden no corresponder a los nombres personalizados; las definiciones aplicables son las de esta tabla.
