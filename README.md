# Capacitación QA: Playwright

Prácticas de Toolshop para el path de Santex, con Playwright y agentes de GitHub Copilot en VS Code.

## Estructura

- `e2e/toolshop/`: nueve casos UI de carrito, búsqueda y autenticación negativa.
- `e2e/api/`: dos casos API de búsqueda de productos.
- `e2e/pages/`: Page Object de login compartido.
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

CI está configurado. Queda reincorporar o acordar el reemplazo del caso de login válido para completar diez casos UI, verificar el bloqueo de merge en un repositorio que lo permita, reunir las evidencias y continuar con QATES, challenge y métricas.

La suite principal actual tiene once tests: nueve UI y dos API.
