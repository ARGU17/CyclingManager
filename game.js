/* ============================================================
   CYCLING MANAGER TOUR - game.js
   v0.6: etapa viva por sectores, nutrición, material,
   radio, pelotón, órdenes en carrera y sistemas manager.
   ============================================================ */

const app = document.getElementById("app");
const SAVE_KEY = "cyclingManagerTour_v06";

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
  riderEquipment: {},
  nutritionPlanId: "auto_balanced",
  teamNutritionStock: {},

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

  liveStage: null,

  finished: false,
  seasonFinished: false
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function standardDeviation(values) {
  const avg = average(values);
  return values.length ? Math.sqrt(average(values.map(value => Math.pow(value - avg, 2)))) : 0;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return `${Math.round(value / 1000000 * 10) / 10} M€`;
}

function secondsToTime(seconds) {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function gapToLeader(seconds, leaderSeconds) {
  const gap = Math.round(seconds - leaderSeconds);
  return gap <= 0 ? "m.t." : `+${secondsToTime(gap)}`;
}

function getRace() {
  return RACES.find(race => race.id === Game.selectedRaceId) || RACES[0];
}

function getStages() {
  return getRace().stages;
}

function getCurrentStage() {
  return getStages()[Game.currentStageIndex];
}

function getTeam(teamId) {
  return TEAMS.find(team => team.id === teamId);
}

function getTeamBlueprint(teamId) {
  return TEAM_BLUEPRINTS.find(team => team.id === teamId);
}

function getRider(riderId) {
  return Game.riders.find(rider => rider.id === riderId);
}

function getTactic(tacticId) {
  return TACTICS.find(tactic => tactic.id === tacticId) || TACTICS.find(tactic => tactic.id === "balanced");
}

function getBike(bikeId) {
  return BIKE_SETUPS.find(bike => bike.id === bikeId) || BIKE_SETUPS[0];
}

function getWheels(wheelsId) {
  return WHEEL_SETUPS.find(wheels => wheels.id === wheelsId) || WHEEL_SETUPS[0];
}

function getNutritionItem(itemId) {
  return NUTRITION_ITEMS.find(item => item.id === itemId);
}

function getNutritionPlan() {
  return NUTRITION_PLANS.find(plan => plan.id === Game.nutritionPlanId) || NUTRITION_PLANS[0];
}

function getDifficulty() {
  return DIFFICULTY_LEVELS[Game.difficulty] || DIFFICULTY_LEVELS.normal;
}

function getAllActiveRiders() {
  return Game.riders.filter(rider => !rider.abandoned);
}

function getTeamRiders(teamId) {
  return Game.riders.filter(rider => rider.teamId === teamId && !rider.abandoned);
}

function getUserTacticForRider(rider) {
  return getTactic(Game.riderTactics[rider.id] || "balanced");
}

function isGrandTour() {
  return getRace().uciClass === "grand_tour";
}

function isLiveStageActive() {
  return Game.liveStage && Game.liveStage.active;
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
   INICIO
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
  Game.riderEquipment = {};
  Game.nutritionPlanId = "auto_balanced";
  Game.teamNutritionStock = {};

  Game.riders = deepClone(RIDERS);
  Game.teamTimes = Object.fromEntries(TEAMS.map(team => [team.id, 0]));
  Game.stageHistory = [];
  Game.jerseyHistory = [];
  Game.incidentHistory = [];
  Game.objectiveResults = [];
  Game.lastStageResults = null;
  Game.finalUciAssignedForRace = {};
  Game.stageWinCounts = {};
  Game.teamStageWinCounts = {};

  Game.budget = 0;
  Game.prestige = 0;
  Game.sponsorSatisfaction = 75;

  Game.liveStage = null;

  Game.finished = false;
  Game.seasonFinished = false;

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
  Game.liveStage = null;
  Game.riderTactics = {};
  Game.riderEquipment = {};
  Game.teamNutritionStock = {};

  Game.teamTimes = Object.fromEntries(TEAMS.map(team => [team.id, 0]));
  Game.stageHistory = [];
  Game.jerseyHistory = [];
  Game.incidentHistory = [];
  Game.objectiveResults = [];
  Game.lastStageResults = null;
  Game.finalUciAssignedForRace[Game.selectedRaceId] = false;

  if (resetRidersForNewGame) {
    Game.riders.forEach(rider => {
      rider.fatigue = 0;
      rider.energy = 100;
      rider.totalTime = 0;
      rider.raceDays = 0;
      rider.points = 0;
      rider.mountainPoints = 0;
      rider.abandoned = false;
      rider.stageWins = 0;
    });
  } else {
    Game.riders.forEach(rider => {
      rider.totalTime = 0;
      rider.raceDays = 0;
      rider.points = 0;
      rider.mountainPoints = 0;
      rider.abandoned = false;
      rider.stageWins = 0;
      rider.fatigue = clamp(rider.fatigue, 0, 70);
      rider.energy = 100;
    });
  }

  Game.protectedRiderId = getTeamRiders(Game.selectedTeamId)[0]?.id || null;

  resetUserRiderTactics("balanced");
  applyEquipmentPreset("auto");
  setNutritionPlan("auto_balanced", false);
}

function resetUserRiderTactics(tacticId = "balanced") {
  Game.riderTactics = {};

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    Game.riderTactics[rider.id] = tacticId;
  });
}

function setRiderTactic(riderId, tacticId) {
  Game.riderTactics[riderId] = tacticId;
  renderRaceScreen();
}

function applyTacticToAll(tacticId) {
  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    Game.riderTactics[rider.id] = tacticId;
  });

  renderRaceScreen();
}

function setProtectedRider(riderId) {
  Game.protectedRiderId = riderId;
  renderRaceScreen();
}

function applySmartPreset(presetId) {
  const stage = getCurrentStage();

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    let tactic = "balanced";

    if (presetId === "protect_gc") {
      tactic = rider.id === Game.protectedRiderId ? "balanced" : "protect_leader";
    }

    if (presetId === "sprint") {
      tactic =
        rider.roleKey === "sprinter"
          ? "aggressive"
          : ["rouleur", "classics", "domestique"].includes(rider.roleKey)
            ? "sprint_train"
            : "conservative";
    }

    if (presetId === "breakaway") {
      tactic =
        ["puncheur", "classics", "rouleur", "climber"].includes(rider.roleKey)
          ? "aggressive"
          : "conservative";
    }

    if (presetId === "mountain_attack") {
      tactic =
        ["gc", "co_leader", "climber"].includes(rider.roleKey)
          ? "aggressive"
          : "protect_leader";
    }

    if (presetId === "survival") {
      tactic = "conservative";
    }

    if (presetId === "time_trial") {
      tactic =
        ["gc", "co_leader", "time_trialist"].includes(rider.roleKey) ||
        ["time_trial", "team_time_trial"].includes(stage.type)
          ? "aggressive"
          : "balanced";
    }

    Game.riderTactics[rider.id] = tactic;
  });

  renderRaceScreen();
}

/* ============================================================
   MATERIAL / NUTRICIÓN
   ============================================================ */

function autoEquipmentForStage(stage) {
  if (stage.type === "time_trial" || stage.type === "team_time_trial") {
    return { bike: "tt", wheels: "disc_tt" };
  }

  if (stage.type === "mountain") {
    return { bike: "lightweight", wheels: "climbing" };
  }

  if (stage.type === "cobbles_hills" || stage.profile.roadSurface === "pavé") {
    return { bike: "endurance", wheels: "cobbles" };
  }

  if (stage.type === "hilly") {
    return { bike: "lightweight", wheels: "shallow_35" };
  }

  if (stage.profile.windExposure > 65 || stage.profile.rainRisk > 45) {
    return { bike: "endurance", wheels: "shallow_35" };
  }

  return { bike: "aero", wheels: "deep_60" };
}

function applyEquipmentPreset(presetId) {
  const stage = getCurrentStage();

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    let setup;

    if (presetId === "auto") {
      setup = autoEquipmentForStage(stage);
    } else {
      const preset = EQUIPMENT_PRESETS.find(item => item.id === presetId);
      setup = preset ? { bike: preset.bike, wheels: preset.wheels } : autoEquipmentForStage(stage);
    }

    Game.riderEquipment[rider.id] = setup;
  });

  renderRaceScreen();
}

function setRiderBike(riderId, bikeId) {
  Game.riderEquipment[riderId] = Game.riderEquipment[riderId] || autoEquipmentForStage(getCurrentStage());
  Game.riderEquipment[riderId].bike = bikeId;
  renderRaceScreen();
}

function setRiderWheels(riderId, wheelsId) {
  Game.riderEquipment[riderId] = Game.riderEquipment[riderId] || autoEquipmentForStage(getCurrentStage());
  Game.riderEquipment[riderId].wheels = wheelsId;
  renderRaceScreen();
}

function getRiderEquipment(riderId) {
  if (!Game.riderEquipment[riderId]) {
    Game.riderEquipment[riderId] = autoEquipmentForStage(getCurrentStage());
  }

  return Game.riderEquipment[riderId];
}

function setNutritionPlan(planId, rerender = true) {
  Game.nutritionPlanId = planId;
  const plan = getNutritionPlan();
  Game.teamNutritionStock = deepClone(plan.stock);

  if (rerender) {
    renderRaceScreen();
  }
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
        <p>v0.6 · etapa por sectores · nutrición · material · radio · órdenes en carrera</p>
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
        ${Object.entries(DIFFICULTY_LEVELS).map(([id, difficulty]) => `
          <button class="secondary ${Game.difficulty === id ? "active-soft" : ""}" onclick="selectDifficulty('${id}')">
            ${escapeHtml(difficulty.label)}
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
        ${RACES.map(race => `
          <button class="race-card ${Game.selectedRaceId === race.id ? "active" : ""}" onclick="selectRace('${race.id}')">
            <span class="race-title">${escapeHtml(race.name)}</span>
            <span class="badge ${race.leaderJerseyClass}">${escapeHtml(race.leaderJerseyName)}</span>
            <span class="muted small">${race.stages.length} etapa${race.stages.length > 1 ? "s" : ""} · ${escapeHtml(race.country)} · ${escapeHtml(race.uciClass)}</span>
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
        ${Game.seasonRaceIds.map((id, index) => {
          const race = RACES.find(item => item.id === id);

          return `
            <div class="stage-card">
              <span class="badge green">${index + 1}</span>
              <strong>${escapeHtml(race.name)}</strong>
              <p class="muted small">${race.stages.length} etapa${race.stages.length > 1 ? "s" : ""} · ${escapeHtml(race.uciClass)}</p>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderTeamCard(team) {
  const riders = RIDERS.filter(rider => rider.teamId === team.id);

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
        ${riders.map(rider => `<span class="badge">${escapeHtml(rider.name)}</span>`).join("")}
      </div>
      <div class="objectives-list">
        ${team.objectives.map(id => `<span class="objective-chip">${escapeHtml(OBJECTIVE_DEFINITIONS[id].label)}</span>`).join("")}
      </div>
      <button onclick="startWithTeam('${team.id}')">Competir con este equipo</button>
    </div>
  `;
}

/* ============================================================
   RENDER PRINCIPAL
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

  if (isLiveStageActive()) {
    renderLiveStageScreen();
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
    ["equipment", "Material"],
    ["nutrition", "Nutrición"],
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
  if (Game.activeTab === "equipment") return renderEquipmentTab();
  if (Game.activeTab === "nutrition") return renderNutritionTab();
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

function renderLeaderCard(title, rider, className, value) {
  return `
    <div class="leader-card ${className}">
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
            <strong>Etapa por sectores</strong>
            <div class="muted small">La etapa no se resuelve de golpe: podrás cambiar estrategia, comer y dar órdenes entre sectores.</div>
          </div>
          <button onclick="startLiveStage()">Iniciar etapa</button>
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

function renderEquipmentTab() {
  return `
    <section class="panel">
      <h2>Material de carrera</h2>
      <p class="help">El material afecta rendimiento y riesgo: aero en llano, ligera en montaña, endurance en pavés, cabra en crono.</p>

      <div class="preset-row">
        ${EQUIPMENT_PRESETS.map(preset => `
          <button class="secondary" onclick="applyEquipmentPreset('${preset.id}')">
            ${escapeHtml(preset.name)}
          </button>
        `).join("")}
      </div>

      <div class="strategy-grid">
        ${getTeamRiders(Game.selectedTeamId).map(renderEquipmentCard).join("")}
      </div>
    </section>
  `;
}

function renderEquipmentCard(rider) {
  const setup = getRiderEquipment(rider.id);

  return `
    <div class="strategy-card">
      <h3>${escapeHtml(rider.name)}</h3>
      <p class="muted small">${escapeHtml(rider.role)} · ${escapeHtml(rider.nationality)}</p>

      <label class="field-label">Bici</label>
      <select onchange="setRiderBike('${rider.id}', this.value)">
        ${BIKE_SETUPS.map(bike => `
          <option value="${bike.id}" ${setup.bike === bike.id ? "selected" : ""}>
            ${bike.name}
          </option>
        `).join("")}
      </select>

      <label class="field-label">Ruedas</label>
      <select onchange="setRiderWheels('${rider.id}', this.value)">
        ${WHEEL_SETUPS.map(wheels => `
          <option value="${wheels.id}" ${setup.wheels === wheels.id ? "selected" : ""}>
            ${wheels.name}
          </option>
        `).join("")}
      </select>

      <p class="muted small">
        ${escapeHtml(getBike(setup.bike).description)} · ${escapeHtml(getWheels(setup.wheels).description)}
      </p>
    </div>
  `;
}

function renderNutritionTab() {
  const plan = getNutritionPlan();

  return `
    <section class="panel">
      <h2>Nutrición de carrera</h2>
      <p class="help">La alimentación influye en energía, hidratación, riesgo de pájara y rendimiento en el final.</p>

      <div class="race-grid">
        ${NUTRITION_PLANS.map(item => `
          <button class="race-card ${Game.nutritionPlanId === item.id ? "active" : ""}" onclick="setNutritionPlan('${item.id}')">
            <span class="race-title">${escapeHtml(item.name)}</span>
            <span class="muted small">${escapeHtml(item.description)}</span>
          </button>
        `).join("")}
      </div>

      <hr>

      <h2>Stock inicial del coche</h2>
      ${renderNutritionStock(plan.stock)}

      <hr>

      <h2>Productos</h2>
      <div class="nutrition-grid">
        ${NUTRITION_ITEMS.map(item => `
          <div class="nutrition-card">
            <h3>${escapeHtml(item.name)}</h3>
            <p class="muted small">${escapeHtml(item.description)}</p>
            <div class="badge-row">
              <span class="badge green">Energía +${item.energy}</span>
              <span class="badge blue">Hidratación ${item.hydration >= 0 ? "+" : ""}${item.hydration}</span>
              <span class="badge orange">Estómago +${item.stomachLoad}</span>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderNutritionStock(stock) {
  return `
    <div class="badge-row">
      ${Object.entries(stock).map(([id, amount]) => {
        const item = getNutritionItem(id);
        return `<span class="badge">${escapeHtml(item?.name || id)} x${amount}</span>`;
      }).join("")}
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
        <span class="badge">${stage.sectors.length} sectores</span>
      </div>
      <h2>${escapeHtml(stage.name)}</h2>
      <p class="help">${escapeHtml(stage.description)}</p>
      ${renderWeather(stage)}
      ${renderStageProfile(stage)}
      ${renderClimbList(stage)}
      ${renderSectorTimeline(stage)}
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
  const points = buildProfilePoints(stage);
  const maxAlt = Math.max(...points.map(p => p.alt), 1000);
  const minAlt = Math.min(...points.map(p => p.alt), 0);
  const width = 720;
  const height = 180;
  const pad = 18;

  const d = points.map((p, index) => {
    const x = pad + (p.km / stage.distance) * (width - pad * 2);
    const y = height - pad - ((p.alt - minAlt) / Math.max(1, maxAlt - minAlt)) * (height - pad * 2);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const labels = (stage.profile.climbs || []).map(climbItem => {
    const x = pad + (climbItem.km / stage.distance) * (width - pad * 2);

    return `
      <g>
        <line x1="${x}" y1="26" x2="${x}" y2="160" class="profile-climb-line"/>
        <text x="${x + 4}" y="22" class="profile-label">${escapeHtml(climbItem.category)} · ${escapeHtml(climbItem.name)}</text>
      </g>
    `;
  }).join("");

  return `
    <div class="profile-box">
      <svg viewBox="0 0 ${width} ${height}">
        <path d="M${pad},${height - pad} L${width - pad},${height - pad}" class="profile-axis"/>
        <path d="${d} L${width - pad},${height - pad} L${pad},${height - pad} Z" class="profile-area"/>
        <path d="${d}" class="profile-line"/>
        ${labels}
      </svg>
    </div>
  `;
}

function buildProfilePoints(stage) {
  const points = [{ km: 0, alt: 120 }];
  const climbs = [...(stage.profile.climbs || [])].sort((a, b) => a.km - b.km);
  let currentAlt = 120;

  climbs.forEach(climbItem => {
    const startKm = clamp(climbItem.km - climbItem.length, 0, stage.distance);
    const climbGain = climbItem.length * climbItem.gradient * 10;

    points.push({ km: Math.max(0, startKm - 8), alt: Math.max(80, currentAlt - 120) });
    points.push({ km: startKm, alt: currentAlt });

    currentAlt = clamp(currentAlt + climbGain, 200, 2600);
    points.push({ km: climbItem.km, alt: currentAlt });

    currentAlt = Math.max(120, currentAlt - climbGain * 0.45);
  });

  points.push({
    km: stage.distance,
    alt: stage.profile.finalClimb ? currentAlt : Math.max(100, currentAlt - 150)
  });

  return points.sort((a, b) => a.km - b.km);
}

function renderClimbList(stage) {
  const climbs = stage.profile.climbs || [];

  if (!climbs.length) {
    return `<p class="muted small">Sin puertos puntuables.</p>`;
  }

  return `
    <div class="climb-list">
      ${climbs.map(climbItem => `
        <span class="climb-chip cat-${String(climbItem.category).replace("HC", "hc")}">
          ${escapeHtml(climbItem.category)} · ${escapeHtml(climbItem.name)} · km ${climbItem.km} · ${climbItem.length} km al ${climbItem.gradient}%
        </span>
      `).join("")}
    </div>
  `;
}

function renderSectorTimeline(stage) {
  return `
    <div class="sector-timeline">
      ${stage.sectors.map((sector, index) => `
        <div class="sector-chip">
          <strong>${index + 1}</strong>
          <span>${escapeHtml(sector.name)}</span>
          <small>km ${sector.kmStart}-${sector.kmEnd}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function renderStageProgressCard(stage, index) {
  const statusClass =
    index < Game.currentStageIndex ? "done" :
    index === Game.currentStageIndex ? "current" :
    "";

  const status =
    index < Game.currentStageIndex ? "Completada" :
    index === Game.currentStageIndex ? "Actual" :
    "Pendiente";

  return `
    <div class="stage-card ${statusClass}">
      <div class="badge-row">
        <span class="badge">Etapa ${stage.number}</span>
        <span class="badge blue">${escapeHtml(stage.label)}</span>
        <span class="badge ${index === Game.currentStageIndex ? "green" : ""}">${status}</span>
      </div>
      <strong>${escapeHtml(stage.name)}</strong>
      <div class="muted small">
        ${stage.distance} km · ${stage.profile.climbs.length} puertos · ${stage.profile.elevationGain} m+ · ${stage.sectors.length} sectores
      </div>
    </div>
  `;
}

/* ============================================================
   ESTRATEGIA RENDER
   ============================================================ */

function renderProtectedRiderSelector(riders) {
  return `
    <h2>Líder protegido</h2>
    <select onchange="setProtectedRider(this.value)">
      ${riders.map(rider => `
        <option value="${rider.id}" ${Game.protectedRiderId === rider.id ? "selected" : ""}>
          ${escapeHtml(rider.name)} · ${escapeHtml(rider.role)}
        </option>
      `).join("")}
    </select>
  `;
}

function renderSmartPresets() {
  return `
    <h2>Presets inteligentes</h2>
    <div class="preset-row">
      ${SMART_PRESETS.map(preset => `
        <button class="secondary" onclick="applySmartPreset('${preset.id}')">
          ${escapeHtml(preset.name)}
        </button>
      `).join("")}
    </div>
  `;
}

function renderTacticPresets() {
  return `
    <h2>Presets básicos</h2>
    <div class="preset-row">
      ${TACTICS.map(tactic => `
        <button class="secondary" onclick="applyTacticToAll('${tactic.id}')">
          Todo: ${escapeHtml(tactic.name)}
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

function renderRiderStrategyCard(rider) {
  const tacticId = Game.riderTactics[rider.id] || "balanced";
  const tactic = getTactic(tacticId);

  return `
    <div class="strategy-card ${Game.protectedRiderId === rider.id ? "protected" : ""}">
      <div>
        <div class="badge-row">
          <span class="badge green">${escapeHtml(rider.role)}</span>
          <span class="badge blue">Forma ${Math.round(rider.form)}</span>
          <span class="badge orange">Fatiga ${Math.round(rider.fatigue)}</span>
          <span class="badge">Energía ${Math.round(rider.energy)}</span>
          ${Game.protectedRiderId === rider.id ? `<span class="badge jersey-yellow">Protegido</span>` : ""}
        </div>
        <h3>${escapeHtml(rider.name)}</h3>
        <p class="muted small">${escapeHtml(tactic.description)}</p>
      </div>

      <select onchange="setRiderTactic('${rider.id}', this.value)">
        ${TACTICS.map(item => `
          <option value="${item.id}" ${tacticId === item.id ? "selected" : ""}>
            ${item.name}
          </option>
        `).join("")}
      </select>
    </div>
  `;
}

function renderRiderCard(rider) {
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
        <span class="badge green">${escapeHtml(rider.role)}</span>
        <span class="badge">${rider.age} años</span>
        <span class="badge orange">Fatiga ${Math.round(rider.fatigue)}</span>
        <span class="badge blue">UCI ${rider.uciPoints}</span>
        <span class="badge">Moral ${Math.round(rider.morale)}</span>
      </div>

      <h4>${escapeHtml(rider.name)}</h4>
      <p class="muted small">${escapeHtml(rider.nationality)} · ${rider.abandoned ? "ABANDONO" : "Activo"}</p>

      ${stats.map(([key, label]) => `
        <div class="stat-row">
          <span>${label}</span>
          <div class="stat-bar">
            <div class="stat-fill" style="width:${clamp(rider.stats[key], 0, 100)}%"></div>
          </div>
          <span>${rider.stats[key]}</span>
        </div>
      `).join("")}
    </div>
  `;
}

/* ============================================================
   LIVE STAGE
   ============================================================ */

function startLiveStage() {
  const stage = getCurrentStage();
  const plan = getNutritionPlan();

  Game.liveStage = {
    active: true,
    stageId: stage.id,
    currentSectorIndex: 0,
    riderState: {},
    breakawayIds: [],
    breakawayGap: 0,
    pelotonSize: getAllActiveRiders().length,
    droppedCount: 0,
    radio: [],
    sectorLogs: [],
    manualNutritionLog: [],
    orders: {
      teamPull: false,
      waitLeader: false,
      markRival: false
    }
  };

  Game.teamNutritionStock = deepClone(plan.stock);

  getAllActiveRiders().forEach(rider => {
    Game.liveStage.riderState[rider.id] = {
      stageTime: 0,
      sectorTime: 0,
      energy: clamp(100 - rider.fatigue * 0.35, 5, 100),
      hydration: 100,
      stomachLoad: 0,
      fatigueGain: 0,
      finalBonus: 0,
      crisis: false,
      incident: null,
      dropped: false,
      groupLabel: "Pelotón",
      domestiqueBurned: false,
      usedCaffeine: false,
      nutritionUsed: []
    };
  });

  Game.liveStage.breakawayIds = generateLiveBreakaway(stage);
  Game.liveStage.breakawayGap = Game.liveStage.breakawayIds.length ? Math.round(randomBetween(80, 190)) : 0;

  addRadio(`Salida lanzada. ${Game.liveStage.breakawayIds.length ? `Se forma una fuga de ${Game.liveStage.breakawayIds.length} corredores.` : "No se consolida fuga inicial."}`);
  addRadio(getStageRadioHint(stage));

  saveGame();
  renderLiveStageScreen();
}

function generateLiveBreakaway(stage) {
  if (["time_trial", "team_time_trial"].includes(stage.type)) return [];

  const candidates = getAllActiveRiders()
    .map(rider => {
      const tactic =
        rider.teamId === Game.selectedTeamId
          ? getUserTacticForRider(rider)
          : chooseAITactic(rider, stage);

      const leader = getGCLeader();
      const gcGap = leader ? rider.totalTime - leader.totalTime : 0;
      const teamAI = getTeam(rider.teamId).aiProfile || {};

      const score =
        (gcGap > 8 * 60 ? 8 : 0) +
        (["puncheur", "classics", "climber", "rouleur"].includes(rider.roleKey) ? 7 : 0) +
        (tactic.id === "aggressive" ? 11 : tactic.id === "all_in" ? 17 : 0) +
        ((teamAI.breakawayFocus || 50) / 12) +
        (stage.type === "hilly" ? 8 : stage.type === "mountain" ? 6 : stage.type === "cobbles_hills" ? 9 : -2) +
        randomBetween(0, 8) -
        rider.fatigue * 0.12;

      return { rider, score };
    })
    .sort((a, b) => b.score - a.score);

  return candidates
    .slice(0, clamp(Math.round(randomBetween(3, 8)), 3, 8))
    .filter(item => item.score > 9)
    .map(item => item.rider.id);
}

function getStageRadioHint(stage) {
  if (stage.type === "mountain") return "Radio: guarda geles para los últimos puertos. Alimentar tarde puede costar la general.";
  if (stage.type === "flat" && stage.profile.windExposure > 60) return "Radio: viento peligroso. Colocación y protección del líder serán críticas.";
  if (stage.type === "cobbles_hills") return "Radio: pavés peligroso. Material endurance y ruedas de pavés reducen mucho el riesgo.";
  if (stage.type === "time_trial") return "Radio: crono pura. Material TT y gestión de energía desde el inicio.";
  return "Radio: vigila la fuga y el estado de energía antes del final.";
}

function addRadio(message) {
  if (!Game.liveStage) return;

  Game.liveStage.radio.unshift({
    message,
    time: new Date().toLocaleTimeString()
  });

  Game.liveStage.radio = Game.liveStage.radio.slice(0, 8);
}

function renderLiveStageScreen() {
  const stage = getCurrentStage();
  const sector = stage.sectors[Game.liveStage.currentSectorIndex];
  const progress = Math.round((sector.kmStart / stage.distance) * 100);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>En carrera · ${escapeHtml(stage.name)}</h1>
        <p>Sector ${Game.liveStage.currentSectorIndex + 1}/${stage.sectors.length} · km ${sector.kmStart}-${sector.kmEnd} · ${escapeHtml(sector.name)}</p>
      </div>

      <div class="top-actions">
        <button class="secondary" onclick="saveGame(true)">Guardar</button>
        <button class="danger" onclick="cancelLiveStage()">Cancelar etapa</button>
      </div>
    </div>

    <section class="live-progress">
      <div class="progress-bar">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>
      <div class="sector-timeline live">
        ${stage.sectors.map((s, i) => `
          <div class="sector-chip ${i === Game.liveStage.currentSectorIndex ? "active" : ""} ${i < Game.liveStage.currentSectorIndex ? "done" : ""}">
            <strong>${i + 1}</strong>
            <span>${escapeHtml(s.name)}</span>
            <small>km ${s.kmStart}-${s.kmEnd}</small>
          </div>
        `).join("")}
      </div>
    </section>

    <div class="grid two" style="margin-top:16px;">
      <section class="panel">
        <h2>Situación de carrera</h2>
        ${renderLiveSituation(sector)}
        ${renderLiveOrders()}
        ${renderLiveTeamControls()}
      </section>

      <section class="panel">
        <h2>Radio del director</h2>
        ${renderRadioMessages()}
        <hr>
        <h2>Nutrición coche</h2>
        ${renderNutritionStock(Game.teamNutritionStock)}
      </section>
    </div>

    <section class="panel" style="margin-top:16px;">
      <h2>Tu equipo en carrera</h2>
      <div class="live-rider-grid">
        ${getTeamRiders(Game.selectedTeamId).map(renderLiveRiderCard).join("")}
      </div>
    </section>

    <div class="simulation-actions">
      <button class="secondary" onclick="renderRaceScreen()">Volver a panel</button>
      <button onclick="simulateCurrentSector()">Simular sector</button>
    </div>
  `;
}

function renderLiveSituation(sector) {
  const stage = getCurrentStage();
  const breakawayNames = Game.liveStage.breakawayIds
    .map(id => getRider(id)?.name)
    .filter(Boolean);

  return `
    <div class="live-situation">
      <div class="badge-row">
        <span class="badge green">Km ${sector.kmStart}-${sector.kmEnd}</span>
        <span class="badge blue">${escapeHtml(sector.type)}</span>
        <span class="badge orange">Dificultad ${sector.difficulty}</span>
        <span class="badge">Ataque ${sector.attackValue}</span>
        <span class="badge">Riesgo ${sector.risk}</span>
      </div>

      <p class="help">
        ${breakawayNames.length
          ? `Fuga: ${escapeHtml(breakawayNames.join(", "))}. Ventaja: ${secondsToTime(Game.liveStage.breakawayGap)}.`
          : "No hay fuga consolidada."}
        <br>
        Pelotón principal: ${Game.liveStage.pelotonSize} corredores · Cortados: ${Game.liveStage.droppedCount}.
      </p>

      ${renderStageProfile(stage)}
    </div>
  `;
}

function renderLiveOrders() {
  return `
    <h2>Órdenes de coche</h2>
    <div class="preset-row">
      <button class="secondary ${Game.liveStage.orders.teamPull ? "active-soft" : ""}" onclick="toggleLiveOrder('teamPull')">
        Tirar del pelotón
      </button>
      <button class="secondary ${Game.liveStage.orders.waitLeader ? "active-soft" : ""}" onclick="toggleLiveOrder('waitLeader')">
        Esperar líder
      </button>
      <button class="secondary ${Game.liveStage.orders.markRival ? "active-soft" : ""}" onclick="toggleLiveOrder('markRival')">
        Marcar rival
      </button>
    </div>
  `;
}

function toggleLiveOrder(orderId) {
  Game.liveStage.orders[orderId] = !Game.liveStage.orders[orderId];

  if (orderId === "teamPull" && Game.liveStage.orders[orderId]) {
    addRadio("Orden dada: el equipo tirará del pelotón en el próximo sector.");
  }

  if (orderId === "waitLeader" && Game.liveStage.orders[orderId]) {
    addRadio("Orden dada: gregarios preparados para esperar al líder si hay problema.");
  }

  if (orderId === "markRival" && Game.liveStage.orders[orderId]) {
    addRadio("Orden dada: líder protegido marcará al rival directo.");
  }

  renderLiveStageScreen();
}

function renderLiveTeamControls() {
  return `
    <h2>Cambios rápidos de estrategia</h2>
    <div class="preset-row">
      ${TACTICS.map(tactic => `
        <button class="secondary" onclick="applyTacticToAllLive('${tactic.id}')">
          Todo: ${escapeHtml(tactic.name)}
        </button>
      `).join("")}
    </div>
  `;
}

function applyTacticToAllLive(tacticId) {
  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    Game.riderTactics[rider.id] = tacticId;
  });

  addRadio(`Cambio táctico global: ${getTactic(tacticId).name}.`);
  renderLiveStageScreen();
}

function renderRadioMessages() {
  return `
    <div class="radio-list">
      ${Game.liveStage.radio.map(item => `
        <div class="radio-message">
          <span>${escapeHtml(item.time)}</span>
          <p>${escapeHtml(item.message)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderLiveRiderCard(rider) {
  const live = Game.liveStage.riderState[rider.id];
  const tacticId = Game.riderTactics[rider.id] || "balanced";
  const setup = getRiderEquipment(rider.id);

  return `
    <div class="live-rider-card ${Game.protectedRiderId === rider.id ? "protected" : ""}">
      <div class="badge-row">
        <span class="badge green">${escapeHtml(rider.role)}</span>
        <span class="badge">E ${Math.round(live.energy)}</span>
        <span class="badge blue">H ${Math.round(live.hydration)}</span>
        <span class="badge orange">Est ${Math.round(live.stomachLoad)}</span>
        ${live.domestiqueBurned ? `<span class="badge red">Quemado</span>` : ""}
        ${live.crisis ? `<span class="badge red">Crisis</span>` : ""}
      </div>

      <h3>${escapeHtml(rider.name)}</h3>
      <p class="muted small">
        Tiempo acumulado sector: ${secondsToTime(live.stageTime)} · ${escapeHtml(getBike(setup.bike).name)} + ${escapeHtml(getWheels(setup.wheels).name)}
      </p>

      <select onchange="setRiderTacticLive('${rider.id}', this.value)">
        ${TACTICS.map(tactic => `
          <option value="${tactic.id}" ${tacticId === tactic.id ? "selected" : ""}>
            ${tactic.name}
          </option>
        `).join("")}
      </select>

      <div class="nutrition-actions">
        ${NUTRITION_ITEMS.map(item => `
          <button class="mini-button" onclick="useNutrition('${rider.id}', '${item.id}')">
            ${escapeHtml(item.name)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function setRiderTacticLive(riderId, tacticId) {
  const old = Game.riderTactics[riderId] || "balanced";
  Game.riderTactics[riderId] = tacticId;

  const live = Game.liveStage.riderState[riderId];

  if (old !== tacticId && live) {
    live.energy = clamp(live.energy - getTacticChangeCost(old, tacticId), 0, 100);
  }

  addRadio(`${getRider(riderId).name}: cambio a ${getTactic(tacticId).name}.`);
  renderLiveStageScreen();
}

function getTacticChangeCost(oldId, newId) {
  if (oldId === newId) return 0;
  if (newId === "all_in") return 8;
  if (newId === "aggressive") return 5;
  if (newId === "protect_leader") return 4;
  if (newId === "pull_peloton") return 6;
  if (newId === "wait_leader") return 5;
  return 2;
}

function useNutrition(riderId, itemId) {
  const item = getNutritionItem(itemId);
  const live = Game.liveStage.riderState[riderId];
  const sector = getCurrentStage().sectors[Game.liveStage.currentSectorIndex];

  if (!item || !live) return;

  if ((Game.teamNutritionStock[itemId] || 0) <= 0) {
    addRadio(`No quedan unidades de ${item.name}.`);
    renderLiveStageScreen();
    return;
  }

  const effectiveness = getNutritionEffectiveness(item, sector, live);

  Game.teamNutritionStock[itemId] -= 1;

  live.energy = clamp(live.energy + item.energy * effectiveness, 0, 115);
  live.hydration = clamp(live.hydration + item.hydration, 0, 120);
  live.stomachLoad = clamp(live.stomachLoad + item.stomachLoad * (sector.difficulty > 85 ? 1.15 : 1), 0, 100);
  live.finalBonus += sector.type === "final" ? item.finalBonus || 0 : 0;

  if (item.id === "caffeine_gel") {
    live.usedCaffeine = true;
  }

  live.nutritionUsed.push(item.id);

  const rider = getRider(riderId);
  rider.morale = clamp(rider.morale + (item.morale || 0), 30, 100);

  addRadio(`${rider.name} toma ${item.name}. Energía +${Math.round(item.energy * effectiveness)}.`);
  renderLiveStageScreen();
}

function getNutritionEffectiveness(item, sector, live) {
  let effectiveness = 1.0;

  if (sector.type === "climb" && item.id === "bar") effectiveness *= 0.48;
  if (sector.type === "final" && item.delay > 0) effectiveness *= 0.50;
  if (sector.difficulty > 88 && item.id === "bar") effectiveness *= 0.45;
  if (live.stomachLoad > 65) effectiveness *= 0.65;
  if (live.stomachLoad > 82) effectiveness *= 0.45;

  return clamp(effectiveness, 0.35, 1.15);
}

function cancelLiveStage() {
  Game.liveStage = null;
  renderRaceScreen();
}

/* ============================================================
   SIMULAR SECTOR Y FINALIZAR ETAPA
   ============================================================ */

function simulateCurrentSector() {
  const stage = getCurrentStage();
  const sector = stage.sectors[Game.liveStage.currentSectorIndex];

  applyAutoNutritionForSector(sector);

  const sectorLog = {
    sectorIndex: Game.liveStage.currentSectorIndex,
    sectorName: sector.name,
    events: []
  };

  getAllActiveRiders().forEach(rider => {
    simulateRiderSector(rider, stage, sector, sectorLog);
  });

  updateBreakawayAfterSector(stage, sector, sectorLog);
  updatePelotonState(sectorLog);
  applySectorOrders(sector, sectorLog);

  Game.liveStage.sectorLogs.push(sectorLog);
  Game.liveStage.currentSectorIndex += 1;

  sectorLog.events.slice(0, 4).forEach(event => addRadio(event));

  if (Game.liveStage.currentSectorIndex >= stage.sectors.length) {
    finishLiveStage();
    return;
  }

  addRadio(getSectorTransitionHint(stage.sectors[Game.liveStage.currentSectorIndex]));
  saveGame();
  renderLiveStageScreen();
}

function applyAutoNutritionForSector(sector) {
  const plan = getNutritionPlan();
  const rule = plan.rules.find(item => item.sectorType === sector.type);

  if (!rule) return;

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    const live = Game.liveStage.riderState[rider.id];

    if (!live || live.energy > 62) return;

    if ((Game.teamNutritionStock[rule.item] || 0) <= 0) return;

    const item = getNutritionItem(rule.item);
    const effectiveness = getNutritionEffectiveness(item, sector, live);

    Game.teamNutritionStock[rule.item] -= 1;

    live.energy = clamp(live.energy + item.energy * effectiveness, 0, 115);
    live.hydration = clamp(live.hydration + item.hydration, 0, 120);
    live.stomachLoad = clamp(live.stomachLoad + item.stomachLoad, 0, 100);
    live.finalBonus += sector.type === "final" ? item.finalBonus || 0 : 0;

    if (item.id === "caffeine_gel") live.usedCaffeine = true;

    live.nutritionUsed.push(item.id);
  });
}

function simulateRiderSector(rider, stage, sector, sectorLog) {
  const live = Game.liveStage.riderState[rider.id];
  if (!live || rider.abandoned) return;

  const tactic =
    rider.teamId === Game.selectedTeamId
      ? getUserTacticForRider(rider)
      : chooseAITactic(rider, stage);

  const equipmentBonus = calculateEquipmentBonus(rider, stage, sector);
  const nutritionBonus = calculateNutritionBonus(live, sector);
  const supportBonus = rider.teamId === Game.selectedTeamId ? calculateLiveSupportBonus(rider, sector) : 0;
  const moraleBonus = (rider.morale - 75) * 0.04;
  const fatiguePenalty = rider.fatigue * getSectorFatigueFactor(sector);
  const energyPenalty = live.energy < 35 ? (35 - live.energy) * 0.10 : 0;
  const hydrationPenalty = live.hydration < 45 ? (45 - live.hydration) * 0.08 : 0;
  const stomachPenalty = live.stomachLoad > 70 ? (live.stomachLoad - 70) * 0.08 : 0;

  const terrainScore =
    calculateSectorTerrainScore(rider, stage, sector) +
    tactic.bonus +
    equipmentBonus +
    nutritionBonus +
    supportBonus +
    moraleBonus -
    fatiguePenalty -
    energyPenalty -
    hydrationPenalty -
    stomachPenalty +
    randomBetween(-3, 3);

  const baseSectorTime = getBaseSectorTime(stage, sector);
  let sectorTime = convertSectorPerformanceToTime(terrainScore, baseSectorTime, sector);

  const incident = calculateLiveIncident(rider, stage, sector, tactic);
  if (incident) {
    sectorTime += incident.timeLoss;
    live.incident = incident;
    live.energy = clamp(live.energy - incident.energyLoss, 0, 100);
    live.fatigueGain += incident.fatigue;
    sectorLog.events.push(`${rider.name}: ${incident.type} (+${Math.round(incident.timeLoss)}s).`);

    if (incident.abandon) {
      rider.abandoned = true;
    }
  }

  const crisis = calculateLiveCrisis(rider, stage, sector, live, tactic);
  if (crisis) {
    sectorTime += crisis.timeLoss;
    live.crisis = true;
    live.fatigueGain += crisis.fatigue;
    sectorLog.events.push(`${rider.name} entra en crisis y pierde ${secondsToTime(crisis.timeLoss)}.`);
  }

  live.sectorTime = sectorTime;
  live.stageTime += sectorTime;
  live.energy = clamp(live.energy - calculateSectorEnergyCost(rider, sector, tactic), 0, 115);
  live.hydration = clamp(live.hydration - calculateSectorHydrationCost(stage, sector), 0, 120);
  live.stomachLoad = clamp(live.stomachLoad - 4, 0, 100);
  live.fatigueGain += calculateSectorFatigueGain(rider, stage, sector, tactic, terrainScore);

  if (live.energy < 20 && !live.dropped) {
    live.dropped = true;
    live.groupLabel = "Grupo cortado";
    Game.liveStage.droppedCount += 1;
  }
}

function calculateSectorTerrainScore(rider, stage, sector) {
  const s = rider.stats;

  if (sector.type === "flat") {
    return s.flat * 0.42 + s.sprint * 0.16 + s.stamina * 0.14 + s.positioning * 0.13 + rider.form * 0.10 + s.recovery * 0.05;
  }

  if (sector.type === "hilly") {
    return s.hills * 0.36 + s.acceleration * 0.18 + s.stamina * 0.15 + s.mountain * 0.10 + s.positioning * 0.08 + rider.form * 0.08 + s.recovery * 0.05;
  }

  if (sector.type === "climb") {
    return s.mountain * 0.50 + s.stamina * 0.18 + s.recovery * 0.10 + s.acceleration * 0.08 + rider.form * 0.10 + s.downhill * 0.04;
  }

  if (sector.type === "cobbles") {
    return s.cobbles * 0.36 + s.positioning * 0.18 + s.stamina * 0.14 + s.hills * 0.12 + s.acceleration * 0.10 + rider.form * 0.10;
  }

  if (sector.type === "tt") {
    return s.timeTrial * 0.58 + s.flat * 0.14 + s.stamina * 0.12 + s.consistency * 0.08 + rider.form * 0.08;
  }

  if (sector.type === "final") {
    if (stage.type === "flat") {
      return s.sprint * 0.40 + s.flat * 0.20 + s.acceleration * 0.18 + s.positioning * 0.12 + rider.form * 0.10;
    }

    if (stage.type === "mountain") {
      return s.mountain * 0.48 + s.acceleration * 0.17 + s.stamina * 0.15 + rider.form * 0.12 + s.recovery * 0.08;
    }

    return s.hills * 0.35 + s.acceleration * 0.22 + s.stamina * 0.14 + s.positioning * 0.12 + rider.form * 0.10 + s.cobbles * 0.07;
  }

  return s.stamina * 0.30 + s.flat * 0.25 + rider.form * 0.20 + s.recovery * 0.15 + s.positioning * 0.10;
}

function calculateEquipmentBonus(rider, stage, sector) {
  const setup = getRiderEquipment(rider.id);
  const bike = getBike(setup.bike);
  const wheels = getWheels(setup.wheels);

  let bonus = 0;

  const stageKey =
    sector.type === "climb" ? "mountain" :
    sector.type === "cobbles" ? "cobbles" :
    sector.type === "tt" ? stage.type :
    sector.type === "final" ? stage.type :
    sector.type;

  bonus += bike.bonuses[stageKey] || 0;
  bonus += wheels.bonuses[stageKey] || 0;

  if (stage.profile.roadSurface === "pavé" || sector.type === "cobbles") {
    bonus += bike.bonuses.cobbles || 0;
    bonus += wheels.bonuses.cobbles || 0;
  }

  if (stage.profile.windExposure > 60) {
    bonus -= wheels.bonuses.windPenalty || 0;
  }

  if (stage.profile.rainRisk > 45) {
    bonus += (bike.bonuses.handling || 0) + (wheels.bonuses.handling || 0);
  }

  return bonus;
}

function calculateNutritionBonus(live, sector) {
  let bonus = 0;

  if (live.energy > 80) bonus += 1.5;
  if (live.energy < 35) bonus -= 3;
  if (live.hydration < 40) bonus -= 2.5;
  if (live.stomachLoad > 75) bonus -= 2.5;
  if (sector.type === "final") bonus += live.finalBonus || 0;
  if (sector.type === "final" && live.usedCaffeine) bonus += 1.5;

  return bonus;
}

function calculateLiveSupportBonus(rider, sector) {
  if (rider.id !== Game.protectedRiderId) return 0;

  const mates = getTeamRiders(Game.selectedTeamId).filter(mate => mate.id !== rider.id);
  let support = 0;

  mates.forEach(mate => {
    const tactic = getUserTacticForRider(mate);
    const liveMate = Game.liveStage.riderState[mate.id];

    if (!liveMate || liveMate.energy < 8) return;

    support += (tactic.supportBonus || 0) * (mate.stats.stamina / 85);

    if (tactic.waitsLeader && Game.liveStage.orders.waitLeader) {
      support += 1.8;
      liveMate.domestiqueBurned = true;
    }
  });

  if (sector.type === "climb" || sector.type === "final") support *= 1.15;
  if (sector.type === "flat" && Game.liveStage.orders.markRival) support += 1.5;

  return clamp(support, 0, 11);
}

function getBaseSectorTime(stage, sector) {
  const distance = sector.kmEnd - sector.kmStart;
  const speed =
    sector.type === "flat" ? 44 :
    sector.type === "valley" ? 42 :
    sector.type === "hilly" ? 38 :
    sector.type === "climb" ? 28 :
    sector.type === "cobbles" ? 35 :
    sector.type === "tt" ? 50 :
    sector.type === "final" ? (stage.type === "mountain" ? 27 : stage.type === "flat" ? 46 : 36) :
    40;

  return (distance / speed) * 3600;
}

function convertSectorPerformanceToTime(performance, baseTime, sector) {
  const separation =
    sector.type === "flat" ? 1.6 :
    sector.type === "hilly" ? 3.2 :
    sector.type === "climb" ? 5.2 :
    sector.type === "cobbles" ? 4.4 :
    sector.type === "tt" ? 4.0 :
    sector.type === "final" ? 5.8 :
    2.5;

  return baseTime + (82 - clamp(performance, 35, 115)) * separation + sector.difficulty * 0.08 + randomBetween(-4, 4);
}

function getSectorFatigueFactor(sector) {
  return (
    sector.type === "flat" ? 0.04 :
    sector.type === "hilly" ? 0.08 :
    sector.type === "climb" ? 0.12 :
    sector.type === "cobbles" ? 0.11 :
    sector.type === "tt" ? 0.09 :
    sector.type === "final" ? 0.13 :
    0.06
  );
}

function calculateSectorEnergyCost(rider, sector, tactic) {
  const base = sector.energyCost * tactic.sectorEnergy;
  const staminaReduction = rider.stats.stamina * 0.055;
  return clamp(base - staminaReduction, 4, 55);
}

function calculateSectorHydrationCost(stage, sector) {
  return clamp(8 + stage.profile.heat * 0.08 + sector.difficulty * 0.03, 6, 22);
}

function calculateSectorFatigueGain(rider, stage, sector, tactic, performance) {
  return clamp(
    sector.energyCost * 0.18 * tactic.fatigueMultiplier +
    stage.profile.heat * 0.015 +
    (stage.profile.roadSurface === "pavé" ? 1.2 : 0) -
    rider.stats.recovery * 0.025 +
    (performance > 88 ? 1.2 : 0),
    0.4,
    10
  );
}

function calculateLiveIncident(rider, stage, sector, tactic) {
  const diff = getDifficulty();
  const setup = getRiderEquipment(rider.id);
  const bike = getBike(setup.bike);
  const wheels = getWheels(setup.wheels);

  const surfaceRisk = stage.profile.roadSurface === "pavé" || sector.type === "cobbles" ? 0.070 : 0.012;
  const rainRisk = stage.profile.rainRisk / 1000;
  const descentRisk = stage.profile.technicalDescent / 1800;
  const tacticRisk = tactic.risk * 0.04;
  const sectorRisk = sector.risk / 1400;
  const protection = (rider.stats.positioning + rider.stats.downhill + rider.stats.injuryResistance) / 6500;

  const risk = clamp(
    (surfaceRisk + rainRisk + descentRisk + tacticRisk + sectorRisk - protection) *
      diff.incidentMultiplier *
      bike.punctureRisk *
      wheels.punctureRisk,
    0.004,
    0.22
  );

  if (Math.random() > risk) return null;

  const roll = Math.random();

  if (roll < 0.48) {
    return { type: "Pinchazo", timeLoss: randomBetween(20, 95), fatigue: 1.5, energyLoss: 4 };
  }

  if (roll < 0.78) {
    return { type: "Avería", timeLoss: randomBetween(35, 155), fatigue: 2, energyLoss: 5 };
  }

  if (roll < 0.96) {
    return { type: "Caída leve", timeLoss: randomBetween(45, 190), fatigue: 5, energyLoss: 12, performancePenalty: 4 };
  }

  return { type: "Abandono", timeLoss: 1800, fatigue: 20, energyLoss: 100, performancePenalty: 15, abandon: true };
}

function calculateLiveCrisis(rider, stage, sector, live, tactic) {
  const diff = getDifficulty();

  const risk = clamp(
    (
      (28 - live.energy) / 75 +
      (42 - live.hydration) / 120 +
      live.stomachLoad / 260 +
      rider.fatigue / 250 +
      stage.profile.heat / 520 +
      (tactic.id === "all_in" ? 0.10 : 0)
    ) * diff.crisisMultiplier,
    0,
    0.50
  );

  if (live.energy > 28 && live.hydration > 35) return null;
  if (Math.random() > risk) return null;

  const severe = live.energy < 8 || live.hydration < 18;

  return {
    type: severe ? "Pájara severa" : "Crisis",
    timeLoss: severe ? randomBetween(300, 900) : randomBetween(60, 240),
    fatigue: severe ? 8 : 3
  };
}

function updateBreakawayAfterSector(stage, sector, sectorLog) {
  if (!Game.liveStage.breakawayIds.length) return;

  const pullingPower = getTeamRiders(Game.selectedTeamId).reduce((sum, rider) => {
    const tactic = getUserTacticForRider(rider);
    const live = Game.liveStage.riderState[rider.id];

    if (!live || live.energy < 15) return sum;

    return sum + (tactic.pullsPeloton ? rider.stats.flat * 0.05 : 0);
  }, 0);

  const terrainEffect =
    sector.type === "flat" ? -18 :
    sector.type === "valley" ? -12 :
    sector.type === "hilly" ? 4 :
    sector.type === "climb" ? 8 :
    sector.type === "cobbles" ? 6 :
    sector.type === "final" ? -22 :
    -8;

  const orderEffect = Game.liveStage.orders.teamPull ? -35 - pullingPower : 0;
  const natural = randomBetween(-15, 22);

  Game.liveStage.breakawayGap = Math.max(0, Game.liveStage.breakawayGap + terrainEffect + orderEffect + natural);

  if (Game.liveStage.breakawayGap <= 20) {
    sectorLog.events.push("La fuga está prácticamente neutralizada.");
  }

  if (Game.liveStage.breakawayGap > 240) {
    sectorLog.events.push("La fuga abre hueco peligroso.");
  }
}

function updatePelotonState(sectorLog) {
  const active = getAllActiveRiders().length;
  const dropped = Object.values(Game.liveStage.riderState).filter(state => state.dropped).length;

  Game.liveStage.droppedCount = dropped;
  Game.liveStage.pelotonSize = Math.max(1, active - dropped);

  if (dropped > 8) {
    sectorLog.events.push(`El pelotón se rompe: ${dropped} corredores cortados.`);
  }
}

function applySectorOrders(sector, sectorLog) {
  if (Game.liveStage.orders.waitLeader) {
    const leader = getRider(Game.protectedRiderId);
    const leaderLive = leader ? Game.liveStage.riderState[leader.id] : null;

    if (leaderLive && (leaderLive.incident || leaderLive.crisis || leaderLive.dropped)) {
      const helpers = getTeamRiders(Game.selectedTeamId)
        .filter(r => r.id !== leader.id)
        .slice(0, 2);

      helpers.forEach(helper => {
        const live = Game.liveStage.riderState[helper.id];
        if (!live) return;

        live.stageTime += 25;
        live.energy = clamp(live.energy - 12, 0, 100);
        live.domestiqueBurned = true;
      });

      leaderLive.stageTime = Math.max(0, leaderLive.stageTime - 45);
      sectorLog.events.push(`${helpers.map(h => h.name).join(" y ")} esperan al líder y reducen la pérdida.`);
    }
  }

  Game.liveStage.orders.teamPull = false;
  Game.liveStage.orders.waitLeader = false;
}

function getSectorTransitionHint(sector) {
  if (sector.type === "climb") return "Radio: llega subida. Alimenta antes si el líder está bajo de energía.";
  if (sector.type === "final") return "Radio: sector final. La cafeína y el posicionamiento pueden decidir.";
  if (sector.type === "cobbles") return "Radio: sector peligroso. Evita ir all-in con corredores fatigados.";
  if (sector.type === "flat") return "Radio: sector llano. Puedes tirar del pelotón o ahorrar fuerzas.";
  return "Radio: revisa energía, hidratación y estrategia antes de seguir.";
}

function finishLiveStage() {
  const stage = getCurrentStage();

  let results = getAllActiveRiders().map(rider => {
    const live = Game.liveStage.riderState[rider.id];

    return {
      riderId: rider.id,
      riderName: rider.name,
      teamId: rider.teamId,
      teamName: getTeam(rider.teamId).name,
      stageTime: live.stageTime,
      performance: 0,
      tacticName: getUserTacticForRider(rider).name,
      tacticId: Game.riderTactics[rider.id] || "balanced",
      fatigueGain: live.fatigueGain,
      energyAfter: live.energy,
      incident: live.incident,
      crisis: live.crisis,
      groupLabel: live.groupLabel,
      inBreakaway: Game.liveStage.breakawayIds.includes(rider.id),
      bonusSeconds: 0
    };
  });

  if (Game.liveStage.breakawayIds.length && Game.liveStage.breakawayGap > 45) {
    results.forEach(result => {
      if (Game.liveStage.breakawayIds.includes(result.riderId)) {
        result.stageTime -= Math.min(180, Game.liveStage.breakawayGap * 0.45);
      }
    });
    addRadio("La fuga mantiene ventaja suficiente y condiciona el resultado.");
  }

  results.sort((a, b) => a.stageTime - b.stageTime);
  applyTimeBonuses(stage, results);
  results.sort((a, b) => a.stageTime - b.stageTime);
  applyGroupFinishFromLive(stage, results);
  results.sort((a, b) => a.stageTime - b.stageTime);
  updateStagePositions(results);

  applyTimeCut(stage, results);

  updateStageWinCounts(results[0]);
  updateRiderTotals(stage, results);
  updateTeamClassification(results);
  updatePointsClassification(stage, results);
  updateMountainClassification(stage, results);
  updateUciStagePoints(stage, results);
  assignLeaderOfRaceUciPoint();
  updateMoraleAndFormAfterStage(results);
  recordJerseyHistory(stage);
  recordIncidents(stage, results);

  Game.lastStageResults = {
    stage,
    results,
    breakawayInfo: {
      riderIds: Game.liveStage.breakawayIds,
      success: Game.liveStage.breakawayGap > 45,
      narrative: Game.liveStage.breakawayIds.length
        ? `Fuga de ${Game.liveStage.breakawayIds.length}. ${Game.liveStage.breakawayGap > 45 ? "La fuga llegó con ventaja." : "La fuga fue neutralizada."}`
        : "Sin fuga relevante."
    },
    sectorLogs: Game.liveStage.sectorLogs
  };

  Game.stageHistory.push(Game.lastStageResults);
  Game.liveStage = null;

  saveGame();
  renderStageResultScreen();
}

function applyGroupFinishFromLive(stage, results) {
  if (!["flat", "hilly", "cobbles_hills"].includes(stage.type)) return;

  let groupTime = results[0].stageTime;
  let groupNo = 1;

  results.forEach((result, index) => {
    const threshold = stage.type === "flat" ? 18 : stage.type === "hilly" ? 10 : 7;

    if (index > 0 && result.stageTime - groupTime > threshold) {
      groupTime = result.stageTime;
      groupNo++;
    }

    if (!result.incident && !result.crisis) {
      result.stageTime = groupTime;
      result.groupLabel = groupNo === 1 ? "Grupo 1" : `Grupo ${groupNo}`;
    }
  });
}

function applyTimeCut(stage, results) {
  if (!isGrandTour()) return;
  if (!["mountain", "hilly", "cobbles_hills"].includes(stage.type)) return;

  const winnerTime = results[0].stageTime;
  const limit =
    stage.type === "mountain" ? winnerTime * 1.18 :
    stage.type === "hilly" ? winnerTime * 1.14 :
    winnerTime * 1.16;

  results.forEach(result => {
    if (result.stageTime > limit) {
      const rider = getRider(result.riderId);
      if (rider && rider.teamId !== Game.selectedTeamId) {
        rider.abandoned = true;
        result.timeCut = true;
      }
    }
  });
}

/* ============================================================
   CLASIFICACIONES Y RESULTADOS
   ============================================================ */

function applyTimeBonuses(stage, results) {
  if (!stage.profile.finishBonuses?.length || ["time_trial", "team_time_trial"].includes(stage.type)) return;

  stage.profile.finishBonuses.forEach((bonus, index) => {
    if (results[index]) {
      results[index].stageTime = Math.max(0, results[index].stageTime - bonus);
      results[index].bonusSeconds = bonus;
    }
  });
}

function updateStagePositions(results) {
  results.forEach((result, index) => {
    result.position = index + 1;
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
  results.forEach(result => {
    const rider = getRider(result.riderId);
    if (!rider || rider.abandoned) return;

    rider.totalTime += result.stageTime;
    rider.raceDays = (rider.raceDays || 0) + 1;
    rider.energy = result.energyAfter;
    rider.recoveredToday = calculateDailyRecovery(rider, stage);
    rider.fatigue = clamp(rider.fatigue + result.fatigueGain - rider.recoveredToday, 0, 100);

    if (result.incident?.abandon || result.timeCut) {
      rider.abandoned = true;
    }
  });
}

function calculateDailyRecovery(rider, stage) {
  return clamp(
    (rider.stats.recovery * 0.085 +
      rider.stats.stamina * 0.025 +
      (rider.fatigue > 60 ? 0.8 : 0)) *
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

function updateTeamClassification(results) {
  TEAMS.forEach(team => {
    const top = results
      .filter(result => result.teamId === team.id)
      .sort((a, b) => a.stageTime - b.stageTime)
      .slice(0, CLASSIFICATION_RULES.teamClassificationBestRiders);

    if (top.length) {
      Game.teamTimes[team.id] += top.reduce((sum, result) => sum + result.stageTime, 0);
    }
  });
}

function updatePointsClassification(stage, results) {
  (CLASSIFICATION_RULES.pointsByStageType[stage.type] || []).forEach((points, index) => {
    const rider = getRider(results[index]?.riderId);
    if (rider) rider.points += points;
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
    CLASSIFICATION_RULES.intermediateSprintPoints.forEach((points, index) => {
      const rider = getRider(sprintRanking[index]?.riderId);
      if (rider) rider.points += points;
    });
  });
}

function updateMountainClassification(stage, results) {
  (stage.profile.climbs || []).forEach(climbItem => {
    const scale = CLASSIFICATION_RULES.mountainPoints[String(climbItem.category)] || [];

    const ranking = [...results].sort((a, b) => {
      const ra = getRider(a.riderId);
      const rb = getRider(b.riderId);

      return (
        rb.stats.mountain + rb.stats.hills * 0.35 + (b.inBreakaway ? 7 : 0) + randomBetween(0, 6) -
        (ra.stats.mountain + ra.stats.hills * 0.35 + (a.inBreakaway ? 7 : 0) + randomBetween(0, 6))
      );
    });

    scale.forEach((points, index) => {
      const rider = getRider(ranking[index]?.riderId);
      if (rider) rider.mountainPoints += points;
    });
  });
}

function updateUciStagePoints(stage, results) {
  const scale = isGrandTour()
    ? CLASSIFICATION_RULES.uci.grandTourStage
    : CLASSIFICATION_RULES.uci.oneDay;

  scale.forEach((points, index) => {
    const rider = getRider(results[index]?.riderId);
    if (rider) rider.uciPoints += points;
  });
}

function assignLeaderOfRaceUciPoint() {
  if (!isGrandTour()) return;

  const leader = getGCLeader();
  if (leader) leader.uciPoints += CLASSIFICATION_RULES.uci.stageLeaderPerDay;
}

function assignFinalUciPoints() {
  const key = Game.selectedRaceId;
  if (Game.finalUciAssignedForRace[key]) return;

  if (isGrandTour()) {
    CLASSIFICATION_RULES.uci.grandTourFinalGC.forEach((points, index) => {
      const rider = getGCStandings()[index];
      if (rider) rider.uciPoints += points;
    });

    [
      getPointsStandings()[0],
      getMountainStandings()[0],
      getYouthStandings()[0]
    ].forEach(rider => {
      if (rider) rider.uciPoints += CLASSIFICATION_RULES.uci.secondaryFinal[0];
    });
  }

  Game.finalUciAssignedForRace[key] = true;
}

function updateMoraleAndFormAfterStage(results) {
  results.forEach(result => {
    const rider = getRider(result.riderId);
    if (!rider) return;

    if (result.position === 1) rider.morale += 8;
    else if (result.position <= 3) rider.morale += 4;
    else if (result.position > 50) rider.morale -= 2;

    if (result.incident) rider.morale -= 5;
    if (result.crisis) rider.morale -= 6;
    if (result.timeCut) rider.morale -= 12;
    if (result.tacticId === "protect_leader") rider.morale += 1;

    rider.morale = clamp(rider.morale, 30, 100);

    const recoveryEffect = (rider.stats.recovery - 80) * 0.02;
    const fatigueEffect = rider.fatigue > 55 ? -0.7 : 0.2;
    const moraleEffect = (rider.morale - 75) * 0.015;

    rider.form = clamp(rider.form + recoveryEffect + fatigueEffect + moraleEffect, 55, 99);
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
    .filter(result => result.incident || result.crisis || result.timeCut)
    .forEach(result => {
      Game.incidentHistory.push({
        raceId: Game.selectedRaceId,
        stage: stage.number,
        riderId: result.riderId,
        riderName: result.riderName,
        type: result.incident?.type || (result.crisis ? "Pájara/Crisis" : "Fuera de control"),
        timeLoss: result.incident?.timeLoss || result.crisisTimeLoss || 0
      });
    });
}

function chooseAITactic(rider, stage) {
  const team = getTeam(rider.teamId);
  const ai = team.aiProfile || {};

  if (rider.fatigue > 65) return getTactic("conservative");

  if (stage.type === "mountain" && (ai.gcFocus || 0) > 75) return getTactic("aggressive");
  if (stage.type === "hilly" && (ai.breakawayFocus || 0) > 70) return getTactic("aggressive");
  if (stage.type === "cobbles_hills" && (ai.aggression || 0) > 80) return getTactic("aggressive");
  if (stage.type === "flat" && (ai.sprintFocus || 0) > 70) return getTactic("sprint_train");
  if (stage.type === "time_trial" && team.archetype.includes("Crono")) return getTactic("aggressive");
  if (Math.random() * 100 < (ai.aggression || 50) * 0.07) return getTactic("all_in");

  return getTactic("balanced");
}

/* ============================================================
   CLASIFICACIONES
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
    .filter(rider => rider.age <= CLASSIFICATION_RULES.youthMaxAge)
    .sort((a, b) => a.totalTime - b.totalTime);
}

function getUciStandings() {
  return [...Game.riders].sort((a, b) => b.uciPoints - a.uciPoints);
}

function getTeamStandings() {
  return TEAMS.map(team => ({
    team,
    time: Game.teamTimes[team.id] || 0,
    uci: getTeamRiders(team.id).reduce((sum, rider) => sum + rider.uciPoints, 0)
  })).sort((a, b) => a.time - b.time);
}

/* ============================================================
   OBJETIVOS
   ============================================================ */

function getStageWinnerIdsForUser() {
  return Game.stageHistory
    .filter(item => item.results[0]?.teamId === Game.selectedTeamId)
    .map(item => item.results[0].riderId);
}

function evaluateObjectives() {
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
    const bestUserGCPos = gc.findIndex(rider => rider.teamId === Game.selectedTeamId) + 1;

    if (id === "gc_win") ok = gc[0]?.teamId === Game.selectedTeamId;
    if (id === "gc_top_3") ok = bestUserGCPos > 0 && bestUserGCPos <= 3;
    if (id === "gc_top_5") ok = bestUserGCPos > 0 && bestUserGCPos <= 5;
    if (id === "gc_top_10") ok = bestUserGCPos > 0 && bestUserGCPos <= 10;
    if (id === "stage_win") ok = stageWins >= 1;
    if (id === "stage_wins_2") ok = stageWins >= 2;
    if (id === "stage_wins_3") ok = stageWins >= 3;
    if (id === "points_win") ok = points[0]?.teamId === Game.selectedTeamId;
    if (id === "points_top_3") ok = points.slice(0, 3).some(rider => rider.teamId === Game.selectedTeamId);
    if (id === "mountain_top_3") ok = mountain.slice(0, 3).some(rider => rider.teamId === Game.selectedTeamId);
    if (id === "youth_win") ok = youth[0]?.teamId === Game.selectedTeamId;
    if (id === "teams_win") ok = teams[0]?.team.id === Game.selectedTeamId;
    if (id === "uci_top_1") ok = uci[0]?.teamId === Game.selectedTeamId;
    if (id === "uci_top_3") ok = uci.slice(0, 3).some(rider => rider.teamId === Game.selectedTeamId);
    if (id === "uci_top_5") ok = uci.slice(0, 5).some(rider => rider.teamId === Game.selectedTeamId);
    if (id === "time_trial_win") {
      ok = Game.stageHistory.some(item => item.stage.type.includes("time_trial") && item.results[0]?.teamId === Game.selectedTeamId);
    }
    if (id === "monument_win") {
      ok = !isGrandTour() && Game.stageHistory[0]?.results[0]?.teamId === Game.selectedTeamId;
    }

    return { id, ok, ...OBJECTIVE_DEFINITIONS[id] };
  });
}

function applyObjectiveRewards() {
  const results = evaluateObjectives();
  const doneKey = `${Game.selectedRaceId}_objectives`;

  if (Game.objectiveResults.some(item => item.doneKey === doneKey)) return;

  let prestige = 0;
  let budget = 0;

  results.forEach(item => {
    if (item.ok) {
      prestige += item.prestige;
      budget += item.budget;
    }
  });

  const satisfactionDelta =
    Math.round((results.filter(item => item.ok).length / Math.max(1, results.length)) * 35 - 12) *
    getDifficulty().sponsorMultiplier;

  Game.prestige += prestige;
  Game.budget += budget;
  Game.sponsorSatisfaction = clamp(Game.sponsorSatisfaction + satisfactionDelta, 0, 100);

  Game.objectiveResults.push({ doneKey, raceId: Game.selectedRaceId, results, prestige, budget, satisfactionDelta });
}

/* ============================================================
   RESULTADOS
   ============================================================ */

function renderStageResultScreen() {
  const { stage, results, breakawayInfo, sectorLogs } = Game.lastStageResults;
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
      <h2>Narrativa de carrera</h2>
      <p class="help">${escapeHtml(breakawayInfo.narrative)}</p>
      ${renderSectorLogSummary(sectorLogs)}
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

function renderSectorLogSummary(sectorLogs = []) {
  return `
    <div class="radio-list">
      ${sectorLogs.map(log => `
        <div class="radio-message">
          <span>${escapeHtml(log.sectorName)}</span>
          <p>${log.events.length ? escapeHtml(log.events.join(" · ")) : "Sector sin incidencias destacadas."}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderIncidentSummary(results) {
  const incidents = results
    .filter(result => result.incident || result.crisis || result.timeCut)
    .slice(0, 10);

  if (!incidents.length) {
    return `<p class="muted small">Sin incidentes importantes.</p>`;
  }

  return `
    <div class="incident-list">
      ${incidents.map(result => `
        <span class="incident-chip">
          ${escapeHtml(result.riderName)}:
          ${escapeHtml(result.incident?.type || (result.crisis ? "Pájara" : "Fuera de control"))}
        </span>
      `).join("")}
    </div>
  `;
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
          <th>Bonus</th>
          <th>UCI</th>
          <th>Inc.</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(result => `
          <tr class="${result.teamId === Game.selectedTeamId ? "user-team" : ""}">
            <td>${result.position}</td>
            <td>${escapeHtml(result.riderName)}${result.inBreakaway ? " ⚡" : ""}</td>
            <td>${escapeHtml(result.teamName)}</td>
            <td>${secondsToTime(result.stageTime)}</td>
            <td>${gapToLeader(result.stageTime, leaderTime)}</td>
            <td>${escapeHtml(result.groupLabel || "—")}</td>
            <td>${result.bonusSeconds ? `-${result.bonusSeconds}s` : "—"}</td>
            <td>${(isGrandTour() ? CLASSIFICATION_RULES.uci.grandTourStage : CLASSIFICATION_RULES.uci.oneDay)[result.position - 1] || 0}</td>
            <td>${result.incident ? escapeHtml(result.incident.type) : (result.crisis ? "Pájara" : result.timeCut ? "F.C." : "—")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderGeneralClassificationTable(limit = 25) {
  const race = getRace();
  const standings = getGCStandings().slice(0, limit);
  const leader = standings[0];
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
          ${Game.riders.slice(0, limit).map(rider => `
            <tr class="${rider.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${escapeHtml(rider.name)}</td>
              <td>${escapeHtml(getTeam(rider.teamId).name)}</td>
              <td>${escapeHtml(rider.role)}</td>
              <td>${rider.age}</td>
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
        ${standings.map((rider, index) => `
          <tr class="${rider.teamId === Game.selectedTeamId ? "user-team" : ""} ${index === 0 ? `race-leader ${race.leaderJerseyClass}` : ""}">
            <td>${index + 1}</td>
            <td>${escapeHtml(rider.name)}${rider.abandoned ? " ❌" : ""}</td>
            <td>${escapeHtml(getTeam(rider.teamId).name)}</td>
            <td>${secondsToTime(rider.totalTime)}</td>
            <td>${gapToLeader(rider.totalTime, leaderTime)}</td>
            <td>${Math.round(rider.fatigue)}</td>
            <td>${Math.round(rider.morale)}</td>
            <td>${rider.points}</td>
            <td>${rider.mountainPoints}</td>
            <td>${rider.uciPoints}</td>
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
          ${riders.slice(0, 5).map((rider, index) => `
            <tr class="${rider.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${index + 1}</td>
              <td>${escapeHtml(rider.name)}</td>
              <td>${mode === "time" ? secondsToTime(rider[key]) : rider[key]}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderTeamTable() {
  const teams = getTeamStandings();
  const leaderTime = teams[0]?.time || 0;

  return `
    <div class="mini-classification">
      <h3>Equipos</h3>
      <table>
        <tbody>
          ${teams.slice(0, 5).map((item, index) => `
            <tr class="${item.team.id === Game.selectedTeamId ? "user-team" : ""}">
              <td>${index + 1}</td>
              <td>${escapeHtml(item.team.name)}</td>
              <td>${gapToLeader(item.time, leaderTime)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderStageWinsTable() {
  const items = Object.entries(Game.stageWinCounts)
    .map(([id, count]) => ({ rider: getRider(id), count }))
    .filter(item => item.rider)
    .sort((a, b) => b.count - a.count);

  return `
    <div class="mini-classification">
      <h3>Victorias</h3>
      <table>
        <tbody>
          ${items.slice(0, 5).map((item, index) => `
            <tr class="${item.rider.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${index + 1}</td>
              <td>${escapeHtml(item.rider.name)}</td>
              <td>${item.count}</td>
            </tr>
          `).join("") || `<tr><td>—</td><td>Sin victorias</td><td>0</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderObjectivePanel() {
  const evaluations = evaluateObjectives();

  return `
    <div class="objectives-panel">
      ${evaluations.map(item => `
        <div class="objective-row ${item.ok ? "ok" : "bad"}">
          <span>${item.ok ? "✅" : "❌"}</span>
          <strong>${escapeHtml(item.label)}</strong>
          <small>Prestigio ${item.prestige} · ${money(item.budget)}</small>
        </div>
      `).join("")}
      <hr>
      <p class="muted small">
        Presupuesto: ${money(Game.budget)} · Prestigio: ${Math.round(Game.prestige)} · Sponsor: ${Math.round(Game.sponsorSatisfaction)}/100
      </p>
    </div>
  `;
}

function renderStageAnalysis(stage, results) {
  const userResult = results
    .filter(result => result.teamId === Game.selectedTeamId)
    .sort((a, b) => a.stageTime - b.stageTime)[0];

  const winner = results[0];
  const gc = getGCStandings();
  const bestUser = gc.find(rider => rider.teamId === Game.selectedTeamId);
  const bestUserPosition = gc.findIndex(rider => rider.id === bestUser?.id) + 1;

  return `
    <div class="grid three">
      <div class="stage-card">
        <span class="muted">Ganador</span>
        <div class="big-number">#1</div>
        <strong>${escapeHtml(winner.riderName)}</strong>
      </div>

      <div class="stage-card">
        <span class="muted">Mejor equipo</span>
        <div class="big-number">${userResult.position}</div>
        <strong>${escapeHtml(userResult.riderName)}</strong>
      </div>

      <div class="stage-card">
        <span class="muted">Tu mejor GC</span>
        <div class="big-number">${bestUserPosition}</div>
        <strong>${bestUser ? escapeHtml(bestUser.name) : "—"}</strong>
      </div>
    </div>

    <p class="help">${getStageComment(stage)}</p>
  `;
}

function getStageComment(stage) {
  if (stage.type === "mountain") return "Montaña: la nutrición, energía y gregarios quemados deciden la etapa.";
  if (stage.type === "hilly") return "Media montaña: fugas, cambios tácticos y geles antes del final son claves.";
  if (stage.type === "flat") return stage.profile.windExposure > 60 ? "Llano con viento: los cortes pueden mover la general." : "Llano: tren de sprint y colocación.";
  if (stage.type === "cobbles_hills") return "Pavés/muros: material y posicionamiento reducen mucho el riesgo.";
  if (stage.type === "time_trial") return "Crono: material TT y gestión de energía desde el primer sector.";
  return "CRE: bloque, homogeneidad y material de crono.";
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

  Game.currentStageIndex += 1;
  Game.activeTab = "strategy";
  Game.liveStage = null;
  resetUserRiderTactics("balanced");
  applyEquipmentPreset("auto");
  setNutritionPlan(Game.nutritionPlanId, false);

  saveGame();
  renderRaceScreen();
}

/* ============================================================
   FINALES / TEMPORADA
   ============================================================ */

function renderFinalScreen() {
  assignFinalUciPoints();
  applyObjectiveRewards();

  const race = getRace();

  app.innerHTML = `
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
        ${getGCStandings().slice(0, 3).map((rider, index) => `
          <div class="stage-card ${index === 0 ? race.leaderJerseyClass : ""}">
            <span class="badge green">#${index + 1}</span>
            <h3>${escapeHtml(rider.name)}</h3>
            <p class="muted">${escapeHtml(getTeam(rider.teamId).name)} · ${secondsToTime(rider.totalTime)} · UCI ${rider.uciPoints}</p>
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
        ${TRAINING_OPTIONS.map(option => `
          <button class="race-card" onclick="applyTrainingAndNextRace('${option.id}')">
            <span class="race-title">${escapeHtml(option.name)}</span>
            <span class="muted small">${escapeHtml(option.description)}</span>
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
  const option = TRAINING_OPTIONS.find(item => item.id === optionId);

  if (!option) return;

  Game.riders
    .filter(rider => rider.teamId === Game.selectedTeamId)
    .forEach(rider => {
      rider.fatigue = clamp(rider.fatigue + (option.effects.fatigue || 0), 0, 100);
      rider.form = clamp(rider.form + (option.effects.form || 0), 55, 99);
      rider.morale = clamp(rider.morale + (option.effects.morale || 0), 30, 100);

      ["mountain", "stamina", "timeTrial", "teamTimeTrial", "sprint", "positioning", "acceleration"].forEach(key => {
        if (option.effects[key]) {
          rider.stats[key] = clamp(rider.stats[key] + option.effects[key], 42, 99);
        }
      });
    });

  Game.seasonRaceIndex += 1;
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

/* ============================================================
   HISTORIAL
   ============================================================ */

function renderRivalComparison() {
  const gc = getGCStandings();
  const userBest = gc.find(rider => rider.teamId === Game.selectedTeamId);
  const userPosition = gc.findIndex(rider => rider.id === userBest?.id);
  const rival =
    gc.find((rider, index) => rider.teamId !== Game.selectedTeamId && Math.abs(index - userPosition) <= 2) ||
    gc.find(rider => rider.teamId !== Game.selectedTeamId);

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
        ${Game.stageHistory.map(item => `
          <tr class="${item.results[0]?.teamId === Game.selectedTeamId ? "user-team" : ""}">
            <td>${escapeHtml(item.stage.name)}</td>
            <td>${escapeHtml(item.stage.label)}</td>
            <td>${escapeHtml(item.results[0]?.riderName || "—")}</td>
            <td>${escapeHtml(item.results[0]?.teamName || "—")}</td>
            <td>${item.breakawayInfo?.success ? "Llegó" : "Neutralizada"}</td>
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
        ${Game.jerseyHistory.map(item => `
          <tr>
            <td>${item.stage}</td>
            <td>${escapeHtml(getRider(item.gc)?.name || "—")}</td>
            <td>${escapeHtml(getRider(item.points)?.name || "—")}</td>
            <td>${escapeHtml(getRider(item.mountain)?.name || "—")}</td>
            <td>${escapeHtml(getRider(item.youth)?.name || "—")}</td>
            <td>${escapeHtml(getTeam(item.teams)?.name || "—")}</td>
          </tr>
        `).join("") || `<tr><td>—</td><td colspan="5">Sin historial</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderIncidentHistory() {
  return `
    <div class="incident-list">
      ${Game.incidentHistory.slice(-20).map(item => `
        <span class="incident-chip">
          Et. ${item.stage} · ${escapeHtml(item.riderName)} · ${escapeHtml(item.type)}
          ${item.timeLoss ? `+${Math.round(item.timeLoss)}s` : ""}
        </span>
      `).join("") || `<span class="muted small">Sin incidencias.</span>`}
    </div>
  `;
}

initGame();
