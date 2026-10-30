# Revisión de reutilización de Toolshop — 2026-10-30

## Cambios
- Page Objects CatalogPage, ProductPage y CartPage.
- Fixtures por test y hooks beforeEach con espera del catálogo.
- baseURL central; LoginPage usa la ruta relativa.
- Checkout confirmado antes de revisar filas; total por cart-total y filas por cantidad de producto.
- Nombres y resultados esperados de los 12 escenarios conservados.
- Comandos npm para suite, UI sin login, API, listado, tipos y reporte.

## Validación
- tsc --noEmit: correcto.
- Detección: 12 tests, mismos títulos.
- Corrida UI tras corregir el total: 7 passed, 2 failed.
- API: 2 passed (2.1s).
- Nueva comprobación de los dos casos afectados, con retorno por Home y precondición de botón habilitado: 2 failed; ambas trazas muestran Pliers Out of stock y Add to cart deshabilitado.
- No se ejecutaron logins.
- La primera etapa conservó Pliers y documentó el fallo por stock. En la segunda etapa autorizada se actualizó el dato explícito a Slip Joint Pliers ($9.17), junto con el plan: total esperado $23.32, remanente tras eliminación $14.15. No hay sustitución automática en ejecución.
- Las pruebas locales no acreditan CI ni Firefox/WebKit.

## Pendientes
- Resuelto: datos actualizados y plan alineado; corrida final de los 9 casos UI sin login: 9 passed (55.9s). Revisión de tipos y diff --check correctos.
- El selector de eliminación a.btn-danger se conserva dentro de la fila hasta verificar un atributo estable.
- Publicación autorizada en main. No se ejecutó la prueba de login negativo; no se acredita una nueva corrida completa de 12 casos.

## Datos revisados en la segunda etapa
GET https://api.practicesoftwaretesting.com/products confirmó Pliers in_stock=false y Slip Joint Pliers in_stock=true, precio 9.17, sin alquiler ni oferta por ubicación. La navegación por UI y las aserciones del carrito comprobaron esos datos durante la corrida final. La disponibilidad puede cambiar por tratarse de una demo compartida.
