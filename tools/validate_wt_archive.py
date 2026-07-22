#!/usr/bin/env python3
import json, pathlib, sys, collections, re, unicodedata
root=pathlib.Path(__file__).resolve().parents[1]
data=root/'historical-data'
manifest=json.load(open(data/'manifest.json'))
errors=[]; totals={'teams':0,'riders':0,'curated':0,'reserves':0}; mins=[]
for e in manifest['years']:
 y=e['year'];p=json.load(open(data/f'{y}.json'))
 teams=p.get('teams',[]);riders=p.get('riders',[])
 totals['teams']+=len(teams);totals['riders']+=len(riders)
 tids=[t['id'] for t in teams];rids=[r['id'] for r in riders]
 if len(tids)!=len(set(tids)):errors.append(f'{y}: team ids duplicated')
 if len(rids)!=len(set(rids)):errors.append(f'{y}: rider ids duplicated')
 valid=set(tids)
 orphan=[r['id'] for r in riders if r.get('teamId') not in valid]
 if orphan:errors.append(f'{y}: {len(orphan)} orphan riders')
 counts=collections.Counter(r['teamId'] for r in riders)
 if counts:mins.append((min(counts.values()),y))
 for r in riders:
  totals['curated']+=bool(r.get('curatedHistoricalRoster'))
  totals['reserves']+=bool(r.get('archivalReserve'))
  for k in ['flat','sprint','mountain','hills','cobbles','tt','ttt','stamina','recovery','acceleration','positioning','downhill']:
   v=r.get('stats',{}).get(k)
   if not isinstance(v,(int,float)) or not 35<=v<=99:errors.append(f'{y}: {r.get("name")} invalid {k}={v}')
 if e['teamCount']!=len(teams) or e['riderCount']!=len(riders):errors.append(f'{y}: manifest mismatch')
 if y==2026:
  if len(teams)!=18:errors.append('2026: not 18 WT')
  if len(riders)!=180:errors.append(f'2026: expected 180 major riders, found {len(riders)}')
  if any(str(t.get('level')).upper()!='WT' for t in teams):errors.append('2026: non-WT team')
  if any(counts.get(t['id'],0)!=10 for t in teams):errors.append('2026: each WorldTeam must contain 10 curated major riders')
  if any(not r.get('curatedMajorRider') for r in riders):errors.append('2026: uncurated rider found')
  filler=re.compile(r'(?i)neopro|domestique|helper|alex rider|leo climber|marco de smet|daniel van der linden')
  if any(filler.search(r.get('name','')) for r in riders):errors.append('2026: synthetic filler name found')
# iconic presence checks
checks={1992:['ONCE','BANESTO'],1998:['ONCE','BANESTO','KELME','FESTINA'],2000:['US POSTAL','TELEKOM','KELME'],2006:['ASTANA','CAISSE','T-MOBILE','COFIDIS','SAUNIER'],2007:['ASTANA','COFIDIS','UNIBET'],2008:['ASTANA','SAUNIER'],2014:['TREK','ASTANA'],2025:['TREK','ASTANA','COFIDIS']}
def norm(s):
 s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().upper()
 return re.sub('[^A-Z0-9]','',s)
for y,patterns in checks.items():
 p=json.load(open(data/f'{y}.json'));names=[norm(t['name']) for t in p['teams']]
 for pat in patterns:
  if not any(norm(pat) in n for n in names):errors.append(f'{y}: missing {pat}')
result={'ok':not errors,'years':len(manifest['years']),**totals,'smallestRoster':min(mins) if mins else None,'errors':errors[:50]}
print(json.dumps(result,ensure_ascii=False,indent=2))
if errors:sys.exit(1)
