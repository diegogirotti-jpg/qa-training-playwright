# Plan E2E - Practice Software Testing Toolshop

## Application Overview

Plan QA funcional de la tienda Toolshop explorada con e2e/seed.spec.ts. Cada caso debe correr de forma independiente desde un navegador nuevo y carrito limpio, excepto donde se prepara explícitamente el estado en los pasos. Precio observado en la sesión: Combination Pliers $14.15 y Slip Joint Pliers $9.17. Autenticación válida sigue pendiente por una cuenta de prueba habilitada/credenciales válidas disponibles. Se agrega el ordenamiento de precios menor a mayor como escenario alternativo de reemplazo para la cobertura de login válido, sin eliminar la nota de pendiente.

## Test Scenarios

### 1. Catálogo y carrito

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Agregar una unidad al carrito

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: navegador nuevo, carrito vacío. Datos: Combination Pliers, precio observado $14.15, cantidad 1.
    - expect: El catálogo inicial se muestra con productos disponibles.
  2. Abrir Combination Pliers, comprobar el detalle del producto y pulsar Add to cart con cantidad 1.
    - expect: Se muestra 'Product added to shopping cart.' y el indicador del carrito muestra 1.
  3. Abrir el carrito.
    - expect: Una fila de Combination Pliers con cantidad 1, precio unitario $14.15 y total $14.15; total general $14.15.

#### 1.2. Agregar dos unidades del mismo producto

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: navegador nuevo, carrito vacío. Datos: Combination Pliers, $14.15, cantidad 2.
    - expect: El producto está disponible en el catálogo.
  2. Abrir Combination Pliers, incrementar Quantity de 1 a 2 y pulsar Add to cart.
    - expect: Se muestra 'Product added to shopping cart.'
  3. Abrir el carrito.
    - expect: Una fila del producto con cantidad 2 e importe $28.30; indicador 2 unidades y total general $28.30.

#### 1.3. Agregar dos productos distintos

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: navegador nuevo, carrito vacío. Datos: Combination Pliers ($14.15) y Slip Joint Pliers ($9.17), una unidad de cada uno.
    - expect: Ambos productos están disponibles en el catálogo.
  2. Agregar Combination Pliers. Volver al catálogo, abrir Slip Joint Pliers y agregar una unidad.
    - expect: La aplicación confirma cada producto agregado.
  3. Abrir el carrito.
    - expect: Dos filas independientes con una unidad de cada producto y total general $23.32.

#### 1.4. Cambiar la cantidad desde el carrito

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: carrito limpio salvo por los datos de preparación. Datos: una Combination Pliers ($14.15); nueva cantidad 2.
    - expect: El carrito muestra inicialmente cantidad 1.
  2. En el carrito, cambiar Quantity for Combination Pliers a 2 y abandonar el campo con Tab para confirmar la edición.
    - expect: Se muestra 'Product quantity updated.' y el importe de la fila pasa a $28.30.
  3. Comprobar el total general.
    - expect: El total general se actualiza a $28.30. Si permanece en $14.15, reportar el defecto, no alterar la expectativa.

#### 1.5. Eliminar un producto del carrito

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: navegador nuevo, carrito vacío. Datos: Combination Pliers y Slip Joint Pliers, una unidad cada uno.
    - expect: El carrito preparado contiene dos productos distintos.
  2. Eliminar solamente la fila Slip Joint Pliers.
    - expect: Se muestra 'Product deleted.'
  3. Comprobar filas y total.
    - expect: Solo queda Combination Pliers con cantidad 1 y el total se recalcula a $14.15.

#### 1.6. Eliminar el último producto

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: navegador nuevo, carrito vacío. Preparar una Combination Pliers.
    - expect: El carrito contiene una fila.
  2. Eliminar la única fila.
    - expect: Se muestra 'Product deleted.'
  3. Comprobar el estado del carrito.
    - expect: No hay filas y aparece 'The cart is empty. Nothing to display.'

#### 1.7. Buscar un producto por nombre

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: navegador nuevo, catálogo abierto. Datos: consulta 'Combination Pliers'.
    - expect: El campo Search está disponible.
  2. Escribir la consulta y pulsar Search.
    - expect: La búsqueda se aplica tras pulsar Search.
  3. Revisar el catálogo.
    - expect: Se muestra Combination Pliers como coincidencia; en la exploración se observó un único resultado.

#### 1.8. Buscar un texto sin coincidencias

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: navegador nuevo, catálogo abierto. Datos: consulta única 'zzqv-no-product-987654'.
    - expect: El campo Search está disponible.
  2. Escribir el texto y pulsar Search.
    - expect: La búsqueda se aplica.
  3. Revisar resultados vacíos.
    - expect: No se muestran productos y aparece 'There are no products found.'

### 2. Autenticación y escenario de reemplazo

**Seed:** `e2e/seed.spec.ts`

#### 2.1. Iniciar sesión con credenciales válidas (pendiente)

**Estado:** pendiente de reincorporar. El test automatizado fue eliminado por solicitud del responsable de la práctica tras rechazos de acceso también reproducidos manualmente. No se confirmó la causa. Este escenario no forma parte de la suite ejecutable actual.

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: pendiente de cuenta de prueba habilitada y credenciales aprobadas proporcionadas de forma segura. No inventar credenciales.
    - expect: Este caso permanece pendiente. Al contar con cuenta de prueba, un login correcto debe salir de /auth/login y mostrar el estado autenticado.

#### 2.2. Iniciar sesión con contraseña incorrecta

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: cuenta de prueba habilitada distinta de la cuenta del login válido, correo de esa cuenta disponible por entorno. Datos: correo de cuenta de prueba y contraseña ficticia incorrecta, distinta de la válida.
    - expect: La cuenta no debe estar bloqueada antes del intento.
  2. Enviar el formulario de login.
    - expect: Aparece 'Invalid email or password', se permanece en /auth/login y el usuario continúa sin autenticar. Si aparece 'Account locked', informar la cuenta bloqueada y no considerar correcto el caso.

#### 2.3. Reemplazo de cobertura: ordenar productos por precio de menor a mayor

**File:** `specs/toolshop-plan.md`

**Steps:**
  1. Precondiciones: abrir la tienda desde estado limpio, sesión sin autenticar, catálogo en su estado inicial, sin filtros ni búsqueda activos. El catálogo inicial muestra paginación; validar solamente los productos de la página visible, no afirmar que se cubrió todo el catálogo. Datos: criterio Price (Low - High), valor de opción observado 'price,asc'.
    - expect: El menú de ordenamiento contiene la opción visible 'Price (Low - High)'.
  2. Seleccionar 'Price (Low - High)' en el control Sort.
    - expect: El control mantiene seleccionado el criterio de precio ascendente y los productos visibles se actualizan reordenándose sin navegar a una pantalla distinta.
  3. Esperar la finalización mediante una señal observable: comprobar que la opción seleccionada permanece en 'Price (Low - High)' y que las tarjetas visibles y sus precios ya reflejan el resultado ordenado; usar aserciones de espera automática sobre ese estado, sin pausas fijas.
    - expect: Hay al menos dos tarjetas de producto visibles tras aplicarse el orden.
  4. Obtener el precio de cada tarjeta visible desde el elemento de precio de la propia tarjeta, quitando el símbolo monetario y convirtiendo el valor a número decimal. Comparar cada precio con el siguiente en secuencia.
    - expect: Los precios de los productos visibles están en orden numérico no decreciente: para cada índice, precio[i] <= precio[i+1].
    - expect: Se permiten empates entre productos consecutivos.
    - expect: La validación se limita a las tarjetas de la página visible; no se afirma cobertura del catálogo completo.

## Actualización de datos — 2026-10-30

Los escenarios 1.3 y 1.5 usan Slip Joint Pliers ($9.17) como segundo producto. Pliers ($12.01), usado en la exploración original, apareció sin stock en la UI y con in_stock=false en GET https://api.practicesoftwaretesting.com/products. Slip Joint Pliers se observó con in_stock=true, is_rental=false e is_location_offer=false. Con Combination Pliers ($14.15), el total esperado es $23.32. Al eliminar Slip Joint Pliers permanece $14.15. La disponibilidad es una precondición de la demo compartida y puede cambiar; no se elige un sustituto automáticamente durante el test.
