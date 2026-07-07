/* ============================================================
   CYCLING MANAGER TOUR
   game.js
   v0.11 Season + Race Director Pro
   ============================================================ */

const app = document.getElementById("app");
const SAVE_KEY = "cyclingManager_v11";

const Game = {
  mode: "single",
  selectedRaceId: DEFAULT_RACE_ID,
  selectedTeamId: null,

  seasonRaceIds: [...SEASON_RACE_IDS],
  seasonIndex: 0,
  betweenRaces: false,
  seasonFinished: false,
  raceHistory: [],

  pendingRosterIds: [],
  raceRosters: {},
  lastRaceRosterIds: [],
  rosterLocked: false,

  currentStageIndex: 0,
  activeTab: "director",

  riders: [],
  riderOrders: {},
  riderEfforts: {},
  riderEquipment: {},
  protectedRiderId: null,

  nutritionMode: "auto_smart",
  nutritionPlanId: "auto_balanced",
  stock: {},

  stageHistory: [],
  lastStage: null,
  live: null,
  teamTimes: {},

  finished: false
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function deepClone(v) {
  return JSON.parse(JSON.stringify(v));
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rnd(min, max) {
  return min + Math.random() * (max - min);
}

function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sec(value) {
  const t = Math.max(0, Math.round(value));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  if (h) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function gap(value, leader) {
  const g = Math.round(value - leader);
  return g <= 0 ? "m.t." : `+${sec(g)}`;
}

function getRace() {
  return RACES.find(r => r.id === Game.selectedRaceId) || RACES[0];
}

function getStages() {
  return getRace().stages;
}

function getStage() {
  return getStages()[Game.currentStageIndex];
}

function getTeam(id) {
  return TEAMS.find(t => t.id === id);
}

function getRider(id) {
  return Game.riders.find(r => r.id === id);
}

function getFrame(id) {
  return FRAME_BRANDS.find(x => x.id === id) || FRAME_BRANDS[0];
}

function getWheels(id) {
  return WHEEL_BRANDS.find(x => x.id === id) || WHEEL_BRANDS[0];
}

function getOrder(id) {
  return RIDER_ORDERS.find(o => o.id === id) || RIDER_ORDERS[1];
}

function getNutritionItem(id) {
  return NUTRITION_ITEMS.find(x => x.id === id);
}

function getFullTeamRiders(teamId) {
  return Game.riders.filter(r => r.teamId === teamId);
}

function getRaceRosterIds(teamId) {
  if (Game.raceRosters[teamId]) return Game.raceRosters[teamId];
  return autoSelectRoster(teamId, getRace()).map(r => r.id);
}

function getTeamRiders(teamId, includeAbandoned = false) {
  const ids = getRaceRosterIds(teamId);
  return Game.riders.filter(r => ids.includes(r.id) && (includeAbandoned || !r.abandoned));
}

function getRaceRiders(includeAbandoned = false) {
  return TEAMS.flatMap(t => getTeamRiders(t.id, includeAbandoned));
}

function isTTT(stage = getStage()) {
  return stage.type === "ttt";
}

function roleKeys(group) {
  if (group === "leaders") return ["gc", "co"];
  if (group === "climbers") return ["climber", "puncheur"];
  if (group === "workers") return ["domestique", "rouleur", "tt"];
  if (group === "sprinters") return ["sprinter", "classics"];
  return [];
}

/* ============================================================
   INICIO / GUARDADO
   ============================================================ */

function init() {
  Game.mode = "single";
  Game.selectedRaceId = DEFAULT_RACE_ID;
  Game.selectedTeamId = null;
  Game.seasonIndex = 0;
  Game.betweenRaces = false;
  Game.seasonFinished = false;
  Game.raceHistory = [];
  Game.pendingRosterIds = [];
  Game.raceRosters = {};
  Game.lastRaceRosterIds = [];
  Game.rosterLocked = false;
  Game.currentStageIndex = 0;
  Game.activeTab = "director";
  Game.riders = deepClone(RIDERS);
  Game.riderOrders = {};
  Game.riderEfforts = {};
  Game.riderEquipment = {};
  Game.protectedRiderId = null;
  Game.nutritionMode = "auto_smart";
  Game.nutritionPlanId = "auto_balanced";
  Game.stock = {};
  Game.stageHistory = [];
  Game.lastStage = null;
  Game.live = null;
  Game.teamTimes = {};
  Game.finished = false;
  renderHome();
}

function saveGame(showToast = true) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(Game));
  if (showToast) toast("Partida guardada.");
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return toast("No hay guardado.");
  Object.assign(Game, JSON.parse(raw));
  render();
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
  toast("Guardado borrado.");
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

function render() {
  if (!Game.selectedTeamId) return renderHome();
  if (Game.seasonFinished) return renderSeasonFinal();
  if (Game.betweenRaces) return renderBetweenRaces();
  if (!Game.rosterLocked) return renderRosterSelection();
  if (Game.finished) return renderRaceFinal();
  if (Game.live) return renderLive();
  return renderRace();
}

/* ============================================================
   HOME
   ============================================================ */

function renderHome() {
  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Cycling Manager Tour</h1>
        <p>v0.11 · Modo temporada · carrera única · Race Director · nutrición · material · entrenamiento</p>
      </div>
      <div class="top-actions">
        <button class="secondary" onclick="loadGame()">Cargar</button>
        <button class="danger" onclick="clearSave()">Borrar guardado</button>
      </div>
    </div>

    <section class="panel">
      <h2>Modo de juego</h2>
      <div class="mode-grid">
        <button class="mode-card ${Game.mode === "single" ? "active" : ""}" onclick="setMode('single')">
          <strong>Carrera única</strong>
          <span>Escoge una carrera, selecciona equipo y disputa solo esa carrera.</span>
        </button>
        <button class="mode-card ${Game.mode === "season" ? "active" : ""}" onclick="setMode('season')">
          <strong>Temporada</strong>
          <span>Calendario completo, selección de 8 corredores antes de cada carrera y entrenamiento entre carreras.</span>
        </button>
      </div>
    </section>

    ${Game.mode === "single" ? renderRaceSelector() : renderSeasonPreview()}

    <section class="panel" style="margin-top:16px;">
      <h2>Elige equipo</h2>
      <div class="grid teams">
        ${TEAMS.map(renderTeamCard).join("")}
      </div>
    </section>
  `;
}

function setMode(mode) {
  Game.mode = mode;
  if (mode === "season") {
    Game.selectedRaceId = Game.seasonRaceIds[0];
  }
  renderHome();
}

function renderRaceSelector() {
  return `
    <section class="panel" style="margin-top:16px;">
      <h2>Elige carrera</h2>
      <div class="race-grid">
        ${RACES.map(r => `
          <button class="race-card ${Game.selectedRaceId === r.id ? "active" : ""}" onclick="Game.selectedRaceId='${r.id}'; renderHome();">
            <span class="race-title">${esc(r.name)}</span>
            <span class="badge ${r.jerseyClass}">${esc(r.jersey)}</span>
            <span class="muted small">${r.stages.length} etapa${r.stages.length > 1 ? "s" : ""} · ${esc(r.country)}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSeasonPreview() {
  return `
    <section class="panel" style="margin-top:16px;">
      <h2>Calendario de temporada</h2>
      <div class="season-calendar">
        ${Game.seasonRaceIds.map((id, index) => {
          const race = RACES.find(r => r.id === id);
          return `
            <div class="calendar-card ${index === 0 ? "active" : ""}">
              <span class="badge ${race.jerseyClass}">${index + 1}</span>
              <strong>${esc(race.name)}</strong>
              <small>${race.stages.length} etapa${race.stages.length > 1 ? "s" : ""} · ${esc(race.country)}</small>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderTeamCard(team) {
  const riders = RIDERS.filter(r => r.teamId === team.id).sort((a, b) => b.base - a.base);
  return `
    <div class="team-card" style="--team-primary:${team.visual.primary};--team-secondary:${team.visual.secondary};--team-accent:${team.visual.accent};">
      ${render3DJersey(team)}
      <div class="badge-row">
        <span class="badge green">${team.level}</span>
        <span class="badge">${esc(team.archetype)}</span>
        <span class="badge blue">${riders.length} corredores</span>
      </div>
      <h3>${esc(team.name)}</h3>
      <p class="muted small">${esc(team.country)} · ${esc(getFrame(team.material.frame).name)} · ${esc(getWheels(team.material.wheels).name)}</p>
      <div class="chip-row">
        ${riders.slice(0, 5).map(r => `<span class="chip">${esc(r.name)}</span>`).join("")}
      </div>
      <button onclick="selectTeam('${team.id}')">Seleccionar equipo</button>
    </div>
  `;
}

function render3DJersey(team) {
  return `
    <div class="jersey-card">
      <div class="jersey-3d">
        <div class="jersey-sleeve left"></div>
        <div class="jersey-body">
          <div class="jersey-neck"></div>
          <div class="stripe stripe-a"></div>
          <div class="stripe stripe-b"></div>
          <span>${esc(team.visual.logoText)}</span>
          <small>${esc(team.name)}</small>
        </div>
        <div class="jersey-sleeve right"></div>
      </div>
    </div>
  `;
}

function selectTeam(teamId) {
  Game.selectedTeamId = teamId;
  Game.riders = deepClone(RIDERS);

  if (Game.mode === "season") {
    Game.seasonIndex = 0;
    Game.selectedRaceId = Game.seasonRaceIds[0];
    Game.raceHistory = [];
    Game.seasonFinished = false;
  }

  prepareRosterSelection();
}

/* ============================================================
   SELECCIÓN DE ROSTER
   ============================================================ */

function prepareRosterSelection() {
  Game.pendingRosterIds = autoSelectRoster(Game.selectedTeamId, getRace()).map(r => r.id);
  Game.raceRosters = {};
  Game.rosterLocked = false;
  Game.betweenRaces = false;
  Game.finished = false;
  renderRosterSelection();
}

function autoSelectRoster(teamId, race) {
  const riders = getFullTeamRiders(teamId);

  const weights = {
    flat: race.stages.filter(s => s.type === "flat").length,
    mountain: race.stages.filter(s => s.type === "mountain").length,
    hilly: race.stages.filter(s => s.type === "hilly").length,
    cobbles: race.stages.filter(s => s.type === "cobbles").length,
    tt: race.stages.filter(s => s.type === "tt").length,
    ttt: race.stages.filter(s => s.type === "ttt").length
  };

  return riders
    .map(r => {
      const s = r.stats;
      const score =
        r.base * 0.55 +
        s.mountain * weights.mountain * 0.85 +
        s.hills * weights.hilly * 0.75 +
        s.cobbles * weights.cobbles * 0.85 +
        s.sprint * weights.flat * 0.35 +
        s.flat * weights.flat * 0.35 +
        s.tt * weights.tt * 0.90 +
        s.ttt * weights.ttt * 0.90 +
        s.stamina * 0.32 +
        s.recovery * 0.32 +
        r.form * 0.25 -
        r.fatigue * 0.35 +
        (["gc", "co"].includes(r.roleKey) && race.type === "grand_tour" ? 25 : 0) +
        (r.roleKey === "sprinter" && weights.flat >= 4 ? 18 : 0) +
        (r.roleKey === "classics" && weights.cobbles ? 22 : 0);
      return { r, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, ROSTER_SIZE)
    .map(x => x.r);
}

function toggleRoster(id) {
  if (Game.rosterLocked) return;

  if (Game.pendingRosterIds.includes(id)) {
    Game.pendingRosterIds = Game.pendingRosterIds.filter(x => x !== id);
  } else {
    if (Game.pendingRosterIds.length >= ROSTER_SIZE) return toast(`Máximo ${ROSTER_SIZE} corredores.`);
    Game.pendingRosterIds.push(id);
  }

  renderRosterSelection();
}

function confirmRoster() {
  if (Game.pendingRosterIds.length !== ROSTER_SIZE) {
    return toast(`Debes escoger exactamente ${ROSTER_SIZE} corredores.`);
  }

  Game.raceRosters = {};
  TEAMS.forEach(team => {
    Game.raceRosters[team.id] = autoSelectRoster(team.id, getRace()).map(r => r.id);
  });

  Game.raceRosters[Game.selectedTeamId] = [...Game.pendingRosterIds];
  Game.lastRaceRosterIds = [...Game.pendingRosterIds];

  resetRaceState();
  Game.rosterLocked = true;
  saveGame(false);
  renderRace();
}

function renderRosterSelection() {
  const race = getRace();
  const team = getTeam(Game.selectedTeamId);
  const riders = getFullTeamRiders(Game.selectedTeamId).slice().sort((a, b) => b.base - a.base);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Selecciona tus ${ROSTER_SIZE} corredores</h1>
        <p>${esc(team.name)} · ${esc(race.name)} · La selección queda bloqueada durante toda la carrera.</p>
      </div>
      <div class="top-actions">
        <button class="secondary" onclick="Game.selectedTeamId=null; renderHome();">Volver</button>
        <button onclick="confirmRoster()">Confirmar selección</button>
      </div>
    </div>

    <section class="panel sticky-panel">
      <div class="roster-summary">
        <div>
          <strong>${Game.pendingRosterIds.length}/${ROSTER_SIZE} seleccionados</strong>
          <p class="muted small">Escoge líderes, gregarios, crono, sprint y montaña según el recorrido.</p>
        </div>
        <div class="chip-row">
          ${Game.pendingRosterIds.map(id => `<span class="chip selected">${esc(getRider(id).name)}</span>`).join("")}
        </div>
      </div>
    </section>

    <section class="panel" style="margin-top:16px;">
      <h2>Plantilla completa</h2>
      <div class="roster-grid">
        ${riders.map(renderRosterCard).join("")}
      </div>
    </section>
  `;
}

function renderRosterCard(r) {
  const selected = Game.pendingRosterIds.includes(r.id);
  return `
    <button class="roster-card ${selected ? "selected" : ""}" onclick="toggleRoster('${r.id}')">
      <div class="badge-row">
        <span class="badge green">${esc(r.role)}</span>
        <span class="badge blue">Base ${r.base}</span>
        <span class="badge orange">Forma ${Math.round(r.form)}</span>
        <span class="badge">Fat. ${Math.round(r.fatigue)}</span>
      </div>
      <h3>${esc(r.name)}</h3>
      <p class="muted small">${esc(r.nationality)} · ${r.age} años</p>
      <div class="mini-stats">
        <span>⛰ ${r.stats.mountain}</span>
        <span>⚡ ${r.stats.sprint}</span>
        <span>⏱ ${r.stats.tt}</span>
        <span>🪨 ${r.stats.cobbles}</span>
        <span>🫀 ${r.stats.stamina}</span>
      </div>
    </button>
  `;
}

/* ============================================================
   RESET CARRERA
   ============================================================ */

function resetRaceState() {
  Game.currentStageIndex = 0;
  Game.activeTab = "director";
  Game.stageHistory = [];
  Game.lastStage = null;
  Game.live = null;
  Game.finished = false;
  Game.teamTimes = Object.fromEntries(TEAMS.map(t => [t.id, 0]));

  Game.riders.forEach(r => {
    r.totalTime = 0;
    r.points = 0;
    r.mountainPoints = 0;
    r.stageWins = 0;
    r.abandoned = false;
  });

  Game.riderOrders = {};
  Game.riderEfforts = {};
  Game.riderEquipment = {};

  getRaceRiders(true).forEach(r => {
    Game.riderOrders[r.id] = r.defaultOrder;
    Game.riderEfforts[r.id] = r.defaultEffort;
    Game.riderEquipment[r.id] = autoEquipmentForStage(r.teamId, getStage());
  });

  const plan = NUTRITION_PLANS.find(p => p.id === Game.nutritionPlanId) || NUTRITION_PLANS[0];
  Game.stock = deepClone(plan.stock);

  Game.protectedRiderId = getTeamRiders(Game.selectedTeamId, true)[0]?.id || null;
}

/* ============================================================
   RACE SCREEN
   ============================================================ */

function setTab(tab) {
  Game.activeTab = tab;
  renderRace();
}

function renderRace() {
  const race = getRace();
  const stage = getStage();
  const team = getTeam(Game.selectedTeamId);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>${esc(team.name)}</h1>
        <p>${Game.mode === "season" ? `Temporada · Carrera ${Game.seasonIndex + 1}/${Game.seasonRaceIds.length} · ` : ""}${esc(race.name)} · Etapa ${Game.currentStageIndex + 1}/${getStages().length}</p>
      </div>
      <div class="top-actions">
        <button class="secondary" onclick="saveGame()">Guardar</button>
        <button class="danger" onclick="init()">Reiniciar</button>
      </div>
    </div>

    ${renderLeaderStrip()}

    <div class="tabs">
      ${[
        ["director", "Race Director"],
        ["strategy", "Estrategia"],
        ["nutrition", "Alimentación"],
        ["material", "Material"],
        ["team", "Equipo"],
        ["class", "Clasificaciones"],
        ["history", "Historial"]
      ].map(([id, label]) => `<button class="tab ${Game.activeTab === id ? "active" : ""}" onclick="setTab('${id}')">${label}</button>`).join("")}
    </div>

    ${Game.activeTab === "director" ? renderDirectorTab() : ""}
    ${Game.activeTab === "strategy" ? renderStrategyTab(false) : ""}
    ${Game.activeTab === "nutrition" ? renderNutritionTab() : ""}
    ${Game.activeTab === "material" ? renderMaterialTab() : ""}
    ${Game.activeTab === "team" ? renderTeamTab() : ""}
    ${Game.activeTab === "class" ? renderClassTab() : ""}
    ${Game.activeTab === "history" ? renderHistoryTab() : ""}
  `;
}

function renderLeaderStrip() {
  const gc = getGC();
  const leader = gc[0];
  const race = getRace();

  return `
    <section class="leader-strip">
      <div class="leader-card ${race.jerseyClass}">
        <span>${esc(race.jersey)}</span>
        <strong>${leader ? esc(leader.name) : "—"}</strong>
        <small>${leader ? sec(leader.totalTime) : "Sin disputar"}</small>
      </div>
      <div class="leader-card jersey-green"><span>Puntos</span><strong>${getPoints()[0]?.name || "—"}</strong><small>${getPoints()[0]?.points || 0} pts</small></div>
      <div class="leader-card jersey-polka"><span>Montaña</span><strong>${getMountain()[0]?.name || "—"}</strong><small>${getMountain()[0]?.mountainPoints || 0} pts</small></div>
      <div class="leader-card jersey-white"><span>Joven</span><strong>${getYouth()[0]?.name || "—"}</strong><small>${getYouth()[0] ? sec(getYouth()[0].totalTime) : "—"}</small></div>
      <div class="leader-card jersey-blue"><span>Equipos</span><strong>${getTeamsClass()[0]?.team.name || "—"}</strong><small>${getTeamsClass()[0] ? sec(getTeamsClass()[0].time) : "—"}</small></div>
    </section>
  `;
}

/* ============================================================
   DIRECTOR / ESTRATEGIA
   ============================================================ */

function renderDirectorTab() {
  const stage = getStage();

  return `
    <div class="grid director">
      <section class="panel">
        ${renderActionBar(false)}
        ${renderStageProfile(stage)}
        ${renderTacticalAdvice(stage)}
        ${renderVisualLanesPreview()}
      </section>
      <section class="panel">
        ${renderStrategyTab(false, true)}
      </section>
    </div>
  `;
}

function renderActionBar(live) {
  const stage = getStage();
  const sector = live ? stage.sectors[Game.live.sectorIndex] : null;

  return `
    <div class="actionbar ${live ? "live" : ""}">
      <div>
        <strong>${live ? `Sector ${Game.live.sectorIndex + 1}/${stage.sectors.length} · ${sector.name}` : "Salida de etapa"}</strong>
        <p>${live ? `Km ${sector.from}-${sector.to} · ${sector.question}` : "Simula rápido o juega la etapa sector a sector con Race Director."}</p>
        ${live ? `<div class="bar"><div style="width:${Math.round((sector.from / stage.distance) * 100)}%"></div></div>` : ""}
      </div>
      <div class="actionbar-buttons">
        ${live ? `
          <button onclick="simulateSector()">Simular sector</button>
          <button class="secondary" onclick="renderLive()">Actualizar vista</button>
        ` : `
          <button class="secondary" onclick="simulateFullStageQuick()">Simular etapa rápida</button>
          <button onclick="startLiveStage()">Iniciar por sectores</button>
        `}
      </div>
    </div>
  `;
}

function renderStrategyTab(live = false, embedded = false) {
  return `
    ${embedded ? "" : `<section class="panel">`}
      ${renderProtectedSelector(live)}
      ${renderSmartPresets(live)}
      ${renderQuickControls(live)}
      ${renderIndividualControls(live)}
    ${embedded ? "" : `</section>`}
  `;
}

function renderProtectedSelector(live) {
  const riders = getTeamRiders(Game.selectedTeamId, true);

  return `
    <h2>Líder protegido</h2>
    <select onchange="Game.protectedRiderId=this.value; ${live ? "renderLive()" : "renderRace()"};">
      ${riders.map(r => `<option value="${r.id}" ${Game.protectedRiderId === r.id ? "selected" : ""}>${esc(r.name)} · ${esc(r.role)}</option>`).join("")}
    </select>
  `;
}

function renderSmartPresets(live) {
  return `
    <h2>Presets inteligentes</h2>
    <div class="preset-row">
      ${SMART_PRESETS.map(p => `<button class="secondary" onclick="applySmartPreset('${p.id}', ${live})">${esc(p.name)}</button>`).join("")}
    </div>
  `;
}

function applySmartPreset(id, live) {
  const riders = getTeamRiders(Game.selectedTeamId);

  riders.forEach(r => {
    if (id === "protect_gc") {
      Game.riderOrders[r.id] =
        r.id === Game.protectedRiderId ? "hold" :
        ["domestique", "rouleur", "tt"].includes(r.roleKey) ? "protect" :
        "sit";
      Game.riderEfforts[r.id] = r.id === Game.protectedRiderId ? 68 : ["domestique", "rouleur", "tt"].includes(r.roleKey) ? 74 : 52;
    }

    if (id === "sprint") {
      Game.riderOrders[r.id] =
        r.roleKey === "sprinter" ? "sit" :
        ["rouleur", "classics", "tt"].includes(r.roleKey) ? "sprint_train" :
        "hold";
      Game.riderEfforts[r.id] = r.roleKey === "sprinter" ? 55 : ["rouleur", "classics", "tt"].includes(r.roleKey) ? 82 : 62;
    }

    if (id === "breakaway") {
      Game.riderOrders[r.id] =
        ["puncheur", "rouleur", "climber", "classics"].includes(r.roleKey) && r.id !== Game.protectedRiderId ? "attack" : "sit";
      Game.riderEfforts[r.id] = ["puncheur", "rouleur", "climber", "classics"].includes(r.roleKey) && r.id !== Game.protectedRiderId ? 86 : 50;
    }

    if (id === "mountain_attack") {
      Game.riderOrders[r.id] =
        r.id === Game.protectedRiderId ? "attack" :
        ["climber", "puncheur"].includes(r.roleKey) ? "tempo" :
        ["domestique", "rouleur"].includes(r.roleKey) ? "protect" :
        "sit";
      Game.riderEfforts[r.id] = r.id === Game.protectedRiderId ? 86 : ["climber", "puncheur"].includes(r.roleKey) ? 82 : 62;
    }

    if (id === "survival") {
      Game.riderOrders[r.id] = r.id === Game.protectedRiderId ? "protect" : "sit";
      Game.riderEfforts[r.id] = 45;
    }

    if (id === "time_trial") {
      Game.riderOrders[r.id] = ["tt", "rouleur", "gc", "co"].includes(r.roleKey) ? "pull" : "hold";
      Game.riderEfforts[r.id] = ["tt", "rouleur", "gc", "co"].includes(r.roleKey) ? 88 : 70;
    }
  });

  if (live && Game.live) addRadio(`Preset aplicado: ${SMART_PRESETS.find(p => p.id === id).name}`);
  live ? renderLive() : renderRace();
}

function getRoleEffort(group, fallback) {
  const keys = roleKeys(group);
  const riders = getTeamRiders(Game.selectedTeamId).filter(r => keys.includes(r.roleKey));
  if (!riders.length) return fallback;
  return Math.round(avg(riders.map(r => Game.riderEfforts[r.id] ?? r.defaultEffort ?? fallback)));
}

function previewRoleEffort(group, value, live) {
  const el = document.getElementById(`${live ? "live_" : ""}role_${group}`);
  if (el) el.textContent = `${value}%`;
}

function commitRoleEffort(group, value, live) {
  const keys = roleKeys(group);
  getTeamRiders(Game.selectedTeamId).forEach(r => {
    if (keys.includes(r.roleKey)) Game.riderEfforts[r.id] = Number(value);
  });

  if (live && Game.live) addRadio(`${roleLabel(group)} ajustados a ${value}% de esfuerzo.`);
  live ? renderLive() : renderRace();
}

function roleLabel(group) {
  return { leaders: "Líderes", climbers: "Escaladores", workers: "Gregarios", sprinters: "Sprinters" }[group] || "Corredores";
}

function renderQuickControls(live) {
  const groups = [
    ["leaders", "Líderes GC", 68],
    ["climbers", "Escaladores / puncheurs", 66],
    ["workers", "Gregarios / rodadores", 72],
    ["sprinters", "Sprinters / clasicómanos", 55]
  ];

  return `
    <h2>Control rápido por rol</h2>
    <div class="quick-grid">
      ${groups.map(([id, label, fallback]) => {
        const value = getRoleEffort(id, fallback);
        return `
          <div class="role-card">
            <strong>${esc(label)}</strong>
            <input type="range" min="20" max="100" value="${value}"
              oninput="previewRoleEffort('${id}', this.value, ${live})"
              onchange="commitRoleEffort('${id}', this.value, ${live})">
            <span id="${live ? "live_" : ""}role_${id}">${value}%</span>
          </div>
        `;
      }).join("")}
    </div>
    <div class="preset-row">
      <button class="secondary" onclick="setRoleOrder('workers','pull',${live})">Gregarios tiran</button>
      <button class="secondary" onclick="setRoleOrder('workers','catch',${live})">Gregarios cazan fuga</button>
      <button class="secondary" onclick="setRoleOrder('climbers','tempo',${live})">Escaladores tempo</button>
      <button class="secondary" onclick="setRoleOrder('leaders','attack',${live})">Líderes atacan</button>
    </div>
  `;
}

function setRoleOrder(group, order, live) {
  const keys = roleKeys(group);
  getTeamRiders(Game.selectedTeamId).forEach(r => {
    if (keys.includes(r.roleKey)) Game.riderOrders[r.id] = order;
  });

  if (live && Game.live) addRadio(`${roleLabel(group)}: ${getOrder(order).name}`);
  live ? renderLive() : renderRace();
}

function renderIndividualControls(live) {
  return `
    <h2>Órdenes y esfuerzo por corredor</h2>
    <div class="strategy-list">
      ${getTeamRiders(Game.selectedTeamId).map(r => renderRiderControl(r, live)).join("")}
    </div>
  `;
}

function renderRiderControl(r, live) {
  const effort = Game.riderEfforts[r.id] ?? r.defaultEffort;
  const order = Game.riderOrders[r.id] ?? r.defaultOrder;
  const st = live && Game.live ? Game.live.states[r.id] : null;

  return `
    <div class="rider-control ${Game.protectedRiderId === r.id ? "protected" : ""}">
      <div class="badge-row">
        <span class="badge green">${esc(r.role)}</span>
        <span class="badge blue">Forma ${Math.round(r.form)}</span>
        <span class="badge orange">Fatiga ${Math.round(r.fatigue)}</span>
        ${st ? `<span class="badge">E ${Math.round(st.energy)}</span><span class="badge">${esc(st.group)}</span>` : ""}
        ${Game.protectedRiderId === r.id ? `<span class="badge jersey-yellow">Protegido</span>` : ""}
      </div>
      <h3>${esc(r.name)}</h3>
      <label>Orden</label>
      <select onchange="Game.riderOrders['${r.id}']=this.value; ${live ? "renderLive()" : "renderRace()"};">
        ${RIDER_ORDERS.map(o => `<option value="${o.id}" ${order === o.id ? "selected" : ""}>${esc(o.name)}</option>`).join("")}
      </select>
      <label>Esfuerzo: <strong id="eff_${r.id}">${effort}%</strong></label>
      <input type="range" min="20" max="100" value="${effort}"
        oninput="document.getElementById('eff_${r.id}').textContent=this.value+'%'"
        onchange="Game.riderEfforts['${r.id}']=Number(this.value); ${live ? "renderLive()" : "renderRace()"};">
      <p class="muted small">${esc(getOrder(order).desc)}</p>
    </div>
  `;
}

/* ============================================================
   PERFIL / CONSEJO
   ============================================================ */

function renderStageProfile(stage, groups = []) {
  const width = 1000;
  const height = 270;
  const pad = 32;
  const points = buildProfilePoints(stage);
  const maxAlt = Math.max(...points.map(p => p.alt), 1000);
  const minAlt = Math.min(...points.map(p => p.alt), 0);

  const path = points.map((p, i) => {
    const x = pad + (p.km / stage.distance) * (width - pad * 2);
    const y = height - 45 - ((p.alt - minAlt) / Math.max(1, maxAlt - minAlt)) * (height - 85);
    return `${i ? "L" : "M"}${x},${y}`;
  }).join(" ");

  const terrain = stage.sectors.map(s => {
    const x = pad + (s.from / stage.distance) * (width - pad * 2);
    const w = Math.max(3, ((s.to - s.from) / stage.distance) * (width - pad * 2));
    return `<rect x="${x}" y="${height - 30}" width="${w}" height="12" class="terrain ${s.type}"></rect>`;
  }).join("");

  const climbs = stage.climbs.map(c => {
    const x = pad + (c.km / stage.distance) * (width - pad * 2);
    return `<g><line x1="${x}" y1="70" x2="${x}" y2="${height - 45}" class="climb-line"/><circle cx="${x}" cy="64" r="6" class="climb-dot"/><text x="${x + 8}" y="68" class="svg-label">${esc(c.category)} ${esc(c.name)} · ${c.length} km ${c.gradient}%</text></g>`;
  }).join("");

  const paves = stage.paves.map(p => {
    const x = pad + (p.from / stage.distance) * (width - pad * 2);
    return `<text x="${x}" y="32" class="svg-icon">🪨 ${esc(p.name)}</text>`;
  }).join("");

  const groupMarks = groups.map((g, i) => {
    const x = pad + (g.km / stage.distance) * (width - pad * 2);
    const y = 95 + i * 22;
    return `<g><circle cx="${x}" cy="${y}" r="9" class="group-dot ${g.cls}"/><text x="${x+13}" y="${y+4}" class="svg-label">${esc(g.label)} · ${g.count}</text></g>`;
  }).join("");

  return `
    <div class="stage-profile-card">
      <div class="stage-title-row">
        <div>
          <h2>${esc(stage.name)}</h2>
          <p>${esc(stage.label)} · ${stage.distance} km · Dificultad ${stage.difficulty} · ${stage.elevation} m+</p>
        </div>
        <div class="badge-row">
          <span class="badge">🌡 ${stage.heat}</span>
          <span class="badge">💨 ${stage.wind}</span>
          <span class="badge">🌧 ${stage.rain}%</span>
        </div>
      </div>
      <div class="profile-svg">
        <svg viewBox="0 0 ${width} ${height}">
          <path d="${path} L${width-pad},${height-45} L${pad},${height-45} Z" class="profile-area"></path>
          <path d="${path}" class="profile-line"></path>
          ${terrain}
          ${climbs}
          ${paves}
          ${groupMarks}
        </svg>
      </div>
      <div class="legend">
        <span><b class="terrain flat"></b> Llano</span>
        <span><b class="terrain climb"></b> Subida</span>
        <span><b class="terrain hilly"></b> Media montaña</span>
        <span><b class="terrain cobbles"></b> Pavé</span>
        <span><b class="terrain wall"></b> Muro</span>
        <span><b class="terrain final"></b> Final</span>
      </div>
      <div class="sector-grid">
        ${stage.sectors.map((s, i) => `<div class="sector-card"><strong>${i + 1}. ${esc(s.name)}</strong><span>km ${s.from}-${s.to}</span><small>${esc(s.question)}</small></div>`).join("")}
      </div>
    </div>
  `;
}

function buildProfilePoints(stage) {
  const pts = [{ km: 0, alt: 120 }];
  let alt = 120;

  stage.climbs.slice().sort((a, b) => a.km - b.km).forEach(c => {
    const start = Math.max(0, c.km - c.length);
    pts.push({ km: Math.max(0, start - 8), alt: Math.max(80, alt - 80) });
    pts.push({ km: start, alt });
    alt = c.altitude || alt + c.length * c.gradient * 10;
    pts.push({ km: c.km, alt });
    alt = Math.max(120, alt - c.length * c.gradient * 4);
  });

  pts.push({ km: stage.distance, alt: stage.finalClimb ? alt : Math.max(100, alt - 100) });
  return pts.sort((a, b) => a.km - b.km);
}

function renderTacticalAdvice(stage) {
  let level = "low", icon = "📡", title = "Carrera controlable", text = "Mantén líder protegido, controla fugas y conserva energía.";

  if (stage.type === "mountain") {
    level = "high"; icon = "⛰️"; title = "Etapa de montaña"; text = "Guarda gregarios para el último puerto. Usa gel antes de los sectores duros.";
  }

  if (stage.type === "cobbles") {
    level = "high"; icon = "🪨"; title = "Pavé y muros"; text = "Rueda delante, protege al líder y evita ataques prematuros.";
  }

  if (stage.type === "flat" && stage.wind > 60) {
    level = "medium"; icon = "💨"; title = "Riesgo de abanicos"; text = "Coloca al líder delante y sube esfuerzo de gregarios.";
  }

  if (stage.type === "ttt") {
    level = "medium"; icon = "⏱️"; title = "Crono por equipos"; text = "El bloque debe permanecer unido. Mínimo 4 corredores marcan el tiempo.";
  }

  return `
    <div class="advice ${level}">
      <span>${icon}</span>
      <div>
        <strong>${title}</strong>
        <p>${text}</p>
      </div>
    </div>
  `;
}

function renderVisualLanesPreview() {
  return `
    <div class="tv-lanes">
      ${["Fuga", "Ataque", "Grupo favoritos", "Pelotón", "Grupo 2", "Cortados"].map((x, i) => `
        <div class="lane lane-${i}">
          <strong>${x}</strong>
          <span>${i === 3 ? "Tu equipo empezará aquí salvo ataques, fugas o cronos." : "—"}</span>
        </div>
      `).join("")}
    </div>
  `;
}

/* ============================================================
   NUTRICIÓN TAB
   ============================================================ */

function renderNutritionTab() {
  const plan = NUTRITION_PLANS.find(p => p.id === Game.nutritionPlanId) || NUTRITION_PLANS[0];

  return `
    <section class="panel">
      <h2>Alimentación</h2>
      <p class="muted">Configura stock y modo de alimentación antes de salir. Durante etapa también puedes dar comida manualmente.</p>

      <h3>Modo automático</h3>
      <div class="race-grid">
        ${AUTO_NUTRITION_MODES.map(m => `
          <button class="race-card ${Game.nutritionMode === m.id ? "active" : ""}" onclick="Game.nutritionMode='${m.id}'; renderRace();">
            <span class="race-title">${esc(m.name)}</span>
            <span class="muted small">${esc(m.description)}</span>
          </button>
        `).join("")}
      </div>

      <h3>Plan de stock</h3>
      <div class="preset-row">
        ${NUTRITION_PLANS.map(p => `<button class="secondary" onclick="setNutritionPlan('${p.id}')">${esc(p.name)}</button>`).join("")}
      </div>

      <div class="nutrition-stock">
        ${Object.entries(Game.stock && Object.keys(Game.stock).length ? Game.stock : plan.stock).map(([id, amount]) => {
          const item = getNutritionItem(id);
          return `
            <div class="nutrition-card">
              <strong>${esc(item ? item.name : id)}</strong>
              <span>${amount} unidades</span>
              <small>${item ? esc(item.description) : ""}</small>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function setNutritionPlan(id) {
  const plan = NUTRITION_PLANS.find(p => p.id === id) || NUTRITION_PLANS[0];
  Game.nutritionPlanId = id;
  Game.stock = deepClone(plan.stock);
  renderRace();
}

/* ============================================================
   MATERIAL
   ============================================================ */

function autoEquipmentForStage(teamId, stage) {
  const team = getTeam(teamId);

  let frameType = "aero";
  let wheelType = "deep";

  if (stage.type === "mountain") { frameType = "light"; wheelType = "light"; }
  if (stage.type === "hilly") { frameType = "light"; wheelType = "mid"; }
  if (stage.type === "cobbles") { frameType = "endurance"; wheelType = "cobbles"; }
  if (stage.type === "tt" || stage.type === "ttt") { frameType = "tt"; wheelType = "disc"; }
  if (stage.wind > 65 || stage.rain > 45) { frameType = "endurance"; wheelType = "mid"; }

  return { frame: team.material.frame, wheels: team.material.wheels, frameType, wheelType };
}

function renderMaterialTab() {
  const stage = getStage();

  return `
    <section class="panel">
      <h2>Material</h2>
      <p class="muted">Elige cuadro y ruedas por corredor. Los porcentajes son relativos al mejor material del simulador.</p>
      <div class="preset-row">
        ${EQUIPMENT_PRESETS.map(p => `<button class="secondary" onclick="applyEquipmentPreset('${p.id}')">${esc(p.name)}</button>`).join("")}
      </div>
      <div class="material-grid">
        ${getTeamRiders(Game.selectedTeamId).map(r => renderMaterialCard(r, stage)).join("")}
      </div>
    </section>
  `;
}

function applyEquipmentPreset(id) {
  const stage = getStage();

  getTeamRiders(Game.selectedTeamId).forEach(r => {
    const base = autoEquipmentForStage(r.teamId, stage);
    const preset = EQUIPMENT_PRESETS.find(p => p.id === id) || EQUIPMENT_PRESETS[0];

    Game.riderEquipment[r.id] = {
      ...base,
      frameType: preset.frameType === "auto" ? base.frameType : preset.frameType,
      wheelType: preset.wheelType === "auto" ? base.wheelType : preset.wheelType
    };
  });

  renderRace();
}

function materialScore(r, stage, sector = null) {
  const eq = Game.riderEquipment[r.id] || autoEquipmentForStage(r.teamId, stage);
  const f = getFrame(eq.frame);
  const w = getWheels(eq.wheels);

  const terrain =
    sector?.type === "climb" || stage.type === "mountain" ? "mountain" :
    sector?.type === "cobbles" || stage.type === "cobbles" ? "cobbles" :
    stage.type === "tt" || stage.type === "ttt" ? "tt" :
    stage.type === "flat" ? "flat" :
    "hilly";

  let score = 90;

  if (terrain === "flat") score = f.aero * 0.36 + w.aero * 0.36 + f.stiffness * 0.14 + w.crosswind * 0.14;
  if (terrain === "mountain") score = f.weight * 0.38 + w.weight * 0.28 + f.stiffness * 0.16 + f.handling * 0.18;
  if (terrain === "cobbles") score = f.comfort * 0.28 + w.cobbles * 0.30 + f.handling * 0.18 + f.reliability * 0.12 + w.reliability * 0.12;
  if (terrain === "tt") score = f.tt * 0.40 + w.tt * 0.36 + f.aero * 0.12 + w.aero * 0.12;
  if (terrain === "hilly") score = f.weight * 0.24 + f.handling * 0.22 + f.stiffness * 0.18 + w.weight * 0.18 + w.aero * 0.18;

  return clamp(Math.round(score), 65, 103);
}

function renderMaterialCard(r, stage) {
  const eq = Game.riderEquipment[r.id] || autoEquipmentForStage(r.teamId, stage);

  return `
    <div class="material-card">
      <h3>${esc(r.name)}</h3>
      <div class="bike-visual">
        <div class="bike-frame"></div>
        <div class="wheel w1"></div>
        <div class="wheel w2"></div>
      </div>
      <div class="badge-row">
        <span class="badge blue">Score ${materialScore(r, stage)}%</span>
        <span class="badge">${esc(getFrame(eq.frame).name)}</span>
        <span class="badge">${esc(getWheels(eq.wheels).name)}</span>
      </div>
      <label>Cuadro</label>
      <select onchange="Game.riderEquipment['${r.id}']={...Game.riderEquipment['${r.id}'], frame:this.value}; renderRace();">
        ${FRAME_BRANDS.map(f => `<option value="${f.id}" ${eq.frame === f.id ? "selected" : ""}>${esc(f.name)} · Aero ${f.aero}% · Peso ${f.weight}%</option>`).join("")}
      </select>
      <label>Ruedas</label>
      <select onchange="Game.riderEquipment['${r.id}']={...Game.riderEquipment['${r.id}'], wheels:this.value}; renderRace();">
        ${WHEEL_BRANDS.map(w => `<option value="${w.id}" ${eq.wheels === w.id ? "selected" : ""}>${esc(w.name)} · Aero ${w.aero}% · Peso ${w.weight}%</option>`).join("")}
      </select>
    </div>
  `;
}

/* ============================================================
   LIVE STAGE
   ============================================================ */

function startLiveStage(renderNow = true) {
  const stage = getStage();

  Game.live = {
    sectorIndex: 0,
    states: {},
    radio: [],
    breakGap: stage.type === "tt" || stage.type === "ttt" ? 0 : Math.round(rnd(70, 190))
  };

  getRaceRiders().forEach(r => {
    Game.live.states[r.id] = {
      time: 0,
      energy: clamp(100 - r.fatigue * 0.4, 8, 100),
      hydration: 100,
      stomach: 0,
      finalBonus: 0,
      group: isTTT(stage) ? `CRE ${getTeam(r.teamId).name}` : "Pelotón",
      groupId: isTTT(stage) ? `ttt_${r.teamId}` : "peloton",
      fatigueGain: 0,
      incident: null
    };
  });

  if (!isTTT(stage) && stage.type !== "tt") {
    const breakaway = selectBreakaway(stage);
    breakaway.forEach(r => {
      Game.live.states[r.id].group = "Fuga";
      Game.live.states[r.id].groupId = "breakaway";
    });
    addRadio(`Salida: se forma una fuga de ${breakaway.length} corredores.`);
  }

  if (isTTT(stage)) addRadio("Salida CRE: cada equipo rueda en bloque. El tiempo lo marca el 4º corredor.");
  if (stage.type === "tt") addRadio("Salida CRI: esfuerzo individual contra el reloj.");

  if (renderNow) renderLive();
}

function addRadio(msg) {
  if (!Game.live) return;
  Game.live.radio.unshift({ msg, time: new Date().toLocaleTimeString() });
  Game.live.radio = Game.live.radio.slice(0, 16);
}

function selectBreakaway(stage) {
  return getRaceRiders()
    .map(r => {
      const order = Game.riderOrders[r.id] || r.defaultOrder;
      const score =
        (["puncheur", "climber", "rouleur", "classics"].includes(r.roleKey) ? 20 : 0) +
        (order === "attack" ? 24 : 0) +
        (r.stats.hills + r.stats.mountain + r.stats.stamina) / 12 +
        rnd(0, 25) -
        (["gc", "co"].includes(r.roleKey) ? 20 : 0);
      return { r, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.round(rnd(4, 8)))
    .map(x => x.r);
}

function renderLive() {
  const stage = getStage();
  const sector = stage.sectors[Game.live.sectorIndex];
  const groups = buildGroups();

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Race Director · ${esc(stage.name)}</h1>
        <p>Sector ${Game.live.sectorIndex + 1}/${stage.sectors.length} · km ${sector.from}-${sector.to}</p>
      </div>
      <div class="top-actions">
        <button class="secondary" onclick="saveGame()">Guardar</button>
      </div>
    </div>

    ${renderActionBar(true)}

    <section class="panel">
      ${renderStageProfile(stage, groups)}
      ${renderTVLanes(groups)}
    </section>

    <div class="grid live-grid" style="margin-top:16px;">
      <section class="panel">
        <h2>Decisión del sector</h2>
        <div class="sector-focus">
          <strong>${esc(sector.question)}</strong>
          <p>${esc(sector.name)} · Dificultad ${sector.difficulty}</p>
        </div>
        ${renderLiveRadar()}
        ${renderQuickControls(true)}
      </section>

      <section class="panel">
        <h2>Radio / TV</h2>
        <div class="radio-list">
          ${Game.live.radio.map(r => `<div class="radio"><span>${esc(r.time)}</span><p>${esc(r.msg)}</p></div>`).join("")}
        </div>
        <hr>
        <h2>Stock alimentación</h2>
        ${renderLiveStock()}
      </section>
    </div>

    <section class="panel" style="margin-top:16px;">
      <h2>Tu equipo</h2>
      ${renderEnergyHeatmap()}
      <div class="live-rider-grid">
        ${getTeamRiders(Game.selectedTeamId).map(renderLiveRiderCard).join("")}
      </div>
    </section>
  `;
}

function renderLiveStock() {
  return `
    <div class="nutrition-stock compact">
      ${Object.entries(Game.stock).map(([id, amount]) => {
        const item = getNutritionItem(id);
        return `<div class="nutrition-card"><strong>${esc(item ? item.name : id)}</strong><span>${amount}</span></div>`;
      }).join("")}
    </div>
  `;
}

function renderLiveRiderCard(r) {
  const st = Game.live.states[r.id];
  const effort = Game.riderEfforts[r.id] ?? r.defaultEffort;
  const order = Game.riderOrders[r.id] ?? r.defaultOrder;

  return `
    <div class="live-rider-card ${Game.protectedRiderId === r.id ? "protected" : ""}">
      <div class="badge-row">
        <span class="badge green">${esc(r.role)}</span>
        <span class="badge blue">${esc(st.group)}</span>
        <span class="badge orange">E ${Math.round(st.energy)}</span>
        <span class="badge">H ${Math.round(st.hydration)}</span>
      </div>
      <h3>${esc(r.name)}</h3>

      <label>Orden</label>
      <select onchange="Game.riderOrders['${r.id}']=this.value; renderLive();">
        ${RIDER_ORDERS.map(o => `<option value="${o.id}" ${order === o.id ? "selected" : ""}>${esc(o.name)}</option>`).join("")}
      </select>

      <label>Esfuerzo: <strong id="live_eff_${r.id}">${effort}%</strong></label>
      <input type="range" min="20" max="100" value="${effort}"
        oninput="document.getElementById('live_eff_${r.id}').textContent=this.value+'%'"
        onchange="Game.riderEfforts['${r.id}']=Number(this.value); renderLive();">

      <div class="nutrition-actions">
        ${NUTRITION_ITEMS.map(item => `<button class="secondary" onclick="useNutrition('${r.id}','${item.id}')">${esc(item.name)}</button>`).join("")}
      </div>
    </div>
  `;
}

function useNutrition(riderId, itemId) {
  if (!Game.live) return;
  if ((Game.stock[itemId] || 0) <= 0) return toast("Sin stock.");

  const item = getNutritionItem(itemId);
  const st = Game.live.states[riderId];

  Game.stock[itemId] -= 1;
  st.energy = clamp(st.energy + item.energy, 0, 115);
  st.hydration = clamp(st.hydration + item.hydration, 0, 120);
  st.stomach = clamp(st.stomach + item.stomach, 0, 100);
  st.finalBonus += item.finalBonus || 0;

  addRadio(`${getRider(riderId).name} toma ${item.name}.`);
  renderLive();
}

function autoFeed(sector) {
  if (Game.nutritionMode === "manual") return;

  getTeamRiders(Game.selectedTeamId).forEach(r => {
    const st = Game.live.states[r.id];
    if (!st) return;

    let itemId = null;

    if (st.hydration < 42 && (Game.stock.iso || 0) > 0) itemId = "iso";
    else if (st.hydration < 35 && (Game.stock.water || 0) > 0) itemId = "water";
    else if (sector.type === "final" && st.energy < 72 && (Game.stock.caf || 0) > 0) itemId = "caf";
    else if (["climb", "wall", "cobbles"].includes(sector.type) && st.energy < 62 && (Game.stock.gel || 0) > 0) itemId = "gel";
    else if (["flat", "hilly"].includes(sector.type) && st.energy < 66 && (Game.stock.rice || 0) > 0) itemId = "rice";
    else if (Game.nutritionMode === "auto_conservative" && st.energy < 74 && (Game.stock.bar || 0) > 0) itemId = "bar";

    if (!itemId) return;

    const item = getNutritionItem(itemId);
    Game.stock[itemId] -= 1;
    st.energy = clamp(st.energy + item.energy, 0, 115);
    st.hydration = clamp(st.hydration + item.hydration, 0, 120);
    st.stomach = clamp(st.stomach + item.stomach, 0, 100);
    st.finalBonus += item.finalBonus || 0;

    if (r.id === Game.protectedRiderId || st.energy < 40 || st.hydration < 40) {
      addRadio(`${r.name} toma ${item.name} automáticamente.`);
    }
  });
}

/* ============================================================
   SIMULACIÓN
   ============================================================ */

function simulateFullStageQuick() {
  startLiveStage(false);
  while (Game.live && Game.live.sectorIndex < getStage().sectors.length) {
    processSector(false);
  }
  renderStageResult();
}

function simulateSector() {
  processSector(true);
}

function processSector(renderNow) {
  const stage = getStage();
  const sector = stage.sectors[Game.live.sectorIndex];

  autoFeed(sector);

  if (isTTT(stage)) simulateTTTSector(stage, sector);
  else simulateRoadSector(stage, sector);

  Game.live.sectorIndex++;

  if (Game.live.sectorIndex >= stage.sectors.length) {
    finishStage(renderNow);
    return;
  }

  addRadio(`Entramos en ${stage.sectors[Game.live.sectorIndex].name}.`);
  if (renderNow) renderLive();
}

function baseSectorTime(stage, sector) {
  const d = sector.to - sector.from;
  const speed =
    sector.type === "flat" ? 44 :
    sector.type === "hilly" ? 38 :
    sector.type === "climb" ? 28 :
    sector.type === "cobbles" ? 35 :
    sector.type === "wall" ? 31 :
    sector.type === "tt" ? (stage.type === "ttt" ? 52 : 50) :
    sector.type === "final" ? (stage.type === "mountain" ? 28 : stage.type === "flat" ? 46 : 36) :
    40;

  return d / speed * 3600;
}

function performance(r, stage, sector) {
  const s = r.stats;

  if (sector.type === "flat") return s.flat * .38 + s.sprint * .15 + s.stamina * .16 + s.positioning * .15 + r.form * .16;
  if (sector.type === "climb") return s.mountain * .52 + s.stamina * .18 + s.recovery * .12 + s.acceleration * .08 + r.form * .10;
  if (sector.type === "hilly") return s.hills * .38 + s.acceleration * .18 + s.stamina * .16 + s.mountain * .10 + r.form * .18;
  if (sector.type === "cobbles") return s.cobbles * .38 + s.positioning * .20 + s.stamina * .15 + s.hills * .12 + r.form * .15;
  if (sector.type === "wall") return s.hills * .44 + s.acceleration * .26 + s.mountain * .12 + r.form * .18;
  if (sector.type === "tt") return s.tt * .52 + s.flat * .18 + s.stamina * .15 + r.form * .15;
  if (sector.type === "final" && stage.type === "flat") return s.sprint * .42 + s.flat * .20 + s.acceleration * .22 + s.positioning * .16;
  if (sector.type === "final" && stage.type === "mountain") return s.mountain * .52 + s.acceleration * .18 + s.stamina * .15 + r.form * .15;

  return s.stamina * .28 + s.flat * .24 + s.hills * .24 + r.form * .24;
}

function difficultySpread(sector) {
  return sector.type === "flat" ? 1.6 : sector.type === "climb" ? 5.4 : sector.type === "cobbles" ? 4.6 : sector.type === "final" ? 5.6 : 3.2;
}

function simulateRoadSector(stage, sector) {
  const base = baseSectorTime(stage, sector);
  const riders = getRaceRiders();

  riders.forEach(r => {
    const st = Game.live.states[r.id];
    const order = getOrder(Game.riderOrders[r.id] || r.defaultOrder);
    const effort = Game.riderEfforts[r.id] ?? r.defaultEffort;
    const perf =
      performance(r, stage, sector) +
      (effort - 60) * 0.10 +
      materialScore(r, stage, sector) * 0.06 -
      r.fatigue * 0.06 +
      st.finalBonus +
      rnd(-3, 3);

    let t = base + (82 - perf) * difficultySpread(sector);

    if (order.attack && effort > 76 && Math.random() < attackChance(r, sector, effort)) {
      t -= rnd(20, 80);
      st.groupId = `attack_${r.id}`;
      addRadio(`${r.name} ataca.`);
    }

    const risk = incidentRisk(r, stage, sector, effort);
    if (Math.random() < risk) {
      const loss = rnd(25, sector.type === "cobbles" ? 180 : 110);
      t += loss;
      st.incident = "Incidente";
      st.groupId = "dropped";
      addRadio(`${r.name} sufre incidente y pierde ${sec(loss)}.`);
    }

    const crisisRisk = st.energy < 22 ? 0.30 : st.energy < 35 ? 0.12 : 0;
    if (Math.random() < crisisRisk) {
      const loss = rnd(80, 320);
      t += loss;
      st.groupId = "dropped";
      addRadio(`${r.name} entra en crisis y pierde ${sec(loss)}.`);
    }

    st.time += t;
    st.energy = clamp(st.energy - energyCost(sector, order, effort, r), 0, 115);
    st.hydration = clamp(st.hydration - hydrationCost(stage, sector, effort), 0, 115);
    st.stomach = clamp(st.stomach - 3, 0, 100);
    st.finalBonus = Math.max(0, st.finalBonus - 0.8);
    st.fatigueGain += fatigueGain(sector, effort, r);
  });

  applyGroupCohesion(stage, sector);
}

function simulateTTTSector(stage, sector) {
  const base = baseSectorTime(stage, sector);

  TEAMS.forEach(team => {
    const teamRiders = getTeamRiders(team.id);

    const raw = teamRiders.map(r => {
      const st = Game.live.states[r.id];
      const effort = Game.riderEfforts[r.id] ?? r.defaultEffort;

      const perf =
        r.stats.ttt * 0.48 +
        r.stats.tt * 0.22 +
        r.stats.flat * 0.14 +
        r.stats.stamina * 0.16 +
        materialScore(r, stage, sector) * 0.08 +
        (effort - 60) * 0.08 -
        r.fatigue * 0.05 +
        rnd(-2, 2);

      const t = base + (84 - perf) * 3.2;

      st.energy = clamp(st.energy - energyCost(sector, getOrder("pull"), effort, r), 0, 115);
      st.hydration = clamp(st.hydration - hydrationCost(stage, sector, effort), 0, 115);
      st.fatigueGain += fatigueGain(sector, effort, r);

      return { r, t };
    }).sort((a, b) => a.t - b.t);

    const marker = raw[Math.min(3, raw.length - 1)].t;

    raw.forEach((x, i) => {
      const st = Game.live.states[x.r.id];

      if (i <= 3 || x.t - marker < 22) {
        st.time += marker + rnd(0, 2);
        st.group = `CRE ${team.name}`;
        st.groupId = `ttt_${team.id}`;
      } else {
        st.time += marker + rnd(25, 95);
        st.group = `Descolgado CRE`;
        st.groupId = `ttt_drop_${team.id}`;
      }
    });
  });
}

function applyGroupCohesion(stage, sector) {
  const riders = getRaceRiders();
  const grouped = {};

  riders.forEach(r => {
    const st = Game.live.states[r.id];
    const id = st.groupId || "peloton";
    if (id.startsWith("attack") || id === "dropped") return;
    if (!grouped[id]) grouped[id] = [];
    grouped[id].push(r);
  });

  Object.entries(grouped).forEach(([id, arr]) => {
    const times = arr.map(r => Game.live.states[r.id].time);
    let groupTime = avg(times);
    let pull = 0;

    arr.forEach(r => {
      const o = getOrder(Game.riderOrders[r.id] || r.defaultOrder);
      const e = Game.riderEfforts[r.id] ?? r.defaultEffort;
      pull += o.pull * Math.max(0, e - 50) * 0.08;
    });

    groupTime -= clamp(pull, 0, 55);

    arr.forEach(r => {
      const st = Game.live.states[r.id];
      const e = Game.riderEfforts[r.id] ?? r.defaultEffort;
      const weak = sector.type === "climb" && r.stats.mountain < 70 && e < 55 && st.energy < 55;

      if (weak && Math.random() < 0.22) {
        st.time = groupTime + rnd(35, 140);
        st.groupId = "dropped";
        addRadio(`${r.name} se corta en la subida.`);
      } else {
        st.time = groupTime + rnd(0, 2.5);
      }
    });
  });

  if (Game.live.breakGap > 0) {
    const userPull = getTeamRiders(Game.selectedTeamId).reduce((sum, r) => {
      const o = getOrder(Game.riderOrders[r.id] || r.defaultOrder);
      const e = Game.riderEfforts[r.id] ?? r.defaultEffort;
      return sum + (o.id === "catch" ? e * 0.16 : o.id === "pull" ? e * 0.08 : 0);
    }, 0);

    Game.live.breakGap = Math.max(0, Game.live.breakGap + (sector.type === "climb" ? 12 : -10) - userPull + rnd(-18, 20));
    if (Game.live.breakGap < 20) addRadio("La fuga está casi neutralizada.");
  }
}

function attackChance(r, sector, effort) {
  const fit = sector.type === "climb" ? r.stats.mountain : sector.type === "cobbles" ? r.stats.cobbles : r.stats.hills;
  return clamp((fit - 72) / 90 + (effort - 75) / 120, 0.04, 0.55);
}

function incidentRisk(r, stage, sector, effort) {
  return clamp(
    (sector.type === "cobbles" ? 0.045 : 0.008) +
    stage.rain / 1200 +
    Math.max(0, effort - 88) / 900 -
    (r.stats.positioning + r.stats.downhill) / 9000,
    0.002,
    0.18
  );
}

function energyCost(sector, order, effort, r) {
  const base = sector.type === "flat" ? 12 : sector.type === "climb" ? 28 : sector.type === "cobbles" ? 26 : sector.type === "final" ? 31 : 20;
  return clamp(base * order.energy * (0.55 + effort / 100) - r.stats.stamina * 0.04, 4, 60);
}

function hydrationCost(stage, sector, effort) {
  return clamp(7 + stage.heat * 0.08 + sector.difficulty * 0.025 + Math.max(0, effort - 75) * 0.04, 5, 24);
}

function fatigueGain(sector, effort, r) {
  return clamp(sector.difficulty * 0.045 + Math.max(0, effort - 70) * 0.06 - r.stats.recovery * 0.025, 0.5, 11);
}

/* ============================================================
   GRUPOS VISUALES
   ============================================================ */

function buildGroups() {
  const stage = getStage();
  if (isTTT(stage)) return buildTTTGroups();

  const riders = getRaceRiders().filter(r => Game.live.states[r.id]);
  const best = Math.min(...riders.map(r => Game.live.states[r.id].time));
  const map = {};

  riders.forEach(r => {
    const st = Game.live.states[r.id];
    const g = st.time - best;

    if (st.groupId === "breakaway" && Game.live.breakGap > 20) st.group = "Fuga";
    else if (st.groupId && st.groupId.startsWith("attack")) st.group = "Ataque";
    else if (g <= 25) st.group = "Grupo favoritos";
    else if (g <= 85) st.group = "Pelotón";
    else if (g <= 220) st.group = "Grupo 2";
    else st.group = "Cortados";

    if (!map[st.group]) map[st.group] = [];
    map[st.group].push(r);
  });

  const order = ["Fuga", "Ataque", "Grupo favoritos", "Pelotón", "Grupo 2", "Cortados"];

  return order.filter(k => map[k]).map(k => {
    const arr = map[k];
    const t = avg(arr.map(r => Game.live.states[r.id].time));
    return {
      label: k,
      riders: arr,
      count: arr.length,
      gapText: k === "Fuga" ? `+${sec(Game.live.breakGap)} sobre pelotón` : gap(t, best),
      km: currentKmForGroup(k, t, best),
      cls: groupClass(k)
    };
  });
}

function buildTTTGroups() {
  const stage = getStage();
  const sector = stage.sectors[Game.live.sectorIndex];
  const teamTimes = TEAMS.map(team => {
    const riders = getTeamRiders(team.id);
    const t = avg(riders.map(r => Game.live.states[r.id]?.time || 0));
    return { team, riders, t };
  });

  const best = Math.min(...teamTimes.map(x => x.t));

  return teamTimes
    .map(x => ({
      label: `CRE ${x.team.name}`,
      riders: x.riders,
      count: x.riders.length,
      gapText: gap(x.t, best),
      km: clamp(sector.from - (x.t - best) / 45, 0, stage.distance),
      cls: x.team.id === Game.selectedTeamId ? "fav" : "peloton"
    }))
    .sort((a, b) => a.gapText === "m.t." ? -1 : 1);
}

function currentKmForGroup(label, t, best) {
  const stage = getStage();
  const sector = stage.sectors[Game.live.sectorIndex];
  if (label === "Fuga") return clamp(sector.from + Game.live.breakGap / 30, 0, stage.distance);
  return clamp(sector.from - (t - best) / 45, 0, stage.distance);
}

function groupClass(label) {
  return {
    "Fuga": "break",
    "Ataque": "attack",
    "Grupo favoritos": "fav",
    "Pelotón": "peloton",
    "Grupo 2": "second",
    "Cortados": "dropped"
  }[label] || "";
}

function renderTVLanes(groups) {
  const lanes = ["Fuga", "Ataque", "Grupo favoritos", "Pelotón", "Grupo 2", "Cortados"];

  return `
    <div class="tv-lanes live">
      ${lanes.map(label => {
        const g = groups.find(x => x.label === label);
        return `
          <div class="lane ${g ? g.cls : ""}">
            <strong>${label}</strong>
            <span>${g ? `${g.riders.length} corredores · ${g.gapText}` : "—"}</span>
            <div class="lane-chips">
              ${g ? g.riders.slice(0, 10).map(r => `<b class="${r.teamId === Game.selectedTeamId ? "mine" : isRival(r) ? "rival" : ""}">${esc(r.name)}</b>`).join("") : ""}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function getImportantRivals() {
  return getGC().filter(r => r.teamId !== Game.selectedTeamId && ["gc", "co"].includes(r.roleKey)).slice(0, 6);
}

function isRival(r) {
  return getImportantRivals().some(x => x.id === r.id);
}

function renderLiveRadar() {
  const rivals = getImportantRivals();

  return `
    <div class="radar">
      <h3>Radar de rivales</h3>
      ${rivals.map(r => {
        const st = Game.live.states[r.id];
        return `<div class="radar-row"><strong>${esc(r.name)}</strong><span>${esc(st ? st.group : "—")}</span></div>`;
      }).join("")}
    </div>
  `;
}

function renderEnergyHeatmap() {
  return `
    <div class="energy-map">
      ${getTeamRiders(Game.selectedTeamId).map(r => {
        const e = Game.live.states[r.id]?.energy || 0;
        const cls = e > 68 ? "good" : e > 38 ? "warn" : "bad";
        return `<div class="energy ${cls}"><strong>${esc(r.name)}</strong><span>${Math.round(e)}%</span></div>`;
      }).join("")}
    </div>
  `;
}

/* ============================================================
   FIN DE ETAPA
   ============================================================ */

function finishStage(renderNow) {
  const stage = getStage();

  let results = getRaceRiders().map(r => {
    const st = Game.live.states[r.id];
    return {
      riderId: r.id,
      riderName: r.name,
      teamId: r.teamId,
      teamName: getTeam(r.teamId).name,
      time: st.time,
      group: st.group,
      incident: st.incident,
      fatigueGain: st.fatigueGain,
      energy: st.energy
    };
  }).sort((a, b) => a.time - b.time);

  if (isTTT(stage)) {
    TEAMS.forEach(team => {
      const arr = results.filter(x => x.teamId === team.id).sort((a, b) => a.time - b.time);
      if (!arr.length) return;

      const marker = arr[Math.min(3, arr.length - 1)].time;

      arr.forEach((x, i) => {
        if (i <= 3 || x.time - marker < 8) {
          x.time = marker;
          x.group = `CRE ${team.name}`;
        } else {
          x.time = Math.max(x.time, marker + 9);
          x.group = `Descolgado CRE`;
        }
      });
    });
  } else {
    results = applyRoadGroups(stage, results);
  }

  results.sort((a, b) => a.time - b.time);
  results.forEach((x, i) => x.pos = i + 1);

  applyPoints(stage, results);
  updateTotals(stage, results);
  updateTeamTimes(results);

  Game.lastStage = { stage, results };
  Game.stageHistory.push(Game.lastStage);
  Game.live = null;

  saveGame(false);

  if (renderNow) renderStageResult();
}

function applyRoadGroups(stage, results) {
  if (stage.type === "tt") return results;

  let groupTime = results[0].time;
  let groupNo = 1;

  return results.map((r, i) => {
    const threshold = stage.type === "flat" ? 18 : stage.type === "hilly" ? 10 : 7;

    if (i > 0 && r.time - groupTime > threshold) {
      groupTime = r.time;
      groupNo++;
    }

    if (!r.incident && !r.group.includes("Ataque")) {
      r.time = groupTime;
      r.group = groupNo === 1 ? "Grupo 1" : `Grupo ${groupNo}`;
    }

    return r;
  });
}

function applyPoints(stage, results) {
  const pointScale = CLASSIFICATION_RULES.pointsByStageType[stage.type] || CLASSIFICATION_RULES.pointsByStageType.hilly;
  const uciScale = getRace().type === "classic" ? CLASSIFICATION_RULES.uci.oneDay : CLASSIFICATION_RULES.uci.grandTourStage;

  results.forEach((res, i) => {
    const r = getRider(res.riderId);
    r.points += pointScale[i] || 0;
    r.uciPoints += uciScale[i] || 0;
    if (i === 0) {
      r.stageWins++;
      r.seasonStageWins++;
    }
  });

  stage.climbs.forEach(c => {
    const scale = CLASSIFICATION_RULES.mountainPoints[c.category] || [1];
    const climbers = [...results].sort((a, b) => getRider(b.riderId).stats.mountain - getRider(a.riderId).stats.mountain + rnd(-3, 3));

    scale.forEach((p, i) => {
      const r = getRider(climbers[i]?.riderId);
      if (r) r.mountainPoints += p;
    });
  });
}

function updateTotals(stage, results) {
  results.forEach(res => {
    const r = getRider(res.riderId);
    r.totalTime += res.time;
    r.fatigue = clamp(r.fatigue + res.fatigueGain - r.stats.recovery * 0.06, 0, 100);
    r.form = clamp(r.form + (res.pos <= 10 ? 0.4 : -0.1) - r.fatigue * 0.004, 52, 99);
    r.morale = clamp(r.morale + (res.pos === 1 ? 6 : res.pos <= 5 ? 2 : res.pos > 90 ? -2 : 0), 30, 100);
    r.raceDays++;
  });
}

function updateTeamTimes(results) {
  TEAMS.forEach(team => {
    const top = results.filter(r => r.teamId === team.id).sort((a, b) => a.time - b.time).slice(0, 3);
    Game.teamTimes[team.id] += top.reduce((sum, x) => sum + x.time, 0);
  });
}

/* ============================================================
   RESULTADOS
   ============================================================ */

function renderStageResult() {
  const { stage, results } = Game.lastStage;
  const lead = results[0].time;

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Resultado · ${esc(stage.name)}</h1>
        <p>${esc(stage.label)} · ${stage.distance} km</p>
      </div>
      <div class="top-actions">
        <button class="secondary" onclick="saveGame()">Guardar</button>
        <button onclick="nextStage()">${Game.currentStageIndex >= getStages().length - 1 ? "Final de carrera" : "Siguiente etapa"}</button>
      </div>
    </div>

    ${renderLeaderStrip()}

    <section class="panel" style="margin-top:16px;">
      <h2>Clasificación de etapa</h2>
      <div class="classification-scroll">
        <table>
          <thead><tr><th>Pos</th><th>Corredor</th><th>Equipo</th><th>Tiempo</th><th>Dif.</th><th>Grupo</th></tr></thead>
          <tbody>
            ${results.map(r => `
              <tr class="${r.teamId === Game.selectedTeamId ? "user-team" : ""}">
                <td>${r.pos}</td>
                <td>${esc(r.riderName)}</td>
                <td>${esc(r.teamName)}</td>
                <td>${sec(r.time)}</td>
                <td>${gap(r.time, lead)}</td>
                <td>${esc(r.group)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel" style="margin-top:16px;">
      <h2>General</h2>
      ${renderGeneralTable()}
    </section>
  `;
}

function nextStage() {
  if (Game.currentStageIndex >= getStages().length - 1) {
    finishRace();
    return;
  }

  Game.currentStageIndex++;

  getTeamRiders(Game.selectedTeamId).forEach(r => {
    Game.riderOrders[r.id] = r.defaultOrder;
    Game.riderEfforts[r.id] = r.defaultEffort;
    Game.riderEquipment[r.id] = autoEquipmentForStage(r.teamId, getStage());
  });

  const plan = NUTRITION_PLANS.find(p => p.id === Game.nutritionPlanId) || NUTRITION_PLANS[0];
  Game.stock = deepClone(plan.stock);

  Game.activeTab = "director";
  saveGame(false);
  renderRace();
}

function finishRace() {
  const race = getRace();
  const gc = getGC();

  if (race.type === "grand_tour") {
    const finalScale = CLASSIFICATION_RULES.uci.grandTourFinalGC;
    gc.forEach((r, i) => r.uciPoints += finalScale[i] || 0);
  }

  Game.raceHistory.push({
    raceId: race.id,
    raceName: race.name,
    winnerId: gc[0]?.id,
    winnerName: gc[0]?.name,
    userBestId: getTeamRiders(Game.selectedTeamId, true).sort((a, b) => a.totalTime - b.totalTime)[0]?.id,
    stageWins: getTeamRiders(Game.selectedTeamId, true).reduce((s, r) => s + r.stageWins, 0)
  });

  Game.finished = true;
  saveGame(false);
  renderRaceFinal();
}

function renderRaceFinal() {
  const race = getRace();
  const gc = getGC();

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Final · ${esc(race.name)}</h1>
        <p>Clasificación final de carrera</p>
      </div>
      <div class="top-actions">
        ${Game.mode === "season" ? `<button onclick="goToBetweenRaces()">Continuar temporada</button>` : `<button onclick="init()">Nueva partida</button>`}
      </div>
    </div>

    ${renderLeaderStrip()}

    <section class="panel" style="margin-top:16px;">
      <h2>Podio</h2>
      <div class="podium">
        ${gc.slice(0, 3).map((r, i) => `<div class="podium-card ${i === 0 ? race.jerseyClass : ""}"><span>#${i + 1}</span><h3>${esc(r.name)}</h3><p>${esc(getTeam(r.teamId).name)} · ${sec(r.totalTime)}</p></div>`).join("")}
      </div>
    </section>

    <section class="panel" style="margin-top:16px;">
      <h2>General final</h2>
      ${renderGeneralTable()}
    </section>
  `;
}

/* ============================================================
   TEMPORADA / ENTRENAMIENTO NO CONVOCADOS
   ============================================================ */

function goToBetweenRaces() {
  if (Game.mode !== "season") return init();

  if (Game.seasonIndex >= Game.seasonRaceIds.length - 1) {
    Game.seasonFinished = true;
    saveGame(false);
    return renderSeasonFinal();
  }

  Game.betweenRaces = true;
  saveGame(false);
  renderBetweenRaces();
}

function renderBetweenRaces() {
  const currentRace = getRace();
  const nextRace = RACES.find(r => r.id === Game.seasonRaceIds[Game.seasonIndex + 1]);
  const selectedIds = Game.lastRaceRosterIds || [];
  const nonSelected = getFullTeamRiders(Game.selectedTeamId).filter(r => !selectedIds.includes(r.id));

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Entre carreras</h1>
        <p>Terminado: ${esc(currentRace.name)} · Próxima carrera: ${esc(nextRace.name)}</p>
      </div>
      <div class="top-actions">
        <button class="secondary" onclick="saveGame()">Guardar</button>
        <button onclick="advanceToNextRace()">Aplicar entrenamiento y seguir</button>
      </div>
    </div>

    <section class="panel">
      <h2>Entrenamiento de corredores no convocados</h2>
      <p class="muted">Los corredores que no corrieron la última carrera pueden entrenar y mejorar atributos mientras el bloque de competición recupera.</p>

      <div class="race-grid">
        ${TRAINING_OPTIONS.map(t => `
          <button class="race-card ${Game.trainingPlanId === t.id ? "active" : ""}" onclick="Game.trainingPlanId='${t.id}'; renderBetweenRaces();">
            <span class="race-title">${esc(t.name)}</span>
            <span class="muted small">${esc(t.description)}</span>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="panel" style="margin-top:16px;">
      <h2>No convocados que entrenarán</h2>
      <div class="roster-grid">
        ${nonSelected.map(renderTrainingRiderCard).join("")}
      </div>
    </section>
  `;
}

function renderTrainingRiderCard(r) {
  return `
    <div class="status-card">
      <div class="badge-row">
        <span class="badge green">${esc(r.role)}</span>
        <span class="badge blue">Forma ${Math.round(r.form)}</span>
        <span class="badge orange">Fatiga ${Math.round(r.fatigue)}</span>
      </div>
      <h3>${esc(r.name)}</h3>
      <div class="mini-stats">
        <span>⛰ ${r.stats.mountain}</span>
        <span>⚡ ${r.stats.sprint}</span>
        <span>⏱ ${r.stats.tt}</span>
        <span>🪨 ${r.stats.cobbles}</span>
        <span>🫀 ${r.stats.stamina}</span>
      </div>
    </div>
  `;
}

function advanceToNextRace() {
  applyTrainingToNonSelected();

  Game.seasonIndex++;
  Game.selectedRaceId = Game.seasonRaceIds[Game.seasonIndex];
  Game.betweenRaces = false;
  Game.finished = false;
  Game.rosterLocked = false;

  prepareRosterSelection();
}

function applyTrainingToNonSelected() {
  const selectedIds = Game.lastRaceRosterIds || [];
  const option = TRAINING_OPTIONS.find(t => t.id === Game.trainingPlanId) || TRAINING_OPTIONS[0];
  const effects = option.effects;

  getFullTeamRiders(Game.selectedTeamId).forEach(r => {
    if (!selectedIds.includes(r.id)) {
      Object.entries(effects).forEach(([key, value]) => {
        if (key === "fatigue") r.fatigue = clamp(r.fatigue + value, 0, 100);
        else if (key === "form") r.form = clamp(r.form + value, 50, 100);
        else if (key === "morale") r.morale = clamp(r.morale + value, 30, 100);
        else if (r.stats[key] !== undefined) {
          r.stats[key] = clamp(r.stats[key] + value, 45, 99);
          if (key === "tt") r.stats.timeTrial = r.stats.tt;
          if (key === "ttt") r.stats.teamTimeTrial = r.stats.ttt;
        }
      });
    } else {
      r.fatigue = clamp(r.fatigue - 10, 0, 100);
      r.form = clamp(r.form - 0.5, 50, 100);
    }
  });
}

function renderSeasonFinal() {
  const user = getFullTeamRiders(Game.selectedTeamId);
  const uci = [...Game.riders].sort((a, b) => b.uciPoints - a.uciPoints);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Final de temporada</h1>
        <p>${esc(getTeam(Game.selectedTeamId).name)} · Resumen completo</p>
      </div>
      <div class="top-actions">
        <button onclick="init()">Nueva temporada</button>
      </div>
    </div>

    <section class="panel">
      <h2>Carreras disputadas</h2>
      <div class="classification-scroll">
        <table>
          <thead><tr><th>Carrera</th><th>Ganador</th><th>Mejor de tu equipo</th><th>Victorias de etapa</th></tr></thead>
          <tbody>
            ${Game.raceHistory.map(h => `
              <tr>
                <td>${esc(h.raceName)}</td>
                <td>${esc(h.winnerName)}</td>
                <td>${esc(getRider(h.userBestId)?.name || "—")}</td>
                <td>${h.stageWins}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel" style="margin-top:16px;">
      <h2>Ranking UCI</h2>
      <div class="classification-scroll">
        <table>
          <thead><tr><th>Pos</th><th>Corredor</th><th>Equipo</th><th>UCI</th><th>Victorias</th></tr></thead>
          <tbody>
            ${uci.map((r, i) => `
              <tr class="${r.teamId === Game.selectedTeamId ? "user-team" : ""}">
                <td>${i + 1}</td>
                <td>${esc(r.name)}</td>
                <td>${esc(getTeam(r.teamId).name)}</td>
                <td>${r.uciPoints}</td>
                <td>${r.seasonStageWins}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

/* ============================================================
   CLASIFICACIONES
   ============================================================ */

function getGC() {
  return getRaceRiders().slice().sort((a, b) => a.totalTime - b.totalTime);
}

function getPoints() {
  return getRaceRiders().slice().sort((a, b) => b.points - a.points || a.totalTime - b.totalTime);
}

function getMountain() {
  return getRaceRiders().slice().sort((a, b) => b.mountainPoints - a.mountainPoints || a.totalTime - b.totalTime);
}

function getYouth() {
  return getRaceRiders().filter(r => r.age <= CLASSIFICATION_RULES.youthMaxAge).sort((a, b) => a.totalTime - b.totalTime);
}

function getTeamsClass() {
  return TEAMS.map(team => ({ team, time: Game.teamTimes[team.id] || 0 })).sort((a, b) => a.time - b.time);
}

function renderClassTab() {
  return `
    <div class="grid two">
      <section class="panel">
        <h2>General completa</h2>
        ${renderGeneralTable()}
      </section>
      <section class="panel">
        <h2>Secundarias</h2>
        ${renderSmallClassification("Puntos", getPoints(), "points", "pts")}
        ${renderSmallClassification("Montaña", getMountain(), "mountainPoints", "pts")}
        ${renderSmallClassification("Jóvenes", getYouth(), "totalTime", "time")}
        ${renderTeamClassification()}
      </section>
    </div>
  `;
}

function renderGeneralTable() {
  const gc = getGC();
  const leaderTime = gc[0]?.totalTime || 0;
  const race = getRace();

  if (!Game.stageHistory.length) {
    return `<p class="muted">Todavía no se ha disputado ninguna etapa.</p>`;
  }

  return `
    <div class="classification-scroll">
      <table>
        <thead>
          <tr><th>Pos</th><th>Corredor</th><th>Equipo</th><th>Tiempo</th><th>Dif.</th><th>Rol</th><th>Fatiga</th><th>Puntos</th><th>Montaña</th><th>UCI</th></tr>
        </thead>
        <tbody>
          ${gc.map((r, i) => `
            <tr class="${r.teamId === Game.selectedTeamId ? "user-team" : ""} ${i === 0 ? `race-leader ${race.jerseyClass}` : ""}">
              <td>${i + 1}</td>
              <td>${esc(r.name)}</td>
              <td>${esc(getTeam(r.teamId).name)}</td>
              <td>${sec(r.totalTime)}</td>
              <td>${gap(r.totalTime, leaderTime)}</td>
              <td>${esc(r.role)}</td>
              <td>${Math.round(r.fatigue)}</td>
              <td>${r.points}</td>
              <td>${r.mountainPoints}</td>
              <td>${r.uciPoints}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSmallClassification(title, riders, key, mode) {
  return `
    <div class="mini-class">
      <h3>${esc(title)}</h3>
      <div class="mini-scroll">
        <table>
          <tbody>
            ${riders.map((r, i) => `
              <tr class="${r.teamId === Game.selectedTeamId ? "user-team" : ""}">
                <td>${i + 1}</td>
                <td>${esc(r.name)}</td>
                <td>${mode === "time" ? sec(r[key]) : r[key]}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTeamClassification() {
  const teams = getTeamsClass();
  const lead = teams[0]?.time || 0;

  return `
    <div class="mini-class">
      <h3>Equipos</h3>
      <div class="mini-scroll">
        <table>
          <tbody>
            ${teams.map((x, i) => `
              <tr class="${x.team.id === Game.selectedTeamId ? "user-team" : ""}">
                <td>${i + 1}</td>
                <td>${esc(x.team.name)}</td>
                <td>${gap(x.time, lead)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ============================================================
   TEAM / HISTORY
   ============================================================ */

function renderTeamTab() {
  return `
    <section class="panel">
      <h2>Equipo inscrito</h2>
      <p class="muted small">La selección está bloqueada durante esta carrera.</p>
      <div class="roster-grid">
        ${getTeamRiders(Game.selectedTeamId, true).map(renderRosterStatusCard).join("")}
      </div>
    </section>
  `;
}

function renderRosterStatusCard(r) {
  return `
    <div class="status-card">
      <div class="badge-row">
        <span class="badge green">${esc(r.role)}</span>
        <span class="badge blue">Base ${r.base}</span>
        <span class="badge orange">Fatiga ${Math.round(r.fatigue)}</span>
      </div>
      <h3>${esc(r.name)}</h3>
      <p class="muted small">${esc(r.nationality)} · ${r.age} años</p>
      <div class="mini-stats">
        <span>⛰ ${r.stats.mountain}</span>
        <span>⚡ ${r.stats.sprint}</span>
        <span>⏱ ${r.stats.tt}</span>
        <span>🪨 ${r.stats.cobbles}</span>
        <span>🫀 ${r.stats.stamina}</span>
      </div>
    </div>
  `;
}

function renderHistoryTab() {
  return `
    <section class="panel">
      <h2>Historial de etapas</h2>
      <div class="classification-scroll">
        <table>
          <thead><tr><th>Etapa</th><th>Tipo</th><th>Ganador</th><th>Equipo</th></tr></thead>
          <tbody>
            ${Game.stageHistory.map(x => `
              <tr class="${x.results[0].teamId === Game.selectedTeamId ? "user-team" : ""}">
                <td>${esc(x.stage.name)}</td>
                <td>${esc(x.stage.label)}</td>
                <td>${esc(x.results[0].riderName)}</td>
                <td>${esc(x.results[0].teamName)}</td>
              </tr>
            `).join("") || `<tr><td colspan="4">Sin etapas disputadas</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

init();
