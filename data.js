/* ============================================================
   CYCLING MANAGER TOUR - data.js
   v0.6: etapa por sectores, nutrición, material, radio,
   pelotón vivo, órdenes de carrera, UCI, temporada.
   ============================================================ */

/* ============================================================
   EQUIPOS
   ============================================================ */

const TEAM_BLUEPRINTS = [
  {
    id: "uae",
    name: "UAE Team Emirates XRG",
    archetype: "GC / Superteam",
    description: "Equipo dominante de grandes vueltas, montaña, cronos y clásicas.",
    color: "green",
    management: { budget: 42000000, prestige: 96, sponsorPressure: 94 },
    objectives: ["gc_win", "stage_wins_3", "uci_top_1"],
    aiProfile: { aggression: 88, control: 84, sprintFocus: 30, gcFocus: 98, breakawayFocus: 35 },
    modifiers: { flat: 3, sprint: 1, timeTrial: 5, teamTimeTrial: 5, mountain: 7, cobbles: 1, hills: 5, stamina: 6, recovery: 6, acceleration: 5, positioning: 5, downhill: 3, form: 4 }
  },
  {
    id: "visma",
    name: "Team Visma | Lease a Bike",
    archetype: "GC / Bloque",
    description: "Bloque de gran vuelta muy fuerte en montaña, recuperación y trabajo colectivo.",
    color: "yellow",
    management: { budget: 38000000, prestige: 94, sponsorPressure: 92 },
    objectives: ["gc_win", "teams_win", "stage_wins_2"],
    aiProfile: { aggression: 78, control: 92, sprintFocus: 35, gcFocus: 96, breakawayFocus: 30 },
    modifiers: { flat: 2, sprint: 1, timeTrial: 4, teamTimeTrial: 6, mountain: 6, cobbles: 2, hills: 4, stamina: 6, recovery: 7, acceleration: 3, positioning: 6, downhill: 4, form: 3 }
  },
  {
    id: "ineos",
    name: "Netcompany INEOS",
    archetype: "Crono / GC",
    description: "Equipo orientado a cronos, rodadores, ciencia deportiva y líderes de general.",
    color: "blue",
    management: { budget: 35000000, prestige: 89, sponsorPressure: 86 },
    objectives: ["gc_top_3", "stage_win", "uci_top_3"],
    aiProfile: { aggression: 62, control: 78, sprintFocus: 20, gcFocus: 86, breakawayFocus: 32 },
    modifiers: { flat: 4, sprint: -1, timeTrial: 8, teamTimeTrial: 8, mountain: 3, cobbles: 1, hills: 2, stamina: 5, recovery: 4, acceleration: 0, positioning: 4, downhill: 2, form: 2 }
  },
  {
    id: "movistar",
    name: "Movistar Team",
    archetype: "Montaña / Etapas",
    description: "Equipo español con foco en montaña, fugas, general y etapas selectivas.",
    color: "blue",
    management: { budget: 17000000, prestige: 78, sponsorPressure: 75 },
    objectives: ["gc_top_5", "stage_win", "mountain_top_3"],
    aiProfile: { aggression: 74, control: 52, sprintFocus: 25, gcFocus: 72, breakawayFocus: 80 },
    modifiers: { flat: 0, sprint: -2, timeTrial: 1, teamTimeTrial: 1, mountain: 5, cobbles: -2, hills: 4, stamina: 4, recovery: 4, acceleration: 2, positioning: 2, downhill: 3, form: 2 }
  },
  {
    id: "redbull",
    name: "Red Bull - BORA - hansgrohe",
    archetype: "GC / Potencia",
    description: "Equipo muy fuerte en líderes de general, montaña y potencia sostenida.",
    color: "orange",
    management: { budget: 33000000, prestige: 90, sponsorPressure: 88 },
    objectives: ["gc_top_3", "stage_wins_2", "uci_top_3"],
    aiProfile: { aggression: 76, control: 75, sprintFocus: 35, gcFocus: 90, breakawayFocus: 42 },
    modifiers: { flat: 2, sprint: 1, timeTrial: 4, teamTimeTrial: 4, mountain: 6, cobbles: 0, hills: 3, stamina: 5, recovery: 5, acceleration: 3, positioning: 3, downhill: 2, form: 3 }
  },
  {
    id: "soudal",
    name: "Soudal Quick-Step",
    archetype: "Crono / Sprint",
    description: "Equipo muy fuerte en cronos, velocidad, etapas llanas y talento ofensivo.",
    color: "blue",
    management: { budget: 28000000, prestige: 87, sponsorPressure: 84 },
    objectives: ["gc_top_3", "points_top_3", "time_trial_win"],
    aiProfile: { aggression: 82, control: 62, sprintFocus: 72, gcFocus: 78, breakawayFocus: 50 },
    modifiers: { flat: 4, sprint: 5, timeTrial: 7, teamTimeTrial: 5, mountain: 1, cobbles: 3, hills: 3, stamina: 3, recovery: 2, acceleration: 5, positioning: 4, downhill: 1, form: 2 }
  },
  {
    id: "lidl",
    name: "Lidl - Trek",
    archetype: "Clásicas / Sprint / GC",
    description: "Equipo completo: clásicas, sprint, montaña y corredores de general.",
    color: "red",
    management: { budget: 29000000, prestige: 86, sponsorPressure: 82 },
    objectives: ["stage_wins_2", "points_top_3", "uci_top_5"],
    aiProfile: { aggression: 84, control: 66, sprintFocus: 82, gcFocus: 68, breakawayFocus: 65 },
    modifiers: { flat: 4, sprint: 6, timeTrial: 3, teamTimeTrial: 3, mountain: 4, cobbles: 5, hills: 5, stamina: 4, recovery: 3, acceleration: 5, positioning: 4, downhill: 3, form: 3 }
  },
  {
    id: "alpecin",
    name: "Alpecin - Premier Tech",
    archetype: "Clásicas / Sprint",
    description: "Clasicómanos y velocistas; brutal en pavés, muros y finales explosivos.",
    color: "orange",
    management: { budget: 24000000, prestige: 88, sponsorPressure: 83 },
    objectives: ["points_win", "stage_wins_3", "monument_win"],
    aiProfile: { aggression: 92, control: 58, sprintFocus: 94, gcFocus: 10, breakawayFocus: 76 },
    modifiers: { flat: 5, sprint: 8, timeTrial: 0, teamTimeTrial: 1, mountain: -4, cobbles: 9, hills: 7, stamina: 4, recovery: 0, acceleration: 8, positioning: 7, downhill: 3, form: 3 }
  },
  {
    id: "bahrain",
    name: "Bahrain Victorious",
    archetype: "Montaña / Clásicas",
    description: "Equipo equilibrado con escaladores, clasicómanos y cazadores de etapa.",
    color: "red",
    management: { budget: 22000000, prestige: 80, sponsorPressure: 77 },
    objectives: ["stage_win", "gc_top_10", "mountain_top_3"],
    aiProfile: { aggression: 78, control: 55, sprintFocus: 38, gcFocus: 62, breakawayFocus: 78 },
    modifiers: { flat: 2, sprint: 2, timeTrial: 2, teamTimeTrial: 2, mountain: 4, cobbles: 3, hills: 5, stamina: 4, recovery: 3, acceleration: 4, positioning: 3, downhill: 4, form: 2 }
  },
  {
    id: "decathlon",
    name: "Decathlon CMA CGM Team",
    archetype: "Montaña / Desarrollo",
    description: "Escaladores, jóvenes talentos y buen rendimiento en media montaña.",
    color: "green",
    management: { budget: 21000000, prestige: 79, sponsorPressure: 74 },
    objectives: ["youth_win", "stage_win", "gc_top_10"],
    aiProfile: { aggression: 75, control: 50, sprintFocus: 35, gcFocus: 64, breakawayFocus: 82 },
    modifiers: { flat: 0, sprint: 1, timeTrial: 1, teamTimeTrial: 1, mountain: 5, cobbles: 0, hills: 5, stamina: 4, recovery: 3, acceleration: 4, positioning: 2, downhill: 3, form: 3 }
  }
];

const TEAMS = TEAM_BLUEPRINTS.map(t => ({
  id: t.id,
  name: t.name,
  archetype: t.archetype,
  description: t.description,
  color: t.color,
  objectives: t.objectives,
  management: t.management,
  aiProfile: t.aiProfile
}));

/* ============================================================
   OBJETIVOS
   ============================================================ */

const OBJECTIVE_DEFINITIONS = {
  gc_win: { label: "Ganar la general", prestige: 120, budget: 1500000 },
  gc_top_3: { label: "Top 3 en la general", prestige: 85, budget: 900000 },
  gc_top_5: { label: "Top 5 en la general", prestige: 65, budget: 650000 },
  gc_top_10: { label: "Top 10 en la general", prestige: 45, budget: 400000 },
  stage_win: { label: "Ganar al menos una etapa", prestige: 45, budget: 350000 },
  stage_wins_2: { label: "Ganar 2 etapas", prestige: 70, budget: 650000 },
  stage_wins_3: { label: "Ganar 3 etapas", prestige: 95, budget: 950000 },
  points_win: { label: "Ganar la clasificación por puntos", prestige: 80, budget: 850000 },
  points_top_3: { label: "Top 3 en puntos", prestige: 45, budget: 400000 },
  mountain_top_3: { label: "Top 3 en montaña", prestige: 45, budget: 400000 },
  youth_win: { label: "Ganar la clasificación joven", prestige: 70, budget: 700000 },
  teams_win: { label: "Ganar la clasificación por equipos", prestige: 70, budget: 700000 },
  uci_top_1: { label: "Liderar el ranking UCI de la carrera", prestige: 100, budget: 1200000 },
  uci_top_3: { label: "Top 3 UCI de la carrera", prestige: 65, budget: 650000 },
  uci_top_5: { label: "Top 5 UCI de la carrera", prestige: 45, budget: 450000 },
  time_trial_win: { label: "Ganar una crono", prestige: 50, budget: 450000 },
  monument_win: { label: "Ganar una clásica/monumento", prestige: 100, budget: 1000000 }
};

/* ============================================================
   CORREDORES
   ============================================================ */

const ROLE_TEMPLATES = {
  gc: {
    role: "Líder GC",
    ageBase: 28,
    abandonRisk: 0.016,
    stats: { flat: 80, sprint: 66, timeTrial: 84, teamTimeTrial: 84, mountain: 88, cobbles: 68, hills: 84, stamina: 90, recovery: 89, acceleration: 80, positioning: 84, downhill: 82, consistency: 88, injuryResistance: 82 },
    form: 84
  },
  co_leader: {
    role: "Co-líder",
    ageBase: 27,
    abandonRisk: 0.018,
    stats: { flat: 78, sprint: 64, timeTrial: 80, teamTimeTrial: 81, mountain: 85, cobbles: 66, hills: 82, stamina: 87, recovery: 86, acceleration: 78, positioning: 80, downhill: 80, consistency: 84, injuryResistance: 81 },
    form: 82
  },
  climber: {
    role: "Escalador",
    ageBase: 27,
    abandonRisk: 0.021,
    stats: { flat: 72, sprint: 58, timeTrial: 72, teamTimeTrial: 74, mountain: 87, cobbles: 56, hills: 81, stamina: 86, recovery: 85, acceleration: 78, positioning: 76, downhill: 80, consistency: 82, injuryResistance: 78 },
    form: 81
  },
  time_trialist: {
    role: "Croner",
    ageBase: 28,
    abandonRisk: 0.017,
    stats: { flat: 84, sprint: 64, timeTrial: 86, teamTimeTrial: 87, mountain: 74, cobbles: 68, hills: 75, stamina: 84, recovery: 81, acceleration: 70, positioning: 78, downhill: 76, consistency: 84, injuryResistance: 80 },
    form: 81
  },
  sprinter: {
    role: "Sprinter",
    ageBase: 29,
    abandonRisk: 0.026,
    stats: { flat: 84, sprint: 88, timeTrial: 70, teamTimeTrial: 76, mountain: 62, cobbles: 72, hills: 72, stamina: 80, recovery: 76, acceleration: 89, positioning: 86, downhill: 74, consistency: 78, injuryResistance: 75 },
    form: 81
  },
  classics: {
    role: "Clasicómano",
    ageBase: 29,
    abandonRisk: 0.024,
    stats: { flat: 82, sprint: 78, timeTrial: 75, teamTimeTrial: 78, mountain: 72, cobbles: 83, hills: 84, stamina: 84, recovery: 80, acceleration: 84, positioning: 87, downhill: 80, consistency: 80, injuryResistance: 77 },
    form: 81
  },
  rouleur: {
    role: "Rodador",
    ageBase: 29,
    abandonRisk: 0.018,
    stats: { flat: 85, sprint: 70, timeTrial: 80, teamTimeTrial: 83, mountain: 72, cobbles: 72, hills: 75, stamina: 83, recovery: 80, acceleration: 72, positioning: 79, downhill: 76, consistency: 82, injuryResistance: 82 },
    form: 79
  },
  domestique: {
    role: "Gregario",
    ageBase: 29,
    abandonRisk: 0.019,
    stats: { flat: 78, sprint: 66, timeTrial: 75, teamTimeTrial: 78, mountain: 78, cobbles: 66, hills: 77, stamina: 82, recovery: 81, acceleration: 73, positioning: 78, downhill: 76, consistency: 80, injuryResistance: 82 },
    form: 78
  },
  puncheur: {
    role: "Puncheur",
    ageBase: 26,
    abandonRisk: 0.023,
    stats: { flat: 78, sprint: 76, timeTrial: 74, teamTimeTrial: 76, mountain: 78, cobbles: 72, hills: 86, stamina: 83, recovery: 80, acceleration: 86, positioning: 82, downhill: 80, consistency: 78, injuryResistance: 77 },
    form: 81
  }
};

const TEAM_RIDER_BLUEPRINTS = {
  uae: [
    ["Tadej Pogačar", "Slovenia", 27, "gc"],
    ["João Almeida", "Portugal", 27, "co_leader"],
    ["Adam Yates", "Great Britain", 33, "climber"],
    ["Isaac del Toro", "Mexico", 22, "puncheur"],
    ["Brandon McNulty", "United States", 28, "time_trialist"],
    ["Tim Wellens", "Belgium", 35, "classics"],
    ["Pavel Sivakov", "France", 29, "domestique"],
    ["Nils Politt", "Germany", 32, "rouleur"]
  ],
  visma: [
    ["Jonas Vingegaard", "Denmark", 29, "gc"],
    ["Matteo Jorgenson", "United States", 27, "co_leader"],
    ["Sepp Kuss", "United States", 31, "climber"],
    ["Wilco Kelderman", "Netherlands", 35, "domestique"],
    ["Dylan van Baarle", "Netherlands", 34, "rouleur"],
    ["Christophe Laporte", "France", 33, "classics"],
    ["Olav Kooij", "Netherlands", 24, "sprinter"],
    ["Tiesj Benoot", "Belgium", 32, "puncheur"]
  ],
  ineos: [
    ["Egan Bernal", "Colombia", 29, "gc"],
    ["Carlos Rodríguez", "Spain", 25, "co_leader"],
    ["Thymen Arensman", "Netherlands", 26, "climber"],
    ["Filippo Ganna", "Italy", 29, "time_trialist"],
    ["Joshua Tarling", "Great Britain", 22, "time_trialist"],
    ["Magnus Sheffield", "United States", 24, "rouleur"],
    ["Laurens De Plus", "Belgium", 30, "domestique"],
    ["Ben Turner", "Great Britain", 27, "classics"]
  ],
  movistar: [
    ["Enric Mas", "Spain", 31, "gc"],
    ["Nairo Quintana", "Colombia", 36, "climber"],
    ["Einer Rubio", "Colombia", 28, "climber"],
    ["Iván Romeo", "Spain", 23, "time_trialist"],
    ["Alex Aranburu", "Spain", 30, "classics"],
    ["Fernando Gaviria", "Colombia", 31, "sprinter"],
    ["Davide Formolo", "Italy", 33, "domestique"],
    ["Pelayo Sánchez", "Spain", 26, "puncheur"]
  ],
  redbull: [
    ["Primož Roglič", "Slovenia", 36, "gc"],
    ["Jai Hindley", "Australia", 30, "climber"],
    ["Aleksandr Vlasov", "Russia", 30, "co_leader"],
    ["Daniel Martínez", "Colombia", 30, "climber"],
    ["Florian Lipowitz", "Germany", 25, "climber"],
    ["Roger Adrià", "Spain", 28, "puncheur"],
    ["Sam Welsford", "Australia", 30, "sprinter"],
    ["Bob Jungels", "Luxembourg", 33, "rouleur"]
  ],
  soudal: [
    ["Remco Evenepoel", "Belgium", 26, "gc"],
    ["Mikel Landa", "Spain", 36, "climber"],
    ["Ilan Van Wilder", "Belgium", 26, "co_leader"],
    ["Tim Merlier", "Belgium", 33, "sprinter"],
    ["Kasper Asgreen", "Denmark", 31, "rouleur"],
    ["Yves Lampaert", "Belgium", 35, "time_trialist"],
    ["Mauri Vansevenant", "Belgium", 27, "puncheur"],
    ["Bert Van Lerberghe", "Belgium", 33, "domestique"]
  ],
  lidl: [
    ["Juan Ayuso", "Spain", 24, "gc"],
    ["Mattias Skjelmose", "Denmark", 26, "co_leader"],
    ["Giulio Ciccone", "Italy", 31, "climber"],
    ["Mads Pedersen", "Denmark", 30, "classics"],
    ["Jonathan Milan", "Italy", 26, "sprinter"],
    ["Tao Geoghegan Hart", "Great Britain", 31, "climber"],
    ["Simone Consonni", "Italy", 31, "rouleur"],
    ["Jasper Stuyven", "Belgium", 34, "classics"]
  ],
  alpecin: [
    ["Mathieu van der Poel", "Netherlands", 31, "classics"],
    ["Jasper Philipsen", "Belgium", 28, "sprinter"],
    ["Kaden Groves", "Australia", 27, "sprinter"],
    ["Søren Kragh Andersen", "Denmark", 32, "rouleur"],
    ["Quinten Hermans", "Belgium", 31, "puncheur"],
    ["Gianni Vermeersch", "Belgium", 33, "classics"],
    ["Tibor Del Grosso", "Netherlands", 23, "puncheur"],
    ["Silvan Dillier", "Switzerland", 36, "domestique"]
  ],
  bahrain: [
    ["Pello Bilbao", "Spain", 36, "gc"],
    ["Santiago Buitrago", "Colombia", 26, "climber"],
    ["Antonio Tiberi", "Italy", 25, "co_leader"],
    ["Matej Mohorič", "Slovenia", 31, "classics"],
    ["Phil Bauhaus", "Germany", 32, "sprinter"],
    ["Jack Haig", "Australia", 33, "climber"],
    ["Fred Wright", "Great Britain", 27, "rouleur"],
    ["Kamil Gradek", "Poland", 36, "time_trialist"]
  ],
  decathlon: [
    ["Felix Gall", "Austria", 28, "gc"],
    ["Paul Seixas", "France", 20, "climber"],
    ["Paul Lapeira", "France", 26, "puncheur"],
    ["Dorian Godon", "France", 30, "classics"],
    ["Bruno Armirail", "France", 32, "time_trialist"],
    ["Oliver Naesen", "Belgium", 35, "rouleur"],
    ["Sam Bennett", "Ireland", 35, "sprinter"],
    ["Aurélien Paret-Peintre", "France", 30, "climber"]
  ]
};

function dataClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function deterministicNoise(teamIndex, riderIndex, statName) {
  const seed =
    teamIndex * 97 +
    riderIndex * 31 +
    statName.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const raw = Math.sin(seed) * 10000;
  const fractional = raw - Math.floor(raw);

  return Math.round((fractional - 0.5) * 6);
}

function buildStats(baseStats, modifiers, teamIndex, riderIndex) {
  const stats = {};

  Object.keys(baseStats).forEach(statName => {
    stats[statName] = dataClamp(
      baseStats[statName] + (modifiers[statName] || 0) + deterministicNoise(teamIndex, riderIndex, statName),
      42,
      99
    );
  });

  return stats;
}

function generateRiders() {
  const riders = [];

  TEAM_BLUEPRINTS.forEach((team, teamIndex) => {
    TEAM_RIDER_BLUEPRINTS[team.id].forEach((item, riderIndex) => {
      const [name, nationality, age, roleKey] = item;
      const template = ROLE_TEMPLATES[roleKey];

      riders.push({
        id: `${team.id}_${String(riderIndex + 1).padStart(2, "0")}`,
        name,
        nationality,
        age,
        teamId: team.id,
        role: template.role,
        roleKey,
        speciality: template.role,
        stats: buildStats(template.stats, team.modifiers, teamIndex, riderIndex),
        form: dataClamp(
          template.form + team.modifiers.form + deterministicNoise(teamIndex, riderIndex, "form"),
          68,
          98
        ),
        morale: dataClamp(
          78 + team.modifiers.form + deterministicNoise(teamIndex, riderIndex, "morale"),
          45,
          98
        ),
        energy: 100,
        fatigue: 0,
        totalTime: 0,
        raceDays: 0,
        points: 0,
        mountainPoints: 0,
        uciPoints: 0,
        stageWins: 0,
        abandonRisk: template.abandonRisk,
        abandoned: false
      });
    });
  });

  return riders;
}

const RIDERS = generateRiders();

/* ============================================================
   REGLAS
   ============================================================ */

const CLASSIFICATION_RULES = {
  youthMaxAge: 25,
  teamClassificationBestRiders: 3,
  finishBonuses: [10, 6, 4],

  pointsByStageType: {
    flat: [50, 30, 20, 18, 16, 14, 12, 10, 8, 7, 6, 5, 4, 3, 2],
    hilly: [35, 25, 20, 17, 15, 13, 11, 9, 7, 6, 5, 4, 3, 2, 1],
    mountain: [25, 20, 16, 14, 12, 10, 8, 6, 4, 2],
    cobbles_hills: [35, 25, 20, 17, 15, 13, 11, 9, 7, 6],
    time_trial: [20, 17, 15, 13, 11, 9, 7, 5, 3, 1],
    team_time_trial: [20, 17, 15, 13, 11, 9, 7, 5, 3, 1]
  },

  intermediateSprintPoints: [20, 17, 15, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],

  mountainPoints: {
    HC: [20, 15, 12, 10, 8, 6, 4, 2],
    "1": [10, 8, 6, 4, 2, 1],
    "2": [5, 3, 2, 1],
    "3": [2, 1],
    "4": [1]
  },

  uci: {
    grandTourStage: [120, 50, 25, 15, 5],
    grandTourFinalGC: [
      1300, 1040, 880, 730, 620, 520, 425, 325, 275, 225,
      175, 150, 125, 105, 85, 75, 70, 65, 60, 55,
      50, 45, 40, 35, 30, 25, 20, 15, 10, 5
    ],
    stageLeaderPerDay: 25,
    secondaryFinal: [120, 50, 25],
    oneDay: [500, 400, 325, 275, 225, 175, 150, 125, 100, 85, 70, 60, 50, 40, 30]
  }
};

const DIFFICULTY_LEVELS = {
  easy: {
    label: "Fácil",
    userBonus: 3,
    aiBonus: -1,
    incidentMultiplier: 0.75,
    crisisMultiplier: 0.75,
    sponsorMultiplier: 0.85
  },
  normal: {
    label: "Normal",
    userBonus: 0,
    aiBonus: 0,
    incidentMultiplier: 1.0,
    crisisMultiplier: 1.0,
    sponsorMultiplier: 1.0
  },
  realistic: {
    label: "Realista",
    userBonus: -1,
    aiBonus: 1,
    incidentMultiplier: 1.25,
    crisisMultiplier: 1.25,
    sponsorMultiplier: 1.15
  }
};

/* ============================================================
   TÁCTICAS Y ÓRDENES
   ============================================================ */

const TACTICS = [
  {
    id: "conservative",
    name: "Conservar",
    description: "Menor riesgo y fatiga. Ideal para corredores tocados.",
    bonus: -2,
    risk: 0.06,
    fatigueMultiplier: 0.62,
    supportBonus: 0,
    sprintTrainBonus: 0,
    sectorEnergy: 0.72
  },
  {
    id: "balanced",
    name: "Equilibrado",
    description: "Compromiso entre rendimiento y desgaste.",
    bonus: 0,
    risk: 0.16,
    fatigueMultiplier: 1.0,
    supportBonus: 0,
    sprintTrainBonus: 0,
    sectorEnergy: 1.0
  },
  {
    id: "protect_leader",
    name: "Proteger líder",
    description: "Sacrifica rendimiento para ayudar al líder protegido.",
    bonus: -1,
    risk: 0.12,
    fatigueMultiplier: 1.20,
    supportBonus: 2.4,
    sprintTrainBonus: 0,
    sectorEnergy: 1.15
  },
  {
    id: "pull_peloton",
    name: "Tirar del pelotón",
    description: "Trabaja para reducir fuga. Mucho coste de energía.",
    bonus: 1,
    risk: 0.20,
    fatigueMultiplier: 1.55,
    supportBonus: 0,
    sprintTrainBonus: 0,
    sectorEnergy: 1.45,
    pullsPeloton: true
  },
  {
    id: "mark_rival",
    name: "Marcar rival",
    description: "Cubre ataques de rivales directos. Bueno para GC.",
    bonus: 1,
    risk: 0.20,
    fatigueMultiplier: 1.20,
    supportBonus: 1.0,
    sprintTrainBonus: 0,
    sectorEnergy: 1.15,
    markRival: true
  },
  {
    id: "aggressive",
    name: "Atacar",
    description: "Más rendimiento potencial, más fatiga y riesgo.",
    bonus: 4,
    risk: 0.36,
    fatigueMultiplier: 1.45,
    supportBonus: 0,
    sprintTrainBonus: 0,
    sectorEnergy: 1.45
  },
  {
    id: "all_in",
    name: "Todo o nada",
    description: "Máximo riesgo; puede romper la etapa o hundir al corredor.",
    bonus: 8,
    risk: 0.62,
    fatigueMultiplier: 2.0,
    supportBonus: 0,
    sprintTrainBonus: 0,
    sectorEnergy: 2.0
  },
  {
    id: "sprint_train",
    name: "Tren de sprint",
    description: "Ayuda al sprinter en llanas y finales rápidos.",
    bonus: -1,
    risk: 0.22,
    fatigueMultiplier: 1.30,
    supportBonus: 0,
    sprintTrainBonus: 2.6,
    sectorEnergy: 1.35
  },
  {
    id: "wait_leader",
    name: "Esperar líder",
    description: "Pierde tiempo para ayudar a un líder con problema.",
    bonus: -5,
    risk: 0.08,
    fatigueMultiplier: 1.35,
    supportBonus: 3.8,
    sprintTrainBonus: 0,
    sectorEnergy: 1.35,
    waitsLeader: true
  }
];

const SMART_PRESETS = [
  { id: "protect_gc", name: "Proteger GC", description: "Líder equilibrado; gregarios protegen." },
  { id: "sprint", name: "Sprint masivo", description: "Sprinter ataca; rodadores hacen tren." },
  { id: "breakaway", name: "Fuga del día", description: "Puncheurs/rouleurs atacan; líderes conservan." },
  { id: "mountain_attack", name: "Montaña agresiva", description: "GC y escaladores atacan; gregarios protegen." },
  { id: "survival", name: "Supervivencia", description: "Todos conservan para salvar fatiga." },
  { id: "time_trial", name: "Crono a tope", description: "Croners y líderes atacan; resto equilibrado." }
];

/* ============================================================
   NUTRICIÓN
   ============================================================ */

const NUTRITION_ITEMS = [
  {
    id: "gel",
    name: "Gel",
    description: "Energía rápida. Bueno antes de puertos o ataques.",
    energy: 20,
    hydration: 0,
    stomachLoad: 8,
    morale: 0,
    finalBonus: 0,
    delay: 0,
    bestUse: ["climb", "final", "attack"]
  },
  {
    id: "bar",
    name: "Barrita",
    description: "Energía lenta. Mejor en llano o valle.",
    energy: 25,
    hydration: -2,
    stomachLoad: 14,
    morale: 0,
    finalBonus: 0,
    delay: 1,
    bestUse: ["flat", "valley"]
  },
  {
    id: "isotonic",
    name: "Bidón isotónico",
    description: "Energía moderada e hidratación.",
    energy: 12,
    hydration: 18,
    stomachLoad: 5,
    morale: 0,
    finalBonus: 0,
    delay: 0,
    bestUse: ["flat", "hilly", "hot"]
  },
  {
    id: "caffeine_gel",
    name: "Gel cafeína",
    description: "Bonus de final. Úsalo en el último sector duro.",
    energy: 18,
    hydration: -2,
    stomachLoad: 10,
    morale: 3,
    finalBonus: 3,
    delay: 0,
    bestUse: ["final"]
  },
  {
    id: "rice_cake",
    name: "Rice cake",
    description: "Energía estable y poco agresiva.",
    energy: 18,
    hydration: 0,
    stomachLoad: 9,
    morale: 1,
    finalBonus: 0,
    delay: 1,
    bestUse: ["flat", "valley", "hilly"]
  },
  {
    id: "water",
    name: "Agua",
    description: "Hidratación sin apenas energía.",
    energy: 2,
    hydration: 24,
    stomachLoad: 2,
    morale: 0,
    finalBonus: 0,
    delay: 0,
    bestUse: ["hot", "flat", "climb"]
  }
];

const NUTRITION_PLANS = [
  {
    id: "auto_balanced",
    name: "Automático equilibrado",
    description: "Come de forma estable durante toda la etapa.",
    stock: { gel: 16, bar: 12, isotonic: 24, caffeine_gel: 6, rice_cake: 12, water: 24 },
    rules: [
      { sectorType: "flat", item: "bar" },
      { sectorType: "valley", item: "rice_cake" },
      { sectorType: "hilly", item: "gel" },
      { sectorType: "climb", item: "gel" },
      { sectorType: "final", item: "caffeine_gel" }
    ]
  },
  {
    id: "mountain",
    name: "Montaña",
    description: "Más geles y cafeína para sectores duros.",
    stock: { gel: 24, bar: 8, isotonic: 24, caffeine_gel: 8, rice_cake: 8, water: 24 },
    rules: [
      { sectorType: "flat", item: "bar" },
      { sectorType: "valley", item: "isotonic" },
      { sectorType: "hilly", item: "gel" },
      { sectorType: "climb", item: "gel" },
      { sectorType: "final", item: "caffeine_gel" }
    ]
  },
  {
    id: "sprint",
    name: "Sprint",
    description: "Hidrata y reserva cafeína para el final rápido.",
    stock: { gel: 18, bar: 10, isotonic: 28, caffeine_gel: 8, rice_cake: 10, water: 24 },
    rules: [
      { sectorType: "flat", item: "isotonic" },
      { sectorType: "valley", item: "rice_cake" },
      { sectorType: "hilly", item: "gel" },
      { sectorType: "climb", item: "gel" },
      { sectorType: "final", item: "caffeine_gel" }
    ]
  },
  {
    id: "hot",
    name: "Calor",
    description: "Prioriza hidratación para evitar crisis.",
    stock: { gel: 18, bar: 8, isotonic: 34, caffeine_gel: 6, rice_cake: 8, water: 34 },
    rules: [
      { sectorType: "flat", item: "isotonic" },
      { sectorType: "valley", item: "water" },
      { sectorType: "hilly", item: "isotonic" },
      { sectorType: "climb", item: "gel" },
      { sectorType: "final", item: "caffeine_gel" }
    ]
  }
];

const AUTO_NUTRITION_MODES = [
  {
    id: "auto_smart",
    name: "Automático inteligente",
    description: "El ciclista toma geles, bidones o comida según energía, hidratación, sector y momento de carrera."
  },
  {
    id: "auto_conservative",
    name: "Automático conservador",
    description: "Prioriza evitar pájaras y deshidratación aunque gaste más stock."
  },
  {
    id: "auto_aggressive",
    name: "Automático agresivo",
    description: "Reserva cafeína y geles para ataques, puertos y finales."
  },
  {
    id: "manual",
    name: "Manual",
    description: "Tú decides cuándo come cada corredor."
  }
];

/* ============================================================
   MATERIAL
   ============================================================ */

const BIKE_SETUPS = [
  {
    id: "aero",
    name: "Aero",
    description: "Máxima velocidad en llano y sprint.",
    bonuses: { flat: 3, sprint: 2, timeTrial: 1, mountain: -2, cobbles: -1, hilly: 1, handling: -1 },
    punctureRisk: 1.0
  },
  {
    id: "lightweight",
    name: "Ligera",
    description: "Ideal para alta montaña.",
    bonuses: { mountain: 3, hilly: 2, acceleration: 1, flat: -1, cobbles: -2, handling: 1 },
    punctureRisk: 1.05
  },
  {
    id: "endurance",
    name: "Endurance",
    description: "Más cómoda y segura en pavés o etapas largas.",
    bonuses: { cobbles: 3, stamina: 1, positioning: 1, flat: -1, timeTrial: -1, handling: 2 },
    punctureRisk: 0.85
  },
  {
    id: "tt",
    name: "Cabra CRI",
    description: "Solo para cronos.",
    bonuses: { timeTrial: 6, teamTimeTrial: 5, flat: 2, mountain: -2, handling: -2 },
    punctureRisk: 1.0
  }
];

const WHEEL_SETUPS = [
  {
    id: "deep_60",
    name: "Perfil 60 mm",
    description: "Muy rápidas en llano, sensibles al viento.",
    bonuses: { flat: 2, sprint: 1, timeTrial: 2, mountain: -1, hilly: 0, windPenalty: 2 },
    punctureRisk: 1.0
  },
  {
    id: "shallow_35",
    name: "Perfil 35 mm",
    description: "Equilibradas y manejables.",
    bonuses: { mountain: 1, hilly: 1, handling: 1, flat: 0, windPenalty: 0 },
    punctureRisk: 0.95
  },
  {
    id: "climbing",
    name: "Ruedas ligeras",
    description: "Buenas para puertos largos.",
    bonuses: { mountain: 2, acceleration: 1, flat: -1, hilly: 1, windPenalty: 0 },
    punctureRisk: 1.05
  },
  {
    id: "cobbles",
    name: "Ruedas pavés",
    description: "Más seguridad y confort en adoquines.",
    bonuses: { cobbles: 3, positioning: 1, stamina: 1, windPenalty: 0 },
    punctureRisk: 0.75
  },
  {
    id: "disc_tt",
    name: "Lenticular CRI",
    description: "Máxima aerodinámica en cronos.",
    bonuses: { timeTrial: 4, teamTimeTrial: 4, flat: 2, windPenalty: 3 },
    punctureRisk: 1.0
  }
];

const EQUIPMENT_PRESETS = [
  { id: "auto", name: "Auto según etapa", bike: "auto", wheels: "auto" },
  { id: "flat", name: "Llano", bike: "aero", wheels: "deep_60" },
  { id: "mountain", name: "Montaña", bike: "lightweight", wheels: "climbing" },
  { id: "hilly", name: "Media montaña", bike: "lightweight", wheels: "shallow_35" },
  { id: "cobbles", name: "Pavés", bike: "endurance", wheels: "cobbles" },
  { id: "tt", name: "Crono", bike: "tt", wheels: "disc_tt" },
  { id: "safe_rain", name: "Seguro lluvia", bike: "endurance", wheels: "shallow_35" }
];

/* ============================================================
   ENTRENAMIENTO
   ============================================================ */

const TRAINING_OPTIONS = [
  {
    id: "recovery",
    name: "Recuperación total",
    description: "Reduce mucha fatiga, pero baja ligeramente la forma.",
    effects: { fatigue: -22, form: -1, morale: 1 }
  },
  {
    id: "activation",
    name: "Activación suave",
    description: "Reduce fatiga y mantiene tono competitivo.",
    effects: { fatigue: -12, form: 1, morale: 1 }
  },
  {
    id: "altitude",
    name: "Concentración en altura",
    description: "Mejora montaña, stamina y forma, pero recupera menos.",
    effects: { fatigue: -6, form: 3, mountain: 1, stamina: 1, morale: 1 }
  },
  {
    id: "time_trial",
    name: "Bloque de crono",
    description: "Mejora CRI/CRE.",
    effects: { fatigue: -7, form: 2, timeTrial: 1, teamTimeTrial: 1 }
  },
  {
    id: "sprint",
    name: "Tren de sprint",
    description: "Mejora sprint, colocación y aceleración.",
    effects: { fatigue: -7, form: 2, sprint: 1, positioning: 1, acceleration: 1 }
  }
];

/* ============================================================
   ETAPAS Y CARRERAS
   ============================================================ */

function climb(name, category, km, length, gradient) {
  return { name, category, km, length, gradient };
}

function sprint(km) {
  return { km, points: CLASSIFICATION_RULES.intermediateSprintPoints };
}

function sectorTypeFromStage(stageType, isFinal, climbHere) {
  if (isFinal) return "final";
  if (climbHere && ["mountain", "hilly"].includes(stageType)) return "climb";
  if (stageType === "flat") return "flat";
  if (stageType === "hilly") return "hilly";
  if (stageType === "mountain") return "climb";
  if (stageType === "cobbles_hills") return "cobbles";
  if (stageType === "time_trial" || stageType === "team_time_trial") return "tt";
  return "valley";
}

function buildStageSectors(stageType, distance, difficulty, profile) {
  const sectorCount = distance > 220 ? 6 : distance > 170 ? 5 : distance > 90 ? 4 : 3;
  const sectors = [];
  const climbs = profile.climbs || [];

  for (let i = 0; i < sectorCount; i++) {
    const kmStart = Math.round((distance / sectorCount) * i);
    const kmEnd = i === sectorCount - 1 ? distance : Math.round((distance / sectorCount) * (i + 1));
    const kmMid = (kmStart + kmEnd) / 2;
    const climbHere = climbs.find(c => c.km >= kmStart && c.km <= kmEnd);
    const isFinal = i === sectorCount - 1;

    const type = sectorTypeFromStage(stageType, isFinal, climbHere);
    const sectorDifficulty = dataClamp(
      difficulty +
        (climbHere ? 12 : 0) +
        (isFinal ? 8 : 0) +
        (profile.roadSurface === "pavé" ? 8 : 0),
      10,
      100
    );

    sectors.push({
      id: `sector_${i + 1}`,
      name:
        type === "final" ? "Final de etapa" :
        type === "climb" ? `Puerto / subida ${climbHere ? climbHere.name : ""}` :
        type === "cobbles" ? "Sector de pavés y muros" :
        type === "tt" ? "Sector crono" :
        type === "flat" ? "Llano / control" :
        type === "hilly" ? "Terreno quebrado" :
        "Valle / transición",
      kmStart,
      kmEnd,
      type,
      difficulty: sectorDifficulty,
      energyCost:
        type === "flat" ? 14 :
        type === "valley" ? 16 :
        type === "hilly" ? 22 :
        type === "climb" ? 30 :
        type === "cobbles" ? 28 :
        type === "tt" ? 26 :
        34,
      feedingAllowed: !["final"].includes(type) || sectorDifficulty < 88,
      attackValue:
        type === "flat" ? 25 :
        type === "hilly" ? 65 :
        type === "climb" ? 85 :
        type === "cobbles" ? 75 :
        type === "final" ? 95 :
        50,
      risk:
        type === "cobbles" ? 70 :
        type === "climb" ? 45 :
        type === "final" ? 55 :
        profile.rainRisk > 40 ? 45 :
        30
    });
  }

  return sectors;
}

function stage(idPrefix, number, name, type, distance, difficulty, profile = {}) {
  const labels = {
    flat: "Llana",
    hilly: "Media montaña",
    mountain: "Alta montaña",
    cobbles_hills: "Pavés + muros",
    time_trial: "CRI",
    team_time_trial: "CRE"
  };

  const fullProfile = {
    elevationGain: profile.elevationGain || 800,
    finalClimb: !!profile.finalClimb,
    technicalDescent: profile.technicalDescent || 25,
    windExposure: profile.windExposure || 25,
    heat: profile.heat || 45,
    rainRisk: profile.rainRisk || 20,
    roadSurface: profile.roadSurface || "normal",
    climbs: profile.climbs || [],
    intermediateSprints:
      profile.intermediateSprints === false
        ? []
        : profile.intermediateSprints || [sprint(Math.round(distance * 0.45))],
    finishBonuses: profile.finishBonuses === false ? [] : CLASSIFICATION_RULES.finishBonuses
  };

  return {
    id: `${idPrefix}_${String(number).padStart(2, "0")}`,
    number,
    name,
    type,
    label: labels[type] || type,
    distance,
    difficulty,
    description: profile.description || "Etapa de carrera.",
    profile: fullProfile,
    sectors: buildStageSectors(type, distance, difficulty, fullProfile)
  };
}

const TOUR_STAGES = [
  stage("tour", 1, "Tour 1 - Grand Départ Costero", "flat", 182, 34, { elevationGain: 900, windExposure: 65, description: "Primera etapa favorable al sprint, con riesgo de abanicos." }),
  stage("tour", 2, "Tour 2 - Muros del Interior", "hilly", 171, 68, { elevationGain: 2500, climbs: [climb("Côte de Saint-Romain", "3", 96, 3.8, 6.1), climb("Mur final", "2", 168, 2.2, 9.4)], description: "Final quebrado con repechos y bonificaciones." }),
  stage("tour", 3, "Tour 3 - Llanura del Norte", "flat", 198, 38, { elevationGain: 700, windExposure: 45, description: "Día largo para sprinters." }),
  stage("tour", 4, "Tour 4 - Crono por Equipos", "team_time_trial", 41, 62, { elevationGain: 400, intermediateSprints: false, finishBonuses: false, description: "Test colectivo para bloques de GC." }),
  stage("tour", 5, "Tour 5 - Pavés y Muros", "cobbles_hills", 204, 88, { elevationGain: 2100, roadSurface: "pavé", rainRisk: 38, climbs: [climb("Sector pavé 1", "4", 72, 2.0, 3.0), climb("Mur de la Chapelle", "2", 187, 1.6, 10.2)], description: "Pavés, muros, colocación y riesgo alto." }),
  stage("tour", 6, "Tour 6 - Sprint del Valle", "flat", 176, 32, { elevationGain: 650, description: "Oportunidad clara para velocistas." }),
  stage("tour", 7, "Tour 7 - Primer Contacto Alpino", "mountain", 164, 84, { elevationGain: 3900, climbs: [climb("Col de la Biche", "1", 88, 11.5, 7.1), climb("Mont du Cerf", "1", 153, 9.6, 8.0)], finalClimb: true, description: "Primera etapa de montaña." }),
  stage("tour", 8, "Tour 8 - Etapa Trampa", "hilly", 186, 72, { elevationGain: 3100, climbs: [climb("Côte des Vignes", "3", 44, 4.1, 5.8), climb("Côte du Signal", "2", 176, 4.4, 7.5)], description: "Ideal para fugas y clasicómanos." }),
  stage("tour", 9, "Tour 9 - Cima de los Lagos", "mountain", 152, 91, { elevationGain: 4300, climbs: [climb("Port de Balès", "HC", 94, 18.6, 7.2), climb("Lagos", "HC", 152, 13.7, 8.4)], finalClimb: true, description: "Final en alto muy selectivo." }),
  stage("tour", 10, "Tour 10 - Llanura de Recuperación", "flat", 188, 36, { elevationGain: 800, description: "Transición con sprint probable." }),
  stage("tour", 11, "Tour 11 - Crono Individual", "time_trial", 37, 70, { elevationGain: 550, intermediateSprints: false, finishBonuses: false, description: "Crono individual de media distancia." }),
  stage("tour", 12, "Tour 12 - Camino de los Viñedos", "flat", 211, 42, { elevationGain: 1100, heat: 65, description: "Etapa larga y calurosa." }),
  stage("tour", 13, "Tour 13 - Colinas Encadenadas", "hilly", 194, 76, { elevationGain: 3400, climbs: [climb("Côte de la Croix", "2", 121, 6.2, 7.0), climb("Côte du Château", "3", 181, 3.2, 8.2)], description: "Jornada favorable a la fuga." }),
  stage("tour", 14, "Tour 14 - Etapa Reina", "mountain", 178, 98, { elevationGain: 5200, climbs: [climb("Col de la Madeleine", "HC", 82, 19.2, 7.8), climb("Col du Télégraphe", "1", 131, 11.8, 7.3), climb("Final en alto", "HC", 178, 15.4, 8.1)], finalClimb: true, description: "Día más duro de la carrera." }),
  stage("tour", 15, "Tour 15 - Montaña Acumulada", "mountain", 183, 94, { elevationGain: 4700, climbs: [climb("Col de Sarenne", "1", 96, 13.0, 7.0), climb("La Toussuire", "HC", 183, 16.1, 7.3)], finalClimb: true, description: "Segundo día de montaña consecutivo." }),
  stage("tour", 16, "Tour 16 - Sprint Tardío", "flat", 169, 35, { elevationGain: 650, description: "Sprinters con piernas castigadas." }),
  stage("tour", 17, "Tour 17 - Alta Montaña Explosiva", "mountain", 136, 90, { elevationGain: 3900, climbs: [climb("Col court", "2", 45, 6.5, 7.7), climb("Final explosivo", "1", 136, 8.8, 9.1)], finalClimb: true, description: "Etapa corta para ataques." }),
  stage("tour", 18, "Tour 18 - Gran Fondo Alpino", "mountain", 201, 96, { elevationGain: 5000, climbs: [climb("Col de Vars", "1", 73, 14.2, 6.8), climb("Izoard", "HC", 141, 14.1, 7.3), climb("Final alpino", "HC", 201, 12.9, 8.5)], finalClimb: true, description: "Última gran etapa de montaña." }),
  stage("tour", 19, "Tour 19 - Crono Final", "time_trial", 31, 74, { elevationGain: 700, intermediateSprints: false, finishBonuses: false, description: "Crono decisiva de tercera semana." }),
  stage("tour", 20, "Tour 20 - Muros Finales", "hilly", 143, 82, { elevationGain: 2800, climbs: [climb("Mur du Signal", "2", 132, 2.4, 10.8), climb("Côte Finale", "3", 140, 1.8, 9.0)], description: "Última oportunidad ofensiva." }),
  stage("tour", 21, "Tour 21 - Paseo Final", "flat", 115, 25, { elevationGain: 400, description: "Etapa final y sprint probable." })
];

function cloneStagesForRace(stages, raceId, raceLabel, bias = 0) {
  return stages.map(stageItem => {
    const copy = JSON.parse(JSON.stringify(stageItem));
    copy.id = `${raceId}_${String(copy.number).padStart(2, "0")}`;
    copy.name = copy.name.replace("Tour", raceLabel);
    copy.difficulty = dataClamp(copy.difficulty + bias, 20, 100);

    if (raceId === "giro") {
      copy.profile.rainRisk = dataClamp(copy.profile.rainRisk + 8, 5, 75);
    }

    if (raceId === "vuelta") {
      copy.profile.heat = dataClamp(copy.profile.heat + 12, 20, 95);
    }

    copy.sectors = buildStageSectors(copy.type, copy.distance, copy.difficulty, copy.profile);
    return copy;
  });
}

const ONE_DAY_RACES = [
  {
    id: "roubaix",
    name: "Paris-Roubaix",
    country: "France",
    leaderJerseyName: "Ganador",
    leaderJerseyClass: "jersey-cobbles",
    uciClass: "monument",
    stages: [
      stage("roubaix", 1, "Paris-Roubaix", "cobbles_hills", 257, 98, {
        elevationGain: 1600,
        roadSurface: "pavé",
        rainRisk: 45,
        windExposure: 55,
        climbs: [climb("Trouée d'Arenberg", "2", 162, 2.3, 2.0), climb("Carrefour de l'Arbre", "2", 240, 2.1, 2.0)],
        description: "Monumento extremo de pavés; colocación y resistencia son críticas."
      })
    ]
  },
  {
    id: "flanders",
    name: "Tour de Flandes",
    country: "Belgium",
    leaderJerseyName: "Ganador",
    leaderJerseyClass: "jersey-yellow",
    uciClass: "monument",
    stages: [
      stage("flanders", 1, "Tour de Flandes", "cobbles_hills", 272, 96, {
        elevationGain: 2900,
        roadSurface: "pavé",
        windExposure: 50,
        climbs: [climb("Oude Kwaremont", "2", 220, 2.2, 4.0), climb("Paterberg", "2", 247, 0.4, 12.9)],
        description: "Muros flamencos, pavés y ataques violentos."
      })
    ]
  },
  {
    id: "liege",
    name: "Liège-Bastogne-Liège",
    country: "Belgium",
    leaderJerseyName: "Ganador",
    leaderJerseyClass: "jersey-red",
    uciClass: "monument",
    stages: [
      stage("liege", 1, "Liège-Bastogne-Liège", "hilly", 259, 94, {
        elevationGain: 4100,
        climbs: [climb("La Redoute", "1", 220, 2.0, 8.9), climb("Roche-aux-Faucons", "1", 242, 1.3, 11.0)],
        description: "Clásica de desgaste para puncheurs y escaladores explosivos."
      })
    ]
  },
  {
    id: "lombardia",
    name: "Il Lombardia",
    country: "Italy",
    leaderJerseyName: "Ganador",
    leaderJerseyClass: "jersey-pink",
    uciClass: "monument",
    stages: [
      stage("lombardia", 1, "Il Lombardia", "hilly", 253, 95, {
        elevationGain: 4400,
        technicalDescent: 75,
        climbs: [climb("Madonna del Ghisallo", "1", 166, 8.6, 6.2), climb("Civiglio", "1", 235, 4.2, 9.7)],
        description: "Monumento de otoño con subidas y bajadas técnicas."
      })
    ]
  },
  {
    id: "worlds",
    name: "Campeonato del Mundo",
    country: "World",
    leaderJerseyName: "Arcoíris",
    leaderJerseyClass: "jersey-rainbow",
    uciClass: "worlds",
    stages: [
      stage("worlds", 1, "Mundial en ruta", "hilly", 268, 97, {
        elevationGain: 3600,
        climbs: [climb("Circuito duro", "2", 210, 3.1, 7.8), climb("Último muro", "3", 263, 1.0, 9.5)],
        description: "Mundial exigente: resistencia, colocación y explosividad."
      })
    ]
  }
];

const RACES = [
  {
    id: "tour",
    name: "Tour de France",
    country: "France",
    leaderJerseyName: "Maillot amarillo",
    leaderJerseyClass: "jersey-yellow",
    uciClass: "grand_tour",
    stages: TOUR_STAGES
  },
  {
    id: "giro",
    name: "Giro d'Italia",
    country: "Italy",
    leaderJerseyName: "Maglia rosa",
    leaderJerseyClass: "jersey-pink",
    uciClass: "grand_tour",
    stages: cloneStagesForRace(TOUR_STAGES, "giro", "Giro", 2)
  },
  {
    id: "vuelta",
    name: "La Vuelta a España",
    country: "Spain",
    leaderJerseyName: "Maillot rojo",
    leaderJerseyClass: "jersey-red",
    uciClass: "grand_tour",
    stages: cloneStagesForRace(TOUR_STAGES, "vuelta", "Vuelta", 1)
  },
  ...ONE_DAY_RACES
];

const SEASON_RACE_IDS = ["giro", "tour", "vuelta", "flanders", "roubaix", "liege", "lombardia", "worlds"];
const DEFAULT_RACE_ID = "tour";
const STAGES = RACES.find(race => race.id === DEFAULT_RACE_ID).stages;
