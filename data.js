/* ============================================================
   CYCLING MANAGER TOUR - data.js
   v0.4: carreras múltiples, equipos/corredores reales, perfiles,
   UCI points, puntos, montaña, jóvenes y equipos.
   ============================================================ */

const TEAM_BLUEPRINTS = [
  {
    id: "uae",
    name: "UAE Team Emirates XRG",
    archetype: "GC / Superteam",
    description: "Equipo dominante de grandes vueltas, montaña, cronos y clásicas.",
    color: "green",
    modifiers: {
      flat: 3,
      sprint: 1,
      timeTrial: 5,
      teamTimeTrial: 5,
      mountain: 7,
      cobbles: 1,
      hills: 5,
      stamina: 6,
      recovery: 6,
      acceleration: 5,
      positioning: 5,
      downhill: 3,
      form: 4
    }
  },
  {
    id: "visma",
    name: "Team Visma | Lease a Bike",
    archetype: "GC / Bloque",
    description: "Bloque de gran vuelta muy fuerte en montaña, recuperación y trabajo colectivo.",
    color: "yellow",
    modifiers: {
      flat: 2,
      sprint: 1,
      timeTrial: 4,
      teamTimeTrial: 6,
      mountain: 6,
      cobbles: 2,
      hills: 4,
      stamina: 6,
      recovery: 7,
      acceleration: 3,
      positioning: 6,
      downhill: 4,
      form: 3
    }
  },
  {
    id: "ineos",
    name: "Netcompany INEOS",
    archetype: "Crono / GC",
    description: "Equipo orientado a cronos, rodadores, ciencia deportiva y líderes de general.",
    color: "blue",
    modifiers: {
      flat: 4,
      sprint: -1,
      timeTrial: 8,
      teamTimeTrial: 8,
      mountain: 3,
      cobbles: 1,
      hills: 2,
      stamina: 5,
      recovery: 4,
      acceleration: 0,
      positioning: 4,
      downhill: 2,
      form: 2
    }
  },
  {
    id: "movistar",
    name: "Movistar Team",
    archetype: "Montaña / Etapas",
    description: "Equipo español con foco en montaña, fugas, general y etapas selectivas.",
    color: "blue",
    modifiers: {
      flat: 0,
      sprint: -2,
      timeTrial: 1,
      teamTimeTrial: 1,
      mountain: 5,
      cobbles: -2,
      hills: 4,
      stamina: 4,
      recovery: 4,
      acceleration: 2,
      positioning: 2,
      downhill: 3,
      form: 2
    }
  },
  {
    id: "redbull",
    name: "Red Bull - BORA - hansgrohe",
    archetype: "GC / Potencia",
    description: "Equipo muy fuerte en líderes de general, montaña y potencia sostenida.",
    color: "orange",
    modifiers: {
      flat: 2,
      sprint: 1,
      timeTrial: 4,
      teamTimeTrial: 4,
      mountain: 6,
      cobbles: 0,
      hills: 3,
      stamina: 5,
      recovery: 5,
      acceleration: 3,
      positioning: 3,
      downhill: 2,
      form: 3
    }
  },
  {
    id: "soudal",
    name: "Soudal Quick-Step",
    archetype: "Crono / Sprint",
    description: "Equipo muy fuerte en cronos, velocidad, etapas llanas y talento ofensivo.",
    color: "blue",
    modifiers: {
      flat: 4,
      sprint: 5,
      timeTrial: 7,
      teamTimeTrial: 5,
      mountain: 1,
      cobbles: 3,
      hills: 3,
      stamina: 3,
      recovery: 2,
      acceleration: 5,
      positioning: 4,
      downhill: 1,
      form: 2
    }
  },
  {
    id: "lidl",
    name: "Lidl - Trek",
    archetype: "Clásicas / Sprint / GC",
    description: "Equipo muy completo: clásicas, sprint, montaña y corredores de general.",
    color: "red",
    modifiers: {
      flat: 4,
      sprint: 6,
      timeTrial: 3,
      teamTimeTrial: 3,
      mountain: 4,
      cobbles: 5,
      hills: 5,
      stamina: 4,
      recovery: 3,
      acceleration: 5,
      positioning: 4,
      downhill: 3,
      form: 3
    }
  },
  {
    id: "alpecin",
    name: "Alpecin - Premier Tech",
    archetype: "Clásicas / Sprint",
    description: "Equipo de clasicómanos y velocistas, brutal en pavés, muros y finales explosivos.",
    color: "orange",
    modifiers: {
      flat: 5,
      sprint: 8,
      timeTrial: 0,
      teamTimeTrial: 1,
      mountain: -4,
      cobbles: 9,
      hills: 7,
      stamina: 4,
      recovery: 0,
      acceleration: 8,
      positioning: 7,
      downhill: 3,
      form: 3
    }
  },
  {
    id: "bahrain",
    name: "Bahrain Victorious",
    archetype: "Montaña / Clásicas",
    description: "Equipo equilibrado con buenos escaladores, clasicómanos y cazadores de etapa.",
    color: "red",
    modifiers: {
      flat: 2,
      sprint: 2,
      timeTrial: 2,
      teamTimeTrial: 2,
      mountain: 4,
      cobbles: 3,
      hills: 5,
      stamina: 4,
      recovery: 3,
      acceleration: 4,
      positioning: 3,
      downhill: 4,
      form: 2
    }
  },
  {
    id: "decathlon",
    name: "Decathlon CMA CGM Team",
    archetype: "Montaña / Desarrollo",
    description: "Equipo con escaladores, jóvenes talentos y buen rendimiento en media montaña.",
    color: "green",
    modifiers: {
      flat: 0,
      sprint: 1,
      timeTrial: 1,
      teamTimeTrial: 1,
      mountain: 5,
      cobbles: 0,
      hills: 5,
      stamina: 4,
      recovery: 3,
      acceleration: 4,
      positioning: 2,
      downhill: 3,
      form: 3
    }
  }
];

const TEAMS = TEAM_BLUEPRINTS.map(team => ({
  id: team.id,
  name: team.name,
  archetype: team.archetype,
  description: team.description,
  color: team.color
}));

const ROLE_TEMPLATES = {
  gc: {
    role: "Líder GC",
    ageBase: 28,
    abandonRisk: 0.016,
    stats: {
      flat: 80,
      sprint: 66,
      timeTrial: 84,
      teamTimeTrial: 84,
      mountain: 88,
      cobbles: 68,
      hills: 84,
      stamina: 90,
      recovery: 89,
      acceleration: 80,
      positioning: 84,
      downhill: 82,
      consistency: 88,
      injuryResistance: 82
    },
    form: 84
  },
  co_leader: {
    role: "Co-líder",
    ageBase: 27,
    abandonRisk: 0.018,
    stats: {
      flat: 78,
      sprint: 64,
      timeTrial: 80,
      teamTimeTrial: 81,
      mountain: 85,
      cobbles: 66,
      hills: 82,
      stamina: 87,
      recovery: 86,
      acceleration: 78,
      positioning: 80,
      downhill: 80,
      consistency: 84,
      injuryResistance: 81
    },
    form: 82
  },
  climber: {
    role: "Escalador",
    ageBase: 27,
    abandonRisk: 0.021,
    stats: {
      flat: 72,
      sprint: 58,
      timeTrial: 72,
      teamTimeTrial: 74,
      mountain: 87,
      cobbles: 56,
      hills: 81,
      stamina: 86,
      recovery: 85,
      acceleration: 78,
      positioning: 76,
      downhill: 80,
      consistency: 82,
      injuryResistance: 78
    },
    form: 81
  },
  time_trialist: {
    role: "Croner",
    ageBase: 28,
    abandonRisk: 0.017,
    stats: {
      flat: 84,
      sprint: 64,
      timeTrial: 86,
      teamTimeTrial: 87,
      mountain: 74,
      cobbles: 68,
      hills: 75,
      stamina: 84,
      recovery: 81,
      acceleration: 70,
      positioning: 78,
      downhill: 76,
      consistency: 84,
      injuryResistance: 80
    },
    form: 81
  },
  sprinter: {
    role: "Sprinter",
    ageBase: 29,
    abandonRisk: 0.026,
    stats: {
      flat: 84,
      sprint: 88,
      timeTrial: 70,
      teamTimeTrial: 76,
      mountain: 62,
      cobbles: 72,
      hills: 72,
      stamina: 80,
      recovery: 76,
      acceleration: 89,
      positioning: 86,
      downhill: 74,
      consistency: 78,
      injuryResistance: 75
    },
    form: 81
  },
  classics: {
    role: "Clasicómano",
    ageBase: 29,
    abandonRisk: 0.024,
    stats: {
      flat: 82,
      sprint: 78,
      timeTrial: 75,
      teamTimeTrial: 78,
      mountain: 72,
      cobbles: 83,
      hills: 84,
      stamina: 84,
      recovery: 80,
      acceleration: 84,
      positioning: 87,
      downhill: 80,
      consistency: 80,
      injuryResistance: 77
    },
    form: 81
  },
  rouleur: {
    role: "Rodador",
    ageBase: 29,
    abandonRisk: 0.018,
    stats: {
      flat: 85,
      sprint: 70,
      timeTrial: 80,
      teamTimeTrial: 83,
      mountain: 72,
      cobbles: 72,
      hills: 75,
      stamina: 83,
      recovery: 80,
      acceleration: 72,
      positioning: 79,
      downhill: 76,
      consistency: 82,
      injuryResistance: 82
    },
    form: 79
  },
  domestique: {
    role: "Gregario",
    ageBase: 29,
    abandonRisk: 0.019,
    stats: {
      flat: 78,
      sprint: 66,
      timeTrial: 75,
      teamTimeTrial: 78,
      mountain: 78,
      cobbles: 66,
      hills: 77,
      stamina: 82,
      recovery: 81,
      acceleration: 73,
      positioning: 78,
      downhill: 76,
      consistency: 80,
      injuryResistance: 82
    },
    form: 78
  },
  puncheur: {
    role: "Puncheur",
    ageBase: 26,
    abandonRisk: 0.023,
    stats: {
      flat: 78,
      sprint: 76,
      timeTrial: 74,
      teamTimeTrial: 76,
      mountain: 78,
      cobbles: 72,
      hills: 86,
      stamina: 83,
      recovery: 80,
      acceleration: 86,
      positioning: 82,
      downhill: 80,
      consistency: 78,
      injuryResistance: 77
    },
    form: 81
  }
};

const TEAM_RIDER_BLUEPRINTS = {
  uae: [
    { name: "Tadej Pogačar", nationality: "Slovenia", age: 27, roleKey: "gc" },
    { name: "João Almeida", nationality: "Portugal", age: 27, roleKey: "co_leader" },
    { name: "Adam Yates", nationality: "Great Britain", age: 33, roleKey: "climber" },
    { name: "Isaac del Toro", nationality: "Mexico", age: 22, roleKey: "puncheur" },
    { name: "Brandon McNulty", nationality: "United States", age: 28, roleKey: "time_trialist" },
    { name: "Tim Wellens", nationality: "Belgium", age: 35, roleKey: "classics" },
    { name: "Pavel Sivakov", nationality: "France", age: 29, roleKey: "domestique" },
    { name: "Nils Politt", nationality: "Germany", age: 32, roleKey: "rouleur" }
  ],
  visma: [
    { name: "Jonas Vingegaard", nationality: "Denmark", age: 29, roleKey: "gc" },
    { name: "Matteo Jorgenson", nationality: "United States", age: 27, roleKey: "co_leader" },
    { name: "Sepp Kuss", nationality: "United States", age: 31, roleKey: "climber" },
    { name: "Wilco Kelderman", nationality: "Netherlands", age: 35, roleKey: "domestique" },
    { name: "Dylan van Baarle", nationality: "Netherlands", age: 34, roleKey: "rouleur" },
    { name: "Christophe Laporte", nationality: "France", age: 33, roleKey: "classics" },
    { name: "Olav Kooij", nationality: "Netherlands", age: 24, roleKey: "sprinter" },
    { name: "Tiesj Benoot", nationality: "Belgium", age: 32, roleKey: "puncheur" }
  ],
  ineos: [
    { name: "Egan Bernal", nationality: "Colombia", age: 29, roleKey: "gc" },
    { name: "Carlos Rodríguez", nationality: "Spain", age: 25, roleKey: "co_leader" },
    { name: "Thymen Arensman", nationality: "Netherlands", age: 26, roleKey: "climber" },
    { name: "Filippo Ganna", nationality: "Italy", age: 29, roleKey: "time_trialist" },
    { name: "Joshua Tarling", nationality: "Great Britain", age: 22, roleKey: "time_trialist" },
    { name: "Magnus Sheffield", nationality: "United States", age: 24, roleKey: "rouleur" },
    { name: "Laurens De Plus", nationality: "Belgium", age: 30, roleKey: "domestique" },
    { name: "Ben Turner", nationality: "Great Britain", age: 27, roleKey: "classics" }
  ],
  movistar: [
    { name: "Enric Mas", nationality: "Spain", age: 31, roleKey: "gc" },
    { name: "Nairo Quintana", nationality: "Colombia", age: 36, roleKey: "climber" },
    { name: "Einer Rubio", nationality: "Colombia", age: 28, roleKey: "climber" },
    { name: "Iván Romeo", nationality: "Spain", age: 23, roleKey: "time_trialist" },
    { name: "Alex Aranburu", nationality: "Spain", age: 30, roleKey: "classics" },
    { name: "Fernando Gaviria", nationality: "Colombia", age: 31, roleKey: "sprinter" },
    { name: "Davide Formolo", nationality: "Italy", age: 33, roleKey: "domestique" },
    { name: "Pelayo Sánchez", nationality: "Spain", age: 26, roleKey: "puncheur" }
  ],
  redbull: [
    { name: "Primož Roglič", nationality: "Slovenia", age: 36, roleKey: "gc" },
    { name: "Jai Hindley", nationality: "Australia", age: 30, roleKey: "climber" },
    { name: "Aleksandr Vlasov", nationality: "Russia", age: 30, roleKey: "co_leader" },
    { name: "Daniel Martínez", nationality: "Colombia", age: 30, roleKey: "climber" },
    { name: "Florian Lipowitz", nationality: "Germany", age: 25, roleKey: "climber" },
    { name: "Roger Adrià", nationality: "Spain", age: 28, roleKey: "puncheur" },
    { name: "Sam Welsford", nationality: "Australia", age: 30, roleKey: "sprinter" },
    { name: "Bob Jungels", nationality: "Luxembourg", age: 33, roleKey: "rouleur" }
  ],
  soudal: [
    { name: "Remco Evenepoel", nationality: "Belgium", age: 26, roleKey: "gc" },
    { name: "Mikel Landa", nationality: "Spain", age: 36, roleKey: "climber" },
    { name: "Ilan Van Wilder", nationality: "Belgium", age: 26, roleKey: "co_leader" },
    { name: "Tim Merlier", nationality: "Belgium", age: 33, roleKey: "sprinter" },
    { name: "Kasper Asgreen", nationality: "Denmark", age: 31, roleKey: "rouleur" },
    { name: "Yves Lampaert", nationality: "Belgium", age: 35, roleKey: "time_trialist" },
    { name: "Mauri Vansevenant", nationality: "Belgium", age: 27, roleKey: "puncheur" },
    { name: "Bert Van Lerberghe", nationality: "Belgium", age: 33, roleKey: "domestique" }
  ],
  lidl: [
    { name: "Juan Ayuso", nationality: "Spain", age: 24, roleKey: "gc" },
    { name: "Mattias Skjelmose", nationality: "Denmark", age: 26, roleKey: "co_leader" },
    { name: "Giulio Ciccone", nationality: "Italy", age: 31, roleKey: "climber" },
    { name: "Mads Pedersen", nationality: "Denmark", age: 30, roleKey: "classics" },
    { name: "Jonathan Milan", nationality: "Italy", age: 26, roleKey: "sprinter" },
    { name: "Tao Geoghegan Hart", nationality: "Great Britain", age: 31, roleKey: "climber" },
    { name: "Simone Consonni", nationality: "Italy", age: 31, roleKey: "rouleur" },
    { name: "Jasper Stuyven", nationality: "Belgium", age: 34, roleKey: "classics" }
  ],
  alpecin: [
    { name: "Mathieu van der Poel", nationality: "Netherlands", age: 31, roleKey: "classics" },
    { name: "Jasper Philipsen", nationality: "Belgium", age: 28, roleKey: "sprinter" },
    { name: "Kaden Groves", nationality: "Australia", age: 27, roleKey: "sprinter" },
    { name: "Søren Kragh Andersen", nationality: "Denmark", age: 32, roleKey: "rouleur" },
    { name: "Quinten Hermans", nationality: "Belgium", age: 31, roleKey: "puncheur" },
    { name: "Gianni Vermeersch", nationality: "Belgium", age: 33, roleKey: "classics" },
    { name: "Tibor Del Grosso", nationality: "Netherlands", age: 23, roleKey: "puncheur" },
    { name: "Silvan Dillier", nationality: "Switzerland", age: 36, roleKey: "domestique" }
  ],
  bahrain: [
    { name: "Pello Bilbao", nationality: "Spain", age: 36, roleKey: "gc" },
    { name: "Santiago Buitrago", nationality: "Colombia", age: 26, roleKey: "climber" },
    { name: "Antonio Tiberi", nationality: "Italy", age: 25, roleKey: "co_leader" },
    { name: "Matej Mohorič", nationality: "Slovenia", age: 31, roleKey: "classics" },
    { name: "Phil Bauhaus", nationality: "Germany", age: 32, roleKey: "sprinter" },
    { name: "Jack Haig", nationality: "Australia", age: 33, roleKey: "climber" },
    { name: "Fred Wright", nationality: "Great Britain", age: 27, roleKey: "rouleur" },
    { name: "Kamil Gradek", nationality: "Poland", age: 36, roleKey: "time_trialist" }
  ],
  decathlon: [
    { name: "Felix Gall", nationality: "Austria", age: 28, roleKey: "gc" },
    { name: "Paul Seixas", nationality: "France", age: 20, roleKey: "climber" },
    { name: "Paul Lapeira", nationality: "France", age: 26, roleKey: "puncheur" },
    { name: "Dorian Godon", nationality: "France", age: 30, roleKey: "classics" },
    { name: "Bruno Armirail", nationality: "France", age: 32, roleKey: "time_trialist" },
    { name: "Oliver Naesen", nationality: "Belgium", age: 35, roleKey: "rouleur" },
    { name: "Sam Bennett", nationality: "Ireland", age: 35, roleKey: "sprinter" },
    { name: "Aurélien Paret-Peintre", nationality: "France", age: 30, roleKey: "climber" }
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
    const base = baseStats[statName];
    const modifier = modifiers[statName] || 0;
    const noise = deterministicNoise(teamIndex, riderIndex, statName);

    stats[statName] = dataClamp(base + modifier + noise, 42, 99);
  });

  return stats;
}

function generateRiders() {
  const riders = [];

  TEAM_BLUEPRINTS.forEach((team, teamIndex) => {
    TEAM_RIDER_BLUEPRINTS[team.id].forEach((riderData, riderIndex) => {
      const template = ROLE_TEMPLATES[riderData.roleKey];
      const id = `${team.id}_${String(riderIndex + 1).padStart(2, "0")}`;

      riders.push({
        id,
        name: riderData.name,
        teamId: team.id,
        role: template.role,
        roleKey: riderData.roleKey,
        nationality: riderData.nationality,
        age: riderData.age || template.ageBase,
        speciality: template.role,
        stats: buildStats(template.stats, team.modifiers, teamIndex, riderIndex),
        form: dataClamp(
          template.form + team.modifiers.form + deterministicNoise(teamIndex, riderIndex, "form"),
          68,
          98
        ),
        morale: dataClamp(
          78 + team.modifiers.form + deterministicNoise(teamIndex, riderIndex, "morale"),
          55,
          96
        ),
        energy: 100,
        fatigue: 0,
        totalTime: 0,
        raceDays: 0,
        points: 0,
        mountainPoints: 0,
        uciPoints: 0,
        abandonRisk: template.abandonRisk,
        abandoned: false
      });
    });
  });

  return riders;
}

const RIDERS = generateRiders();

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
    secondaryFinal: [120, 50, 25]
  }
};

function climb(name, category, km, length, gradient) {
  return { name, category, km, length, gradient };
}

function sprint(km) {
  return { km, points: CLASSIFICATION_RULES.intermediateSprintPoints };
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

  return {
    id: `${idPrefix}_${String(number).padStart(2, "0")}`,
    number,
    name,
    type,
    label: labels[type] || type,
    distance,
    difficulty,
    description: profile.description || "Etapa de gran vuelta.",
    profile: {
      elevationGain: profile.elevationGain || 800,
      finalClimb: !!profile.finalClimb,
      technicalDescent: profile.technicalDescent || 25,
      windExposure: profile.windExposure || 25,
      heat: profile.heat || 45,
      rainRisk: profile.rainRisk || 20,
      roadSurface: profile.roadSurface || "normal",
      climbs: profile.climbs || [],
      intermediateSprints: profile.intermediateSprints || [sprint(Math.round(distance * 0.45))],
      finishBonuses: profile.finishBonuses === false ? [] : CLASSIFICATION_RULES.finishBonuses
    }
  };
}

const TOUR_STAGES = [
  stage("tour", 1, "Tour 1 - Grand Départ Costero", "flat", 182, 34, {
    elevationGain: 900,
    windExposure: 55,
    description: "Primera etapa favorable al sprint, con riesgo de abanicos."
  }),
  stage("tour", 2, "Tour 2 - Muros del Interior", "hilly", 171, 68, {
    elevationGain: 2500,
    climbs: [
      climb("Côte de Saint-Romain", "3", 96, 3.8, 6.1),
      climb("Mur final", "2", 168, 2.2, 9.4)
    ],
    description: "Final quebrado con repechos y bonificaciones decisivas."
  }),
  stage("tour", 3, "Tour 3 - Llanura del Norte", "flat", 198, 38, {
    elevationGain: 700,
    windExposure: 42,
    description: "Día largo para sprinters y control de equipos rápidos."
  }),
  stage("tour", 4, "Tour 4 - Crono por Equipos", "team_time_trial", 41, 62, {
    elevationGain: 400,
    intermediateSprints: [],
    finishBonuses: false,
    description: "Test colectivo para bloques de GC."
  }),
  stage("tour", 5, "Tour 5 - Pavés y Muros", "cobbles_hills", 204, 88, {
    elevationGain: 2100,
    roadSurface: "pavé",
    rainRisk: 35,
    climbs: [
      climb("Sector pavé 1", "4", 72, 2.0, 3.0),
      climb("Mur de la Chapelle", "2", 187, 1.6, 10.2)
    ],
    description: "Etapa caótica con pavés, muros y riesgo alto."
  }),
  stage("tour", 6, "Tour 6 - Sprint del Valle", "flat", 176, 32, {
    elevationGain: 650,
    description: "Oportunidad clara para velocistas."
  }),
  stage("tour", 7, "Tour 7 - Primer Contacto Alpino", "mountain", 164, 84, {
    elevationGain: 3900,
    climbs: [
      climb("Col de la Biche", "1", 88, 11.5, 7.1),
      climb("Mont du Cerf", "1", 153, 9.6, 8.0)
    ],
    finalClimb: true,
    description: "Primera etapa de montaña para testar líderes."
  }),
  stage("tour", 8, "Tour 8 - Etapa Trampa", "hilly", 186, 72, {
    elevationGain: 3100,
    climbs: [
      climb("Côte des Vignes", "3", 44, 4.1, 5.8),
      climb("Côte du Signal", "2", 176, 4.4, 7.5)
    ],
    description: "Ideal para fugas y clasicómanos."
  }),
  stage("tour", 9, "Tour 9 - Cima de los Lagos", "mountain", 152, 91, {
    elevationGain: 4300,
    climbs: [
      climb("Port de Balès", "HC", 94, 18.6, 7.2),
      climb("Lagos", "HC", 152, 13.7, 8.4)
    ],
    finalClimb: true,
    description: "Final en alto muy selectivo."
  }),
  stage("tour", 10, "Tour 10 - Llanura de Recuperación", "flat", 188, 36, {
    elevationGain: 800,
    description: "Transición con sprint probable."
  }),
  stage("tour", 11, "Tour 11 - Crono Individual", "time_trial", 37, 70, {
    elevationGain: 550,
    intermediateSprints: [],
    finishBonuses: false,
    description: "Crono individual de media distancia."
  }),
  stage("tour", 12, "Tour 12 - Camino de los Viñedos", "flat", 211, 42, {
    elevationGain: 1100,
    heat: 65,
    description: "Etapa larga: desgaste para sprinters resistentes."
  }),
  stage("tour", 13, "Tour 13 - Colinas Encadenadas", "hilly", 194, 76, {
    elevationGain: 3400,
    climbs: [
      climb("Côte de la Croix", "2", 121, 6.2, 7.0),
      climb("Côte du Château", "3", 181, 3.2, 8.2)
    ],
    description: "Jornada muy favorable a la fuga."
  }),
  stage("tour", 14, "Tour 14 - Etapa Reina", "mountain", 178, 98, {
    elevationGain: 5200,
    climbs: [
      climb("Col de la Madeleine", "HC", 82, 19.2, 7.8),
      climb("Col du Télégraphe", "1", 131, 11.8, 7.3),
      climb("Final en alto", "HC", 178, 15.4, 8.1)
    ],
    finalClimb: true,
    description: "Día más duro: grandes diferencias en GC."
  }),
  stage("tour", 15, "Tour 15 - Montaña Acumulada", "mountain", 183, 94, {
    elevationGain: 4700,
    climbs: [
      climb("Col de Sarenne", "1", 96, 13.0, 7.0),
      climb("La Toussuire", "HC", 183, 16.1, 7.3)
    ],
    finalClimb: true,
    description: "Segundo día de montaña consecutivo."
  }),
  stage("tour", 16, "Tour 16 - Sprint Tardío", "flat", 169, 35, {
    elevationGain: 650,
    description: "Sprinters con piernas castigadas."
  }),
  stage("tour", 17, "Tour 17 - Alta Montaña Explosiva", "mountain", 136, 90, {
    elevationGain: 3900,
    climbs: [
      climb("Col court", "2", 45, 6.5, 7.7),
      climb("Final explosivo", "1", 136, 8.8, 9.1)
    ],
    finalClimb: true,
    description: "Etapa corta para ataques lejanos."
  }),
  stage("tour", 18, "Tour 18 - Gran Fondo Alpino", "mountain", 201, 96, {
    elevationGain: 5000,
    climbs: [
      climb("Col de Vars", "1", 73, 14.2, 6.8),
      climb("Izoard", "HC", 141, 14.1, 7.3),
      climb("Final alpino", "HC", 201, 12.9, 8.5)
    ],
    finalClimb: true,
    description: "Última gran etapa de montaña."
  }),
  stage("tour", 19, "Tour 19 - Crono Final", "time_trial", 31, 74, {
    elevationGain: 700,
    intermediateSprints: [],
    finishBonuses: false,
    description: "Crono decisiva de tercera semana."
  }),
  stage("tour", 20, "Tour 20 - Muros Finales", "hilly", 143, 82, {
    elevationGain: 2800,
    climbs: [
      climb("Mur du Signal", "2", 132, 2.4, 10.8),
      climb("Côte Finale", "3", 140, 1.8, 9.0)
    ],
    description: "Última oportunidad ofensiva."
  }),
  stage("tour", 21, "Tour 21 - Paseo Final", "flat", 115, 25, {
    elevationGain: 400,
    description: "Etapa final: sprint probable y celebración del líder."
  })
];

function cloneStagesForRace(stages, raceId, raceLabel, jerseyBias) {
  return stages.map(stageItem => ({
    ...JSON.parse(JSON.stringify(stageItem)),
    id: `${raceId}_${String(stageItem.number).padStart(2, "0")}`,
    name: stageItem.name.replace("Tour", raceLabel),
    difficulty: dataClamp(stageItem.difficulty + (jerseyBias || 0), 20, 100),
    profile: {
      ...JSON.parse(JSON.stringify(stageItem.profile)),
      heat: dataClamp((stageItem.profile.heat || 45) + (raceId === "vuelta" ? 12 : 0), 20, 95),
      rainRisk: dataClamp((stageItem.profile.rainRisk || 20) + (raceId === "giro" ? 8 : 0), 5, 70)
    }
  }));
}

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
  }
];

const DEFAULT_RACE_ID = "tour";
const STAGES = RACES.find(race => race.id === DEFAULT_RACE_ID).stages;

const TACTICS = [
  {
    id: "conservative",
    name: "Conservar",
    description: "Menor riesgo y menor fatiga. Ideal para proteger a un corredor tocado.",
    bonus: -2,
    risk: 0.06,
    fatigueMultiplier: 0.62,
    supportBonus: 0,
    sprintTrainBonus: 0
  },
  {
    id: "balanced",
    name: "Equilibrado",
    description: "Estrategia neutra. Buen compromiso entre rendimiento y desgaste.",
    bonus: 0,
    risk: 0.16,
    fatigueMultiplier: 1.0,
    supportBonus: 0,
    sprintTrainBonus: 0
  },
  {
    id: "protect_leader",
    name: "Proteger líder",
    description: "El corredor sacrifica rendimiento para ayudar al líder protegido.",
    bonus: -1,
    risk: 0.12,
    fatigueMultiplier: 1.20,
    supportBonus: 2.4,
    sprintTrainBonus: 0
  },
  {
    id: "aggressive",
    name: "Atacar",
    description: "Mejor rendimiento potencial, más fatiga y más probabilidad de fallo.",
    bonus: 4,
    risk: 0.36,
    fatigueMultiplier: 1.45,
    supportBonus: 0,
    sprintTrainBonus: 0
  },
  {
    id: "all_in",
    name: "Todo o nada",
    description: "Máximo riesgo. Puede romper la carrera o hundir al corredor.",
    bonus: 8,
    risk: 0.62,
    fatigueMultiplier: 2.0,
    supportBonus: 0,
    sprintTrainBonus: 0
  },
  {
    id: "sprint_train",
    name: "Tren de sprint",
    description: "Útil en etapas llanas. Ayuda al sprinter del equipo en el final.",
    bonus: -1,
    risk: 0.22,
    fatigueMultiplier: 1.30,
    supportBonus: 0,
    sprintTrainBonus: 2.6
  }
];
