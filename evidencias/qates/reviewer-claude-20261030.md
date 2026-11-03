El revisor **qates:qa-reviewer** terminó. Te muestro sus resultados resumidos. Yo no revisé el código para verificar sus afirmaciones, así que tomá los números de línea como referencia a confirmar.

Revisó el plan, los 4 tests de `e2e/toolshop/`, `LoginPage.ts` y `playwright.config.ts`. No ejecutó nada, no leyó `.env` ni reportes y no modificó archivos. No miró `e2e/seed.spec.ts`, que el plan menciona pero está fuera de esa carpeta.

## 1. Escenarios implementados

| Plan | Test | Estado |
|---|---|---|
| 1.1 Agregar una unidad | `cart.spec.ts:8` | Cubierto. No se verifica la cantidad 1 dentro de la fila. |
| 1.2 Dos unidades del mismo producto | `cart.spec.ts:30` | Parcial: no verifica el indicador "2" del carrito. |
| 1.3 Dos productos distintos | `cart.spec.ts:52` | Cubierto. |
| 1.4 Cambiar la cantidad desde el carrito | `cart.spec.ts:78` | Cubierto. |
| 1.5 Eliminar un producto | `cart.spec.ts:104` | Cubierto. |
| 1.6 Eliminar el último producto | `cart.spec.ts:131` | Cubierto. |
| 1.7 Buscar por nombre | `search.spec.ts:12` | Cubierto. |
| 1.8 Búsqueda sin coincidencias | `search.spec.ts:35` | Cubierto. |
| 2.1 Login válido | — | No cubierto, a propósito: el plan lo deja pendiente. |
| 2.2 Contraseña incorrecta | `login-invalid-password.spec.ts:30` | Parcial: no comprueba que la cuenta exista y esté habilitada. |
| 2.3 Orden de precio de menor a mayor | `catalog.spec.ts:8` | Parcial: ver el punto 2. |

No hay tests sin respaldo en el plan: los 11 tests corresponden a algún escenario.

## 2. Validaciones faltantes

- **Orden de precio (`catalog.spec.ts`):** el test podría pasar aunque el orden no funcione.
  - No guarda el orden inicial, así que no prueba que el orden haya cambiado.
  - Elige la opción por su valor interno (`price,asc`) y no por el texto visible "Price (Low - High)", que es lo que pide el plan.
  - No verifica que la URL quede igual.
- **Carrito:** faltan algunas comprobaciones.
  - No verifica el contador del carrito en 1.2 a 1.5.
  - No verifica la cantidad dentro de la fila en 1.1.
  - El patrón usado para el total (`/Total.*\$14\.15/`) es demasiado permisivo.
- **Selectores frágiles:**
  - `a.btn-danger` (`cart.spec.ts:119`, `:141`).
  - `/^Pliers Compare/` (`cart.spec.ts:60`, `:110`).
  - `a[href*="/product/"]` en toda la página (`search.spec.ts:30`, `:48`), que podría contar enlaces de otras secciones.
- **Búsqueda:** `toContainText` también aceptaría un producto como "Combination Pliers Set".
- **Login negativo:**
  - Para saber que el usuario sigue sin sesión, solo mira que el botón de iniciar sesión esté visible (`nav-sign-in`).
  - Si faltan las variables de entorno, el test falla en vez de saltearse.
- **Estado inicial:** ningún test comprueba que el carrito arranque vacío.

## 3. Supuestos que requieren confirmación

1. **Precios fijos** ($14.15, $28.30, $26.16) contra un sitio demo público: ¿se aceptan, o el test debería leer los precios desde la página?
2. **Búsqueda:** ¿tiene que haber exactamente 1 resultado, o alcanza con que aparezca Combination Pliers?
3. **Entorno:** las URLs están escritas a mano en 4 archivos y en `LoginPage.ts`. ¿Conviene definir una URL base (`baseURL`) por ambiente?
4. **Login 2.2:**
   - ¿Quién provee `TOOLSHOP_NEGATIVE_EMAIL` y `TOOLSHOP_EMAIL`?
   - ¿Cómo se consigue `TOOLSHOP_EMAIL` si el login válido (2.1) sigue pendiente?
   - ¿El test debería saltearse si faltan esas variables?
5. **Riesgo de bloquear la cuenta:** el login negativo corre en 3 navegadores en paralelo y con 2 reintentos en CI. ¿Lo limitamos a un solo navegador o a ejecución en serie?
6. **Navegadores:** ¿chromium, firefox y webkit son el alcance oficial?
7. **Defecto en 1.4:** si el total no se actualiza, ¿se marca el test con `test.fail()` y un ticket, o se deja en rojo?
8. **Título engañoso:** el test de 2.2 dice "mismo correo", pero el código y el plan usan una cuenta distinta. ¿Se corrige?
9. **Ordenamiento:** ¿cómo se tratan los descuentos o los precios con separador de miles? ¿Alcanza con validar solo la primera página?
10. **Seed:** ¿los tests deberían partir de `e2e/seed.spec.ts`, como dice el plan?

## 4. Recomendaciones del revisor, en orden de prioridad

1. Reforzar el test de orden de precio (2.3): elegir la opción por su texto visible, comparar con el orden inicial y verificar que la URL no cambie.
2. Que el login negativo se saltee si faltan las variables, correrlo en un solo navegador y corregir su título.
3. Completar las validaciones del carrito: el contador, la cantidad en la fila y el precio unitario.
4. Reemplazar los selectores frágiles por atributos `data-test` o por roles.
5. Definir una URL base (`baseURL`) y pasar precios y nombres de producto a constantes compartidas.

No modifiqué ningún archivo.