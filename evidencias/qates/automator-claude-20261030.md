Los 7 tests de `cart.spec.ts` y `catalog.spec.ts` pasaron en Chromium, con un worker y cero reintentos. Todos los cambios están sin commit ni push.

| Test | Resultado |
|---|---|
| Agregar una unidad al carrito | ✓ 9.4s |
| Agregar dos unidades del mismo producto | ✓ 7.7s |
| Agregar dos productos distintos | ✓ 9.0s |
| Cambiar la cantidad desde el carrito | ✓ 6.7s |
| Eliminar un producto del carrito | ✓ 9.8s |
| Eliminar el último producto | ✓ 6.6s |
| Ordenar productos por precio de menor a mayor | ✓ 3.2s |

El total fue de 54.1s.

## Cambios en los tests (hechos por qates:qa-automator; revisé el diff)

- **R1, `e2e/toolshop/catalog.spec.ts`:**
  - Ahora verifica que exista una sola opción con el texto "Price (Low - High)".
  - La selecciona por ese texto, ya no por su valor interno `price,asc`.
  - Después comprueba que la opción marcada muestre "Price (Low - High)".
  - El chequeo de que el valor sea `price,asc`, la espera de carga inicial y la verificación del orden de precios quedaron como estaban.
- **R6, `e2e/toolshop/login-invalid-password.spec.ts:30`:** el título ahora es "Login con una cuenta de prueba separada y una contraseña incorrecta". Es el único cambio en ese archivo. Ningún workflow filtra por ese título, así que renombrarlo no rompe nada.
- **R9, `e2e/toolshop/cart.spec.ts`:** en "Agregar dos unidades del mismo producto", después del aviso de producto agregado, verifica que el contador del carrito muestre "2".
- **R10, `e2e/toolshop/cart.spec.ts`:** en "Agregar una unidad al carrito", verifica que la cantidad dentro de la fila de Combination Pliers sea "1". Las validaciones de la fila y del total siguen igual.

No cambié el nombre de ningún test de carrito ni de catálogo. El workflow de diagnóstico los busca por título, así que siguen funcionando.

## Informe

Corregí `evidencias/qates-review.md` (secciones 2, 3, 5 y 6). Ahora aclara que, aunque CI haga un solo intento por ejecución, los intentos fallidos pueden acumularse entre ejecuciones y bloquear la cuenta. También agrega preguntas sobre la política de bloqueo y sobre quién desbloquea la cuenta.

## Lo que no se hizo

- No ejecuté el test de login negativo ni ningún login. El cambio R6 es solo un renombre y no se probó.
- No leí `.env` ni el reporte HTML que generó la ejecución.
- No toqué config, timeouts, credenciales ni workflows.

En `git status` aparecen los 3 specs modificados y la carpeta nueva `evidencias/`.