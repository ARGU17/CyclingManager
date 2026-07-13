/* ============================================================
   CYCLING MANAGER TOUR
   game.js
   v0.17 realism patch
   ============================================================ */

const app = document.getElementById("app");
const SAVE_KEY = "cyclingManager_v017";

const Game = {
  version: SAVE_VERSION,
  mode: "single",
  selectedRaceId: DEFAULT_RACE_ID,
  selectedTeamId: null,
  seasonIndex: 0,
  betweenRaces: false,
  seasonFinished: false,
  raceHistory: [],
  pendingRosterIds: [],
  raceRosters: {},
  rosterLocked: false,
  lastRaceRosterIds: [],
  currentStageIndex: 0,
  activeTab: "director",
  riders: [],
  riderOrders: {},
  riderEfforts: {},
  riderEquipment: {},
  protectedRiderId: null,
  nutritionMode: "auto_smart",
  nutritionPlanId: "balanced",
  stock: {},
  tttRelayIntensity: "steady",
  tttRelayLength: "medium",
  tttFormation: "smooth",
  stageHistory: [],
  lastStage: null,
  live: null,
  teamTimes: {},
  finished: false,
  trainingPlanId: "race_sharpening"
};

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function toNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
function rnd(min, max) {
  min = toNum(min, 0);
  max = toNum(max, min);
  return min + Math.random() * (max - min);
}
function avg(arr) {
  const clean = (arr || []).map(v => Number(v)).filter(Number.isFinite);
  return clean.length ? clean.reduce((a, b) => a + b, 0) / clean.length : 0;
}
function esc(value) {
  return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
}
function seconds(value) {
  const safe = Number(value);
  if (!Number.isFinite(safe)) return "00:00";
  const t = Math.max(0, Math.round(safe));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return h ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}` : `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
function gap(value, leader) {
  value = toNum(value, 0);
  leader = toNum(leader, value);
  const d = Math.round(value - leader);
  return d <= 0 ? "m.t." : `+${seconds(d)}`;
}
function safeRaceTime(rider, stage, multiplier = 1) {
  const base = toNum(stage.distance, 120) / Math.max(20, baseSpeed(stage, {type: stage.type === "ttt" ? "tt" : stage.type, from:0, to:stage.distance, difficulty:stage.difficulty}) || 35) * 3600;
  const terrain = stage.type === "mountain" ? rider.stats.mountain : stage.type === "flat" ? Math.max(rider.stats.flat, rider.stats.sprint * 0.92) : stage.type === "tt" || stage.type === "ttt" ? rider.stats.tt : stage.type === "cobbles" ? rider.stats.cobbles : rider.stats.hills;
  const perf = toNum(terrain, 75) * 0.55 + toNum(rider.stats.stamina, 75) * 0.18 + toNum(rider.form, 75) * 0.17 + toNum(rider.base, 75) * 0.10;
  return Math.max(600, base + (84 - perf) * 24 * multiplier + rnd(-45, 45));
}
function byId(list, id) { return list.find(x => x.id === id); }
function getRace() { return byId(RACES, Game.selectedRaceId) || RACES[0]; }
function getStage() { return getRace().stages[Game.currentStageIndex]; }
function getTeam(id) { return byId(TEAMS, id); }
function getRider(id) { return Game.riders.find(r => r.id === id); }
function getFrame(id) { return byId(FRAME_BRANDS, id) || FRAME_BRANDS[0]; }
function getWheels(id) { return byId(WHEEL_BRANDS, id) || WHEEL_BRANDS[0]; }
function getOrder(id) { return byId(RIDER_ORDERS, id) || RIDER_ORDERS[1]; }
function getNutritionItem(id) { return byId(NUTRITION_ITEMS, id); }
function getFullTeamRiders(teamId) { return Game.riders.filter(r => r.teamId === teamId); }
function getRaceRosterIds(teamId) { return Game.raceRosters[teamId] || autoSelectRoster(teamId, getRace()).map(r => r.id); }
function getTeamRiders(teamId, includeAbandoned = false) { const ids = getRaceRosterIds(teamId); return Game.riders.filter(r => ids.includes(r.id) && (includeAbandoned || !r.abandoned)); }
function getRaceRiders(includeAbandoned = false) { return TEAMS.flatMap(t => getTeamRiders(t.id, includeAbandoned)); }
function isTT(stage = getStage()) { return stage.type === "tt"; }
function isTTT(stage = getStage()) { return stage.type === "ttt"; }
function roleKeys(group) {
  if (group === "leaders") return ["gc", "co"];
  if (group === "climbers") return ["climber", "puncheur"];
  if (group === "workers") return ["domestique", "rouleur", "tt"];
  if (group === "sprinters") return ["sprinter", "classics"];
  return [];
}

function init() {
  Game.version = SAVE_VERSION;
  Game.mode = "single";
  Game.selectedRaceId = DEFAULT_RACE_ID;
  Game.selectedTeamId = null;
  Game.seasonIndex = 0;
  Game.betweenRaces = false;
  Game.seasonFinished = false;
  Game.raceHistory = [];
  Game.pendingRosterIds = [];
  Game.raceRosters = {};
  Game.rosterLocked = false;
  Game.lastRaceRosterIds = [];
  Game.currentStageIndex = 0;
  Game.activeTab = "director";
  Game.riders = clone(RIDERS);
  Game.riderOrders = {};
  Game.riderEfforts = {};
  Game.riderEquipment = {};
  Game.protectedRiderId = null;
  Game.nutritionMode = "auto_smart";
  Game.nutritionPlanId = "balanced";
  Game.stock = {};
  Game.tttRelayIntensity = "steady";
  Game.tttRelayLength = "medium";
  Game.tttFormation = "smooth";
  Game.stageHistory = [];
  Game.lastStage = null;
  Game.live = null;
  Game.teamTimes = {};
  Game.finished = false;
  Game.trainingPlanId = "race_sharpening";
  renderHome();
}
function saveGame(show = true) {
  Game.version = SAVE_VERSION;
  localStorage.setItem(SAVE_KEY, JSON.stringify(Game));
  if (show) toast("Partida guardada");
}
function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return toast("No hay guardado v0.17. Empieza partida nueva.");
  try {
    const obj = JSON.parse(raw);
    if (obj.version !== SAVE_VERSION) {
      localStorage.removeItem(SAVE_KEY);
      toast("Guardado antiguo eliminado. Inicia una partida nueva.");
      return init();
    }
    Object.assign(Game, obj);
    if (!Game.riders || !Game.riders.length) Game.riders = clone(RIDERS);
    sanitizeGameState();
    render();
  } catch (e) {
    localStorage.removeItem(SAVE_KEY);
    toast("Guardado corrupto eliminado.");
    init();
  }
}
function clearSave() {
  [SAVE_KEY,"cyclingManager_v013","cyclingManager_v012","cyclingManager_v011","cyclingManager_v10","cyclingManager_v09","cyclingManager_v08"].forEach(k => localStorage.removeItem(k));
  toast("Guardados antiguos borrados");
}
function sanitizeGameState() {
  Game.riders.forEach(r => {
    r.totalTime = toNum(r.totalTime, 0);
    r.points = toNum(r.points, 0);
    r.mountainPoints = toNum(r.mountainPoints, 0);
    r.uciPoints = toNum(r.uciPoints, 0);
    r.fatigue = clamp(toNum(r.fatigue, 0), 0, 100);
    r.form = clamp(toNum(r.form, r.base || 75), 40, 100);
    if (!r.stats) r.stats = {};
    ["flat","sprint","mountain","hills","cobbles","tt","ttt","stamina","recovery","acceleration","positioning","downhill"].forEach(k => {
      r.stats[k] = clamp(toNum(r.stats[k], 70), 35, 99);
    });
  });
}
function toast(message) { const el = document.createElement("div"); el.className = "toast"; el.textContent = message; document.body.appendChild(el); setTimeout(() => el.remove(), 1800); }
function render() {
  if (!Game.selectedTeamId) return renderHome();
  if (Game.seasonFinished) return renderSeasonFinal();
  if (Game.betweenRaces) return renderBetweenRaces();
  if (!Game.rosterLocked) return renderRosterSelection();
  if (Game.finished) return renderRaceFinal();
  if (Game.live) return renderLive();
  return renderRace();
}

function renderHome() {
  app.innerHTML = `
    <div class="header">
      <div><h1>Cycling Manager Tour</h1><p>v0.17 · simulación realista · perfiles 1 km con microgradientes · gaps estabilizados</p></div>
      <div class="top-actions"><button class="secondary" onclick="loadGame()">Cargar</button><button class="danger" onclick="clearSave()">Borrar guardado</button></div>
    </div>
    <section class="panel"><h2>Modo de juego</h2><div class="mode-grid">
      <button class="mode-card ${Game.mode === "single" ? "active" : ""}" onclick="setMode('single')"><strong>Carrera única</strong><span>Escoge una carrera y disputa solo ese evento.</span></button>
      <button class="mode-card ${Game.mode === "season" ? "active" : ""}" onclick="setMode('season')"><strong>Temporada 2026</strong><span>Calendario por orden real, selección antes de cada carrera y entrenamientos entre eventos.</span></button>
    </div></section>
    ${Game.mode === "single" ? renderRaceSelector() : renderSeasonPreview()}
    <section class="panel"><h2>Elige equipo</h2><div class="grid teams">${TEAMS.map(renderTeamCard).join("")}</div></section>`;
}
function setMode(mode) { Game.mode = mode; if (mode === "season") { Game.seasonIndex = 0; Game.selectedRaceId = GameRaceIdBySeasonIndex(); } renderHome(); }
function GameRaceIdBySeasonIndex() { return SEASON_RACE_IDS[Game.seasonIndex] || DEFAULT_RACE_ID; }
function renderRaceSelector() {
  return `<section class="panel"><h2>Elige carrera</h2><div class="race-grid">${RACES.map(r => `
    <button class="race-card ${Game.selectedRaceId === r.id ? "active" : ""}" onclick="Game.selectedRaceId='${r.id}';renderHome()">
      <span class="race-date">${r.date}</span><span class="race-title">${esc(r.name)}</span><span class="badge ${r.jerseyClass}">${esc(r.jersey)}</span><span class="muted small">${r.stages.length} etapa${r.stages.length>1?"s":""} · ${esc(r.country)}</span>
    </button>`).join("")}</div></section>`;
}
function renderSeasonPreview() {
  return `<section class="panel"><h2>Calendario temporada 2026</h2><div class="season-calendar">${RACES.map((r,i) => `
    <div class="calendar-card ${i===Game.seasonIndex?"active":""}"><span class="badge ${r.jerseyClass}">${r.date}</span><strong>${esc(r.name)}</strong><small>${r.stages.length} etapa${r.stages.length>1?"s":""} · ${esc(r.country)}</small></div>`).join("")}</div></section>`;
}
function renderTeamCard(team) {
  const riders = RIDERS.filter(r => r.teamId === team.id).sort((a,b) => b.base - a.base);
  return `<div class="team-card" style="--team-primary:${team.visual.primary};--team-secondary:${team.visual.secondary};--team-accent:${team.visual.accent};">
    ${renderJersey(team)}<div class="badge-row"><span class="badge green">${team.level}</span><span class="badge">${esc(team.archetype)}</span><span class="badge blue">${riders.length} corredores</span></div>
    <h3>${esc(team.name)}</h3><p class="muted small">${esc(team.country)} · ${esc(getFrame(team.material.frame).name)} · ${esc(getWheels(team.material.wheels).name)}</p>
    <div class="chip-row">${riders.slice(0,5).map(r => `<span class="chip">${esc(r.name)}</span>`).join("")}</div>
    <button onclick="selectTeam('${team.id}')">Seleccionar equipo</button>
  </div>`;
}
function renderJersey(team) {
  return `<div class="jersey-card"><div class="jersey-3d"><div class="jersey-sleeve left"></div><div class="jersey-body"><div class="jersey-neck"></div><div class="stripe stripe-a"></div><div class="stripe stripe-b"></div><span>${esc(team.visual.logoText)}</span><small>${esc(team.name)}</small></div><div class="jersey-sleeve right"></div></div></div>`;
}
function selectTeam(teamId) {
  Game.selectedTeamId = teamId;
  Game.riders = clone(RIDERS);
  if (Game.mode === "season") { Game.seasonIndex = 0; Game.selectedRaceId = GameRaceIdBySeasonIndex(); Game.raceHistory = []; Game.seasonFinished = false; }
  prepareRosterSelection();
}

function prepareRosterSelection() {
  Game.pendingRosterIds = autoSelectRoster(Game.selectedTeamId, getRace()).map(r => r.id);
  Game.raceRosters = {}; Game.rosterLocked = false; Game.finished = false; Game.betweenRaces = false; Game.live = null;
  renderRosterSelection();
}
function autoSelectRoster(teamId, race) {
  const riders = getFullTeamRiders(teamId);
  const weights = {flat:0,hilly:0,mountain:0,cobbles:0,tt:0,ttt:0};
  race.stages.forEach(s => { weights[s.type] = (weights[s.type] || 0) + 1; });
  return riders.map(r => {
    const s = r.stats;
    const terrainScore = s.flat*weights.flat*.35 + s.sprint*weights.flat*.20 + s.hills*weights.hilly*.75 + s.mountain*weights.mountain*1.10 + s.cobbles*weights.cobbles*.95 + s.tt*weights.tt*.90 + s.ttt*weights.ttt*.95;
    const roleBonus = (race.type === "grand_tour" && ["gc","co","climber","domestique"].includes(r.roleKey) ? 35 : 0) + (weights.flat >= 3 && r.roleKey === "sprinter" ? 18 : 0) + (weights.cobbles && r.roleKey === "classics" ? 22 : 0);
    const score = r.base*0.65 + terrainScore + r.form*.35 - r.fatigue*.45 + r.stats.stamina*.35 + r.stats.recovery*.28 + roleBonus;
    return {r, score};
  }).sort((a,b) => b.score - a.score).slice(0, ROSTER_SIZE).map(x => x.r);
}
function toggleRoster(id) { if (Game.rosterLocked) return; if (Game.pendingRosterIds.includes(id)) Game.pendingRosterIds = Game.pendingRosterIds.filter(x => x !== id); else { if (Game.pendingRosterIds.length >= ROSTER_SIZE) return toast(`Máximo ${ROSTER_SIZE}`); Game.pendingRosterIds.push(id); } renderRosterSelection(); }
function confirmRoster() {
  if (Game.pendingRosterIds.length !== ROSTER_SIZE) return toast(`Debes escoger exactamente ${ROSTER_SIZE} corredores`);
  Game.raceRosters = {};
  TEAMS.forEach(team => { Game.raceRosters[team.id] = autoSelectRoster(team.id, getRace()).map(r => r.id); });
  Game.raceRosters[Game.selectedTeamId] = [...Game.pendingRosterIds];
  Game.lastRaceRosterIds = [...Game.pendingRosterIds];
  resetRaceState(); Game.rosterLocked = true; saveGame(false); renderRace();
}
function renderRosterSelection() {
  const team = getTeam(Game.selectedTeamId), race = getRace();
  const riders = getFullTeamRiders(Game.selectedTeamId).slice().sort((a,b) => b.base - a.base);
  app.innerHTML = `<div class="header"><div><h1>Selecciona tus ${ROSTER_SIZE} corredores</h1><p>${esc(team.name)} · ${esc(race.name)} · la convocatoria queda bloqueada durante la carrera</p></div><div class="top-actions"><button class="secondary" onclick="Game.selectedTeamId=null;renderHome()">Volver</button><button onclick="confirmRoster()">Confirmar selección</button></div></div>
    <section class="panel sticky-panel"><div class="roster-summary"><div><strong>${Game.pendingRosterIds.length}/${ROSTER_SIZE} seleccionados</strong><p class="muted small">Elige bloque según perfil: GC, montaña, sprint, crono, pavé y gregarios.</p></div><div class="chip-row">${Game.pendingRosterIds.map(id => `<span class="chip selected">${esc(getRider(id).name)}</span>`).join("")}</div></div></section>
    <section class="panel"><h2>Plantilla completa</h2><div class="roster-grid">${riders.map(renderRosterCard).join("")}</div></section>`;
}
function renderRosterCard(r) {
  const selected = Game.pendingRosterIds.includes(r.id);
  return `<button class="roster-card ${selected?"selected":""}" onclick="toggleRoster('${r.id}')"><div class="badge-row"><span class="badge green">${esc(r.role)}</span><span class="badge blue">Base ${r.base}</span><span class="badge orange">Forma ${Math.round(r.form)}</span><span class="badge">Fat. ${Math.round(r.fatigue)}</span></div><h3>${esc(r.name)}</h3><p class="muted small">${esc(r.nationality)} · ${r.age} años · ${r.weightKg} kg</p>${miniStats(r)}</button>`;
}
function miniStats(r) { return `<div class="mini-stats"><span>⛰ ${r.stats.mountain}</span><span>⚡ ${r.stats.sprint}</span><span>⏱ ${r.stats.tt}</span><span>🪨 ${r.stats.cobbles}</span><span>🫀 ${r.stats.stamina}</span></div>`; }

function resetRaceState() {
  Game.currentStageIndex = 0; Game.activeTab = "director"; Game.stageHistory = []; Game.lastStage = null; Game.live = null; Game.finished = false;
  Game.teamTimes = Object.fromEntries(TEAMS.map(t => [t.id, 0]));
  Game.riders.forEach(r => { r.totalTime = 0; r.points = 0; r.mountainPoints = 0; r.stageWins = 0; r.abandoned = false; });
  Game.riderOrders = {}; Game.riderEfforts = {}; Game.riderEquipment = {};
  getRaceRiders(true).forEach(r => { Game.riderOrders[r.id] = r.defaultOrder; Game.riderEfforts[r.id] = r.defaultEffort; Game.riderEquipment[r.id] = autoEquipmentForStage(r.teamId, getStage()); });
  Game.protectedRiderId = autoSelectRoster(Game.selectedTeamId, getRace())[0]?.id || getTeamRiders(Game.selectedTeamId,true)[0]?.id || null;
  resetStockForStage();
}
function resetStockForStage() { const plan = byId(NUTRITION_PLANS, Game.nutritionPlanId) || NUTRITION_PLANS[0]; Game.stock = clone(plan.stock); }

function renderRace() {
  const race = getRace(), stage = getStage(), team = getTeam(Game.selectedTeamId);
  app.innerHTML = `<div class="header"><div><h1>${esc(team.name)}</h1><p>${Game.mode === "season" ? `Temporada · ${Game.seasonIndex+1}/${SEASON_RACE_IDS.length} · ` : ""}${esc(race.name)} · Etapa ${Game.currentStageIndex+1}/${race.stages.length}</p></div><div class="top-actions"><button class="secondary" onclick="saveGame()">Guardar</button><button class="danger" onclick="init()">Reiniciar</button></div></div>
    ${renderLeaderStrip()}
    <div class="tabs">${[["director","Race Director"],["strategy","Estrategia"],["nutrition","Alimentación"],["material","Material"],["team","Equipo"],["class","Clasificaciones"],["history","Historial"]].map(([id,label]) => `<button class="tab ${Game.activeTab===id?"active":""}" onclick="setTab('${id}')">${label}</button>`).join("")}</div>
    ${Game.activeTab === "director" ? renderDirectorTab() : ""}
    ${Game.activeTab === "strategy" ? renderStrategyTab(false) : ""}
    ${Game.activeTab === "nutrition" ? renderNutritionTab() : ""}
    ${Game.activeTab === "material" ? renderMaterialTab() : ""}
    ${Game.activeTab === "team" ? renderTeamTab() : ""}
    ${Game.activeTab === "class" ? renderClassTab() : ""}
    ${Game.activeTab === "history" ? renderHistoryTab() : ""}`;
}
function setTab(tab) { Game.activeTab = tab; renderRace(); }
function renderLeaderStrip() {
  const gc = getGC(), race = getRace(), leader = gc[0];
  return `<section class="leader-strip"><div class="leader-card ${race.jerseyClass}"><span>${esc(race.jersey)}</span><strong>${leader?esc(leader.name):"—"}</strong><small>${leader&&Game.stageHistory.length?seconds(leader.totalTime):"Sin disputar"}</small></div><div class="leader-card jersey-green"><span>Puntos</span><strong>${getPoints()[0]?.name||"—"}</strong><small>${getPoints()[0]?.points||0} pts</small></div><div class="leader-card jersey-polka"><span>Montaña</span><strong>${getMountain()[0]?.name||"—"}</strong><small>${getMountain()[0]?.mountainPoints||0} pts</small></div><div class="leader-card jersey-white"><span>Joven</span><strong>${getYouth()[0]?.name||"—"}</strong><small>${getYouth()[0]&&Game.stageHistory.length?seconds(getYouth()[0].totalTime):"—"}</small></div><div class="leader-card jersey-blue"><span>Equipos</span><strong>${getTeamsClass()[0]?.team.name||"—"}</strong><small>${getTeamsClass()[0]&&Game.stageHistory.length?seconds(getTeamsClass()[0].time):"—"}</small></div></section>`;
}
function renderDirectorTab() { const stage = getStage(); return `<div class="grid director"><section class="panel">${renderActionBar(false)}${renderWeather(stage)}${renderStageProfile(stage)}${renderTacticalAdvice(stage)}${renderVisualLanesPreview()}</section><section class="panel">${renderStrategyTab(false,true)}</section></div>`; }
function renderActionBar(live) {
  const stage = getStage(), sector = live ? stage.sectors[Game.live.sectorIndex] : null;
  return `<div class="actionbar ${live?"live":""}"><div><strong>${live?`Sector ${Game.live.sectorIndex+1}/${stage.sectors.length} · ${sector.name}`:"Salida de etapa"}</strong><p>${live?`Km ${sector.from}-${sector.to} · ${sector.question}`:"Simulación rápida o Race Director por sectores. CRI/CRE usan salidas separadas."}</p>${live?`<div class="bar"><div style="width:${Math.round((sector.from/stage.distance)*100)}%"></div></div>`:""}</div><div class="actionbar-buttons">${live?`<button onclick="simulateSector()">Simular sector</button><button class="secondary" onclick="renderLive()">Actualizar</button>`:`<button class="secondary" onclick="simulateFullStageQuick()">Simular etapa rápida</button><button onclick="startLiveStage()">Iniciar por sectores</button>`}</div></div>`;
}
function renderWeather(stage) {
  const w = stage.weather;
  return `<div class="weather-panel"><div><strong>Clima</strong><span>${w.label}</span></div><div>🌡 <b>${w.temp}ºC</b><small>${w.temp>30?"Calor: más hidratación":"Temperatura normal"}</small></div><div>🌧 <b>${w.rainChance}%</b><small>Carretera mojada ${w.roadWet}%</small></div><div>💨 <b>${w.wind} km/h</b><small>Lateral ${w.crosswind} km/h</small></div></div>`;
}
function renderStageProfile(stage, groups = []) {
  const w=1100,h=300,pad=34,pts=stage.profilePoints||[];
  const maxAlt=Math.max(...pts.map(p=>p.alt),1000), minAlt=Math.min(...pts.map(p=>p.alt),0);
  const path=pts.map((p,i)=>{const x=pad+(p.km/stage.distance)*(w-pad*2);const y=h-48-((p.alt-minAlt)/Math.max(1,maxAlt-minAlt))*(h-92);return `${i?"L":"M"}${x.toFixed(1)},${y.toFixed(1)}`;}).join(" ");
  const terrain=stage.sectors.map(s=>{const x=pad+(s.from/stage.distance)*(w-pad*2);const sw=Math.max(2,((s.to-s.from)/stage.distance)*(w-pad*2));return `<rect x="${x}" y="${h-30}" width="${sw}" height="13" class="terrain ${s.type}"></rect>`;}).join("");
  const climbBands=stage.climbs.map(c=>{const start=Math.max(0,c.km-c.length);const x1=pad+(start/stage.distance)*(w-pad*2);const x2=pad+(c.km/stage.distance)*(w-pad*2);return `<rect x="${x1.toFixed(1)}" y="42" width="${Math.max(3,x2-x1).toFixed(1)}" height="${h-90}" class="climb-band ${c.category==='HC'||c.category==='1'?'hard':''}"></rect>`;}).join("");
  const climbs=stage.climbs.map(c=>{const start=Math.max(0,c.km-c.length);const x0=pad+(start/stage.distance)*(w-pad*2);const x=pad+(c.km/stage.distance)*(w-pad*2);return `<g><line x1="${x0}" y1="82" x2="${x0}" y2="${h-48}" class="climb-start-line"/><line x1="${x}" y1="70" x2="${x}" y2="${h-48}" class="climb-line"/><circle cx="${x}" cy="64" r="7" class="climb-dot"/><text x="${x0+6}" y="92" class="svg-label small-label">inicio ${esc(c.name)}</text><text x="${x+9}" y="68" class="svg-label">${esc(c.category)} ${esc(c.name)} · ${c.length} km · ${c.gradient}%</text></g>`;}).join("");
  const pav=stage.paves.map(p=>{const x=pad+(p.from/stage.distance)*(w-pad*2);return `<text x="${x}" y="32" class="svg-icon">🪨 ${esc(p.name)}</text>`;}).join("");
  const gmarks=groups.map((g,i)=>{const x=pad+(g.km/stage.distance)*(w-pad*2);const y=96+i*23;return `<g><circle cx="${x}" cy="${y}" r="9" class="group-dot ${g.cls}"/><text x="${x+13}" y="${y+4}" class="svg-label">${esc(g.label)} · ${g.count} · ${g.speed.toFixed(1)} km/h · ${g.wkg.toFixed(1)} W/kg</text></g>`;}).join("");
  return `<div class="stage-profile-card"><div class="stage-title-row"><div><h2>${esc(stage.name)}</h2><p>${esc(stage.label)} · ${stage.distance} km · ${stage.elevation} m+ · perfil ${pts.length} puntos / 1 por km con microgradientes</p></div><div class="badge-row"><span class="badge">${stage.type.toUpperCase()}</span><span class="badge orange">Dif. ${stage.difficulty}</span></div></div><div class="profile-svg"><svg viewBox="0 0 ${w} ${h}">${climbBands}<path d="${path} L${w-pad},${h-48} L${pad},${h-48} Z" class="profile-area"></path><path d="${path}" class="profile-line"></path>${terrain}${climbs}${pav}${gmarks}</svg></div><div class="legend"><span><b class="terrain flat"></b>Llano</span><span><b class="terrain hilly"></b>Media montaña</span><span><b class="terrain climb"></b>Subida</span><span><b class="terrain cobbles"></b>Pavé</span><span><b class="terrain wall"></b>Muro</span><span><b class="terrain final"></b>Final</span><span><b class="terrain tt"></b>Crono</span></div><div class="sector-grid">${stage.sectors.map((s,i)=>`<div class="sector-card"><strong>${i+1}. ${esc(s.name)}</strong><span>km ${s.from}-${s.to}</span><small>${esc(s.question)}</small></div>`).join("")}</div></div>`;
}
function renderTacticalAdvice(stage) { let level="low", icon="📡", title="Carrera controlable", text="Controla sin vaciar gregarios."; if (stage.type==="mountain") {level="high"; icon="⛰️"; title="Montaña realista"; text="La montaña pesa mucho: sprinters penalizados, GC/escaladores dominan.";} if(stage.type==="tt"){level="medium";icon="⏱";title="CRI";text="Salida individual cada 2 minutos, sin rebufo ni grupos.";} if(stage.type==="ttt"){level="medium";icon="🚴‍♂️";title="CRE";text="Equipos salen cada 5 minutos. Tiempo por 4º corredor. Ajusta relevos.";} if(stage.weather.crosswind>50){level="high"; icon="💨"; title="Abanicos posibles"; text="Sube colocación y protege al líder.";} return `<div class="advice ${level}"><span>${icon}</span><div><strong>${title}</strong><p>${text}</p></div></div>`; }
function renderVisualLanesPreview(){ return `<div class="tv-lanes">${["Fuga","Ataque","Grupo favoritos","Pelotón","Grupo 2","Cortados"].map((x,i)=>`<div class="lane"><strong>${x}</strong><span>${i===3?"Tus corredores empezarán normalmente aquí.":"—"}</span></div>`).join("")}</div>`; }

function renderStrategyTab(live=false, embedded=false) { const stage=getStage(); return `${embedded?"":"<section class='panel'>"}${renderProtectedSelector(live)}${isTTT(stage)?renderTTTControls(live):""}${renderSmartPresets(live)}${renderQuickControls(live)}${renderIndividualControls(live)}${embedded?"":"</section>"}`; }
function renderProtectedSelector(live){ return `<h2>Líder protegido</h2><select onchange="Game.protectedRiderId=this.value;${live?"renderLive()":"renderRace()"}">${getTeamRiders(Game.selectedTeamId,true).map(r=>`<option value="${r.id}" ${Game.protectedRiderId===r.id?"selected":""}>${esc(r.name)} · ${esc(r.role)}</option>`).join("")}</select>`; }
function renderTTTControls(live){ const intens=TTT_SETTINGS.relayIntensity, lens=TTT_SETTINGS.relayLength, forms=TTT_SETTINGS.formation; return `<div class="ttt-box"><h2>Controles CRE</h2><label>Intensidad de relevos</label><select onchange="Game.tttRelayIntensity=this.value;${live?"renderLive()":"renderRace()"}">${intens.map(x=>`<option value="${x.id}" ${Game.tttRelayIntensity===x.id?"selected":""}>${x.name} · ${x.desc}</option>`).join("")}</select><label>Duración de relevo</label><select onchange="Game.tttRelayLength=this.value;${live?"renderLive()":"renderRace()"}">${lens.map(x=>`<option value="${x.id}" ${Game.tttRelayLength===x.id?"selected":""}>${x.name}</option>`).join("")}</select><label>Formación</label><select onchange="Game.tttFormation=this.value;${live?"renderLive()":"renderRace()"}">${forms.map(x=>`<option value="${x.id}" ${Game.tttFormation===x.id?"selected":""}>${x.name}</option>`).join("")}</select></div>`; }
function renderSmartPresets(live){ return `<h2>Presets inteligentes</h2><div class="preset-row">${SMART_PRESETS.map(p=>`<button class="secondary" onclick="applySmartPreset('${p.id}',${live})">${esc(p.name)}</button>`).join("")}</div>`; }
function applySmartPreset(id, live){ getTeamRiders(Game.selectedTeamId).forEach(r=>{ if(id==="protect_gc"){Game.riderOrders[r.id]=r.id===Game.protectedRiderId?"hold":["domestique","rouleur","tt"].includes(r.roleKey)?"protect":"sit";Game.riderEfforts[r.id]=r.id===Game.protectedRiderId?68:["domestique","rouleur","tt"].includes(r.roleKey)?74:52;} if(id==="sprint"){Game.riderOrders[r.id]=r.roleKey==="sprinter"?"sit":["rouleur","classics","tt"].includes(r.roleKey)?"sprint_train":"hold";Game.riderEfforts[r.id]=r.roleKey==="sprinter"?55:["rouleur","classics","tt"].includes(r.roleKey)?82:62;} if(id==="breakaway"){const ok=["puncheur","rouleur","climber","classics"].includes(r.roleKey)&&r.id!==Game.protectedRiderId;Game.riderOrders[r.id]=ok?"attack":"sit";Game.riderEfforts[r.id]=ok?86:50;} if(id==="mountain_attack"){Game.riderOrders[r.id]=r.id===Game.protectedRiderId?"attack":["climber","puncheur"].includes(r.roleKey)?"tempo":["domestique","rouleur"].includes(r.roleKey)?"protect":"sit";Game.riderEfforts[r.id]=r.id===Game.protectedRiderId?86:["climber","puncheur"].includes(r.roleKey)?82:58;} if(id==="survival"){Game.riderOrders[r.id]=r.id===Game.protectedRiderId?"protect":"sit";Game.riderEfforts[r.id]=45;} if(id==="time_trial"){Game.riderOrders[r.id]=["tt","rouleur","gc","co"].includes(r.roleKey)?"pull":"hold";Game.riderEfforts[r.id]=["tt","rouleur","gc","co"].includes(r.roleKey)?88:70;} }); if(live&&Game.live)addRadio(`Preset aplicado: ${byId(SMART_PRESETS,id).name}`); live?renderLive():renderRace(); }
function getRoleEffort(group, fallback){const keys=roleKeys(group), riders=getTeamRiders(Game.selectedTeamId).filter(r=>keys.includes(r.roleKey));return riders.length?Math.round(avg(riders.map(r=>Game.riderEfforts[r.id]??fallback))):fallback;}
function previewRoleEffort(group,val,live){const el=document.getElementById(`${live?"live_":""}role_${group}`); if(el) el.textContent=`${val}%`;}
function commitRoleEffort(group,val,live){const keys=roleKeys(group); getTeamRiders(Game.selectedTeamId).forEach(r=>{ if(keys.includes(r.roleKey)) Game.riderEfforts[r.id]=Number(val); }); if(live&&Game.live)addRadio(`${roleLabel(group)} a ${val}%`); live?renderLive():renderRace();}
function roleLabel(group){return {leaders:"Líderes",climbers:"Escaladores",workers:"Gregarios",sprinters:"Sprinters"}[group]||"Corredores";}
function renderQuickControls(live){ const rows=[["leaders","Líderes GC",68],["climbers","Escaladores / puncheurs",66],["workers","Gregarios / rodadores",72],["sprinters","Sprinters / clasicómanos",55]]; return `<h2>Control rápido por rol</h2><div class="quick-grid">${rows.map(([id,label,fb])=>{const v=getRoleEffort(id,fb);return `<div class="role-card"><strong>${esc(label)}</strong><input type="range" min="20" max="100" value="${v}" oninput="previewRoleEffort('${id}',this.value,${live})" onchange="commitRoleEffort('${id}',this.value,${live})"><span id="${live?"live_":""}role_${id}">${v}%</span></div>`;}).join("")}</div><div class="preset-row"><button class="secondary" onclick="setRoleOrder('workers','pull',${live})">Gregarios tiran</button><button class="secondary" onclick="setRoleOrder('workers','catch',${live})">Cazar fuga</button><button class="secondary" onclick="setRoleOrder('climbers','tempo',${live})">Subir tempo</button><button class="secondary" onclick="setRoleOrder('leaders','attack',${live})">Líder ataca</button></div>`; }
function setRoleOrder(group,order,live){const keys=roleKeys(group);getTeamRiders(Game.selectedTeamId).forEach(r=>{if(keys.includes(r.roleKey))Game.riderOrders[r.id]=order;}); if(live&&Game.live)addRadio(`${roleLabel(group)}: ${getOrder(order).name}`); live?renderLive():renderRace();}
function renderIndividualControls(live){return `<h2>Órdenes y esfuerzo por corredor</h2><div class="strategy-list">${getTeamRiders(Game.selectedTeamId).map(r=>renderRiderControl(r,live)).join("")}</div>`;}
function renderRiderControl(r,live){const effort=Game.riderEfforts[r.id]??r.defaultEffort, order=Game.riderOrders[r.id]??r.defaultOrder, st=live&&Game.live?Game.live.states[r.id]:null;return `<div class="rider-control ${Game.protectedRiderId===r.id?"protected":""}"><div class="badge-row"><span class="badge green">${esc(r.role)}</span><span class="badge blue">Forma ${Math.round(r.form)}</span><span class="badge orange">Fatiga ${Math.round(r.fatigue)}</span>${st?`<span class="badge">E ${Math.round(st.energy)}</span><span class="badge">${esc(st.group)}</span>`:""}</div><h3>${esc(r.name)}</h3><label>Orden</label><select onchange="Game.riderOrders['${r.id}']=this.value;${live?"renderLive()":"renderRace()"}">${RIDER_ORDERS.map(o=>`<option value="${o.id}" ${order===o.id?"selected":""}>${esc(o.name)}</option>`).join("")}</select><label>Esfuerzo: <strong id="eff_${r.id}">${effort}%</strong></label><input type="range" min="20" max="100" value="${effort}" oninput="document.getElementById('eff_${r.id}').textContent=this.value+'%'" onchange="Game.riderEfforts['${r.id}']=Number(this.value);${live?"renderLive()":"renderRace()"}"><p class="muted small">${esc(getOrder(order).desc)}</p></div>`;}

function renderNutritionTab(){const plan=byId(NUTRITION_PLANS,Game.nutritionPlanId)||NUTRITION_PLANS[0];return `<section class="panel"><h2>Alimentación</h2><p class="muted">Stock del coche amplio. En automático los corredores consumen geles/bidones por sector según energía, hidratación, clima y final.</p><h3>Modo</h3><div class="race-grid">${AUTO_NUTRITION_MODES.map(m=>`<button class="race-card ${Game.nutritionMode===m.id?"active":""}" onclick="Game.nutritionMode='${m.id}';renderRace()"><span class="race-title">${esc(m.name)}</span><span class="muted small">${esc(m.description)}</span></button>`).join("")}</div><h3>Plan de coche</h3><div class="preset-row">${NUTRITION_PLANS.map(p=>`<button class="secondary" onclick="Game.nutritionPlanId='${p.id}';Game.stock=clone(byId(NUTRITION_PLANS,'${p.id}').stock);renderRace()">${esc(p.name)}</button>`).join("")}</div>${renderStock(Game.stock&&Object.keys(Game.stock).length?Game.stock:plan.stock)}</section>`;}
function renderStock(stock){return `<div class="nutrition-stock">${Object.entries(stock).map(([id,amount])=>{const it=getNutritionItem(id);return `<div class="nutrition-card"><strong>${esc(it?it.name:id)}</strong><span>${amount} uds</span><small>${it?esc(it.description):""}</small></div>`;}).join("")}</div>`;}
function autoEquipmentForStage(teamId, stage){const team=getTeam(teamId); let frameType="aero", wheelType="deep"; if(stage.type==="mountain"){frameType="light";wheelType="light";} if(stage.type==="hilly"){frameType="light";wheelType="mid";} if(stage.type==="cobbles"){frameType="endurance";wheelType="cobbles";} if(stage.type==="tt"||stage.type==="ttt"){frameType="tt";wheelType="disc";} if(stage.weather.crosswind>55||stage.weather.roadWet>60){frameType="endurance";wheelType="mid";} return {frame:team.material.frame,wheels:team.material.wheels,frameType,wheelType};}
function materialScore(r, stage, sector=null){const eq=Game.riderEquipment[r.id]||autoEquipmentForStage(r.teamId,stage),f=getFrame(eq.frame),w=getWheels(eq.wheels); const terrain=(sector?.type==="climb"||stage.type==="mountain")?"mountain":(sector?.type==="cobbles"||stage.type==="cobbles")?"cobbles":(stage.type==="tt"||stage.type==="ttt")?"tt":stage.type==="flat"?"flat":"hilly"; let score=90; if(terrain==="flat")score=f.aero*.36+w.aero*.36+f.stiffness*.14+w.crosswind*.14; if(terrain==="mountain")score=f.weight*.38+w.weight*.28+f.stiffness*.16+f.handling*.18; if(terrain==="cobbles")score=f.comfort*.28+w.cobbles*.30+f.handling*.18+f.reliability*.12+w.reliability*.12; if(terrain==="tt")score=f.tt*.40+w.tt*.36+f.aero*.12+w.aero*.12; if(terrain==="hilly")score=f.weight*.24+f.handling*.22+f.stiffness*.18+w.weight*.18+w.aero*.18; return clamp(Math.round(score),60,104);}
function renderMaterialTab(){const st=getStage();return `<section class="panel"><h2>Material</h2><p class="muted">Elige cuadros y ruedas reales por corredor. La puntuación se calcula por terreno y clima.</p><div class="preset-row">${EQUIPMENT_PRESETS.map(p=>`<button class="secondary" onclick="applyEquipmentPreset('${p.id}')">${esc(p.name)}</button>`).join("")}</div><div class="material-grid">${getTeamRiders(Game.selectedTeamId).map(r=>renderMaterialCard(r,st)).join("")}</div></section>`;}
function applyEquipmentPreset(id){const preset=byId(EQUIPMENT_PRESETS,id)||EQUIPMENT_PRESETS[0],stage=getStage();getTeamRiders(Game.selectedTeamId).forEach(r=>{const base=autoEquipmentForStage(r.teamId,stage);Game.riderEquipment[r.id]={...base,frameType:preset.frameType==="auto"?base.frameType:preset.frameType,wheelType:preset.wheelType==="auto"?base.wheelType:preset.wheelType};});renderRace();}
function renderMaterialCard(r,stage){const eq=Game.riderEquipment[r.id]||autoEquipmentForStage(r.teamId,stage);return `<div class="material-card"><h3>${esc(r.name)}</h3><div class="bike-visual"><div class="bike-frame"></div><div class="wheel w1"></div><div class="wheel w2"></div></div><div class="badge-row"><span class="badge blue">Score ${materialScore(r,stage)}%</span><span class="badge">${esc(getFrame(eq.frame).name)}</span><span class="badge">${esc(getWheels(eq.wheels).name)}</span></div><label>Cuadro</label><select onchange="Game.riderEquipment['${r.id}']={...Game.riderEquipment['${r.id}'],frame:this.value};renderRace()">${FRAME_BRANDS.map(f=>`<option value="${f.id}" ${eq.frame===f.id?"selected":""}>${esc(f.name)} · Aero ${f.aero}% · Peso ${f.weight}%</option>`).join("")}</select><label>Ruedas</label><select onchange="Game.riderEquipment['${r.id}']={...Game.riderEquipment['${r.id}'],wheels:this.value};renderRace()">${WHEEL_BRANDS.map(w=>`<option value="${w.id}" ${eq.wheels===w.id?"selected":""}>${esc(w.name)} · Aero ${w.aero}% · Peso ${w.weight}%</option>`).join("")}</select></div>`;}

function startLiveStage(renderNow=true){const stage=getStage();Game.live={sectorIndex:0,states:{},radio:[],breakaway:{ids:[],gap:0,cohesion:100},startOffsets:{},teamStartOffsets:{}}; const raceRiders=getRaceRiders(); if(isTT(stage)){const ordered=[...raceRiders].sort((a,b)=>b.totalTime-a.totalTime || a.base-b.base);ordered.forEach((r,i)=>{Game.live.startOffsets[r.id]=i*120;});} if(isTTT(stage)){TEAMS.forEach((t,i)=>{Game.live.teamStartOffsets[t.id]=i*300;});}
  raceRiders.forEach(r=>{Game.live.states[r.id]={elapsed:0,raceTime:0,energy:clamp(100-r.fatigue*.4,8,100),hydration:100,stomach:0,finalBonus:0,group:isTT(stage)?"CRI individual":isTTT(stage)?`CRE ${getTeam(r.teamId).name}`:"Pelotón",groupId:isTT(stage)?`tt_${r.id}`:isTTT(stage)?`ttt_${r.teamId}`:"peloton",fatigueGain:0,incident:null,km:0,speed:0,wkg:0};});
  if(!isTT(stage)&&!isTTT(stage)){const breakaway=selectBreakaway(stage);Game.live.breakaway.ids=breakaway.map(r=>r.id);Game.live.breakaway.gap=Math.round(rnd(75,210));Game.live.breakaway.cohesion=82+Math.round(rnd(0,16));breakaway.forEach(r=>{Game.live.states[r.id].group="Fuga";Game.live.states[r.id].groupId="breakaway";});addRadio(`Se forma una fuga de ${breakaway.length} corredores. Ventaja inicial ${seconds(Game.live.breakaway.gap)}.`);} if(isTT(stage))addRadio("CRI: salida individual cada 2 minutos. No hay rebufo ni grupos."); if(isTTT(stage))addRadio("CRE: equipos salen cada 5 minutos. Tiempo por 4º corredor."); if(renderNow)renderLive();}
function selectBreakaway(stage){return getRaceRiders().map(r=>{const o=Game.riderOrders[r.id]||r.defaultOrder;const score=(["puncheur","climber","rouleur","classics"].includes(r.roleKey)?22:0)+(o==="attack"?28:0)+(r.stats.hills+r.stats.mountain+r.stats.stamina)/12+rnd(0,28)-(["gc","co","sprinter"].includes(r.roleKey)?20:0);return {r,score};}).sort((a,b)=>b.score-a.score).slice(0,Math.round(rnd(4,9))).map(x=>x.r);}
function addRadio(msg){if(!Game.live)return;Game.live.radio.unshift({time:new Date().toLocaleTimeString(),msg});Game.live.radio=Game.live.radio.slice(0,18);}
function renderLive(){const stage=getStage(),sector=stage.sectors[Game.live.sectorIndex],groups=buildGroups(); app.innerHTML=`<div class="header"><div><h1>Race Director · ${esc(stage.name)}</h1><p>Sector ${Game.live.sectorIndex+1}/${stage.sectors.length} · km ${sector.from}-${sector.to}</p></div><div class="top-actions"><button class="secondary" onclick="saveGame()">Guardar</button></div></div>${renderActionBar(true)}<section class="panel">${renderWeather(stage)}${renderStageProfile(stage,groups)}${renderTVLanes(groups)}</section><div class="grid live-grid"><section class="panel"><h2>Decisión del sector</h2><div class="sector-focus"><strong>${esc(sector.question)}</strong><p>${esc(sector.name)} · Dificultad ${sector.difficulty}</p></div>${isTTT(stage)?renderTTTControls(true):""}${renderLiveRadar(groups)}${renderQuickControls(true)}</section><section class="panel"><h2>Radio / TV</h2><div class="radio-list">${Game.live.radio.map(r=>`<div class="radio"><span>${esc(r.time)}</span><p>${esc(r.msg)}</p></div>`).join("")}</div><h2>Stock coche</h2>${renderStock(Game.stock)}</section></div><section class="panel"><h2>Tu equipo en carrera</h2>${renderEnergyHeatmap()}<div class="live-rider-grid">${getTeamRiders(Game.selectedTeamId).map(renderLiveRiderCard).join("")}</div></section>`;}
function renderLiveRiderCard(r){const st=Game.live.states[r.id],eff=Game.riderEfforts[r.id]??r.defaultEffort,order=Game.riderOrders[r.id]??r.defaultOrder;return `<div class="live-rider-card ${Game.protectedRiderId===r.id?"protected":""}"><div class="badge-row"><span class="badge green">${esc(r.role)}</span><span class="badge blue">${esc(st.group)}</span><span class="badge">${st.km.toFixed(1)} km</span><span class="badge orange">E ${Math.round(st.energy)}</span><span class="badge">H ${Math.round(st.hydration)}</span><span class="badge">${st.wkg.toFixed(1)} W/kg</span></div><h3>${esc(r.name)}</h3><label>Orden</label><select onchange="Game.riderOrders['${r.id}']=this.value;renderLive()">${RIDER_ORDERS.map(o=>`<option value="${o.id}" ${order===o.id?"selected":""}>${esc(o.name)}</option>`).join("")}</select><label>Esfuerzo <strong id="live_eff_${r.id}">${eff}%</strong></label><input type="range" min="20" max="100" value="${eff}" oninput="document.getElementById('live_eff_${r.id}').textContent=this.value+'%'" onchange="Game.riderEfforts['${r.id}']=Number(this.value);renderLive()"><div class="nutrition-actions">${NUTRITION_ITEMS.map(it=>`<button class="secondary" onclick="useNutrition('${r.id}','${it.id}')">${esc(it.name)}</button>`).join("")}</div></div>`;}
function useNutrition(rid,itemId){if((Game.stock[itemId]||0)<=0)return toast("Sin stock");const it=getNutritionItem(itemId),st=Game.live.states[rid];Game.stock[itemId]-=1;st.energy=clamp(st.energy+it.energy,0,118);st.hydration=clamp(st.hydration+it.hydration,0,125);st.stomach=clamp(st.stomach+it.stomach,0,100);st.finalBonus+=it.finalBonus||0;addRadio(`${getRider(rid).name} toma ${it.name}.`);renderLive();}
function simulateFullStageQuick(){startLiveStage(false);while(Game.live&&Game.live.sectorIndex<getStage().sectors.length)processSector(false);renderStageResult();}
function simulateSector(){processSector(true);}
function processSector(renderNow){const stage=getStage(),sector=stage.sectors[Game.live.sectorIndex];autoFeed(sector); if(isTT(stage))simulateTTSector(stage,sector); else if(isTTT(stage))simulateTTTSector(stage,sector); else simulateRoadSector(stage,sector); Game.live.sectorIndex++; if(Game.live.sectorIndex>=stage.sectors.length){finishStage(renderNow);return;} addRadio(`Entramos en ${stage.sectors[Game.live.sectorIndex].name}.`); if(renderNow)renderLive();}
function autoFeed(sector){if(Game.nutritionMode==="manual")return;getTeamRiders(Game.selectedTeamId).forEach(r=>{const st=Game.live.states[r.id];let itemId=null;const conservative=Game.nutritionMode==="auto_conservative", aggressive=Game.nutritionMode==="auto_aggressive"; if(st.hydration<(conservative?72:60)&&Game.stock.iso>0)itemId="iso"; else if(st.hydration<45&&Game.stock.water>0)itemId="water"; else if(sector.type==="final"&&st.energy<82&&!aggressive&&Game.stock.caf>0)itemId="caf"; else if(["climb","wall","cobbles","final"].includes(sector.type)&&st.energy<(conservative?82:68)&&Game.stock.gel>0)itemId="gel"; else if(["flat","hilly"].includes(sector.type)&&st.energy<(conservative?82:70)&&Game.stock.rice>0)itemId="rice"; else if(conservative&&st.energy<88&&Game.stock.bar>0)itemId="bar"; if(!itemId||st.stomach>88)return; const it=getNutritionItem(itemId);Game.stock[itemId]-=1;st.energy=clamp(st.energy+it.energy,0,118);st.hydration=clamp(st.hydration+it.hydration,0,125);st.stomach=clamp(st.stomach+it.stomach,0,100);st.finalBonus+=it.finalBonus||0;if(r.id===Game.protectedRiderId||st.energy<45||st.hydration<48)addRadio(`${r.name} toma ${it.name} automáticamente.`);});}
function baseSpeed(stage,sector){
  const type = sector && sector.type ? sector.type : stage.type;
  let v=42;
  if(type==="flat")v=44;if(type==="hilly")v=38;if(type==="climb")v=28;if(type==="cobbles")v=35;if(type==="wall")v=30;
  if(type==="final")v=stage.type==="mountain"?28:stage.type==="flat"?46:36;
  if(type==="tt")v=stage.type==="ttt"?52:50;
  const weather = stage.weather || {};
  v-=toNum(weather.roadWet,0)>60?2:0;
  v-=toNum(weather.wind,0)>55?1.2:0;
  return Math.max(18, toNum(v, 38));
}
function baseSectorTime(stage,sector){
  const from = toNum(sector.from, 0);
  const to = toNum(sector.to, from + Math.max(1, toNum(stage.distance, 120)));
  const distance = Math.max(0.5, to - from);
  return distance / baseSpeed(stage,sector) * 3600;
}
function terrainPerformance(r,stage,sector){
  const s=r.stats || {};
  const flat=toNum(s.flat,70), sprint=toNum(s.sprint,70), stamina=toNum(s.stamina,70), pos=toNum(s.positioning,70), form=toNum(r.form,75);
  const mountain=toNum(s.mountain,70), recovery=toNum(s.recovery,70), accel=toNum(s.acceleration,70), hills=toNum(s.hills,70), cobbles=toNum(s.cobbles,70), tt=toNum(s.tt,70);
  const type = sector.type;
  if(type==="flat")return flat*.42+sprint*.12+stamina*.18+pos*.12+form*.16;
  if(type==="climb")return mountain*.62+stamina*.16+recovery*.10+accel*.05+form*.07;
  if(type==="hilly")return hills*.44+mountain*.16+accel*.16+stamina*.12+form*.12;
  if(type==="cobbles")return cobbles*.42+pos*.20+stamina*.14+hills*.12+form*.12;
  if(type==="wall")return hills*.46+accel*.24+mountain*.14+form*.16;
  if(type==="tt")return tt*.58+flat*.15+stamina*.14+form*.13;
  if(type==="final"&&stage.type==="flat")return sprint*.44+flat*.18+accel*.22+pos*.16;
  if(type==="final"&&stage.type==="mountain")return mountain*.66+stamina*.13+accel*.10+form*.11;
  return stamina*.25+flat*.25+hills*.25+form*.25;
}
function difficultySpread(sector){return sector.type==="flat"?1.5:sector.type==="climb"?7.2:sector.type==="cobbles"?5.2:sector.type==="wall"?6.4:sector.type==="final"?6.8:3.5;}
function estimateWkg(r,sector,effort){let base=sector.type==="climb"?4.6:sector.type==="final"?4.9:sector.type==="tt"?4.8:sector.type==="flat"?3.1:sector.type==="cobbles"?4.0:3.7; return clamp(base+(effort-65)*0.035+(r.base-75)*0.018,2.0,7.2);}
function simulateRoadSector(stage,sector){const base=baseSectorTime(stage,sector); const riders=getRaceRiders(); riders.forEach(r=>{const st=Game.live.states[r.id],order=getOrder(Game.riderOrders[r.id]||r.defaultOrder),eff=Game.riderEfforts[r.id]??r.defaultEffort;let perf=terrainPerformance(r,stage,sector)+(eff-60)*.10+materialScore(r,stage,sector)*.055-r.fatigue*.065+st.finalBonus+rnd(-3,3); if(stage.type==="mountain"&&r.roleKey==="sprinter")perf-=18;if(stage.type==="mountain"&&sector.type==="final"&&r.stats.mountain<68)perf-=22;if(stage.weather.temp>30&&st.hydration<55)perf-=8;if(stage.weather.roadWet>60)perf-=Math.max(0,(75-r.stats.positioning))*0.10; let t=base+(84-perf)*difficultySpread(sector); if(order.attack&&eff>76&&Math.random()<attackChance(r,sector,eff)){t-=rnd(20,75);st.groupId=`attack_${r.id}`;addRadio(`${r.name} ataca.`);} const risk=incidentRisk(r,stage,sector,eff)*toNum(order.risk,1); if(Math.random()<risk){const loss=rnd(30,sector.type==="cobbles"?190:120);t+=loss;st.incident="Incidente";st.groupId="dropped";addRadio(`${r.name} sufre incidente y pierde ${seconds(loss)}.`);} if(st.energy<25&&Math.random()<(st.energy<15?.36:.18)){const loss=rnd(80,320);t+=loss;st.groupId="dropped";addRadio(`${r.name} entra en crisis y pierde ${seconds(loss)}.`);} st.elapsed+=t;st.raceTime+=t;st.km=sector.to;st.speed=(sector.to-sector.from)/(t/3600);st.wkg=estimateWkg(r,sector,eff);st.energy=clamp(st.energy-energyCost(sector,order,eff,r),0,118);st.hydration=clamp(st.hydration-hydrationCost(stage,sector,eff),0,125);st.stomach=clamp(st.stomach-4,0,100);st.finalBonus=Math.max(0,st.finalBonus-.8);st.fatigueGain+=fatigueGain(sector,eff,r);});updateBreakaway(stage,sector);applyGroupCohesion(stage,sector);}
function simulateTTSector(stage,sector){const base=baseSectorTime(stage,sector); getRaceRiders().forEach(r=>{const st=Game.live.states[r.id],eff=Game.riderEfforts[r.id]??r.defaultEffort;let perf=terrainPerformance(r,stage,sector)+(eff-65)*.12+materialScore(r,stage,sector)*.075-r.fatigue*.07+rnd(-2,2);let t=base+(88-perf)*4.0; st.elapsed+=t;st.raceTime+=t;st.km=sector.to;st.speed=(sector.to-sector.from)/(t/3600);st.wkg=estimateWkg(r,sector,eff);st.group="CRI individual";st.groupId=`tt_${r.id}`;st.energy=clamp(st.energy-energyCost(sector,getOrder("pull"),eff,r)*.95,0,118);st.hydration=clamp(st.hydration-hydrationCost(stage,sector,eff),0,125);st.fatigueGain+=fatigueGain(sector,eff,r);});}
function simulateTTTSector(stage,sector){const base=baseSectorTime(stage,sector);const inten=byId(TTT_SETTINGS.relayIntensity,Game.tttRelayIntensity)||TTT_SETTINGS.relayIntensity[1],len=byId(TTT_SETTINGS.relayLength,Game.tttRelayLength)||TTT_SETTINGS.relayLength[1],form=byId(TTT_SETTINGS.formation,Game.tttFormation)||TTT_SETTINGS.formation[1]; TEAMS.forEach(team=>{const arr=getTeamRiders(team.id).map(r=>{const st=Game.live.states[r.id],eff=Game.riderEfforts[r.id]??r.defaultEffort;let perf=r.stats.ttt*.50+r.stats.tt*.20+r.stats.flat*.13+r.stats.stamina*.12+r.form*.05+materialScore(r,stage,sector)*.08+(eff-65)*.08-r.fatigue*.05;perf*=inten.power*len.efficiency*form.aero;let t=base+(88-perf)*3.4;st.energy=clamp(st.energy-energyCost(sector,getOrder("pull"),eff,r)*inten.power,0,118);st.hydration=clamp(st.hydration-hydrationCost(stage,sector,eff),0,125);st.fatigueGain+=fatigueGain(sector,eff,r)*inten.power;st.km=sector.to;st.speed=(sector.to-sector.from)/(t/3600);st.wkg=estimateWkg(r,sector,eff)*inten.power;return{r,t};}).sort((a,b)=>a.t-b.t);const marker=arr[Math.min(3,arr.length-1)].t;arr.forEach((x,i)=>{const st=Game.live.states[x.r.id];const weak=(x.t-marker)>18 || st.energy<18;const dropProb=weak?0.25*inten.dropRisk*len.dropRisk/form.handling:0;if(i<=3||(!weak&&Math.random()>dropProb)){st.elapsed+=marker+rnd(0,2);st.raceTime+=marker+rnd(0,2);st.group=`CRE ${team.name}`;st.groupId=`ttt_${team.id}`;}else{const loss=rnd(25,100);st.elapsed+=marker+loss;st.raceTime+=marker+loss;st.group="Descolgado CRE";st.groupId=`ttt_drop_${team.id}`;if(team.id===Game.selectedTeamId)addRadio(`${x.r.name} se descuelga de la CRE.`);}});});}
function updateBreakaway(stage,sector){const br=Game.live.breakaway;if(!br.ids.length||br.gap<=0)return;const breakRiders=br.ids.map(getRider).filter(Boolean);const breakPower=avg(breakRiders.map(r=>terrainPerformance(r,stage,sector)))+br.cohesion*.08;const chasePower=getTeamRiders(Game.selectedTeamId).reduce((sum,r)=>{const o=getOrder(Game.riderOrders[r.id]||r.defaultOrder),e=Game.riderEfforts[r.id]??r.defaultEffort;return sum+(o.id==="catch"?e*.18:o.id==="pull"?e*.10:0);},0)+avg(TEAMS.map(t=>t.ai.control))*0.04;let natural=sector.type==="climb"?-8:sector.type==="final"?-18:4;let delta=natural+(breakPower-chasePower)*0.8+rnd(-18,18);let maxLoss=Math.max(25,br.gap*0.38);if(delta<0)delta=Math.max(delta,-maxLoss);br.gap=Math.max(0,br.gap+delta);br.cohesion=clamp(br.cohesion-(sector.difficulty/100)*5+rnd(-2,2),35,100);br.ids.forEach(id=>{const st=Game.live.states[id];if(st&&br.gap>15){st.group="Fuga";st.groupId="breakaway";st.elapsed-=Math.max(0,br.gap/(Game.live.sectorIndex+2))*0.12;}});if(br.gap>0)addRadio(`Fuga: ventaja ${seconds(br.gap)}. Cohesión ${Math.round(br.cohesion)}%.`);}
function applyGroupCohesion(stage,sector){const grouped={};getRaceRiders().forEach(r=>{const st=Game.live.states[r.id],id=st.groupId||"peloton";if(id.startsWith("attack")||id.startsWith("tt_")||id.startsWith("ttt_")||id==="dropped")return;if(!grouped[id])grouped[id]=[];grouped[id].push(r);});Object.entries(grouped).forEach(([id,arr])=>{let groupTime=avg(arr.map(r=>Game.live.states[r.id].elapsed));let pull=0;arr.forEach(r=>{const o=getOrder(Game.riderOrders[r.id]||r.defaultOrder),e=Game.riderEfforts[r.id]??r.defaultEffort;pull+=o.pull*Math.max(0,e-50)*.07;});groupTime-=clamp(pull,0,50);arr.forEach(r=>{const st=Game.live.states[r.id],e=Game.riderEfforts[r.id]??r.defaultEffort;const weak=sector.type==="climb"&&r.stats.mountain<65&&st.energy<55&&e<58;if(weak&&Math.random()<.30){st.elapsed=groupTime+rnd(45,180);st.groupId="dropped";addRadio(`${r.name} se corta.`);}else{st.elapsed=groupTime+rnd(0,2.5);}});});}
function attackChance(r,sector,eff){const fit=sector.type==="climb"?r.stats.mountain:sector.type==="cobbles"?r.stats.cobbles:r.stats.hills;return clamp((fit-72)/95+(eff-75)/125,.03,.55);}
function incidentRisk(r,stage,sector,eff){return clamp((sector.type==="cobbles"?.045:.006)+stage.weather.roadWet/1800+stage.weather.crosswind/2500+Math.max(0,eff-88)/900-(r.stats.positioning+r.stats.downhill)/10000,.001,.16);}
function energyCost(sector,order,eff,r){const base=sector.type==="flat"?11:sector.type==="climb"?28:sector.type==="cobbles"?25:sector.type==="tt"?27:sector.type==="final"?32:20;return clamp(base*toNum(order.energy,1)*(.55+eff/100)-toNum(r.stats.stamina,75)*.04,3,62);}
function hydrationCost(stage,sector,eff){return clamp(7+Math.max(0,stage.weather.temp-18)*.22+sector.difficulty*.026+Math.max(0,eff-75)*.045,4,28);}
function fatigueGain(sector,eff,r){return clamp(sector.difficulty*.045+Math.max(0,eff-70)*.06-r.stats.recovery*.025,.4,12);}
function stageWinnerSpeed(stage){
  let speed = stage.type === "flat" ? 45.5 : stage.type === "hilly" ? 39.0 : stage.type === "mountain" ? 31.2 : stage.type === "cobbles" ? 37.0 : stage.type === "tt" ? 51.0 : stage.type === "ttt" ? 53.0 : 38.0;
  if (stage.weather) {
    if (stage.weather.roadWet > 55) speed -= 1.0;
    if (stage.weather.crosswind > 55 && stage.type === "flat") speed -= 1.2;
    if (stage.weather.temp > 32) speed -= 0.8;
  }
  return Math.max(24, speed);
}
function stageScore(r, stage, mode = stage.type){
  const s = r.stats || {};
  const form = toNum(r.form, 75), fatigue = toNum(r.fatigue, 0), base = toNum(r.base, 75);
  let score;
  if (mode === "flat") score = s.sprint*.38 + s.flat*.26 + s.positioning*.16 + s.acceleration*.10 + s.stamina*.06 + form*.04;
  else if (mode === "mountain") score = s.mountain*.56 + s.stamina*.18 + s.recovery*.10 + form*.08 + base*.08;
  else if (mode === "hilly") score = s.hills*.38 + s.mountain*.20 + s.acceleration*.16 + s.stamina*.12 + form*.08 + base*.06;
  else if (mode === "cobbles") score = s.cobbles*.40 + s.positioning*.20 + s.hills*.14 + s.stamina*.12 + form*.08 + base*.06;
  else if (mode === "tt") score = s.tt*.54 + s.flat*.18 + s.stamina*.13 + form*.08 + base*.07;
  else if (mode === "ttt") score = s.ttt*.48 + s.tt*.18 + s.flat*.16 + s.stamina*.10 + s.positioning*.04 + form*.04;
  else score = s.hills*.25 + s.flat*.22 + s.stamina*.20 + s.mountain*.18 + form*.10 + base*.05;
  if (stage.type === "mountain" && r.roleKey === "sprinter") score -= 30;
  if (stage.type === "mountain" && r.roleKey === "classics") score -= 14;
  if (stage.type === "mountain" && r.roleKey === "puncheur" && toNum(s.mountain,65) < 80) score -= 8;
  if (stage.type === "mountain" && ["gc","co","climber"].includes(r.roleKey)) score += 5;
  if (stage.type === "mountain" && toNum(s.mountain, 65) < 68) score -= 18;
  if (stage.type === "cobbles" && toNum(s.cobbles, 65) < 68) score -= 10;
  if (stage.weather && stage.weather.temp > 31 && toNum(s.stamina, 75) < 76) score -= 4;
  return score - fatigue*.16;
}
function expectedStageBaseTime(stage){
  return toNum(stage.distance, 150) / stageWinnerSpeed(stage) * 3600;
}
function normalizeStageResults(stage, results){
  if (!results || !results.length) return results || [];
  if (isTT(stage)) return normalizeTTResults(stage, results);
  if (isTTT(stage)) return normalizeTTTResults(stage, results);
  return normalizeRoadResults(stage, results);
}
function normalizeTTResults(stage, results){
  const baseTime = expectedStageBaseTime(stage);
  const ranked = results.map(res => {
    const r = getRider(res.riderId);
    return {...res, __score: stageScore(r, stage, "tt") + rnd(-1.8, 1.8)};
  }).sort((a,b)=>b.__score-a.__score);
  const best = ranked[0].__score;
  ranked.forEach((res,i)=>{
    const diff = Math.max(0, best - res.__score);
    res.time = Math.max(600, baseTime + diff*7.5 + i*1.15 + rnd(-6, 12));
    res.elapsed = res.time + toNum(res.startOffset, 0);
    res.group = "CRI individual";
  });
  return ranked.map(({__score, ...x})=>x);
}
function normalizeTTTResults(stage, results){
  const baseTime = expectedStageBaseTime(stage);
  const byTeam = {};
  results.forEach(res => { (byTeam[res.teamId] ||= []).push(res); });
  const teamScores = Object.entries(byTeam).map(([teamId, arr]) => {
    const scores = arr.map(res => stageScore(getRider(res.riderId), stage, "ttt")).sort((a,b)=>b-a);
    const score = avg(scores.slice(0, Math.min(6, scores.length))) + rnd(-1.2, 1.2);
    return {teamId, arr, score};
  }).sort((a,b)=>b.score-a.score);
  const best = teamScores[0] ? teamScores[0].score : 85;
  teamScores.forEach((teamObj, teamPos) => {
    const marker = baseTime + Math.max(0, best - teamObj.score)*8.5 + teamPos*3.0 + rnd(-5, 10);
    const sorted = teamObj.arr.map(res => ({res, score: stageScore(getRider(res.riderId), stage, "ttt") + rnd(-1,1)})).sort((a,b)=>b.score-a.score);
    sorted.forEach((x,i)=>{
      if (i <= 3) {
        x.res.time = marker;
        x.res.group = `CRE ${getTeam(x.res.teamId).name}`;
      } else {
        const weakGap = Math.max(0, sorted[3].score - x.score) * 5.5;
        x.res.time = marker + (weakGap > 18 ? weakGap + rnd(8,80) : rnd(0,8));
        x.res.group = x.res.time - marker > 10 ? "Descolgado CRE" : `CRE ${getTeam(x.res.teamId).name}`;
      }
      x.res.elapsed = x.res.time + toNum(x.res.startOffset, 0);
    });
  });
  return results;
}
function normalizeRoadResults(stage, results){
  const baseTime = expectedStageBaseTime(stage);
  const maxGap = stage.type === "flat" ? 720 : stage.type === "hilly" ? 1500 : stage.type === "mountain" ? 2100 : stage.type === "cobbles" ? 2100 : 1500;
  const breakGap = Game.live && Game.live.breakaway ? toNum(Game.live.breakaway.gap, 0) : 0;
  const survivalThreshold = stage.type === "flat" ? 260 : stage.type === "hilly" ? 190 : stage.type === "cobbles" ? 170 : stage.type === "mountain" ? 300 : 220;
  const breakSurvives = breakGap > survivalThreshold;
  const ranked = results.map(res => {
    const r = getRider(res.riderId);
    const isBreak = res.group === "Fuga" || (Game.live && Game.live.breakaway && Game.live.breakaway.ids.includes(res.riderId));
    let score = stageScore(r, stage, stage.type) + rnd(-2.2, 2.2);
    if (isBreak && breakSurvives) score += stage.type === "mountain" ? 4.0 : 7.0;
    if (res.incident) score -= 18;
    return {...res, __score: score, __break: isBreak};
  }).sort((a,b)=>b.__score-a.__score);
  const best = ranked[0].__score;
  let pelotonBaseGap = breakSurvives ? clamp(breakGap, 35, stage.type === "mountain" ? 420 : 720) : 0;
  ranked.forEach((res,i)=>{
    const r = getRider(res.riderId);
    const diff = Math.max(0, best - res.__score);
    let gapSec;
    if (stage.type === "flat") {
      gapSec = i < 85 && !res.incident ? 0 : Math.max(0, (i - 84) * 2.3 + diff * 2.5 + rnd(0,45));
    } else if (stage.type === "hilly") {
      gapSec = Math.max(0, diff * 6.2 + i * 0.9 + rnd(-10,35));
    } else if (stage.type === "mountain") {
      gapSec = Math.max(0, diff * 12.5 + i * 1.8 + rnd(-12,45));
      if (r.roleKey === "sprinter" || toNum(r.stats.mountain, 65) < 65) gapSec += rnd(420, 1350);
      if (["gc","co","climber"].includes(r.roleKey) && toNum(r.stats.mountain, 70) > 82) gapSec *= 0.72;
    } else if (stage.type === "cobbles") {
      gapSec = Math.max(0, diff * 7.2 + i * 1.1 + rnd(-8,60));
      if (toNum(r.stats.cobbles,65) < 65) gapSec += rnd(120,520);
    } else {
      gapSec = Math.max(0, diff * 6 + i + rnd(0,30));
    }
    if (breakSurvives && !res.__break) gapSec += pelotonBaseGap;
    if (res.incident) gapSec += rnd(60,420);
    gapSec = clamp(gapSec, 0, maxGap);
    res.time = baseTime + gapSec;
    res.elapsed = res.time;
    if (!breakSurvives && res.__break) res.group = "Pelotón";
    if (breakSurvives && res.__break && gapSec < 90) res.group = "Fuga";
  });
  const sorted = ranked.sort((a,b)=>a.time-b.time);
  return applyRoadGroups(stage, sorted.map(({__score,__break,...x})=>x));
}

function finishStage(renderNow){
  const stage=getStage();
  let results=getRaceRiders().map(r=>{
    const st=Game.live && Game.live.states ? Game.live.states[r.id] : null;
    let raceTime = st ? toNum(st.raceTime, NaN) : NaN;
    if (!Number.isFinite(raceTime) || raceTime <= 0) {
      raceTime = safeRaceTime(r, stage, isTT(stage) ? 0.92 : isTTT(stage) ? 0.88 : 1);
    }
    return{
      riderId:r.id,
      riderName:r.name,
      teamId:r.teamId,
      teamName:getTeam(r.teamId).name,
      time:raceTime,
      elapsed:st ? toNum(st.elapsed, raceTime) : raceTime,
      group:st && st.group ? st.group : (isTT(stage)?"CRI individual":isTTT(stage)?`CRE ${getTeam(r.teamId).name}`:"Grupo 1"),
      incident:st ? st.incident : null,
      fatigueGain:st ? toNum(st.fatigueGain, stage.difficulty/12) : stage.difficulty/12,
      startOffset:isTT(stage)?toNum(Game.live.startOffsets[r.id],0):isTTT(stage)?toNum(Game.live.teamStartOffsets[r.teamId],0):0
    };
  });
  if(isTTT(stage)){
    TEAMS.forEach(team=>{
      const arr=results.filter(x=>x.teamId===team.id).sort((a,b)=>a.time-b.time);
      if(!arr.length)return;
      const marker=toNum(arr[Math.min(3,arr.length-1)].time, avg(arr.map(x=>x.time)));
      arr.forEach((x,i)=>{if(i<=3||x.time-marker<10){x.time=marker;x.group=`CRE ${team.name}`;}else{x.time=Math.max(x.time,marker+10);x.group="Descolgado CRE";}});
    });
  } else if(!isTT(stage)){
    results=applyRoadGroups(stage,results);
  }
  results = normalizeStageResults(stage, results);
  results = results.filter(r=>Number.isFinite(r.time)).sort((a,b)=>a.time-b.time);
  results.forEach((x,i)=>x.pos=i+1);
  applyPoints(stage,results);
  updateTotals(results);
  updateTeamTimes(results);
  Game.lastStage={stage,results};
  Game.stageHistory.push(Game.lastStage);
  Game.live=null;
  saveGame(false);
  if(renderNow)renderStageResult();
}
function applyRoadGroups(stage,results){let groupTime=results[0].time,groupNo=1;return results.map((r,i)=>{const threshold=stage.type==="flat"?18:stage.type==="hilly"?10:stage.type==="mountain"?6:8;if(i>0&&r.time-groupTime>threshold){groupTime=r.time;groupNo++;}if(!r.incident&&!r.group.includes("Ataque")&&!r.group.includes("Fuga")){r.time=groupTime;r.group=groupNo===1?"Grupo 1":`Grupo ${groupNo}`;}return r;});}
function applyPoints(stage,results){const pts=CLASSIFICATION_RULES.pointsByStageType[stage.type]||CLASSIFICATION_RULES.pointsByStageType.hilly,uci=getRace().type==="classic"?CLASSIFICATION_RULES.uci.oneDay:CLASSIFICATION_RULES.uci.grandTourStage;results.forEach((res,i)=>{const r=getRider(res.riderId);r.points+=pts[i]||0;r.uciPoints+=uci[i]||0;if(i===0){r.stageWins++;r.seasonStageWins++;}});stage.climbs.forEach(c=>{const scale=CLASSIFICATION_RULES.mountainPoints[c.category]||[1];const sorted=[...results].sort((a,b)=>getRider(b.riderId).stats.mountain-getRider(a.riderId).stats.mountain+rnd(-3,3));scale.forEach((p,i)=>{const r=getRider(sorted[i]?.riderId);if(r)r.mountainPoints+=p;});});}
function updateTotals(results){results.forEach(res=>{const r=getRider(res.riderId);r.totalTime+=res.time;r.fatigue=clamp(r.fatigue+res.fatigueGain-r.stats.recovery*.06,0,100);r.form=clamp(r.form+(res.pos<=10?.4:-.1)-r.fatigue*.004,45,100);r.morale=clamp(r.morale+(res.pos===1?6:res.pos<=5?2:res.pos>120?-2:0),25,100);r.raceDays++;});}
function updateTeamTimes(results){TEAMS.forEach(team=>{const top=results.filter(r=>r.teamId===team.id).sort((a,b)=>a.time-b.time).slice(0,3);Game.teamTimes[team.id]+=top.reduce((s,x)=>s+x.time,0);});}
function renderStageResult(){const {stage,results}=Game.lastStage,lead=results[0].time;app.innerHTML=`<div class="header"><div><h1>Resultado · ${esc(stage.name)}</h1><p>${esc(stage.label)} · ${stage.distance} km</p></div><div class="top-actions"><button class="secondary" onclick="saveGame()">Guardar</button><button onclick="nextStage()">${Game.currentStageIndex>=getRace().stages.length-1?"Final de carrera":"Siguiente etapa"}</button></div></div>${renderLeaderStrip()}<section class="panel"><h2>Clasificación de etapa</h2><div class="classification-scroll"><table><thead><tr><th>Pos</th><th>Corredor</th><th>Equipo</th><th>Tiempo</th><th>Dif.</th><th>Grupo</th><th>Salida</th></tr></thead><tbody>${results.map(r=>`<tr class="${r.teamId===Game.selectedTeamId?"user-team":""}"><td>${r.pos}</td><td>${esc(r.riderName)}</td><td>${esc(r.teamName)}</td><td>${seconds(r.time)}</td><td>${gap(r.time,lead)}</td><td>${esc(r.group)}</td><td>${seconds(r.startOffset||0)}</td></tr>`).join("")}</tbody></table></div></section><section class="panel"><h2>General</h2>${renderGeneralTable()}</section>`;}
function nextStage(){if(Game.currentStageIndex>=getRace().stages.length-1){finishRace();return;}Game.currentStageIndex++;getTeamRiders(Game.selectedTeamId).forEach(r=>{Game.riderOrders[r.id]=r.defaultOrder;Game.riderEfforts[r.id]=r.defaultEffort;Game.riderEquipment[r.id]=autoEquipmentForStage(r.teamId,getStage());});resetStockForStage();Game.activeTab="director";saveGame(false);renderRace();}
function finishRace(){const race=getRace(),gc=getGC();const scale=race.type==="grand_tour"?CLASSIFICATION_RULES.uci.grandTourFinalGC:race.type==="stage_race"?CLASSIFICATION_RULES.uci.stageRaceGC:CLASSIFICATION_RULES.uci.oneDay;gc.forEach((r,i)=>r.uciPoints+=scale[i]||0);Game.raceHistory.push({raceId:race.id,raceName:race.name,winnerId:gc[0]?.id,winnerName:gc[0]?.name,userBestId:getTeamRiders(Game.selectedTeamId,true).sort((a,b)=>a.totalTime-b.totalTime)[0]?.id,stageWins:getTeamRiders(Game.selectedTeamId,true).reduce((s,r)=>s+r.stageWins,0)});Game.finished=true;saveGame(false);renderRaceFinal();}
function renderRaceFinal(){const gc=getGC(),race=getRace();app.innerHTML=`<div class="header"><div><h1>Final · ${esc(race.name)}</h1><p>Clasificación final</p></div><div class="top-actions">${Game.mode==="season"?`<button onclick="goToBetweenRaces()">Continuar temporada</button>`:`<button onclick="init()">Nueva partida</button>`}</div></div>${renderLeaderStrip()}<section class="panel"><h2>Podio</h2><div class="podium">${gc.slice(0,3).map((r,i)=>`<div class="podium-card ${i===0?race.jerseyClass:""}"><span>#${i+1}</span><h3>${esc(r.name)}</h3><p>${esc(getTeam(r.teamId).name)} · ${seconds(r.totalTime)}</p></div>`).join("")}</div></section><section class="panel"><h2>General final</h2>${renderGeneralTable()}</section>`;}
function goToBetweenRaces(){if(Game.mode!=="season")return init();if(Game.seasonIndex>=SEASON_RACE_IDS.length-1){Game.seasonFinished=true;saveGame(false);return renderSeasonFinal();}Game.betweenRaces=true;saveGame(false);renderBetweenRaces();}
function renderBetweenRaces(){const curr=getRace(),next=byId(RACES,SEASON_RACE_IDS[Game.seasonIndex+1]),selected=Game.lastRaceRosterIds||[],non=getFullTeamRiders(Game.selectedTeamId).filter(r=>!selected.includes(r.id));app.innerHTML=`<div class="header"><div><h1>Entre carreras</h1><p>Terminado: ${esc(curr.name)} · Próxima: ${esc(next.name)}</p></div><div class="top-actions"><button class="secondary" onclick="saveGame()">Guardar</button><button onclick="advanceToNextRace()">Aplicar entrenamiento y seguir</button></div></div><section class="panel"><h2>Training camps y entrenamientos</h2><div class="training-grid">${TRAINING_OPTIONS.map(t=>`<button class="training-card ${Game.trainingPlanId===t.id?"active":""}" onclick="Game.trainingPlanId='${t.id}';renderBetweenRaces()"><strong>${esc(t.name)}</strong><span>${esc(t.destination)} · ${t.days} días</span><small>${esc(t.description)}</small><em>${formatEffects(t.effects)}</em></button>`).join("")}</div></section><section class="panel"><h2>No convocados que entrenarán</h2><div class="roster-grid">${non.map(r=>`<div class="status-card"><div class="badge-row"><span class="badge green">${esc(r.role)}</span><span class="badge blue">Forma ${Math.round(r.form)}</span><span class="badge orange">Fatiga ${Math.round(r.fatigue)}</span></div><h3>${esc(r.name)}</h3>${miniStats(r)}</div>`).join("")}</div></section>`;}
function formatEffects(e){return Object.entries(e).map(([k,v])=>`${k} ${v>0?"+":""}${v}`).join(" · ");}
function advanceToNextRace(){applyTraining();Game.seasonIndex++;Game.selectedRaceId=GameRaceIdBySeasonIndex();Game.betweenRaces=false;Game.finished=false;Game.rosterLocked=false;prepareRosterSelection();}
function applyTraining(){const option=byId(TRAINING_OPTIONS,Game.trainingPlanId)||TRAINING_OPTIONS[0],selected=Game.lastRaceRosterIds||[];getFullTeamRiders(Game.selectedTeamId).forEach(r=>{if(selected.includes(r.id)){r.fatigue=clamp(r.fatigue-10,0,100);r.form=clamp(r.form-.4,45,100);return;}Object.entries(option.effects).forEach(([key,val])=>{if(key==="fatigue")r.fatigue=clamp(r.fatigue+val,0,100);else if(key==="form")r.form=clamp(r.form+val,45,100);else if(key==="morale")r.morale=clamp(r.morale+val,25,100);else if(key==="youngBonus"&&r.age<=23){r.base=clamp(r.base+val,60,99);}else if(r.stats[key]!==undefined){r.stats[key]=clamp(r.stats[key]+val,42,99);if(key==="tt")r.stats.timeTrial=r.stats.tt;if(key==="ttt")r.stats.teamTimeTrial=r.stats.ttt;}});});}
function renderSeasonFinal(){const uci=[...Game.riders].sort((a,b)=>b.uciPoints-a.uciPoints);app.innerHTML=`<div class="header"><div><h1>Final de temporada</h1><p>${esc(getTeam(Game.selectedTeamId).name)}</p></div><div class="top-actions"><button onclick="init()">Nueva temporada</button></div></div><section class="panel"><h2>Carreras</h2><div class="classification-scroll"><table><thead><tr><th>Carrera</th><th>Ganador</th><th>Mejor tu equipo</th><th>Victorias etapa</th></tr></thead><tbody>${Game.raceHistory.map(h=>`<tr><td>${esc(h.raceName)}</td><td>${esc(h.winnerName)}</td><td>${esc(getRider(h.userBestId)?.name||"—")}</td><td>${h.stageWins}</td></tr>`).join("")}</tbody></table></div></section><section class="panel"><h2>Ranking UCI</h2><div class="classification-scroll"><table><thead><tr><th>Pos</th><th>Corredor</th><th>Equipo</th><th>UCI</th><th>Victorias</th></tr></thead><tbody>${uci.map((r,i)=>`<tr class="${r.teamId===Game.selectedTeamId?"user-team":""}"><td>${i+1}</td><td>${esc(r.name)}</td><td>${esc(getTeam(r.teamId).name)}</td><td>${r.uciPoints}</td><td>${r.seasonStageWins}</td></tr>`).join("")}</tbody></table></div></section>`;}
function getGC(){return getRaceRiders().slice().sort((a,b)=>a.totalTime-b.totalTime||b.base-a.base);}
function getPoints(){return getRaceRiders().slice().sort((a,b)=>b.points-a.points||a.totalTime-b.totalTime);}
function getMountain(){return getRaceRiders().slice().sort((a,b)=>b.mountainPoints-a.mountainPoints||a.totalTime-b.totalTime);}
function getYouth(){return getRaceRiders().filter(r=>r.age<=CLASSIFICATION_RULES.youthMaxAge).sort((a,b)=>a.totalTime-b.totalTime);}
function getTeamsClass(){return TEAMS.map(team=>({team,time:Game.teamTimes[team.id]||0})).sort((a,b)=>a.time-b.time);}
function renderClassTab(){return `<div class="grid two"><section class="panel"><h2>General completa</h2>${renderGeneralTable()}</section><section class="panel"><h2>Secundarias</h2>${renderSmallClassification("Puntos",getPoints(),"points","pts")}${renderSmallClassification("Montaña",getMountain(),"mountainPoints","pts")}${renderSmallClassification("Jóvenes",getYouth(),"totalTime","time")}${renderTeamClassification()}</section></div>`;}
function renderGeneralTable(){const gc=getGC(),lead=gc[0]?.totalTime||0,race=getRace();if(!Game.stageHistory.length)return `<p class="muted">Todavía no se ha disputado ninguna etapa.</p>`;return `<div class="classification-scroll"><table><thead><tr><th>Pos</th><th>Corredor</th><th>Equipo</th><th>Tiempo</th><th>Dif.</th><th>Rol</th><th>Fatiga</th><th>Pts</th><th>Mont.</th><th>UCI</th></tr></thead><tbody>${gc.map((r,i)=>`<tr class="${r.teamId===Game.selectedTeamId?"user-team":""} ${i===0?`race-leader ${race.jerseyClass}`:""}"><td>${i+1}</td><td>${esc(r.name)}</td><td>${esc(getTeam(r.teamId).name)}</td><td>${seconds(r.totalTime)}</td><td>${gap(r.totalTime,lead)}</td><td>${esc(r.role)}</td><td>${Math.round(r.fatigue)}</td><td>${r.points}</td><td>${r.mountainPoints}</td><td>${r.uciPoints}</td></tr>`).join("")}</tbody></table></div>`;}
function renderSmallClassification(title,riders,key,mode){return `<div class="mini-class"><h3>${esc(title)}</h3><div class="mini-scroll"><table><tbody>${riders.map((r,i)=>`<tr class="${r.teamId===Game.selectedTeamId?"user-team":""}"><td>${i+1}</td><td>${esc(r.name)}</td><td>${mode==="time"?seconds(r[key]):r[key]}</td></tr>`).join("")}</tbody></table></div></div>`;}
function renderTeamClassification(){const teams=getTeamsClass(),lead=teams[0]?.time||0;return `<div class="mini-class"><h3>Equipos</h3><div class="mini-scroll"><table><tbody>${teams.map((x,i)=>`<tr class="${x.team.id===Game.selectedTeamId?"user-team":""}"><td>${i+1}</td><td>${esc(x.team.name)}</td><td>${gap(x.time,lead)}</td></tr>`).join("")}</tbody></table></div></div>`;}
function renderTeamTab(){return `<section class="panel"><h2>Equipo inscrito</h2><p class="muted">Convocatoria bloqueada durante esta carrera.</p><div class="roster-grid">${getTeamRiders(Game.selectedTeamId,true).map(r=>`<div class="status-card"><div class="badge-row"><span class="badge green">${esc(r.role)}</span><span class="badge blue">Base ${r.base}</span><span class="badge orange">Fatiga ${Math.round(r.fatigue)}</span></div><h3>${esc(r.name)}</h3><p class="muted small">${esc(r.nationality)} · ${r.age} años · ${r.weightKg} kg</p>${miniStats(r)}</div>`).join("")}</div></section>`;}
function renderHistoryTab(){return `<section class="panel"><h2>Historial etapas</h2><div class="classification-scroll"><table><thead><tr><th>Etapa</th><th>Tipo</th><th>Ganador</th><th>Equipo</th></tr></thead><tbody>${Game.stageHistory.map(x=>`<tr class="${x.results[0].teamId===Game.selectedTeamId?"user-team":""}"><td>${esc(x.stage.name)}</td><td>${esc(x.stage.label)}</td><td>${esc(x.results[0].riderName)}</td><td>${esc(x.results[0].teamName)}</td></tr>`).join("")||`<tr><td colspan="4">Sin etapas</td></tr>`}</tbody></table></div></section>`;}
function buildGroups(){const stage=getStage();if(isTT(stage))return buildTTGroups();if(isTTT(stage))return buildTTTGroups();const riders=getRaceRiders().filter(r=>Game.live.states[r.id]);const best=Math.min(...riders.map(r=>Game.live.states[r.id].elapsed));const map={};riders.forEach(r=>{const st=Game.live.states[r.id],g=st.elapsed-best;if(st.groupId==="breakaway"&&Game.live.breakaway.gap>15)st.group="Fuga";else if(st.groupId&&st.groupId.startsWith("attack"))st.group="Ataque";else if(g<=25)st.group="Grupo favoritos";else if(g<=85)st.group="Pelotón";else if(g<=220)st.group="Grupo 2";else st.group="Cortados";if(!map[st.group])map[st.group]=[];map[st.group].push(r);});return ["Fuga","Ataque","Grupo favoritos","Pelotón","Grupo 2","Cortados"].filter(k=>map[k]).map(k=>groupObject(k,map[k],best));}
function groupObject(label,riders,best){const t=avg(riders.map(r=>Game.live.states[r.id].elapsed)),km=avg(riders.map(r=>Game.live.states[r.id].km)),speed=avg(riders.map(r=>Game.live.states[r.id].speed)),wkg=avg(riders.map(r=>Game.live.states[r.id].wkg));return{label,riders,count:riders.length,gapText:label==="Fuga"?`${seconds(Game.live.breakaway.gap)} sobre pelotón`:gap(t,best),km:clamp(km,0,getStage().distance),speed:speed||0,wkg:wkg||0,cls:groupClass(label)};}
function buildTTGroups(){return getRaceRiders().map(r=>{const st=Game.live.states[r.id];return{label:`CRI ${r.name}`,riders:[r],count:1,gapText:`sale ${seconds(Game.live.startOffsets[r.id]||0)}`,km:st.km,speed:st.speed||0,wkg:st.wkg||0,cls:r.teamId===Game.selectedTeamId?"fav":"peloton"};}).slice(0,30);}
function buildTTTGroups(){const stage=getStage(),sector=stage.sectors[Game.live.sectorIndex];return TEAMS.map(team=>{const riders=getTeamRiders(team.id),t=avg(riders.map(r=>Game.live.states[r.id]?.elapsed||0)),km=avg(riders.map(r=>Game.live.states[r.id]?.km||sector.from)),speed=avg(riders.map(r=>Game.live.states[r.id]?.speed||0)),wkg=avg(riders.map(r=>Game.live.states[r.id]?.wkg||0));return{label:`CRE ${team.name}`,riders,count:riders.length,gapText:`salida ${seconds(Game.live.teamStartOffsets[team.id]||0)}`,km,speed,wkg,cls:team.id===Game.selectedTeamId?"fav":"peloton"};}).sort((a,b)=>b.km-a.km).slice(0,20);}
function groupClass(label){return {"Fuga":"break","Ataque":"attack","Grupo favoritos":"fav","Pelotón":"peloton","Grupo 2":"second","Cortados":"dropped"}[label]||"peloton";}
function renderTVLanes(groups){const lanes=["Fuga","Ataque","Grupo favoritos","Pelotón","Grupo 2","Cortados"];return `<div class="tv-lanes live">${lanes.map(label=>{const g=groups.find(x=>x.label===label);return `<div class="lane ${g?g.cls:""}"><strong>${label}</strong><span>${g?`${g.count} corredores · ${g.gapText} · km ${g.km.toFixed(1)} · ${g.speed.toFixed(1)} km/h · ${g.wkg.toFixed(1)} W/kg`:"—"}</span><div class="lane-chips">${g?g.riders.slice(0,12).map(r=>`<b class="${r.teamId===Game.selectedTeamId?"mine":isRival(r)?"rival":""}">${esc(r.name)}</b>`).join(""):""}</div></div>`;}).join("")}</div>`;}
function getImportantRivals(){return getGC().filter(r=>r.teamId!==Game.selectedTeamId&&["gc","co"].includes(r.roleKey)).slice(0,8);}
function isRival(r){return getImportantRivals().some(x=>x.id===r.id);}
function renderLiveRadar(groups){const rivals=getImportantRivals();return `<div class="radar"><h3>Radar de rivales</h3>${rivals.map(r=>{const st=Game.live.states[r.id];return `<div class="radar-row"><strong>${esc(r.name)}</strong><span>${esc(st?st.group:"—")} · km ${st?st.km.toFixed(1):"—"}</span></div>`;}).join("")}</div>`;}
function renderEnergyHeatmap(){return `<div class="energy-map">${getTeamRiders(Game.selectedTeamId).map(r=>{const e=Game.live.states[r.id]?.energy||0,cls=e>68?"good":e>38?"warn":"bad";return `<div class="energy ${cls}"><strong>${esc(r.name)}</strong><span>${Math.round(e)}%</span></div>`;}).join("")}</div>`;}

/* ============================================================
   v0.17 Race Director Pro + Group Engine + Rival AI Patch
   ============================================================ */

function ensureV017State() {
  if (!Game.directorLog) Game.directorLog = [];
  if (!Game.aiMemory) Game.aiMemory = {};
  if (!Game.recommendationHistory) Game.recommendationHistory = [];
}

function renderDirectorTab() {
  ensureV017State();
  const stage = getStage();
  const previewGroups = previewStartGroups(stage);
  const situation = analyzeRaceSituation(previewGroups, stage, null);
  return `
    <div class="grid director">
      <section class="panel">
        ${renderActionBar(false)}
        ${renderWeather(stage)}
        ${renderRaceControlPanel(situation, false)}
        ${renderStageProfile(stage, previewGroups)}
        ${renderThreatPanel(situation, false)}
        ${renderDirectorRecommendation(situation, false)}
        ${renderVisualLanesPreview()}
      </section>
      <section class="panel">
        ${renderStrategyTab(false, true)}
      </section>
    </div>`;
}

function renderActionBar(live) {
  const stage = getStage();
  const sector = live ? stage.sectors[Game.live.sectorIndex] : null;
  const groups = live && Game.live ? buildGroups() : previewStartGroups(stage);
  const situation = analyzeRaceSituation(groups, stage, sector);
  const progress = live ? Math.round((sector.from / stage.distance) * 100) : 0;
  return `
    <div class="actionbar ${live ? "live" : ""}">
      <div>
        <strong>${live ? `Sector ${Game.live.sectorIndex + 1}/${stage.sectors.length} · ${sector.name}` : "Salida de etapa"}</strong>
        <p>${live ? `Km ${sector.from}-${sector.to} · ${sector.question}` : "Simulación rápida o Race Director por sectores. Motor v0.17 basado en grupos + IA rival."}</p>
        <div class="actionbar-mini">
          <span class="control-pill ${situation.controlClass}">${situation.controlLabel}</span>
          <span class="control-pill ${situation.threatClass}">${situation.threatLabel}</span>
          <span class="control-pill">${situation.shortAdvice}</span>
        </div>
        ${live ? `<div class="bar"><div style="width:${progress}%"></div></div>` : ""}
      </div>
      <div class="actionbar-buttons">
        ${live ? `
          <button onclick="simulateSector()">Simular sector</button>
          <button class="secondary" onclick="applyDirectorRecommendation(true)">Aplicar recomendación</button>
          <button class="secondary" onclick="renderLive()">Actualizar</button>
        ` : `
          <button class="secondary" onclick="simulateFullStageQuick()">Simular etapa rápida</button>
          <button onclick="startLiveStage()">Iniciar por sectores</button>
        `}
      </div>
    </div>`;
}

function previewStartGroups(stage) {
  if (isTT(stage)) {
    return [{ label: "CRI individual", riders: getRaceRiders().slice(0, 12), count: getRaceRiders().length, gapText: "salidas cada 2 min", gapSeconds: 0, km: 0, speed: 0, wkg: 0, collaboration: 0, fatigue: 0, risk: 0, cls: "tt" }];
  }
  if (isTTT(stage)) {
    return [{ label: "CRE equipos", riders: getTeamRiders(Game.selectedTeamId), count: TEAMS.length, gapText: "equipos cada 5 min", gapSeconds: 0, km: 0, speed: 0, wkg: 0, collaboration: 90, fatigue: 0, risk: 0, cls: "fav" }];
  }
  const user = getTeamRiders(Game.selectedTeamId);
  return [
    { label: "Fuga", riders: [], count: 0, gapText: "sin formar", gapSeconds: 0, km: 0, speed: 0, wkg: 0, collaboration: 0, fatigue: 0, risk: 0, cls: "break" },
    { label: "Pelotón", riders: getRaceRiders().slice(0, 20), count: getRaceRiders().length, gapText: "m.t.", gapSeconds: 0, km: 0, speed: 0, wkg: 0, collaboration: 55, fatigue: 0, risk: stage.weather.crosswind > 50 ? 62 : 20, cls: "peloton" },
    { label: "Tu equipo", riders: user, count: user.length, gapText: "m.t.", gapSeconds: 0, km: 0, speed: 0, wkg: 0, collaboration: 60, fatigue: avg(user.map(r => r.fatigue || 0)), risk: 0, cls: "fav" }
  ];
}

function renderRaceControlPanel(situation, live) {
  return `
    <div class="race-control-panel ${situation.controlClass}">
      <div class="control-gauge">
        <span>${situation.controlIcon}</span>
        <strong>${situation.controlLabel}</strong>
        <small>Control carrera</small>
      </div>
      <div class="control-data-grid">
        <div><b>${situation.breakGapText}</b><span>Fuga</span></div>
        <div><b>${situation.userLeaderGroup}</b><span>Líder propio</span></div>
        <div><b>${situation.rivalAlert}</b><span>Rivales GC</span></div>
        <div><b>${situation.prediction}</b><span>Predicción</span></div>
      </div>
    </div>`;
}

function renderThreatPanel(situation, live) {
  return `
    <div class="threat-panel ${situation.threatClass}">
      <div>
        <h2>Panel de amenaza táctica</h2>
        <p>${situation.threatText}</p>
      </div>
      <div class="threat-meter"><div style="width:${situation.threatScore}%"></div></div>
    </div>`;
}

function renderDirectorRecommendation(situation, live) {
  return `
    <div class="recommendation-card">
      <div>
        <h2>Recomendación del director</h2>
        <p>${situation.recommendationText}</p>
      </div>
      <button class="secondary" onclick="applyDirectorRecommendation(${live})">${situation.recommendationButton}</button>
    </div>`;
}

function renderTacticalAdvice(stage) {
  const groups = Game.live ? buildGroups() : previewStartGroups(stage);
  const situation = analyzeRaceSituation(groups, stage, Game.live ? stage.sectors[Game.live.sectorIndex] : null);
  return `<div class="advice ${situation.threatLevel}"><span>${situation.controlIcon}</span><div><strong>${situation.adviceTitle}</strong><p>${situation.threatText}</p></div></div>`;
}

function renderVisualLanesPreview() {
  return `
    <div class="tv-lanes preview">
      ${["Fuga", "Grupo perseguidor", "Grupo favoritos", "Pelotón", "Grupo 2", "Autobús", "Cortados"].map((x, i) => `
        <div class="lane ${i === 2 ? "fav" : i === 3 ? "peloton" : i === 0 ? "break" : ""}">
          <strong>${x}</strong>
          <span>${i === 3 ? "Salida normal de carrera. El motor v0.17 moverá grupos según colaboración, W/kg y objetivos." : "—"}</span>
        </div>
      `).join("")}
    </div>`;
}

function analyzeRaceSituation(groups, stage, sector) {
  const userRiders = getTeamRiders(Game.selectedTeamId);
  const protectedRider = getRider(Game.protectedRiderId) || userRiders[0];
  const protectedState = Game.live && protectedRider ? Game.live.states[protectedRider.id] : null;
  const breakGroup = groups.find(g => g.label === "Fuga");
  const chaseGroup = groups.find(g => g.label === "Grupo perseguidor");
  const favGroup = groups.find(g => g.label === "Grupo favoritos");
  const peloton = groups.find(g => g.label === "Pelotón");
  const remaining = sector ? Math.max(0, stage.distance - sector.to) : stage.distance;
  const breakGap = breakGroup ? Number(breakGroup.gapSeconds || 0) : 0;
  const breakThreat = breakGap > 0 ? clamp((breakGap / Math.max(45, remaining * 4.2)) * 55 + (breakGroup?.count || 0) * 3, 0, 100) : 0;
  const rivalStatus = getImportantRivals().map(r => ({ rider: r, state: Game.live ? Game.live.states[r.id] : null }));
  const dangerousRivalAhead = rivalStatus.some(x => x.state && ["Fuga", "Ataque", "Grupo perseguidor"].includes(x.state.group));
  const leaderGroup = protectedState ? protectedState.group : "Sin empezar";
  const leaderProblem = protectedState && ["Grupo 2", "Autobús", "Cortados"].includes(protectedState.group);
  const energyAvg = avg(userRiders.map(r => Game.live && Game.live.states[r.id] ? Game.live.states[r.id].energy : 90));
  const riskBase = stage.weather.crosswind > 50 ? 18 : 0;
  let threatScore = clamp(breakThreat + (dangerousRivalAhead ? 22 : 0) + (leaderProblem ? 35 : 0) + riskBase + (energyAvg < 45 ? 14 : 0), 0, 100);

  let controlClass = "good", controlLabel = "Controlado", controlIcon = "🟢";
  if (threatScore > 70) { controlClass = "danger"; controlLabel = "Actuar ya"; controlIcon = "🔴"; }
  else if (threatScore > 38) { controlClass = "warning"; controlLabel = "Vigilar"; controlIcon = "🟠"; }

  let threatClass = threatScore > 70 ? "danger" : threatScore > 38 ? "warning" : "good";
  let threatLevel = threatScore > 70 ? "high" : threatScore > 38 ? "medium" : "low";
  let breakGapText = breakGap > 0 ? seconds(breakGap) : "sin fuga";
  let prediction = "neutral";
  if (breakGap > 0) {
    const projected = breakGap - remaining * (peloton?.collaboration > 70 ? 7.2 : 4.6);
    prediction = projected > 45 ? `fuga llega +${seconds(projected)}` : "fuga cazable";
  }
  if (isTT(stage)) prediction = "CRI sin grupos";
  if (isTTT(stage)) prediction = "tiempo 4º corredor";

  let recommendation = "Mantener posición, proteger líder y no quemar gregarios todavía.";
  let button = "Aplicar equilibrio";
  let shortAdvice = "Mantener";
  let title = "Carrera bajo control";
  if (isTT(stage)) {
    recommendation = "Usa esfuerzos altos solo en croners y líderes. Sin rebufo ni órdenes de grupo.";
    button = "Ritmo CRI";
    shortAdvice = "Pacing CRI";
    title = "Crono individual";
  } else if (isTTT(stage)) {
    recommendation = "Relevos regulares o fuertes, manteniendo al menos 5 corredores hasta el último sector.";
    button = "Relevos CRE";
    shortAdvice = "Relevos";
    title = "Crono por equipos";
  } else if (leaderProblem) {
    recommendation = "Tu líder está mal colocado o cortado. Ordena esperar/proteger y reduce ataques innecesarios.";
    button = "Salvar líder";
    shortAdvice = "Salvar líder";
    title = "Líder en peligro";
  } else if (breakGap > 180 && remaining < 55) {
    recommendation = "La fuga es peligrosa. Pon gregarios y rodadores a cazar fuga al 82-88%.";
    button = "Cazar fuga";
    shortAdvice = "Cazar";
    title = "Fuga peligrosa";
  } else if (stage.type === "mountain" && sector && ["climb", "final"].includes(sector.type)) {
    recommendation = "Sube a tempo con escaladores y protege al líder. Ataca solo si el rival directo está aislado.";
    button = "Tempo montaña";
    shortAdvice = "Tempo";
    title = "Sector decisivo de montaña";
  } else if (stage.type === "flat" && stage.weather.crosswind > 50) {
    recommendation = "Viento lateral: coloca líderes delante, gregarios protegen y evita ir a rueda atrás.";
    button = "Proteger abanicos";
    shortAdvice = "Abanicos";
    title = "Riesgo por viento lateral";
  } else if (stage.type === "flat" && sector && sector.type === "final") {
    recommendation = "Organiza tren de sprint: rodadores y clasicómanos lanzan, sprinter a rueda.";
    button = "Tren sprint";
    shortAdvice = "Sprint";
    title = "Final rápido";
  }

  const rivalAlert = dangerousRivalAhead ? "rival delante" : leaderGroup;
  return {
    threatScore: Math.round(threatScore), threatClass, threatLevel,
    controlClass, controlLabel, controlIcon,
    breakGapText, userLeaderGroup: leaderGroup, rivalAlert, prediction,
    recommendationText: recommendation, recommendationButton: button,
    shortAdvice, adviceTitle: title,
    threatLabel: threatScore > 70 ? "Amenaza alta" : threatScore > 38 ? "Amenaza media" : "Amenaza baja",
    threatText: buildThreatText(stage, sector, breakGroup, protectedRider, protectedState, dangerousRivalAhead, breakGap, remaining)
  };
}

function buildThreatText(stage, sector, breakGroup, protectedRider, protectedState, dangerousRivalAhead, breakGap, remaining) {
  if (isTT(stage)) return "CRI: cada corredor sale cada 2 minutos. No hay rebufo ni persecución colectiva; solo pacing, forma, material y clima.";
  if (isTTT(stage)) return "CRE: los equipos salen cada 5 minutos. La clave es regular relevos para que el 4º corredor marque un buen tiempo sin romper el bloque.";
  if (protectedState && ["Grupo 2", "Autobús", "Cortados"].includes(protectedState.group)) return `${protectedRider.name} está en ${protectedState.group}. Prioridad absoluta: reagrupar o limitar pérdidas.`;
  if (dangerousRivalAhead) return "Hay rivales de general por delante o en movimiento. No conviene dejar estabilizar la diferencia.";
  if (breakGap > 180 && remaining < 60) return `La fuga mantiene ${seconds(breakGap)} con ${Math.round(remaining)} km restantes. Si el pelotón no colabora, puede llegar.`;
  if (stage.weather.crosswind > 50) return `Viento lateral de ${stage.weather.crosswind} km/h: alto riesgo de abanicos y cortes si los líderes van mal colocados.`;
  if (sector && sector.type === "climb") return "Subida activa: el grupo de favoritos puede seleccionar por W/kg y fatiga. Sprinters y gregarios débiles deberían caer al autobús.";
  return "Carrera estable. Vigila fuga, energía del líder y colocación antes del sector decisivo.";
}

function applyDirectorRecommendation(live) {
  const stage = getStage();
  const sector = live && Game.live ? stage.sectors[Game.live.sectorIndex] : null;
  const groups = live && Game.live ? buildGroups() : previewStartGroups(stage);
  const situation = analyzeRaceSituation(groups, stage, sector);
  const riders = getTeamRiders(Game.selectedTeamId);
  const text = situation.recommendationButton;

  riders.forEach(r => {
    if (isTT(stage)) {
      Game.riderOrders[r.id] = ["tt", "rouleur", "gc", "co"].includes(r.roleKey) ? "pull" : "hold";
      Game.riderEfforts[r.id] = ["tt", "rouleur", "gc", "co"].includes(r.roleKey) ? 88 : 74;
      return;
    }
    if (isTTT(stage)) {
      Game.riderOrders[r.id] = "pull";
      Game.riderEfforts[r.id] = ["tt", "rouleur", "gc", "co"].includes(r.roleKey) ? 86 : 76;
      Game.tttRelayIntensity = "steady";
      Game.tttRelayLength = "medium";
      Game.tttFormation = "smooth";
      return;
    }
    if (text.includes("Cazar")) {
      Game.riderOrders[r.id] = ["domestique", "rouleur", "tt", "classics"].includes(r.roleKey) ? "catch" : r.id === Game.protectedRiderId ? "protect" : "hold";
      Game.riderEfforts[r.id] = ["domestique", "rouleur", "tt", "classics"].includes(r.roleKey) ? 86 : r.id === Game.protectedRiderId ? 66 : 62;
      return;
    }
    if (text.includes("Tempo")) {
      Game.riderOrders[r.id] = r.id === Game.protectedRiderId ? "hold" : ["climber", "puncheur", "domestique"].includes(r.roleKey) ? "tempo" : "sit";
      Game.riderEfforts[r.id] = r.id === Game.protectedRiderId ? 76 : ["climber", "puncheur", "domestique"].includes(r.roleKey) ? 84 : 52;
      return;
    }
    if (text.includes("Sprint")) {
      Game.riderOrders[r.id] = r.roleKey === "sprinter" ? "sit" : ["rouleur", "classics", "tt"].includes(r.roleKey) ? "sprint_train" : "hold";
      Game.riderEfforts[r.id] = r.roleKey === "sprinter" ? 55 : ["rouleur", "classics", "tt"].includes(r.roleKey) ? 84 : 62;
      return;
    }
    if (text.includes("abanicos") || text.includes("Proteger") || text.includes("Salvar")) {
      Game.riderOrders[r.id] = r.id === Game.protectedRiderId ? "hold" : ["domestique", "rouleur", "tt", "classics"].includes(r.roleKey) ? "protect" : "sit";
      Game.riderEfforts[r.id] = r.id === Game.protectedRiderId ? 70 : ["domestique", "rouleur", "tt", "classics"].includes(r.roleKey) ? 80 : 55;
      return;
    }
    Game.riderOrders[r.id] = r.id === Game.protectedRiderId ? "hold" : ["domestique", "rouleur"].includes(r.roleKey) ? "protect" : "sit";
    Game.riderEfforts[r.id] = r.id === Game.protectedRiderId ? 68 : ["domestique", "rouleur"].includes(r.roleKey) ? 72 : 52;
  });

  if (live && Game.live) addRadio(`Director: ${situation.recommendationText}`);
  Game.recommendationHistory.push({ raceId: Game.selectedRaceId, stageId: stage.id, sector: sector ? sector.id : "pre", text: situation.recommendationText });
  live && Game.live ? renderLive() : renderRace();
}

function startLiveStage(renderNow = true) {
  ensureV017State();
  const stage = getStage();
  Game.live = {
    sectorIndex: 0,
    states: {},
    radio: [],
    events: [],
    director: { control: "neutral", threat: 0 },
    breakaway: { gap: 0, ids: [], collaboration: 0, fatigue: 0, lastGap: 0 },
    groupModel: { pelotonCollaboration: 55, chaseCommitment: 0, favoritePressure: 0 },
    startOffsets: {},
    teamStartOffsets: {}
  };

  getRaceRiders().forEach((r, index) => {
    Game.live.states[r.id] = {
      elapsed: 0,
      raceTime: 0,
      km: 0,
      speed: 0,
      wkg: 0,
      energy: clamp(100 - r.fatigue * 0.35, 10, 112),
      hydration: 105,
      stomach: 0,
      finalBonus: 0,
      group: isTT(stage) ? "CRI individual" : isTTT(stage) ? `CRE ${getTeam(r.teamId).name}` : "Pelotón",
      groupId: isTT(stage) ? `tt_${r.id}` : isTTT(stage) ? `ttt_${r.teamId}` : "peloton",
      fatigueGain: 0,
      incident: null
    };
    if (isTT(stage)) Game.live.startOffsets[r.id] = index * 120;
  });

  if (isTTT(stage)) {
    TEAMS.forEach((team, index) => { Game.live.teamStartOffsets[team.id] = index * 300; });
    addRadio("Salida CRE: equipos cada 5 minutos. Tiempo oficial por el 4º corredor.");
  } else if (isTT(stage)) {
    addRadio("Salida CRI: corredores cada 2 minutos, sin rebufo ni grupos.");
  } else {
    const breakaway = selectBreakaway(stage);
    const initialGap = Math.round(rnd(75, 190));
    Game.live.breakaway = {
      gap: initialGap,
      lastGap: initialGap,
      ids: breakaway.map(r => r.id),
      collaboration: calculateBreakawayCollaboration(breakaway, stage),
      fatigue: 0
    };
    breakaway.forEach(r => {
      const st = Game.live.states[r.id];
      st.group = "Fuga";
      st.groupId = "breakaway";
      st.elapsed = -initialGap;
    });
    addRadio(`Salida: fuga de ${breakaway.length} corredores. Ventaja inicial ${seconds(initialGap)}.`);
  }

  if (renderNow) renderLive();
}

function renderLive() {
  const stage = getStage();
  const sector = stage.sectors[Game.live.sectorIndex];
  const groups = buildGroups();
  const situation = analyzeRaceSituation(groups, stage, sector);
  app.innerHTML = `
    <div class="header">
      <div><h1>Race Director · ${esc(stage.name)}</h1><p>Sector ${Game.live.sectorIndex + 1}/${stage.sectors.length} · km ${sector.from}-${sector.to}</p></div>
      <div class="top-actions"><button class="secondary" onclick="saveGame()">Guardar</button></div>
    </div>
    ${renderActionBar(true)}
    <section class="panel">
      ${renderWeather(stage)}
      ${renderRaceControlPanel(situation, true)}
      ${renderStageProfile(stage, groups)}
      ${renderTVLanes(groups)}
      ${renderThreatPanel(situation, true)}
      ${renderDirectorRecommendation(situation, true)}
    </section>
    <div class="grid live-grid">
      <section class="panel">
        <h2>Decisión del sector</h2>
        <div class="sector-focus"><strong>${esc(sector.question)}</strong><p>${esc(sector.name)} · Dificultad ${sector.difficulty} · ${sector.from}-${sector.to} km</p></div>
        ${isTTT(stage) ? renderTTTControls(true) : ""}
        ${renderLiveRadar(groups)}
        ${renderQuickControls(true)}
      </section>
      <section class="panel">
        <h2>Radio / TV</h2>
        <div class="radio-list">${Game.live.radio.map(r => `<div class="radio"><span>${esc(r.time)}</span><p>${esc(r.msg)}</p></div>`).join("")}</div>
        <h2>Stock coche</h2>${renderStock(Game.stock)}
      </section>
    </div>
    <section class="panel">
      <h2>Tu equipo en carrera</h2>
      ${renderEnergyHeatmap()}
      <div class="live-rider-grid">${getTeamRiders(Game.selectedTeamId).map(renderLiveRiderCard).join("")}</div>
    </section>`;
}

function processSector(renderNow) {
  const stage = getStage();
  const sector = stage.sectors[Game.live.sectorIndex];
  if (!isTT(stage) && !isTTT(stage)) applyAIRaceTactics(stage, sector);
  autoFeed(sector);
  if (isTT(stage)) simulateTTSector(stage, sector);
  else if (isTTT(stage)) simulateTTTSector(stage, sector);
  else simulateRoadSector(stage, sector);
  Game.live.sectorIndex++;
  if (Game.live.sectorIndex >= stage.sectors.length) return finishStage(renderNow);
  const groups = buildGroups();
  const nextSector = stage.sectors[Game.live.sectorIndex];
  const situation = analyzeRaceSituation(groups, stage, nextSector);
  addRadio(`Entramos en ${nextSector.name}. ${situation.shortAdvice}: ${situation.threatLabel}.`);
  if (renderNow) renderLive();
}

function applyAIRaceTactics(stage, sector) {
  TEAMS.forEach(team => {
    if (team.id === Game.selectedTeamId) return;
    const riders = getTeamRiders(team.id);
    const ai = team.ai || { gc: 50, sprint: 50, classics: 50, breakaway: 50, control: 50 };
    const hasGC = riders.some(r => ["gc", "co"].includes(r.roleKey));
    const bestGC = riders.filter(r => ["gc", "co"].includes(r.roleKey)).sort((a, b) => b.base - a.base)[0];
    const bestSprinter = riders.filter(r => r.roleKey === "sprinter").sort((a, b) => b.stats.sprint - a.stats.sprint)[0];
    const early = sector.to < stage.distance * 0.45;
    const final = sector.type === "final";
    const breakThreat = Game.live.breakaway && Game.live.breakaway.gap > 180 && stage.distance - sector.to < 70;
    riders.forEach(r => {
      let order = "hold";
      let effort = 62;
      if (hasGC && bestGC && r.id === bestGC.id) { order = "hold"; effort = stage.type === "mountain" ? 74 : 66; }
      if (hasGC && bestGC && ["domestique", "rouleur", "tt", "climber"].includes(r.roleKey)) { order = "protect"; effort = stage.type === "mountain" ? 72 : 68; }
      if (stage.type === "flat" && final && bestSprinter) {
        order = r.id === bestSprinter.id ? "sit" : ["rouleur", "classics", "tt"].includes(r.roleKey) ? "sprint_train" : "hold";
        effort = r.id === bestSprinter.id ? 54 : ["rouleur", "classics", "tt"].includes(r.roleKey) ? 82 : 64;
      }
      if (early && ai.breakaway > 78 && ["puncheur", "rouleur", "climber", "classics"].includes(r.roleKey) && !["gc", "co"].includes(r.roleKey) && Math.random() < 0.28) {
        order = "attack"; effort = 84;
      }
      if (breakThreat && ai.control > 62 && ["domestique", "rouleur", "tt", "classics"].includes(r.roleKey)) {
        order = "catch"; effort = 82;
      }
      if (stage.type === "mountain" && ["climb", "final"].includes(sector.type) && ai.gc > 75 && ["climber", "domestique"].includes(r.roleKey)) {
        order = "tempo"; effort = final ? 84 : 78;
      }
      if (stage.type === "cobbles" && ai.classics > 74 && ["classics", "rouleur"].includes(r.roleKey)) {
        order = final ? "attack" : "pull"; effort = final ? 84 : 78;
      }
      Game.riderOrders[r.id] = order;
      Game.riderEfforts[r.id] = effort;
    });
  });
}

function calculateBreakawayCollaboration(riders, stage) {
  if (!riders || !riders.length) return 0;
  const roles = avg(riders.map(r => ["rouleur", "puncheur", "classics", "climber"].includes(r.roleKey) ? 82 : 62));
  const stamina = avg(riders.map(r => r.stats.stamina || 75));
  const motive = avg(riders.map(r => ["gc", "co", "sprinter"].includes(r.roleKey) ? 52 : 78));
  return clamp(roles * 0.34 + stamina * 0.34 + motive * 0.32 + rnd(-6, 6), 35, 94);
}

function simulateRoadSector(stage, sector) {
  const base = baseSectorTime(stage, sector);
  const riders = getRaceRiders();
  const previousGap = toNum(Game.live.breakaway?.gap, 0);
  const breakIds = new Set(Game.live.breakaway?.ids || []);
  const userPull = calculateTeamPull(Game.selectedTeamId, sector);
  const aiPull = TEAMS.filter(t => t.id !== Game.selectedTeamId).reduce((sum, t) => sum + calculateTeamPull(t.id, sector), 0);
  const pelotonCollab = clamp(42 + userPull * 0.55 + aiPull * 0.11 + (stage.type === "flat" ? 6 : 0) + (stage.type === "mountain" ? -4 : 0), 18, 96);
  const breakRiders = riders.filter(r => breakIds.has(r.id) && !r.abandoned);
  const breakCollab = breakRiders.length ? calculateBreakawayCollaboration(breakRiders, stage) - toNum(Game.live.breakaway.fatigue, 0) : 0;
  const sectorKm = Math.max(1, sector.to - sector.from);
  const remaining = Math.max(0, stage.distance - sector.to);
  const terrainChaseFactor = sector.type === "flat" ? 1.12 : sector.type === "hilly" ? 0.95 : sector.type === "climb" ? 0.72 : sector.type === "cobbles" ? 0.84 : sector.type === "final" ? 1.05 : 0.92;
  const chaseDelta = (pelotonCollab - breakCollab) * terrainChaseFactor * sectorKm * 0.72;
  const naturalDrift = sector.type === "climb" && breakRiders.length < 4 ? -sectorKm * 1.8 : sector.type === "flat" && breakRiders.length >= 5 ? sectorKm * 0.45 : 0;
  let newGap = previousGap;
  if (breakRiders.length) {
    newGap = previousGap - chaseDelta + naturalDrift + rnd(-18, 18);
    const maxDrop = previousGap > 240 ? 95 + sectorKm * 2.2 : 70 + sectorKm * 1.7;
    newGap = Math.max(previousGap - maxDrop, newGap);
    if (remaining < 10 && newGap < 45) newGap = 0;
    newGap = clamp(newGap, 0, 900);
  }
  const pelotonSectorTime = calculateGroupSectorTime(riders.filter(r => !breakIds.has(r.id)), stage, sector, base, "peloton", pelotonCollab);
  const breakSectorTime = breakRiders.length ? Math.max(60, pelotonSectorTime - (newGap - previousGap)) : pelotonSectorTime;

  Game.live.breakaway.lastGap = previousGap;
  Game.live.breakaway.gap = newGap;
  Game.live.breakaway.collaboration = breakCollab;
  Game.live.breakaway.fatigue = clamp(toNum(Game.live.breakaway.fatigue, 0) + sector.difficulty / 45 + (breakRiders.length < 4 ? 2.2 : 1.0), 0, 35);
  Game.live.groupModel.pelotonCollaboration = pelotonCollab;

  riders.forEach(r => {
    const st = Game.live.states[r.id];
    const order = getOrder(Game.riderOrders[r.id] || r.defaultOrder);
    const effort = Game.riderEfforts[r.id] ?? r.defaultEffort;
    const inBreak = breakIds.has(r.id) && newGap > 0;
    const groupSectorTime = inBreak ? breakSectorTime : pelotonSectorTime;
    let perf = terrainPerformance(r, stage, sector) + (effort - 60) * 0.09 + materialScore(r, stage, sector) * 0.045 - r.fatigue * 0.055 + st.finalBonus + rnd(-2.2, 2.2);
    if (stage.type === "mountain" && r.roleKey === "sprinter") perf -= 22;
    if (stage.type === "mountain" && ["climb", "final"].includes(sector.type) && r.stats.mountain < 68) perf -= 24;
    if (sector.type === "cobbles" && r.stats.cobbles < 68) perf -= 9;
    if (stage.weather.temp > 30 && st.hydration < 58) perf -= 7;
    if (stage.weather.roadWet > 60) perf -= Math.max(0, (75 - r.stats.positioning)) * 0.10;

    let personalLoss = calculatePersonalGroupLoss(r, st, stage, sector, perf, effort, inBreak);
    let attackGain = 0;
    if (!inBreak && order.attack && effort > 76 && Math.random() < attackChance(r, sector, effort)) {
      attackGain = rnd(18, 65);
      st.groupId = `attack_${r.id}`;
      addRadio(`${r.name} ataca.`);
    }
    const risk = incidentRisk(r, stage, sector, effort) * toNum(order.risk, 1);
    if (Math.random() < risk) {
      const loss = rnd(30, sector.type === "cobbles" ? 190 : 120);
      personalLoss += loss;
      st.incident = "Incidente";
      st.groupId = "dropped";
      addRadio(`${r.name} sufre incidente y pierde ${seconds(loss)}.`);
    }
    if (st.energy < 25 && Math.random() < (st.energy < 15 ? 0.34 : 0.16)) {
      const loss = rnd(75, 260);
      personalLoss += loss;
      st.groupId = "dropped";
      addRadio(`${r.name} entra en crisis y pierde ${seconds(loss)}.`);
    }
    st.elapsed += Math.max(35, groupSectorTime + personalLoss - attackGain);
    st.raceTime += Math.max(35, groupSectorTime + personalLoss - attackGain);
    st.km = inBreak ? Math.min(stage.distance, sector.to + newGap / 55) : sector.to;
    st.speed = sectorKm / Math.max(0.01, (groupSectorTime + personalLoss) / 3600);
    st.wkg = estimateWkg(r, sector, effort, st.groupId);
    st.energy = clamp(st.energy - energyCost(sector, order, effort, r), 0, 118);
    st.hydration = clamp(st.hydration - hydrationCost(stage, sector, effort), 0, 125);
    st.stomach = clamp(st.stomach - 4, 0, 100);
    st.finalBonus = Math.max(0, st.finalBonus - 0.8);
    st.fatigueGain += fatigueGain(sector, effort, r);
    if (inBreak) { st.groupId = "breakaway"; st.group = "Fuga"; }
  });

  applyGroupCohesion(stage, sector);
  applyRaceGroupSelection(stage, sector);
  if (breakRiders.length) {
    if (newGap === 0) addRadio("La fuga queda neutralizada.");
    else addRadio(`Fuga: ${breakRiders.length} corredores, ${seconds(newGap)} de ventaja, colaboración ${Math.round(breakCollab)}%.`);
  }
}

function calculateTeamPull(teamId, sector) {
  return getTeamRiders(teamId).reduce((sum, r) => {
    const st = Game.live.states[r.id];
    if (!st || st.groupId === "dropped") return sum;
    const order = getOrder(Game.riderOrders[r.id] || r.defaultOrder);
    const effort = Game.riderEfforts[r.id] ?? r.defaultEffort;
    const roleMultiplier = ["rouleur", "tt", "domestique", "classics"].includes(r.roleKey) ? 1.12 : ["gc", "co"].includes(r.roleKey) ? 0.55 : 0.82;
    return sum + order.pull * Math.max(0, effort - 48) * 0.13 * roleMultiplier;
  }, 0);
}

function calculateGroupSectorTime(groupRiders, stage, sector, base, groupType, collaboration) {
  const riders = groupRiders && groupRiders.length ? groupRiders : getRaceRiders();
  const perf = avg(riders.slice().sort((a, b) => terrainPerformance(b, stage, sector) - terrainPerformance(a, stage, sector)).slice(0, Math.min(16, riders.length)).map(r => terrainPerformance(r, stage, sector)));
  const effortBoost = groupType === "break" ? 2.4 : collaboration > 70 ? 1.8 : 0;
  const time = base + (82 - perf - effortBoost) * difficultySpread(sector) - (collaboration - 50) * 0.75;
  return Math.max(base * 0.82, time + rnd(-8, 8));
}

function calculatePersonalGroupLoss(r, st, stage, sector, perf, effort, inBreak) {
  let loss = 0;
  const pressure = sector.difficulty + (stage.type === "mountain" ? 10 : 0) + Math.max(0, effort - 78) * 0.25;
  if (["climb", "final"].includes(sector.type) && stage.type === "mountain") {
    const climbingGap = 76 - (r.stats.mountain * 0.58 + r.stats.stamina * 0.24 + r.form * 0.18);
    if (climbingGap > 0) loss += climbingGap * (sector.to - sector.from) * 1.55;
    if (r.roleKey === "sprinter") loss += (sector.to - sector.from) * 10.5;
  }
  if (sector.type === "cobbles" && r.stats.cobbles < 70) loss += (70 - r.stats.cobbles) * 2.2;
  if (st.energy < 45) loss += (45 - st.energy) * 2.6;
  if (st.hydration < 45) loss += (45 - st.hydration) * 1.9;
  if (perf < 68 && pressure > 78) loss += rnd(15, 85);
  if (inBreak && st.energy < 38) loss += rnd(20, 90);
  return Math.max(0, loss);
}

function applyRaceGroupSelection(stage, sector) {
  if (isTT(stage) || isTTT(stage)) return;
  const riders = getRaceRiders();
  const best = Math.min(...riders.map(r => Game.live.states[r.id].elapsed));
  riders.forEach(r => {
    const st = Game.live.states[r.id];
    const delta = st.elapsed - best;
    if (st.groupId === "breakaway" && Game.live.breakaway.gap > 15) { st.group = "Fuga"; return; }
    if (st.groupId && st.groupId.startsWith("attack")) { st.group = "Ataque"; return; }
    if (st.groupId === "dropped" || delta > 360) { st.group = delta > 720 ? "Autobús" : "Cortados"; return; }
    if (["climb", "final"].includes(sector.type) && stage.type === "mountain") {
      if (["gc", "co", "climber"].includes(r.roleKey) && delta <= 70) { st.group = "Grupo favoritos"; st.groupId = "favorites"; return; }
      if (delta > 180 || r.roleKey === "sprinter") { st.group = delta > 430 ? "Autobús" : "Grupo 2"; st.groupId = delta > 430 ? "autobus" : "group2"; return; }
    }
    if (delta <= 28) { st.group = "Grupo favoritos"; st.groupId = "favorites"; }
    else if (delta <= 100) { st.group = "Pelotón"; st.groupId = "peloton"; }
    else if (delta <= 260) { st.group = "Grupo 2"; st.groupId = "group2"; }
    else { st.group = "Cortados"; st.groupId = "dropped"; }
  });
}

function buildGroups() {
  const stage = getStage();
  if (isTT(stage)) return buildTTGroups();
  if (isTTT(stage)) return buildTTTGroups();
  const riders = getRaceRiders().filter(r => Game.live.states[r.id]);
  const best = Math.min(...riders.map(r => Game.live.states[r.id].elapsed));
  const map = {};
  riders.forEach(r => {
    const st = Game.live.states[r.id];
    const g = st.elapsed - best;
    if (st.groupId === "breakaway" && Game.live.breakaway.gap > 15) st.group = "Fuga";
    else if (st.groupId && st.groupId.startsWith("attack")) st.group = "Ataque";
    else if (st.groupId === "favorites" || (["gc", "co", "climber"].includes(r.roleKey) && g <= 40)) st.group = "Grupo favoritos";
    else if (st.groupId === "group2" || (g > 100 && g <= 260)) st.group = "Grupo 2";
    else if (st.groupId === "autobus" || (g > 430 && r.roleKey === "sprinter")) st.group = "Autobús";
    else if (st.groupId === "dropped" || g > 260) st.group = "Cortados";
    else if (g <= 100) st.group = "Pelotón";
    else st.group = "Grupo 2";
    (map[st.group] ||= []).push(r);
  });
  return ["Fuga", "Ataque", "Grupo perseguidor", "Grupo favoritos", "Pelotón", "Grupo 2", "Autobús", "Cortados"].filter(k => map[k]).map(k => groupObject(k, map[k], best));
}

function groupObject(label, riders, best) {
  const t = avg(riders.map(r => Game.live.states[r.id].elapsed));
  const km = avg(riders.map(r => Game.live.states[r.id].km));
  const speed = avg(riders.map(r => Game.live.states[r.id].speed));
  const wkg = avg(riders.map(r => Game.live.states[r.id].wkg));
  const energy = avg(riders.map(r => Game.live.states[r.id].energy));
  const fatigue = avg(riders.map(r => Game.live.states[r.id].fatigueGain || 0));
  const collaboration = label === "Fuga" ? toNum(Game.live.breakaway.collaboration, 0) : label === "Pelotón" ? toNum(Game.live.groupModel?.pelotonCollaboration, 55) : label === "Grupo favoritos" ? 70 : label === "Autobús" ? 34 : 45;
  const risk = clamp((100 - energy) * 0.55 + fatigue * 2.1 + (label === "Cortados" ? 25 : 0), 0, 100);
  const gapSeconds = label === "Fuga" ? -toNum(Game.live.breakaway.gap, 0) : Math.max(0, t - best);
  return { label, riders, count: riders.length, gapText: label === "Fuga" ? `${seconds(Game.live.breakaway.gap)} sobre pelotón` : gap(t, best), gapSeconds: Math.abs(gapSeconds), km: clamp(km, 0, getStage().distance), speed: speed || 0, wkg: wkg || 0, energy: energy || 0, collaboration, fatigue, risk, cls: groupClass(label) };
}

function groupClass(label) {
  return { "Fuga": "break", "Ataque": "attack", "Grupo perseguidor": "chase", "Grupo favoritos": "fav", "Pelotón": "peloton", "Grupo 2": "second", "Autobús": "bus", "Cortados": "dropped" }[label] || "peloton";
}

function renderTVLanes(groups) {
  if (isTT(getStage()) || isTTT(getStage())) return renderChronoLanes(groups);
  const lanes = ["Fuga", "Ataque", "Grupo perseguidor", "Grupo favoritos", "Pelotón", "Grupo 2", "Autobús", "Cortados"];
  return `
    <div class="tv-lanes live pro">
      ${lanes.map(label => {
        const g = groups.find(x => x.label === label);
        return `<div class="lane ${g ? g.cls : ""}">
          <strong>${label}</strong>
          <span>${g ? `${g.count} corredores · ${g.gapText} · km ${g.km.toFixed(1)} · ${g.speed.toFixed(1)} km/h · ${g.wkg.toFixed(1)} W/kg · colab. ${Math.round(g.collaboration)}%` : "—"}</span>
          ${g ? `<div class="group-metrics"><i>energía ${Math.round(g.energy)}%</i><i>fatiga ${Math.round(g.fatigue)}</i><i>riesgo ${Math.round(g.risk)}%</i></div>` : ""}
          <div class="lane-chips">${g ? g.riders.slice(0, 14).map(r => `<b class="${r.teamId === Game.selectedTeamId ? "mine" : isRival(r) ? "rival" : ""}">${esc(r.name)}</b>`).join("") : ""}</div>
        </div>`;
      }).join("")}
    </div>`;
}

function renderChronoLanes(groups) {
  return `<div class="tv-lanes live chrono">${groups.slice(0, 20).map(g => `<div class="lane ${g.cls}"><strong>${esc(g.label)}</strong><span>${g.gapText} · km ${g.km.toFixed(1)} · ${g.speed.toFixed(1)} km/h · ${g.wkg.toFixed(1)} W/kg</span><div class="lane-chips">${g.riders.slice(0, 8).map(r => `<b class="${r.teamId === Game.selectedTeamId ? "mine" : isRival(r) ? "rival" : ""}">${esc(r.name)}</b>`).join("")}</div></div>`).join("")}</div>`;
}

function renderLiveRadar(groups) {
  const rivals = getImportantRivals();
  return `<div class="radar"><h3>Radar de rivales GC</h3>${rivals.map(r => {
    const st = Game.live.states[r.id];
    const g = groups.find(group => group.riders.some(x => x.id === r.id));
    return `<div class="radar-row"><strong>${esc(r.name)}</strong><span>${esc(st ? st.group : "—")} · km ${st ? st.km.toFixed(1) : "—"} · ${g ? g.gapText : "—"}</span></div>`;
  }).join("")}</div>`;
}

function estimateWkg(r, sector, effort, groupId = "") {
  const terrainBase = sector.type === "climb" || sector.type === "final" && getStage().type === "mountain" ? 4.7 : sector.type === "cobbles" ? 4.3 : sector.type === "flat" ? 3.0 : sector.type === "tt" ? 4.8 : 3.8;
  const role = ["gc", "co", "climber"].includes(r.roleKey) ? 0.18 : r.roleKey === "sprinter" && sector.type === "climb" ? -0.22 : 0;
  const order = getOrder(Game.riderOrders[r.id] || r.defaultOrder);
  const pull = order.pull * 0.18 + order.attack * 0.36;
  const group = groupId === "breakaway" ? 0.22 : groupId && groupId.startsWith("attack") ? 0.45 : 0;
  return clamp(terrainBase + (effort - 65) * 0.018 + role + pull + group + rnd(-0.12, 0.12), 2.0, 7.2);
}

init();
