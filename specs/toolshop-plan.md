# Plan E2E - Practice Software Testing Toolshop

## Application Overview

Plan de diez casos E2E, basados en la exploración de https://practicesoftwaretesting.com/ con e2e/seed.spec.ts como punto de partida. Ejecutar cada caso de forma independiente desde un estado limpio de navegador, sesión y carrito. Precios observados: Combination Pliers $14.15 y Pliers $12.01. El catálogo requiere pulsar Search para aplicar la consulta; los resultados de la búsqueda se comprobaron en la interfaz. La aplicación muestra 'The cart is empty. Nothing to display.' al vaciar el carrito. Se detectó una posible discrepancia en el total general tras editar cantidad (ver caso 4). Para login no se dispone de cuenta de prueba: solicitar credenciales aprobadas al responsable antes de ejecutar los casos 9 y 10; no usar ni inventar credenciales.

## Test Scenarios

### 1. Catálogo y carrito

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Agregar una unidad al carrito

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: iniciar desde estado limpio, sin artículos en el carrito. Datos: Combination Pliers, precio observado $14.15, cantidad 1.
    - expect: El catálogo inicial se muestra y el carrito comienza vacío.
  2. En el catálogo, abrir Combination Pliers y pulsar Add to cart sin modificar la cantidad.
    - expect: Se muestra el aviso 'Product added to shopping cart.'
    - expect: El indicador del carrito muestra 1 unidad.
  3. Abrir el carrito desde el indicador del encabezado.
    - expect: Aparece una fila Combination Pliers con cantidad 1, precio unitario $14.15 e importe $14.15.
    - expect: El total del carrito es $14.15.

#### 1.2. Agregar dos unidades del mismo producto

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: carrito vacío y sesión limpia. Datos: Combination Pliers ($14.15), cantidad deseada 2.
    - expect: La página de detalle del producto ofrece controles para incrementar la cantidad y el botón Add to cart.
  2. Abrir Combination Pliers, incrementar Quantity de 1 a 2 y pulsar Add to cart.
    - expect: Se muestra el aviso 'Product added to shopping cart.'
  3. Abrir el carrito y comprobar la fila del producto.
    - expect: Hay una sola fila Combination Pliers con cantidad 2.
    - expect: El importe de la fila es $28.30 y el indicador del carrito muestra 2 unidades.
    - expect: El total general es $28.30.

#### 1.3. Agregar dos productos distintos

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: carrito vacío y sesión limpia. Datos: una Combination Pliers ($14.15) y un Pliers ($12.01).
    - expect: Se pueden abrir ambos productos desde el catálogo.
  2. Abrir Combination Pliers y pulsar Add to cart con cantidad 1. Volver al catálogo con Continue Shopping, abrir Pliers y pulsar Add to cart con cantidad 1.
    - expect: Cada acción de agregado confirma que el producto fue añadido al carrito.
  3. Abrir el carrito.
    - expect: Se muestran dos filas independientes: Combination Pliers, cantidad 1, $14.15; Pliers, cantidad 1, $12.01.
    - expect: El indicador muestra 2 unidades y el total general es $26.16.

#### 1.4. Cambiar la cantidad desde el carrito

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: carrito limpio salvo por el producto de preparación. Datos: una Combination Pliers ($14.15); cambiar cantidad de 1 a 2.
    - expect: El carrito muestra inicialmente cantidad 1 e importe $14.15.
  2. En el carrito, cambiar el campo Quantity for Combination Pliers a 2.
    - expect: Se muestra el aviso 'Product quantity updated.'
    - expect: La cantidad permanece en 2 y el importe de la fila cambia a $28.30.
  3. Comprobar el total general de la tabla y el indicador del carrito.
    - expect: El total general se recalcula a $28.30 y el indicador del carrito muestra 2 unidades.
    - expect: Hallazgo de exploración: en la comprobación realizada, la fila cambió a $28.30 pero el total general permaneció en $14.15. Si se reproduce, registrar el caso como fallo de recálculo del total.

#### 1.5. Eliminar un producto del carrito

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: carrito limpio salvo por los productos de preparación. Datos: una Combination Pliers y un Pliers (cantidad 1 cada uno).
    - expect: El carrito contiene dos filas de productos distintas.
  2. Pulsar el control de eliminar de la fila Pliers, sin eliminar Combination Pliers.
    - expect: Se muestra el aviso 'Product deleted.'
  3. Revisar las filas, el indicador del carrito y el total.
    - expect: Pliers ya no aparece; Combination Pliers permanece con cantidad 1 e importe $14.15.
    - expect: El indicador muestra 1 unidad y el total es $14.15.

#### 1.6. Eliminar el último producto

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: carrito limpio salvo por un producto de preparación. Datos: una Combination Pliers con cantidad 1.
    - expect: El carrito muestra exactamente una fila.
  2. Pulsar el control de eliminar de la única fila.
    - expect: Se muestra el aviso 'Product deleted.'
  3. Comprobar el contenido de la página del carrito.
    - expect: No quedan filas de productos y aparece el mensaje exacto 'The cart is empty. Nothing to display.'

#### 1.7. Buscar un producto por nombre

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: estado limpio; abrir el catálogo. Datos: consulta 'Combination Pliers'.
    - expect: El catálogo presenta el campo Search.
  2. Escribir Combination Pliers en Search y pulsar el botón Search.
    - expect: La búsqueda se aplica al pulsar Search.
  3. Revisar los productos devueltos.
    - expect: Aparece Combination Pliers entre los resultados y no aparecen productos con nombres no coincidentes.
    - expect: La exploración comprobó una coincidencia para esta consulta.

#### 1.8. Buscar un texto sin coincidencias

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: estado limpio; abrir el catálogo. Datos: consulta única 'zzqv-no-product-987654'.
    - expect: El catálogo presenta el campo Search.
  2. Escribir zzqv-no-product-987654 en Search y pulsar el botón Search.
    - expect: La búsqueda se aplica al pulsar Search.
  3. Revisar el catálogo y el estado de resultados vacíos.
    - expect: No se muestra ningún producto.
    - expect: Aparece el mensaje exacto 'There are no products found.'

### 2. Autenticación

**Seed:** `e2e/seed.spec.ts`

#### 2.1. Iniciar sesión con credenciales válidas

**Estado:** pendiente de reincorporar. El test automatizado fue eliminado por solicitud del responsable de la práctica tras rechazos de acceso también reproducidos manualmente. No se confirmó la causa. Este escenario no forma parte de la suite ejecutable actual.

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: disponer de una cuenta de prueba existente y habilitada, con credenciales facilitadas por el responsable del entorno. No inventar ni reutilizar credenciales personales. Datos: correo y contraseña de esa cuenta, suministrados de forma segura.
    - expect: Sin una cuenta de prueba aprobada, este caso queda bloqueado y no debe ejecutarse.
  2. Abrir Sign in, introducir el correo y la contraseña válidos y pulsar Login.
    - expect: La autenticación se completa sin mensaje de error.
    - expect: La aplicación deja la pantalla /auth/login y muestra un estado identificable de usuario autenticado o su área de cuenta.

#### 2.2. Iniciar sesión con contraseña incorrecta

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: disponer de la misma cuenta de prueba aprobada del caso de login válido. Datos: correo válido de esa cuenta y una contraseña deliberadamente incorrecta que no sea una credencial real de otro usuario.
    - expect: Sin una cuenta de prueba aprobada, este caso queda bloqueado; no sustituir el correo por uno inventado porque no permitiría distinguir contraseña errónea de usuario inexistente.
  2. Abrir Sign in, introducir el correo válido y la contraseña incorrecta y pulsar Login.
    - expect: La aplicación rechaza el acceso y muestra feedback de credenciales no válidas.
    - expect: El usuario permanece sin autenticar en /auth/login y no aparece su área de cuenta.
