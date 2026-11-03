# Diagnóstico automático de bugs conocidos

Este proceso verifica dos errores sembrados de **Toolshop con bugs**, conserva evidencia y genera reportes Markdown con el formato de Santex. Corre separado de la suite normal y no usa cuentas ni secretos. No envía formularios ni crea registros.

## Ejecutarlo desde cero

Requisitos: Git, Node.js 24 con npm, Internet y acceso de lectura a este repositorio privado. Si GitHub devuelve 404, pedí acceso y aceptá la invitación.

```sh
git clone https://github.com/diegogirotti-jpg/qa-training-playwright.git
cd qa-training-playwright
npm ci
npx playwright install chromium
npm run typecheck
npm run test:diagnostic-unit
npm run diagnose
```

En Linux, instalá las dependencias del navegador con `npx playwright install --with-deps chromium` en lugar del comando de instalación anterior. Si ya tenés el repo, actualizalo antes de empezar y conservá tus cambios locales.

No necesitás configurar `.env`. Este diagnóstico tiene su propia configuración y siempre usa https://with-bugs.practicesoftwaretesting.com/. No lo apuntes a un proyecto de cliente.

## Cómo interpretar el resultado

- `BUG-002`: Home debe abrir el catálogo desde Contacto.
- `BUG-003`: Price (Low - High) debe mostrar precios de menor a mayor.

Las aserciones expresan el comportamiento correcto. Como esta demo contiene bugs intencionales, pueden aparecer **2 failed y código de salida 1**. Esto significa detección solamente cuando los reportes dicen `HALLAZGO_REPRODUCIDO`. Un fallo de red o una medición incompleta queda `INCONCLUSO`. Si la demo cambia y cumple las expectativas, el resultado será `SIN_HALLAZGO`.

No usamos `test.fail`, mocks ni excepciones para convertir los bugs conocidos en pruebas aprobadas. Cada prueba corre una vez, sin reintentos. La medición cubre una sesión y la página visible; no representa todos los usuarios ni todo el catálogo.

Después de ejecutar, abrí:

- `diagnostic-output/reports/README.md`: clasificación y enlaces a ambos reportes.
- `diagnostic-output/reports/BUG-002.md` y `BUG-003.md`: reportes estándar.
- `diagnostic-output/reports/summary.json`: resultado procesable y commit de los tests.
- `diagnostic-output/evidence/`: observación JSON, pantalla, texto visible y errores literales; trace cuando la prueba falla.

Para abrir el reporte visual:

```sh
npm run diagnose:report
```

Para explorar un trace, ejecutá `npx playwright show-trace` seguido de la ruta al archivo `.zip` indicado en el reporte Markdown. Compartí la carpeta completa para mantener sus enlaces. Estos archivos están excluidos de Git y se regeneran en cada corrida; copialos si necesitás conservarlos.

## Reportes y límites

Los valores de frecuencia, precios y pares fuera de orden se calculan con datos de la corrida. El generador marca los datos faltantes y no atribuye una causa raíz. Identifica el commit de los tests, que **no prueba la versión desplegada de la demo**. Los reportes previos con investigación de código siguen siendo evidencia separada.

Los controles internos del generador verifican que un timeout o datos inválidos no se clasifiquen como bug reproducido. No sustituyen las dos comprobaciones en navegador.

## Ejecución en GitHub

El workflow **Toolshop seeded-bug diagnostic** corre al abrir o actualizar un PR hacia `main`. También se puede lanzar desde Actions → Toolshop seeded-bug diagnostic → Run workflow. No usa secretos.

Aunque encuentre bugs, conserva el fallo y publica `toolshop-diagnostic` con los reportes y evidencias durante 14 días. Un check rojo por sí solo no impide integrar cambios: para eso hace falta que la configuración y el plan del repositorio permitan exigirlo como check obligatorio. No se acredita ese bloqueo con esta implementación.

El workflow normal del proyecto sigue siendo independiente. Un PR puede disparar también esa suite; sus requisitos están en el README principal.

## Validación por otra persona (pendiente)

Compartí el enlace al README y pedí ejecutar los pasos en otra máquina. La entrega requiere esa evidencia real; preparar esta guía no acredita la ejecución del compañero.

Pedile devolver:

- Nombre, fecha, sistema operativo y versión de Node (`node --version`).
- Commit probado (`git rev-parse HEAD`).
- Resultado de instalación, controles internos y diagnóstico, incluyendo cualquier dificultad.
- Carpeta `diagnostic-output` o enlace a una corrida de Actions que haya ejecutado.

Registrá el resultado en el repo cuando llegue. Si necesitó ayuda o cambiaste la guía, anotá el ajuste y pedí repetir los pasos afectados. No alcanza con que lea el README o confirme que tiene acceso.
