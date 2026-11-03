import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { classify, type Observation } from './model';

export default class StandardReporter implements Reporter {
  private results: { test: TestCase; result: TestResult }[] = [];
  onBegin() {
    for (const dir of ['reports', 'evidence']) {
      const target = path.resolve('diagnostic-output', dir);
      fs.rmSync(target, { recursive: true, force: true });
      fs.mkdirSync(target, { recursive: true });
    }
  }
  onTestEnd(test: TestCase, result: TestResult) { this.results.push({ test, result }); }
  async onEnd(full: FullResult) {
    let commit = '[FALTA DATO: commit de los tests]';
    try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch {}
    const summary: { id: string; classification: string; status: string; durationMs: number; report: string }[] = [];
    for (const { test, result } of this.results) {
      const id = test.title.split(' ')[0];
      const attachment = result.attachments.find(a => a.name === 'observation');
      let observation: Observation | undefined;
      try {
        const raw = attachment?.body ?? (attachment?.path ? fs.readFileSync(attachment.path) : undefined);
        if (raw) observation = JSON.parse(raw.toString());
      } catch {}
      const classification = classify(observation, result.status);
      const links: string[] = [];
      for (const [index, a] of result.attachments.entries()) {
        const extension = a.path ? path.extname(a.path) : a.contentType === 'image/png' ? '.png' : a.contentType === 'application/json' ? '.json' : '.txt';
        const name = `${id}-${index}-${a.name.replace(/[^a-zA-Z0-9-]/g, '-')}${extension}`;
        const target = path.join('diagnostic-output/evidence', name);
        if (a.body) fs.writeFileSync(target, a.body);
        else if (a.path && fs.existsSync(a.path)) fs.copyFileSync(a.path, target);
        else continue;
        links.push(`- [${a.name}](../evidence/${name})`);
      }
      const errors = result.errors.map(e => e.message ?? String(e)).join('\n\n');
      if (errors) {
        fs.writeFileSync(`diagnostic-output/evidence/${id}-errors.txt`, errors);
        links.push(`- [Error literal de ejecución](../evidence/${id}-errors.txt)`);
      }
      const o = observation;
      const home = id === 'BUG-002';
      const title = home ? '[Navegación] Home mantiene al usuario en Contacto' : '[Catálogo] Price Low - High muestra precios fuera de orden';
      const missing = '[FALTA DATO: no se midió en esta ejecución]';
      const impact = o?.complete ? home
        ? `${o.measurements.unexpectedContactDestinations} destino inesperado en ${o.measurements.attempts} intento de navegación.`
        : `${o.measurements.ascendingViolations} pares fuera de orden sobre ${o.measurements.adjacentPairs} pares comparados; ${o.measurements.cards} productos visibles.` : missing;
      const reproduced = classification === 'HALLAZGO_REPRODUCIDO';
      const report = `# ${id} — ${classification}\n\n${reproduced ? 'Hallazgo reproducido en esta corrida.' : 'Este resultado no confirma un defecto del producto.'}\n\n## Datos generales\n- **Título**: ${title}\n- **Severidad propuesta**: Media; afecta la navegación o selección de productos, con alternativa. Pendiente de triage.\n- **Prioridad**: [FALTA DATO: la define el PO]\n- **Ambiente**: Demo con errores sembrados — https://with-bugs.practicesoftwaretesting.com/\n- **Versión desplegada**: [FALTA DATO: no expuesta por la demo]\n- **Commit de los tests**: ${commit} (no identifica la versión desplegada)\n- **Navegador / dispositivo**: ${o ? `${o.browser}; ${o.platform} ${o.osRelease}` : missing}\n- **Ticket relacionado**: ${id}; caso automatizado: ${test.title}\n- **Reportado con**: Playwright y generador determinista; implementación asistida por Codex.\n\n## Qué pasó\n${reproduced ? home ? 'Al hacer clic en Home desde Contacto, el usuario permanece en Contacto. Esto dificulta volver al catálogo para elegir productos.' : 'Al elegir ordenar de menor a mayor, la lista visible contiene precios que bajan respecto del anterior. Esto dificulta comparar productos por precio.' : 'Consultar la clasificación y la evidencia. Un fallo de ejecución no demuestra que exista el bug.'}\n\n## Pasos para reproducir\n**Precondiciones**: Chromium instalado; acceso a Internet; sesión anónima.\n1. Abrir ${home ? '/#/contact' : '/'} en la demo indicada.\n2. ${home ? 'Hacer clic en el enlace Home del encabezado.' : 'Elegir Price (Low - High) en el selector de orden.'}\n3. ${home ? 'Observar la URL y la pantalla resultantes.' : 'Esperar la respuesta de catálogo y comparar los precios visibles consecutivos.'}\n\n**Resultado esperado**: ${home ? 'Home abre el catálogo y muestra productos.' : 'Cada precio es menor o igual que el siguiente.'} — según la función y el texto del control.\n**Resultado obtenido**: ${classification}; estado Playwright: ${result.status}. Los valores exactos están en Datos observados y el error literal está adjunto.\n**Frecuencia**: ${o?.complete ? 'Una observación en esta corrida; sin reintentos. No extrapolar a otras ejecuciones.' : missing}\n\n## Datos de prueba\n- **Usuario y rol**: Anónimo, sin cuenta.\n- **Valores ingresados / registros**: Ver Datos observados; no se envían formularios ni se crean registros.\n- **De dónde salen los datos**: Catálogo público de la demo, leído durante esta corrida.\n- **Contexto**: ${o?.capturedAt ?? missing}; zona del navegador America/Argentina/Mendoza; idioma en-US.\n\n## Origen\n- **Cómo se encontró**: Comprobación automatizada de dos hallazgos conocidos en la demo con bugs sembrados. No son descubrimientos nuevos.\n- **Capa**: UI; se registra la respuesta API de orden cuando está disponible.\n- **Dónde falla**: ${o?.url ?? missing}; ${home ? 'encabezado › Home' : 'catálogo › selector de orden y precios'}.\n- **Desde cuándo**: Observación de esta corrida; primera versión afectada y última sana: [FALTA DATO].\n\n## Impacto\n- **Qué flujo afecta**: ${home ? 'Regreso al catálogo.' : 'Comparación de productos por precio.'}\n- **A quién afecta**: Sesión anónima y navegador probados; otros roles o navegadores no evaluados.\n- **Cuántos**: ${impact} Fuente: observation.json adjunto. No se midieron usuarios reales.\n- **Alternativa**: ${home ? 'Abrir la raíz de la demo directamente.' : 'Comparar precios manualmente.'} No validada como parte de esta corrida.\n- **¿Funcionaba antes?**: No se sabe.\n\n## Evidencia\n${links.join('\n') || missing}\n\n## Datos observados\n\`\`\`json\n${JSON.stringify(o ?? { classification }, null, 2)}\n\`\`\`\n\n## Fuente del error (Nivel 2)\n- **Archivo y clase**: [FALTA DATO: este proceso no inspecciona código del producto]\n- **Commit o PR que lo introdujo**: [FALTA DATO]\n- **Cómo lo encontraste**: Se verificó el comportamiento visible; no se investigó la causa en esta corrida.\n- **Causa**: No determinada por este proceso.\n- **Certeza**: No se confirma causa raíz.\n\n## Solución propuesta (Nivel 3, opcional)\nPendiente de investigar la causa. La prueba adjunta valida el comportamiento esperado; no se modificó el producto.\n`;
      fs.writeFileSync(`diagnostic-output/reports/${id}.md`, report);
      summary.push({ id, classification, status: result.status, durationMs: result.duration, report: `${id}.md` });
    }
    fs.writeFileSync('diagnostic-output/reports/summary.json', JSON.stringify({ generatedAt: new Date().toISOString(), runnerStatus: full.status, testCommit: commit, results: summary }, null, 2));
    fs.writeFileSync('diagnostic-output/reports/README.md', `# Resultado del diagnóstico\n\nEstado del ejecutor: ${full.status}. Los fallos conservan su código de salida.\n\n${summary.map(r => `- [${r.id}](${r.report}): ${r.classification} (${r.status})`).join('\n')}\n\nUn resultado inconcluso requiere revisar la ejecución; no confirma un bug.\n`);
  }
}
