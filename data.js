/* ============================================================
   CYCLING MANAGER TOUR - data.js
   Equipos reales + corredores reales + 21 etapas tipo Tour
   Versión con estrategia individual por corredor
   ============================================================ */

/* ============================================================
   EQUIPOS REALES
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

/* ============================================================
   ROLES BASE
   ============================================================ */

const ROLE_TEMPLATES = {
  gc: {
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
  co_leader: {
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
  climber: {
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
  time_trialist: {
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
  sprinter: {
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
  classics: {
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
  rouleur: {
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
  domestique: {
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
  },
  puncheur: {
    role: "Puncheur",
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
      acceleration: 86
    },
    form: 81
  }
};

/* ============================================================
   CORREDORES REALES POR EQUIPO
   Plantilla jugable: 10 equipos x 8 corredores.
   ============================================================ */

const TEAM_RIDER_BLUEPRINTS = {
  uae: [
    { name: "Tadej Pogačar", roleKey: "gc" },
    { name: "João Almeida", roleKey: "co_leader" },
    { name: "Adam Yates", roleKey: "climber" },
    { name: "Isaac del Toro", roleKey: "puncheur" },
    { name: "Brandon McNulty", roleKey: "time_trialist" },
    { name: "Tim Wellens", roleKey: "classics" },
    { name: "Pavel Sivakov", roleKey: "domestique" },
    { name: "Nils Politt", roleKey: "rouleur" }
  ],

  visma: [
    { name: "Jonas Vingegaard", roleKey: "gc" },
    { name: "Matteo Jorgenson", roleKey: "co_leader" },
    { name: "Sepp Kuss", roleKey: "climber" },
    { name: "Wilco Kelderman", roleKey: "domestique" },
    { name: "Dylan van Baarle", roleKey: "rouleur" },
    { name: "Christophe Laporte", roleKey: "classics" },
    { name: "Olav Kooij", roleKey: "sprinter" },
    { name: "Tiesj Benoot", roleKey: "puncheur" }
  ],

  ineos: [
    { name: "Egan Bernal", roleKey: "gc" },
    { name: "Carlos Rodríguez", roleKey: "co_leader" },
    { name: "Thymen Arensman", roleKey: "climber" },
    { name: "Filippo Ganna", roleKey: "time_trialist" },
    { name: "Joshua Tarling", roleKey: "time_trialist" },
    { name: "Magnus Sheffield", roleKey: "rouleur" },
    { name: "Laurens De Plus", roleKey: "domestique" },
    { name: "Ben Turner", roleKey: "classics" }
  ],

  movistar: [
    { name: "Enric Mas", roleKey: "gc" },
    { name: "Nairo Quintana", roleKey: "climber" },
    { name: "Einer Rubio", roleKey: "climber" },
    { name: "Iván Romeo", roleKey: "time_trialist" },
    { name: "Alex Aranburu", roleKey: "classics" },
    { name: "Fernando Gaviria", roleKey: "sprinter" },
    { name: "Davide Formolo", roleKey: "domestique" },
    { name: "Pelayo Sánchez", roleKey: "puncheur" }
  ],

  redbull: [
    { name: "Primož Roglič", roleKey: "gc" },
    { name: "Jai Hindley", roleKey: "climber" },
    { name: "Aleksandr Vlasov", roleKey: "co_leader" },
    { name: "Daniel Martínez", roleKey: "climber" },
    { name: "Florian Lipowitz", roleKey: "climber" },
    { name: "Roger Adrià", roleKey: "puncheur" },
    { name: "Sam Welsford", roleKey: "sprinter" },
    { name: "Bob Jungels", roleKey: "rouleur" }
  ],

  soudal: [
    { name: "Remco Evenepoel", roleKey: "gc" },
    { name: "Mikel Landa", roleKey: "climber" },
    { name: "Ilan Van Wilder", roleKey: "co_leader" },
    { name: "Tim Merlier", roleKey: "sprinter" },
    { name: "Kasper Asgreen", roleKey: "rouleur" },
    { name: "Yves Lampaert", roleKey: "time_trialist" },
    { name: "Mauri Vansevenant", roleKey: "puncheur" },
    { name: "Bert Van Lerberghe", roleKey: "domestique" }
  ],

  lidl: [
    { name: "Juan Ayuso", roleKey: "gc" },
    { name: "Mattias Skjelmose", roleKey: "co_leader" },
    { name: "Giulio Ciccone", roleKey: "climber" },
    { name: "Mads Pedersen", roleKey: "classics" },
    { name: "Jonathan Milan", roleKey: "sprinter" },
    { name: "Tao Geoghegan Hart", roleKey: "climber" },
    { name: "Simone Consonni", roleKey: "rouleur" },
    { name: "Jasper Stuyven", roleKey: "classics" }
  ],

  alpecin: [
    { name: "Mathieu van der Poel", roleKey: "classics" },
    { name: "Jasper Philipsen", roleKey: "sprinter" },
    { name: "Kaden Groves", roleKey: "sprinter" },
    { name: "Søren Kragh Andersen", roleKey: "rouleur" },
    { name: "Quinten Hermans", roleKey: "puncheur" },
    { name: "Gianni Vermeersch", roleKey: "classics" },
    { name: "Tibor Del Grosso", roleKey: "puncheur" },
    { name: "Silvan Dillier", roleKey: "domestique" }
  ],

  bahrain: [
    { name: "Pello Bilbao", roleKey: "gc" },
    { name: "Santiago Buitrago", roleKey: "climber" },
    { name: "Antonio Tiberi", roleKey: "co_leader" },
    { name: "Matej Mohorič", roleKey: "classics" },
    { name: "Phil Bauhaus", roleKey: "sprinter" },
    { name: "Jack Haig", roleKey: "climber" },
    { name: "Fred Wright", roleKey: "rouleur" },
    { name: "Kamil Gradek", roleKey: "time_trialist" }
  ],

  decathlon: [
    { name: "Felix Gall", roleKey: "gc" },
    { name: "Paul Seixas", roleKey: "climber" },
    { name: "Paul Lapeira", roleKey: "puncheur" },
    { name: "Dorian Godon", roleKey: "classics" },
    { name: "Bruno Armirail", roleKey: "time_trialist" },
    { name: "Oliver Naesen", roleKey: "rouleur" },
    { name: "Sam Bennett", roleKey: "sprinter" },
    { name: "Aurélien Paret-Peintre", roleKey: "climber" }
  ]
};

/* ============================================================
   GENERADOR DE STATS
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

    stats[statName] = dataClamp(base + modifier + noise, 45, 99);
  });

  return stats;
}

function generateRiders() {
  const riders = [];

  TEAM_BLUEPRINTS.forEach((team, teamIndex) => {
    const riderBlueprints = TEAM_RIDER_BLUEPRINTS[team.id];

    riderBlueprints.forEach((riderData, riderIndex) => {
      const template = ROLE_TEMPLATES[riderData.roleKey];
      const id = `${team.id}_${String(riderIndex + 1).padStart(2, "0")}`;

      riders.push({
        id,
        name: riderData.name,
        teamId: team.id,
        role: template.role,
        roleKey: riderData.roleKey,
        stats: buildStats(template.stats, team.modifiers, teamIndex, riderIndex),
        form: dataClamp(
          template.form + team.modifiers.form + deterministicNoise(teamIndex, riderIndex, "form"),
          68,
          96
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
   TÁCTICAS INDIVIDUALES
   ============================================================ */

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
    description: "El corredor sacrifica algo de rendimiento para ayudar al líder GC.",
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
