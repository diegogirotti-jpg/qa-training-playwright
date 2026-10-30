# Capacitación QA: Playwright

Prácticas de Toolshop para el path de Santex, con Playwright y agentes de GitHub Copilot en VS Code.

## Estructura

- `e2e/toolshop/`: diez casos UI de carrito, búsqueda y autenticación negativa.
- `e2e/api/`: dos casos API de búsqueda de productos.
- `e2e/pages/`: Page Objects de login, catálogo, producto y carrito.
- `e2e/carrito.spec.ts`: primer ejercicio grabado con Codegen.
- `e2e/seed.spec.ts`: punto de partida de los agentes.
- `specs/`: planes de pruebas UI y API.
- `evidencias/`: entregables revisados, sin credenciales.
- `.github/agents/` y `.vscode/mcp.json`: agentes y herramientas de Playwright.

## Ejecutar

Desde la raíz del proyecto:

```bash
npx playwright test e2e/toolshop --project=chromium --workers=1 --retries=0
npx playwright test e2e/api --project=chromium --workers=1 --retries=0
```

El test de login válido fue eliminado; su cobertura queda pendiente. El login negativo usa `TOOLSHOP_NEGATIVE_EMAIL` y todavía consulta `TOOLSHOP_EMAIL` y `TOOLSHOP_PASSWORD` para distinguir los datos de ambas cuentas. Completar `.env` localmente con los valores entre comillas; la configuración lo carga automáticamente. `.env.example` es la plantilla sin credenciales. Las variables ya exportadas en la terminal tienen prioridad sobre `.env`: eliminarlas con `unset TOOLSHOP_EMAIL TOOLSHOP_PASSWORD TOOLSHOP_NEGATIVE_EMAIL` si están desactualizadas. En CI, configurar estas variables como secretos. No guardar credenciales en el código. Se requiere Node.js 22.9 o posterior para `loadEnvFile`.

Para consultar el reporte después de una ejecución:

```bash
npx playwright show-report
```

Los reportes y capturas temporales están excluidos de Git; pueden contener datos sensibles.

## Pendiente de capacitación

CI está configurado. El login válido sigue sin cobertura; los diez casos UI actuales incluyen ordenamiento. Queda verificar el bloqueo de merge en un repositorio que lo permita, reunir las evidencias y continuar con QATES, challenge y métricas.

La suite principal actual tiene doce tests: diez UI y dos API.

## Organización de los tests UI

- `e2e/toolshop/cart.spec.ts`: seis casos de carrito.
- `e2e/toolshop/search.spec.ts`: dos casos de búsqueda.
- `e2e/toolshop/catalog.spec.ts`: un caso de ordenamiento.
- `e2e/toolshop/login-invalid-password.spec.ts`: un caso de autenticación negativa.

Cada grupo de catálogo navega desde su propio `beforeEach`: se ejecuta antes de cada test y no comparte el carrito entre casos. API y login conservan su preparación específica. Los diez casos UI y los dos API se ejecutan con el workflow principal sin cambios de comando.

## Reutilización y comandos

La URL de Toolshop se define una sola vez en `playwright.config.ts` (`baseURL`).
Las fixtures de `e2e/fixtures/toolshop.fixture.ts` crean Page Objects para cada test,
sin compartir el carrito ni el contexto entre pruebas. Los hooks `beforeEach` abren
el catálogo y esperan un producto visible. Las acciones comunes viven en los Page
Objects; las verificaciones de negocio y los precios esperados siguen en los tests.

`CartPage.open()` comprueba `/checkout` y una fila de producto antes de continuar.
Las filas se identifican por su campo de cantidad; no se confunden con especificaciones.
El selector de eliminación `a.btn-danger` todavía se conserva, limitado a la fila,
hasta verificar un atributo estable en la página.

```bash
npm run typecheck          # Revisa tipos sin ejecutar pruebas
npm run test:list           # Muestra los 12 casos sin ejecutarlos
npm run test:ui:no-login    # 9 casos UI; no ejecuta autenticación
npm run test:api            # 2 casos API
npm run test:toolshop       # 12 casos; incluye un intento de login negativo
npm run report             # Abre el último reporte
```

El comando completo requiere las variables de la cuenta de prueba. Los intentos
negativos pueden acumularse entre corridas; usar una cuenta separada habilitada.
Los ejercicios `seed.spec.ts` y `carrito.spec.ts` quedan fuera de estos comandos.

## Última validación de la refactorización

Ver `evidencias/toolshop-refactor.md`. Tras actualizar los datos de los escenarios 1.3 y 1.5 a Slip Joint Pliers, los 9 casos UI sin login aprobaron (55.9s), al igual que la revisión de tipos. Los 2 casos API aprobaron en la etapa previa de esta refactorización; no se repitieron al cambiar solo los datos UI. No se ejecutó login ni se acredita una nueva corrida completa de los 12 casos.
