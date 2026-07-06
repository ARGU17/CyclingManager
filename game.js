/* ============================================================
   CYCLING MANAGER MVP - game.js
   Motor jugable completo en un único archivo
   ============================================================ */

const app = document.getElementById("app");

const Game = {
  selectedTeamId: null,
  currentStageIndex: 0,
  selectedTacticId: "balanced",
  riders: [],
  stageHistory: [],
  lastStageResults: null,
  finished: false
};

// ============================================================
// UTILIDADES
// ============================================================

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

function getSelectedTactic() {
  return TACTICS.find(tactic => tactic.id === Game.selectedTacticId);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
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

// ============================================================
// INICIALIZACIÓN
// ============================================================

function initGame() {
  Game.selectedTeamId = null;
  Game.currentStageIndex = 0;
  Game.selectedTacticId = "balanced";
  Game.riders = deepClone(RIDERS);
  Game.stageHistory = [];
  Game.lastStageResults = null;
  Game.finished = false;
  renderHome();
}

function startWithTeam(teamId) {
  Game.selectedTeamId = teamId;
  Game.currentStageIndex = 0;
  Game.selectedTacticId = "balanced";
  Game.riders = deepClone(RIDERS);
  Game.stageHistory = [];
  Game.lastStageResults = null;
  Game.finished = false;
  renderRaceScreen();
}

// ============================================================
// RENDER PRINCIPAL
// ============================================================

function renderHome() {
  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Cycling Manager MVP 🚴‍♂️</h1>
        <p>Mini-vuelta de 5 etapas: llana, crono, crono por equipos, alta montaña y pavés con muros.</p>
      </div>
    </div>

    <div class="grid two">
      <section class="panel">
        <h2>Objetivo de esta versión</h2>
        <p class="help">
          Esta es una versión mínima jugable. No hay calendario, mercado, contratos ni temporada.
          El núcleo es comprobar si la simulación produce resultados coherentes según:
          atributos del corredor, tipo de etapa, táctica y fatiga acumulada.
        </p>

        <hr />

        <h3>Flujo jugable</h3>
        <div class="stage-list">
          ${STAGES.map(stage => `
            <div class="stage-card">
              <div class="badge-row">
                <span class="badge green">Etapa ${stage.number}</span>
                <span class="badge blue">${stage.label}</span>
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
        <p class="muted">Cada equipo tiene una identidad clara para probar el motor.</p>

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
        </div>
        <h3>${escapeHtml(team.name)}</h3>
        <p class="muted">${escapeHtml(team.description)}</p>
      </div>

      <div class="badge-row">
        ${riders.map(rider => `<span class="badge">${escapeHtml(rider.role)}</span>`).join("")}
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
  const tactic = getSelectedTactic();

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>${escapeHtml(team.name)}</h1>
        <p>Etapa ${Game.currentStageIndex + 1}/5 · ${escapeHtml(stage.name)}</p>
      </div>

      <div class="top-actions">
        <button class="secondary" onclick="renderHome()">Cambiar equipo</button>
        <button class="danger" onclick="initGame()">Reiniciar</button>
      </div>
    </div>

    <div class="grid two">
      <section class="panel">
        ${renderCurrentStage(stage)}
        ${renderTactics()}
        <div class="simulation-actions">
          <div>
            <strong>Táctica seleccionada:</strong> ${escapeHtml(tactic.name)}
            <div class="muted small">${escapeHtml(tactic.description)}</div>
          </div>
          <button onclick="simulateCurrentStage()">Simular etapa</button>
        </div>
      </section>

      <section class="panel">
        <h2>Clasificación general</h2>
        ${renderGeneralClassificationTable(10)}
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
        <span class="badge green">Etapa ${stage.number}/5</span>
        <span class="badge blue">${escapeHtml(stage.label)}</span>
        <span class="badge">${stage.distance} km</span>
        <span class="badge orange">Dificultad ${stage.difficulty}/100</span>
      </div>
      <h2>${escapeHtml(stage.name)}</h2>
      <p class="help">${escapeHtml(stage.description)}</p>
      <p class="muted small">
        Nota: la fatiga penaliza más en alta montaña y pavés/muros que en una etapa llana.
      </p>
    </div>
  `;
}

function renderTactics() {
  return `
    <h2>Táctica de etapa</h2>
    <div class="tactic-grid">
      ${TACTICS.map(tactic => `
        <div class="tactic-card ${Game.selectedTacticId === tactic.id ? "selected" : ""}">
          <h3>${escapeHtml(tactic.name)}</h3>
          <p class="muted small">${escapeHtml(tactic.description)}</p>
          <div class="badge-row">
            <span class="badge">Bonus ${tactic.bonus >= 0 ? "+" : ""}${tactic.bonus}</span>
            <span class="badge orange">Riesgo ${Math.round(tactic.risk * 100)}%</span>
            <span class="badge blue">Fatiga x${tactic.fatigueMultiplier}</span>
          </div>
          <button class="secondary" onclick="selectTactic('${tactic.id}')">Elegir</button>
        </div>
      `).join("")}
    </div>
  `;
}

function selectTactic(tacticId) {
  Game.selectedTacticId = tacticId;
  renderRaceScreen();
}

function renderRiderCard(rider) {
  const relevantStats = [
    ["flat", "Llano"],
    ["timeTrial", "CRI"],
    ["teamTimeTrial", "CRE"],
    ["mountain", "Montaña"],
    ["cobbles", "Pavés"],
    ["hills", "Muros"]
  ];

  return `
    <div class="rider-card">
      <div class="badge-row">
        <span class="badge green">${escapeHtml(rider.role)}</span>
        <span class="badge orange">Fatiga ${Math.round(rider.fatigue)}</span>
        <span class="badge blue">Forma ${Math.round(rider.form)}</span>
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

// ============================================================
// MOTOR DE SIMULACIÓN
// ============================================================

function simulateCurrentStage() {
  const stage = getCurrentStage();
  const userTactic = getSelectedTactic();

  let results;

  if (stage.type === "team_time_trial") {
    results = simulateTeamTimeTrial(stage, userTactic);
  } else {
    results = simulateRoadStage(stage, userTactic);
  }

  results.sort((a, b) => a.stageTime - b.stageTime);

  results.forEach((result, index) => {
    result.position = index + 1;
    const rider = getRider(result.riderId);
    rider.totalTime += result.stageTime;
    rider.fatigue = clamp(rider.fatigue + result.fatigueGain, 0, 100);
  });

  Game.lastStageResults = {
    stage,
    results
  };

  Game.stageHistory.push(Game.lastStageResults);

  renderStageResultScreen();
}

function simulateRoadStage(stage, userTactic) {
  const baseStageTime = getBaseStageTime(stage);

  return Game.riders.map(rider => {
    const tactic = rider.teamId === Game.selectedTeamId
      ? userTactic
      : chooseAITactic(rider, stage);

    const performance = calculatePerformance(rider, stage, tactic);
    const time = convertPerformanceToTime(performance, baseStageTime, stage);
    const fatigueGain = calculateFatigueGain(rider, stage, tactic, performance);

    return {
      riderId: rider.id,
      riderName: rider.name,
      teamId: rider.teamId,
      teamName: getTeam(rider.teamId).name,
      stageTime: time,
      performance,
      tacticName: tactic.name,
      fatigueGain
    };
  });
}

function simulateTeamTimeTrial(stage, userTactic) {
  const baseStageTime = getBaseStageTime(stage);
  const teamResults = [];

  TEAMS.forEach(team => {
    const riders = getTeamRiders(team.id);
    const tactic = team.id === Game.selectedTeamId
      ? userTactic
      : chooseAITeamTactic(team, stage);

    const teamScore = calculateTeamTimeTrialScore(riders, tactic);
    const teamTime = convertPerformanceToTime(teamScore, baseStageTime, stage);

    riders.forEach((rider, index) => {
      const internalGap = index < 4 ? randomBetween(0, 4) : randomBetween(4, 18);
      const performance = teamScore + randomBetween(-1, 1);
      const fatigueGain = calculateFatigueGain(rider, stage, tactic, performance);

      teamResults.push({
        riderId: rider.id,
        riderName: rider.name,
        teamId: rider.teamId,
        teamName: team.name,
        stageTime: teamTime + internalGap,
        performance,
        tacticName: tactic.name,
        fatigueGain
      });
    });
  });

  return teamResults;
}

function getBaseStageTime(stage) {
  const speedByType = {
    flat: 44,
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
      s.flat * 0.45 +
      s.sprint * 0.20 +
      s.stamina * 0.15 +
      rider.form * 0.10 +
      s.acceleration * 0.05 +
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

  return terrainScore + tacticalBonus + randomNoise - fatiguePenalty - riskPenalty;
}

function calculateTeamTimeTrialScore(riders, tactic) {
  const ranked = [...riders].sort((a, b) => b.stats.teamTimeTrial - a.stats.teamTimeTrial);
  const top4 = ranked.slice(0, 4);

  const avgTTT = average(top4.map(r => r.stats.teamTimeTrial));
  const avgFlat = average(top4.map(r => r.stats.flat));
  const avgStamina = average(top4.map(r => r.stats.stamina));
  const avgForm = average(top4.map(r => r.form));
  const avgFatigue = average(riders.map(r => r.fatigue));

  const spread = standardDeviation(top4.map(r => r.stats.teamTimeTrial));
  const cohesionBonus = clamp(8 - spread, 0, 8);

  const riskPenalty = Math.random() < tactic.risk
    ? randomBetween(2, 8)
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

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values) {
  const avg = average(values);
  const variance = average(values.map(value => Math.pow(value - avg, 2)));
  return Math.sqrt(variance);
}

function getFatiguePenalty(rider, stage) {
  const fatigueFactorByType = {
    flat: 0.12,
    time_trial: 0.18,
    team_time_trial: 0.16,
    mountain: 0.34,
    cobbles_hills: 0.30
  };

  return rider.fatigue * (fatigueFactorByType[stage.type] || 0.2);
}

function calculateRiskPenalty(tactic, rider, stage) {
  const technicalProtection =
    rider.stats.stamina * 0.35 +
    rider.stats.recovery * 0.25 +
    rider.form * 0.20 +
    rider.stats.acceleration * 0.20;

  const stageChaos = {
    flat: 0.8,
    time_trial: 0.4,
    team_time_trial: 0.6,
    mountain: 1.1,
    cobbles_hills: 1.45
  }[stage.type] || 1.0;

  const riskRoll = Math.random();
  const adjustedRisk = tactic.risk * stageChaos * (1.05 - technicalProtection / 200);

  if (riskRoll < adjustedRisk) {
    return randomBetween(3, 12) * stageChaos;
  }

  return 0;
}

function convertPerformanceToTime(performance, baseStageTime, stage) {
  const separationByType = {
    flat: 3.0,
    time_trial: 5.5,
    team_time_trial: 4.7,
    mountain: 9.0,
    cobbles_hills: 8.2
  };

  const separation = separationByType[stage.type] || 5;
  const normalized = clamp(performance, 40, 105);
  const delta = (82 - normalized) * separation;
  const difficultyEffect = stage.difficulty * 0.18;

  return baseStageTime + delta + difficultyEffect + randomBetween(-7, 7);
}

function calculateFatigueGain(rider, stage, tactic, performance) {
  const baseFatigueByType = {
    flat: 4,
    time_trial: 5,
    team_time_trial: 5,
    mountain: 11,
    cobbles_hills: 12
  };

  const base = baseFatigueByType[stage.type] || 6;
  const difficulty = stage.difficulty / 20;
  const recoveryReduction = rider.stats.recovery / 55;
  const performanceStress = performance > 86 ? 1.2 : 1.0;

  return clamp(
    (base + difficulty) * tactic.fatigueMultiplier * performanceStress - recoveryReduction,
    1,
    30
  );
}

function chooseAITactic(rider, stage) {
  const team = getTeam(rider.teamId);

  if (stage.type === "mountain" && team.archetype === "Escalador") {
    return TACTICS.find(t => t.id === "aggressive");
  }

  if (stage.type === "cobbles_hills" && team.archetype === "Clásicas") {
    return TACTICS.find(t => t.id === "aggressive");
  }

  if (stage.type === "time_trial" && team.archetype === "Contrarreloj") {
    return TACTICS.find(t => t.id === "aggressive");
  }

  if (rider.fatigue > 45) {
    return TACTICS.find(t => t.id === "conservative");
  }

  return TACTICS.find(t => t.id === "balanced");
}

function chooseAITeamTactic(team, stage) {
  if (team.archetype === "Contrarreloj") {
    return TACTICS.find(t => t.id === "aggressive");
  }

  if (team.archetype === "Escalador") {
    return TACTICS.find(t => t.id === "balanced");
  }

  return TACTICS.find(t => t.id === "balanced");
}

// ============================================================
// RESULTADOS Y CLASIFICACIÓN
// ============================================================

function renderStageResultScreen() {
  const { stage, results } = Game.lastStageResults;
  const leaderTime = results[0].stageTime;

  app.innerHTML = `
    <div class="header">
      <div>
        <h1>Resultado · ${escapeHtml(stage.name)}</h1>
        <p>${escapeHtml(stage.label)} · ${stage.distance} km · dificultad ${stage.difficulty}</p>
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
        ${renderGeneralClassificationTable(20)}
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
          <th>Táctica</th>
          <th>Fatiga +</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(result => `
          <tr class="${result.teamId === Game.selectedTeamId ? "user-team" : ""}">
            <td>${result.position}</td>
            <td>${escapeHtml(result.riderName)}</td>
            <td>${escapeHtml(result.teamName)}</td>
            <td>${secondsToTime(result.stageTime)}</td>
            <td>${gapToLeader(result.stageTime, leaderTime)}</td>
            <td>${escapeHtml(result.tacticName)}</td>
            <td>${Math.round(result.fatigueGain)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderGeneralClassificationTable(limit = 20) {
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
          Fatiga acumulada: ${Math.round(bestUserGC.fatigue)}
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
    return "Excelente. Tu equipo ha ganado la etapa. La táctica y el perfil del corredor han encajado muy bien con el terreno.";
  }

  const gap = bestUser.stageTime - winner.stageTime;

  if (gap < 20) {
    return "Muy buen rendimiento. Tu mejor corredor ha estado cerca de la victoria. La general sigue completamente abierta.";
  }

  if (stage.type === "mountain") {
    return "La montaña ha generado diferencias relevantes. Revisa la fatiga: un líder demasiado castigado perderá mucho en la última etapa.";
  }

  if (stage.type === "cobbles_hills") {
    return "El pavés y los muros han castigado mucho la colocación, la resistencia y la explosividad. Es una etapa de alta varianza.";
  }

  if (stage.type === "team_time_trial") {
    return "La crono por equipos depende del bloque, no solo del líder. Un equipo equilibrado puede limitar pérdidas aunque no tenga al mejor corredor individual.";
  }

  return "Resultado correcto, aunque tu equipo no ha estado en la pelea directa por la victoria. Puedes asumir más riesgo en próximas etapas.";
}

function goToNextStage() {
  if (Game.currentStageIndex >= STAGES.length - 1) {
    Game.finished = true;
    renderFinalScreen();
    return;
  }

  Game.currentStageIndex += 1;
  Game.selectedTacticId = "balanced";
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
        <p>Mini-vuelta completada: 5 etapas disputadas.</p>
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
        ${renderGeneralClassificationTable(20)}
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
