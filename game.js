/* ============================================================
   CYCLING MANAGER TOUR - game.js
   v0.9 Race Director
   ============================================================ */

const app = document.getElementById("app");
const SAVE_KEY = "cyclingManagerTour_v09";

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
  riderOrders: {},
  riderEfforts: {},
  riderEquipment: {},
  nutritionPlanId: "auto_balanced",
  autoNutritionMode: "auto_smart",
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

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

function getOrder(orderId) {
  return RIDER_ORDERS.find(order => order.id === orderId) || RIDER_ORDERS.find(order => order.id === "hold_position");
}

function getFrameBrand(id) {
  return FRAME_BRANDS.find(item => item.id === id) || FRAME_BRANDS[0];
}

function getWheelBrand(id) {
  return WHEEL_BRANDS.find(item => item.id === id) || WHEEL_BRANDS[0];
}

function getBikeSetup(id) {
  return BIKE_SETUPS.find(item => item.id === id) || BIKE_SETUPS[0];
}

function getWheelSetup(id) {
  return WHEEL_SETUPS.find(item => item.id === id) || WHEEL_SETUPS[0];
}

function getNutritionItem(id) {
  return NUTRITION_ITEMS.find(item => item.id === id);
}

function getNutritionPlan() {
  return NUTRITION_PLANS.find(plan => plan.id === Game.nutritionPlanId) || NUTRITION_PLANS[0];
}

function getAutoNutritionMode() {
  return AUTO_NUTRITION_MODES.find(mode => mode.id === Game.autoNutritionMode) || AUTO_NUTRITION_MODES[0];
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

function getRiderOrder(rider) {
  return getOrder(Game.riderOrders[rider.id] || rider.defaultOrder || "hold_position");
}

function getRiderEffort(rider) {
  return Game.riderEfforts[rider.id] ?? rider.defaultEffort ?? 60;
}

function isGrandTour() {
  return getRace().uciClass === "grand_tour";
}

function isLiveStageActive() {
  return Game.liveStage && Game.liveStage.active;
}

function isTeamTimeTrialStage(stage = getCurrentStage()) {
  return stage && stage.type === "team_time_trial";
}

/* ============================================================
   GUARDADO
   ============================================================ */

function saveGame(show = false) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(Game));
  if (show) alert("Partida guardada.");
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);

  if (!raw) {
    alert("No hay partida guardada.");
    return;
  }

  Object.assign(Game, JSON.parse(raw));

  if (!Game.riderOrders) Game.riderOrders = {};
  if (!Game.riderEfforts) Game.riderEfforts = {};

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
  Game.riderOrders = {};
  Game.riderEfforts = {};
  Game.riderEquipment = {};
  Game.nutritionPlanId = "auto_balanced";
  Game.autoNutritionMode = "auto_smart";
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
  Game.riderOrders = {};
  Game.riderEfforts = {};
  Game.riderEquipment = {};
  Game.teamNutritionStock = {};

  Game.teamTimes = Object.fromEntries(TEAMS.map(team => [team.id, 0]));
  Game.stageHistory = [];
  Game.jerseyHistory = [];
  Game.incidentHistory = [];
  Game.objectiveResults = [];
  Game.lastStageResults = null;
  Game.finalUciAssignedForRace[Game.selectedRaceId] = false;

  Game.riders.forEach(rider => {
    rider.totalTime = 0;
    rider.raceDays = 0;
    rider.points = 0;
    rider.mountainPoints = 0;
    rider.abandoned = false;
    rider.stageWins = 0;
    rider.energy = 100;
    rider.fatigue = resetRidersForNewGame ? 0 : clamp(rider.fatigue, 0, 70);
  });

  Game.protectedRiderId = getTeamRiders(Game.selectedTeamId)[0]?.id || null;
  resetUserRiderTactics("balanced");
  resetUserOrdersAndEfforts();
  applyEquipmentPreset("auto", false);
  setNutritionPlan("auto_balanced", false);
  Game.autoNutritionMode = "auto_smart";
}

function resetUserRiderTactics(tacticId = "balanced") {
  Game.riderTactics = {};
  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    Game.riderTactics[rider.id] = tacticId;
  });
}

function resetUserOrdersAndEfforts() {
  Game.riderOrders = {};
  Game.riderEfforts = {};

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    Game.riderOrders[rider.id] = rider.defaultOrder || "hold_position";
    Game.riderEfforts[rider.id] = rider.defaultEffort || 60;
  });
}

/* ============================================================
   ESTRATEGIA / ESFUERZOS
   ============================================================ */

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

function setRiderOrder(riderId, orderId) {
  Game.riderOrders[riderId] = orderId;
  renderRaceScreen();
}

function setRiderEffort(riderId, effort) {
  Game.riderEfforts[riderId] = Number(effort);
  renderRaceScreen();
}

function setRiderEffortLive(riderId, effort) {
  Game.riderEfforts[riderId] = Number(effort);
  renderLiveStageScreen();
}

function setRiderOrderLive(riderId, orderId) {
  Game.riderOrders[riderId] = orderId;
  const rider = getRider(riderId);
  addRadio(`${rider.name}: orden cambiada a ${getOrder(orderId).name}.`);
  renderLiveStageScreen();
}

function setRoleEffort(roleGroup, effort) {
  const roles =
    roleGroup === "leaders" ? ["gc", "co_leader"] :
    roleGroup === "climbers" ? ["climber", "puncheur"] :
    roleGroup === "workers" ? ["domestique", "rouleur", "time_trialist"] :
    roleGroup === "sprinters" ? ["sprinter", "classics"] :
    [];

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    if (roles.includes(rider.roleKey)) Game.riderEfforts[rider.id] = Number(effort);
  });

  renderRaceScreen();
}

function setRoleOrder(roleGroup, orderId) {
  const roles =
    roleGroup === "leaders" ? ["gc", "co_leader"] :
    roleGroup === "climbers" ? ["climber", "puncheur"] :
    roleGroup === "workers" ? ["domestique", "rouleur", "time_trialist"] :
    roleGroup === "sprinters" ? ["sprinter", "classics"] :
    [];

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    if (roles.includes(rider.roleKey)) Game.riderOrders[rider.id] = orderId;
  });

  renderRaceScreen();
}

function applySmartPreset(presetId) {
  const stage = getCurrentStage();

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    let tactic = "balanced";
    let order = "hold_position";
    let effort = rider.defaultEffort || 60;

    if (presetId === "protect_gc") {
      tactic = rider.id === Game.protectedRiderId ? "balanced" : "protect_leader";
      order = rider.id === Game.protectedRiderId ? "hold_position" : "protect_leader";
      effort = rider.id === Game.protectedRiderId ? 66 : 70;
    }

    if (presetId === "sprint") {
      tactic = rider.roleKey === "sprinter" ? "aggressive" : ["rouleur", "classics", "domestique"].includes(rider.roleKey) ? "sprint_train" : "conservative";
      order = rider.roleKey === "sprinter" ? "hold_position" : ["rouleur", "classics", "domestique"].includes(rider.roleKey) ? "sprint_train" : "sit_in";
      effort = rider.roleKey === "sprinter" ? 62 : ["rouleur", "classics", "domestique"].includes(rider.roleKey) ? 78 : 42;
    }

    if (presetId === "breakaway") {
      tactic = ["puncheur", "classics", "rouleur", "climber"].includes(rider.roleKey) ? "aggressive" : "conservative";
      order = ["puncheur", "classics", "rouleur", "climber"].includes(rider.roleKey) ? "attack" : "sit_in";
      effort = ["puncheur", "classics", "rouleur", "climber"].includes(rider.roleKey) ? 88 : 42;
    }

    if (presetId === "mountain_attack") {
      tactic = ["gc", "co_leader", "climber"].includes(rider.roleKey) ? "aggressive" : "protect_leader";
      order = ["gc", "co_leader"].includes(rider.roleKey) ? "attack" : ["climber", "domestique"].includes(rider.roleKey) ? "climb_tempo" : "sit_in";
      effort = ["gc", "co_leader"].includes(rider.roleKey) ? 86 : ["climber", "domestique"].includes(rider.roleKey) ? 82 : 42;
    }

    if (presetId === "survival") {
      tactic = "conservative";
      order = "sit_in";
      effort = 38;
    }

    if (presetId === "time_trial") {
      tactic = ["gc", "co_leader", "time_trialist", "rouleur"].includes(rider.roleKey) || ["time_trial", "team_time_trial"].includes(stage.type) ? "aggressive" : "balanced";
      order = "pull_group";
      effort = ["gc", "co_leader", "time_trialist", "rouleur"].includes(rider.roleKey) ? 86 : 70;
    }

    Game.riderTactics[rider.id] = tactic;
    Game.riderOrders[rider.id] = order;
    Game.riderEfforts[rider.id] = effort;
  });

  renderRaceScreen();
}

/* ============================================================
   MATERIAL
   ============================================================ */

function autoEquipmentForStage(stage, teamId = Game.selectedTeamId) {
  const contract = getTeam(teamId)?.equipmentContract || TEAMS[0].equipmentContract;

  if (stage.type === "time_trial" || stage.type === "team_time_trial") {
    return { frameBrand: contract.frameBrand, wheelBrand: contract.wheelBrand, bikeType: "tt", wheelType: "disc_tt" };
  }

  if (stage.type === "mountain") {
    return { frameBrand: contract.frameBrand, wheelBrand: contract.wheelBrand, bikeType: "lightweight", wheelType: "climbing" };
  }

  if (stage.type === "cobbles_hills" || stage.profile.roadSurface === "pavé") {
    return { frameBrand: contract.frameBrand, wheelBrand: contract.wheelBrand, bikeType: "endurance", wheelType: "cobbles" };
  }

  if (stage.type === "hilly") {
    return { frameBrand: contract.frameBrand, wheelBrand: contract.wheelBrand, bikeType: "lightweight", wheelType: "mid_45" };
  }

  if (stage.profile.windExposure > 65 || stage.profile.rainRisk > 45) {
    return { frameBrand: contract.frameBrand, wheelBrand: contract.wheelBrand, bikeType: "endurance", wheelType: "mid_45" };
  }

  return { frameBrand: contract.frameBrand, wheelBrand: contract.wheelBrand, bikeType: "aero", wheelType: "deep_60" };
}

function applyEquipmentPreset(presetId, rerender = true) {
  const stage = getCurrentStage();

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    const current = getRiderEquipment(rider.id);
    let setup;

    if (presetId === "auto") {
      setup = autoEquipmentForStage(stage, rider.teamId);
    } else {
      const preset = EQUIPMENT_PRESETS.find(item => item.id === presetId);
      setup = {
        frameBrand: current.frameBrand,
        wheelBrand: current.wheelBrand,
        bikeType: preset?.bikeType || current.bikeType,
        wheelType: preset?.wheelType || current.wheelType
      };
    }

    Game.riderEquipment[rider.id] = setup;
  });

  if (rerender) renderRaceScreen();
}

function setRiderEquipmentField(riderId, field, value) {
  Game.riderEquipment[riderId] = getRiderEquipment(riderId);
  Game.riderEquipment[riderId][field] = value;
  renderRaceScreen();
}

function setTeamMaterial(field, value) {
  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    Game.riderEquipment[rider.id] = getRiderEquipment(rider.id);
    Game.riderEquipment[rider.id][field] = value;
  });
  renderRaceScreen();
}

function getRiderEquipment(riderId) {
  const rider = getRider(riderId);
  if (!rider) return autoEquipmentForStage(getCurrentStage());

  if (!Game.riderEquipment[riderId]) {
    Game.riderEquipment[riderId] = autoEquipmentForStage(getCurrentStage(), rider.teamId);
  }

  return Game.riderEquipment[riderId];
}

function calculateMaterialScore(setup, stage, sector) {
  const frame = getFrameBrand(setup.frameBrand);
  const wheel = getWheelBrand(setup.wheelBrand);
  const bikeType = getBikeSetup(setup.bikeType);
  const wheelType = getWheelSetup(setup.wheelType);

  const terrain =
    sector.type === "climb" || stage.type === "mountain" ? "mountain" :
    sector.type === "cobbles" || stage.profile.roadSurface === "pavé" ? "cobbles" :
    sector.type === "tt" || stage.type.includes("time_trial") ? "tt" :
    sector.type === "final" && stage.type === "flat" ? "sprint" :
    sector.type === "hilly" || sector.type === "wall" || stage.type === "hilly" ? "hilly" :
    "flat";

  const frameAero = frame.aero * bikeType.aero;
  const frameWeight = frame.weight * bikeType.weight;
  const frameStiff = frame.stiffness * bikeType.stiffness;
  const frameComfort = frame.comfort * bikeType.comfort;
  const frameHandling = frame.handling * bikeType.handling;
  const frameTT = frame.tt * bikeType.tt;

  const wheelAero = wheel.aero * wheelType.aero;
  const wheelWeight = wheel.weight * wheelType.weight;
  const wheelStiff = wheel.stiffness * wheelType.stiffness;
  const wheelWind = wheel.crosswind * wheelType.crosswind;
  const wheelCobbles = wheel.cobbles * wheelType.cobbles;
  const wheelTT = wheel.tt * wheelType.tt;

  let score;

  if (terrain === "mountain") {
    score = frameWeight * 0.36 + wheelWeight * 0.27 + frameStiff * 0.14 + frameHandling * 0.12 + wheelStiff * 0.11;
  } else if (terrain === "cobbles") {
    score = frameComfort * 0.25 + wheelCobbles * 0.30 + frameHandling * 0.18 + frame.stiffness * 0.10 + wheel.reliability * 0.17;
  } else if (terrain === "tt") {
    score = frameTT * 0.34 + wheelTT * 0.32 + frameAero * 0.17 + wheelAero * 0.17;
  } else if (terrain === "sprint") {
    score = frameStiff * 0.26 + wheelStiff * 0.22 + frameAero * 0.24 + wheelAero * 0.18 + frameHandling * 0.10;
  } else if (terrain === "hilly") {
    score = frameWeight * 0.24 + wheelWeight * 0.18 + frameStiff * 0.18 + frameHandling * 0.20 + frameAero * 0.10 + wheelAero * 0.10;
  } else {
    score = frameAero * 0.32 + wheelAero * 0.30 + frameStiff * 0.15 + wheelStiff * 0.10 + wheelWind * 0.13;
  }

  const windPenalty = stage.profile.windExposure > 60 ? Math.max(0, 90 - wheelWind) * 0.08 : 0;
  const reliabilityPenalty = Math.max(0, 88 - average([frame.reliability, wheel.reliability])) * 0.05;

  return clamp(score / 100 - windPenalty - reliabilityPenalty, 65, 112);
}

/* ============================================================
   NUTRICIÓN
   ============================================================ */

function setNutritionPlan(planId, rerender = true) {
  Game.nutritionPlanId = planId;
  Game.teamNutritionStock = deepClone(getNutritionPlan().stock);
  if (rerender) renderRaceScreen();
}

function setAutoNutritionMode(modeId) {
  Game.autoNutritionMode = modeId;
  renderRaceScreen();
}

/* ============================================================
   HOME
   ============================================================ */

function renderHome() {
  const saved = !!localStorage.getItem(SAVE_KEY);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Cycling Manager Tour 🚴‍♂️</h1>
        <p>v0.9 Race Director · sliders de esfuerzo · perfil detallado · simulación rápida</p>
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
  const frame = getFrameBrand(team.equipmentContract.frameBrand);
  const wheels = getWheelBrand(team.equipmentContract.wheelBrand);

  return `
    <div class="team-card team-border" style="--team-primary:${team.visual.primary};--team-secondary:${team.visual.secondary};--team-accent:${team.visual.accent};">
      ${renderTeamJerseyVisual(team)}

      <div class="badge-row">
        <span class="badge ${team.color}">${escapeHtml(team.archetype)}</span>
        <span class="badge">${money(team.management.budget)}</span>
        <span class="badge blue">Prestigio ${team.management.prestige}</span>
      </div>

      <h3>${escapeHtml(team.name)}</h3>
      <p class="muted">${escapeHtml(team.description)}</p>

      <div class="material-mini">
        <span>🚲 ${escapeHtml(frame.name)}</span>
        <span>🛞 ${escapeHtml(wheels.name)}</span>
      </div>

      <div class="badge-row">
        ${riders.slice(0, 8).map(rider => `<span class="badge">${escapeHtml(rider.name)}</span>`).join("")}
      </div>

      <div class="objectives-list">
        ${team.objectives.map(id => `<span class="objective-chip">${escapeHtml(OBJECTIVE_DEFINITIONS[id]?.label || id)}</span>`).join("")}
      </div>

      <button onclick="startWithTeam('${team.id}')">Competir con este equipo</button>
    </div>
  `;
}

function renderTeamJerseyVisual(team) {
  return `
    <div class="team-visual-card" style="--team-primary:${team.visual.primary};--team-secondary:${team.visual.secondary};--team-accent:${team.visual.accent};">
      ${team.visual.jerseyImage ? `
        <img src="${team.visual.jerseyImage}" alt="Maillot ${escapeHtml(team.name)}" class="team-jersey-img" onerror="this.style.display='none'; this.parentElement.classList.add('fallback-jersey');">
      ` : ""}
      <div class="jersey-fallback-art">
        <div class="jersey-sleeve left"></div>
        <div class="jersey-body">
          <span>${escapeHtml(team.visual.logoText || team.name)}</span>
        </div>
        <div class="jersey-sleeve right"></div>
      </div>
    </div>
  `;
}

/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */

function renderRaceScreen() {
  if (!Game.selectedTeamId) return renderHome();
  if (Game.seasonFinished) return renderSeasonFinalScreen();
  if (Game.betweenRaces) return renderTrainingScreen();
  if (Game.finished) return renderFinalScreen();
  if (isLiveStageActive()) return renderLiveStageScreen();

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
    ["strategy", "Race Director"],
    ["equipment", "Material"],
    ["nutrition", "Nutrición"],
    ["team", "Equipo"],
    ["classifications", "Clasificaciones"],
    ["history", "Historial"]
  ];

  return `
    <div class="tabs">
      ${tabs.map(([id, label]) => `
        <button class="tab-button ${Game.activeTab === id ? "active" : ""}" onclick="setActiveTab('${id}')">${label}</button>
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

/* ============================================================
   TABS
   ============================================================ */

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
        <div class="stage-list">${getStages().map(renderStageProgressCard).join("")}</div>
      </section>
    </div>
  `;
}

function renderStrategyTab() {
  const riders = getTeamRiders(Game.selectedTeamId);
  const stage = getCurrentStage();

  return `
    <div class="race-director-layout">
      <section class="panel">
        <div class="director-header">
          <div>
            <h2>Race Director</h2>
            <p class="help">Define estrategia de salida, esfuerzos, órdenes y decide si simular rápido o por sectores.</p>
          </div>
          <div class="badge-row">
            <span class="badge green">${escapeHtml(stage.label)}</span>
            <span class="badge">${stage.distance} km</span>
            <span class="badge orange">Dificultad ${stage.difficulty}</span>
          </div>
        </div>

        ${renderCurrentStage(stage)}
        ${renderTacticalAdvice(false)}

        <div class="simulation-actions">
          <div>
            <strong>Simulación rápida</strong>
            <div class="muted small">Usa la estrategia, órdenes y esfuerzos actuales. No entra sector por sector.</div>
          </div>
          <button onclick="simulateFullStageQuick()">Simular etapa rápida</button>
        </div>

        <div class="simulation-actions">
          <div>
            <strong>Simulación Race Director</strong>
            <div class="muted small">Avanza por sectores, lee grupos, ajusta esfuerzos y toma decisiones durante la etapa.</div>
          </div>
          <button onclick="startLiveStage()">Iniciar etapa por sectores</button>
        </div>
      </section>

      <section class="panel">
        ${renderProtectedRiderSelector(riders)}
        ${renderSmartPresets()}
        ${renderQuickEffortControls()}
        ${renderIndividualRaceDirector(riders)}
      </section>
    </div>
  `;
}

function renderEquipmentTab() {
  const team = getTeam(Game.selectedTeamId);
  const contract = team.equipmentContract;

  return `
    <section class="panel">
      <h2>Material de carrera</h2>
      <p class="help">
        Ratings internos del simulador. Las imágenes son orientativas para identificar visualmente cada tipo de cuadro o rueda.
      </p>

      <div class="grid two">
        <div class="equipment-brand-card">
          <h3>Cuadro del equipo</h3>
          ${renderMaterialImage(getFrameBrand(contract.frameBrand), "frame")}
          <select onchange="setTeamMaterial('frameBrand', this.value)">
            ${FRAME_BRANDS.map(brand => `<option value="${brand.id}" ${contract.frameBrand === brand.id ? "selected" : ""}>${brand.name}</option>`).join("")}
          </select>
          ${renderMaterialBars(getFrameBrand(contract.frameBrand), ["aero", "weight", "stiffness", "comfort", "handling", "cobbles", "tt", "reliability"])}
        </div>

        <div class="equipment-brand-card">
          <h3>Ruedas del equipo</h3>
          ${renderMaterialImage(getWheelBrand(contract.wheelBrand), "wheel")}
          <select onchange="setTeamMaterial('wheelBrand', this.value)">
            ${WHEEL_BRANDS.map(brand => `<option value="${brand.id}" ${contract.wheelBrand === brand.id ? "selected" : ""}>${brand.name}</option>`).join("")}
          </select>
          ${renderMaterialBars(getWheelBrand(contract.wheelBrand), ["aero", "weight", "stiffness", "crosswind", "cobbles", "tt", "reliability"])}
        </div>
      </div>

      <hr>

      <h2>Presets por etapa</h2>
      <div class="preset-row">
        ${EQUIPMENT_PRESETS.map(preset => `
          <button class="secondary" onclick="applyEquipmentPreset('${preset.id}')">${escapeHtml(preset.name)}</button>
        `).join("")}
      </div>

      <div class="strategy-grid">
        ${getTeamRiders(Game.selectedTeamId).map(renderEquipmentCard).join("")}
      </div>
    </section>
  `;
}

function renderNutritionTab() {
  const plan = getNutritionPlan();

  return `
    <section class="panel">
      <h2>Nutrición de carrera</h2>
      <p class="help">El modo automático permite que los corredores coman solos según energía, hidratación, sector y final.</p>

      <h2>Modo de alimentación</h2>
      <div class="race-grid">
        ${AUTO_NUTRITION_MODES.map(mode => `
          <button class="race-card ${Game.autoNutritionMode === mode.id ? "active" : ""}" onclick="setAutoNutritionMode('${mode.id}')">
            <span class="race-title">${escapeHtml(mode.name)}</span>
            <span class="muted small">${escapeHtml(mode.description)}</span>
          </button>
        `).join("")}
      </div>

      <hr>

      <h2>Plan base de stock</h2>
      <div class="race-grid">
        ${NUTRITION_PLANS.map(item => `
          <button class="race-card ${Game.nutritionPlanId === item.id ? "active" : ""}" onclick="setNutritionPlan('${item.id}')">
            <span class="race-title">${escapeHtml(item.name)}</span>
            <span class="muted small">${escapeHtml(item.description)}</span>
          </button>
        `).join("")}
      </div>

      <hr>
      <h2>Stock inicial</h2>
      ${renderNutritionStock(plan.stock)}
    </section>
  `;
}

function renderTeamTab() {
  return `
    <section class="panel">
      <h2>Tu equipo</h2>
      <div class="rider-grid">${getTeamRiders(Game.selectedTeamId).map(renderRiderCard).join("")}</div>
    </section>
  `;
}

function renderClassificationsTab() {
  return `
    <div class="grid two">
      <section class="panel">
        <h2>General</h2>
        ${renderGeneralClassificationTable(120)}
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

/* ============================================================
   PERFIL Y ETAPA
   ============================================================ */

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
      ${renderDetailedStageProfile(stage)}
      ${renderTerrainLegend()}
      ${renderClimbAndPaveDetails(stage)}
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

function buildProfilePoints(stage) {
  const points = [{ km: 0, alt: 120 }];
  const climbs = [...(stage.profile.climbs || [])].sort((a, b) => a.km - b.km);
  let currentAlt = 120;

  climbs.forEach(climbItem => {
    const startKm = clamp(climbItem.km - climbItem.length, 0, stage.distance);
    const climbGain = climbItem.length * climbItem.gradient * 10;

    points.push({ km: Math.max(0, startKm - 8), alt: Math.max(80, currentAlt - 120) });
    points.push({ km: startKm, alt: currentAlt });

    currentAlt = climbItem.altitude || clamp(currentAlt + climbGain, 200, 2600);
    points.push({ km: climbItem.km, alt: currentAlt });

    currentAlt = Math.max(120, currentAlt - climbGain * 0.45);
  });

  points.push({
    km: stage.distance,
    alt: stage.profile.finalClimb ? currentAlt : Math.max(100, currentAlt - 150)
  });

  return points.sort((a, b) => a.km - b.km);
}

function renderDetailedStageProfile(stage, liveGroups = [], eventIcons = []) {
  const points = buildProfilePoints(stage);
  const maxAlt = Math.max(...points.map(p => p.alt), 1000);
  const minAlt = Math.min(...points.map(p => p.alt), 0);
  const width = 1040;
  const height = 310;
  const pad = 32;

  const d = points.map((p, index) => {
    const x = pad + (p.km / stage.distance) * (width - pad * 2);
    const y = height - 58 - ((p.alt - minAlt) / Math.max(1, maxAlt - minAlt)) * (height - 96);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const terrain = (stage.profile.visualSegments || []).map(seg => {
    const x = pad + (seg.from / stage.distance) * (width - pad * 2);
    const w = Math.max(2, ((seg.to - seg.from) / stage.distance) * (width - pad * 2));
    return `
      <rect x="${x}" y="${height - 38}" width="${w}" height="14" class="terrain-segment terrain-${seg.type}">
        <title>${escapeHtml(seg.label || seg.type)}</title>
      </rect>
    `;
  }).join("");

  const climbs = (stage.profile.climbs || []).map(c => {
    const x = pad + (c.km / stage.distance) * (width - pad * 2);
    const y = getProfileYAtKm(points, c.km, minAlt, maxAlt, height, pad) - 8;
    return `
      <g>
        <line x1="${x}" y1="${y}" x2="${x}" y2="${height - 58}" class="profile-climb-line"/>
        <circle cx="${x}" cy="${y}" r="5" class="climb-dot cat-${String(c.category).replace("HC", "hc")}"/>
        <text x="${x + 7}" y="${y - 4}" class="profile-label">${escapeHtml(c.category)} · ${escapeHtml(c.name)}</text>
        <text x="${x + 7}" y="${y + 10}" class="profile-sub-label">${c.length} km · ${c.gradient}% · máx ${c.maxGradient}%</text>
      </g>
    `;
  }).join("");

  const groupMarkers = liveGroups.map((group, index) => {
    const x = pad + (group.km / stage.distance) * (width - pad * 2);
    const y = getProfileYAtKm(points, group.km, minAlt, maxAlt, height, pad) - 14 - index * 5;
    return `
      <g class="group-marker ${group.className}">
        <line x1="${x}" y1="${y + 10}" x2="${x}" y2="${height - 58}" class="group-marker-line"/>
        <circle cx="${x}" cy="${y}" r="10" class="group-dot"/>
        <text x="${x + 14}" y="${y + 4}" class="group-marker-text">${escapeHtml(group.label)} · ${group.riders.length}</text>
      </g>
    `;
  }).join("");

  const events = eventIcons.map(event => {
    const x = pad + (event.km / stage.distance) * (width - pad * 2);
    const y = 38;
    const icon = event.type === "crash" ? "💥" : event.type === "food" ? "🍌" : event.type === "attack" ? "⚡" : event.type === "mechanical" ? "🔧" : "❗";
    return `<text x="${x}" y="${y}" class="event-icon"><title>${escapeHtml(event.label)}</title>${icon}</text>`;
  }).join("");

  const kmTicks = [0, .25, .5, .75, 1].map(v => {
    const km = Math.round(stage.distance * v);
    const x = pad + v * (width - pad * 2);
    return `
      <line x1="${x}" y1="${height - 58}" x2="${x}" y2="${height - 46}" class="profile-tick"/>
      <text x="${x - 10}" y="${height - 20}" class="profile-km">km ${km}</text>
    `;
  }).join("");

  return `
    <div class="profile-box detailed-profile">
      <svg viewBox="0 0 ${width} ${height}">
        <path d="M${pad},${height - 58} L${width - pad},${height - 58}" class="profile-axis"/>
        ${terrain}
        <path d="${d} L${width - pad},${height - 58} L${pad},${height - 58} Z" class="profile-area"/>
        <path d="${d}" class="profile-line"/>
        ${kmTicks}
        ${climbs}
        ${events}
        ${groupMarkers}
      </svg>
    </div>
  `;
}

function renderTerrainLegend() {
  return `
    <div class="terrain-legend">
      <span><b class="terrain-color terrain-flat"></b> Llano</span>
      <span><b class="terrain-color terrain-climb"></b> Subida</span>
      <span><b class="terrain-color terrain-climb-hard"></b> HC/1ª</span>
      <span><b class="terrain-color terrain-descent"></b> Descenso</span>
      <span><b class="terrain-color terrain-pave"></b> Pavé</span>
      <span><b class="terrain-color terrain-wall"></b> Muro</span>
      <span><b class="terrain-color terrain-wind"></b> Viento</span>
      <span><b class="terrain-color terrain-sprint"></b> Sprint</span>
    </div>
  `;
}

function renderClimbAndPaveDetails(stage) {
  const climbs = stage.profile.climbs || [];
  const pavés = stage.profile.paveSegments || [];
  const walls = stage.profile.walls || [];

  if (!climbs.length && !pavés.length && !walls.length) {
    return `<p class="muted small">Sin puertos, pavé o muros destacados.</p>`;
  }

  return `
    <div class="terrain-detail-grid">
      ${climbs.map(c => `
        <div class="terrain-detail-card climb-card">
          <strong>${escapeHtml(c.category)} · ${escapeHtml(c.name)}</strong>
          <span>Km ${c.km} · ${c.length} km · ${c.gradient}%</span>
          <small>Máx ${c.maxGradient}% · Alt. ${c.altitude} m · Severidad ${c.severity}/5</small>
        </div>
      `).join("")}
      ${pavés.map(p => `
        <div class="terrain-detail-card pave-card">
          <strong>🪨 ${escapeHtml(p.name)}</strong>
          <span>Km ${p.kmStart}-${p.kmEnd}</span>
          <small>Severidad pavé ${p.severity}/5</small>
        </div>
      `).join("")}
      ${walls.map(w => `
        <div class="terrain-detail-card wall-card">
          <strong>▲ ${escapeHtml(w.name)}</strong>
          <span>Km ${w.km} · ${w.length} km · ${w.gradient}%</span>
          <small>Máx ${w.maxGradient}% · Severidad ${w.severity}/5</small>
        </div>
      `).join("")}
    </div>
  `;
}

function getProfileYAtKm(points, km, minAlt, maxAlt, height, pad) {
  let previous = points[0];
  let next = points[points.length - 1];

  for (let i = 1; i < points.length; i++) {
    if (points[i].km >= km) {
      next = points[i];
      previous = points[i - 1];
      break;
    }
  }

  const ratio = (km - previous.km) / Math.max(1, next.km - previous.km);
  const alt = previous.alt + (next.alt - previous.alt) * ratio;
  return height - 58 - ((alt - minAlt) / Math.max(1, maxAlt - minAlt)) * (height - 96);
}

function renderSectorTimeline(stage) {
  return `
    <div class="sector-timeline">
      ${stage.sectors.map((sector, index) => `
        <div class="sector-chip">
          <strong>${index + 1}</strong>
          <span>${escapeHtml(sector.name)}</span>
          <small>km ${sector.kmStart}-${sector.kmEnd}</small>
          <em>${escapeHtml(sector.tacticalQuestion)}</em>
        </div>
      `).join("")}
    </div>
  `;
}

function renderStageProgressCard(stage, index) {
  const statusClass = index < Game.currentStageIndex ? "done" : index === Game.currentStageIndex ? "current" : "";
  const status = index < Game.currentStageIndex ? "Completada" : index === Game.currentStageIndex ? "Actual" : "Pendiente";

  return `
    <div class="stage-card ${statusClass}">
      <div class="badge-row">
        <span class="badge">Etapa ${stage.number}</span>
        <span class="badge blue">${escapeHtml(stage.label)}</span>
        <span class="badge ${index === Game.currentStageIndex ? "green" : ""}">${status}</span>
      </div>
      <strong>${escapeHtml(stage.name)}</strong>
      <div class="muted small">${stage.distance} km · ${stage.profile.climbs.length} puertos · ${stage.profile.paveSegments.length} pavés · ${stage.profile.walls.length} muros</div>
    </div>
  `;
}

/* ============================================================
   RACE DIRECTOR
   ============================================================ */

function renderTacticalAdvice(isLive = false) {
  const stage = getCurrentStage();
  const advice = generateTacticalAdvice(isLive);

  return `
    <div class="tactical-advice danger-${advice.danger}">
      <div class="advice-main">
        <span>${advice.icon}</span>
        <div>
          <strong>${escapeHtml(advice.title)}</strong>
          <p>${escapeHtml(advice.text)}</p>
        </div>
      </div>
      <div class="advice-actions">
        ${advice.actions.map(action => `<span>${escapeHtml(action)}</span>`).join("")}
      </div>
    </div>
  `;
}

function generateTacticalAdvice(isLive = false) {
  const stage = getCurrentStage();
  const leader = getRider(Game.protectedRiderId);
  const leaderLive = isLive && leader ? Game.liveStage.riderState[leader.id] : null;

  if (isLive && Game.liveStage.breakawayGap > 240 && !isTeamTimeTrialStage(stage)) {
    return {
      danger: "high",
      icon: "🚨",
      title: "Fuga peligrosa",
      text: `La fuga tiene ${secondsToTime(Game.liveStage.breakawayGap)}. Si quieres disputar etapa, pon rodadores a tirar fuerte.`,
      actions: ["Rodadores: 78-86%", "Orden: Cazar fuga", "Líder: conservar"]
    };
  }

  if (isLive && leaderLive && leaderLive.energy < 38) {
    return {
      danger: "high",
      icon: "🍌",
      title: "Líder bajo de energía",
      text: `${leader.name} está con energía ${Math.round(leaderLive.energy)}. Alimenta antes de que llegue el sector decisivo.`,
      actions: ["Gel o isotónico", "Esfuerzo líder 55-65%", "Gregarios protegen"]
    };
  }

  if (isLive && leaderLive && leaderLive.groupLabel && /Cortado|Grupo 2|Descolgado/.test(leaderLive.groupLabel)) {
    return {
      danger: "high",
      icon: "⚠️",
      title: "Tu líder está mal colocado",
      text: `${leader.name} va en ${leaderLive.groupLabel}. Necesitas ayuda de gregarios o subir ritmo.`,
      actions: ["Orden: Esperar líder", "Escaladores 75-82%", "Evitar all-in"]
    };
  }

  if (stage.type === "mountain") {
    return {
      danger: "medium",
      icon: "⛰️",
      title: "Etapa de montaña decisiva",
      text: "La clave será llegar al último puerto con energía. Endurece con gregarios antes de atacar con el líder.",
      actions: ["Líder 68-78%", "Escaladores tempo", "Gel antes del final"]
    };
  }

  if (stage.type === "cobbles_hills") {
    return {
      danger: "medium",
      icon: "🪨",
      title: "Pavé y muros",
      text: "Prioriza ir delante. El material endurance y ruedas pavés reducen averías y caídas.",
      actions: ["Proteger líder", "Esfuerzo 70-78%", "Evitar ataque temprano"]
    };
  }

  if (stage.type === "flat" && stage.profile.windExposure > 58) {
    return {
      danger: "medium",
      icon: "💨",
      title: "Riesgo de abanicos",
      text: "Hay viento lateral. Mantén líder delante y usa gregarios para proteger.",
      actions: ["Líder 65-72%", "Gregarios protegen", "Ruedas 45 mm"]
    };
  }

  if (stage.type === "team_time_trial") {
    return {
      danger: "medium",
      icon: "⏱️",
      title: "Crono por equipos",
      text: "Mantén mínimo 4 corredores juntos. El tiempo lo marca el 4º corredor del bloque.",
      actions: ["Todos 75-88%", "Rodadores tiran", "Evitar descolgados"]
    };
  }

  if (stage.type === "time_trial") {
    return {
      danger: "low",
      icon: "⏱️",
      title: "Crono individual",
      text: "El material TT y el esfuerzo estable son la clave.",
      actions: ["Líder 82-90%", "Cabra + lenticular", "Sin ataques"]
    };
  }

  return {
    danger: "low",
    icon: "📡",
    title: "Etapa controlable",
    text: "Mantén estrategia equilibrada y decide si cazar fuga según composición y hueco.",
    actions: ["Líder protegido", "Rodadores 60-70%", "Nutrición automática"]
  };
}

function renderQuickEffortControls() {
  return `
    <h2>Control rápido por rol</h2>
    <div class="quick-effort-grid">
      ${renderRoleEffortControl("leaders", "Líderes GC", 68)}
      ${renderRoleEffortControl("climbers", "Escaladores / puncheurs", 66)}
      ${renderRoleEffortControl("workers", "Gregarios / rodadores", 72)}
      ${renderRoleEffortControl("sprinters", "Sprinters / clasicómanos", 55)}
    </div>

    <div class="preset-row">
      <button class="secondary" onclick="setRoleOrder('workers','pull_group')">Gregarios tiran</button>
      <button class="secondary" onclick="setRoleOrder('workers','catch_breakaway')">Gregarios cazan fuga</button>
      <button class="secondary" onclick="setRoleOrder('climbers','climb_tempo')">Escaladores tempo</button>
      <button class="secondary" onclick="setRoleOrder('leaders','attack')">Líderes atacan</button>
      <button class="secondary" onclick="resetUserOrdersAndEfforts(); renderRaceScreen()">Reset esfuerzos</button>
    </div>
  `;
}

function renderRoleEffortControl(roleGroup, label, defaultValue) {
  return `
    <div class="role-effort-card">
      <strong>${escapeHtml(label)}</strong>
      <input type="range" min="20" max="100" value="${defaultValue}" oninput="setRoleEffort('${roleGroup}', this.value)">
      <span>${defaultValue}% sugerido</span>
    </div>
  `;
}

function renderIndividualRaceDirector(riders) {
  return `
    <h2>Órdenes y esfuerzo por corredor</h2>
    <div class="strategy-grid">
      ${riders.map(renderRaceDirectorRiderCard).join("")}
    </div>
  `;
}

function renderRaceDirectorRiderCard(rider) {
  const orderId = Game.riderOrders[rider.id] || rider.defaultOrder || "hold_position";
  const effort = Game.riderEfforts[rider.id] ?? rider.defaultEffort ?? 60;
  const tacticId = Game.riderTactics[rider.id] || "balanced";
  const setup = getRiderEquipment(rider.id);
  const materialScore = Math.round(calculateMaterialScore(setup, getCurrentStage(), getCurrentStage().sectors[0]));

  return `
    <div class="strategy-card ${Game.protectedRiderId === rider.id ? "protected" : ""}">
      <div class="badge-row">
        <span class="badge green">${escapeHtml(rider.role)}</span>
        <span class="badge blue">Forma ${Math.round(rider.form)}</span>
        <span class="badge orange">Fatiga ${Math.round(rider.fatigue)}</span>
        <span class="badge">Mat ${materialScore}%</span>
        ${Game.protectedRiderId === rider.id ? `<span class="badge jersey-yellow">Protegido</span>` : ""}
      </div>

      <h3>${escapeHtml(rider.name)}</h3>

      <label class="field-label">Orden</label>
      <select onchange="setRiderOrder('${rider.id}', this.value)">
        ${RIDER_ORDERS.map(order => `<option value="${order.id}" ${orderId === order.id ? "selected" : ""}>${order.name}</option>`).join("")}
      </select>

      <label class="field-label">Esfuerzo: <strong>${effort}%</strong></label>
      <input class="effort-slider" type="range" min="20" max="100" value="${effort}" oninput="setRiderEffort('${rider.id}', this.value)">

      <label class="field-label">Táctica base</label>
      <select onchange="setRiderTactic('${rider.id}', this.value)">
        ${TACTICS.map(item => `<option value="${item.id}" ${tacticId === item.id ? "selected" : ""}>${item.name}</option>`).join("")}
      </select>

      <p class="muted small">${escapeHtml(getOrder(orderId).description)}</p>
    </div>
  `;
}

/* ============================================================
   MATERIAL RENDER
   ============================================================ */

function renderMaterialImage(item, type) {
  return `
    <div class="material-image-card ${type}">
      <img src="${item.image || ""}" alt="${escapeHtml(item.name)}" onerror="this.style.display='none'; this.parentElement.classList.add('material-fallback');">
      <div class="material-fallback-art">${type === "frame" ? "🚲" : "🛞"}</div>
      <span>${escapeHtml(item.name)}</span>
    </div>
  `;
}

function renderMaterialBars(item, keys) {
  const labels = { aero: "Aero", weight: "Peso", stiffness: "Rigidez", comfort: "Confort", handling: "Manejo", cobbles: "Pavés", tt: "CRI", reliability: "Fiabilidad", crosswind: "Viento lateral" };

  return `
    <div class="material-rating-bars">
      ${keys.map(key => `
        <div class="material-rating-row">
          <span>${labels[key] || key}</span>
          <div class="material-rating-track"><div class="material-rating-fill" style="width:${item[key]}%"></div></div>
          <strong>${item[key]}%</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEquipmentCard(rider) {
  const setup = getRiderEquipment(rider.id);
  const materialScore = Math.round(calculateMaterialScore(setup, getCurrentStage(), getCurrentStage().sectors[0]));

  return `
    <div class="strategy-card">
      <div class="badge-row">
        <span class="badge green">${escapeHtml(rider.role)}</span>
        <span class="badge blue">Material ${materialScore}%</span>
      </div>

      <h3>${escapeHtml(rider.name)}</h3>

      <div class="material-duo">
        ${renderMaterialImage(getFrameBrand(setup.frameBrand), "frame")}
        ${renderMaterialImage(getWheelBrand(setup.wheelBrand), "wheel")}
      </div>

      <label class="field-label">Marca cuadro</label>
      <select onchange="setRiderEquipmentField('${rider.id}', 'frameBrand', this.value)">
        ${FRAME_BRANDS.map(item => `<option value="${item.id}" ${setup.frameBrand === item.id ? "selected" : ""}>${item.name}</option>`).join("")}
      </select>

      <label class="field-label">Tipo cuadro</label>
      <select onchange="setRiderEquipmentField('${rider.id}', 'bikeType', this.value)">
        ${BIKE_SETUPS.map(item => `<option value="${item.id}" ${setup.bikeType === item.id ? "selected" : ""}>${item.name}</option>`).join("")}
      </select>

      <label class="field-label">Marca ruedas</label>
      <select onchange="setRiderEquipmentField('${rider.id}', 'wheelBrand', this.value)">
        ${WHEEL_BRANDS.map(item => `<option value="${item.id}" ${setup.wheelBrand === item.id ? "selected" : ""}>${item.name}</option>`).join("")}
      </select>

      <label class="field-label">Tipo ruedas</label>
      <select onchange="setRiderEquipmentField('${rider.id}', 'wheelType', this.value)">
        ${WHEEL_SETUPS.map(item => `<option value="${item.id}" ${setup.wheelType === item.id ? "selected" : ""}>${item.name}</option>`).join("")}
      </select>
    </div>
  `;
}

/* ============================================================
   RENDER EQUIPO / STATS
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
        <button class="secondary" onclick="applySmartPreset('${preset.id}')">${escapeHtml(preset.name)}</button>
      `).join("")}
    </div>
  `;
}

function renderRiderCard(rider) {
  const stats = [["flat", "Llano"], ["sprint", "Sprint"], ["timeTrial", "CRI"], ["teamTimeTrial", "CRE"], ["mountain", "Montaña"], ["cobbles", "Pavés"], ["hills", "Muros"], ["stamina", "Stamina"], ["recovery", "Recovery"], ["positioning", "Colocación"]];

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
          <div class="stat-bar"><div class="stat-fill" style="width:${clamp(rider.stats[key], 0, 100)}%"></div></div>
          <span>${rider.stats[key]}</span>
        </div>
      `).join("")}
    </div>
  `;
}

/* ============================================================
   LIVE STAGE
   ============================================================ */

function startLiveStage(render = true) {
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
    eventIcons: [],
    groups: [],
    orders: { teamPull: false, waitLeader: false, markRival: false }
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
      groupLabel: isTeamTimeTrialStage(stage) ? `CRE ${getTeam(rider.teamId).name}` : "Pelotón principal",
      groupId: isTeamTimeTrialStage(stage) ? `ttt_${rider.teamId}` : "peloton",
      domestiqueBurned: false,
      usedCaffeine: false,
      nutritionUsed: []
    };
  });

  Game.liveStage.breakawayIds = generateLiveBreakaway(stage);
  Game.liveStage.breakawayGap = Game.liveStage.breakawayIds.length ? Math.round(randomBetween(80, 190)) : 0;

  Game.liveStage.breakawayIds.forEach(id => {
    const state = Game.liveStage.riderState[id];
    if (state) {
      state.groupLabel = "Fuga";
      state.groupId = "breakaway";
    }
  });

  recomputeLiveGroupLabels();

  if (isTeamTimeTrialStage(stage)) {
    addRadio("Salida de CRE. Cada equipo rueda en bloque. El tiempo lo marca el 4º corredor.");
  } else {
    addRadio(`Salida lanzada. ${Game.liveStage.breakawayIds.length ? `Se forma una fuga de ${Game.liveStage.breakawayIds.length} corredores.` : "No se consolida fuga inicial."}`);
  }

  addRadio(getStageRadioHint(stage));
  saveGame();

  if (render) renderLiveStageScreen();
}

function generateLiveBreakaway(stage) {
  if (["time_trial", "team_time_trial"].includes(stage.type)) return [];

  const candidates = getAllActiveRiders().map(rider => {
    const order = getRiderOrder(rider);
    const effort = getRiderEffort(rider);
    const tactic = rider.teamId === Game.selectedTeamId ? getUserTacticForRider(rider) : chooseAITactic(rider, stage);
    const leader = getGCLeader();
    const gcGap = leader ? rider.totalTime - leader.totalTime : 0;
    const teamAI = getTeam(rider.teamId).aiProfile || {};

    const score =
      (gcGap > 8 * 60 ? 8 : 0) +
      (["puncheur", "classics", "climber", "rouleur"].includes(rider.roleKey) ? 7 : 0) +
      (order.attackIntent ? 18 : 0) +
      (effort > 82 ? 8 : 0) +
      (tactic.id === "aggressive" ? 8 : tactic.id === "all_in" ? 14 : 0) +
      ((teamAI.breakawayFocus || 50) / 12) +
      (stage.type === "hilly" ? 8 : stage.type === "mountain" ? 6 : stage.type === "cobbles_hills" ? 9 : -2) +
      randomBetween(0, 8) -
      rider.fatigue * 0.12;

    return { rider, score };
  }).sort((a, b) => b.score - a.score);

  return candidates.slice(0, clamp(Math.round(randomBetween(3, 8)), 3, 8)).filter(item => item.score > 12).map(item => item.rider.id);
}

function getStageRadioHint(stage) {
  if (stage.type === "team_time_trial") return "Radio: en CRE no hay ataques internos. Mantén mínimo 4 corredores juntos.";
  if (stage.type === "mountain") return "Radio: guarda geles para los últimos puertos. El slider de esfuerzo debe subir solo en sectores clave.";
  if (stage.type === "flat" && stage.profile.windExposure > 60) return "Radio: viento peligroso. Colocación y protección del líder serán críticas.";
  if (stage.type === "cobbles_hills") return "Radio: pavé peligroso. Endurance + ruedas pavés reducen riesgo.";
  if (stage.type === "time_trial") return "Radio: crono pura. Material TT y esfuerzo estable.";
  return "Radio: vigila fuga, grupos, rivales y energía.";
}

function addRadio(message) {
  if (!Game.liveStage) return;
  Game.liveStage.radio.unshift({ message, time: new Date().toLocaleTimeString() });
  Game.liveStage.radio = Game.liveStage.radio.slice(0, 10);
}

function addEventIcon(type, km, label) {
  if (!Game.liveStage) return;
  Game.liveStage.eventIcons.push({ type, km, label });
  Game.liveStage.eventIcons = Game.liveStage.eventIcons.slice(-24);
}

function renderLiveStageScreen() {
  const stage = getCurrentStage();
  const sector = stage.sectors[Game.liveStage.currentSectorIndex];
  const progress = Math.round((sector.kmStart / stage.distance) * 100);

  recomputeLiveGroupLabels();
  const groups = buildLiveGroups(stage, sector);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Race Director · ${escapeHtml(stage.name)}</h1>
        <p>Sector ${Game.liveStage.currentSectorIndex + 1}/${stage.sectors.length} · km ${sector.kmStart}-${sector.kmEnd} · ${escapeHtml(sector.name)}</p>
      </div>
      <div class="top-actions">
        <button class="secondary" onclick="saveGame(true)">Guardar</button>
        <button class="danger" onclick="cancelLiveStage()">Cancelar etapa</button>
      </div>
    </div>

    <section class="live-progress">
      <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
      <div class="sector-timeline live">
        ${stage.sectors.map((s, i) => `
          <div class="sector-chip ${i === Game.liveStage.currentSectorIndex ? "active" : ""} ${i < Game.liveStage.currentSectorIndex ? "done" : ""}">
            <strong>${i + 1}</strong>
            <span>${escapeHtml(s.name)}</span>
            <small>km ${s.kmStart}-${s.kmEnd}</small>
            <em>${escapeHtml(s.tacticalQuestion)}</em>
          </div>
        `).join("")}
      </div>
    </section>

    <section class="panel" style="margin-top:16px;">
      <h2>${isTeamTimeTrialStage(stage) ? "Mapa vivo de CRE" : "Mapa vivo de carrera"}</h2>
      ${renderDetailedStageProfile(stage, groups, Game.liveStage.eventIcons)}
      ${renderTerrainLegend()}
      ${renderLiveRaceMap(stage, sector, groups)}
    </section>

    <div class="grid two" style="margin-top:16px;">
      <section class="panel">
        <h2>Decisión del sector</h2>
        ${renderSectorDecisionPanel(sector)}
        ${renderTacticalAdvice(true)}
        ${renderLiveOrders()}
        ${renderLiveTeamControls()}
      </section>

      <section class="panel">
        <h2>Panel TV / Radio</h2>
        ${renderRadioMessages()}
        <hr>
        <h2>Alimentación</h2>
        <p class="muted small">Modo actual: <strong>${escapeHtml(getAutoNutritionMode().name)}</strong></p>
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

function renderSectorDecisionPanel(sector) {
  const stage = getCurrentStage();

  return `
    <div class="sector-decision-card">
      <div class="badge-row">
        <span class="badge green">Km ${sector.kmStart}-${sector.kmEnd}</span>
        <span class="badge blue">${escapeHtml(sector.type)}</span>
        <span class="badge orange">Dificultad ${sector.difficulty}</span>
        <span class="badge">Ataque ${sector.attackValue}</span>
        <span class="badge">Riesgo ${sector.risk}</span>
      </div>
      <h3>${escapeHtml(sector.tacticalQuestion)}</h3>
      <p class="help">
        ${sector.type === "flat" ? "Puedes ahorrar o poner rodadores a cazar fuga. Tirar del grupo no separa al corredor del pelotón." : ""}
        ${sector.type === "climb" ? "Puedes subir a tempo con gregarios o atacar con líder. El grupo se mantiene unido salvo ataques, crisis o cortes." : ""}
        ${sector.type === "cobbles" ? "Prioriza colocación y protección. Alto esfuerzo aumenta rendimiento, pero también riesgo." : ""}
        ${sector.type === "wall" ? "Sector explosivo. Buen momento para puncheurs y líderes con energía." : ""}
        ${sector.type === "final" ? "Último sector. Decide entre sprint, ataque o proteger general." : ""}
        ${stage.type === "team_time_trial" ? "CRE: el bloque rueda unido y el tiempo lo marca el 4º corredor." : ""}
      </p>
    </div>
  `;
}

function renderLiveRaceMap(stage, sector, groups) {
  return `
    <div class="live-map-layout">
      <div class="group-panel wide">
        ${groups.map(group => renderGroupCard(group)).join("")}
      </div>
    </div>
  `;
}

function renderGroupCard(group) {
  const visibleRiders = group.riders.slice(0, 10);
  const hidden = Math.max(0, group.riders.length - visibleRiders.length);

  return `
    <div class="group-card ${group.className}">
      <div class="group-card-header">
        <strong>${escapeHtml(group.label)}</strong>
        <span>${group.riders.length} corredores · ${escapeHtml(group.gapText)}</span>
      </div>

      <div class="badge-row">
        <span class="badge green">Tus corredores: ${group.userRiders.length}</span>
        <span class="badge red">Rivales: ${group.rivals.length}</span>
        <span class="badge blue">Km ${Math.round(group.km)}</span>
      </div>

      ${group.userRiders.length ? `
        <p class="group-subtitle">Tus corredores</p>
        <div class="group-rider-list">
          ${group.userRiders.map(r => `<span class="group-rider user">${escapeHtml(r.name)}</span>`).join("")}
        </div>
      ` : ""}

      ${group.rivals.length ? `
        <p class="group-subtitle">Rivales directos</p>
        <div class="group-rider-list">
          ${group.rivals.map(r => `<span class="group-rider rival">${escapeHtml(r.name)}</span>`).join("")}
        </div>
      ` : ""}

      <p class="group-subtitle">Grupo</p>
      <div class="group-rider-list">
        ${visibleRiders.map(rider => `
          <span class="group-rider ${rider.teamId === Game.selectedTeamId ? "user" : ""} ${group.rivals.some(r => r.id === rider.id) ? "rival" : ""}">
            ${escapeHtml(rider.name)}
          </span>
        `).join("")}
        ${hidden ? `<span class="group-rider">+${hidden} más</span>` : ""}
      </div>
    </div>
  `;
}

/* ============================================================
   LIVE CONTROLS
   ============================================================ */

function renderLiveOrders() {
  if (isTeamTimeTrialStage(getCurrentStage())) {
    return `<h2>Órdenes de coche</h2><p class="help">En CRE la prioridad es mantener el bloque unido. El tiempo lo marca el 4º corredor.</p>`;
  }

  return `
    <h2>Órdenes de coche</h2>
    <div class="preset-row">
      <button class="secondary ${Game.liveStage.orders.teamPull ? "active-soft" : ""}" onclick="toggleLiveOrder('teamPull')">Tirar del pelotón</button>
      <button class="secondary ${Game.liveStage.orders.waitLeader ? "active-soft" : ""}" onclick="toggleLiveOrder('waitLeader')">Esperar líder</button>
      <button class="secondary ${Game.liveStage.orders.markRival ? "active-soft" : ""}" onclick="toggleLiveOrder('markRival')">Marcar rival</button>
    </div>
  `;
}

function toggleLiveOrder(orderId) {
  if (isTeamTimeTrialStage(getCurrentStage())) {
    addRadio("En CRE no se permiten órdenes de pelotón/fuga. Mantén el bloque cohesionado.");
    renderLiveStageScreen();
    return;
  }

  Game.liveStage.orders[orderId] = !Game.liveStage.orders[orderId];

  if (orderId === "teamPull" && Game.liveStage.orders[orderId]) addRadio("Orden: el equipo tirará del pelotón en el próximo sector.");
  if (orderId === "waitLeader" && Game.liveStage.orders[orderId]) addRadio("Orden: gregarios preparados para esperar al líder.");
  if (orderId === "markRival" && Game.liveStage.orders[orderId]) addRadio("Orden: el líder marcará al rival directo.");

  renderLiveStageScreen();
}

function renderLiveTeamControls() {
  return `
    <h2>Control rápido en carrera</h2>
    <div class="quick-effort-grid">
      ${renderLiveRoleControl("leaders", "Líderes", 70)}
      ${renderLiveRoleControl("climbers", "Escaladores", 72)}
      ${renderLiveRoleControl("workers", "Gregarios", 76)}
      ${renderLiveRoleControl("sprinters", "Sprinters", 50)}
    </div>
    <div class="preset-row">
      <button class="secondary" onclick="setRoleOrderLive('workers','pull_group')">Gregarios tiran</button>
      <button class="secondary" onclick="setRoleOrderLive('workers','catch_breakaway')">Cazar fuga</button>
      <button class="secondary" onclick="setRoleOrderLive('climbers','climb_tempo')">Tempo subida</button>
      <button class="secondary" onclick="setRoleOrderLive('leaders','attack')">Líder ataca</button>
    </div>
  `;
}

function renderLiveRoleControl(roleGroup, label, defaultValue) {
  return `
    <div class="role-effort-card live">
      <strong>${escapeHtml(label)}</strong>
      <input type="range" min="20" max="100" value="${defaultValue}" oninput="setRoleEffortLive('${roleGroup}', this.value)">
      <span>${defaultValue}%</span>
    </div>
  `;
}

function setRoleEffortLive(roleGroup, effort) {
  const roles =
    roleGroup === "leaders" ? ["gc", "co_leader"] :
    roleGroup === "climbers" ? ["climber", "puncheur"] :
    roleGroup === "workers" ? ["domestique", "rouleur", "time_trialist"] :
    roleGroup === "sprinters" ? ["sprinter", "classics"] :
    [];

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    if (roles.includes(rider.roleKey)) Game.riderEfforts[rider.id] = Number(effort);
  });

  renderLiveStageScreen();
}

function setRoleOrderLive(roleGroup, orderId) {
  const roles =
    roleGroup === "leaders" ? ["gc", "co_leader"] :
    roleGroup === "climbers" ? ["climber", "puncheur"] :
    roleGroup === "workers" ? ["domestique", "rouleur", "time_trialist"] :
    roleGroup === "sprinters" ? ["sprinter", "classics"] :
    [];

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    if (roles.includes(rider.roleKey)) Game.riderOrders[rider.id] = orderId;
  });

  addRadio(`${roleGroup}: orden cambiada a ${getOrder(orderId).name}.`);
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

function renderNutritionStock(stock) {
  return `
    <div class="badge-row">
      ${Object.entries(stock).map(([id, amount]) => `<span class="badge">${escapeHtml(getNutritionItem(id)?.name || id)} x${amount}</span>`).join("")}
    </div>
  `;
}

function renderLiveRiderCard(rider) {
  const live = Game.liveStage.riderState[rider.id];
  const orderId = Game.riderOrders[rider.id] || rider.defaultOrder || "hold_position";
  const effort = Game.riderEfforts[rider.id] ?? rider.defaultEffort ?? 60;
  const setup = getRiderEquipment(rider.id);
  const materialScore = Math.round(calculateMaterialScore(setup, getCurrentStage(), getCurrentStage().sectors[Game.liveStage.currentSectorIndex]));

  return `
    <div class="live-rider-card ${Game.protectedRiderId === rider.id ? "protected" : ""}">
      <div class="badge-row">
        <span class="badge green">${escapeHtml(rider.role)}</span>
        <span class="badge">E ${Math.round(live.energy)}</span>
        <span class="badge blue">H ${Math.round(live.hydration)}</span>
        <span class="badge orange">Est ${Math.round(live.stomachLoad)}</span>
        <span class="badge">Mat ${materialScore}%</span>
        <span class="badge">${escapeHtml(live.groupLabel || "Pelotón")}</span>
        ${live.domestiqueBurned ? `<span class="badge red">Quemado</span>` : ""}
        ${live.crisis ? `<span class="badge red">Crisis</span>` : ""}
      </div>

      <h3>${escapeHtml(rider.name)}</h3>
      <p class="muted small">${escapeHtml(getFrameBrand(setup.frameBrand).name)} + ${escapeHtml(getWheelBrand(setup.wheelBrand).name)} · ${secondsToTime(live.stageTime)}</p>

      <label class="field-label">Orden</label>
      <select onchange="setRiderOrderLive('${rider.id}', this.value)">
        ${RIDER_ORDERS.map(order => `<option value="${order.id}" ${orderId === order.id ? "selected" : ""}>${order.name}</option>`).join("")}
      </select>

      <label class="field-label">Esfuerzo: <strong>${effort}%</strong></label>
      <input class="effort-slider" type="range" min="20" max="100" value="${effort}" oninput="setRiderEffortLive('${rider.id}', this.value)">

      <div class="nutrition-actions">
        ${NUTRITION_ITEMS.map(item => `<button class="mini-button" onclick="useNutrition('${rider.id}', '${item.id}')">${escapeHtml(item.name)}</button>`).join("")}
      </div>
    </div>
  `;
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
  if (item.id === "caffeine_gel") live.usedCaffeine = true;
  live.nutritionUsed.push(item.id);

  const rider = getRider(riderId);
  rider.morale = clamp(rider.morale + (item.morale || 0), 30, 100);

  addRadio(`${rider.name} toma ${item.name}. Energía +${Math.round(item.energy * effectiveness)}.`);
  addEventIcon("food", sector.kmStart, `${rider.name} toma ${item.name}`);
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
   SIMULACIÓN RÁPIDA Y POR SECTORES
   ============================================================ */

function simulateFullStageQuick() {
  startLiveStage(false);

  addRadio("Modo rápido: la etapa se simula completa con estrategia de salida, órdenes y esfuerzos actuales.");

  while (Game.liveStage && Game.liveStage.currentSectorIndex < getCurrentStage().sectors.length) {
    processCurrentSector(false);
  }

  renderStageResultScreen();
}

function simulateCurrentSector() {
  processCurrentSector(true);
}

function processCurrentSector(renderAfter = true) {
  const stage = getCurrentStage();
  const sector = stage.sectors[Game.liveStage.currentSectorIndex];

  applyAutoNutritionForSector(sector);

  const sectorLog = {
    sectorIndex: Game.liveStage.currentSectorIndex,
    sectorName: sector.name,
    events: []
  };

  getAllActiveRiders().forEach(rider => simulateRiderSector(rider, stage, sector, sectorLog));

  if (isTeamTimeTrialStage(stage)) {
    applyTeamTimeTrialCohesionToLive(stage, sector, sectorLog);
  } else {
    applyGroupCohesionToLive(stage, sector, sectorLog);
    updateBreakawayAfterSector(stage, sector, sectorLog);
    updatePelotonState(sectorLog);
    applySectorOrders(sector, sectorLog);
  }

  recomputeLiveGroupLabels();
  Game.liveStage.sectorLogs.push(sectorLog);
  Game.liveStage.currentSectorIndex += 1;
  sectorLog.events.slice(0, 5).forEach(event => addRadio(event));

  if (Game.liveStage.currentSectorIndex >= stage.sectors.length) {
    finishLiveStage(renderAfter);
    return;
  }

  addRadio(getSectorTransitionHint(stage.sectors[Game.liveStage.currentSectorIndex]));
  saveGame();

  if (renderAfter) renderLiveStageScreen();
}

function applyAutoNutritionForSector(sector) {
  if (Game.autoNutritionMode === "manual") return;

  getTeamRiders(Game.selectedTeamId).forEach(rider => {
    const live = Game.liveStage.riderState[rider.id];
    if (!live || rider.abandoned) return;

    const itemId = chooseAutoNutritionItem(rider, live, sector);
    if (!itemId || (Game.teamNutritionStock[itemId] || 0) <= 0) return;

    const item = getNutritionItem(itemId);
    const effectiveness = getNutritionEffectiveness(item, sector, live);
    Game.teamNutritionStock[itemId] -= 1;

    live.energy = clamp(live.energy + item.energy * effectiveness, 0, 115);
    live.hydration = clamp(live.hydration + item.hydration, 0, 120);
    live.stomachLoad = clamp(live.stomachLoad + item.stomachLoad * (sector.difficulty > 85 ? 1.15 : 1), 0, 100);
    live.finalBonus += sector.type === "final" ? item.finalBonus || 0 : 0;

    if (item.id === "caffeine_gel") live.usedCaffeine = true;
    live.nutritionUsed.push(item.id);

    if (rider.id === Game.protectedRiderId || live.energy < 35 || live.hydration < 35 || sector.type === "final") {
      addRadio(`${rider.name} toma ${item.name} automáticamente.`);
      addEventIcon("food", sector.kmStart, `${rider.name} toma ${item.name}`);
    }
  });
}

function chooseAutoNutritionItem(rider, live, sector) {
  const mode = Game.autoNutritionMode;

  if (live.stomachLoad > 88) {
    if (live.hydration < 55 && hasNutritionStock("water")) return "water";
    return null;
  }

  if (live.hydration < 32) {
    if (hasNutritionStock("isotonic")) return "isotonic";
    if (hasNutritionStock("water")) return "water";
  }

  if (live.hydration < 48 && sector.difficulty >= 70) {
    if (hasNutritionStock("isotonic")) return "isotonic";
    if (hasNutritionStock("water")) return "water";
  }

  if (sector.type === "final") {
    if (!live.usedCaffeine && live.energy < 82 && hasNutritionStock("caffeine_gel")) return "caffeine_gel";
    if (live.energy < 68 && hasNutritionStock("gel")) return "gel";
    return null;
  }

  if (sector.type === "climb" || sector.type === "wall") {
    if (live.energy < 72 && hasNutritionStock("gel")) return "gel";
    if (live.energy < 52 && hasNutritionStock("caffeine_gel") && mode === "auto_conservative") return "caffeine_gel";
    if (live.hydration < 62 && hasNutritionStock("isotonic")) return "isotonic";
    return null;
  }

  if (sector.type === "hilly" || sector.type === "cobbles") {
    if (live.energy < 64 && hasNutritionStock("gel")) return "gel";
    if (live.hydration < 60 && hasNutritionStock("isotonic")) return "isotonic";
    return null;
  }

  if (sector.type === "flat" || sector.type === "valley") {
    if (mode === "auto_aggressive") {
      if (live.energy < 58 && hasNutritionStock("rice_cake")) return "rice_cake";
      if (live.hydration < 58 && hasNutritionStock("isotonic")) return "isotonic";
      return null;
    }

    if (live.energy < 78 && live.stomachLoad < 58 && hasNutritionStock("bar")) return "bar";
    if (live.energy < 68 && hasNutritionStock("rice_cake")) return "rice_cake";
    if (live.hydration < 68 && hasNutritionStock("isotonic")) return "isotonic";
  }

  if (mode === "auto_conservative") {
    if (live.energy < 62 && hasNutritionStock("gel")) return "gel";
    if (live.hydration < 68 && hasNutritionStock("isotonic")) return "isotonic";
  }

  return null;
}

function hasNutritionStock(itemId) {
  return (Game.teamNutritionStock[itemId] || 0) > 0;
}

function simulateRiderSector(rider, stage, sector, sectorLog) {
  const live = Game.liveStage.riderState[rider.id];
  if (!live || rider.abandoned) return;

  const tactic = rider.teamId === Game.selectedTeamId ? getUserTacticForRider(rider) : chooseAITactic(rider, stage);
  const order = rider.teamId === Game.selectedTeamId ? getRiderOrder(rider) : chooseAIOrder(rider, stage, sector);
  const effort = rider.teamId === Game.selectedTeamId ? getRiderEffort(rider) : chooseAIEffort(rider, stage, sector);
  const setup = getRiderEquipment(rider.id);

  const effortBonus = (effort - 60) * 0.10;
  const effortRisk = effort > 85 ? (effort - 85) * 0.01 : 0;

  const terrainScore =
    calculateSectorTerrainScore(rider, stage, sector) +
    tactic.bonus +
    calculateMaterialScore(setup, stage, sector) * 0.11 -
    9 +
    calculateNutritionBonus(live, sector) +
    effortBonus +
    (rider.teamId === Game.selectedTeamId ? getDifficulty().userBonus : getDifficulty().aiBonus) +
    (rider.morale - 75) * 0.04 -
    rider.fatigue * getSectorFatigueFactor(sector) -
    (live.energy < 35 ? (35 - live.energy) * 0.10 : 0) -
    (live.hydration < 45 ? (45 - live.hydration) * 0.08 : 0) -
    (live.stomachLoad > 70 ? (live.stomachLoad - 70) * 0.08 : 0) +
    randomBetween(-3, 3);

  const baseSectorTime = getBaseSectorTime(stage, sector);
  let sectorTime = convertSectorPerformanceToTime(terrainScore, baseSectorTime, sector);

  const incident = calculateLiveIncident(rider, stage, sector, tactic, order, effortRisk, setup);
  if (incident) {
    sectorTime += incident.timeLoss;
    live.incident = incident;
    live.energy = clamp(live.energy - incident.energyLoss, 0, 100);
    live.fatigueGain += incident.fatigue;
    live.groupId = `incident_${rider.id}`;
    live.groupLabel = incident.type;
    sectorLog.events.push(`${rider.name}: ${incident.type} (+${Math.round(incident.timeLoss)}s).`);
    addEventIcon(incident.type === "Caída leve" || incident.type === "Abandono" ? "crash" : "mechanical", sector.kmStart, `${rider.name}: ${incident.type}`);
    if (incident.abandon) rider.abandoned = true;
  }

  const crisis = calculateLiveCrisis(rider, stage, sector, live, tactic, effort);
  if (crisis) {
    sectorTime += crisis.timeLoss;
    live.crisis = true;
    live.fatigueGain += crisis.fatigue;
    live.dropped = true;
    live.groupId = "dropped";
    live.groupLabel = "Cortados";
    sectorLog.events.push(`${rider.name} entra en crisis y pierde ${secondsToTime(crisis.timeLoss)}.`);
    addEventIcon("alert", sector.kmStart, `${rider.name}: crisis`);
  }

  if (!live.incident && !live.crisis && order.attackIntent && effort >= 78 && Math.random() < getAttackChance(rider, stage, sector, order, effort)) {
    const gain = randomBetween(18, 70) * (effort / 100);
    sectorTime -= gain;
    live.groupId = `attack_${rider.id}`;
    live.groupLabel = "Ataque";
    live.energy = clamp(live.energy - 10 - effort * 0.08, 0, 100);
    sectorLog.events.push(`${rider.name} ataca y abre hueco.`);
    addEventIcon("attack", sector.kmStart, `${rider.name} ataca`);
  }

  live.sectorTime = sectorTime;
  live.stageTime += sectorTime;
  live.energy = clamp(live.energy - calculateSectorEnergyCost(rider, sector, tactic, order, effort), 0, 115);
  live.hydration = clamp(live.hydration - calculateSectorHydrationCost(stage, sector, effort), 0, 120);
  live.stomachLoad = clamp(live.stomachLoad - 4, 0, 100);
  live.fatigueGain += calculateSectorFatigueGain(rider, stage, sector, tactic, effort, terrainScore);

  if (live.energy < 16 && !live.dropped) {
    live.dropped = true;
    live.groupId = isTeamTimeTrialStage(stage) ? `ttt_dropped_${rider.teamId}` : "dropped";
    live.groupLabel = isTeamTimeTrialStage(stage) ? `Descolgado ${getTeam(rider.teamId).name}` : "Cortados";
    Game.liveStage.droppedCount += 1;
  }
}

function calculateSectorTerrainScore(rider, stage, sector) {
  const s = rider.stats;

  if (sector.type === "flat") return s.flat * 0.42 + s.sprint * 0.16 + s.stamina * 0.14 + s.positioning * 0.13 + rider.form * 0.10 + s.recovery * 0.05;
  if (sector.type === "hilly") return s.hills * 0.36 + s.acceleration * 0.18 + s.stamina * 0.15 + s.mountain * 0.10 + s.positioning * 0.08 + rider.form * 0.08 + s.recovery * 0.05;
  if (sector.type === "climb") return s.mountain * 0.50 + s.stamina * 0.18 + s.recovery * 0.10 + s.acceleration * 0.08 + rider.form * 0.10 + s.downhill * 0.04;
  if (sector.type === "wall") return s.hills * 0.40 + s.acceleration * 0.24 + s.mountain * 0.14 + s.stamina * 0.10 + rider.form * 0.12;
  if (sector.type === "cobbles") return s.cobbles * 0.36 + s.positioning * 0.18 + s.stamina * 0.14 + s.hills * 0.12 + s.acceleration * 0.10 + rider.form * 0.10;
  if (sector.type === "tt") return (stage.type === "team_time_trial" ? s.teamTimeTrial * 0.40 + s.timeTrial * 0.22 : s.timeTrial * 0.58) + s.flat * 0.14 + s.stamina * 0.12 + s.consistency * 0.08 + rider.form * 0.08;

  if (sector.type === "final") {
    if (stage.type === "flat") return s.sprint * 0.40 + s.flat * 0.20 + s.acceleration * 0.18 + s.positioning * 0.12 + rider.form * 0.10;
    if (stage.type === "mountain") return s.mountain * 0.48 + s.acceleration * 0.17 + s.stamina * 0.15 + rider.form * 0.12 + s.recovery * 0.08;
    return s.hills * 0.35 + s.acceleration * 0.22 + s.stamina * 0.14 + s.positioning * 0.12 + rider.form * 0.10 + s.cobbles * 0.07;
  }

  return s.stamina * 0.30 + s.flat * 0.25 + rider.form * 0.20 + s.recovery * 0.15 + s.positioning * 0.10;
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

function getBaseSectorTime(stage, sector) {
  const distance = sector.kmEnd - sector.kmStart;
  const speed =
    sector.type === "flat" ? 44 :
    sector.type === "valley" ? 42 :
    sector.type === "hilly" ? 38 :
    sector.type === "climb" ? 28 :
    sector.type === "wall" ? 30 :
    sector.type === "cobbles" ? 35 :
    sector.type === "tt" ? (stage.type === "team_time_trial" ? 52 : 50) :
    sector.type === "final" ? (stage.type === "mountain" ? 27 : stage.type === "flat" ? 46 : 36) :
    40;

  return (distance / speed) * 3600;
}

function convertSectorPerformanceToTime(performance, baseTime, sector) {
  const separation =
    sector.type === "flat" ? 1.6 :
    sector.type === "hilly" ? 3.2 :
    sector.type === "climb" ? 5.2 :
    sector.type === "wall" ? 5.8 :
    sector.type === "cobbles" ? 4.4 :
    sector.type === "tt" ? 4.0 :
    sector.type === "final" ? 5.8 :
    2.5;

  return baseTime + (82 - clamp(performance, 35, 115)) * separation + sector.difficulty * 0.08 + randomBetween(-4, 4);
}

function getSectorFatigueFactor(sector) {
  return sector.type === "flat" ? 0.04 : sector.type === "hilly" ? 0.08 : sector.type === "climb" ? 0.12 : sector.type === "wall" ? 0.13 : sector.type === "cobbles" ? 0.11 : sector.type === "tt" ? 0.09 : sector.type === "final" ? 0.13 : 0.06;
}

function calculateSectorEnergyCost(rider, sector, tactic, order, effort) {
  const base = sector.energyCost * tactic.sectorEnergy * order.energyMultiplier * (0.55 + effort / 100);
  const staminaReduction = rider.stats.stamina * 0.055;
  return clamp(base - staminaReduction, 4, 68);
}

function calculateSectorHydrationCost(stage, sector, effort) {
  return clamp(8 + stage.profile.heat * 0.08 + sector.difficulty * 0.03 + Math.max(0, effort - 70) * 0.04, 6, 26);
}

function calculateSectorFatigueGain(rider, stage, sector, tactic, effort, performance) {
  return clamp(
    sector.energyCost * 0.18 * tactic.fatigueMultiplier +
    stage.profile.heat * 0.015 +
    (stage.profile.roadSurface === "pavé" ? 1.2 : 0) -
    rider.stats.recovery * 0.025 +
    (performance > 88 ? 1.2 : 0) +
    Math.max(0, effort - 75) * 0.055,
    0.4,
    13
  );
}

function calculateLiveIncident(rider, stage, sector, tactic, order, effortRisk, setup) {
  const diff = getDifficulty();
  const frame = getFrameBrand(setup.frameBrand);
  const wheel = getWheelBrand(setup.wheelBrand);
  const bike = getBikeSetup(setup.bikeType);
  const wheels = getWheelSetup(setup.wheelType);

  const surfaceRisk = stage.profile.roadSurface === "pavé" || sector.type === "cobbles" ? 0.070 : 0.012;
  const rainRisk = stage.profile.rainRisk / 1000;
  const descentRisk = stage.profile.technicalDescent / 1800;
  const tacticRisk = tactic.risk * 0.04;
  const sectorRisk = sector.risk / 1400;
  const materialReliability = average([frame.reliability, wheel.reliability]) / 100;
  const materialHandling = average([frame.handling, wheel.crosswind]) / 100;
  const protection = (rider.stats.positioning + rider.stats.downhill + rider.stats.injuryResistance) / 6500;

  const risk = clamp(
    (surfaceRisk + rainRisk + descentRisk + tacticRisk + sectorRisk + effortRisk - protection) *
      diff.incidentMultiplier *
      bike.punctureRisk *
      wheels.punctureRisk *
      (1.12 - materialReliability * 0.12) *
      (1.08 - materialHandling * 0.08),
    0.004,
    0.24
  );

  if (Math.random() > risk) return null;

  const roll = Math.random();

  if (roll < 0.48) return { type: "Pinchazo", timeLoss: randomBetween(20, 95), fatigue: 1.5, energyLoss: 4 };
  if (roll < 0.78) return { type: "Avería", timeLoss: randomBetween(35, 155), fatigue: 2, energyLoss: 5 };
  if (roll < 0.96) return { type: "Caída leve", timeLoss: randomBetween(45, 190), fatigue: 5, energyLoss: 12 };
  return { type: "Abandono", timeLoss: 1800, fatigue: 20, energyLoss: 100, abandon: true };
}

function calculateLiveCrisis(rider, stage, sector, live, tactic, effort) {
  const diff = getDifficulty();

  const risk = clamp(
    (
      (28 - live.energy) / 75 +
      (42 - live.hydration) / 120 +
      live.stomachLoad / 260 +
      rider.fatigue / 250 +
      stage.profile.heat / 520 +
      (tactic.id === "all_in" ? 0.10 : 0) +
      Math.max(0, effort - 88) * 0.015
    ) * diff.crisisMultiplier,
    0,
    0.55
  );

  if (live.energy > 28 && live.hydration > 35) return null;
  if (Math.random() > risk) return null;

  const severe = live.energy < 8 || live.hydration < 18;
  return { type: severe ? "Pájara severa" : "Crisis", timeLoss: severe ? randomBetween(300, 900) : randomBetween(60, 240), fatigue: severe ? 8 : 3 };
}

function getAttackChance(rider, stage, sector, order, effort) {
  const terrainFit =
    sector.type === "climb" ? rider.stats.mountain :
    sector.type === "wall" || sector.type === "hilly" ? rider.stats.hills :
    sector.type === "cobbles" ? rider.stats.cobbles :
    rider.stats.acceleration;

  return clamp((terrainFit - 70) / 100 + (effort - 76) / 160 + sector.attackValue / 300, 0.05, 0.60);
}

function applyGroupCohesionToLive(stage, sector, sectorLog) {
  const states = getAllActiveRiders().map(rider => ({ rider, state: Game.liveStage.riderState[rider.id] })).filter(item => item.state);
  const groups = {};

  states.forEach(item => {
    const id = item.state.groupId || "peloton";
    if (!groups[id]) groups[id] = [];
    groups[id].push(item);
  });

  Object.entries(groups).forEach(([groupId, items]) => {
    if (groupId.startsWith("attack_") || groupId.startsWith("incident_") || groupId === "dropped") return;

    const normal = items.filter(item => !item.state.incident && !item.state.crisis && !item.state.dropped);
    if (!normal.length) return;

    const baseTime = median(normal.map(item => item.state.stageTime));
    const pullers = normal.filter(item => {
      const order = item.rider.teamId === Game.selectedTeamId ? getRiderOrder(item.rider) : chooseAIOrder(item.rider, stage, sector);
      return order.groupPull > 0.75;
    });

    const pullPower = pullers.reduce((sum, item) => {
      const effort = item.rider.teamId === Game.selectedTeamId ? getRiderEffort(item.rider) : chooseAIEffort(item.rider, stage, sector);
      const order = item.rider.teamId === Game.selectedTeamId ? getRiderOrder(item.rider) : chooseAIOrder(item.rider, stage, sector);
      return sum + (effort - 55) * 0.14 * order.groupPull + item.rider.stats.stamina * 0.012;
    }, 0);

    const groupBonus = clamp(pullPower, 0, 55);
    const groupTime = Math.max(0, baseTime - groupBonus);

    normal.forEach(item => {
      const order = item.rider.teamId === Game.selectedTeamId ? getRiderOrder(item.rider) : chooseAIOrder(item.rider, stage, sector);
      const effort = item.rider.teamId === Game.selectedTeamId ? getRiderEffort(item.rider) : chooseAIEffort(item.rider, stage, sector);
      const live = item.state;

      if (order.groupPull > 0.75) {
        live.energy = clamp(live.energy - 3 - effort * 0.035, 0, 115);
        live.domestiqueBurned = effort > 84 && item.rider.roleKey !== "gc";
      }

      live.stageTime = groupTime + randomBetween(0, 2.5);
    });

    if (pullers.length && groupId === "peloton") {
      sectorLog.events.push(`${pullers.map(item => item.rider.name).slice(0, 3).join(", ")} tiran del pelotón sin perder contacto.`);
    }

    if (sector.type === "climb" || sector.type === "wall") {
      normal.forEach(item => {
        const live = item.state;
        const rider = item.rider;
        const effort = rider.teamId === Game.selectedTeamId ? getRiderEffort(rider) : chooseAIEffort(rider, stage, sector);
        const weakness = 72 - rider.stats.mountain + rider.fatigue * 0.12 + (35 - live.energy) * 0.12;

        if (weakness > randomBetween(10, 35) && effort < 58 && !["gc", "co_leader", "climber"].includes(rider.roleKey)) {
          live.dropped = true;
          live.groupId = "dropped";
          live.groupLabel = "Cortados";
          live.stageTime += randomBetween(35, 180);
        }
      });
    }
  });
}

function applyTeamTimeTrialCohesionToLive(stage, sector, sectorLog) {
  TEAMS.forEach(team => {
    const teamItems = getTeamRiders(team.id).map(rider => ({ rider, state: Game.liveStage.riderState[rider.id] })).filter(item => item.state).sort((a, b) => a.state.stageTime - b.state.stageTime);
    if (!teamItems.length) return;

    const markerIndex = Math.min(3, teamItems.length - 1);
    const markerTime = teamItems[markerIndex].state.stageTime;
    const train = [];
    const dropped = [];

    teamItems.forEach((item, index) => {
      const state = item.state;
      const hasSeriousProblem = state.incident || state.crisis || state.energy < 10 || state.hydration < 12;
      const gapToFourth = state.stageTime - markerTime;

      if (index <= markerIndex) train.push(item);
      else if (!hasSeriousProblem && gapToFourth <= 40) train.push(item);
      else dropped.push(item);
    });

    train.forEach(item => {
      item.state.stageTime = markerTime + randomBetween(0, 3);
      item.state.groupId = `ttt_${team.id}`;
      item.state.groupLabel = `CRE ${team.name}`;
      item.state.dropped = false;
    });

    dropped.forEach(item => {
      item.state.groupId = `ttt_dropped_${team.id}`;
      item.state.groupLabel = `Descolgado ${team.name}`;
      item.state.dropped = true;
      item.state.stageTime = Math.max(item.state.stageTime, markerTime + randomBetween(25, 120));
    });

    if (dropped.length) {
      sectorLog.events.push(`${team.name}: ${dropped.map(item => item.rider.name).join(", ")} se descuelga${dropped.length > 1 ? "n" : ""} en la CRE.`);
    }
  });

  Game.liveStage.breakawayIds = [];
  Game.liveStage.breakawayGap = 0;
  Game.liveStage.pelotonSize = getAllActiveRiders().length;
  Game.liveStage.droppedCount = Object.values(Game.liveStage.riderState).filter(state => state.dropped).length;
}

function applyTeamTimeTrialFinalRules(stage, results) {
  TEAMS.forEach(team => {
    const teamResults = results.filter(result => result.teamId === team.id).sort((a, b) => a.stageTime - b.stageTime);
    if (!teamResults.length) return;

    const markerIndex = Math.min(3, teamResults.length - 1);
    const markerTime = teamResults[markerIndex].stageTime;

    teamResults.forEach((result, index) => {
      const hasSeriousProblem = result.incident || result.crisis || result.timeCut;
      const gapToFourth = result.stageTime - markerTime;

      if (index <= markerIndex || (!hasSeriousProblem && gapToFourth <= 5)) {
        result.stageTime = markerTime;
        result.groupLabel = `CRE ${team.name}`;
      } else {
        result.stageTime = Math.max(result.stageTime, markerTime + 6);
        result.groupLabel = `Descolgado CRE +${secondsToTime(result.stageTime - markerTime)}`;
      }
    });
  });

  results.sort((a, b) => a.stageTime - b.stageTime);
}

function updateBreakawayAfterSector(stage, sector, sectorLog) {
  if (!Game.liveStage.breakawayIds.length) return;

  const pullingPower = getTeamRiders(Game.selectedTeamId).reduce((sum, rider) => {
    const order = getRiderOrder(rider);
    const live = Game.liveStage.riderState[rider.id];
    const effort = getRiderEffort(rider);
    if (!live || live.energy < 15) return sum;
    return sum + (order.id === "catch_breakaway" ? effort * 0.13 : order.groupPull > 0.8 ? effort * 0.08 : 0);
  }, 0);

  const terrainEffect = sector.type === "flat" ? -18 : sector.type === "valley" ? -12 : sector.type === "hilly" ? 4 : sector.type === "climb" ? 8 : sector.type === "wall" ? 5 : sector.type === "cobbles" ? 6 : sector.type === "final" ? -22 : -8;
  const orderEffect = Game.liveStage.orders.teamPull ? -35 - pullingPower : -pullingPower;
  const natural = randomBetween(-15, 22);

  Game.liveStage.breakawayGap = Math.max(0, Game.liveStage.breakawayGap + terrainEffect + orderEffect + natural);

  if (Game.liveStage.breakawayGap <= 20) sectorLog.events.push("La fuga está prácticamente neutralizada.");
  if (Game.liveStage.breakawayGap > 240) sectorLog.events.push("La fuga abre hueco peligroso.");
}

function updatePelotonState(sectorLog) {
  const active = getAllActiveRiders().length;
  const dropped = Object.values(Game.liveStage.riderState).filter(state => state.dropped).length;
  Game.liveStage.droppedCount = dropped;
  Game.liveStage.pelotonSize = Math.max(1, active - dropped);
  if (dropped > 8) sectorLog.events.push(`El pelotón se rompe: ${dropped} corredores cortados.`);
}

function applySectorOrders(sector, sectorLog) {
  if (Game.liveStage.orders.waitLeader) {
    const leader = getRider(Game.protectedRiderId);
    const leaderLive = leader ? Game.liveStage.riderState[leader.id] : null;

    if (leaderLive && (leaderLive.incident || leaderLive.crisis || leaderLive.dropped)) {
      const helpers = getTeamRiders(Game.selectedTeamId).filter(rider => rider.id !== leader.id).slice(0, 2);

      helpers.forEach(helper => {
        const live = Game.liveStage.riderState[helper.id];
        if (!live) return;
        live.stageTime += 25;
        live.energy = clamp(live.energy - 12, 0, 100);
        live.domestiqueBurned = true;
      });

      leaderLive.stageTime = Math.max(0, leaderLive.stageTime - 45);
      leaderLive.groupId = "peloton";
      leaderLive.groupLabel = "Pelotón principal";
      sectorLog.events.push(`${helpers.map(helper => helper.name).join(" y ")} esperan al líder y reducen la pérdida.`);
    }
  }

  Game.liveStage.orders.teamPull = false;
  Game.liveStage.orders.waitLeader = false;
}

function getSectorTransitionHint(sector) {
  if (isTeamTimeTrialStage(getCurrentStage())) return "Radio: sigue la CRE. Mantén mínimo 4 corredores unidos.";
  if (sector.type === "climb") return "Radio: llega subida. Revisa energía, esfuerzo y grupo del líder.";
  if (sector.type === "wall") return "Radio: muro duro. Buen punto para ataque explosivo.";
  if (sector.type === "final") return "Radio: sector final. Cafeína, energía y grupo deciden.";
  if (sector.type === "cobbles") return "Radio: sector peligroso. Alto esfuerzo aumenta riesgo.";
  if (sector.type === "flat") return "Radio: sector llano. Puedes tirar del pelotón o ahorrar.";
  return "Radio: revisa grupos, rivales y estrategia.";
}

function finishLiveStage(renderAfter = true) {
  const stage = getCurrentStage();

  let results = getAllActiveRiders().map(rider => {
    const live = Game.liveStage.riderState[rider.id];

    return {
      riderId: rider.id,
      riderName: rider.name,
      teamId: rider.teamId,
      teamName: getTeam(rider.teamId).name,
      stageTime: live.stageTime,
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

  if (!isTeamTimeTrialStage(stage) && Game.liveStage.breakawayIds.length && Game.liveStage.breakawayGap > 45) {
    results.forEach(result => {
      if (Game.liveStage.breakawayIds.includes(result.riderId)) {
        result.stageTime -= Math.min(180, Game.liveStage.breakawayGap * 0.45);
      }
    });
  }

  results.sort((a, b) => a.stageTime - b.stageTime);

  if (isTeamTimeTrialStage(stage)) {
    applyTeamTimeTrialFinalRules(stage, results);
  } else {
    applyTimeBonuses(stage, results);
    results.sort((a, b) => a.stageTime - b.stageTime);
    applyGroupFinishFromLive(stage, results);
  }

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
      success: !isTeamTimeTrialStage(stage) && Game.liveStage.breakawayGap > 45,
      narrative: isTeamTimeTrialStage(stage)
        ? "Crono por equipos disputada por bloques. El tiempo de cada equipo lo marca el 4º corredor."
        : Game.liveStage.breakawayIds.length
          ? `Fuga de ${Game.liveStage.breakawayIds.length}. ${Game.liveStage.breakawayGap > 45 ? "La fuga llegó con ventaja." : "La fuga fue neutralizada."}`
          : "Sin fuga relevante."
    },
    sectorLogs: Game.liveStage.sectorLogs
  };

  Game.stageHistory.push(Game.lastStageResults);
  Game.liveStage = null;
  saveGame();

  if (renderAfter) renderStageResultScreen();
}

/* ============================================================
   GRUPOS
   ============================================================ */

function recomputeLiveGroupLabels() {
  if (!Game.liveStage) return;
  const stage = getCurrentStage();

  if (isTeamTimeTrialStage(stage)) {
    recomputeTeamTimeTrialGroupLabels();
    return;
  }

  const states = getAllActiveRiders().map(rider => ({ rider, state: Game.liveStage.riderState[rider.id] })).filter(item => item.state);
  if (!states.length) return;

  const bestTime = Math.min(...states.map(item => item.state.stageTime));

  states.forEach(item => {
    const { rider, state } = item;

    if (state.groupId === "breakaway" && Game.liveStage.breakawayGap > 20) {
      state.groupLabel = "Fuga";
      return;
    }

    if (state.groupId && state.groupId.startsWith("attack_")) {
      state.groupLabel = "Ataque";
      return;
    }

    const gap = state.stageTime - bestTime;

    if (state.dropped || state.groupId === "dropped" || gap > 240) {
      state.groupLabel = "Cortados";
      state.groupId = "dropped";
    } else if (gap > 90) {
      state.groupLabel = "Grupo 2";
      state.groupId = "group2";
    } else if (gap > 25) {
      state.groupLabel = "Pelotón principal";
      state.groupId = "peloton";
    } else {
      state.groupLabel = "Grupo líder";
      state.groupId = state.groupId === "breakaway" ? "breakaway" : "leader";
    }
  });
}

function recomputeTeamTimeTrialGroupLabels() {
  if (!Game.liveStage) return;

  TEAMS.forEach(team => {
    const teamItems = getTeamRiders(team.id).map(rider => ({ rider, state: Game.liveStage.riderState[rider.id] })).filter(item => item.state).sort((a, b) => a.state.stageTime - b.state.stageTime);
    if (!teamItems.length) return;

    const markerIndex = Math.min(3, teamItems.length - 1);
    const markerTime = teamItems[markerIndex].state.stageTime;

    teamItems.forEach((item, index) => {
      const gapToFourth = item.state.stageTime - markerTime;

      if (index <= markerIndex || (!item.state.dropped && gapToFourth <= 40)) {
        item.state.groupLabel = `CRE ${team.name}`;
        item.state.groupId = `ttt_${team.id}`;
      } else {
        item.state.groupLabel = `Descolgado ${team.name}`;
        item.state.groupId = `ttt_dropped_${team.id}`;
      }
    });
  });
}

function getImportantRivalIds() {
  const standings = getGCStandings();
  const userBest = standings.find(rider => rider.teamId === Game.selectedTeamId);
  const userIndex = standings.findIndex(rider => rider.id === userBest?.id);

  const directRivals = standings.filter((rider, index) => rider.teamId !== Game.selectedTeamId && Math.abs(index - userIndex) <= 5).slice(0, 5).map(rider => rider.id);
  const gcRivals = standings.filter(rider => rider.teamId !== Game.selectedTeamId && ["gc", "co_leader"].includes(rider.roleKey)).slice(0, 5).map(rider => rider.id);

  return [...new Set([...directRivals, ...gcRivals])];
}

function buildLiveGroups(stage, sector) {
  if (isTeamTimeTrialStage(stage)) return buildTeamTimeTrialLiveGroups(stage, sector);

  recomputeLiveGroupLabels();

  const currentKm = sector.kmStart;
  const rivalIds = getImportantRivalIds();
  const groupsMap = {};

  getAllActiveRiders().forEach(rider => {
    const state = Game.liveStage.riderState[rider.id];
    if (!state) return;

    const label = state.groupLabel || "Pelotón principal";
    const key = state.groupId || label;

    if (!groupsMap[key]) {
      groupsMap[key] = {
        label,
        riders: [],
        userRiders: [],
        rivals: [],
        avgTime: 0,
        km: currentKm
      };
    }

    groupsMap[key].riders.push(rider);
    if (rider.teamId === Game.selectedTeamId) groupsMap[key].userRiders.push(rider);
    if (rivalIds.includes(rider.id)) groupsMap[key].rivals.push(rider);
  });

  const groups = Object.values(groupsMap).map(group => {
    group.avgTime = average(group.riders.map(rider => Game.liveStage.riderState[rider.id]?.stageTime || 0));
    return group;
  });

  if (!groups.length) return [];

  const leaderTime = Math.min(...groups.map(group => group.avgTime));

  groups.forEach(group => {
    const gap = Math.max(0, group.avgTime - leaderTime);

    if (group.label === "Fuga") {
      group.km = clamp(currentKm + Game.liveStage.breakawayGap / 35, 0, stage.distance);
      group.gapText = `+${secondsToTime(Game.liveStage.breakawayGap)} sobre pelotón`;
      group.className = "group-breakaway";
    } else {
      group.km = clamp(currentKm - gap / 45, 0, stage.distance);
      group.gapText = gap <= 3 ? "m.t." : `+${secondsToTime(gap)}`;
      group.className =
        group.label === "Ataque" ? "group-attack" :
        group.label === "Grupo líder" ? "group-leader" :
        group.label === "Pelotón principal" ? "group-peloton" :
        group.label === "Grupo 2" ? "group-second" :
        "group-dropped";
    }
  });

  const order = { Fuga: 0, Ataque: 1, "Grupo líder": 2, "Pelotón principal": 3, "Grupo 2": 4, Cortados: 5 };
  return groups.sort((a, b) => (order[a.label] ?? 9) - (order[b.label] ?? 9));
}

function buildTeamTimeTrialLiveGroups(stage, sector) {
  recomputeTeamTimeTrialGroupLabels();

  const currentKm = sector.kmStart;
  const rivalIds = getImportantRivalIds();
  const groups = [];

  TEAMS.forEach(team => {
    const items = getTeamRiders(team.id).map(rider => ({ rider, state: Game.liveStage.riderState[rider.id] })).filter(item => item.state);
    if (!items.length) return;

    const mainTrain = items.filter(item => item.state.groupLabel === `CRE ${team.name}`);
    const dropped = items.filter(item => item.state.groupLabel === `Descolgado ${team.name}`);

    if (mainTrain.length) {
      groups.push({
        label: `CRE ${team.name}`,
        riders: mainTrain.map(item => item.rider),
        userRiders: mainTrain.map(item => item.rider).filter(rider => rider.teamId === Game.selectedTeamId),
        rivals: mainTrain.map(item => item.rider).filter(rider => rivalIds.includes(rider.id)),
        avgTime: average(mainTrain.map(item => item.state.stageTime)),
        km: currentKm,
        isDroppedGroup: false
      });
    }

    if (dropped.length) {
      groups.push({
        label: `Descolgados ${team.name}`,
        riders: dropped.map(item => item.rider),
        userRiders: dropped.map(item => item.rider).filter(rider => rider.teamId === Game.selectedTeamId),
        rivals: dropped.map(item => item.rider).filter(rider => rivalIds.includes(rider.id)),
        avgTime: average(dropped.map(item => item.state.stageTime)),
        km: currentKm,
        isDroppedGroup: true
      });
    }
  });

  if (!groups.length) return [];

  const leaderTime = Math.min(...groups.map(group => group.avgTime));

  groups.forEach(group => {
    const gap = Math.max(0, group.avgTime - leaderTime);
    group.km = clamp(currentKm - gap / 45, 0, stage.distance);
    group.gapText = gap <= 3 ? "m.t." : `+${secondsToTime(gap)}`;
    group.className = group.isDroppedGroup ? "group-dropped" : group.userRiders.length ? "group-leader" : gap <= 3 ? "group-breakaway" : gap < 60 ? "group-peloton" : "group-second";
  });

  return groups.sort((a, b) => a.avgTime - b.avgTime);
}

/* ============================================================
   IA
   ============================================================ */

function chooseAITactic(rider, stage) {
  const team = getTeam(rider.teamId);
  const ai = team.aiProfile || {};

  if (rider.fatigue > 65) return getTactic("conservative");
  if (stage.type === "team_time_trial") return ["gc", "co_leader", "time_trialist", "rouleur"].includes(rider.roleKey) ? getTactic("aggressive") : getTactic("balanced");
  if (stage.type === "mountain" && (ai.gcFocus || 0) > 75) return getTactic("aggressive");
  if (stage.type === "hilly" && (ai.breakawayFocus || 0) > 70) return getTactic("aggressive");
  if (stage.type === "cobbles_hills" && (ai.aggression || 0) > 80) return getTactic("aggressive");
  if (stage.type === "flat" && (ai.sprintFocus || 0) > 70) return getTactic("sprint_train");
  if (stage.type === "time_trial" && team.archetype.includes("Crono")) return getTactic("aggressive");
  if (Math.random() * 100 < (ai.aggression || 50) * 0.07) return getTactic("all_in");

  return getTactic("balanced");
}

function chooseAIOrder(rider, stage, sector) {
  const team = getTeam(rider.teamId);
  const ai = team.aiProfile || {};

  if (rider.fatigue > 70) return getOrder("sit_in");
  if (stage.type === "team_time_trial") return getOrder("pull_group");
  if (sector.type === "climb" && ["gc", "co_leader", "climber"].includes(rider.roleKey) && ai.gcFocus > 75) return getOrder("climb_tempo");
  if (sector.type === "final" && rider.roleKey === "sprinter") return getOrder("sprint_train");
  if (stage.type === "flat" && ai.sprintFocus > 75 && ["rouleur", "domestique", "classics"].includes(rider.roleKey)) return getOrder("pull_group");
  if (Game.liveStage?.breakawayGap > 220 && ai.control > 70 && ["rouleur", "domestique", "time_trialist"].includes(rider.roleKey)) return getOrder("catch_breakaway");
  if (Math.random() * 100 < ai.aggression * 0.05 && ["puncheur", "classics", "climber"].includes(rider.roleKey)) return getOrder("attack");
  return getOrder("hold_position");
}

function chooseAIEffort(rider, stage, sector) {
  let base = rider.defaultEffort || 60;
  const team = getTeam(rider.teamId);
  const ai = team.aiProfile || {};

  if (stage.type === "team_time_trial") base += 14;
  if (sector.type === "final") base += 10;
  if (sector.type === "climb" && ["gc", "co_leader", "climber"].includes(rider.roleKey)) base += 10;
  if (sector.type === "cobbles" && ["classics", "rouleur"].includes(rider.roleKey)) base += 8;
  if (Game.liveStage?.breakawayGap > 240 && ai.control > 70) base += 8;
  if (rider.fatigue > 65) base -= 16;

  return clamp(base + randomBetween(-6, 6), 25, 96);
}

/* ============================================================
   RESULTADOS Y CLASIFICACIONES
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

    if (!result.incident && !result.crisis && result.groupLabel !== "Ataque") {
      result.stageTime = groupTime;
      result.groupLabel = groupNo === 1 ? "Grupo 1" : `Grupo ${groupNo}`;
    }
  });
}

function updateStagePositions(results) {
  results.forEach((result, index) => {
    result.position = index + 1;
  });
}

function applyTimeCut(stage, results) {
  if (!isGrandTour()) return;
  if (!["mountain", "hilly", "cobbles_hills"].includes(stage.type)) return;

  const winnerTime = results[0].stageTime;
  const limit = stage.type === "mountain" ? winnerTime * 1.18 : stage.type === "hilly" ? winnerTime * 1.14 : winnerTime * 1.16;

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

    if (result.incident?.abandon || result.timeCut) rider.abandoned = true;
  });
}

function calculateDailyRecovery(rider, stage) {
  return clamp(
    (rider.stats.recovery * 0.085 + rider.stats.stamina * 0.025 + (rider.fatigue > 60 ? 0.8 : 0)) *
      ({ flat: 1.05, hilly: 0.80, time_trial: 0.90, team_time_trial: 0.92, mountain: 0.62, cobbles_hills: 0.58 }[stage.type] || 0.8),
    2,
    10
  );
}

function updateTeamClassification(results) {
  TEAMS.forEach(team => {
    const top = results.filter(result => result.teamId === team.id).sort((a, b) => a.stageTime - b.stageTime).slice(0, CLASSIFICATION_RULES.teamClassificationBestRiders);
    if (top.length) Game.teamTimes[team.id] += top.reduce((sum, result) => sum + result.stageTime, 0);
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
    return rb.stats.sprint + rb.stats.flat * 0.25 + (b.inBreakaway ? 10 : 0) - (ra.stats.sprint + ra.stats.flat * 0.25 + (a.inBreakaway ? 10 : 0));
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
      return rb.stats.mountain + rb.stats.hills * 0.35 + (b.inBreakaway ? 7 : 0) + randomBetween(0, 6) - (ra.stats.mountain + ra.stats.hills * 0.35 + (a.inBreakaway ? 7 : 0) + randomBetween(0, 6));
    });

    scale.forEach((points, index) => {
      const rider = getRider(ranking[index]?.riderId);
      if (rider) rider.mountainPoints += points;
    });
  });
}

function updateUciStagePoints(stage, results) {
  const scale = isGrandTour() ? CLASSIFICATION_RULES.uci.grandTourStage : CLASSIFICATION_RULES.uci.oneDay;
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

    [getPointsStandings()[0], getMountainStandings()[0], getYouthStandings()[0]].forEach(rider => {
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
  results.filter(result => result.incident || result.crisis || result.timeCut).forEach(result => {
    Game.incidentHistory.push({
      raceId: Game.selectedRaceId,
      stage: stage.number,
      riderId: result.riderId,
      riderName: result.riderName,
      type: result.incident?.type || (result.crisis ? "Pájara/Crisis" : "Fuera de control"),
      timeLoss: result.incident?.timeLoss || 0
    });
  });
}

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
  return getAllActiveRiders().filter(rider => rider.age <= CLASSIFICATION_RULES.youthMaxAge).sort((a, b) => a.totalTime - b.totalTime);
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
  return Game.stageHistory.filter(item => item.results[0]?.teamId === Game.selectedTeamId).map(item => item.results[0].riderId);
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
    if (id === "uci_top_10") ok = uci.slice(0, 10).some(rider => rider.teamId === Game.selectedTeamId);
    if (id === "time_trial_win") ok = Game.stageHistory.some(item => item.stage.type.includes("time_trial") && item.results[0]?.teamId === Game.selectedTeamId);
    if (id === "monument_win") ok = !isGrandTour() && Game.stageHistory[0]?.results[0]?.teamId === Game.selectedTeamId;

    return { id, ok, ...(OBJECTIVE_DEFINITIONS[id] || { label: id, prestige: 0, budget: 0 }) };
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

  const satisfactionDelta = Math.round((results.filter(item => item.ok).length / Math.max(1, results.length)) * 35 - 12) * getDifficulty().sponsorMultiplier;
  Game.prestige += prestige;
  Game.budget += budget;
  Game.sponsorSatisfaction = clamp(Game.sponsorSatisfaction + satisfactionDelta, 0, 100);
  Game.objectiveResults.push({ doneKey, raceId: Game.selectedRaceId, results, prestige, budget, satisfactionDelta });
}

/* ============================================================
   RENDER RESULTADOS
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
        <button onclick="goToNextStage()">${Game.currentStageIndex >= getStages().length - 1 ? "Ver clasificación final" : "Siguiente etapa"}</button>
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
  const incidents = results.filter(result => result.incident || result.crisis || result.timeCut).slice(0, 10);
  if (!incidents.length) return `<p class="muted small">Sin incidentes importantes.</p>`;

  return `
    <div class="incident-list">
      ${incidents.map(result => `
        <span class="incident-chip">${escapeHtml(result.riderName)}: ${escapeHtml(result.incident?.type || (result.crisis ? "Pájara" : "Fuera de control"))}</span>
      `).join("")}
    </div>
  `;
}

function renderStageResultsTable(results, leaderTime) {
  return `
    <table>
      <thead>
        <tr><th>Pos</th><th>Corredor</th><th>Equipo</th><th>Tiempo</th><th>Dif.</th><th>Grupo</th><th>Bonus</th><th>UCI</th><th>Inc.</th></tr>
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
        <thead><tr><th>Corredor</th><th>Equipo</th><th>Perfil</th><th>Edad</th></tr></thead>
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
        <tr><th>Pos</th><th>Corredor</th><th>Equipo</th><th>Tiempo</th><th>Dif.</th><th>Fat.</th><th>Mor.</th><th>Pts</th><th>Mont.</th><th>UCI</th></tr>
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
  const items = Object.entries(Game.stageWinCounts).map(([id, count]) => ({ rider: getRider(id), count })).filter(item => item.rider).sort((a, b) => b.count - a.count);

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
      <p class="muted small">Presupuesto: ${money(Game.budget)} · Prestigio: ${Math.round(Game.prestige)} · Sponsor: ${Math.round(Game.sponsorSatisfaction)}/100</p>
    </div>
  `;
}

function renderStageAnalysis(stage, results) {
  const userResult = results.filter(result => result.teamId === Game.selectedTeamId).sort((a, b) => a.stageTime - b.stageTime)[0];
  const winner = results[0];
  const gc = getGCStandings();
  const bestUser = gc.find(rider => rider.teamId === Game.selectedTeamId);
  const bestUserPosition = gc.findIndex(rider => rider.id === bestUser?.id) + 1;

  return `
    <div class="grid three">
      <div class="stage-card"><span class="muted">Ganador</span><div class="big-number">#1</div><strong>${escapeHtml(winner.riderName)}</strong></div>
      <div class="stage-card"><span class="muted">Mejor equipo</span><div class="big-number">${userResult.position}</div><strong>${escapeHtml(userResult.riderName)}</strong></div>
      <div class="stage-card"><span class="muted">Tu mejor GC</span><div class="big-number">${bestUserPosition}</div><strong>${bestUser ? escapeHtml(bestUser.name) : "—"}</strong></div>
    </div>
    <p class="help">${getStageComment(stage)}</p>
  `;
}

function getStageComment(stage) {
  if (stage.type === "team_time_trial") return "CRE: el bloque está unido. El tiempo de equipo lo marca el 4º corredor.";
  if (stage.type === "mountain") return "Montaña: nutrición, material ligero, esfuerzos y energía deciden la etapa.";
  if (stage.type === "hilly") return "Media montaña: fugas, cambios tácticos y muros pueden romper la carrera.";
  if (stage.type === "flat") return stage.profile.windExposure > 60 ? "Llano con viento: ruedas y estabilidad lateral importan." : "Llano: tren de sprint, aero y colocación.";
  if (stage.type === "cobbles_hills") return "Pavés/muros: confort, fiabilidad y ruedas resistentes reducen mucho el riesgo.";
  if (stage.type === "time_trial") return "Crono: aero, TT y ruedas lenticulares marcan diferencias.";
  return "Etapa completada.";
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
  resetUserOrdersAndEfforts();
  applyEquipmentPreset("auto", false);
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
        <button onclick="continueAfterRace()">${Game.mode === "season" && Game.seasonRaceIndex < Game.seasonRaceIds.length - 1 ? "Entrenar y seguir temporada" : "Finalizar"}</button>
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

      <section class="panel"><h2>General completa</h2>${renderGeneralClassificationTable(120)}</section>
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
      <div><h1>Entre carreras 🧪</h1><p>Aplica un bloque de entrenamiento antes de la siguiente carrera.</p></div>
    </div>

    <section class="panel">
      <h2>Estado del equipo</h2>
      <p class="help">Presupuesto ${money(Game.budget)} · Prestigio ${Math.round(Game.prestige)} · Sponsor ${Math.round(Game.sponsorSatisfaction)}/100</p>
      <div class="race-grid">
        ${TRAINING_OPTIONS.map(option => `
          <button class="race-card" onclick="applyTrainingAndNextRace('${option.id}')">
            <span class="race-title">${escapeHtml(option.name)}</span>
            <span class="muted small">${escapeHtml(option.description)}</span>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="panel" style="margin-top:16px;"><h2>Equipo</h2><div class="rider-grid">${getTeamRiders(Game.selectedTeamId).map(renderRiderCard).join("")}</div></section>
  `;
}

function applyTrainingAndNextRace(optionId) {
  const option = TRAINING_OPTIONS.find(item => item.id === optionId);
  if (!option) return;

  Game.riders.filter(rider => rider.teamId === Game.selectedTeamId).forEach(rider => {
    rider.fatigue = clamp(rider.fatigue + (option.effects.fatigue || 0), 0, 100);
    rider.form = clamp(rider.form + (option.effects.form || 0), 55, 99);
    rider.morale = clamp(rider.morale + (option.effects.morale || 0), 30, 100);

    ["mountain", "stamina", "timeTrial", "teamTimeTrial", "sprint", "positioning", "acceleration"].forEach(key => {
      if (option.effects[key]) rider.stats[key] = clamp(rider.stats[key] + option.effects[key], 42, 99);
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
      <div><h1>Temporada finalizada 🌈</h1><p>Ranking UCI acumulado y balance de objetivos.</p></div>
      <div class="top-actions"><button onclick="initGame()">Nueva partida</button></div>
    </div>

    <div class="grid two">
      <section class="panel"><h2>Ranking UCI</h2>${renderSmallTable("UCI", getUciStandings(), "uciPoints", "pts")}</section>
      <section class="panel">
        <h2>Balance manager</h2>
        <p class="help">Presupuesto: ${money(Game.budget)}<br>Prestigio: ${Math.round(Game.prestige)}<br>Satisfacción sponsor: ${Math.round(Game.sponsorSatisfaction)}/100</p>
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
  const rival = gc.find((rider, index) => rider.teamId !== Game.selectedTeamId && Math.abs(index - userPosition) <= 2) || gc.find(rider => rider.teamId !== Game.selectedTeamId);

  return `
    <div class="rival-card">
      <h2>Rival directo</h2>
      ${userBest && rival ? `<p class="help">Tu líder: <strong>${escapeHtml(userBest.name)}</strong><br>Rival: <strong>${escapeHtml(rival.name)}</strong><br>Diferencia: <strong>${gapToLeader(userBest.totalTime, rival.totalTime)}</strong></p>` : `<p class="muted">Disponible tras la primera etapa.</p>`}
    </div>
  `;
}

function renderStageHistorySummary() {
  return `
    <table>
      <thead><tr><th>Etapa</th><th>Tipo</th><th>Ganador</th><th>Equipo</th><th>Fuga / CRE</th></tr></thead>
      <tbody>
        ${Game.stageHistory.map(item => `
          <tr class="${item.results[0]?.teamId === Game.selectedTeamId ? "user-team" : ""}">
            <td>${escapeHtml(item.stage.name)}</td>
            <td>${escapeHtml(item.stage.label)}</td>
            <td>${escapeHtml(item.results[0]?.riderName || "—")}</td>
            <td>${escapeHtml(item.results[0]?.teamName || "—")}</td>
            <td>${item.stage.type === "team_time_trial" ? "CRE" : item.breakawayInfo?.success ? "Llegó" : "Neutralizada"}</td>
          </tr>
        `).join("") || `<tr><td>—</td><td colspan="4">Sin etapas disputadas</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderJerseyHistoryTable() {
  return `
    <table>
      <thead><tr><th>Etapa</th><th>GC</th><th>Puntos</th><th>Montaña</th><th>Joven</th><th>Equipos</th></tr></thead>
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
  return `<div class="incident-list">${Game.incidentHistory.slice(-20).map(item => `<span class="incident-chip">Et. ${item.stage} · ${escapeHtml(item.riderName)} · ${escapeHtml(item.type)} ${item.timeLoss ? `+${Math.round(item.timeLoss)}s` : ""}</span>`).join("") || `<span class="muted small">Sin incidencias.</span>`}</div>`;
}

initGame();
