const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const app = { innerHTML:'', querySelector(){ return null; } };
const storage = new Map();
const body = { appendChild(){} };
const document = {
  getElementById(id){ return id === 'app' ? app : null; },
  createElement(){ return {className:'',textContent:'',remove(){},style:{}}; },
  body
};
const context = {
  console, Math, Date, JSON, Number, String, Array, Object, Set, Map, Promise,
  setTimeout(fn){ return 0; }, clearTimeout(){},
  document, app,
  window: { localStorage: {getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)} },
  fetch: async function(url){
    const p = path.join(root, url);
    if (!fs.existsSync(p)) return {ok:false,status:404,json:async()=>({})};
    return {ok:true,status:200,json:async()=>JSON.parse(fs.readFileSync(p,'utf8'))};
  }
};
context.globalThis = context;
vm.createContext(context);
for (const file of ['data.js','v024-data.js','game.js','v024-expansion.js','historical-manifest.js','staff-database.js','historical-engine.js']) {
  const code = fs.readFileSync(path.join(root,file),'utf8');
  vm.runInContext(code, context, {filename:file,timeout:10000});
}
(async()=>{
  if (!app.innerHTML.includes('v0.25 Historical')) throw new Error('Home histórico no renderizado');
  if (vm.runInContext('STAFF_OPTIONS_V019.length',context) < 20) throw new Error('Staff nominal no cargado');
  await vm.runInContext('activateHistoricalYearV025(2018,false)', context);
  const teamCount = vm.runInContext('TEAMS.length',context);
  const riderCount = vm.runInContext('RIDERS.length',context);
  if (teamCount !== 51 || riderCount !== 1005) throw new Error(`Pack 2018 incorrecto ${teamCount}/${riderCount}`);
  vm.runInContext('Game.mode="single"; selectTeam(TEAMS.find(t=>RIDERS.filter(r=>r.teamId===t.id).length>=8).id)',context);
  const pending = vm.runInContext('Game.pendingRosterIds.length',context);
  if (pending !== 8) throw new Error(`Roster automático incorrecto ${pending}`);
  vm.runInContext('confirmRoster()',context);
  if (!vm.runInContext('Game.rosterLocked',context)) throw new Error('No se confirmó el roster');
  vm.runInContext('ensureV024State(); renderStaffTabV019(); renderOperationsV024()',context);
  vm.runInContext('Game.selectedTeamId=null; Game.rosterLocked=false; Game.historical.specialYears=[2018,2026]',context);
  await vm.runInContext('activateSpecialEraV025()',context);
  const specialTeams=vm.runInContext('TEAMS.length',context);
  if (specialTeams !== 85) throw new Error(`Cruce de épocas incorrecto: ${specialTeams}`);
  console.log(JSON.stringify({ok:true,teamCount2018:teamCount,riderCount2018:riderCount,specialTeams,staff:vm.runInContext('STAFF_OPTIONS_V019.length',context)}));
})().catch(err=>{ console.error(err); process.exit(1); });
