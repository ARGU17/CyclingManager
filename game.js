/* ============================================================
   CYCLING MANAGER TOUR - game.js
   v0.5: guardado, temporada, entrenamiento, grupos, crisis,
   cortes por viento, moral/forma, objetivos, historial maillots.
   ============================================================ */

const app = document.getElementById("app");
const SAVE_KEY = "cyclingManagerTour_v05";

const Game = {
  selectedRaceId: DEFAULT_RACE_ID,
  selectedTeamId: null,
  protectedRiderId: null,
  difficulty: "normal",
  mode: "single",
  seasonRaceIds: [...SEASON_RACE_IDS],
  seasonRaceIndex: 0,
  betweenRaces: false,
  activeTab: "strategy",
  currentStageIndex: 0,
  riderTactics: {},
  riders: [],
  teamTimes: {},
  stageHistory: [],
  jerseyHistory: [],
  incidentHistory: [],
  objectiveResults: [],
  lastStageResults: null,
  finalUciAssignedForRace: {},
  stageWinCounts: {},
  teamStageWinCounts: {},
  budget: 0,
  prestige: 0,
  sponsorSatisfaction: 75,
  finished: false,
  seasonFinished: false
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

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function average(values) {
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
}

function standardDeviation(values) {
  const a = average(values);
  return values.length ? Math.sqrt(average(values.map(v => (v - a) ** 2))) : 0;
}

function escapeHtml(v) {
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(v) {
  return `${Math.round(v / 1000000 * 10) / 10} M€`;
}

function secondsToTime(seconds) {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return h > 0
    ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function gapToLeader(seconds, leaderSeconds) {
  const g = Math.round(seconds - leaderSeconds);
  return g <= 0 ? "m.t." : `+${secondsToTime(g)}`;
}

function getRace() {
  return RACES.find(r => r.id === Game.selectedRaceId) || RACES[0];
}

function getStages() {
  return getRace().stages;
}

function getCurrentStage() {
  return getStages()[Game.currentStageIndex];
}

function getTeam(id) {
  return TEAMS.find(t => t.id === id);
}

function getRider(id) {
  return Game.riders.find(r => r.id === id);
}

function getTactic(id) {
  return TACTICS.find(t => t.id === id) || TACTICS.find(t => t.id === "balanced");
}

function getDifficulty() {
  return DIFFICULTY_LEVELS[Game.difficulty] || DIFFICULTY_LEVELS.normal;
}

function getAllActiveRiders() {
  return Game.riders.filter(r => !r.abandoned);
}

function getTeamRiders(teamId) {
  return Game.riders.filter(r => r.teamId === teamId && !r.abandoned);
}

function getUserTacticForRider(rider) {
  return getTactic(Game.riderTactics[rider.id] || "balanced");
}

function isGrandTour() {
  return getRace().uciClass === "grand_tour";
}

function currentRaceDoneKey() {
  return Game.selectedRaceId;
}

/* ============================================================
   GUARDADO
   ============================================================ */

function saveGame(show = false) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(Game));

  if (show) {
    alert("Partida guardada.");
  }
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);

  if (!raw) {
    alert("No hay partida guardada.");
    return;
  }

  Object.assign(Game, JSON.parse(raw));
  renderRaceScreen();
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
  alert("Guardado borrado.");
  renderHome();
}

/* ============================================================
   INICIO / FLUJO
   ============================================================ */

function initGame() {
  Game.selectedRaceId = DEFAULT_RACE_ID;
  Game.selectedTeamId = null;
  Game.protectedRiderId = null;
  Game.difficulty = "normal";
  Game.mode = "single";
  Game.seasonRaceIndex = 0;
  Game.betweenRaces = false;
  Game.activeTab = "strategy";
  Game.currentStageIndex = 0;
  Game.riderTactics = {};
  Game.riders = deepClone(RIDERS);
  Game.teamTimes = Object.fromEntries(TEAMS.map(t => [t.id, 0]));
  Game.stageHistory = [];
  Game.jerseyHistory = [];
  Game.incidentHistory = [];
  Game.objectiveResults = [];
  Game.lastStageResults = null;
  Game.finalUciAssignedForRace = {};
  Game.stageWinCounts = {};
  Game.teamStageWinCounts = {};
  Game.finished = false;
  Game.seasonFinished = false;
  Game.budget = 0;
  Game.prestige = 0;
  Game.sponsorSatisfaction = 75;

  renderHome();
}

function setMode(mode) {
  Game.mode = mode;
  renderHome();
}

function selectRace(raceId) {
  Game.selectedRaceId = raceId;
  Game.mode = "single";
  renderHome();
}

function selectDifficulty(level) {
  Game.difficulty = level;
  renderHome();
}

function setActiveTab(tab) {
  Game.activeTab = tab;
  renderRaceScreen();
}

function startWithTeam(teamId) {
  Game.selectedTeamId = teamId;

  if (Game.mode === "season") {
    Game.seasonRaceIndex = 0;
    Game.selectedRaceId = Game.seasonRaceIds[0];
  }

  const team = getTeam(teamId);

  Game.budget = team.management.budget;
  Game.prestige = team.management.prestige;
  Game.sponsorSatisfaction = 75;
  Game.riders = deepClone(RIDERS);

  startRaceState(true);
  saveGame();
  renderRaceScreen();
}

function startRaceState(resetRidersForNewGame = false) {
  Game.currentStageIndex = 0;
  Game.activeTab = "strategy";
  Game.betweenRaces = false;
  Game.finished = false;
  Game.riderTactics = {};
  Game.teamTimes = Object.fromEntries(TEAMS.map(t => [t.id, 0]));
  Game.stageHistory = [];
  Game.jerseyHistory = [];
  Game.incidentHistory = [];
  Game.objectiveResults = [];
  Game.lastStageResults = null;
  Game.finalUciAssignedForRace[Game.selectedRaceId] = false;

  if (resetRidersForNewGame) {
    Game.riders.forEach(r => {
      r.fatigue = 0;
      r.energy = 100;
      r.totalTime = 0;
      r.raceDays = 0;
      r.points = 0;
      r.mountainPoints = 0;
      r.abandoned = false;
      r.stageWins = 0;
    });
  } else {
    Game.riders.forEach(r => {
      r.totalTime = 0;
      r.raceDays = 0;
      r.points = 0;
      r.mountainPoints = 0;
      r.abandoned = false;
      r.stageWins = 0;
      r.fatigue = clamp(r.fatigue, 0, 70);
      r.energy = 100;
    });
  }

  Game.protectedRiderId = getTeamRiders(Game.selectedTeamId)[0]?.id || null;
  resetUserRiderTactics("balanced");
}

function resetUserRiderTactics(tacticId = "balanced") {
  Game.riderTactics = {};

  getTeamRiders(Game.selectedTeamId).forEach(r => {
    Game.riderTactics[r.id] = tacticId;
  });
}

function setRiderTactic(riderId, tacticId) {
  Game.riderTactics[riderId] = tacticId;
  renderRaceScreen();
}

function applyTacticToAll(tacticId) {
  getTeamRiders(Game.selectedTeamId).forEach(r => {
    Game.riderTactics[r.id] = tacticId;
  });

  renderRaceScreen();
}

function setProtectedRider(riderId) {
  Game.protectedRiderId = riderId;
  renderRaceScreen();
}

function applySmartPreset(presetId) {
  const stage = getCurrentStage();

  getTeamRiders(Game.selectedTeamId).forEach(r => {
    let tactic = "balanced";

    if (presetId === "protect_gc") {
      tactic = r.id === Game.protectedRiderId ? "balanced" : "protect_leader";
    }

    if (presetId === "sprint") {
      tactic =
        r.roleKey === "sprinter"
          ? "aggressive"
          : ["rouleur", "classics", "domestique"].includes(r.roleKey)
            ? "sprint_train"
            : "conservative";
    }

    if (presetId === "breakaway") {
      tactic =
        ["puncheur", "classics", "rouleur", "climber"].includes(r.roleKey)
          ? "aggressive"
          : "conservative";
    }

    if (presetId === "mountain_attack") {
      tactic =
        ["gc", "co_leader", "climber"].includes(r.roleKey)
          ? "aggressive"
          : "protect_leader";
    }

    if (presetId === "survival") {
      tactic = "conservative";
    }

    if (presetId === "time_trial") {
      tactic =
        ["gc", "co_leader", "time_trialist"].includes(r.roleKey) ||
        ["time_trial", "team_time_trial"].includes(stage.type)
          ? "aggressive"
          : "balanced";
    }

    Game.riderTactics[r.id] = tactic;
  });

  renderRaceScreen();
}

/* ============================================================
   RENDER HOME
   ============================================================ */

function renderHome() {
  const saved = !!localStorage.getItem(SAVE_KEY);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Cycling Manager Tour 🚴‍♂️</h1>
        <p>v0.5 · temporada · guardado · objetivos · moral · crisis · grupos · viento · entrenamientos</p>
      </div>
      <div class="top-actions">
        ${saved ? `<button class="secondary" onclick="loadGame()">Cargar partida</button><button class="danger" onclick="clearSave()">Borrar guardado</button>` : ""}
      </div>
    </div>

    <section class="panel">
      <h2>Modo de juego</h2>
      <div class="race-grid">
        <button class="race-card ${Game.mode === "single" ? "active" : ""}" onclick="setMode('single')">
          <span class="race-title">Carrera única</span>
          <span class="muted small">Elige una carrera y compite.</span>
        </button>
        <button class="race-card ${Game.mode === "season" ? "active" : ""}" onclick="setMode('season')">
          <span class="race-title">Temporada</span>
          <span class="muted small">Giro → Tour → Vuelta → Monumentos → Mundial.</span>
        </button>
      </div>

      <hr>

      <h2>Dificultad</h2>
      <div class="preset-row">
        ${Object.entries(DIFFICULTY_LEVELS).map(([id, d]) => `
          <button class="secondary ${Game.difficulty === id ? "active-soft" : ""}" onclick="selectDifficulty('${id}')">
            ${escapeHtml(d.label)}
          </button>
        `).join("")}
      </div>
    </section>

    ${Game.mode === "single" ? renderRaceSelector() : renderSeasonPreview()}

    <section class="panel" style="margin-top:16px;">
      <h2>Elige equipo</h2>
      <div class="grid two">
        ${TEAMS.map(renderTeamCard).join("")}
      </div>
    </section>
  `;
}

function renderRaceSelector() {
  return `
    <section class="panel" style="margin-top:16px;">
      <h2>Elige carrera</h2>
      <div class="race-grid">
        ${RACES.map(r => `
          <button class="race-card ${Game.selectedRaceId === r.id ? "active" : ""}" onclick="selectRace('${r.id}')">
            <span class="race-title">${escapeHtml(r.name)}</span>
            <span class="badge ${r.leaderJerseyClass}">${escapeHtml(r.leaderJerseyName)}</span>
            <span class="muted small">${r.stages.length} etapa${r.stages.length > 1 ? "s" : ""} · ${escapeHtml(r.country)} · ${escapeHtml(r.uciClass)}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSeasonPreview() {
  return `
    <section class="panel" style="margin-top:16px;">
      <h2>Temporada</h2>
      <div class="stage-list compact">
        ${Game.seasonRaceIds.map((id, i) => {
          const r = RACES.find(x => x.id === id);

          return `
            <div class="stage-card">
              <span class="badge green">${i + 1}</span>
              <strong>${escapeHtml(r.name)}</strong>
              <p class="muted small">${r.stages.length} etapa${r.stages.length > 1 ? "s" : ""} · ${escapeHtml(r.uciClass)}</p>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderTeamCard(team) {
  const riders = RIDERS.filter(r => r.teamId === team.id);

  return `
    <div class="team-card">
      <div class="badge-row">
        <span class="badge ${team.color}">${escapeHtml(team.archetype)}</span>
        <span class="badge">${money(team.management.budget)}</span>
        <span class="badge blue">Prestigio ${team.management.prestige}</span>
      </div>
      <h3>${escapeHtml(team.name)}</h3>
      <p class="muted">${escapeHtml(team.description)}</p>
      <div class="badge-row">
        ${riders.map(r => `<span class="badge">${escapeHtml(r.name)}</span>`).join("")}
      </div>
      <div class="objectives-list">
        ${team.objectives.map(id => `<span class="objective-chip">${escapeHtml(OBJECTIVE_DEFINITIONS[id].label)}</span>`).join("")}
      </div>
      <button onclick="startWithTeam('${team.id}')">Competir con este equipo</button>
    </div>
  `;
}

/* ============================================================
   RENDER CARRERA
   ============================================================ */

function renderRaceScreen() {
  if (!Game.selectedTeamId) {
    renderHome();
    return;
  }

  if (Game.seasonFinished) {
    renderSeasonFinalScreen();
    return;
  }

  if (Game.betweenRaces) {
    renderTrainingScreen();
    return;
  }

  if (Game.finished) {
    renderFinalScreen();
    return;
  }

  const race = getRace();
  const team = getTeam(Game.selectedTeamId);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>${escapeHtml(team.name)}</h1>
        <p>${escapeHtml(race.name)} · ${Game.mode === "season" ? `Temporada ${Game.seasonRaceIndex + 1}/${Game.seasonRaceIds.length} · ` : ""}Etapa ${Game.currentStageIndex + 1}/${getStages().length}</p>
      </div>

      <div class="top-actions">
        <button class="secondary" onclick="saveGame(true)">Guardar</button>
        <button class="secondary" onclick="renderHome()">Inicio</button>
        <button class="danger" onclick="initGame()">Reiniciar</button>
      </div>
    </div>

    ${renderLeaderCards()}
    ${renderTabs()}
    ${renderActiveTab()}
  `;
}

function renderTabs() {
  const tabs = [
    ["overview", "Carrera"],
    ["strategy", "Estrategia"],
    ["team", "Equipo"],
    ["classifications", "Clasificaciones"],
    ["history", "Historial"]
  ];

  return `
    <div class="tabs">
      ${tabs.map(([id, label]) => `
        <button class="tab-button ${Game.activeTab === id ? "active" : ""}" onclick="setActiveTab('${id}')">
          ${label}
        </button>
      `).join("")}
    </div>
  `;
}

function renderActiveTab() {
  if (Game.activeTab === "overview") return renderOverviewTab();
  if (Game.activeTab === "team") return renderTeamTab();
  if (Game.activeTab === "classifications") return renderClassificationsTab();
  if (Game.activeTab === "history") return renderHistoryTab();

  return renderStrategyTab();
}

function renderLeaderCards() {
  const race = getRace();
  const gc = getGCStandings();
  const points = getPointsStandings();
  const mountain = getMountainStandings();
  const youth = getYouthStandings();
  const teams = getTeamStandings();
  const uci = getUciStandings();

  return `
    <section class="leader-strip">
      ${renderLeaderCard(race.leaderJerseyName, gc[0], race.leaderJerseyClass, gc[0] ? secondsToTime(gc[0].totalTime) : "—")}
      ${renderLeaderCard("Puntos", points[0], "jersey-green", points[0] ? `${points[0].points} pts` : "—")}
      ${renderLeaderCard("Montaña", mountain[0], "jersey-polka", mountain[0] ? `${mountain[0].mountainPoints} pts` : "—")}
      ${renderLeaderCard("Joven", youth[0], "jersey-white", youth[0] ? secondsToTime(youth[0].totalTime) : "—")}
      <div class="leader-card team-leader">
        <span>Equipos</span>
        <strong>${teams[0] ? escapeHtml(teams[0].team.name) : "—"}</strong>
        <small>${teams[0] ? secondsToTime(teams[0].time) : "—"}</small>
      </div>
      ${renderLeaderCard("UCI", uci[0], "jersey-blue", uci[0] ? `${uci[0].uciPoints} pts` : "—")}
    </section>
  `;
}

function renderLeaderCard(title, rider, cls, value) {
  return `
    <div class="leader-card ${cls}">
      <span>${escapeHtml(title)}</span>
      <strong>${rider ? escapeHtml(rider.name) : "—"}</strong>
      <small>${escapeHtml(value)}</small>
    </div>
  `;
}

function renderOverviewTab() {
  const stage = getCurrentStage();

  return `
    <div class="grid two">
      <section class="panel">
        ${renderCurrentStage(stage)}
        ${renderRivalComparison()}
      </section>

      <section class="panel">
        <h2>Etapas</h2>
        <div class="stage-list">
          ${getStages().map(renderStageProgressCard).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderStrategyTab() {
  const riders = getTeamRiders(Game.selectedTeamId);

  return `
    <div class="grid two">
      <section class="panel">
        ${renderCurrentStage(getCurrentStage())}
        ${renderProtectedRiderSelector(riders)}
        ${renderSmartPresets()}
        ${renderTacticPresets()}
        ${renderIndividualTactics(riders)}

        <div class="simulation-actions">
          <div>
            <strong>Listo para simular</strong>
            <div class="muted small">Puedes guardar antes de simular.</div>
          </div>
          <button onclick="simulateCurrentStage()">Simular etapa</button>
        </div>
      </section>

      <section class="panel">
        <h2>Clasificación general</h2>
        ${renderGeneralClassificationTable(15)}
        <hr>
        ${renderObjectivePanel()}
      </section>
    </div>
  `;
}

function renderTeamTab() {
  return `
    <section class="panel">
      <h2>Tu equipo</h2>
      <div class="rider-grid">
        ${getTeamRiders(Game.selectedTeamId).map(renderRiderCard).join("")}
      </div>
    </section>
  `;
}

function renderClassificationsTab() {
  return `
    <div class="grid two">
      <section class="panel">
        <h2>General</h2>
        ${renderGeneralClassificationTable(80)}
      </section>

      <section class="panel">
        <h2>Secundarias</h2>
        ${renderMiniClassifications()}
        <hr>
        <h2>Objetivos</h2>
        ${renderObjectivePanel()}
      </section>
    </div>
  `;
}

function renderHistoryTab() {
  return `
    <div class="grid two">
      <section class="panel">
        <h2>Historial de etapas</h2>
        ${renderStageHistorySummary()}
      </section>

      <section class="panel">
        <h2>Historial de maillots</h2>
        ${renderJerseyHistoryTable()}
        <hr>
        <h2>Parte médico/incidencias</h2>
        ${renderIncidentHistory()}
      </section>
    </div>
  `;
}

function renderCurrentStage(stage) {
  return `
    <div class="stage-card current">
      <div class="badge-row">
        <span class="badge green">Etapa ${stage.number}/${getStages().length}</span>
        <span class="badge blue">${escapeHtml(stage.label)}</span>
        <span class="badge">${stage.distance} km</span>
        <span class="badge orange">Dificultad ${stage.difficulty}</span>
      </div>
      <h2>${escapeHtml(stage.name)}</h2>
      <p class="help">${escapeHtml(stage.description)}</p>
      ${renderWeather(stage)}
      ${renderStageProfile(stage)}
      ${renderClimbList(stage)}
    </div>
  `;
}

function renderWeather(stage) {
  return `
    <div class="weather-grid">
      <span>🌡️ Calor ${stage.profile.heat}</span>
      <span>🌧️ Lluvia ${stage.profile.rainRisk}%</span>
      <span>💨 Viento ${stage.profile.windExposure}</span>
      <span>🪨 ${escapeHtml(stage.profile.roadSurface)}</span>
      <span>⛰️ ${stage.profile.elevationGain} m+</span>
    </div>
  `;
}

function renderStageProfile(stage) {
  const pts = buildProfilePoints(stage);
  const max = Math.max(...pts.map(p => p.alt), 1000);
  const min = Math.min(...pts.map(p => p.alt), 0);
  const w = 720;
  const h = 180;
  const pad = 18;

  const d = pts.map((p, i) => {
    const x = pad + (p.km / stage.distance) * (w - pad * 2);
    const y = h - pad - ((p.alt - min) / Math.max(1, max - min)) * (h - pad * 2);

    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const labels = (stage.profile.climbs || []).map(c => {
    const x = pad + (c.km / stage.distance) * (w - pad * 2);

    return `
      <g>
        <line x1="${x}" y1="26" x2="${x}" y2="160" class="profile-climb-line"/>
        <text x="${x + 4}" y="22" class="profile-label">${escapeHtml(c.category)} · ${escapeHtml(c.name)}</text>
      </g>
    `;
  }).join("");

  return `
    <div class="profile-box">
      <svg viewBox="0 0 ${w} ${h}">
        <path d="M${pad},${h - pad} L${w - pad},${h - pad}" class="profile-axis"/>
        <path d="${d} L${w - pad},${h - pad} L${pad},${h - pad} Z" class="profile-area"/>
        <path d="${d}" class="profile-line"/>
        ${labels}
      </svg>
    </div>
  `;
}

function buildProfilePoints(stage) {
  const pts = [{ km: 0, alt: 120 }];
  const climbs = [...(stage.profile.climbs || [])].sort((a, b) => a.km - b.km);

  let alt = 120;

  climbs.forEach(c => {
    const start = clamp(c.km - c.length, 0, stage.distance);
    const gain = c.length * c.gradient * 10;

    pts.push({ km: Math.max(0, start - 8), alt: Math.max(80, alt - 120) });
    pts.push({ km: start, alt });

    alt = clamp(alt + gain, 200, 2600);
    pts.push({ km: c.km, alt });

    alt = Math.max(120, alt - gain * 0.45);
  });

  pts.push({
    km: stage.distance,
    alt: stage.profile.finalClimb ? alt : Math.max(100, alt - 150)
  });

  return pts.sort((a, b) => a.km - b.km);
}

function renderClimbList(stage) {
  const climbs = stage.profile.climbs || [];

  if (!climbs.length) {
    return `<p class="muted small">Sin puertos puntuables.</p>`;
  }

  return `
    <div class="climb-list">
      ${climbs.map(c => `
        <span class="climb-chip cat-${String(c.category).replace("HC", "hc")}">
          ${escapeHtml(c.category)} · ${escapeHtml(c.name)} · km ${c.km} · ${c.length} km al ${c.gradient}%
        </span>
      `).join("")}
    </div>
  `;
}

function renderProtectedRiderSelector(riders) {
  return `
    <h2>Líder protegido</h2>
    <select onchange="setProtectedRider(this.value)">
      ${riders.map(r => `
        <option value="${r.id}" ${Game.protectedRiderId === r.id ? "selected" : ""}>
          ${escapeHtml(r.name)} · ${escapeHtml(r.role)}
        </option>
      `).join("")}
    </select>
  `;
}

function renderSmartPresets() {
  return `
    <h2>Presets inteligentes</h2>
    <div class="preset-row">
      ${SMART_PRESETS.map(p => `
        <button class="secondary" onclick="applySmartPreset('${p.id}')">
          ${escapeHtml(p.name)}
        </button>
      `).join("")}
    </div>
  `;
}

function renderTacticPresets() {
  return `
    <h2>Presets básicos</h2>
    <div class="preset-row">
      ${TACTICS.map(t => `
        <button class="secondary" onclick="applyTacticToAll('${t.id}')">
          Todo: ${escapeHtml(t.name)}
        </button>
      `).join("")}
    </div>
  `;
}

function renderIndividualTactics(riders) {
  return `
    <h2>Estrategia individual</h2>
    <div class="strategy-grid">
      ${riders.map(renderRiderStrategyCard).join("")}
    </div>
  `;
}

function renderRiderStrategyCard(r) {
  const id = Game.riderTactics[r.id] || "balanced";
  const t = getTactic(id);

  return `
    <div class="strategy-card ${Game.protectedRiderId === r.id ? "protected" : ""}">
      <div>
        <div class="badge-row">
          <span class="badge green">${escapeHtml(r.role)}</span>
          <span class="badge blue">Forma ${Math.round(r.form)}</span>
          <span class="badge orange">Fatiga ${Math.round(r.fatigue)}</span>
          <span class="badge">Energía ${Math.round(r.energy)}</span>
          ${Game.protectedRiderId === r.id ? `<span class="badge jersey-yellow">Protegido</span>` : ""}
        </div>
        <h3>${escapeHtml(r.name)}</h3>
        <p class="muted small">${escapeHtml(t.description)}</p>
      </div>

      <select onchange="setRiderTactic('${r.id}', this.value)">
        ${TACTICS.map(x => `
          <option value="${x.id}" ${id === x.id ? "selected" : ""}>
            ${x.name}
          </option>
        `).join("")}
      </select>
    </div>
  `;
}

function renderRiderCard(r) {
  const stats = [
    ["flat", "Llano"],
    ["sprint", "Sprint"],
    ["timeTrial", "CRI"],
    ["mountain", "Montaña"],
    ["cobbles", "Pavés"],
    ["hills", "Muros"],
    ["stamina", "Stamina"],
    ["recovery", "Recovery"],
    ["positioning", "Colocación"],
    ["consistency", "Consistencia"]
  ];

  return `
    <div class="rider-card">
      <div class="badge-row">
        <span class="badge green">${escapeHtml(r.role)}</span>
        <span class="badge">${r.age} años</span>
        <span class="badge orange">Fatiga ${Math.round(r.fatigue)}</span>
        <span class="badge blue">UCI ${r.uciPoints}</span>
        <span class="badge">Moral ${Math.round(r.morale)}</span>
      </div>

      <h4>${escapeHtml(r.name)}</h4>
      <p class="muted small">${escapeHtml(r.nationality)} · ${r.abandoned ? "ABANDONO" : "Activo"}</p>

      ${stats.map(([k, l]) => `
        <div class="stat-row">
          <span>${l}</span>
          <div class="stat-bar">
            <div class="stat-fill" style="width:${clamp(r.stats[k], 0, 100)}%"></div>
          </div>
          <span>${r.stats[k]}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderStageProgressCard(stage, index) {
  const cls =
    index < Game.currentStageIndex ? "done" :
    index === Game.currentStageIndex ? "current" :
    "";

  const status =
    index < Game.currentStageIndex ? "Completada" :
    index === Game.currentStageIndex ? "Actual" :
    "Pendiente";

  return `
    <div class="stage-card ${cls}">
      <div class="badge-row">
        <span class="badge">Etapa ${stage.number}</span>
        <span class="badge blue">${escapeHtml(stage.label)}</span>
        <span class="badge ${index === Game.currentStageIndex ? "green" : ""}">${status}</span>
      </div>
      <strong>${escapeHtml(stage.name)}</strong>
      <div class="muted small">
        ${stage.distance} km · ${stage.profile.climbs.length} puertos · ${stage.profile.elevationGain} m+
      </div>
    </div>
  `;
}

/* ============================================================
   SIMULACIÓN
   ============================================================ */

function simulateCurrentStage() {
  const stage = getCurrentStage();
  const breakawayInfo = generateBreakaway(stage);

  let results =
    stage.type === "team_time_trial"
      ? simulateTeamTimeTrial(stage)
      : simulateRoadStage(stage, breakawayInfo);

  results.sort((a, b) => a.stageTime - b.stageTime);

  applyTimeBonuses(stage, results);

  results.sort((a, b) => a.stageTime - b.stageTime);

  applyEchelons(stage, results);
  applyGroupFinish(stage, results);
  applyCrisis(stage, results);

  results.sort((a, b) => a.stageTime - b.stageTime);

  updateStagePositions(results);
  updateStageWinCounts(results[0]);
  updateRiderTotals(stage, results);
  updateTeamClassification(results);
  updatePointsClassification(stage, results);
  updateMountainClassification(stage, results, breakawayInfo);
  updateUciStagePoints(stage, results);
  assignLeaderOfRaceUciPoint();
  updateMoraleAndFormAfterStage(results);
  recordJerseyHistory(stage);
  recordIncidents(stage, results);

  Game.lastStageResults = {
    stage,
    results,
    breakawayInfo
  };

  Game.stageHistory.push(Game.lastStageResults);

  saveGame();
  renderStageResultScreen();
}

function simulateRoadStage(stage, breakawayInfo) {
  const base = getBaseStageTime(stage);
  const diff = getDifficulty();

  return getAllActiveRiders().map(r => {
    const tactic =
      r.teamId === Game.selectedTeamId
        ? getUserTacticForRider(r)
        : chooseAITactic(r, stage);

    let performance =
      calculatePerformance(r, stage, tactic, breakawayInfo) +
      (r.teamId === Game.selectedTeamId ? diff.userBonus : diff.aiBonus);

    const incident = calculateIncident(r, stage, tactic);

    if (incident?.performancePenalty) {
      performance -= incident.performancePenalty;
    }

    const stageTime =
      convertPerformanceToTime(performance, base, stage) +
      (incident?.timeLoss || 0);

    const fatigueGain =
      calculateFatigueGain(r, stage, tactic, performance) +
      (incident?.fatigue || 0);

    const energyAfter = calculateEnergyAfter(r, stage, tactic, performance, incident);

    return {
      riderId: r.id,
      riderName: r.name,
      teamId: r.teamId,
      teamName: getTeam(r.teamId).name,
      stageTime,
      performance,
      tacticName: tactic.name,
      tacticId: tactic.id,
      fatigueGain,
      energyAfter,
      incident,
      inBreakaway: breakawayInfo.riderIds.includes(r.id),
      groupLabel: ""
    };
  });
}

function simulateTeamTimeTrial(stage) {
  const base = getBaseStageTime(stage);
  const out = [];

  TEAMS.forEach(team => {
    const riders = getTeamRiders(team.id);

    if (!riders.length) return;

    const tactic =
      team.id === Game.selectedTeamId
        ? buildUserTeamTacticAggregate(riders)
        : chooseAITeamTactic(team);

    const score = calculateTeamTimeTrialScore(riders, tactic);
    const teamTime = convertPerformanceToTime(score, base, stage);

    riders.forEach((r, index) => {
      const indTactic =
        team.id === Game.selectedTeamId
          ? getUserTacticForRider(r)
          : tactic;

      const gap =
        index < 5 ? randomBetween(0, 5) :
        index < 7 ? randomBetween(5, 18) :
        randomBetween(15, 35);

      const incident = calculateIncident(r, stage, indTactic, true);
      const perf = score + randomBetween(-1.5, 1.5);

      out.push({
        riderId: r.id,
        riderName: r.name,
        teamId: r.teamId,
        teamName: team.name,
        stageTime: teamTime + gap + (incident?.timeLoss || 0),
        performance: perf,
        tacticName: indTactic.name,
        tacticId: indTactic.id,
        fatigueGain: calculateFatigueGain(r, stage, indTactic, perf),
        energyAfter: calculateEnergyAfter(r, stage, indTactic, perf, incident),
        incident,
        inBreakaway: false,
        groupLabel: ""
      });
    });
  });

  return out;
}

function generateBreakaway(stage) {
  if (["time_trial", "team_time_trial"].includes(stage.type)) {
    return {
      riderIds: [],
      success: false,
      narrative: "Sin fuga en cronos."
    };
  }

  const candidates = getAllActiveRiders().map(r => {
    const tactic =
      r.teamId === Game.selectedTeamId
        ? getUserTacticForRider(r)
        : chooseAITactic(r, stage);

    const leader = getGCLeader();
    const gap = leader ? r.totalTime - leader.totalTime : 0;

    const score =
      (gap > 8 * 60 ? 8 : 0) +
      (["puncheur", "classics", "climber", "rouleur"].includes(r.roleKey) ? 6 : 0) +
      (tactic.id === "aggressive" ? 10 : tactic.id === "all_in" ? 16 : 0) +
      (stage.type === "hilly" ? 7 : stage.type === "mountain" ? 5 : stage.type === "cobbles_hills" ? 8 : -2) +
      randomBetween(0, 8) -
      r.fatigue * 0.15;

    return { rider: r, score };
  }).sort((a, b) => b.score - a.score);

  const chosen = candidates
    .slice(0, clamp(Math.round(randomBetween(3, 8)), 3, 8))
    .filter(c => c.score > 7)
    .map(c => c.rider);

  const chanceBase =
    { flat: 0.10, hilly: 0.36, mountain: 0.28, cobbles_hills: 0.32 }[stage.type] || 0.15;

  const successChance = clamp(
    chanceBase + chosen.length * 0.025 - stage.difficulty * 0.0015,
    0.05,
    0.55
  );

  const success = chosen.length >= 3 && Math.random() < successChance;

  return {
    riderIds: chosen.map(r => r.id),
    success,
    successChance,
    narrative: chosen.length
      ? `Fuga de ${chosen.length}: ${chosen.map(r => r.name).join(", ")}. ${success ? "La fuga llega." : "El pelotón neutraliza la fuga."}`
      : "No se consolidó fuga relevante."
  };
}

function calculatePerformance(r, stage, tactic, breakawayInfo) {
  const s = r.stats;
  let terrain = 0;

  if (stage.type === "flat") {
    terrain =
      s.flat * 0.38 +
      s.sprint * 0.24 +
      s.stamina * 0.14 +
      s.positioning * 0.10 +
      r.form * 0.09 +
      s.recovery * 0.05;
  }

  if (stage.type === "hilly") {
    terrain =
      s.hills * 0.36 +
      s.acceleration * 0.18 +
      s.stamina * 0.14 +
      s.mountain * 0.10 +
      s.positioning * 0.08 +
      r.form * 0.09 +
      s.recovery * 0.05;
  }

  if (stage.type === "time_trial") {
    terrain =
      s.timeTrial * 0.55 +
      s.flat * 0.14 +
      s.stamina * 0.14 +
      r.form * 0.09 +
      s.consistency * 0.08;
  }

  if (stage.type === "mountain") {
    terrain =
      s.mountain * 0.50 +
      s.stamina * 0.18 +
      s.recovery * 0.10 +
      s.downhill * 0.06 +
      r.form * 0.10 +
      s.acceleration * 0.06;
  }

  if (stage.type === "cobbles_hills") {
    terrain =
      s.cobbles * 0.32 +
      s.hills * 0.22 +
      s.positioning * 0.15 +
      s.acceleration * 0.13 +
      s.stamina * 0.12 +
      r.form * 0.06;
  }

  const support = r.teamId === Game.selectedTeamId ? calculateUserSupportBonus(r, stage) : 0;
  const breakBonus =
    breakawayInfo?.riderIds.includes(r.id)
      ? breakawayInfo.success ? 7 : 2
      : 0;

  const moraleBonus = (r.morale - 75) * 0.06;
  const noise = randomBetween(-5, 5) * (1.05 - r.stats.consistency / 200);

  return (
    terrain +
    tactic.bonus +
    support +
    breakBonus +
    moraleBonus +
    noise -
    getFatiguePenalty(r, stage) -
    calculateLongRacePenalty(r, stage)
  );
}

function calculateUserSupportBonus(r, stage) {
  const mates = getTeamRiders(Game.selectedTeamId).filter(m => m.id !== r.id);

  const protectPool = mates.reduce((sum, m) => {
    return sum + (getUserTacticForRider(m).supportBonus || 0) * (m.stats.stamina / 85);
  }, 0);

  const sprintPool = mates.reduce((sum, m) => {
    return sum + (getUserTacticForRider(m).sprintTrainBonus || 0) * (m.stats.flat / 85);
  }, 0);

  let bonus = 0;

  if (r.id === Game.protectedRiderId) {
    bonus += protectPool * ({
      flat: 0.35,
      hilly: 0.75,
      time_trial: 0.10,
      team_time_trial: 0.25,
      mountain: 0.95,
      cobbles_hills: 0.75
    }[stage.type] || 0.5);
  }

  if (r.roleKey === "sprinter" && stage.type === "flat") {
    bonus += sprintPool * 0.90;
  }

  if (r.roleKey === "sprinter" && stage.type === "cobbles_hills") {
    bonus += sprintPool * 0.35;
  }

  return clamp(bonus, 0, 9);
}

function buildUserTeamTacticAggregate(riders) {
  const tactics = riders.map(getUserTacticForRider);

  return {
    id: "mixed",
    name: "Mixta",
    bonus: average(tactics.map(t => t.bonus)),
    risk: average(tactics.map(t => t.risk)),
    fatigueMultiplier: average(tactics.map(t => t.fatigueMultiplier)),
    supportBonus: average(tactics.map(t => t.supportBonus || 0)),
    sprintTrainBonus: average(tactics.map(t => t.sprintTrainBonus || 0))
  };
}

function calculateTeamTimeTrialScore(riders, tactic) {
  const top6 = [...riders]
    .sort((a, b) => b.stats.teamTimeTrial - a.stats.teamTimeTrial)
    .slice(0, 6);

  return (
    average(top6.map(r => r.stats.teamTimeTrial)) * 0.50 +
    average(top6.map(r => r.stats.flat)) * 0.18 +
    average(top6.map(r => r.stats.stamina)) * 0.15 +
    average(top6.map(r => r.form)) * 0.10 +
    clamp(9 - standardDeviation(top6.map(r => r.stats.teamTimeTrial)), 0, 9) +
    tactic.bonus -
    average(riders.map(r => r.fatigue)) * 0.18 -
    (Math.random() < tactic.risk ? randomBetween(2, 9) : 0) +
    randomBetween(-2, 2)
  );
}

function getBaseStageTime(stage) {
  return (stage.distance / ({
    flat: 44,
    hilly: 40,
    time_trial: 50,
    team_time_trial: 52,
    mountain: 34,
    cobbles_hills: 38
  }[stage.type] || 40)) * 3600;
}

function convertPerformanceToTime(perf, base, stage) {
  return (
    base +
    (82 - clamp(perf, 35, 112)) * ({
      flat: 3.0,
      hilly: 6.2,
      time_trial: 5.5,
      team_time_trial: 4.7,
      mountain: 9.0,
      cobbles_hills: 8.2
    }[stage.type] || 5) +
    stage.difficulty * 0.18 +
    randomBetween(-7, 7)
  );
}

function getFatiguePenalty(r, stage) {
  return r.fatigue * ({
    flat: 0.12,
    hilly: 0.24,
    time_trial: 0.18,
    team_time_trial: 0.16,
    mountain: 0.34,
    cobbles_hills: 0.30
  }[stage.type] || 0.2);
}

function calculateLongRacePenalty(r, stage) {
  if ((r.raceDays || 0) < 8) return 0;

  return (
    clamp(85 - r.stats.recovery, 0, 30) *
    ({
      flat: 0.10,
      hilly: 0.22,
      time_trial: 0.18,
      team_time_trial: 0.14,
      mountain: 0.32,
      cobbles_hills: 0.30
    }[stage.type] || 0.2) *
    ((r.raceDays - 7) / 8)
  );
}

function calculateFatigueGain(r, stage, tactic, perf) {
  const base = {
    flat: 4,
    hilly: 8,
    time_trial: 5,
    team_time_trial: 5,
    mountain: 11,
    cobbles_hills: 12
  }[stage.type] || 6;

  const profileStress =
    stage.profile.elevationGain / 1200 +
    stage.profile.heat / 80 +
    (stage.profile.roadSurface === "pavé" ? 2 : 0);

  return clamp(
    (base + stage.difficulty / 20 + profileStress + Math.max(0, (r.raceDays || 0) - 10) * 0.12) *
      tactic.fatigueMultiplier *
      (perf > 86 ? 1.15 : 1) -
      r.stats.recovery / 65 -
      r.stats.stamina / 90,
    1,
    36
  );
}

function calculateDailyRecovery(r, stage) {
  return clamp(
    (r.stats.recovery * 0.085 +
      r.stats.stamina * 0.025 +
      (r.fatigue > 60 ? 0.8 : 0)) *
      ({
        flat: 1.05,
        hilly: 0.80,
        time_trial: 0.90,
        team_time_trial: 0.92,
        mountain: 0.62,
        cobbles_hills: 0.58
      }[stage.type] || 0.8),
    2,
    10
  );
}

function calculateEnergyAfter(r, stage, tactic, perf, incident) {
  const cost =
    (({
      flat: 18,
      hilly: 28,
      time_trial: 26,
      team_time_trial: 24,
      mountain: 38,
      cobbles_hills: 36
    }[stage.type] || 25) +
      stage.difficulty * 0.10) *
      tactic.fatigueMultiplier +
    (incident?.fatigue || 0) -
    r.stats.stamina * 0.08;

  return clamp(100 - r.fatigue * 0.35 - cost, 0, 100);
}

function calculateIncident(r, stage, tactic, isTTT = false) {
  const diff = getDifficulty();

  const risk = clamp(
    (
      (stage.profile.roadSurface === "pavé" ? 0.055 : 0.010) +
      stage.profile.rainRisk / 1000 +
      stage.profile.technicalDescent / 1600 +
      tactic.risk * 0.035 -
      (r.stats.positioning + r.stats.downhill + r.stats.injuryResistance) / 6000 +
      (isTTT ? -0.01 : 0)
    ) * diff.incidentMultiplier,
    0.005,
    0.20
  );

  if (Math.random() > risk) return null;

  const roll = Math.random();

  if (roll < 0.48) {
    return {
      type: "Pinchazo",
      timeLoss: randomBetween(20, 90),
      fatigue: 1.5,
      description: "Pinchazo"
    };
  }

  if (roll < 0.78) {
    return {
      type: "Avería",
      timeLoss: randomBetween(35, 150),
      fatigue: 2,
      description: "Avería mecánica"
    };
  }

  if (roll < 0.96) {
    return {
      type: "Caída leve",
      timeLoss: randomBetween(45, 180),
      fatigue: 5,
      performancePenalty: 4,
      description: "Caída sin abandono"
    };
  }

  return {
    type: "Abandono",
    timeLoss: 1800,
    fatigue: 20,
    performancePenalty: 15,
    abandon: true,
    description: "Caída grave y abandono"
  };
}

function applyTimeBonuses(stage, results) {
  if (!stage.profile.finishBonuses?.length || ["time_trial", "team_time_trial"].includes(stage.type)) return;

  stage.profile.finishBonuses.forEach((b, i) => {
    if (results[i]) {
      results[i].stageTime = Math.max(0, results[i].stageTime - b);
      results[i].bonusSeconds = b;
    }
  });
}

function applyEchelons(stage, results) {
  if (stage.type !== "flat" || stage.profile.windExposure < 60) return;

  results.forEach((res, index) => {
    const r = getRider(res.riderId);
    const tactic =
      res.teamId === Game.selectedTeamId
        ? getUserTacticForRider(r)
        : getTactic("balanced");

    const protection =
      r.stats.positioning * 0.45 +
      r.stats.flat * 0.30 +
      r.stats.stamina * 0.15 +
      (tactic.id === "protect_leader" ? 8 : 0);

    const risk = clamp((stage.profile.windExposure - protection) / 120, 0, 0.55);

    if (index > 15 && Math.random() < risk) {
      const loss = randomBetween(25, 130);
      res.stageTime += loss;
      res.groupLabel = `Corte por viento +${Math.round(loss)}s`;
    }
  });
}

function applyGroupFinish(stage, results) {
  if (!["flat", "hilly", "cobbles_hills"].includes(stage.type)) return;

  results.sort((a, b) => a.stageTime - b.stageTime);

  let groupTime = results[0].stageTime;
  let groupNo = 1;

  results.forEach((res, i) => {
    const threshold =
      stage.type === "flat" ? 18 :
      stage.type === "hilly" ? 10 :
      7;

    if (i > 0 && res.stageTime - groupTime > threshold) {
      groupTime = res.stageTime;
      groupNo++;
    }

    if (!res.incident && !res.groupLabel) {
      res.stageTime = groupTime;
      res.groupLabel = groupNo === 1 ? "Grupo 1" : `Grupo ${groupNo}`;
    }
  });
}

function applyCrisis(stage, results) {
  const diff = getDifficulty();

  if (!["hilly", "mountain", "cobbles_hills"].includes(stage.type)) return;

  results.forEach(res => {
    const r = getRider(res.riderId);

    if (!r || r.abandoned) return;

    const energy = res.energyAfter;

    const risk = clamp(
      ((25 - energy) / 70 + r.fatigue / 250 + stage.profile.heat / 500) * diff.crisisMultiplier,
      0,
      0.45
    );

    if (energy < 25 && Math.random() < risk) {
      const loss = energy < 8 ? randomBetween(300, 900) : randomBetween(60, 240);

      res.stageTime += loss;
      res.crisis = true;
      res.crisisTimeLoss = loss;
      res.fatigueGain += energy < 8 ? 8 : 3;
    }
  });
}

function updateStagePositions(results) {
  results.forEach((r, i) => {
    r.position = i + 1;
  });
}

function updateStageWinCounts(winner) {
  if (!winner) return;

  Game.stageWinCounts[winner.riderId] = (Game.stageWinCounts[winner.riderId] || 0) + 1;
  Game.teamStageWinCounts[winner.teamId] = (Game.teamStageWinCounts[winner.teamId] || 0) + 1;

  const rider = getRider(winner.riderId);

  if (rider) rider.stageWins++;
}

function updateRiderTotals(stage, results) {
  results.forEach(res => {
    const r = getRider(res.riderId);

    if (!r || r.abandoned) return;

    r.totalTime += res.stageTime;
    r.raceDays = (r.raceDays || 0) + 1;
    r.energy = res.energyAfter;
    r.recoveredToday = calculateDailyRecovery(r, stage);
    r.fatigue = clamp(r.fatigue + res.fatigueGain - r.recoveredToday, 0, 100);

    if (res.incident?.abandon) {
      r.abandoned = true;
    }
  });
}

function updateTeamClassification(results) {
  TEAMS.forEach(team => {
    const top = results
      .filter(r => r.teamId === team.id)
      .sort((a, b) => a.stageTime - b.stageTime)
      .slice(0, CLASSIFICATION_RULES.teamClassificationBestRiders);

    if (top.length) {
      Game.teamTimes[team.id] += top.reduce((s, r) => s + r.stageTime, 0);
    }
  });
}

function updatePointsClassification(stage, results) {
  (CLASSIFICATION_RULES.pointsByStageType[stage.type] || []).forEach((pts, i) => {
    const r = getRider(results[i]?.riderId);
    if (r) r.points += pts;
  });

  const sprintRanking = [...results].sort((a, b) => {
    const ra = getRider(a.riderId);
    const rb = getRider(b.riderId);

    return (
      rb.stats.sprint + rb.stats.flat * 0.25 + (b.inBreakaway ? 10 : 0) -
      (ra.stats.sprint + ra.stats.flat * 0.25 + (a.inBreakaway ? 10 : 0))
    );
  });

  (stage.profile.intermediateSprints || []).forEach(() => {
    CLASSIFICATION_RULES.intermediateSprintPoints.forEach((pts, i) => {
      const r = getRider(sprintRanking[i]?.riderId);
      if (r) r.points += pts;
    });
  });
}

function updateMountainClassification(stage, results, breakawayInfo) {
  (stage.profile.climbs || []).forEach(c => {
    const scale = CLASSIFICATION_RULES.mountainPoints[String(c.category)] || [];

    const ranking = [...results].sort((a, b) => {
      const ra = getRider(a.riderId);
      const rb = getRider(b.riderId);

      return (
        rb.stats.mountain +
        rb.stats.hills * 0.35 +
        (breakawayInfo.riderIds.includes(rb.id) ? 7 : 0) +
        randomBetween(0, 6) -
        (
          ra.stats.mountain +
          ra.stats.hills * 0.35 +
          (breakawayInfo.riderIds.includes(ra.id) ? 7 : 0) +
          randomBetween(0, 6)
        )
      );
    });

    scale.forEach((pts, i) => {
      const r = getRider(ranking[i]?.riderId);
      if (r) r.mountainPoints += pts;
    });
  });
}

function updateUciStagePoints(stage, results) {
  const scale = isGrandTour()
    ? CLASSIFICATION_RULES.uci.grandTourStage
    : CLASSIFICATION_RULES.uci.oneDay;

  scale.forEach((pts, i) => {
    const r = getRider(results[i]?.riderId);
    if (r) r.uciPoints += pts;
  });
}

function assignLeaderOfRaceUciPoint() {
  if (!isGrandTour()) return;

  const leader = getGCLeader();

  if (leader) {
    leader.uciPoints += CLASSIFICATION_RULES.uci.stageLeaderPerDay;
  }
}

function assignFinalUciPoints() {
  const key = currentRaceDoneKey();

  if (Game.finalUciAssignedForRace[key]) return;

  if (isGrandTour()) {
    CLASSIFICATION_RULES.uci.grandTourFinalGC.forEach((pts, i) => {
      const r = getGCStandings()[i];
      if (r) r.uciPoints += pts;
    });

    [
      getPointsStandings()[0],
      getMountainStandings()[0],
      getYouthStandings()[0]
    ].forEach(r => {
      if (r) r.uciPoints += CLASSIFICATION_RULES.uci.secondaryFinal[0];
    });
  }

  Game.finalUciAssignedForRace[key] = true;
}

function updateMoraleAndFormAfterStage(results) {
  results.forEach(res => {
    const r = getRider(res.riderId);

    if (!r) return;

    if (res.position === 1) r.morale += 8;
    else if (res.position <= 3) r.morale += 4;
    else if (res.position > 50) r.morale -= 2;

    if (res.incident) r.morale -= 5;
    if (res.crisis) r.morale -= 6;
    if (res.tacticId === "protect_leader") r.morale += 1;

    r.morale = clamp(r.morale, 30, 100);

    const recoveryEffect = (r.stats.recovery - 80) * 0.02;
    const fatigueEffect = r.fatigue > 55 ? -0.7 : 0.2;
    const moraleEffect = (r.morale - 75) * 0.015;

    r.form = clamp(r.form + recoveryEffect + fatigueEffect + moraleEffect, 55, 99);
  });
}

function recordJerseyHistory(stage) {
  Game.jerseyHistory.push({
    raceId: Game.selectedRaceId,
    stage: stage.number,
    gc: getGCStandings()[0]?.id,
    points: getPointsStandings()[0]?.id,
    mountain: getMountainStandings()[0]?.id,
    youth: getYouthStandings()[0]?.id,
    teams: getTeamStandings()[0]?.team.id
  });
}

function recordIncidents(stage, results) {
  results
    .filter(r => r.incident || r.crisis || r.groupLabel?.includes("Corte"))
    .forEach(r => {
      Game.incidentHistory.push({
        raceId: Game.selectedRaceId,
        stage: stage.number,
        riderId: r.riderId,
        riderName: r.riderName,
        type: r.incident?.type || (r.crisis ? "Pájara/Crisis" : "Corte por viento"),
        timeLoss: r.incident?.timeLoss || r.crisisTimeLoss || 0
      });
    });
}

function chooseAITactic(r, stage) {
  const team = getTeam(r.teamId);

  if (r.fatigue > 65) return getTactic("conservative");

  if (stage.type === "mountain" && (team.archetype.includes("GC") || team.archetype.includes("Montaña"))) {
    return getTactic("aggressive");
  }

  if (stage.type === "hilly" && (team.archetype.includes("Clásicas") || team.archetype.includes("Etapas"))) {
    return getTactic("aggressive");
  }

  if (stage.type === "cobbles_hills" && team.archetype.includes("Clásicas")) {
    return getTactic("aggressive");
  }

  if (stage.type === "flat" && team.archetype.includes("Sprint")) {
    return getTactic("sprint_train");
  }

  if (stage.type === "time_trial" && team.archetype.includes("Crono")) {
    return getTactic("aggressive");
  }

  if (Math.random() < 0.06) return getTactic("all_in");

  return getTactic("balanced");
}

function chooseAITeamTactic(team) {
  if (team.archetype.includes("Crono")) return getTactic("aggressive");
  if (team.archetype.includes("GC")) return getTactic("balanced");
  if (Math.random() < 0.12) return getTactic("aggressive");

  return getTactic("balanced");
}

/* ============================================================
   CLASIFICACIONES / OBJETIVOS
   ============================================================ */

function getGCStandings() {
  return getAllActiveRiders().sort((a, b) => a.totalTime - b.totalTime);
}

function getGCLeader() {
  return getGCStandings()[0];
}

function getPointsStandings() {
  return getAllActiveRiders().sort((a, b) => b.points - a.points || a.totalTime - b.totalTime);
}

function getMountainStandings() {
  return getAllActiveRiders().sort((a, b) => b.mountainPoints - a.mountainPoints || a.totalTime - b.totalTime);
}

function getYouthStandings() {
  return getAllActiveRiders()
    .filter(r => r.age <= CLASSIFICATION_RULES.youthMaxAge)
    .sort((a, b) => a.totalTime - b.totalTime);
}

function getUciStandings() {
  return [...Game.riders].sort((a, b) => b.uciPoints - a.uciPoints);
}

function getTeamStandings() {
  return TEAMS.map(team => ({
    team,
    time: Game.teamTimes[team.id] || 0,
    uci: getTeamRiders(team.id).reduce((s, r) => s + r.uciPoints, 0)
  })).sort((a, b) => a.time - b.time);
}

function getStageWinnerIdsForUser() {
  return Game.stageHistory
    .filter(h => h.results[0]?.teamId === Game.selectedTeamId)
    .map(h => h.results[0].riderId);
}

function evaluateObjectives(final = false) {
  const team = getTeam(Game.selectedTeamId);
  const gc = getGCStandings();
  const points = getPointsStandings();
  const mountain = getMountainStandings();
  const youth = getYouthStandings();
  const teams = getTeamStandings();
  const uci = getUciStandings();
  const stageWins = getStageWinnerIdsForUser().length;

  return team.objectives.map(id => {
    let ok = false;
    const bestUserGCPos = gc.findIndex(r => r.teamId === Game.selectedTeamId) + 1;

    if (id === "gc_win") ok = gc[0]?.teamId === Game.selectedTeamId;
    if (id === "gc_top_3") ok = bestUserGCPos > 0 && bestUserGCPos <= 3;
    if (id === "gc_top_5") ok = bestUserGCPos > 0 && bestUserGCPos <= 5;
    if (id === "gc_top_10") ok = bestUserGCPos > 0 && bestUserGCPos <= 10;
    if (id === "stage_win") ok = stageWins >= 1;
    if (id === "stage_wins_2") ok = stageWins >= 2;
    if (id === "stage_wins_3") ok = stageWins >= 3;
    if (id === "points_win") ok = points[0]?.teamId === Game.selectedTeamId;
    if (id === "points_top_3") ok = points.slice(0, 3).some(r => r.teamId === Game.selectedTeamId);
    if (id === "mountain_top_3") ok = mountain.slice(0, 3).some(r => r.teamId === Game.selectedTeamId);
    if (id === "youth_win") ok = youth[0]?.teamId === Game.selectedTeamId;
    if (id === "teams_win") ok = teams[0]?.team.id === Game.selectedTeamId;
    if (id === "uci_top_1") ok = uci[0]?.teamId === Game.selectedTeamId;
    if (id === "uci_top_3") ok = uci.slice(0, 3).some(r => r.teamId === Game.selectedTeamId);
    if (id === "uci_top_5") ok = uci.slice(0, 5).some(r => r.teamId === Game.selectedTeamId);
    if (id === "time_trial_win") {
      ok = Game.stageHistory.some(h => h.stage.type.includes("time_trial") && h.results[0]?.teamId === Game.selectedTeamId);
    }
    if (id === "monument_win") {
      ok = !isGrandTour() && Game.stageHistory[0]?.results[0]?.teamId === Game.selectedTeamId;
    }

    return {
      id,
      ok,
      ...OBJECTIVE_DEFINITIONS[id]
    };
  });
}

function applyObjectiveRewards() {
  const results = evaluateObjectives(true);
  const doneKey = `${Game.selectedRaceId}_objectives`;

  if (Game.objectiveResults.some(x => x.doneKey === doneKey)) return;

  let prestige = 0;
  let budget = 0;

  results.forEach(r => {
    if (r.ok) {
      prestige += r.prestige;
      budget += r.budget;
    }
  });

  const satisfactionDelta =
    Math.round((results.filter(r => r.ok).length / Math.max(1, results.length)) * 35 - 12) *
    getDifficulty().sponsorMultiplier;

  Game.prestige += prestige;
  Game.budget += budget;
  Game.sponsorSatisfaction = clamp(Game.sponsorSatisfaction + satisfactionDelta, 0, 100);

  Game.objectiveResults.push({
    doneKey,
    raceId: Game.selectedRaceId,
    results,
    prestige,
    budget,
    satisfactionDelta
  });
}

/* ============================================================
   RESULTADOS / FINALES
   ============================================================ */

function renderStageResultScreen() {
  const { stage, results, breakawayInfo } = Game.lastStageResults;
  const leaderTime = results[0].stageTime;

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Resultado · ${escapeHtml(stage.name)}</h1>
        <p>${escapeHtml(getRace().name)} · ${escapeHtml(stage.label)} · ${stage.distance} km</p>
      </div>
      <div class="top-actions">
        <button class="secondary" onclick="saveGame(true)">Guardar</button>
        <button class="danger" onclick="initGame()">Reiniciar</button>
      </div>
    </div>

    ${renderLeaderCards()}

    <div class="panel" style="margin-top:16px;">
      <h2>Narrativa</h2>
      <p class="help">${escapeHtml(breakawayInfo.narrative)}</p>
      ${renderIncidentSummary(results)}
    </div>

    <div class="result-layout" style="margin-top:16px;">
      <section class="panel">
        <h2>Clasificación de etapa</h2>
        ${renderStageResultsTable(results, leaderTime)}
      </section>

      <section class="panel">
        <h2>Clasificaciones</h2>
        ${renderGeneralClassificationTable(25)}
        <hr>
        ${renderMiniClassifications()}
      </section>
    </div>

    <div class="panel" style="margin-top:16px;">
      <h2>Lectura rápida</h2>
      ${renderStageAnalysis(stage, results)}

      <div class="simulation-actions">
        <button class="secondary" onclick="renderRaceScreen()">Ver carrera</button>
        <button onclick="goToNextStage()">
          ${Game.currentStageIndex >= getStages().length - 1 ? "Ver clasificación final" : "Siguiente etapa"}
        </button>
      </div>
    </div>
  `;
}

function renderIncidentSummary(results) {
  const incidents = results
    .filter(r => r.incident || r.crisis || r.groupLabel?.includes("Corte"))
    .slice(0, 10);

  return incidents.length
    ? `
      <div class="incident-list">
        ${incidents.map(r => `
          <span class="incident-chip">
            ${escapeHtml(r.riderName)}: ${escapeHtml(r.incident?.type || (r.crisis ? "Pájara" : "Corte"))}
            ${r.incident?.timeLoss || r.crisisTimeLoss ? `(+${Math.round(r.incident?.timeLoss || r.crisisTimeLoss)}s)` : ""}
          </span>
        `).join("")}
      </div>
    `
    : `<p class="muted small">Sin incidentes importantes.</p>`;
}

function renderStageResultsTable(results, leaderTime) {
  return `
    <table>
      <thead>
        <tr>
          <th>Pos</th>
          <th>Corredor</th>
          <th>Equipo</th>
          <th>Tiempo</th>
          <th>Dif.</th>
          <th>Grupo</th>
          <th>Estrategia</th>
          <th>Bonus</th>
          <th>UCI</th>
          <th>Inc.</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(r => `
          <tr class="${r.teamId === Game.selectedTeamId ? "user-team" : ""}">
            <td>${r.position}</td>
            <td>${escapeHtml(r.riderName)}${r.inBreakaway ? " ⚡" : ""}</td>
            <td>${escapeHtml(r.teamName)}</td>
            <td>${secondsToTime(r.stageTime)}</td>
            <td>${gapToLeader(r.stageTime, leaderTime)}</td>
            <td>${escapeHtml(r.groupLabel || "—")}</td>
            <td>${escapeHtml(r.tacticName)}</td>
            <td>${r.bonusSeconds ? `-${r.bonusSeconds}s` : "—"}</td>
            <td>${(isGrandTour() ? CLASSIFICATION_RULES.uci.grandTourStage : CLASSIFICATION_RULES.uci.oneDay)[r.position - 1] || 0}</td>
            <td>${r.incident ? escapeHtml(r.incident.type) : (r.crisis ? "Pájara" : "—")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderGeneralClassificationTable(limit = 25) {
  const race = getRace();
  const st = getGCStandings().slice(0, limit);
  const leader = st[0];
  const leaderTime = leader ? leader.totalTime : 0;

  if (!Game.stageHistory.length) {
    return `
      <p class="muted">Todavía no se ha disputado ninguna etapa.</p>
      <table>
        <thead>
          <tr>
            <th>Corredor</th>
            <th>Equipo</th>
            <th>Perfil</th>
            <th>Edad</th>
          </tr>
        </thead>
        <tbody>
          ${Game.riders.slice(0, limit).map(r => `
            <tr class="${r.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${escapeHtml(r.name)}</td>
              <td>${escapeHtml(getTeam(r.teamId).name)}</td>
              <td>${escapeHtml(r.role)}</td>
              <td>${r.age}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Pos</th>
          <th>Corredor</th>
          <th>Equipo</th>
          <th>Tiempo</th>
          <th>Dif.</th>
          <th>Fat.</th>
          <th>Mor.</th>
          <th>Pts</th>
          <th>Mont.</th>
          <th>UCI</th>
        </tr>
      </thead>
      <tbody>
        ${st.map((r, i) => `
          <tr class="${r.teamId === Game.selectedTeamId ? "user-team" : ""} ${i === 0 ? `race-leader ${race.leaderJerseyClass}` : ""}">
            <td>${i + 1}</td>
            <td>${escapeHtml(r.name)}${r.abandoned ? " ❌" : ""}</td>
            <td>${escapeHtml(getTeam(r.teamId).name)}</td>
            <td>${secondsToTime(r.totalTime)}</td>
            <td>${gapToLeader(r.totalTime, leaderTime)}</td>
            <td>${Math.round(r.fatigue)}</td>
            <td>${Math.round(r.morale)}</td>
            <td>${r.points}</td>
            <td>${r.mountainPoints}</td>
            <td>${r.uciPoints}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderMiniClassifications() {
  return `
    <div class="classification-grid">
      ${renderSmallTable("Puntos", getPointsStandings(), "points", "pts")}
      ${renderSmallTable("Montaña", getMountainStandings(), "mountainPoints", "pts")}
      ${renderSmallTable("Jóvenes", getYouthStandings(), "totalTime", "time")}
      ${renderTeamTable()}
      ${renderSmallTable("UCI", getUciStandings(), "uciPoints", "pts")}
      ${renderStageWinsTable()}
    </div>
  `;
}

function renderSmallTable(title, riders, key, mode) {
  return `
    <div class="mini-classification">
      <h3>${escapeHtml(title)}</h3>
      <table>
        <tbody>
          ${riders.slice(0, 5).map((r, i) => `
            <tr class="${r.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${i + 1}</td>
              <td>${escapeHtml(r.name)}</td>
              <td>${mode === "time" ? secondsToTime(r[key]) : r[key]}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderTeamTable() {
  const teams = getTeamStandings();
  const lead = teams[0]?.time || 0;

  return `
    <div class="mini-classification">
      <h3>Equipos</h3>
      <table>
        <tbody>
          ${teams.slice(0, 5).map((x, i) => `
            <tr class="${x.team.id === Game.selectedTeamId ? "user-team" : ""}">
              <td>${i + 1}</td>
              <td>${escapeHtml(x.team.name)}</td>
              <td>${gapToLeader(x.time, lead)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderStageWinsTable() {
  const items = Object.entries(Game.stageWinCounts)
    .map(([id, n]) => ({ r: getRider(id), n }))
    .filter(x => x.r)
    .sort((a, b) => b.n - a.n);

  return `
    <div class="mini-classification">
      <h3>Victorias</h3>
      <table>
        <tbody>
          ${items.slice(0, 5).map((x, i) => `
            <tr class="${x.r.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${i + 1}</td>
              <td>${escapeHtml(x.r.name)}</td>
              <td>${x.n}</td>
            </tr>
          `).join("") || `<tr><td>—</td><td>Sin victorias</td><td>0</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderObjectivePanel() {
  const evals = evaluateObjectives(false);

  return `
    <div class="objectives-panel">
      ${evals.map(o => `
        <div class="objective-row ${o.ok ? "ok" : "bad"}">
          <span>${o.ok ? "✅" : "❌"}</span>
          <strong>${escapeHtml(o.label)}</strong>
          <small>Prestigio ${o.prestige} · ${money(o.budget)}</small>
        </div>
      `).join("")}
      <hr>
      <p class="muted small">
        Presupuesto: ${money(Game.budget)} · Prestigio: ${Math.round(Game.prestige)} · Satisfacción sponsor: ${Math.round(Game.sponsorSatisfaction)}/100
      </p>
    </div>
  `;
}

function renderStageAnalysis(stage, results) {
  const user = results
    .filter(r => r.teamId === Game.selectedTeamId)
    .sort((a, b) => a.stageTime - b.stageTime)[0];

  const winner = results[0];
  const gc = getGCStandings();
  const best = gc.find(r => r.teamId === Game.selectedTeamId);
  const pos = gc.findIndex(r => r.id === best?.id) + 1;

  return `
    <div class="grid three">
      <div class="stage-card">
        <span class="muted">Ganador</span>
        <div class="big-number">#1</div>
        <strong>${escapeHtml(winner.riderName)}</strong>
      </div>

      <div class="stage-card">
        <span class="muted">Mejor equipo</span>
        <div class="big-number">${user.position}</div>
        <strong>${escapeHtml(user.riderName)}</strong>
      </div>

      <div class="stage-card">
        <span class="muted">Tu mejor GC</span>
        <div class="big-number">${pos}</div>
        <strong>${best ? escapeHtml(best.name) : "—"}</strong>
      </div>
    </div>

    <p class="help">${getStageComment(stage)}</p>
  `;
}

function getStageComment(stage) {
  if (stage.type === "mountain") {
    return "Montaña: proteger líder, gestionar energía y evitar pájaras es decisivo.";
  }

  if (stage.type === "hilly") {
    return "Media montaña: terreno ideal para fugas, puncheurs y bonificaciones.";
  }

  if (stage.type === "flat") {
    return stage.profile.windExposure > 60
      ? "Llano con viento: atención a cortes y colocación."
      : "Llano: sprint, tren de lanzamiento y puntos.";
  }

  if (stage.type === "cobbles_hills") {
    return "Pavés/muros: colocación, consistencia e incidentes pesan muchísimo.";
  }

  if (stage.type === "time_trial") {
    return "CRI: timeTrial, forma y fatiga deciden.";
  }

  return "CRE: bloque y homogeneidad del equipo.";
}

function goToNextStage() {
  if (Game.currentStageIndex >= getStages().length - 1) {
    Game.finished = true;
    assignFinalUciPoints();
    applyObjectiveRewards();
    saveGame();
    renderFinalScreen();
    return;
  }

  Game.currentStageIndex++;
  resetUserRiderTactics("balanced");
  Game.activeTab = "strategy";

  saveGame();
  renderRaceScreen();
}

function renderFinalScreen() {
  assignFinalUciPoints();
  applyObjectiveRewards();

  const race = getRace();

  return app.innerHTML = `
    <div class="header">
      <div>
        <h1>Final · ${escapeHtml(race.name)} 🏆</h1>
        <p>${getStages().length} etapa${getStages().length > 1 ? "s" : ""} · ${Game.mode === "season" ? `Temporada ${Game.seasonRaceIndex + 1}/${Game.seasonRaceIds.length}` : "Carrera única"}</p>
      </div>

      <div class="top-actions">
        <button class="secondary" onclick="saveGame(true)">Guardar</button>
        <button onclick="continueAfterRace()">
          ${Game.mode === "season" && Game.seasonRaceIndex < Game.seasonRaceIds.length - 1 ? "Entrenar y seguir temporada" : "Finalizar"}
        </button>
      </div>
    </div>

    ${renderLeaderCards()}

    <div class="grid two" style="margin-top:16px;">
      <section class="panel">
        <h2>Podio</h2>
        ${getGCStandings().slice(0, 3).map((r, i) => `
          <div class="stage-card ${i === 0 ? race.leaderJerseyClass : ""}">
            <span class="badge green">#${i + 1}</span>
            <h3>${escapeHtml(r.name)}</h3>
            <p class="muted">${escapeHtml(getTeam(r.teamId).name)} · ${secondsToTime(r.totalTime)} · UCI ${r.uciPoints}</p>
          </div>
        `).join("")}

        <hr>

        <h2>Objetivos</h2>
        ${renderObjectivePanel()}
      </section>

      <section class="panel">
        <h2>General completa</h2>
        ${renderGeneralClassificationTable(80)}
      </section>
    </div>

    <section class="panel" style="margin-top:16px;">
      <h2>Historial</h2>
      ${renderStageHistorySummary()}
      ${renderJerseyHistoryTable()}
    </section>
  `;
}

function continueAfterRace() {
  if (Game.mode !== "season") {
    renderHome();
    return;
  }

  if (Game.seasonRaceIndex >= Game.seasonRaceIds.length - 1) {
    Game.seasonFinished = true;
    saveGame();
    renderSeasonFinalScreen();
    return;
  }

  Game.betweenRaces = true;
  saveGame();
  renderTrainingScreen();
}

function renderTrainingScreen() {
  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Entre carreras 🧪</h1>
        <p>Aplica un bloque de entrenamiento antes de la siguiente carrera.</p>
      </div>
    </div>

    <section class="panel">
      <h2>Estado del equipo</h2>
      <p class="help">
        Presupuesto ${money(Game.budget)} · Prestigio ${Math.round(Game.prestige)} · Sponsor ${Math.round(Game.sponsorSatisfaction)}/100
      </p>

      <div class="race-grid">
        ${TRAINING_OPTIONS.map(o => `
          <button class="race-card" onclick="applyTrainingAndNextRace('${o.id}')">
            <span class="race-title">${escapeHtml(o.name)}</span>
            <span class="muted small">${escapeHtml(o.description)}</span>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="panel" style="margin-top:16px;">
      <h2>Equipo</h2>
      <div class="rider-grid">
        ${getTeamRiders(Game.selectedTeamId).map(renderRiderCard).join("")}
      </div>
    </section>
  `;
}

function applyTrainingAndNextRace(optionId) {
  const opt = TRAINING_OPTIONS.find(o => o.id === optionId);

  if (!opt) return;

  Game.riders
    .filter(r => r.teamId === Game.selectedTeamId)
    .forEach(r => {
      r.fatigue = clamp(r.fatigue + (opt.effects.fatigue || 0), 0, 100);
      r.form = clamp(r.form + (opt.effects.form || 0), 55, 99);
      r.morale = clamp(r.morale + (opt.effects.morale || 0), 30, 100);

      ["mountain", "stamina", "timeTrial", "teamTimeTrial", "sprint", "positioning", "acceleration"].forEach(k => {
        if (opt.effects[k]) {
          r.stats[k] = clamp(r.stats[k] + opt.effects[k], 42, 99);
        }
      });
    });

  Game.seasonRaceIndex++;
  Game.selectedRaceId = Game.seasonRaceIds[Game.seasonRaceIndex];

  startRaceState(false);
  saveGame();
  renderRaceScreen();
}

function renderSeasonFinalScreen() {
  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Temporada finalizada 🌈</h1>
        <p>Ranking UCI acumulado y balance de objetivos.</p>
      </div>

      <div class="top-actions">
        <button onclick="initGame()">Nueva partida</button>
      </div>
    </div>

    <div class="grid two">
      <section class="panel">
        <h2>Ranking UCI</h2>
        ${renderSmallTable("UCI", getUciStandings(), "uciPoints", "pts")}
      </section>

      <section class="panel">
        <h2>Balance manager</h2>
        <p class="help">
          Presupuesto: ${money(Game.budget)}<br>
          Prestigio: ${Math.round(Game.prestige)}<br>
          Satisfacción sponsor: ${Math.round(Game.sponsorSatisfaction)}/100
        </p>
        ${renderObjectivePanel()}
      </section>
    </div>
  `;
}

function renderRivalComparison() {
  const gc = getGCStandings();
  const userBest = gc.find(r => r.teamId === Game.selectedTeamId);
  const userPos = gc.findIndex(r => r.id === userBest?.id);
  const rival =
    gc.find((r, i) => r.teamId !== Game.selectedTeamId && Math.abs(i - userPos) <= 2) ||
    gc.find(r => r.teamId !== Game.selectedTeamId);

  return `
    <div class="rival-card">
      <h2>Rival directo</h2>
      ${userBest && rival
        ? `
          <p class="help">
            Tu líder: <strong>${escapeHtml(userBest.name)}</strong><br>
            Rival: <strong>${escapeHtml(rival.name)}</strong><br>
            Diferencia: <strong>${gapToLeader(userBest.totalTime, rival.totalTime)}</strong>
          </p>
        `
        : `<p class="muted">Disponible tras la primera etapa.</p>`}
    </div>
  `;
}

function renderStageHistorySummary() {
  return `
    <table>
      <thead>
        <tr>
          <th>Etapa</th>
          <th>Tipo</th>
          <th>Ganador</th>
          <th>Equipo</th>
          <th>Fuga</th>
        </tr>
      </thead>
      <tbody>
        ${Game.stageHistory.map(h => `
          <tr class="${h.results[0]?.teamId === Game.selectedTeamId ? "user-team" : ""}">
            <td>${escapeHtml(h.stage.name)}</td>
            <td>${escapeHtml(h.stage.label)}</td>
            <td>${escapeHtml(h.results[0]?.riderName || "—")}</td>
            <td>${escapeHtml(h.results[0]?.teamName || "—")}</td>
            <td>${h.breakawayInfo?.success ? "Llegó" : "Neutralizada"}</td>
          </tr>
        `).join("") || `<tr><td>—</td><td colspan="4">Sin etapas disputadas</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderJerseyHistoryTable() {
  return `
    <table>
      <thead>
        <tr>
          <th>Etapa</th>
          <th>GC</th>
          <th>Puntos</th>
          <th>Montaña</th>
          <th>Joven</th>
          <th>Equipos</th>
        </tr>
      </thead>
      <tbody>
        ${Game.jerseyHistory.map(j => `
          <tr>
            <td>${j.stage}</td>
            <td>${escapeHtml(getRider(j.gc)?.name || "—")}</td>
            <td>${escapeHtml(getRider(j.points)?.name || "—")}</td>
            <td>${escapeHtml(getRider(j.mountain)?.name || "—")}</td>
            <td>${escapeHtml(getRider(j.youth)?.name || "—")}</td>
            <td>${escapeHtml(getTeam(j.teams)?.name || "—")}</td>
          </tr>
        `).join("") || `<tr><td>—</td><td colspan="5">Sin historial</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderIncidentHistory() {
  return `
    <div class="incident-list">
      ${Game.incidentHistory.slice(-20).map(i => `
        <span class="incident-chip">
          Et. ${i.stage} · ${escapeHtml(i.riderName)} · ${escapeHtml(i.type)}
          ${i.timeLoss ? `+${Math.round(i.timeLoss)}s` : ""}
        </span>
      `).join("") || `<span class="muted small">Sin incidencias.</span>`}
    </div>
  `;
}

initGame();
