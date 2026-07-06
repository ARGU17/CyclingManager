/* ============================================================
   CYCLING MANAGER TOUR - game.js
   v0.4: carreras múltiples, estrategia individual, equipos,
   UCI points, puntos, montaña, jóvenes, perfiles, fugas/incidentes.
   ============================================================ */

const app = document.getElementById("app");

const Game = {
  selectedRaceId: DEFAULT_RACE_ID,
  selectedTeamId: null,
  protectedRiderId: null,
  currentStageIndex: 0,
  defaultTacticId: "balanced",
  riderTactics: {},
  riders: [],
  teamTimes: {},
  stageHistory: [],
  lastStageResults: null,
  finalUciAssigned: false,
  finished: false
};

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
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
}

function standardDeviation(values) {
  const avg = average(values);
  return values.length ? Math.sqrt(average(values.map(v => Math.pow(v - avg, 2)))) : 0;
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

function getRider(riderId) {
  return Game.riders.find(rider => rider.id === riderId);
}

function getTeamRiders(teamId) {
  return Game.riders.filter(rider => rider.teamId === teamId && !rider.abandoned);
}

function getAllActiveRiders() {
  return Game.riders.filter(rider => !rider.abandoned);
}

function getTactic(tacticId) {
  return TACTICS.find(tactic => tactic.id === tacticId) || TACTICS.find(tactic => tactic.id === "balanced");
}

function getUserTacticForRider(rider) {
  return getTactic(Game.riderTactics[rider.id] || Game.defaultTacticId);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function initGame() {
  Game.selectedRaceId = DEFAULT_RACE_ID;
  Game.selectedTeamId = null;
  Game.protectedRiderId = null;
  Game.currentStageIndex = 0;
  Game.defaultTacticId = "balanced";
  Game.riderTactics = {};
  Game.riders = deepClone(RIDERS);
  Game.teamTimes = Object.fromEntries(TEAMS.map(team => [team.id, 0]));
  Game.stageHistory = [];
  Game.lastStageResults = null;
  Game.finalUciAssigned = false;
  Game.finished = false;
  renderHome();
}

function selectRace(raceId) {
  Game.selectedRaceId = raceId;
  Game.currentStageIndex = 0;
  Game.finished = false;
  renderHome();
}

function startWithTeam(teamId) {
  Game.selectedTeamId = teamId;
  Game.currentStageIndex = 0;
  Game.defaultTacticId = "balanced";
  Game.riders = deepClone(RIDERS);
  Game.teamTimes = Object.fromEntries(TEAMS.map(team => [team.id, 0]));
  Game.stageHistory = [];
  Game.lastStageResults = null;
  Game.finalUciAssigned = false;
  Game.finished = false;

  Game.protectedRiderId = getTeamRiders(teamId)[0]?.id || null;
  resetUserRiderTactics("balanced");

  renderRaceScreen();
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

/* ============================================================
   RENDER
   ============================================================ */

function renderHome() {
  const race = getRace();

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Cycling Manager Tour 🚴‍♂️</h1>
        <p>Carreras múltiples · UCI points · perfiles de etapa · clasificaciones completas.</p>
      </div>
    </div>

    <section class="panel">
      <h2>Elige carrera</h2>
      <div class="race-grid">
        ${RACES.map(r => `
          <button class="race-card ${Game.selectedRaceId === r.id ? "active" : ""}" onclick="selectRace('${r.id}')">
            <span class="race-title">${escapeHtml(r.name)}</span>
            <span class="badge ${r.leaderJerseyClass}">${escapeHtml(r.leaderJerseyName)}</span>
            <span class="muted small">${r.stages.length} etapas · ${escapeHtml(r.country)}</span>
          </button>
        `).join("")}
      </div>
    </section>

    <div class="grid two" style="margin-top:16px;">
      <section class="panel">
        <h2>Recorrido: ${escapeHtml(race.name)}</h2>
        <p class="help">
          Se simulan perfiles, puertos, puntos, montaña, general, jóvenes, equipos, UCI points,
          bonificaciones, fugas e incidentes.
        </p>
        <hr />
        <div class="stage-list">
          ${race.stages.map(stage => renderStageMiniCard(stage)).join("")}
        </div>
      </section>

      <section class="panel">
        <h2>Elige equipo</h2>
        <p class="muted">10 equipos de 8 corredores. Estructura preparada para ampliar a 22/23 equipos.</p>
        <div class="grid">
          ${TEAMS.map(team => renderTeamCard(team)).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderStageMiniCard(stage) {
  const climbs = stage.profile?.climbs || [];

  return `
    <div class="stage-card">
      <div class="badge-row">
        <span class="badge green">Etapa ${stage.number}</span>
        <span class="badge blue">${escapeHtml(stage.label)}</span>
        <span class="badge">${stage.distance} km</span>
        <span class="badge orange">Dificultad ${stage.difficulty}</span>
        ${climbs.length ? `<span class="badge polka">${climbs.length} puertos</span>` : ""}
      </div>
      <h3>${escapeHtml(stage.name)}</h3>
      <p class="muted">${escapeHtml(stage.description)}</p>
    </div>
  `;
}

function renderTeamCard(team) {
  const riders = RIDERS.filter(rider => rider.teamId === team.id);

  return `
    <div class="team-card">
      <div class="badge-row">
        <span class="badge ${team.color}">${escapeHtml(team.archetype)}</span>
        <span class="badge">${riders.length} corredores</span>
      </div>
      <h3>${escapeHtml(team.name)}</h3>
      <p class="muted">${escapeHtml(team.description)}</p>
      <div class="badge-row">
        ${riders.slice(0, 8).map(rider => `<span class="badge">${escapeHtml(rider.name)}</span>`).join("")}
      </div>
      <button onclick="startWithTeam('${team.id}')">Competir con este equipo</button>
    </div>
  `;
}

function renderRaceScreen() {
  if (Game.finished) {
    renderFinalScreen();
    return;
  }

  const race = getRace();
  const stage = getCurrentStage();
  const team = getTeam(Game.selectedTeamId);
  const userRiders = getTeamRiders(Game.selectedTeamId);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>${escapeHtml(team.name)}</h1>
        <p>${escapeHtml(race.name)} · Etapa ${Game.currentStageIndex + 1}/${getStages().length} · ${escapeHtml(stage.name)}</p>
      </div>

      <div class="top-actions">
        <button class="secondary" onclick="renderHome()">Cambiar carrera/equipo</button>
        <button class="danger" onclick="initGame()">Reiniciar</button>
      </div>
    </div>

    ${renderLeaderCards()}

    <div class="grid two" style="margin-top:16px;">
      <section class="panel">
        ${renderCurrentStage(stage)}
        ${renderProtectedRiderSelector(userRiders)}
        ${renderTacticPresets()}
        ${renderIndividualTactics(userRiders)}

        <div class="simulation-actions">
          <div>
            <strong>Modo:</strong> estrategia individual por corredor
            <div class="muted small">Los gregarios pueden proteger líder o montar tren de sprint.</div>
          </div>
          <button onclick="simulateCurrentStage()">Simular etapa</button>
        </div>
      </section>

      <section class="panel">
        <h2>Clasificaciones</h2>
        ${renderGeneralClassificationTable(12)}
        <hr />
        ${renderMiniClassifications()}
      </section>
    </div>

    <div class="grid two" style="margin-top:16px;">
      <section class="panel">
        <h2>Tu equipo</h2>
        <div class="rider-grid">
          ${userRiders.map(renderRiderCard).join("")}
        </div>
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
        <span class="muted">Equipos</span>
        <strong>${teams[0] ? escapeHtml(teams[0].team.name) : "—"}</strong>
        <small>${teams[0] ? secondsToTime(teams[0].time) : "—"}</small>
      </div>
      ${renderLeaderCard("UCI", uci[0], "jersey-blue", uci[0] ? `${uci[0].uciPoints} pts` : "—")}
    </section>
  `;
}

function renderLeaderCard(title, rider, jerseyClass, value) {
  return `
    <div class="leader-card ${jerseyClass}">
      <span>${escapeHtml(title)}</span>
      <strong>${rider ? escapeHtml(rider.name) : "—"}</strong>
      <small>${escapeHtml(value)}</small>
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
      ${renderStageProfile(stage)}
      ${renderClimbList(stage)}
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

  const d = points.map((p, i) => {
    const x = pad + (p.km / stage.distance) * (width - pad * 2);
    const y = height - pad - ((p.alt - minAlt) / Math.max(1, maxAlt - minAlt)) * (height - pad * 2);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const climbLabels = (stage.profile.climbs || []).map(c => {
    const x = pad + (c.km / stage.distance) * (width - pad * 2);
    return `
      <g>
        <line x1="${x}" y1="26" x2="${x}" y2="160" class="profile-climb-line"/>
        <text x="${x + 4}" y="22" class="profile-label">${escapeHtml(c.category)} · ${escapeHtml(c.name)}</text>
      </g>
    `;
  }).join("");

  return `
    <div class="profile-box">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Perfil de etapa">
        <path d="M${pad},${height - pad} L${width - pad},${height - pad}" class="profile-axis"/>
        <path d="${d} L${width - pad},${height - pad} L${pad},${height - pad} Z" class="profile-area"/>
        <path d="${d}" class="profile-line"/>
        ${climbLabels}
      </svg>
      <div class="profile-meta">
        <span>Desnivel: ${stage.profile.elevationGain} m</span>
        <span>Viento: ${stage.profile.windExposure}</span>
        <span>Lluvia: ${stage.profile.rainRisk}%</span>
        <span>Calor: ${stage.profile.heat}</span>
        <span>Superficie: ${escapeHtml(stage.profile.roadSurface)}</span>
      </div>
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

function renderTacticPresets() {
  return `
    <h2>Presets rápidos</h2>
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

function renderRiderStrategyCard(rider) {
  const currentTacticId = Game.riderTactics[rider.id] || "balanced";
  const currentTactic = getTactic(currentTacticId);

  return `
    <div class="strategy-card ${Game.protectedRiderId === rider.id ? "protected" : ""}">
      <div>
        <div class="badge-row">
          <span class="badge green">${escapeHtml(rider.role)}</span>
          <span class="badge blue">Forma ${Math.round(rider.form)}</span>
          <span class="badge orange">Fatiga ${Math.round(rider.fatigue)}</span>
          ${Game.protectedRiderId === rider.id ? `<span class="badge jersey-yellow">Protegido</span>` : ""}
        </div>

        <h3>${escapeHtml(rider.name)}</h3>
        <p class="muted small">${escapeHtml(currentTactic.description)}</p>
      </div>

      <select onchange="setRiderTactic('${rider.id}', this.value)">
        ${TACTICS.map(t => `
          <option value="${t.id}" ${currentTacticId === t.id ? "selected" : ""}>
            ${t.name}
          </option>
        `).join("")}
      </select>
    </div>
  `;
}

function renderRiderCard(rider) {
  const relevantStats = [
    ["flat", "Llano"],
    ["sprint", "Sprint"],
    ["timeTrial", "CRI"],
    ["teamTimeTrial", "CRE"],
    ["mountain", "Montaña"],
    ["cobbles", "Pavés"],
    ["hills", "Muros"],
    ["stamina", "Stamina"],
    ["recovery", "Recovery"],
    ["positioning", "Colocación"]
  ];

  return `
    <div class="rider-card">
      <div class="badge-row">
        <span class="badge green">${escapeHtml(rider.role)}</span>
        <span class="badge">${rider.age} años</span>
        <span class="badge orange">Fatiga ${Math.round(rider.fatigue)}</span>
        <span class="badge blue">UCI ${rider.uciPoints}</span>
      </div>

      <h4>${escapeHtml(rider.name)}</h4>
      <p class="muted small">${escapeHtml(rider.nationality)} · ${escapeHtml(rider.speciality)}</p>

      ${relevantStats.map(([key, label]) => `
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
        ${stage.distance} km · ${stage.profile.climbs.length} puertos · ${stage.profile.elevationGain} m+
      </div>
    </div>
  `;
}

/* ============================================================
   MOTOR DE SIMULACIÓN
   ============================================================ */

function simulateCurrentStage() {
  const stage = getCurrentStage();
  const breakawayInfo = generateBreakaway(stage);

  let results =
    stage.type === "team_time_trial"
      ? simulateTeamTimeTrial(stage, breakawayInfo)
      : simulateRoadStage(stage, breakawayInfo);

  results.sort((a, b) => a.stageTime - b.stageTime);

  applyTimeBonuses(stage, results);

  results.sort((a, b) => a.stageTime - b.stageTime);

  updateStagePositions(results);
  updateRiderTotals(stage, results);
  updateTeamClassification(results);
  updatePointsClassification(stage, results);
  updateMountainClassification(stage, results, breakawayInfo);
  updateUciStagePoints(stage, results);
  assignLeaderOfRaceUciPoint();

  Game.lastStageResults = {
    stage,
    results,
    breakawayInfo
  };

  Game.stageHistory.push(Game.lastStageResults);

  renderStageResultScreen();
}

function updateStagePositions(results) {
  results.forEach((result, index) => {
    result.position = index + 1;
  });
}

function updateRiderTotals(stage, results) {
  results.forEach(result => {
    const rider = getRider(result.riderId);

    if (!rider || rider.abandoned) return;

    rider.totalTime += result.stageTime;
    rider.raceDays = (rider.raceDays || 0) + 1;
    rider.energy = result.energyAfter;

    const recoveryGain = calculateDailyRecovery(rider, stage);

    rider.recoveredToday = recoveryGain;
    rider.fatigue = clamp(rider.fatigue + result.fatigueGain - recoveryGain, 0, 100);

    if (result.incident?.abandon) {
      rider.abandoned = true;
    }
  });
}

function simulateRoadStage(stage, breakawayInfo) {
  const baseStageTime = getBaseStageTime(stage);

  return getAllActiveRiders().map(rider => {
    const tactic =
      rider.teamId === Game.selectedTeamId
        ? getUserTacticForRider(rider)
        : chooseAITactic(rider, stage);

    let performance = calculatePerformance(rider, stage, tactic, breakawayInfo);
    const incident = calculateIncident(rider, stage, tactic);

    if (incident?.performancePenalty) {
      performance -= incident.performancePenalty;
    }

    const stageTime =
      convertPerformanceToTime(performance, baseStageTime, stage) +
      (incident?.timeLoss || 0);

    const fatigueGain =
      calculateFatigueGain(rider, stage, tactic, performance) +
      (incident?.fatigue || 0);

    const energyAfter = calculateEnergyAfter(rider, stage, tactic, performance, incident);

    return {
      riderId: rider.id,
      riderName: rider.name,
      teamId: rider.teamId,
      teamName: getTeam(rider.teamId).name,
      stageTime,
      performance,
      tacticName: tactic.name,
      fatigueGain,
      energyAfter,
      incident,
      inBreakaway: breakawayInfo.riderIds.includes(rider.id)
    };
  });
}

function simulateTeamTimeTrial(stage) {
  const baseStageTime = getBaseStageTime(stage);
  const teamResults = [];

  TEAMS.forEach(team => {
    const riders = getTeamRiders(team.id);

    if (!riders.length) return;

    const teamTactic =
      team.id === Game.selectedTeamId
        ? buildUserTeamTacticAggregate(riders)
        : chooseAITeamTactic(team, stage);

    const teamScore = calculateTeamTimeTrialScore(riders, teamTactic);
    const teamTime = convertPerformanceToTime(teamScore, baseStageTime, stage);

    riders.forEach((rider, index) => {
      const individualTactic =
        team.id === Game.selectedTeamId
          ? getUserTacticForRider(rider)
          : teamTactic;

      const internalGap =
        index < 5 ? randomBetween(0, 5) :
        index < 7 ? randomBetween(5, 18) :
        randomBetween(15, 35);

      const performance = teamScore + randomBetween(-1.5, 1.5);
      const incident = calculateIncident(rider, stage, individualTactic, true);

      teamResults.push({
        riderId: rider.id,
        riderName: rider.name,
        teamId: rider.teamId,
        teamName: team.name,
        stageTime: teamTime + internalGap + (incident?.timeLoss || 0),
        performance,
        tacticName: individualTactic.name,
        fatigueGain: calculateFatigueGain(rider, stage, individualTactic, performance),
        energyAfter: calculateEnergyAfter(rider, stage, individualTactic, performance, incident),
        incident,
        inBreakaway: false
      });
    });
  });

  return teamResults;
}

function generateBreakaway(stage) {
  if (["time_trial", "team_time_trial"].includes(stage.type)) {
    return {
      riderIds: [],
      success: false,
      narrative: "Sin fuga en cronos."
    };
  }

  const candidates = getAllActiveRiders().map(rider => {
    const tactic =
      rider.teamId === Game.selectedTeamId
        ? getUserTacticForRider(rider)
        : chooseAITactic(rider, stage);

    const gcLeader = getGCLeader();
    const gcGap = gcLeader ? rider.totalTime - gcLeader.totalTime : 0;
    const farInGC = gcGap > 8 * 60 ? 8 : 0;
    const roleBonus = ["puncheur", "classics", "climber", "rouleur"].includes(rider.roleKey) ? 6 : 0;
    const tacticBonus = tactic.id === "aggressive" ? 10 : tactic.id === "all_in" ? 16 : 0;
    const fatiguePenalty = rider.fatigue * 0.15;
    const terrainBonus =
      stage.type === "hilly" ? 7 :
      stage.type === "mountain" ? 5 :
      stage.type === "cobbles_hills" ? 8 :
      -2;

    return {
      rider,
      score: farInGC + roleBonus + tacticBonus + terrainBonus + randomBetween(0, 8) - fatiguePenalty
    };
  }).sort((a, b) => b.score - a.score);

  const size = clamp(Math.round(randomBetween(3, 8)), 3, 8);
  const chosen = candidates
    .slice(0, size)
    .filter(candidate => candidate.score > 7)
    .map(candidate => candidate.rider);

  const chanceBase = {
    flat: 0.10,
    hilly: 0.36,
    mountain: 0.28,
    cobbles_hills: 0.32
  }[stage.type] || 0.15;

  const successChance = clamp(chanceBase + chosen.length * 0.025 - stage.difficulty * 0.0015, 0.05, 0.55);
  const success = chosen.length >= 3 && Math.random() < successChance;

  return {
    riderIds: chosen.map(rider => rider.id),
    success,
    successChance,
    narrative: chosen.length
      ? `Fuga de ${chosen.length}: ${chosen.map(rider => rider.name).join(", ")}. ${success ? "La fuga llega." : "El pelotón neutraliza la fuga."}`
      : "No se consolidó fuga relevante."
  };
}

function calculatePerformance(rider, stage, tactic, breakawayInfo) {
  const s = rider.stats;
  let terrainScore = 0;

  if (stage.type === "flat") {
    terrainScore =
      s.flat * 0.38 +
      s.sprint * 0.24 +
      s.stamina * 0.14 +
      s.positioning * 0.10 +
      rider.form * 0.09 +
      s.recovery * 0.05;
  }

  if (stage.type === "hilly") {
    terrainScore =
      s.hills * 0.36 +
      s.acceleration * 0.18 +
      s.stamina * 0.14 +
      s.mountain * 0.10 +
      s.positioning * 0.08 +
      rider.form * 0.09 +
      s.recovery * 0.05;
  }

  if (stage.type === "time_trial") {
    terrainScore =
      s.timeTrial * 0.55 +
      s.flat * 0.14 +
      s.stamina * 0.14 +
      rider.form * 0.09 +
      s.consistency * 0.08;
  }

  if (stage.type === "mountain") {
    terrainScore =
      s.mountain * 0.50 +
      s.stamina * 0.18 +
      s.recovery * 0.10 +
      s.downhill * 0.06 +
      rider.form * 0.10 +
      s.acceleration * 0.06;
  }

  if (stage.type === "cobbles_hills") {
    terrainScore =
      s.cobbles * 0.32 +
      s.hills * 0.22 +
      s.positioning * 0.15 +
      s.acceleration * 0.13 +
      s.stamina * 0.12 +
      rider.form * 0.06;
  }

  const fatiguePenalty = getFatiguePenalty(rider, stage);
  const supportBonus =
    rider.teamId === Game.selectedTeamId
      ? calculateUserSupportBonus(rider, stage)
      : 0;

  const breakawayBonus =
    breakawayInfo?.riderIds.includes(rider.id)
      ? breakawayInfo.success ? 7 : 2
      : 0;

  const randomNoise = randomBetween(-5, 5) * (1.05 - rider.stats.consistency / 200);
  const longRacePenalty = calculateLongRacePenalty(rider, stage);

  return terrainScore + tactic.bonus + supportBonus + breakawayBonus + randomNoise - fatiguePenalty - longRacePenalty;
}

function calculateUserSupportBonus(rider, stage) {
  const mates = getTeamRiders(Game.selectedTeamId).filter(mate => mate.id !== rider.id);

  const protectPool = mates.reduce((sum, mate) => {
    const tactic = getUserTacticForRider(mate);
    return sum + (tactic.supportBonus || 0) * (mate.stats.stamina / 85);
  }, 0);

  const sprintPool = mates.reduce((sum, mate) => {
    const tactic = getUserTacticForRider(mate);
    return sum + (tactic.sprintTrainBonus || 0) * (mate.stats.flat / 85);
  }, 0);

  let bonus = 0;

  if (rider.id === Game.protectedRiderId) {
    const factor = {
      flat: 0.35,
      hilly: 0.75,
      time_trial: 0.10,
      team_time_trial: 0.25,
      mountain: 0.95,
      cobbles_hills: 0.75
    }[stage.type] || 0.5;

    bonus += protectPool * factor;
  }

  if (rider.roleKey === "sprinter" && stage.type === "flat") {
    bonus += sprintPool * 0.90;
  }

  if (rider.roleKey === "sprinter" && stage.type === "cobbles_hills") {
    bonus += sprintPool * 0.35;
  }

  return clamp(bonus, 0, 9);
}

function buildUserTeamTacticAggregate(riders) {
  const tactics = riders.map(rider => getUserTacticForRider(rider));

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

  const avgTTT = average(top6.map(rider => rider.stats.teamTimeTrial));
  const avgFlat = average(top6.map(rider => rider.stats.flat));
  const avgStamina = average(top6.map(rider => rider.stats.stamina));
  const avgForm = average(top6.map(rider => rider.form));
  const avgFatigue = average(riders.map(rider => rider.fatigue));
  const cohesionBonus = clamp(9 - standardDeviation(top6.map(rider => rider.stats.teamTimeTrial)), 0, 9);
  const riskPenalty = Math.random() < tactic.risk ? randomBetween(2, 9) : 0;

  return (
    avgTTT * 0.50 +
    avgFlat * 0.18 +
    avgStamina * 0.15 +
    avgForm * 0.10 +
    cohesionBonus +
    tactic.bonus -
    avgFatigue * 0.18 -
    riskPenalty +
    randomBetween(-2, 2)
  );
}

function getBaseStageTime(stage) {
  const speedByType = {
    flat: 44,
    hilly: 40,
    time_trial: 50,
    team_time_trial: 52,
    mountain: 34,
    cobbles_hills: 38
  };

  return (stage.distance / (speedByType[stage.type] || 40)) * 3600;
}

function convertPerformanceToTime(performance, baseStageTime, stage) {
  const separationByType = {
    flat: 3.0,
    hilly: 6.2,
    time_trial: 5.5,
    team_time_trial: 4.7,
    mountain: 9.0,
    cobbles_hills: 8.2
  };

  const delta = (82 - clamp(performance, 35, 112)) * (separationByType[stage.type] || 5);

  return baseStageTime + delta + stage.difficulty * 0.18 + randomBetween(-7, 7);
}

function getFatiguePenalty(rider, stage) {
  const factor = {
    flat: 0.12,
    hilly: 0.24,
    time_trial: 0.18,
    team_time_trial: 0.16,
    mountain: 0.34,
    cobbles_hills: 0.30
  }[stage.type] || 0.2;

  return rider.fatigue * factor;
}

function calculateLongRacePenalty(rider, stage) {
  const raceDays = rider.raceDays || 0;

  if (raceDays < 8) return 0;

  const recoveryWeakness = clamp(85 - rider.stats.recovery, 0, 30);

  const stageStress = {
    flat: 0.10,
    hilly: 0.22,
    time_trial: 0.18,
    team_time_trial: 0.14,
    mountain: 0.32,
    cobbles_hills: 0.30
  }[stage.type] || 0.2;

  return recoveryWeakness * stageStress * ((raceDays - 7) / 8);
}

function calculateFatigueGain(rider, stage, tactic, performance) {
  const baseFatigue = {
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

  const recoveryReduction = rider.stats.recovery / 65;
  const staminaReduction = rider.stats.stamina / 90;
  const performanceStress = performance > 86 ? 1.15 : 1.0;
  const raceDayStress = Math.max(0, (rider.raceDays || 0) - 10) * 0.12;

  return clamp(
    (baseFatigue + stage.difficulty / 20 + profileStress + raceDayStress) *
      tactic.fatigueMultiplier *
      performanceStress -
      recoveryReduction -
      staminaReduction,
    1,
    36
  );
}

function calculateDailyRecovery(rider, stage) {
  const mod = {
    flat: 1.05,
    hilly: 0.80,
    time_trial: 0.90,
    team_time_trial: 0.92,
    mountain: 0.62,
    cobbles_hills: 0.58
  }[stage.type] || 0.8;

  return clamp(
    (rider.stats.recovery * 0.085 + rider.stats.stamina * 0.025 + (rider.fatigue > 60 ? 0.8 : 0)) * mod,
    2,
    10
  );
}

function calculateEnergyAfter(rider, stage, tactic, performance, incident) {
  const baseCost = {
    flat: 18,
    hilly: 28,
    time_trial: 26,
    team_time_trial: 24,
    mountain: 38,
    cobbles_hills: 36
  }[stage.type] || 25;

  const cost =
    (baseCost + stage.difficulty * 0.10) * tactic.fatigueMultiplier +
    (incident?.fatigue || 0) -
    rider.stats.stamina * 0.08;

  return clamp(100 - rider.fatigue * 0.35 - cost, 0, 100);
}

function calculateIncident(rider, stage, tactic, isTTT = false) {
  const surfaceRisk = stage.profile.roadSurface === "pavé" ? 0.055 : 0.010;
  const rainRisk = stage.profile.rainRisk / 1000;
  const descentRisk = stage.profile.technicalDescent / 1600;
  const tacticRisk = tactic.risk * 0.035;
  const protection =
    (rider.stats.positioning + rider.stats.downhill + rider.stats.injuryResistance) / 6000;

  const risk = clamp(
    surfaceRisk + rainRisk + descentRisk + tacticRisk - protection + (isTTT ? -0.01 : 0),
    0.005,
    0.16
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
      fatigue: 2.0,
      description: "Avería mecánica"
    };
  }

  if (roll < 0.96) {
    return {
      type: "Caída leve",
      timeLoss: randomBetween(45, 180),
      fatigue: 5.0,
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
  const bonuses = stage.profile.finishBonuses || [];

  if (!bonuses.length || ["time_trial", "team_time_trial"].includes(stage.type)) return;

  bonuses.forEach((bonus, index) => {
    if (!results[index]) return;

    results[index].stageTime = Math.max(0, results[index].stageTime - bonus);
    results[index].bonusSeconds = bonus;
  });
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
  const scale = CLASSIFICATION_RULES.pointsByStageType[stage.type] || [];

  scale.forEach((points, index) => {
    const rider = getRider(results[index]?.riderId);
    if (rider) rider.points += points;
  });

  const sprintScale = CLASSIFICATION_RULES.intermediateSprintPoints;

  const sprintRanking = [...results].sort((a, b) => {
    const ra = getRider(a.riderId);
    const rb = getRider(b.riderId);

    return (
      rb.stats.sprint + rb.stats.flat * 0.25 + (b.inBreakaway ? 10 : 0) -
      (ra.stats.sprint + ra.stats.flat * 0.25 + (a.inBreakaway ? 10 : 0))
    );
  });

  (stage.profile.intermediateSprints || []).forEach(() => {
    sprintScale.forEach((points, index) => {
      const rider = getRider(sprintRanking[index]?.riderId);
      if (rider) rider.points += points;
    });
  });
}

function updateMountainClassification(stage, results, breakawayInfo) {
  (stage.profile.climbs || []).forEach(climbItem => {
    const scale = CLASSIFICATION_RULES.mountainPoints[String(climbItem.category)] || [];

    const ranking = [...results].sort((a, b) => {
      const ra = getRider(a.riderId);
      const rb = getRider(b.riderId);

      return (
        rb.stats.mountain +
        rb.stats.hills * 0.35 +
        (breakawayInfo.riderIds.includes(rb.id) ? 7 : 0) +
        randomBetween(0, 6) -
        (ra.stats.mountain +
          ra.stats.hills * 0.35 +
          (breakawayInfo.riderIds.includes(ra.id) ? 7 : 0) +
          randomBetween(0, 6))
      );
    });

    scale.forEach((points, index) => {
      const rider = getRider(ranking[index]?.riderId);
      if (rider) rider.mountainPoints += points;
    });
  });
}

function updateUciStagePoints(stage, results) {
  const scale = CLASSIFICATION_RULES.uci.grandTourStage;

  scale.forEach((points, index) => {
    const rider = getRider(results[index]?.riderId);
    if (rider) rider.uciPoints += points;
  });
}

function assignLeaderOfRaceUciPoint() {
  const leader = getGCLeader();

  if (leader) {
    leader.uciPoints += CLASSIFICATION_RULES.uci.stageLeaderPerDay;
  }
}

function assignFinalUciPoints() {
  if (Game.finalUciAssigned) return;

  const gcScale = CLASSIFICATION_RULES.uci.grandTourFinalGC;

  getGCStandings().forEach((rider, index) => {
    if (gcScale[index]) rider.uciPoints += gcScale[index];
  });

  [
    getPointsStandings()[0],
    getMountainStandings()[0],
    getYouthStandings()[0]
  ].forEach(winner => {
    if (winner) winner.uciPoints += CLASSIFICATION_RULES.uci.secondaryFinal[0];
  });

  Game.finalUciAssigned = true;
}

function chooseAITactic(rider, stage) {
  const team = getTeam(rider.teamId);

  if (rider.fatigue > 65) return getTactic("conservative");

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
   RESULTADOS
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
        <button class="danger" onclick="initGame()">Reiniciar</button>
      </div>
    </div>

    ${renderLeaderCards()}

    <div class="panel" style="margin-top:16px;">
      <h2>Fuga / narrativa</h2>
      <p class="help">${escapeHtml(breakawayInfo.narrative)}</p>
      ${renderIncidentSummary(results)}
    </div>

    <div class="result-layout" style="margin-top:16px;">
      <section class="panel">
        <h2>Clasificación de etapa</h2>
        ${renderStageResultsTable(results, leaderTime)}
      </section>

      <section class="panel">
        <h2>Clasificación general</h2>
        ${renderGeneralClassificationTable(25)}
        <hr />
        ${renderMiniClassifications()}
      </section>
    </div>

    <div class="panel" style="margin-top:16px;">
      <h2>Lectura rápida</h2>
      ${renderStageAnalysis(stage, results)}

      <div class="simulation-actions">
        <button class="secondary" onclick="renderRaceScreen()">Ver equipo y estrategia</button>
        <button onclick="goToNextStage()">
          ${Game.currentStageIndex >= getStages().length - 1 ? "Ver clasificación final" : "Siguiente etapa"}
        </button>
      </div>
    </div>
  `;
}

function renderIncidentSummary(results) {
  const incidents = results.filter(result => result.incident).slice(0, 8);

  if (!incidents.length) {
    return `<p class="muted small">Sin incidentes importantes.</p>`;
  }

  return `
    <div class="incident-list">
      ${incidents.map(result => `
        <span class="incident-chip">
          ${escapeHtml(result.riderName)}: ${escapeHtml(result.incident.type)}
          ${result.incident.timeLoss ? `(+${Math.round(result.incident.timeLoss)}s)` : ""}
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
          <th>Estrategia</th>
          <th>Bonus</th>
          <th>UCI</th>
          <th>Incidente</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(result => {
          const uci = CLASSIFICATION_RULES.uci.grandTourStage[result.position - 1] || 0;

          return `
            <tr class="${result.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${result.position}</td>
              <td>${escapeHtml(result.riderName)}${result.inBreakaway ? " ⚡" : ""}</td>
              <td>${escapeHtml(result.teamName)}</td>
              <td>${secondsToTime(result.stageTime)}</td>
              <td>${gapToLeader(result.stageTime, leaderTime)}</td>
              <td>${escapeHtml(result.tacticName)}</td>
              <td>${result.bonusSeconds ? `-${result.bonusSeconds}s` : "—"}</td>
              <td>${uci}</td>
              <td>${result.incident ? escapeHtml(result.incident.type) : "—"}</td>
            </tr>
          `;
        }).join("")}
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
          <th>Fatiga</th>
          <th>Pts</th>
          <th>Mont.</th>
          <th>UCI</th>
        </tr>
      </thead>
      <tbody>
        ${standings.map((rider, index) => `
          <tr class="${rider.teamId === Game.selectedTeamId ? "user-team" : ""} ${index === 0 ? `race-leader ${race.leaderJerseyClass}` : ""}">
            <td>${index + 1}</td>
            <td>${escapeHtml(rider.name)}</td>
            <td>${escapeHtml(getTeam(rider.teamId).name)}</td>
            <td>${secondsToTime(rider.totalTime)}</td>
            <td>${gapToLeader(rider.totalTime, leaderTime)}</td>
            <td>${Math.round(rider.fatigue)}</td>
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

function renderStageAnalysis(stage, results) {
  const userResults = results.filter(result => result.teamId === Game.selectedTeamId);
  const bestUser = [...userResults].sort((a, b) => a.stageTime - b.stageTime)[0];
  const winner = results[0];
  const standings = getGCStandings();
  const bestUserGC = standings.find(rider => rider.teamId === Game.selectedTeamId);
  const pos = standings.findIndex(rider => rider.id === bestUserGC?.id) + 1;

  return `
    <div class="grid three">
      <div class="stage-card">
        <span class="muted">Ganador</span>
        <div class="big-number">#1</div>
        <strong>${escapeHtml(winner.riderName)}</strong>
        <p class="muted small">${escapeHtml(winner.teamName)}</p>
      </div>

      <div class="stage-card">
        <span class="muted">Mejor de tu equipo</span>
        <div class="big-number">${bestUser.position}</div>
        <strong>${escapeHtml(bestUser.riderName)}</strong>
      </div>

      <div class="stage-card">
        <span class="muted">Tu mejor GC</span>
        <div class="big-number">${pos}</div>
        <strong>${bestUserGC ? escapeHtml(bestUserGC.name) : "—"}</strong>
      </div>
    </div>

    <p class="help">${getStageComment(stage)}</p>
  `;
}

function getStageComment(stage) {
  if (stage.type === "mountain") {
    return "La montaña reparte puntos de puertos y suele mover la general. Proteger líder es muy valioso.";
  }

  if (stage.type === "hilly") {
    return "Media montaña: buen terreno para fugas, puncheurs y bonificaciones.";
  }

  if (stage.type === "flat") {
    return "Etapa llana: puntos verdes, sprint intermedio y tren de sprint son claves.";
  }

  if (stage.type === "cobbles_hills") {
    return "Pavés/muros: alta varianza, incidentes y colocación.";
  }

  if (stage.type === "time_trial") {
    return "Crono individual: casi todo depende de timeTrial, forma y fatiga.";
  }

  return "La crono por equipos suma para la general y para la clasificación por equipos.";
}

function goToNextStage() {
  if (Game.currentStageIndex >= getStages().length - 1) {
    Game.finished = true;
    renderFinalScreen();
    return;
  }

  Game.currentStageIndex += 1;
  resetUserRiderTactics("balanced");
  renderRaceScreen();
}

function renderFinalScreen() {
  assignFinalUciPoints();

  const race = getRace();
  const standings = getGCStandings();
  const bestUser = standings.find(rider => rider.teamId === Game.selectedTeamId);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Clasificación final 🏆</h1>
        <p>${escapeHtml(race.name)} completado · ${getStages().length} etapas</p>
      </div>

      <div class="top-actions">
        <button class="secondary" onclick="renderHome()">Elegir otra carrera</button>
        <button onclick="initGame()">Nueva partida</button>
      </div>
    </div>

    ${renderLeaderCards()}

    <div class="grid two" style="margin-top:16px;">
      <section class="panel">
        <h2>Podio final</h2>

        ${standings.slice(0, 3).map((rider, index) => `
          <div class="stage-card ${index === 0 ? race.leaderJerseyClass : ""}">
            <div class="badge-row">
              <span class="badge green">#${index + 1}</span>
              <span class="badge blue">${escapeHtml(getTeam(rider.teamId).name)}</span>
            </div>
            <h3>${escapeHtml(rider.name)}</h3>
            <p class="muted">${secondsToTime(rider.totalTime)} · UCI ${rider.uciPoints}</p>
          </div>
        `).join("")}

        <hr />

        <p class="help">
          Tu mejor corredor:
          <strong>${bestUser ? escapeHtml(bestUser.name) : "—"}</strong>
        </p>
      </section>

      <section class="panel">
        <h2>General completa</h2>
        ${renderGeneralClassificationTable(80)}
      </section>
    </div>

    <section class="panel" style="margin-top:16px;">
      <h2>Historial de etapas</h2>
      ${renderStageHistorySummary()}
    </section>
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
        ${Game.stageHistory.map(item => {
          const winner = item.results[0];

          return `
            <tr class="${winner.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${escapeHtml(item.stage.name)}</td>
              <td>${escapeHtml(item.stage.label)}</td>
              <td>${escapeHtml(winner.riderName)}</td>
              <td>${escapeHtml(winner.teamName)}</td>
              <td>${item.breakawayInfo.success ? "Llegó" : "Neutralizada"}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

initGame();
