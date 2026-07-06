/* ============================================================
   CYCLING MANAGER MVP - data.js
   Datos mínimos: 4 equipos, 20 corredores, 5 etapas, 4 tácticas
   ============================================================ */

const TEAMS = [
  {
    id: "mountain",
    name: "Basque Climbing Project",
    archetype: "Escalador",
    description: "Equipo fuerte en alta montaña. Sufre algo en pavés y cronos largas.",
    color: "green"
  },
  {
    id: "chrono",
    name: "AeroLab Racing",
    archetype: "Contrarreloj",
    description: "Bloque potentísimo contra el crono. Ideal para la CRI y la CRE.",
    color: "blue"
  },
  {
    id: "classics",
    name: "Flandria Stone Works",
    archetype: "Clásicas",
    description: "Especialistas en pavés, muros, viento y esfuerzos explosivos.",
    color: "orange"
  },
  {
    id: "balanced",
    name: "Continental Allrounders",
    archetype: "Equilibrado",
    description: "Equipo sin grandes debilidades. Muy útil para probar la simulación completa.",
    color: "green"
  }
];

const RIDERS = [
  {
    id: "m1",
    name: "Iker Mendia",
    teamId: "mountain",
    role: "Líder GC",
    stats: {
      flat: 73,
      sprint: 61,
      timeTrial: 76,
      teamTimeTrial: 75,
      mountain: 91,
      cobbles: 58,
      hills: 84,
      stamina: 89,
      recovery: 91,
      acceleration: 82
    },
    form: 86,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "m2",
    name: "Aitor Larrañaga",
    teamId: "mountain",
    role: "Escalador",
    stats: {
      flat: 70,
      sprint: 56,
      timeTrial: 70,
      teamTimeTrial: 72,
      mountain: 88,
      cobbles: 54,
      hills: 82,
      stamina: 86,
      recovery: 87,
      acceleration: 79
    },
    form: 83,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "m3",
    name: "Mikel Aranburu",
    teamId: "mountain",
    role: "Rodador",
    stats: {
      flat: 82,
      sprint: 69,
      timeTrial: 78,
      teamTimeTrial: 80,
      mountain: 75,
      cobbles: 66,
      hills: 76,
      stamina: 85,
      recovery: 80,
      acceleration: 72
    },
    form: 81,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "m4",
    name: "Unai Etxeberria",
    teamId: "mountain",
    role: "Croner",
    stats: {
      flat: 79,
      sprint: 62,
      timeTrial: 83,
      teamTimeTrial: 84,
      mountain: 77,
      cobbles: 60,
      hills: 74,
      stamina: 82,
      recovery: 79,
      acceleration: 69
    },
    form: 80,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "m5",
    name: "Jon Beitia",
    teamId: "mountain",
    role: "Gregario",
    stats: {
      flat: 75,
      sprint: 64,
      timeTrial: 72,
      teamTimeTrial: 76,
      mountain: 82,
      cobbles: 61,
      hills: 80,
      stamina: 84,
      recovery: 82,
      acceleration: 75
    },
    form: 82,
    fatigue: 0,
    totalTime: 0
  },

  {
    id: "c1",
    name: "Maximilian Stahl",
    teamId: "chrono",
    role: "Líder GC",
    stats: {
      flat: 86,
      sprint: 66,
      timeTrial: 91,
      teamTimeTrial: 92,
      mountain: 78,
      cobbles: 67,
      hills: 76,
      stamina: 88,
      recovery: 84,
      acceleration: 72
    },
    form: 85,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "c2",
    name: "Luca Vento",
    teamId: "chrono",
    role: "Croner",
    stats: {
      flat: 88,
      sprint: 63,
      timeTrial: 89,
      teamTimeTrial: 91,
      mountain: 70,
      cobbles: 66,
      hills: 71,
      stamina: 84,
      recovery: 80,
      acceleration: 70
    },
    form: 82,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "c3",
    name: "Theo Martin",
    teamId: "chrono",
    role: "Rodador",
    stats: {
      flat: 87,
      sprint: 72,
      timeTrial: 85,
      teamTimeTrial: 88,
      mountain: 68,
      cobbles: 71,
      hills: 72,
      stamina: 83,
      recovery: 78,
      acceleration: 74
    },
    form: 80,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "c4",
    name: "Bruno Keller",
    teamId: "chrono",
    role: "Escalador auxiliar",
    stats: {
      flat: 78,
      sprint: 59,
      timeTrial: 80,
      teamTimeTrial: 82,
      mountain: 82,
      cobbles: 58,
      hills: 78,
      stamina: 85,
      recovery: 83,
      acceleration: 73
    },
    form: 81,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "c5",
    name: "Nils Hoffmann",
    teamId: "chrono",
    role: "Gregario CRE",
    stats: {
      flat: 84,
      sprint: 65,
      timeTrial: 83,
      teamTimeTrial: 87,
      mountain: 72,
      cobbles: 65,
      hills: 74,
      stamina: 82,
      recovery: 79,
      acceleration: 69
    },
    form: 79,
    fatigue: 0,
    totalTime: 0
  },

  {
    id: "f1",
    name: "Wout De Smet",
    teamId: "classics",
    role: "Líder clásicas",
    stats: {
      flat: 86,
      sprint: 82,
      timeTrial: 80,
      teamTimeTrial: 81,
      mountain: 72,
      cobbles: 91,
      hills: 88,
      stamina: 90,
      recovery: 82,
      acceleration: 87
    },
    form: 86,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "f2",
    name: "Mathis Van Acker",
    teamId: "classics",
    role: "Clasicómano",
    stats: {
      flat: 84,
      sprint: 78,
      timeTrial: 75,
      teamTimeTrial: 78,
      mountain: 69,
      cobbles: 88,
      hills: 85,
      stamina: 86,
      recovery: 80,
      acceleration: 84
    },
    form: 83,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "f3",
    name: "Jules Verbrugge",
    teamId: "classics",
    role: "Sprinter resistente",
    stats: {
      flat: 85,
      sprint: 86,
      timeTrial: 72,
      teamTimeTrial: 77,
      mountain: 64,
      cobbles: 82,
      hills: 79,
      stamina: 82,
      recovery: 77,
      acceleration: 88
    },
    form: 82,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "f4",
    name: "Kasper Holm",
    teamId: "classics",
    role: "Rodador pavés",
    stats: {
      flat: 87,
      sprint: 73,
      timeTrial: 78,
      teamTimeTrial: 80,
      mountain: 66,
      cobbles: 85,
      hills: 80,
      stamina: 85,
      recovery: 78,
      acceleration: 77
    },
    form: 80,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "f5",
    name: "Ruben Claeys",
    teamId: "classics",
    role: "Gregario",
    stats: {
      flat: 81,
      sprint: 70,
      timeTrial: 71,
      teamTimeTrial: 75,
      mountain: 70,
      cobbles: 80,
      hills: 78,
      stamina: 83,
      recovery: 79,
      acceleration: 75
    },
    form: 80,
    fatigue: 0,
    totalTime: 0
  },

  {
    id: "b1",
    name: "Carlos Ibáñez",
    teamId: "balanced",
    role: "Líder GC",
    stats: {
      flat: 81,
      sprint: 73,
      timeTrial: 82,
      teamTimeTrial: 82,
      mountain: 84,
      cobbles: 73,
      hills: 82,
      stamina: 87,
      recovery: 85,
      acceleration: 80
    },
    form: 85,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "b2",
    name: "Enzo Ricci",
    teamId: "balanced",
    role: "Escalador",
    stats: {
      flat: 74,
      sprint: 62,
      timeTrial: 75,
      teamTimeTrial: 77,
      mountain: 86,
      cobbles: 62,
      hills: 81,
      stamina: 85,
      recovery: 84,
      acceleration: 77
    },
    form: 82,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "b3",
    name: "Oscar Lind",
    teamId: "balanced",
    role: "Croner",
    stats: {
      flat: 84,
      sprint: 68,
      timeTrial: 86,
      teamTimeTrial: 87,
      mountain: 75,
      cobbles: 70,
      hills: 76,
      stamina: 84,
      recovery: 81,
      acceleration: 72
    },
    form: 81,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "b4",
    name: "Pieter Janssen",
    teamId: "balanced",
    role: "Clasicómano",
    stats: {
      flat: 82,
      sprint: 78,
      timeTrial: 76,
      teamTimeTrial: 78,
      mountain: 73,
      cobbles: 84,
      hills: 83,
      stamina: 84,
      recovery: 80,
      acceleration: 83
    },
    form: 82,
    fatigue: 0,
    totalTime: 0
  },
  {
    id: "b5",
    name: "Hugo Pereira",
    teamId: "balanced",
    role: "Gregario",
    stats: {
      flat: 79,
      sprint: 70,
      timeTrial: 78,
      teamTimeTrial: 80,
      mountain: 79,
      cobbles: 72,
      hills: 78,
      stamina: 83,
      recovery: 82,
      acceleration: 75
    },
    form: 80,
    fatigue: 0,
    totalTime: 0
  }
];

const STAGES = [
  {
    id: "s1",
    number: 1,
    name: "Etapa 1 - Llanura Atlántica",
    type: "flat",
    label: "Llana",
    distance: 185,
    difficulty: 35,
    description: "Etapa favorable para rodadores y sprinters. La fatiga debería ser moderada."
  },
  {
    id: "s2",
    number: 2,
    name: "Etapa 2 - Crono Individual",
    type: "time_trial",
    label: "CRI",
    distance: 32,
    difficulty: 55,
    description: "Esfuerzo individual sostenido. Prima la aerodinámica, potencia y regularidad."
  },
  {
    id: "s3",
    number: 3,
    name: "Etapa 3 - Crono por Equipos",
    type: "team_time_trial",
    label: "CRE",
    distance: 45,
    difficulty: 60,
    description: "Resultado colectivo. Cuenta especialmente la media de los mejores rodadores del equipo."
  },
  {
    id: "s4",
    number: 4,
    name: "Etapa 4 - Alta Montaña",
    type: "mountain",
    label: "Alta montaña",
    distance: 168,
    difficulty: 92,
    description: "Día decisivo para escaladores. La fatiga acumulada penaliza mucho."
  },
  {
    id: "s5",
    number: 5,
    name: "Etapa 5 - Pavés y Muros",
    type: "cobbles_hills",
    label: "Pavés + muros",
    distance: 205,
    difficulty: 88,
    description: "Etapa caótica de clásicas. Pavés, muros, aceleraciones y resistencia."
  }
];

const TACTICS = [
  {
    id: "conservative",
    name: "Conservar",
    description: "Menor riesgo y menor fatiga. Pierdes algo de agresividad.",
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
