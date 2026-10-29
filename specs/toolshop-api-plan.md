# Plan API E2E - Búsqueda de productos Toolshop

## Application Overview

Plan de dos casos API propuestos a partir del tráfico real de búsqueda observado en https://practicesoftwaretesting.com/. Al pulsar Search, la tienda envía una petición HTTP QUERY a https://api.practicesoftwaretesting.com/products/search con Content-Type: application/json y body JSON que incluye q. Ambos ejemplos observados respondieron 200 application/json. Consulta positiva: q='Combination Pliers', un resultado, precio 14.15. Consulta sin coincidencias: q='zzqv-no-product-987654', total 0. No se realizaron intentos de login. Los escenarios evitan dependencias de interfaz y no generan código.

## Test Scenarios

### 1. Búsqueda de productos por API

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Buscar un producto existente por nombre mediante API

**File:** `specs/toolshop-api-plan.md`

**Steps:**
  1. Precondiciones: servicio API accesible en https://api.practicesoftwaretesting.com; no requiere sesión de usuario. Datos: q = 'Combination Pliers'. Este nombre fue buscado en la interfaz y la petición de búsqueda observada respondió 200.
    - expect: La petición apunta a https://api.practicesoftwaretesting.com/products/search.
    - expect: El método capturado en el navegador es HTTP QUERY.
    - expect: El cuerpo JSON enviado contiene exactamente la propiedad de consulta q con valor 'Combination Pliers'.
    - expect: El encabezado Content-Type observado es application/json.
  2. Enviar la petición API con el cuerpo JSON {"q":"Combination Pliers"} y leer la respuesta JSON.
    - expect: El estado HTTP es 200 y Content-Type de respuesta es application/json.
    - expect: La respuesta tiene current_page=1, data como array, from=1, last_page=1, per_page=9, to=1 y total=1.
    - expect: data contiene exactamente un producto con name='Combination Pliers' y price=14.15.
    - expect: El resultado observado incluía in_stock=true, is_rental=false y category.name='Pliers'. Validar estos campos si forman parte del contrato de negocio requerido, sin depender de campos descriptivos o de imágenes.
  3. Evaluar el resultado de negocio usando los datos de respuesta, sin abrir ni consultar páginas de UI.
    - expect: La búsqueda devuelve una coincidencia, el nombre coincide con la consulta y el precio se representa como número 14.15.
    - expect: El total de resultados coincide con data.length y es 1.

#### 1.2. Buscar por API una cadena sin coincidencias

**File:** `specs/toolshop-api-plan.md`

**Steps:**
  1. Precondiciones: servicio API accesible en https://api.practicesoftwaretesting.com; no requiere sesión. Ejecutar este caso de forma independiente. Datos: q = 'zzqv-no-product-987654', una consulta única que produjo cero coincidencias al probarla en la tienda.
    - expect: La petición usa método HTTP QUERY y URL https://api.practicesoftwaretesting.com/products/search.
    - expect: El cuerpo JSON enviado contiene q='zzqv-no-product-987654' y Content-Type es application/json.
  2. Enviar la petición API con el cuerpo JSON {"q":"zzqv-no-product-987654"} y leer la respuesta JSON.
    - expect: El estado HTTP es 200 y la respuesta tiene Content-Type application/json.
    - expect: La respuesta tiene current_page=1, data=[], from=null, last_page=1, per_page=9, to=null y total=0.
    - expect: No hay elementos en data ni producto coincidente.
  3. Evaluar el resultado de negocio con el contenido de respuesta API únicamente.
    - expect: El servicio representa la búsqueda sin coincidencias como respuesta correcta con estado 200, colección vacía y total 0; no como error de servidor ni como un registro ficticio.
    - expect: En la UI de la tienda, esta búsqueda mostró 'There are no products found.'; la API debe validar el estado de negocio vacío, no ese texto visual.
