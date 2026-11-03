# Entrega del path QA — 03/11/2026

Proyecto de capacitación Toolshop; sin datos ni acceso al proyecto del cliente. Este índice reúne la evidencia y distingue los requisitos pendientes de aceptación o de participación de otra persona. No equivale a una aprobación del referente.

## Métricas y baseline

[Definiciones, fuentes y cálculo](../evidencias/baseline/README.md) · [Métricas calculadas](../evidencias/baseline/metricas.json) · [Captura del tablero oficial](../evidencias/baseline/arturia-baseline-20261103.png).

| Fecha | UI implementados | API implementados | Duración de 9 UI sin login |
| --- | ---: | ---: | ---: |
| 30/10/2026 — baseline histórico confirmado | 10 | 2 | 55.9 s |
| 03/11/2026 — nueva medición | 10 | 2 | 58.4 s |

La nueva corrida ejecutó nueve UI sin login: nueve aprobados, cero fallidos y cero omitidos; Chromium, un worker y cero reintentos. No se ejecutó el login negativo ni los dos API en esta medición. El conteo de tests implementados se calculó con discovery; no significa doce aprobados. Una comparación aislada no demuestra tendencia ni ahorro de tiempo manual.

El tablero oficial quedó con estado Guardado y ambos registros. Se conserva también un [respaldo HTML con esos valores](../evidencias/baseline/tablero-respaldo-20261103.html); se debe descargar y abrir para usarlo, ya que GitHub muestra su código. El archivo original de Downloads no se reemplazó.

## Automatización de procesos y reportes

- [Guía reproducible para otra persona](AUTOMATED-BUG-REPORTS.md).
- [Workflow versionado](../.github/workflows/diagnostic-bugs.yml): PR hacia main y ejecución manual; no usa secretos.
- [Corrida verificada en GitHub](https://github.com/diegogirotti-jpg/qa-training-playwright/actions/runs/41641759716), commit c2f7ea5. Typecheck y cuatro controles internos aprobados. Dos comprobaciones en navegador fallaron por los defectos esperados, ambos clasificados como HALLAZGO_REPRODUCIDO. Se descargó y verificó el artefacto toolshop-diagnostic.
- El artefacto incluye reportes Markdown estándar, observación JSON, capturas, errores literales y traces. Disponible 14 días desde la corrida; descargar para conservarlo más tiempo.
- El código de salida fallido se conserva. Un fallo de red o datos incompletos queda inconcluso; no se presenta automáticamente como bug del producto.
- El bloqueo del merge requiere reglas de protección compatibles y exigir el check; no se acredita con solo tener un workflow rojo.

**Pendiente real:** ejecución siguiendo el README por un compañero, con fecha, commit, entorno y resultado. La ejecución propia y la de Actions no sustituyen ese requisito. Registrar su devolución en [validación por compañero](VALIDACION-COMPANERO.md).

## QATES en Claude

[Evidencia de instalación y uso de roles](../evidencias/qates/README.md). Se identificaron qates y qates-web 0.10.0 y llamadas a qa-reviewer y qa-automator del 30/10 sobre esta suite. Se conservan extractos y [la revisión crítica que corrigió errores del informe](../evidencias/qates-review.md). El nuevo generador determinista de reportes no se presenta como QATES.

## Tres reportes con impacto medido

[Índice de reportes y evidencia en el repositorio público del challenge](https://github.com/diegogirotti-jpg/challenge-playwright-booker/blob/main/docs/bugs/README.md).

- BUG-001: reserva en blanco, tres IDs con HTTP 500; evidencia histórica del 30/10, sin causa raíz identificada. Sus faltantes siguen explícitos; no se lo presenta como revalidado hoy.
- BUG-002: Home abre Contacto; dos de dos clics históricos, y nueva reproducción automática separada.
- BUG-003: orden de precios invertido; nueve tarjetas y ocho pares fuera de orden en cada intento histórico; nueva reproducción automática separada.

Para BUG-002 y BUG-003 se identificaron template, clase y cambio de incorporación en el commit raíz público de Toolshop. [Investigación y límites](https://github.com/diegogirotti-jpg/challenge-playwright-booker/blob/main/docs/evidence/toolshop-with-bugs/source-investigation.md). No se confirmó el commit desplegado. Son bugs sembrados conocidos; su aceptación como entregable corresponde al referente. [Revisión del formato](https://github.com/diegogirotti-jpg/challenge-playwright-booker/blob/main/docs/bugs/revision-standard-20261103.md).

## Estado de presentación

Classroom mostró ambas tareas como pendientes de entrega y con vencimiento hoy 03/11 cuando se revisaron. El primer test con Playwright figura aprobado con 100/100 en la captura aportada. Las capturas y los enlaces técnicos no acreditan aprobación del resto del path ni del proyecto del cliente.
