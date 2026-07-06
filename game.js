/* ============================================================
   CYCLING MANAGER TOUR - game.js
   Motor jugable con estrategia individual por corredor
   ============================================================ */

const app = document.getElementById("app");

const Game = {
  selectedTeamId: null,
  currentStageIndex: 0,
  defaultTacticId: "balanced",
  riderTactics: {},
  riders: [],
  stageHistory: [],
  lastStageResults: null,
  finished: false
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getTeam(teamId) {
  return TEAMS.find(team => team.id === teamId);
}

function getRider(riderId) {
  return Game.riders.find(rider => rider.id === riderId);
}

function getTeamRiders(teamId) {
  return Game.riders.filter(rider => rider.teamId === teamId);
}

function getCurrentStage() {
  return STAGES[Game.currentStageIndex];
}

function getTactic(tacticId) {
  return TACTICS.find(tactic => tactic.id === tacticId) || TACTICS.find(tactic => tactic.id === "balanced");
}

function getUserTacticForRider(rider) {
  return getTactic(Game.riderTactics[rider.id] || Game.defaultTacticId);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values) {
  if (!values.length) return 0;
  const avg = average(values);
  const variance = average(values.map(value => Math.pow(value - avg, 2)));
  return Math.sqrt(variance);
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
  if (gap <= 0) return "m.t.";
  return `+${secondsToTime(gap)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ============================================================
   INICIO
   ============================================================ */

function initGame() {
  Game.selectedTeamId = null;
  Game.currentStageIndex = 0;
  Game.defaultTacticId = "balanced";
  Game.riderTactics = {};
  Game.riders = deepClone(RIDERS);
  Game.stageHistory = [];
  Game.lastStageResults = null;
  Game.finished = false;
  renderHome();
}

function startWithTeam(teamId) {
  Game.selectedTeamId = teamId;
  Game.currentStageIndex = 0;
  Game.defaultTacticId = "balanced";
  Game.riders = deepClone(RIDERS);
  Game.stageHistory = [];
  Game.lastStageResults = null;
  Game.finished = false;
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

/* ============================================================
   PANTALLAS
   ============================================================ */

function renderHome() {
  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Cycling Manager Tour 🚴‍♂️</h1>
        <p>Equipos reales · corredores reales · ${STAGES.length} etapas · estrategia individual por corredor.</p>
      </div>
    </div>

    <div class="grid two">
      <section class="panel">
        <h2>Recorrido</h2>
        <p class="help">
          Carrera larga tipo Tour. El motor simula perfiles, fatiga acumulada,
          recuperación diaria, cronos, montaña, pavés y media montaña.
        </p>

        <hr />

        <div class="stage-list">
          ${STAGES.map(stage => `
            <div class="stage-card">
              <div class="badge-row">
                <span class="badge green">Etapa ${stage.number}</span>
                <span class="badge blue">${escapeHtml(stage.label)}</span>
                <span class="badge">${stage.distance} km</span>
                <span class="badge orange">Dificultad ${stage.difficulty}</span>
              </div>
              <h3>${escapeHtml(stage.name)}</h3>
              <p class="muted">${escapeHtml(stage.description)}</p>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="panel">
        <h2>Elige equipo</h2>
        <p class="muted">Cada equipo tiene 8 corredores reales y una identidad competitiva diferente.</p>

        <div class="grid">
          ${TEAMS.map(team => renderTeamCard(team)).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderTeamCard(team) {
  const riders = RIDERS.filter(rider => rider.teamId === team.id);
  const leader = riders[0];

  return `
    <div class="team-card">
      <div>
        <div class="badge-row">
          <span class="badge ${team.color}">${escapeHtml(team.archetype)}</span>
          <span class="badge">Líder: ${escapeHtml(leader.name)}</span>
          <span class="badge">${riders.length} corredores</span>
        </div>
        <h3>${escapeHtml(team.name)}</h3>
        <p class="muted">${escapeHtml(team.description)}</p>
      </div>

      <div class="badge-row">
        ${riders.map(rider => `<span class="badge">${escapeHtml(rider.name)}</span>`).join("")}
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

  const stage = getCurrentStage();
  const team = getTeam(Game.selectedTeamId);
  const userRiders = getTeamRiders(Game.selectedTeamId);

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>${escapeHtml(team.name)}</h1>
        <p>Etapa ${Game.currentStageIndex + 1}/${STAGES.length} · ${escapeHtml(stage.name)}</p>
      </div>

      <div class="top-actions">
        <button class="secondary" onclick="renderHome()">Cambiar equipo</button>
        <button class="danger" onclick="initGame()">Reiniciar</button>
      </div>
    </div>

    <div class="grid two">
      <section class="panel">
        ${renderCurrentStage(stage)}
        ${renderTacticPresets()}
        ${renderIndividualTactics(userRiders)}

        <div class="simulation-actions">
          <div>
            <strong>Modo:</strong> estrategia individual por corredor
            <div class="muted small">
              Cada corredor puede proteger, conservar, atacar, hacer tren de sprint o ir a todo o nada.
            </div>
          </div>
          <button onclick="simulateCurrentStage()">Simular etapa</button>
        </div>
      </section>

      <section class="panel">
        <h2>Clasificación general</h2>
        ${renderGeneralClassificationTable(20)}
      </section>
    </div>

    <div class="grid two" style="margin-top: 16px;">
      <section class="panel">
        <h2>Tu equipo</h2>
        <div class="rider-grid">
          ${userRiders.map(rider => renderRiderCard(rider)).join("")}
        </div>
      </section>

      <section class="panel">
        <h2>Etapas</h2>
        ${renderStageProgress()}
      </section>
    </div>
  `;
}

function renderCurrentStage(stage) {
  return `
    <div class="stage-card current">
      <div class="badge-row">
        <span class="badge green">Etapa ${stage.number}/${STAGES.length}</span>
        <span class="badge blue">${escapeHtml(stage.label)}</span>
        <span class="badge">${stage.distance} km</span>
        <span class="badge orange">Dificultad ${stage.difficulty}/100</span>
      </div>
      <h2>${escapeHtml(stage.name)}</h2>
      <p class="help">${escapeHtml(stage.description)}</p>
      <p class="muted small">
        Clave: fatiga acumulada - recuperación diaria. Los corredores con alta recuperación sobreviven mejor a tres semanas.
      </p>
    </div>
  `;
}

function renderTacticPresets() {
  return `
    <h2>Presets rápidos</h2>
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
      ${riders.map(rider => renderRiderStrategyCard(rider)).join("")}
    </div>
  `;
}

function renderRiderStrategyCard(rider) {
  const currentTacticId = Game.riderTactics[rider.id] || "balanced";
  const currentTactic = getTactic(currentTacticId);

  return `
    <div class="strategy-card">
      <div>
        <div class="badge-row">
          <span class="badge green">${escapeHtml(rider.role)}</span>
          <span class="badge blue">Forma ${Math.round(rider.form)}</span>
          <span class="badge orange">Fatiga ${Math.round(rider.fatigue)}</span>
        </div>

        <h3>${escapeHtml(rider.name)}</h3>
        <p class="muted small">${escapeHtml(currentTactic.description)}</p>
      </div>

      <select onchange="setRiderTactic('${rider.id}', this.value)">
        ${TACTICS.map(tactic => `
          <option value="${tactic.id}" ${currentTacticId === tactic.id ? "selected" : ""}>
            ${tactic.name}
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
    ["recovery", "Recovery"]
  ];

  return `
    <div class="rider-card">
      <div class="badge-row">
        <span class="badge green">${escapeHtml(rider.role)}</span>
        <span class="badge orange">Fatiga ${Math.round(rider.fatigue)}</span>
        <span class="badge blue">Forma ${Math.round(rider.form)}</span>
        <span class="badge">Días ${rider.raceDays || 0}</span>
      </div>

      <h4>${escapeHtml(rider.name)}</h4>

      ${relevantStats.map(([key, label]) => `
        <div class="stat-row">
          <span>${label}</span>
          <div class="stat-bar">
            <div class="stat-fill" style="width: ${clamp(rider.stats[key], 0, 100)}%"></div>
          </div>
          <span>${rider.stats[key]}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderStageProgress() {
  return `
    <div class="stage-list">
      ${STAGES.map((stage, index) => {
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
            <div class="muted small">${stage.distance} km · Dificultad ${stage.difficulty}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

/* ============================================================
   MOTOR DE SIMULACIÓN
   ============================================================ */

function simulateCurrentStage() {
  const stage = getCurrentStage();
  let results;

  if (stage.type === "team_time_trial") {
    results = simulateTeamTimeTrial(stage);
  } else {
    results = simulateRoadStage(stage);
  }

  results.sort((a, b) => a.stageTime - b.stageTime);

  results.forEach((result, index) => {
    result.position = index + 1;

    const rider = getRider(result.riderId);

    rider.totalTime += result.stageTime;
    rider.raceDays = (rider.raceDays || 0) + 1;

    const recoveryGain = calculateDailyRecovery(rider, stage);

    rider.fatigueBeforeRecovery = rider.fatigue + result.fatigueGain;
    rider.recoveredToday = recoveryGain;
    rider.fatigue = clamp(rider.fatigue + result.fatigueGain - recoveryGain, 0, 100);
  });

  Game.lastStageResults = {
    stage,
    results
  };

  Game.stageHistory.push(Game.lastStageResults);

  renderStageResultScreen();
}

function simulateRoadStage(stage) {
  const baseStageTime = getBaseStageTime(stage);

  return Game.riders.map(rider => {
    const tactic = rider.teamId === Game.selectedTeamId
      ? getUserTacticForRider(rider)
      : chooseAITactic(rider, stage);

    const performance = calculatePerformance(rider, stage, tactic);
    const stageTime = convertPerformanceToTime(performance, baseStageTime, stage);
    const fatigueGain = calculateFatigueGain(rider, stage, tactic, performance);

    return {
      riderId: rider.id,
      riderName: rider.name,
      teamId: rider.teamId,
      teamName: getTeam(rider.teamId).name,
      stageTime,
      performance,
      tacticName: tactic.name,
      fatigueGain
    };
  });
}

function simulateTeamTimeTrial(stage) {
  const baseStageTime = getBaseStageTime(stage);
  const teamResults = [];

  TEAMS.forEach(team => {
    const riders = getTeamRiders(team.id);

    const teamTactic = team.id === Game.selectedTeamId
      ? buildUserTeamTacticAggregate(riders)
      : chooseAITeamTactic(team, stage);

    const teamScore = calculateTeamTimeTrialScore(riders, teamTactic);
    const teamTime = convertPerformanceToTime(teamScore, baseStageTime, stage);

    riders.forEach((rider, index) => {
      const individualTactic = team.id === Game.selectedTeamId
        ? getUserTacticForRider(rider)
        : teamTactic;

      const internalGap =
        index < 5 ? randomBetween(0, 5) :
        index < 7 ? randomBetween(5, 18) :
        randomBetween(15, 35);

      const performance = teamScore + randomBetween(-1.5, 1.5);
      const fatigueGain = calculateFatigueGain(rider, stage, individualTactic, performance);

      teamResults.push({
        riderId: rider.id,
        riderName: rider.name,
        teamId: rider.teamId,
        teamName: team.name,
        stageTime: teamTime + internalGap,
        performance,
        tacticName: individualTactic.name,
        fatigueGain
      });
    });
  });

  return teamResults;
}

function buildUserTeamTacticAggregate(riders) {
  const tactics = riders.map(rider => getUserTacticForRider(rider));

  return {
    id: "mixed",
    name: "Mixta",
    description: "Media de las estrategias individuales del equipo.",
    bonus: average(tactics.map(t => t.bonus)),
    risk: average(tactics.map(t => t.risk)),
    fatigueMultiplier: average(tactics.map(t => t.fatigueMultiplier)),
    supportBonus: average(tactics.map(t => t.supportBonus || 0)),
    sprintTrainBonus: average(tactics.map(t => t.sprintTrainBonus || 0))
  };
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

  const speed = speedByType[stage.type] || 40;
  return (stage.distance / speed) * 3600;
}

function calculatePerformance(rider, stage, tactic) {
  const s = rider.stats;
  let terrainScore = 0;

  if (stage.type === "flat") {
    terrainScore =
      s.flat * 0.42 +
      s.sprint * 0.22 +
      s.stamina * 0.15 +
      rider.form * 0.10 +
      s.acceleration * 0.06 +
      s.recovery * 0.05;
  }

  if (stage.type === "hilly") {
    terrainScore =
      s.hills * 0.40 +
      s.acceleration * 0.20 +
      s.stamina * 0.15 +
      s.mountain * 0.10 +
      rider.form * 0.10 +
      s.recovery * 0.05;
  }

  if (stage.type === "time_trial") {
    terrainScore =
      s.timeTrial * 0.55 +
      s.flat * 0.15 +
      s.stamina * 0.15 +
      rider.form * 0.10 +
      s.recovery * 0.05;
  }

  if (stage.type === "mountain") {
    terrainScore =
      s.mountain * 0.55 +
      s.stamina * 0.20 +
      s.recovery * 0.10 +
      rider.form * 0.10 +
      s.acceleration * 0.05;
  }

  if (stage.type === "cobbles_hills") {
    terrainScore =
      s.cobbles * 0.35 +
      s.hills * 0.25 +
      s.acceleration * 0.15 +
      s.stamina * 0.15 +
      rider.form * 0.05 +
      s.flat * 0.05;
  }

  const fatiguePenalty = getFatiguePenalty(rider, stage);
  const tacticalBonus = tactic.bonus;
  const randomNoise = randomBetween(-4, 4);
  const riskPenalty = calculateRiskPenalty(tactic, rider, stage);
  const longRacePenalty = calculateLongRacePenalty(rider, stage);
  const supportBonus = rider.teamId === Game.selectedTeamId
    ? calculateUserSupportBonus(rider, stage)
    : 0;

  return terrainScore + tacticalBonus + supportBonus + randomNoise - fatiguePenalty - riskPenalty - longRacePenalty;
}

function calculateUserSupportBonus(rider, stage) {
  const teamRiders = getTeamRiders(Game.selectedTeamId);
  const mates = teamRiders.filter(mate => mate.id !== rider.id);

  const protectLeaderPool = mates.reduce((sum, mate) => {
    const tactic = getUserTacticForRider(mate);
    return sum + (tactic.supportBonus || 0);
  }, 0);

  const sprintTrainPool = mates.reduce((sum, mate) => {
    const tactic = getUserTacticForRider(mate);
    return sum + (tactic.sprintTrainBonus || 0);
  }, 0);

  let bonus = 0;

  const isGC =
    rider.roleKey === "gc" ||
    rider.roleKey === "co_leader" ||
    rider.role.includes("Líder");

  const isSprinter = rider.roleKey === "sprinter";

  if (isGC) {
    const stageFactor = {
      flat: 0.35,
      hilly: 0.75,
      time_trial: 0.15,
      team_time_trial: 0.35,
      mountain: 0.95,
      cobbles_hills: 0.75
    }[stage.type] || 0.5;

    bonus += protectLeaderPool * stageFactor;
  }

  if (isSprinter && stage.type === "flat") {
    bonus += sprintTrainPool * 0.90;
  }

  if (isSprinter && stage.type === "cobbles_hills") {
    bonus += sprintTrainPool * 0.35;
  }

  return clamp(bonus, 0, 8);
}

function calculateTeamTimeTrialScore(riders, tactic) {
  const ranked = [...riders].sort((a, b) => b.stats.teamTimeTrial - a.stats.teamTimeTrial);
  const top6 = ranked.slice(0, 6);

  const avgTTT = average(top6.map(r => r.stats.teamTimeTrial));
  const avgFlat = average(top6.map(r => r.stats.flat));
  const avgStamina = average(top6.map(r => r.stats.stamina));
  const avgForm = average(top6.map(r => r.form));
  const avgFatigue = average(riders.map(r => r.fatigue));

  const spread = standardDeviation(top6.map(r => r.stats.teamTimeTrial));
  const cohesionBonus = clamp(9 - spread, 0, 9);

  const riskPenalty = Math.random() < tactic.risk
    ? randomBetween(2, 9)
    : 0;

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

function getFatiguePenalty(rider, stage) {
  const fatigueFactorByType = {
    flat: 0.12,
    hilly: 0.24,
    time_trial: 0.18,
    team_time_trial: 0.16,
    mountain: 0.34,
    cobbles_hills: 0.30
  };

  return rider.fatigue * (fatigueFactorByType[stage.type] || 0.2);
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

function calculateRiskPenalty(tactic, rider, stage) {
  const technicalProtection =
    rider.stats.stamina * 0.35 +
    rider.stats.recovery * 0.25 +
    rider.form * 0.20 +
    rider.stats.acceleration * 0.20;

  const stageChaos = {
    flat: 0.8,
    hilly: 1.0,
    time_trial: 0.4,
    team_time_trial: 0.6,
    mountain: 1.1,
    cobbles_hills: 1.45
  }[stage.type] || 1.0;

  const adjustedRisk = tactic.risk * stageChaos * (1.05 - technicalProtection / 200);

  if (Math.random() < adjustedRisk) {
    return randomBetween(3, 12) * stageChaos;
  }

  return 0;
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

  const separation = separationByType[stage.type] || 5;
  const normalized = clamp(performance, 35, 110);

  const delta = (82 - normalized) * separation;
  const difficultyEffect = stage.difficulty * 0.18;

  return baseStageTime + delta + difficultyEffect + randomBetween(-7, 7);
}

function calculateFatigueGain(rider, stage, tactic, performance) {
  const baseFatigueByType = {
    flat: 4,
    hilly: 8,
    time_trial: 5,
    team_time_trial: 5,
    mountain: 11,
    cobbles_hills: 12
  };

  const base = baseFatigueByType[stage.type] || 6;
  const difficulty = stage.difficulty / 20;
  const recoveryReduction = rider.stats.recovery / 65;
  const staminaReduction = rider.stats.stamina / 90;
  const performanceStress = performance > 86 ? 1.15 : 1.0;
  const raceDayStress = Math.max(0, (rider.raceDays || 0) - 10) * 0.12;

  return clamp(
    (base + difficulty + raceDayStress) * tactic.fatigueMultiplier * performanceStress - recoveryReduction - staminaReduction,
    1,
    34
  );
}

function calculateDailyRecovery(rider, stage) {
  const stageRecoveryModifier = {
    flat: 1.05,
    hilly: 0.80,
    time_trial: 0.90,
    team_time_trial: 0.92,
    mountain: 0.62,
    cobbles_hills: 0.58
  }[stage.type] || 0.8;

  const baseRecovery =
    rider.stats.recovery * 0.085 +
    rider.stats.stamina * 0.025;

  const fatigueAssist = rider.fatigue > 60 ? 0.8 : 0;

  return clamp((baseRecovery + fatigueAssist) * stageRecoveryModifier, 2, 10);
}

function chooseAITactic(rider, stage) {
  const team = getTeam(rider.teamId);

  if (rider.fatigue > 65) {
    return getTactic("conservative");
  }

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

  if (Math.random() < 0.06) {
    return getTactic("all_in");
  }

  return getTactic("balanced");
}

function chooseAITeamTactic(team, stage) {
  if (team.archetype.includes("Crono")) {
    return getTactic("aggressive");
  }

  if (team.archetype.includes("GC")) {
    return getTactic("balanced");
  }

  if (Math.random() < 0.12) {
    return getTactic("aggressive");
  }

  return getTactic("balanced");
}

/* ============================================================
   RESULTADOS
   ============================================================ */

function renderStageResultScreen() {
  const { stage, results } = Game.lastStageResults;
  const leaderTime = results[0].stageTime;

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Resultado · ${escapeHtml(stage.name)}</h1>
        <p>Etapa ${stage.number}/${STAGES.length} · ${escapeHtml(stage.label)} · ${stage.distance} km</p>
      </div>
      <div class="top-actions">
        <button class="danger" onclick="initGame()">Reiniciar</button>
      </div>
    </div>

    <div class="result-layout">
      <section class="panel">
        <h2>Clasificación de etapa</h2>
        ${renderStageResultsTable(results, leaderTime)}
      </section>

      <section class="panel">
        <h2>Clasificación general</h2>
        ${renderGeneralClassificationTable(25)}
      </section>
    </div>

    <div class="panel" style="margin-top: 16px;">
      <h2>Lectura rápida de la etapa</h2>
      ${renderStageAnalysis(stage, results)}

      <div class="simulation-actions">
        <button class="secondary" onclick="renderRaceScreen()">Ver equipo y general</button>
        <button onclick="goToNextStage()">
          ${Game.currentStageIndex >= STAGES.length - 1 ? "Ver clasificación final" : "Siguiente etapa"}
        </button>
      </div>
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
          <th>Diferencia</th>
          <th>Estrategia</th>
          <th>Fatiga</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(result => {
          const rider = getRider(result.riderId);

          return `
            <tr class="${result.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${result.position}</td>
              <td>${escapeHtml(result.riderName)}</td>
              <td>${escapeHtml(result.teamName)}</td>
              <td>${secondsToTime(result.stageTime)}</td>
              <td>${gapToLeader(result.stageTime, leaderTime)}</td>
              <td>${escapeHtml(result.tacticName)}</td>
              <td>+${Math.round(result.fatigueGain)} / rec ${Math.round(rider.recoveredToday || 0)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderGeneralClassificationTable(limit = 25) {
  const standings = [...Game.riders]
    .sort((a, b) => a.totalTime - b.totalTime)
    .slice(0, limit);

  const leader = standings[0];
  const leaderTime = leader ? leader.totalTime : 0;

  if (Game.stageHistory.length === 0) {
    return `
      <p class="muted">Todavía no se ha disputado ninguna etapa.</p>
      <table>
        <thead>
          <tr>
            <th>Corredor</th>
            <th>Equipo</th>
            <th>Perfil</th>
          </tr>
        </thead>
        <tbody>
          ${Game.riders.slice(0, limit).map(rider => `
            <tr class="${rider.teamId === Game.selectedTeamId ? "user-team" : ""}">
              <td>${escapeHtml(rider.name)}</td>
              <td>${escapeHtml(getTeam(rider.teamId).name)}</td>
              <td>${escapeHtml(rider.role)}</td>
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
          <th>Diferencia</th>
          <th>Fatiga</th>
        </tr>
      </thead>
      <tbody>
        ${standings.map((rider, index) => `
          <tr class="${rider.teamId === Game.selectedTeamId ? "user-team" : ""}">
            <td>${index + 1}</td>
            <td>${escapeHtml(rider.name)}</td>
            <td>${escapeHtml(getTeam(rider.teamId).name)}</td>
            <td>${secondsToTime(rider.totalTime)}</td>
            <td>${gapToLeader(rider.totalTime, leaderTime)}</td>
            <td>${Math.round(rider.fatigue)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderStageAnalysis(stage, results) {
  const userResults = results.filter(result => result.teamId === Game.selectedTeamId);
  const bestUser = [...userResults].sort((a, b) => a.stageTime - b.stageTime)[0];
  const winner = results[0];
  const userTeamBestGap = Math.round(bestUser.stageTime - winner.stageTime);

  const standings = [...Game.riders].sort((a, b) => a.totalTime - b.totalTime);
  const bestUserGC = standings.find(rider => rider.teamId === Game.selectedTeamId);
  const bestUserGCPosition = standings.findIndex(rider => rider.id === bestUserGC.id) + 1;

  const avgUserFatigue = average(getTeamRiders(Game.selectedTeamId).map(r => r.fatigue));

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
        <p class="muted small">
          ${userTeamBestGap <= 0 ? "Ganó la etapa" : `A ${secondsToTime(userTeamBestGap)} del ganador`}
        </p>
      </div>

      <div class="stage-card">
        <span class="muted">Tu mejor GC</span>
        <div class="big-number">${bestUserGCPosition}</div>
        <strong>${escapeHtml(bestUserGC.name)}</strong>
        <p class="muted small">
          Fatiga líder: ${Math.round(bestUserGC.fatigue)} · Fatiga media equipo: ${Math.round(avgUserFatigue)}
        </p>
      </div>
    </div>

    <p class="help">
      ${getStageComment(stage, bestUser, winner)}
    </p>
  `;
}

function getStageComment(stage, bestUser, winner) {
  if (bestUser.riderId === winner.riderId) {
    return "Excelente. Tu equipo ha ganado la etapa. La estrategia individual ha funcionado muy bien.";
  }

  const gap = bestUser.stageTime - winner.stageTime;

  if (gap < 20) {
    return "Muy buen rendimiento. Tu mejor corredor ha estado cerca de la victoria. La general sigue abierta.";
  }

  if (stage.type === "mountain") {
    return "La montaña ha generado diferencias relevantes. Usa 'Proteger líder' con gregarios fuertes si tu GC está bien colocado.";
  }

  if (stage.type === "hilly") {
    return "La media montaña premia aceleración, hills y stamina. Buen terreno para puncheurs y corredores en modo Atacar.";
  }

  if (stage.type === "cobbles_hills") {
    return "El pavés y los muros castigan colocación, resistencia y explosividad. Evita Todo o nada con corredores fatigados.";
  }

  if (stage.type === "team_time_trial") {
    return "La crono por equipos depende del bloque. Si muchos corredores van a conservar, perderás rendimiento colectivo pero ahorrarás fatiga.";
  }

  if (stage.type === "time_trial") {
    return "La crono individual favorece a especialistas. Aquí Proteger líder sirve poco; mejor conservar o atacar según situación.";
  }

  return "Resultado correcto. Ajusta estrategias individuales para recuperar tiempo o proteger posiciones.";
}

function goToNextStage() {
  if (Game.currentStageIndex >= STAGES.length - 1) {
    Game.finished = true;
    renderFinalScreen();
    return;
  }

  Game.currentStageIndex += 1;

  // En cada etapa vuelves a partir de Equilibrado para decidir de nuevo.
  resetUserRiderTactics("balanced");

  renderRaceScreen();
}

function renderFinalScreen() {
  const standings = [...Game.riders].sort((a, b) => a.totalTime - b.totalTime);
  const winner = standings[0];
  const bestUser = standings.find(rider => rider.teamId === Game.selectedTeamId);
  const bestUserPosition = standings.findIndex(rider => rider.id === bestUser.id) + 1;
  const leaderTime = winner.totalTime;

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Clasificación final 🏆</h1>
        <p>Gran vuelta completada: ${STAGES.length} etapas disputadas.</p>
      </div>

      <div class="top-actions">
        <button class="secondary" onclick="renderHome()">Elegir otro equipo</button>
        <button onclick="initGame()">Nueva partida</button>
      </div>
    </div>

    <div class="grid two">
      <section class="panel">
        <h2>Podio final</h2>

        <div class="grid">
          ${standings.slice(0, 3).map((rider, index) => `
            <div class="stage-card ${rider.teamId === Game.selectedTeamId ? "current" : ""}">
              <div class="badge-row">
                <span class="badge green">#${index + 1}</span>
                <span class="badge blue">${escapeHtml(getTeam(rider.teamId).name)}</span>
              </div>
              <h3>${escapeHtml(rider.name)}</h3>
              <p class="muted">
                Tiempo: ${secondsToTime(rider.totalTime)} · Diferencia: ${gapToLeader(rider.totalTime, leaderTime)}
              </p>
            </div>
          `).join("")}
        </div>

        <hr />

        <h2>Resultado de tu equipo</h2>
        <p class="help">
          Tu mejor corredor ha sido <strong>${escapeHtml(bestUser.name)}</strong>, posición
          <strong>${bestUserPosition}</strong> en la general final, a
          <strong>${gapToLeader(bestUser.totalTime, leaderTime)}</strong> del líder.
        </p>
      </section>

      <section class="panel">
        <h2>General completa</h2>
        ${renderGeneralClassificationTable(80)}
      </section>
    </div>

    <section class="panel" style="margin-top: 16px;">
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
          <th>Tiempo</th>
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
              <td>${secondsToTime(winner.stageTime)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

initGame();
