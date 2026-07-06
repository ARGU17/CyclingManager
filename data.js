/* ============================================================
   CYCLING MANAGER TOUR - data.js
   10 equipos x 8 corredores = 80 corredores
   21 etapas tipo Tour / Gran Vuelta
   ============================================================ */

/* ============================================================
   EQUIPOS
   ============================================================ */

const TEAM_BLUEPRINTS = [
  {
    id: "atlas_gc",
    name: "Atlas Grand Tour",
    archetype: "GC",
    description: "Superestructura de gran vuelta: líder completo, escaladores, croners y gregarios de lujo.",
    color: "green",
    modifiers: {
      flat: 2,
      sprint: 0,
      timeTrial: 4,
      teamTimeTrial: 4,
      mountain: 4,
      cobbles: 0,
      hills: 2,
      stamina: 4,
      recovery: 4,
      acceleration: 1,
      form: 3
    }
  },
  {
    id: "basque_mountain",
    name: "Basque Climbing Project",
    archetype: "Escalador",
    description: "Equipo de montaña pura. Muy fuerte en puertos largos y etapas encadenadas.",
    color: "green",
    modifiers: {
      flat: -2,
      sprint: -4,
      timeTrial: -1,
      teamTimeTrial: -1,
      mountain: 7,
      cobbles: -4,
      hills: 5,
      stamina: 5,
      recovery: 5,
      acceleration: 3,
      form: 2
    }
  },
  {
    id: "aerolab",
    name: "AeroLab Racing",
    archetype: "Contrarreloj",
    description: "Bloque aerodinámico. Superior en cronos individuales y crono por equipos.",
    color: "blue",
    modifiers: {
      flat: 5,
      sprint: -1,
      timeTrial: 8,
      teamTimeTrial: 9,
      mountain: -2,
      cobbles: 0,
      hills: -1,
      stamina: 3,
      recovery: 1,
      acceleration: -2,
      form: 2
    }
  },
  {
    id: "flandria",
    name: "Flandria Stone Works",
    archetype: "Clásicas",
    description: "Especialistas en pavés, muros, viento, colocación y esfuerzos explosivos.",
    color: "orange",
    modifiers: {
      flat: 5,
      sprint: 4,
      timeTrial: 0,
      teamTimeTrial: 1,
      mountain: -5,
      cobbles: 9,
      hills: 7,
      stamina: 5,
      recovery: 0,
      acceleration: 7,
      form: 2
    }
  },
  {
    id: "veloce",
    name: "Veloce Sprint Union",
    archetype: "Sprint",
    description: "Equipo orientado a etapas llanas, tren de lanzamiento y llegadas masivas.",
    color: "blue",
    modifiers: {
      flat: 6,
      sprint: 9,
      timeTrial: -3,
      teamTimeTrial: 0,
      mountain: -8,
      cobbles: 1,
      hills: -2,
      stamina: 0,
      recovery: -2,
      acceleration: 8,
      form: 2
    }
  },
  {
    id: "equilibrium",
    name: "Equilibrium Cycling",
    archetype: "Equilibrado",
    description: "Plantilla compensada. No domina ningún terreno, pero no se hunde casi nunca.",
    color: "green",
    modifiers: {
      flat: 2,
      sprint: 2,
      timeTrial: 2,
      teamTimeTrial: 2,
      mountain: 2,
      cobbles: 2,
      hills: 2,
      stamina: 2,
      recovery: 2,
      acceleration: 2,
      form: 1
    }
  },
  {
    id: "breakaway",
    name: "Breakaway Hunters",
    archetype: "Cazador",
    description: "Equipo ofensivo de fugas, media montaña y etapas imprevisibles.",
    color: "orange",
    modifiers: {
      flat: 1,
      sprint: 2,
      timeTrial: -1,
      teamTimeTrial: -1,
      mountain: 2,
      cobbles: 3,
      hills: 7,
      stamina: 4,
      recovery: -1,
      acceleration: 8,
      form: 3
    }
  },
  {
    id: "youth",
    name: "NeoPro Development",
    archetype: "Jóvenes",
    description: "Talento emergente: muy buena aceleración y proyección, menor recuperación.",
    color: "blue",
    modifiers: {
      flat: 0,
      sprint: 2,
      timeTrial: 1,
      teamTimeTrial: 0,
      mountain: 3,
      cobbles: -1,
      hills: 4,
      stamina: -1,
      recovery: -4,
      acceleration: 7,
      form: 2
    }
  },
  {
    id: "alpine",
    name: "Alpine Domestiques",
    archetype: "Montaña + Gregarios",
    description: "Bloque de escaladores gregarios. Muy sólido en alta montaña, menos explosivo.",
    color: "green",
    modifiers: {
      flat: -1,
      sprint: -5,
      timeTrial: 0,
      teamTimeTrial: 1,
      mountain: 6,
      cobbles: -3,
      hills: 4,
      stamina: 6,
      recovery: 5,
      acceleration: 0,
      form: 1
    }
  },
  {
    id: "outsider",
    name: "Wildcard Outsiders",
    archetype: "Outsider",
    description: "Equipo irregular pero peligroso. Puede ganar etapas si asume riesgo.",
    color: "orange",
    modifiers: {
      flat: 1,
      sprint: 1,
      timeTrial: 1,
      teamTimeTrial: 0,
      mountain: 2,
      cobbles: 2,
      hills: 3,
      stamina: 1,
      recovery: 0,
      acceleration: 4,
      form: 4
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

/* ============================================================
   PLANTILLAS DE ROLES
   Cada equipo tendrá exactamente estos 8 corredores.
   ============================================================ */

const ROLE_TEMPLATES = [
  {
    key: "leader_gc",
    role: "Líder GC",
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
      acceleration: 80
    },
    form: 84
  },
  {
    key: "co_leader",
    role: "Co-líder",
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
      acceleration: 78
    },
    form: 82
  },
  {
    key: "climber",
    role: "Escalador",
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
      acceleration: 78
    },
    form: 81
  },
  {
    key: "time_trialist",
    role: "Croner",
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
      acceleration: 70
    },
    form: 81
  },
  {
    key: "sprinter",
    role: "Sprinter",
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
      acceleration: 89
    },
    form: 81
  },
  {
    key: "classics",
    role: "Clasicómano",
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
      acceleration: 84
    },
    form: 81
  },
  {
    key: "rouleur",
    role: "Rodador",
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
      acceleration: 72
    },
    form: 79
  },
  {
    key: "domestique",
    role: "Gregario",
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
      acceleration: 73
    },
    form: 78
  }
];

/* ============================================================
   NOMBRES DE CORREDORES
   10 equipos x 8 nombres = 80 corredores.
   ============================================================ */

const TEAM_RIDER_NAMES = {
  atlas_gc: [
    "Adrian Soler",
    "Mateo Keller",
    "Julien Moreau",
    "Nico Vermeer",
    "Tomas Greipel",
    "Diego Arana",
    "Victor Lemoine",
    "Samuele Costa"
  ],
  basque_mountain: [
    "Iker Mendia",
    "Aitor Larrañaga",
    "Mikel Aranburu",
    "Unai Etxeberria",
    "Jon Beitia",
    "Peio Astigarraga",
    "Xabier Irizar",
    "Ander Zubeldia"
  ],
  aerolab: [
    "Maximilian Stahl",
    "Luca Vento",
    "Theo Martin",
    "Bruno Keller",
    "Nils Hoffmann",
    "Soren Bjerre",
    "Rafa Ortega",
    "Ivan Novak"
  ],
  flandria: [
    "Wout De Smet",
    "Mathis Van Acker",
    "Jules Verbrugge",
    "Kasper Holm",
    "Ruben Claeys",
    "Seppe Maes",
    "Arne Vandenberg",
    "Mads Egholm"
  ],
  veloce: [
    "Marco Bellini",
    "Dylan Brooks",
    "Pavel Novak",
    "Hugo Lefevre",
    "Alexei Petrov",
    "Jan Riedel",
    "Sergio Molina",
    "Frederik Nielsen"
  ],
  equilibrium: [
    "Carlos Ibáñez",
    "Enzo Ricci",
    "Oscar Lind",
    "Pieter Janssen",
    "Hugo Pereira",
    "Liam Murphy",
    "Marius Vogt",
    "Leo Caruso"
  ],
  breakaway: [
    "Nino Costa",
    "Tom Alvarez",
    "Romain Hardy",
    "Felix Andersen",
    "Gorka Salazar",
    "Emil Novak",
    "Sacha Bernard",
    "Noah Fischer"
  ],
  youth: [
    "Ethan Ward",
    "Lucien Petit",
    "Pablo Ferrer",
    "Jonas Weber",
    "Miro Kral",
    "Leo Brandt",
    "Andreas Dahl",
    "Ivan Sokolov"
  ],
  alpine: [
    "Rafael Monteiro",
    "Dario Fontana",
    "Miguel Torres",
    "Simon Gruber",
    "Louis Chabert",
    "Andrea Pellegrini",
    "Marco Sousa",
    "Jan Barta"
  ],
  outsider: [
    "Milan Horvat",
    "Baptiste Rolland",
    "Santiago Rojas",
    "Erik Lund",
    "Thomas Green",
    "Lorenzo Bassi",
    "Nikolai Ivanov",
    "Joao Almeida Jr."
  ]
};

/* ============================================================
   GENERADOR DE CORREDORES
   ============================================================ */

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

    stats[statName] = dataClamp(base + modifier + noise, 45, 98);
  });

  return stats;
}

function generateRiders() {
  const riders = [];

  TEAM_BLUEPRINTS.forEach((team, teamIndex) => {
    const names = TEAM_RIDER_NAMES[team.id];

    ROLE_TEMPLATES.forEach((template, riderIndex) => {
      const id = `${team.id}_${String(riderIndex + 1).padStart(2, "0")}`;

      riders.push({
        id,
        name: names[riderIndex],
        teamId: team.id,
        role: template.role,
        stats: buildStats(template.stats, team.modifiers, teamIndex, riderIndex),
        form: dataClamp(
          template.form + team.modifiers.form + deterministicNoise(teamIndex, riderIndex, "form"),
          70,
          94
        ),
        fatigue: 0,
        totalTime: 0,
        raceDays: 0,
        abandonRisk: template.abandonRisk
      });
    });
  });

  return riders;
}

const RIDERS = generateRiders();

/* ============================================================
   21 ETAPAS TIPO TOUR
   ============================================================ */

const STAGES = [
  {
    id: "stage_01",
    number: 1,
    name: "Etapa 1 - Grand Départ Costero",
    type: "flat",
    label: "Llana",
    distance: 182,
    difficulty: 34,
    description: "Primera etapa favorable al sprint. El viento puede cortar el pelotón si hay táctica agresiva."
  },
  {
    id: "stage_02",
    number: 2,
    name: "Etapa 2 - Muros del Interior",
    type: "hilly",
    label: "Media montaña",
    distance: 171,
    difficulty: 68,
    description: "Final quebrado con repechos. Puncheurs y líderes explosivos pueden arañar segundos."
  },
  {
    id: "stage_03",
    number: 3,
    name: "Etapa 3 - Llanura del Norte",
    type: "flat",
    label: "Llana",
    distance: 198,
    difficulty: 38,
    description: "Etapa larga de transición. Sprint probable, pero la fatiga empieza a acumularse."
  },
  {
    id: "stage_04",
    number: 4,
    name: "Etapa 4 - Crono por Equipos",
    type: "team_time_trial",
    label: "CRE",
    distance: 41,
    difficulty: 62,
    description: "Primer test serio para bloques de GC. La cohesión del equipo importa mucho."
  },
  {
    id: "stage_05",
    number: 5,
    name: "Etapa 5 - Pavés y Muros",
    type: "cobbles_hills",
    label: "Pavés + muros",
    distance: 204,
    difficulty: 88,
    description: "Etapa caótica. Pavés, muros, colocación, riesgo y mucha varianza."
  },
  {
    id: "stage_06",
    number: 6,
    name: "Etapa 6 - Sprint del Valle",
    type: "flat",
    label: "Llana",
    distance: 176,
    difficulty: 32,
    description: "Nueva oportunidad para velocistas. Día de control para equipos de sprinters."
  },
  {
    id: "stage_07",
    number: 7,
    name: "Etapa 7 - Primer Contacto Alpino",
    type: "mountain",
    label: "Alta montaña",
    distance: 164,
    difficulty: 84,
    description: "Primera etapa de montaña. Los favoritos deberían mostrarse sin quemar todo."
  },
  {
    id: "stage_08",
    number: 8,
    name: "Etapa 8 - Etapa Trampa",
    type: "hilly",
    label: "Media montaña",
    distance: 186,
    difficulty: 72,
    description: "Terreno rompe-piernas. Fugas y clasicómanos tienen opciones reales."
  },
  {
    id: "stage_09",
    number: 9,
    name: "Etapa 9 - Cima de los Lagos",
    type: "mountain",
    label: "Alta montaña",
    distance: 152,
    difficulty: 91,
    description: "Final en alto. Día importante para escaladores puros."
  },
  {
    id: "stage_10",
    number: 10,
    name: "Etapa 10 - Llanura de Recuperación",
    type: "flat",
    label: "Llana",
    distance: 188,
    difficulty: 36,
    description: "Después de la montaña, el pelotón busca cierta estabilidad. Sprint probable."
  },
  {
    id: "stage_11",
    number: 11,
    name: "Etapa 11 - Crono Individual",
    type: "time_trial",
    label: "CRI",
    distance: 37,
    difficulty: 70,
    description: "Crono individual de media distancia. Los especialistas pueden abrir huecos."
  },
  {
    id: "stage_12",
    number: 12,
    name: "Etapa 12 - Camino de los Viñedos",
    type: "flat",
    label: "Llana",
    distance: 211,
    difficulty: 42,
    description: "Etapa larga para sprinters resistentes. Puede pesar el desgaste acumulado."
  },
  {
    id: "stage_13",
    number: 13,
    name: "Etapa 13 - Colinas Encadenadas",
    type: "hilly",
    label: "Media montaña",
    distance: 194,
    difficulty: 76,
    description: "Etapa muy buena para fugas. Ritmo alto, repechos y desgaste constante."
  },
  {
    id: "stage_14",
    number: 14,
    name: "Etapa 14 - Etapa Reina",
    type: "mountain",
    label: "Alta montaña",
    distance: 178,
    difficulty: 98,
    description: "Día más duro de la carrera. Encadenado de grandes puertos y final selectivo."
  },
  {
    id: "stage_15",
    number: 15,
    name: "Etapa 15 - Montaña Acumulada",
    type: "mountain",
    label: "Alta montaña",
    distance: 183,
    difficulty: 94,
    description: "Segunda jornada consecutiva muy dura. La recuperación se vuelve decisiva."
  },
  {
    id: "stage_16",
    number: 16,
    name: "Etapa 16 - Sprint Tardío",
    type: "flat",
    label: "Llana",
    distance: 169,
    difficulty: 35,
    description: "Últimas oportunidades de los velocistas, con piernas ya castigadas."
  },
  {
    id: "stage_17",
    number: 17,
    name: "Etapa 17 - Alta Montaña Explosiva",
    type: "mountain",
    label: "Alta montaña",
    distance: 136,
    difficulty: 90,
    description: "Etapa corta y agresiva. Los ataques pueden llegar desde lejos."
  },
  {
    id: "stage_18",
    number: 18,
    name: "Etapa 18 - Gran Fondo Alpino",
    type: "mountain",
    label: "Alta montaña",
    distance: 201,
    difficulty: 96,
    description: "Última gran etapa de montaña. La fatiga acumulada puede romper la general."
  },
  {
    id: "stage_19",
    number: 19,
    name: "Etapa 19 - Crono Final",
    type: "time_trial",
    label: "CRI",
    distance: 31,
    difficulty: 74,
    description: "Crono decisiva. Los líderes con buena recuperación y motor pueden remontar."
  },
  {
    id: "stage_20",
    number: 20,
    name: "Etapa 20 - Muros Finales",
    type: "hilly",
    label: "Media montaña",
    distance: 143,
    difficulty: 82,
    description: "Última oportunidad ofensiva. Muros cortos, aceleración y resistencia."
  },
  {
    id: "stage_21",
    number: 21,
    name: "Etapa 21 - Paseo Final",
    type: "flat",
    label: "Llana final",
    distance: 115,
    difficulty: 25,
    description: "Etapa final reducida. Sprint probable y menos diferencias en la general."
  }
];

/* ============================================================
   TÁCTICAS
   ============================================================ */

const TACTICS = [
  {
    id: "conservative",
    name: "Conservar",
    description: "Menor riesgo y menor fatiga. Ideal cuando quieres proteger la general.",
    bonus: -2,
    risk: 0.08,
    fatigueMultiplier: 0.65
  },
  {
    id: "balanced",
    name: "Equilibrado",
    description: "Estrategia neutra. Buen compromiso entre rendimiento y desgaste.",
    bonus: 0,
    risk: 0.18,
    fatigueMultiplier: 1.0
  },
  {
    id: "aggressive",
    name: "Atacar",
    description: "Mejor rendimiento potencial, más fatiga y más probabilidad de fallo.",
    bonus: 4,
    risk: 0.38,
    fatigueMultiplier: 1.45
  },
  {
    id: "all_in",
    name: "Todo o nada",
    description: "Máximo riesgo. Puede romper la carrera o hundir a tus líderes.",
    bonus: 8,
    risk: 0.62,
    fatigueMultiplier: 2.0
  }
];
