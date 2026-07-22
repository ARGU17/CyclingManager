const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const app = { innerHTML:'', querySelector(){ return null; }, insertAdjacentHTML(position, html){ this.innerHTML += html; } };
const storage = new Map();
const document = {
  getElementById(id){ return id === 'app' ? app : null; },
  createElement(){ return {className:'',textContent:'',remove(){},style:{},appendChild(){}}; },
  body:{appendChild(){}}
};
const context = {
  console, Math, Date, JSON, Number, String, Array, Object, Set, Map, Promise,
  setTimeout(){ return 0; }, clearTimeout(){},
  document, app,
  window:{localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}},
  fetch:async function(url){
    const p=path.join(root,url);
    if(!fs.existsSync(p)) return {ok:false,status:404,json:async()=>({})};
    return {ok:true,status:200,json:async()=>JSON.parse(fs.readFileSync(p,'utf8'))};
  }
};
context.globalThis=context;
vm.createContext(context);
for(const file of ['data.js','v024-data.js','game.js','v024-expansion.js','historical-manifest.js','current-2026-major.js','staff-database.js','historical-engine.js']){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file,timeout:20000});
}
const run=(code)=>vm.runInContext(code,context,{timeout:20000});
(async()=>{
  if(!app.innerHTML.includes('v0.25+ WT Historical')) throw new Error('Home v0.25+ no renderizado');
  if(run('TEAMS.length')!==18) throw new Error(`2026 debe iniciar con 18 WT, obtenido ${run('TEAMS.length')}`);
  if(run('RIDERS.length')!==180) throw new Error(`2026 debe iniciar con 180 figuras principales, obtenido ${run('RIDERS.length')}`);
  if(run('RIDERS.some(r=>getTeam(r.teamId)?.level!=="WT")')) throw new Error('2026 contiene corredores no WT');
  if(run('RIDERS.some(r=>!r.curatedMajorRider)')) throw new Error('2026 contiene corredores no curados');
  if(run('RIDERS.some(r=>/neopro|domestique|helper|alex rider|leo climber/i.test(r.name))')) throw new Error('2026 contiene nombres sintéticos');
  if(run('HISTORICAL_MANIFEST_V025.years.filter(y=>y.file).length')!==37) throw new Error('No están disponibles los 37 años');
  if(!run('containsTokenSequenceV025(searchTokensV025("O.N.C.E"),searchTokensV025("ONCE"))')) throw new Error('La búsqueda no reconoce O.N.C.E');
  if(run('containsTokenSequenceV025(searchTokensV025("VITAL CONCEPT"),searchTokensV025("ONCE"))')) throw new Error('La búsqueda ONCE produce falso positivo en CONCEPT');
  if(!run('containsTokenSequenceV025(searchTokensV025("U.S POSTAL SERVICE"),searchTokensV025("US Postal"))')) throw new Error('La búsqueda no reconoce U.S Postal');

  // 2026 curated roster must remain fully playable.
  run('Game.mode="single"; selectTeam(TEAMS.find(t=>t.id==="uae").id)');
  if(run('Game.pendingRosterIds.length')!==8) throw new Error('La convocatoria 2026 no propone 8 corredores');
  run('confirmRoster()');
  if(!run('Game.rosterLocked')) throw new Error('No se confirmó la convocatoria UAE 2026');
  run('simulateFullStageQuick()');
  if(!run('Game.lastStage?.results?.length')) throw new Error('La etapa 2026 no generó resultados');
  if(run('Game.lastStage.results.some(x=>!Number.isFinite(x.time))')) throw new Error('Tiempos 2026 no finitos');
  run('Game.selectedTeamId=null;Game.rosterLocked=false;Game.pendingRosterIds=[];Game.lastStage=null');

  await run('activateHistoricalYearV025(1992,false)');
  const names92=run('TEAMS.map(t=>t.name)');
  for(const expected of ['ONCE','BANESTO']) if(!names92.some(n=>n.toUpperCase().includes(expected))) throw new Error(`Falta ${expected} en 1992`);
  const playable92=run('TEAMS.filter(t=>getFullTeamRiders(t.id).length>=2).length');
  if(playable92!==run('TEAMS.length')) throw new Error('Hay equipos 1992 no seleccionables');

  run('Game.mode="single"; selectTeam(TEAMS.find(t=>t.name.toUpperCase().includes("ONCE")).id)');
  if(run('Game.pendingRosterIds.length')!==run('historicalRosterSizeV025(Game.selectedTeamId)')) throw new Error('Roster ONCE incorrecto');
  run('confirmRoster()');
  if(!run('Game.rosterLocked')) throw new Error('No se confirmó ONCE 1992');
  if(run('getRaceRiders(true).length')<100) throw new Error('Pelotón histórico demasiado pequeño tras confirmar');
  run('simulateFullStageQuick()');
  if(!run('Game.lastStage?.results?.length')) throw new Error('La etapa histórica no generó resultados');
  if(run('Game.lastStage.results.some(x=>!Number.isFinite(x.time))')) throw new Error('Tiempos históricos no finitos');

  run('Game.selectedTeamId=null;Game.rosterLocked=false');
  await run('activateHistoricalYearV025(2006,false)');
  const required06=['T-MOBILE','CAISSE','COFIDIS','SAUNIER DUVAL'];
  const names06=run('TEAMS.map(t=>t.name.toUpperCase())');
  for(const expected of required06) if(!names06.some(n=>n.includes(expected))) throw new Error(`Falta ${expected} en 2006`);

  run('Game.selectedTeamId=null;Game.rosterLocked=false');
  await run('activateHistoricalYearV025(2026,false)');
  if(run('TEAMS.length')!==18) throw new Error('Al recargar 2026 no hay 18 WT');

  run('Game.selectedTeamId=null;Game.rosterLocked=false;Game.historical.specialYears=[1992,2026];Game.historical.specialCalendarYear=2026');
  await run('activateSpecialEraV025()');
  const specialTeams=run('TEAMS.length');
  if(specialTeams!==40) throw new Error(`Cruce 1992+2026 esperado 40 equipos, obtenido ${specialTeams}`);
  if(run('new Set(TEAMS.map(t=>t.id)).size')!==specialTeams) throw new Error('IDs de equipos multi-era duplicados');
  if(run('new Set(RIDERS.map(r=>r.id)).size')!==run('RIDERS.length')) throw new Error('IDs de corredores multi-era duplicados');

  // Test a sparse archival roster can still start.
  const sparseId=run('TEAMS.slice().sort((a,b)=>getFullTeamRiders(a.id).length-getFullTeamRiders(b.id).length)[0].id');
  run(`Game.mode="single";selectTeam(${JSON.stringify(sparseId)})`);
  const sparseRequired=run('historicalRosterSizeV025(Game.selectedTeamId)');
  if(sparseRequired<1 || sparseRequired>8) throw new Error('Tamaño adaptativo inválido');
  run('confirmRoster()');
  if(!run('Game.rosterLocked')) throw new Error('No se confirmó plantilla adaptativa');

  console.log(JSON.stringify({
    ok:true,
    years:37,
    wt2026:18,
    riders2026:JSON.parse(fs.readFileSync(path.join(root,'historical-data/2026.json'),'utf8')).riders.length,
    teams1992:22,
    teams2006:run('HISTORICAL_MANIFEST_V025.years.find(y=>y.year===2006).teamCount'),
    specialTeams,
    staff:run('STAFF_OPTIONS_V019.length'),
    sparseRequired
  },null,2));
})().catch(err=>{console.error(err);process.exit(1)});
