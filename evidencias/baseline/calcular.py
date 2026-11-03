"""Recalcula las métricas desde el snapshot versionado, sin red ni modelo."""
import json
from pathlib import Path
r=Path(__file__).parent
s=json.loads((r/'snapshot-20261103.json').read_text())
ui=sum(x['file'].startswith('toolshop/') for x in s['inventory'])
api=sum(x['file'].startswith('api/') for x in s['inventory'])
rr=[y for x in s['executions'] for t in x['tests'] for y in t['results']]
assert len(rr)==9 and all(y['retry']==0 for y in rr)
passed=sum(y['status']=='passed' for y in rr)
seconds=s['stats']['duration']/1000
out={'date':s['date'],'uiImplemented':ui,'apiImplemented':api,'uiWithoutLoginExecuted':len(rr),'uiWithoutLoginPassed':passed,'uiWithoutLoginDurationSeconds':seconds,'displaySeconds':round(seconds,1),'baselineDate':'2026-10-30','baselineUi':10,'baselineApi':2,'baselineDurationSeconds':55.9,'durationChangePercent':round((seconds/55.9-1)*100,1)}
(r/'metricas.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
