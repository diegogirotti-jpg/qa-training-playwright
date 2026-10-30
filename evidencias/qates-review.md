# Revisión crítica del informe de qates:qa-reviewer

- Fecha: 2026-10-30
- Alcance: revisión estática del informe de `qates:qa-reviewer` contra el código actual en `main` (8aa230f).
- Restricciones: no se ejecutaron tests, no se leyeron `.env` ni reportes o trazas y no se modificaron archivos existentes.

## Fuentes contrastadas

- `specs/toolshop-plan.md`
- `e2e/toolshop/cart.spec.ts`
- `e2e/toolshop/catalog.spec.ts`
- `e2e/toolshop/search.spec.ts`
- `e2e/toolshop/login-invalid-password.spec.ts`
- `e2e/pages/LoginPage.ts`
- `e2e/seed.spec.ts`
- `e2e/carrito.spec.ts`
- `e2e/api/product-search.spec.ts`
- `playwright.config.ts`
- `.github/workflows/playwright.yml`
- `.github/workflows/playwright-diagnostic.yml`

## 1. Conteo real de casos

| Grupo | Archivo | Tests | ¿Corre en `playwright.yml`? |
|---|---|---|---|
| UI, plan Toolshop | `e2e/toolshop/cart.spec.ts` | 6 (1.1 a 1.6) | Sí |
| UI, plan Toolshop | `e2e/toolshop/search.spec.ts` | 2 (1.7 y 1.8) | Sí |
| UI, plan Toolshop | `e2e/toolshop/catalog.spec.ts` | 1 (2.3) | Sí |
| UI, plan Toolshop | `e2e/toolshop/login-invalid-password.spec.ts` | 1 (2.2) | Sí |
| **Subtotal de casos UI del plan** | **4 archivos** | **10** | |
| API (otro plan: `specs/toolshop-api-plan.md`) | `e2e/api/product-search.spec.ts` | 2 | Sí |
| Seed de exploración | `e2e/seed.spec.ts` | 1 | No |
| Ejercicio inicial | `e2e/carrito.spec.ts` | 1 | No |
| **Total bajo `testDir: ./e2e`** | **7 archivos** | **14** | |

**Corrección al informe:** qa-reviewer habló de "11 tests" en `e2e/toolshop/`. En realidad hay **10 casos UI**, uno por cada escenario 1.1 a 1.8, 2.2 y 2.3. El escenario 2.1 sigue pendiente y no tiene test, como indica el plan.

En CI el workflow ejecuta 10 casos UI y 2 de API, es decir 12 tests y 12 ejecuciones, porque corre un solo proyecto. Ni `seed.spec.ts` ni `carrito.spec.ts` se ejecutan en CI.

## 2. Ejecución en CI y valores del config

| Parámetro | `playwright.config.ts` (local, sin `CI`) | `playwright.config.ts` (con `CI=true`) | `playwright.yml` (lo que realmente corre) |
|---|---|---|---|
| Proyectos | chromium, firefox y webkit | chromium, firefox y webkit | **solo chromium** (`--project=chromium`) |
| Workers | `undefined`, que usa el valor por defecto de Playwright | 1 | **1** (`--workers=1`) |
| Reintentos | 0 | 2 | **0** (`--retries=0` pisa al `2` del config) |
| `fullyParallel` | true | true | true, aunque no tiene efecto práctico con un solo worker |
| Rutas | todo `e2e/` | todo `e2e/` | `e2e/toolshop` y `e2e/api` |
| Credenciales | `.env` si existe | variables de entorno | secrets `TOOLSHOP_EMAIL`, `TOOLSHOP_PASSWORD` y `TOOLSHOP_NEGATIVE_EMAIL` |

`playwright-diagnostic.yml` usa la misma configuración: chromium, 1 worker y 0 reintentos, con `--trace=on`. Además restringe la ejecución a 4 títulos mediante `--grep`.

**Corrección al informe:** qa-reviewer atribuyó a CI "3 navegadores en paralelo, 2 retries en CI y `fullyParallel`". Eso es falso. En CI, el login negativo hace **un único intento por ejecución del workflow**. Los 3 proyectos y el paralelismo solo aplican en ejecuciones locales sin flags. En ese caso el login negativo se intenta 3 veces por corrida, una por navegador, posiblemente en paralelo y sin reintentos.

Un solo intento por ejecución no implica que no haya riesgo de bloqueo: los intentos fallidos se acumulan entre ejecuciones de CI. Ver sección 3, punto 3.

## 3. Interpretaciones corregidas

1. **Ordenamiento (2.3).** El informe propone exigir que el orden final difiera del inicial. Eso es incorrecto: si la lista inicial ya estaba ordenada, el ordenamiento sigue siendo correcto, y el plan solo exige `precio[i] <= precio[i+1]` sobre la página visible (plan:144-147). El oráculo actual (`catalog.spec.ts:21-45`) se ajusta al plan.
2. **Variables faltantes (2.2).** El informe propone usar `test.skip` cuando faltan variables. Eso queda descartado: `login-invalid-password.spec.ts:10-18` lanza errores explícitos de configuración, y debe seguir así para que una falta de secrets no pase desapercibida como test omitido.
3. **Cuenta bloqueada.** El informe original atribuía el riesgo a una configuración de CI equivocada (3 navegadores y 2 reintentos; ver sección 2). En CI hay un solo intento por ejecución, pero eso no elimina el riesgo. Los intentos fallidos pueden acumularse entre ejecuciones sucesivas del workflow (cada PR, cada push a un PR y cada `workflow_dispatch`) y sumarse a los intentos locales. Si la app bloquea por intentos fallidos acumulados en una ventana de tiempo, la cuenta negativa puede terminar en `Account locked` aunque cada corrida haga un único intento. Las ejecuciones locales con 3 proyectos agravan el riesgo, pero no son la única fuente.
4. **Estado del escenario 2.2.** El informe lo marcó como "Parcial" porque no se verifica antes del intento que la cuenta no esté bloqueada. El test cubre la parte observable desde la UI:
   - `Account locked` se trata como fallo explícito (`:39-44`).
   - Se comprueba el mensaje de credenciales inválidas, la URL `/auth/login`, el heading de login y `nav-sign-in` (`:46-49`).
   - La precondición sobre la cuenta es un dato de entorno, no algo verificable por UI antes del envío.

   Se reclasifica como **Cubierto, con supuesto de datos a confirmar**.
5. **Seed.** El informe sugiere que los tests deberían importar `e2e/seed.spec.ts`. El plan dice que la tienda fue "explorada con" el seed (plan:5). El seed solo hace `goto` y comprueba el título, así que no es un prerrequisito de ejecución.
6. **Defecto en 1.4 y `test.fail()`.** El plan pide "reportar el defecto, no alterar la expectativa" (plan:59). Las aserciones de `cart.spec.ts:99-101` ya hacen eso. Marcar el test con `test.fail()` invertiría el resultado y ocultaría el defecto.

## 4. Mapa de escenarios revisado

| Plan | Test | Estado | Observación verificada |
|---|---|---|---|
| 1.1 | `cart.spec.ts:8` | Cubierto con un hueco | La regex de fila (`:26`) no verifica la cantidad 1 del input. |
| 1.2 | `cart.spec.ts:30` | Parcial | No verifica el indicador de carrito en "2" (plan:35). La cantidad sí se verifica (`:47`). |
| 1.3 | `cart.spec.ts:52` | Cubierto | |
| 1.4 | `cart.spec.ts:78` | Cubierto | |
| 1.5 | `cart.spec.ts:104` | Cubierto | |
| 1.6 | `cart.spec.ts:131` | Cubierto | |
| 1.7 | `search.spec.ts:12` | Cubierto | |
| 1.8 | `search.spec.ts:35` | Cubierto | |
| 2.1 | — | Pendiente por diseño | Plan:113-121. |
| 2.2 | `login-invalid-password.spec.ts:30` | Cubierto, supuesto a confirmar | El título "mismo correo" contradice el código y el plan. |
| 2.3 | `catalog.spec.ts:8` | Parcial | No verifica la opción visible 'Price (Low - High)' (plan:139). Selecciona por valor (`:18`). |

## 5. Clasificación de recomendaciones

| # | Recomendación de qa-reviewer | Clasificación | Evidencia | Motivo |
|---|---|---|---|---|
| R1 | 2.3: verificar que la opción visible 'Price (Low - High)' existe y queda seleccionada | **Aplicar** | plan:139 y plan:142; `catalog.spec.ts:18-19` solo usa `price,asc` | Es un `expect` explícito del plan que hoy no se valida. |
| R2 | 2.3: exigir que el orden final difiera del inicial | **Descartada** | plan:144-147 | Un catálogo ya ordenado también es un resultado correcto. Ver sección 3, punto 1. |
| R3 | 2.3: verificar que no hay navegación o cambio de URL | **Opcional** | plan:141 dice "sin navegar a una pantalla distinta" | Antes hay que confirmar si la app agrega parámetros de consulta a la URL. Un cambio de query no equivale a navegar a otra pantalla. |
| R4 | 2.3: soportar descuentos o formatos distintos en la regex de precio | **Descartada** | `catalog.spec.ts:28-30`, donde un formato inesperado produce `NaN`, `allFinite:false` y el test falla | El fallo es explícito, no un falso positivo. No hay evidencia de descuentos en el catálogo. |
| R5 | 2.2: `test.skip` si faltan variables | **Descartada** | `login-invalid-password.spec.ts:10-18` | Hay que conservar el error explícito de configuración. |
| R6 | 2.2: corregir el título "con el mismo correo" | **Aplicar** | `login-invalid-password.spec.ts:30` frente a `:16-18` y plan:128 | El título engaña. No hay `--grep` que dependa de él en `playwright-diagnostic.yml:32`. |
| R7 | 2.2: limitar a un solo proyecto o serializar | **Opcional** | En CI ya corre solo chromium con 1 intento (`playwright.yml:31`) | Solo reduce intentos en ejecuciones locales con 3 navegadores. No evita que los intentos se acumulen entre ejecuciones de CI (sección 3, punto 3). Ese riesgo se mitiga con la política de bloqueo o desbloqueo de la cuenta, que hay que confirmar. |
| R8 | 2.2: verificar ausencia de token en storage o de `nav-menu` | **Opcional** | `:49` verifica `nav-sign-in` | El plan pide "continúa sin autenticar". La señal actual es razonable, y una segunda señal la reforzaría. |
| R9 | 1.2: verificar el indicador `nav-cart` en "2" | **Aplicar** | plan:35; `cart.spec.ts:22` ya usa ese patrón para "1" | Es un `expect` del plan que falta. |
| R10 | 1.1: verificar la cantidad 1 en la fila | **Aplicar** | plan:23; `cart.spec.ts:26` | El valor de un input no forma parte del nombre accesible de la fila. Se puede reutilizar `input[data-test="product-quantity"]` como en `:47`. |
| R11 | Badge en 1.3, 1.4 y 1.5 | **Opcional** | plan:47, :57 y :71 no lo piden | Va más allá del plan. |
| R12 | 1.4: verificar el precio unitario tras el cambio | **Opcional** | plan:57 solo pide el importe de fila y el total | Va más allá del plan. |
| R13 | Total del carrito con `[data-test="cart-total"]` en vez de `/Total.*\$X/` | **Opcional** | Ese selector existe en `e2e/carrito.spec.ts:10` | Sería más preciso, pero la regex actual no da falsos positivos evidentes, porque las filas de producto no contienen "Total". |
| R14 | Reemplazar `a.btn-danger` (`cart.spec.ts:119`, `:141`) | **Opcional** | — | Es mantenibilidad, no un defecto de cobertura. |
| R15 | Reemplazar `/^Pliers Compare/` (`cart.spec.ts:60`, `:110`) | **Opcional** | — | Depende del texto de la tarjeta. Si cambia, el test falla de forma visible. |
| R16 | Acotar `a[href*="/product/"]` en búsqueda (`search.spec.ts:30`, `:48`) | **Opcional** | — | Un enlace ajeno haría fallar el conteo, lo que sería un falso negativo, nunca un falso positivo. |
| R17 | Búsqueda: `toContainText` aceptaría "Combination Pliers Set" | **Descartada** | `search.spec.ts:25-31` comprueba "1 product found" exacto y `toHaveCount(1)` | Esas aserciones ya acotan el resultado. |
| R18 | Botón "Search" ambiguo | **Descartada** | `search.spec.ts:19` | Si hubiera más de un botón, el modo estricto de Playwright fallaría de forma explícita. Agregar `exact: true` es cosmético. |
| R19 | Toasts `getByRole("alert", { name })` como supuesto de DOM | **Descartada** | — | No hay evidencia de fallo, y sin ejecutar no se puede afirmar. |
| R20 | "Account locked": usar una aserción en vez de `throw` | **Descartada** | `login-invalid-password.spec.ts:42-44` | El error ya es explícito y descriptivo, como pide plan:131. |
| R21 | Comprobar carrito vacío al iniciar | **Opcional** | plan:18; cada test usa un contexto nuevo | Agregaría una aserción de precondición, aunque hoy no hay evidencia de estado compartido. |
| R22 | 1.4: `test.fail()` si el total no se actualiza | **Descartada** | plan:59 | Ver sección 3, punto 6. |
| R23 | Introducir `baseURL` | **Opcional** | URL repetida en `cart.spec.ts:5`, `catalog.spec.ts:5`, `search.spec.ts:5`, `LoginPage.ts:21`, `seed.spec.ts:4` y `carrito.spec.ts:4`; la API usa otro host | Es un refactor sin impacto en la cobertura. Hay un único ambiente. |
| R24 | Leer los precios desde la UI en lugar de fijarlos | **Descartada** | plan:5 y los datos de 1.1 a 1.5 | Los precios fijos son el oráculo del plan. Leerlos de la UI debilitaría la verificación. Extraerlos a constantes queda como opcional. |
| R25 | Tests deben partir de `seed.spec.ts` | **Descartada** | plan:5 y `seed.spec.ts` | Ver sección 3, punto 5. |

Resumen: **4 para aplicar** (R1, R6, R9 y R10), **11 opcionales** y **10 descartadas**.

## 6. Supuestos que siguen requiriendo confirmación

1. **2.2.** ¿La cuenta de `TOOLSHOP_NEGATIVE_EMAIL` existe, está habilitada y es distinta de `TOOLSHOP_EMAIL`? El código exige ambas variables y CI las toma de secrets. No se puede verificar sin ejecutar ni leer credenciales.
   - ¿Cuál es la política de bloqueo de la app: cuántos intentos fallidos, en qué ventana de tiempo y con qué desbloqueo, automático o manual?
   - ¿Quién desbloquea o rota la cuenta si los intentos acumulados entre ejecuciones de CI la bloquean?
2. **2.3.** Al ordenar, ¿la app cambia la URL (por ejemplo, con parámetros de consulta)? La respuesta define si R3 se aplica y cómo.
3. **1.7.** ¿El "único resultado" es un requisito o solo una observación? El plan dice "se observó" (plan:95), pero el test exige exactamente 1. El test de API exige lo mismo (`product-search.spec.ts:51-52`).
4. **Precios del sitio demo.** ¿Se aceptan como datos estables ($14.15 y $12.01)?
5. **Alcance de navegadores.** CI valida solo chromium. ¿firefox y webkit son alcance oficial o solo de uso local?
6. **`seed.spec.ts` y `carrito.spec.ts`.** Quedan fuera de CI. ¿Es intencional mantenerlos en `testDir`, lo que hace que corran en ejecuciones locales sin ruta?

## 7. Limitaciones

- No se ejecutaron tests. Ningún hallazgo sobre comportamiento en tiempo de ejecución (toasts, URL al ordenar, estado de la cuenta) está confirmado.
- No se leyeron `.env`, `playwright-report/`, `test-results/` ni artefactos de CI.
