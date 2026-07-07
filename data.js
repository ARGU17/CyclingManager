/* ============================================================
   CYCLING MANAGER TOUR
   data.js
   v0.10 Race Director Pro · Full Data Extended
   Sustituir archivo completo. No añadir al final.
   ============================================================ */

const ROSTER_SIZE = 8;
const SAVE_VERSION = "v0.10";

/* ============================================================
   EQUIPOS
   Campos nuevos + campos antiguos para mantener compatibilidad.
   ============================================================ */

const TEAM_BLUEPRINTS = [
  {
    id: "uae",
    name: "UAE Team Emirates XRG",
    level: "WT",
    country: "United Arab Emirates",
    archetype: "Superteam / GC",
    color: "green",
    description: "Equipo dominante de grandes vueltas, montaña, cronos y clásicas.",
    management: { budget: 42000000, prestige: 96, sponsorPressure: 94 },
    objectives: ["gc_win", "stage_wins_3", "uci_top_1"],
    ai: { gc: 98, sprint: 42, classics: 72, breakaway: 48, control: 92 },
    aiProfile: { aggression: 88, control: 92, sprintFocus: 42, gcFocus: 98, breakawayFocus: 48 },
    material: { frame: "colnago", wheels: "enve" },
    equipmentContract: { frameBrand: "colnago", wheelBrand: "enve", bikeType: "aero", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#00843d", secondary: "#ffffff", accent: "#d32f2f", logoText: "UAE" },
    modifiers: { flat: 3, sprint: 1, timeTrial: 5, teamTimeTrial: 5, mountain: 7, cobbles: 1, hills: 5, stamina: 6, recovery: 6, acceleration: 5, positioning: 5, downhill: 3, form: 4 }
  },
  {
    id: "visma",
    name: "Team Visma | Lease a Bike",
    level: "WT",
    country: "Netherlands",
    archetype: "GC / Bloque",
    color: "yellow",
    description: "Bloque de gran vuelta muy fuerte en montaña, recuperación y trabajo colectivo.",
    management: { budget: 38000000, prestige: 94, sponsorPressure: 92 },
    objectives: ["gc_win", "teams_win", "stage_wins_2"],
    ai: { gc: 96, sprint: 62, classics: 78, breakaway: 54, control: 94 },
    aiProfile: { aggression: 78, control: 94, sprintFocus: 62, gcFocus: 96, breakawayFocus: 54 },
    material: { frame: "cervelo", wheels: "reserve" },
    equipmentContract: { frameBrand: "cervelo", wheelBrand: "reserve", bikeType: "aero", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#facc15", secondary: "#111827", accent: "#2563eb", logoText: "VISMA" },
    modifiers: { flat: 2, sprint: 1, timeTrial: 4, teamTimeTrial: 6, mountain: 6, cobbles: 2, hills: 4, stamina: 6, recovery: 7, acceleration: 3, positioning: 6, downhill: 4, form: 3 }
  },
  {
    id: "ineos",
    name: "Netcompany INEOS",
    level: "WT",
    country: "Great Britain",
    archetype: "Crono / GC",
    color: "red",
    description: "Equipo orientado a cronos, rodadores y líderes de general.",
    management: { budget: 35000000, prestige: 89, sponsorPressure: 86 },
    objectives: ["gc_top_3", "stage_win", "uci_top_3"],
    ai: { gc: 84, sprint: 28, classics: 55, breakaway: 42, control: 78 },
    aiProfile: { aggression: 62, control: 78, sprintFocus: 28, gcFocus: 84, breakawayFocus: 42 },
    material: { frame: "pinarello", wheels: "shimano" },
    equipmentContract: { frameBrand: "pinarello", wheelBrand: "shimano", bikeType: "aero", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#d91e36", secondary: "#111827", accent: "#ffffff", logoText: "INEOS" },
    modifiers: { flat: 4, sprint: -1, timeTrial: 8, teamTimeTrial: 8, mountain: 3, cobbles: 1, hills: 2, stamina: 5, recovery: 4, acceleration: 0, positioning: 4, downhill: 2, form: 2 }
  },
  {
    id: "movistar",
    name: "Movistar Team",
    level: "WT",
    country: "Spain",
    archetype: "Montaña / Etapas",
    color: "blue",
    description: "Equipo español con foco en montaña, fugas, general y etapas selectivas.",
    management: { budget: 17000000, prestige: 78, sponsorPressure: 75 },
    objectives: ["gc_top_5", "stage_win", "mountain_top_3"],
    ai: { gc: 76, sprint: 42, classics: 58, breakaway: 86, control: 52 },
    aiProfile: { aggression: 74, control: 52, sprintFocus: 42, gcFocus: 76, breakawayFocus: 86 },
    material: { frame: "canyon", wheels: "zipp" },
    equipmentContract: { frameBrand: "canyon", wheelBrand: "zipp", bikeType: "lightweight", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#2563eb", secondary: "#22c55e", accent: "#ffffff", logoText: "MOVISTAR" },
    modifiers: { flat: 0, sprint: -2, timeTrial: 1, teamTimeTrial: 1, mountain: 5, cobbles: -2, hills: 4, stamina: 4, recovery: 4, acceleration: 2, positioning: 2, downhill: 3, form: 2 }
  },
  {
    id: "redbull",
    name: "Red Bull - BORA - hansgrohe",
    level: "WT",
    country: "Germany",
    archetype: "GC / Potencia",
    color: "orange",
    description: "Equipo muy fuerte en líderes de general, montaña y potencia sostenida.",
    management: { budget: 33000000, prestige: 90, sponsorPressure: 88 },
    objectives: ["gc_top_3", "stage_wins_2", "uci_top_3"],
    ai: { gc: 94, sprint: 58, classics: 68, breakaway: 54, control: 82 },
    aiProfile: { aggression: 76, control: 82, sprintFocus: 58, gcFocus: 94, breakawayFocus: 54 },
    material: { frame: "specialized", wheels: "roval" },
    equipmentContract: { frameBrand: "specialized", wheelBrand: "roval", bikeType: "aero", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#0f172a", secondary: "#f59e0b", accent: "#ef4444", logoText: "RED BULL" },
    modifiers: { flat: 2, sprint: 1, timeTrial: 4, teamTimeTrial: 4, mountain: 6, cobbles: 0, hills: 3, stamina: 5, recovery: 5, acceleration: 3, positioning: 3, downhill: 2, form: 3 }
  },
  {
    id: "soudal",
    name: "Soudal Quick-Step",
    level: "WT",
    country: "Belgium",
    archetype: "Sprint / Clásicas",
    color: "blue",
    description: "Equipo fuerte en cronos, velocidad, etapas llanas y talento ofensivo.",
    management: { budget: 28000000, prestige: 87, sponsorPressure: 84 },
    objectives: ["gc_top_3", "points_top_3", "time_trial_win"],
    ai: { gc: 66, sprint: 88, classics: 82, breakaway: 58, control: 66 },
    aiProfile: { aggression: 82, control: 66, sprintFocus: 88, gcFocus: 66, breakawayFocus: 58 },
    material: { frame: "specialized", wheels: "roval" },
    equipmentContract: { frameBrand: "specialized", wheelBrand: "roval", bikeType: "aero", wheelType: "deep_60", freeChoice: true },
    visual: { primary: "#2563eb", secondary: "#ffffff", accent: "#ef4444", logoText: "SOUDAL" },
    modifiers: { flat: 4, sprint: 5, timeTrial: 7, teamTimeTrial: 5, mountain: 1, cobbles: 3, hills: 3, stamina: 3, recovery: 2, acceleration: 5, positioning: 4, downhill: 1, form: 2 }
  },
  {
    id: "lidl",
    name: "Lidl - Trek",
    level: "WT",
    country: "Germany",
    archetype: "Sprint / Clásicas / GC",
    color: "red",
    description: "Equipo completo: clásicas, sprint, montaña y corredores de general.",
    management: { budget: 29000000, prestige: 86, sponsorPressure: 82 },
    objectives: ["stage_wins_2", "points_top_3", "uci_top_5"],
    ai: { gc: 76, sprint: 90, classics: 88, breakaway: 66, control: 72 },
    aiProfile: { aggression: 84, control: 72, sprintFocus: 90, gcFocus: 76, breakawayFocus: 66 },
    material: { frame: "trek", wheels: "bontrager" },
    equipmentContract: { frameBrand: "trek", wheelBrand: "bontrager", bikeType: "aero", wheelType: "deep_60", freeChoice: true },
    visual: { primary: "#0f172a", secondary: "#ef4444", accent: "#facc15", logoText: "LIDL TREK" },
    modifiers: { flat: 4, sprint: 6, timeTrial: 3, teamTimeTrial: 3, mountain: 4, cobbles: 5, hills: 5, stamina: 4, recovery: 3, acceleration: 5, positioning: 4, downhill: 3, form: 3 }
  },
  {
    id: "alpecin",
    name: "Alpecin - Premier Tech",
    level: "WT",
    country: "Belgium",
    archetype: "Clásicas / Sprint",
    color: "cyan",
    description: "Clasicómanos y velocistas; brutal en pavés, muros y finales explosivos.",
    management: { budget: 24000000, prestige: 88, sponsorPressure: 83 },
    objectives: ["points_win", "stage_wins_3", "monument_win"],
    ai: { gc: 22, sprint: 96, classics: 98, breakaway: 74, control: 58 },
    aiProfile: { aggression: 92, control: 58, sprintFocus: 96, gcFocus: 22, breakawayFocus: 74 },
    material: { frame: "canyon", wheels: "shimano" },
    equipmentContract: { frameBrand: "canyon", wheelBrand: "shimano", bikeType: "aero", wheelType: "deep_60", freeChoice: true },
    visual: { primary: "#0f172a", secondary: "#06b6d4", accent: "#ef4444", logoText: "ALPECIN" },
    modifiers: { flat: 5, sprint: 8, timeTrial: 0, teamTimeTrial: 1, mountain: -4, cobbles: 9, hills: 7, stamina: 4, recovery: 0, acceleration: 8, positioning: 7, downhill: 3, form: 3 }
  },
  {
    id: "bahrain",
    name: "Bahrain Victorious",
    level: "WT",
    country: "Bahrain",
    archetype: "Montaña / Clásicas",
    color: "red",
    description: "Equipo equilibrado con escaladores, clasicómanos y cazadores de etapa.",
    management: { budget: 22000000, prestige: 80, sponsorPressure: 77 },
    objectives: ["stage_win", "gc_top_10", "mountain_top_3"],
    ai: { gc: 70, sprint: 54, classics: 72, breakaway: 76, control: 56 },
    aiProfile: { aggression: 78, control: 56, sprintFocus: 54, gcFocus: 70, breakawayFocus: 76 },
    material: { frame: "merida", wheels: "vision" },
    equipmentContract: { frameBrand: "merida", wheelBrand: "vision", bikeType: "lightweight", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#ef4444", secondary: "#ffffff", accent: "#111827", logoText: "BAHRAIN" },
    modifiers: { flat: 2, sprint: 2, timeTrial: 2, teamTimeTrial: 2, mountain: 4, cobbles: 3, hills: 5, stamina: 4, recovery: 3, acceleration: 4, positioning: 3, downhill: 4, form: 2 }
  },
  {
    id: "decathlon",
    name: "Decathlon CMA CGM Team",
    level: "WT",
    country: "France",
    archetype: "Desarrollo / Montaña",
    color: "green",
    description: "Escaladores, jóvenes talentos y buen rendimiento en media montaña.",
    management: { budget: 21000000, prestige: 79, sponsorPressure: 74 },
    objectives: ["youth_win", "stage_win", "gc_top_10"],
    ai: { gc: 74, sprint: 76, classics: 70, breakaway: 82, control: 58 },
    aiProfile: { aggression: 75, control: 58, sprintFocus: 76, gcFocus: 74, breakawayFocus: 82 },
    material: { frame: "vanrysel", wheels: "swissside" },
    equipmentContract: { frameBrand: "vanrysel", wheelBrand: "swissside", bikeType: "lightweight", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#10b981", secondary: "#0f172a", accent: "#f97316", logoText: "DECATHLON" },
    modifiers: { flat: 0, sprint: 1, timeTrial: 1, teamTimeTrial: 1, mountain: 5, cobbles: 0, hills: 5, stamina: 4, recovery: 3, acceleration: 4, positioning: 2, downhill: 3, form: 3 }
  },
  {
    id: "caja",
    name: "Caja Rural - Seguros RGA",
    level: "PRT",
    country: "Spain",
    archetype: "ProTeam / Fugas",
    color: "green",
    description: "Equipo combativo, con sprint, fugas y escaladores de oportunidad.",
    management: { budget: 9000000, prestige: 68, sponsorPressure: 68 },
    objectives: ["stage_win", "points_top_3", "uci_top_10"],
    ai: { gc: 38, sprint: 72, classics: 56, breakaway: 92, control: 34 },
    aiProfile: { aggression: 82, control: 34, sprintFocus: 72, gcFocus: 38, breakawayFocus: 92 },
    material: { frame: "mmr", wheels: "vision" },
    equipmentContract: { frameBrand: "mmr", wheelBrand: "vision", bikeType: "aero", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#0f7d45", secondary: "#ffffff", accent: "#d9a441", logoText: "CAJA RURAL" },
    modifiers: { flat: 0, sprint: 4, timeTrial: -1, teamTimeTrial: -1, mountain: 1, cobbles: 0, hills: 2, stamina: 2, recovery: 1, acceleration: 3, positioning: 1, downhill: 1, form: 1 }
  },
  {
    id: "burgos",
    name: "Burgos Burpellet BH",
    level: "PRT",
    country: "Spain",
    archetype: "ProTeam / Montaña-Fugas",
    color: "pink",
    description: "Equipo agresivo de fugas, montaña media y caza de etapas.",
    management: { budget: 7600000, prestige: 64, sponsorPressure: 65 },
    objectives: ["stage_win", "mountain_top_3", "uci_top_10"],
    ai: { gc: 42, sprint: 46, classics: 58, breakaway: 94, control: 30 },
    aiProfile: { aggression: 84, control: 30, sprintFocus: 46, gcFocus: 42, breakawayFocus: 94 },
    material: { frame: "bh", wheels: "vision" },
    equipmentContract: { frameBrand: "bh", wheelBrand: "vision", bikeType: "lightweight", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#ffffff", secondary: "#ec4899", accent: "#7c3aed", logoText: "BURGOS BH" },
    modifiers: { flat: -1, sprint: 1, timeTrial: -1, teamTimeTrial: -1, mountain: 3, cobbles: -1, hills: 4, stamina: 2, recovery: 1, acceleration: 2, positioning: 0, downhill: 2, form: 1 }
  },
  {
    id: "euskaltel",
    name: "Euskaltel - Euskadi",
    level: "PRT",
    country: "Spain",
    archetype: "ProTeam / Cantera-Fugas",
    color: "orange",
    description: "Equipo vasco ofensivo, muy visible en fugas, media montaña y carreteras duras.",
    management: { budget: 7200000, prestige: 67, sponsorPressure: 70 },
    objectives: ["stage_win", "mountain_top_3", "uci_top_10"],
    ai: { gc: 36, sprint: 30, classics: 62, breakaway: 96, control: 28 },
    aiProfile: { aggression: 88, control: 28, sprintFocus: 30, gcFocus: 36, breakawayFocus: 96 },
    material: { frame: "orbea", wheels: "orbea" },
    equipmentContract: { frameBrand: "orbea", wheelBrand: "orbea", bikeType: "lightweight", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#f97316", secondary: "#fb7185", accent: "#111827", logoText: "EUSKALTEL" },
    modifiers: { flat: -1, sprint: -1, timeTrial: -2, teamTimeTrial: -2, mountain: 3, cobbles: -1, hills: 4, stamina: 2, recovery: 2, acceleration: 2, positioning: 1, downhill: 3, form: 1 }
  },
  {
    id: "polti",
    name: "Team Polti VisitMalta",
    level: "PRT",
    country: "Italy",
    archetype: "ProTeam / Sprint-Fugas",
    color: "red",
    description: "Equipo italiano combativo, con sprinters, rodadores y escaladores de etapa.",
    management: { budget: 8200000, prestige: 66, sponsorPressure: 66 },
    objectives: ["stage_win", "points_top_3", "uci_top_10"],
    ai: { gc: 32, sprint: 68, classics: 58, breakaway: 88, control: 34 },
    aiProfile: { aggression: 80, control: 34, sprintFocus: 68, gcFocus: 32, breakawayFocus: 88 },
    material: { frame: "aurum", wheels: "fulcrum" },
    equipmentContract: { frameBrand: "aurum", wheelBrand: "fulcrum", bikeType: "aero", wheelType: "mid_45", freeChoice: true },
    visual: { primary: "#ef4444", secondary: "#ffffff", accent: "#16a34a", logoText: "POLTI" },
    modifiers: { flat: 1, sprint: 3, timeTrial: -1, teamTimeTrial: -1, mountain: 1, cobbles: 0, hills: 2, stamina: 2, recovery: 1, acceleration: 3, positioning: 1, downhill: 1, form: 1 }
  }
];

const TEAMS = TEAM_BLUEPRINTS.map(team => ({
  id: team.id,
  name: team.name,
  level: team.level,
  country: team.country,
  archetype: team.archetype,
  color: team.color,
  description: team.description,
  management: team.management,
  objectives: team.objectives,
  ai: team.ai,
  aiProfile: team.aiProfile,
  material: team.material,
  equipmentContract: team.equipmentContract,
  visual: team.visual
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
  uci_top_1: { label: "Liderar ranking UCI", prestige: 100, budget: 1200000 },
  uci_top_3: { label: "Top 3 UCI", prestige: 65, budget: 650000 },
  uci_top_5: { label: "Top 5 UCI", prestige: 45, budget: 450000 },
  uci_top_10: { label: "Top 10 UCI", prestige: 30, budget: 250000 },
  time_trial_win: { label: "Ganar una crono", prestige: 50, budget: 450000 },
  monument_win: { label: "Ganar una clásica/monumento", prestige: 100, budget: 1000000 }
};

/* ============================================================
   MATERIAL REAL · RATINGS DEL SIMULADOR
   100 = mejor referencia interna.
   ============================================================ */

const FRAME_BRANDS = [
  { id: "colnago", name: "Colnago", country: "Italy", aero: 96, weight: 94, stiffness: 97, comfort: 88, handling: 93, cobbles: 84, tt: 88, reliability: 94 },
  { id: "cervelo", name: "Cervélo", country: "Canada", aero: 98, weight: 93, stiffness: 95, comfort: 87, handling: 92, cobbles: 83, tt: 97, reliability: 93 },
  { id: "pinarello", name: "Pinarello", country: "Italy", aero: 97, weight: 92, stiffness: 98, comfort: 87, handling: 96, cobbles: 84, tt: 95, reliability: 94 },
  { id: "canyon", name: "Canyon", country: "Germany", aero: 97, weight: 94, stiffness: 95, comfort: 88, handling: 92, cobbles: 86, tt: 95, reliability: 93 },
  { id: "specialized", name: "Specialized", country: "USA", aero: 99, weight: 95, stiffness: 96, comfort: 90, handling: 94, cobbles: 86, tt: 94, reliability: 95 },
  { id: "trek", name: "Trek", country: "USA", aero: 95, weight: 93, stiffness: 94, comfort: 91, handling: 93, cobbles: 89, tt: 91, reliability: 95 },
  { id: "merida", name: "Merida", country: "Taiwan", aero: 94, weight: 92, stiffness: 94, comfort: 89, handling: 91, cobbles: 86, tt: 90, reliability: 94 },
  { id: "vanrysel", name: "Van Rysel", country: "France", aero: 93, weight: 91, stiffness: 92, comfort: 88, handling: 90, cobbles: 84, tt: 88, reliability: 91 },
  { id: "mmr", name: "MMR", country: "Spain", aero: 90, weight: 93, stiffness: 91, comfort: 87, handling: 89, cobbles: 82, tt: 85, reliability: 90 },
  { id: "bh", name: "BH", country: "Spain", aero: 91, weight: 94, stiffness: 92, comfort: 88, handling: 90, cobbles: 83, tt: 86, reliability: 91 },
  { id: "orbea", name: "Orbea", country: "Spain", aero: 92, weight: 93, stiffness: 92, comfort: 89, handling: 91, cobbles: 84, tt: 87, reliability: 92 },
  { id: "aurum", name: "Aurum", country: "Spain", aero: 92, weight: 92, stiffness: 92, comfort: 88, handling: 90, cobbles: 83, tt: 87, reliability: 90 },
  { id: "giant", name: "Giant", country: "Taiwan", aero: 94, weight: 92, stiffness: 93, comfort: 89, handling: 91, cobbles: 85, tt: 90, reliability: 94 },
  { id: "scott", name: "Scott", country: "Switzerland", aero: 95, weight: 93, stiffness: 94, comfort: 88, handling: 91, cobbles: 84, tt: 91, reliability: 93 }
];

const WHEEL_BRANDS = [
  { id: "enve", name: "ENVE", country: "USA", aero: 96, weight: 93, stiffness: 95, crosswind: 90, cobbles: 87, tt: 94, reliability: 93 },
  { id: "reserve", name: "Reserve", country: "USA", aero: 97, weight: 93, stiffness: 95, crosswind: 91, cobbles: 85, tt: 96, reliability: 93 },
  { id: "shimano", name: "Shimano Dura-Ace", country: "Japan", aero: 94, weight: 93, stiffness: 94, crosswind: 92, cobbles: 87, tt: 91, reliability: 96 },
  { id: "zipp", name: "Zipp", country: "USA", aero: 96, weight: 92, stiffness: 94, crosswind: 88, cobbles: 85, tt: 95, reliability: 92 },
  { id: "roval", name: "Roval", country: "USA", aero: 98, weight: 95, stiffness: 95, crosswind: 90, cobbles: 86, tt: 96, reliability: 94 },
  { id: "bontrager", name: "Bontrager", country: "USA", aero: 94, weight: 92, stiffness: 93, crosswind: 91, cobbles: 88, tt: 90, reliability: 95 },
  { id: "vision", name: "Vision Metron", country: "Italy/USA", aero: 95, weight: 91, stiffness: 94, crosswind: 88, cobbles: 84, tt: 94, reliability: 92 },
  { id: "swissside", name: "Swiss Side", country: "Switzerland", aero: 93, weight: 90, stiffness: 91, crosswind: 89, cobbles: 84, tt: 92, reliability: 91 },
  { id: "fulcrum", name: "Fulcrum", country: "Italy", aero: 92, weight: 92, stiffness: 92, crosswind: 90, cobbles: 86, tt: 88, reliability: 92 },
  { id: "orbea", name: "Orbea Oquo", country: "Spain", aero: 90, weight: 90, stiffness: 90, crosswind: 89, cobbles: 84, tt: 85, reliability: 90 },
  { id: "dt_swiss", name: "DT Swiss", country: "Switzerland", aero: 93, weight: 94, stiffness: 93, crosswind: 92, cobbles: 89, tt: 90, reliability: 96 },
  { id: "mavic", name: "Mavic", country: "France", aero: 90, weight: 91, stiffness: 91, crosswind: 91, cobbles: 88, tt: 86, reliability: 93 }
];

const EQUIPMENT_PRESETS = [
  { id: "auto", name: "Auto según etapa", frameType: "auto", wheelType: "auto", bikeType: "auto" },
  { id: "flat", name: "Llano aero", frameType: "aero", wheelType: "deep", bikeType: "aero" },
  { id: "mountain", name: "Montaña", frameType: "light", wheelType: "light", bikeType: "lightweight" },
  { id: "hilly", name: "Media montaña", frameType: "light", wheelType: "mid", bikeType: "lightweight" },
  { id: "cobbles", name: "Pavé", frameType: "endurance", wheelType: "cobbles", bikeType: "endurance" },
  { id: "tt", name: "Crono", frameType: "tt", wheelType: "disc", bikeType: "tt" },
  { id: "safe", name: "Seguro lluvia", frameType: "endurance", wheelType: "mid", bikeType: "endurance" },
  { id: "safe_rain", name: "Seguro lluvia", frameType: "endurance", wheelType: "mid", bikeType: "endurance" }
];

const BIKE_SETUPS = [
  { id: "aero", name: "Aero", description: "Máxima velocidad en llano y sprint.", terrain: "flat", aero: 1.25, weight: 0.60, stiffness: 1.05, comfort: 0.55, handling: 0.70, tt: 0.80, punctureRisk: 1.0 },
  { id: "lightweight", name: "Ligera", description: "Ideal para puertos largos y finales en alto.", terrain: "mountain", aero: 0.60, weight: 1.35, stiffness: 0.90, comfort: 0.70, handling: 1.00, tt: 0.50, punctureRisk: 1.04 },
  { id: "endurance", name: "Endurance", description: "Cómoda y segura en pavés, lluvia y etapas largas.", terrain: "cobbles", aero: 0.70, weight: 0.75, stiffness: 0.80, comfort: 1.30, handling: 1.20, tt: 0.45, punctureRisk: 0.86 },
  { id: "tt", name: "Cabra CRI", description: "Máxima eficiencia en CRI y CRE.", terrain: "tt", aero: 1.40, weight: 0.45, stiffness: 1.05, comfort: 0.40, handling: 0.58, tt: 1.45, punctureRisk: 1.0 }
];

const WHEEL_SETUPS = [
  { id: "deep", name: "Perfil alto", description: "Muy rápidas en llano, sensibles al viento lateral.", aero: 1.25, weight: 0.65, stiffness: 1.05, crosswind: 0.68, cobbles: 0.60, tt: 1.00, punctureRisk: 1.0 },
  { id: "deep_60", name: "Perfil 60 mm", description: "Muy rápidas en llano, sensibles al viento lateral.", aero: 1.25, weight: 0.65, stiffness: 1.05, crosswind: 0.68, cobbles: 0.60, tt: 1.00, punctureRisk: 1.0 },
  { id: "mid", name: "Perfil medio", description: "Equilibradas y polivalentes.", aero: 1.00, weight: 0.92, stiffness: 0.98, crosswind: 0.95, cobbles: 0.82, tt: 0.82, punctureRisk: 0.96 },
  { id: "mid_45", name: "Perfil 45 mm", description: "Equilibradas y polivalentes.", aero: 1.00, weight: 0.92, stiffness: 0.98, crosswind: 0.95, cobbles: 0.82, tt: 0.82, punctureRisk: 0.96 },
  { id: "light", name: "Ruedas ligeras", description: "Buenas para puertos largos.", aero: 0.72, weight: 1.25, stiffness: 0.90, crosswind: 1.00, cobbles: 0.70, tt: 0.55, punctureRisk: 1.04 },
  { id: "climbing", name: "Ruedas ligeras", description: "Buenas para puertos largos.", aero: 0.72, weight: 1.25, stiffness: 0.90, crosswind: 1.00, cobbles: 0.70, tt: 0.55, punctureRisk: 1.04 },
  { id: "cobbles", name: "Ruedas pavés", description: "Seguridad, agarre y fiabilidad.", aero: 0.68, weight: 0.72, stiffness: 0.75, crosswind: 1.05, cobbles: 1.35, tt: 0.45, punctureRisk: 0.78 },
  { id: "disc", name: "Lenticular CRI", description: "Máxima aerodinámica en crono.", aero: 1.45, weight: 0.45, stiffness: 1.05, crosswind: 0.58, cobbles: 0.35, tt: 1.50, punctureRisk: 1.0 },
  { id: "disc_tt", name: "Lenticular CRI", description: "Máxima aerodinámica en crono.", aero: 1.45, weight: 0.45, stiffness: 1.05, crosswind: 0.58, cobbles: 0.35, tt: 1.50, punctureRisk: 1.0 }
];

/* ============================================================
   ROLES / STATS
   Se generan stats nuevos y alias antiguos:
   tt/timeTrial, ttt/teamTimeTrial.
   ============================================================ */

const ROLE_TEMPLATES = {
  gc: {
    label: "Líder GC", role: "Líder GC", defaultOrder: "hold", defaultEffort: 68, abandonRisk: 0.016,
    stats: { flat: 80, sprint: 62, mountain: 90, hills: 84, cobbles: 66, tt: 84, ttt: 84, stamina: 90, recovery: 88, acceleration: 78, positioning: 82, downhill: 82, consistency: 88, injuryResistance: 82 }
  },
  co: {
    label: "Co-líder", role: "Co-líder", defaultOrder: "hold", defaultEffort: 66, abandonRisk: 0.018,
    stats: { flat: 79, sprint: 62, mountain: 86, hills: 82, cobbles: 64, tt: 80, ttt: 82, stamina: 87, recovery: 85, acceleration: 76, positioning: 80, downhill: 80, consistency: 84, injuryResistance: 81 }
  },
  co_leader: {
    label: "Co-líder", role: "Co-líder", defaultOrder: "hold", defaultEffort: 66, abandonRisk: 0.018,
    stats: { flat: 79, sprint: 62, mountain: 86, hills: 82, cobbles: 64, tt: 80, ttt: 82, stamina: 87, recovery: 85, acceleration: 76, positioning: 80, downhill: 80, consistency: 84, injuryResistance: 81 }
  },
  climber: {
    label: "Escalador", role: "Escalador", defaultOrder: "hold", defaultEffort: 64, abandonRisk: 0.021,
    stats: { flat: 72, sprint: 54, mountain: 87, hills: 80, cobbles: 55, tt: 70, ttt: 72, stamina: 86, recovery: 84, acceleration: 76, positioning: 74, downhill: 80, consistency: 82, injuryResistance: 78 }
  },
  tt: {
    label: "Croner", role: "Croner", defaultOrder: "pull", defaultEffort: 72, abandonRisk: 0.017,
    stats: { flat: 86, sprint: 62, mountain: 72, hills: 74, cobbles: 66, tt: 88, ttt: 89, stamina: 85, recovery: 80, acceleration: 68, positioning: 78, downhill: 74, consistency: 84, injuryResistance: 80 }
  },
  time_trialist: {
    label: "Croner", role: "Croner", defaultOrder: "pull", defaultEffort: 72, abandonRisk: 0.017,
    stats: { flat: 86, sprint: 62, mountain: 72, hills: 74, cobbles: 66, tt: 88, ttt: 89, stamina: 85, recovery: 80, acceleration: 68, positioning: 78, downhill: 74, consistency: 84, injuryResistance: 80 }
  },
  sprinter: {
    label: "Sprinter", role: "Sprinter", defaultOrder: "sit", defaultEffort: 50, abandonRisk: 0.026,
    stats: { flat: 86, sprint: 90, mountain: 58, hills: 70, cobbles: 72, tt: 68, ttt: 74, stamina: 78, recovery: 75, acceleration: 92, positioning: 88, downhill: 72, consistency: 78, injuryResistance: 75 }
  },
  classics: {
    label: "Clasicómano", role: "Clasicómano", defaultOrder: "hold", defaultEffort: 66, abandonRisk: 0.024,
    stats: { flat: 83, sprint: 78, mountain: 70, hills: 84, cobbles: 86, tt: 74, ttt: 78, stamina: 84, recovery: 80, acceleration: 84, positioning: 88, downhill: 78, consistency: 80, injuryResistance: 77 }
  },
  rouleur: {
    label: "Rodador", role: "Rodador", defaultOrder: "pull", defaultEffort: 72, abandonRisk: 0.018,
    stats: { flat: 86, sprint: 68, mountain: 70, hills: 74, cobbles: 74, tt: 80, ttt: 84, stamina: 84, recovery: 80, acceleration: 70, positioning: 80, downhill: 74, consistency: 82, injuryResistance: 82 }
  },
  domestique: {
    label: "Gregario", role: "Gregario", defaultOrder: "protect", defaultEffort: 64, abandonRisk: 0.019,
    stats: { flat: 78, sprint: 62, mountain: 78, hills: 76, cobbles: 66, tt: 74, ttt: 78, stamina: 83, recovery: 80, acceleration: 70, positioning: 78, downhill: 76, consistency: 80, injuryResistance: 82 }
  },
  puncheur: {
    label: "Puncheur", role: "Puncheur", defaultOrder: "hold", defaultEffort: 68, abandonRisk: 0.023,
    stats: { flat: 79, sprint: 76, mountain: 78, hills: 87, cobbles: 72, tt: 73, ttt: 75, stamina: 82, recovery: 79, acceleration: 87, positioning: 82, downhill: 78, consistency: 78, injuryResistance: 77 }
  }
};

/* ============================================================
   PLANTILLAS AMPLIADAS
   [nombre, país, edad, rol, fuerzaBase]
   ============================================================ */

const TEAM_RIDERS = {
  uae: [
    ["Tadej Pogačar","Slovenia",27,"gc",99],["João Almeida","Portugal",27,"co",91],["Adam Yates","Great Britain",33,"climber",90],["Isaac del Toro","Mexico",22,"puncheur",89],
    ["Brandon McNulty","United States",28,"tt",86],["Tim Wellens","Belgium",35,"classics",85],["Nils Politt","Germany",32,"rouleur",84],["Felix Großschartner","Austria",32,"domestique",82],
    ["Marc Soler","Spain",32,"climber",84],["Jay Vine","Australia",30,"climber",85],["Pavel Sivakov","France",29,"climber",83],["Jhonatan Narváez","Ecuador",29,"classics",86],
    ["Florian Vermeersch","Belgium",27,"classics",82],["Rune Herregodts","Belgium",28,"rouleur",80],["Domen Novak","Slovenia",31,"domestique",78],["Mikkel Bjerg","Denmark",27,"tt",81],
    ["Ivo Oliveira","Portugal",30,"rouleur",78],["Rui Oliveira","Portugal",30,"rouleur",77],["Pablo Torres","Spain",20,"climber",80],["Benoît Cosnefroy","France",31,"puncheur",84],
    ["Kevin Vermaerke","United States",25,"domestique",78],["Luca Giaimi","Italy",21,"tt",77],["Julius Johansen","Denmark",27,"rouleur",76],["Jan Christen","Switzerland",22,"puncheur",82]
  ],
  visma: [
    ["Jonas Vingegaard","Denmark",29,"gc",97],["Wout van Aert","Belgium",31,"classics",94],["Matteo Jorgenson","United States",27,"co",90],["Sepp Kuss","United States",31,"climber",88],
    ["Wilco Kelderman","Netherlands",35,"domestique",83],["Christophe Laporte","France",33,"classics",86],["Dylan van Baarle","Netherlands",34,"rouleur",84],["Tiesj Benoot","Belgium",32,"classics",84],
    ["Edoardo Affini","Italy",30,"tt",84],["Attila Valter","Hungary",28,"climber",82],["Ben Tulett","Great Britain",25,"climber",82],["Per Strand Hagenes","Norway",23,"puncheur",80],
    ["Milan Vader","Netherlands",30,"climber",78],["Bart Lemmen","Netherlands",31,"rouleur",79],["Cian Uijtdebroeks","Belgium",23,"gc",84],["Olav Kooij","Netherlands",24,"sprinter",88],
    ["Axel Zingle","France",27,"classics",81],["Bruno Armirail","France",32,"tt",82],["Davide Piganzoli","Italy",24,"climber",80],["Owain Doull","Great Britain",33,"rouleur",78],
    ["Matthew Brennan","Great Britain",21,"sprinter",82],["Jørgen Nordhagen","Norway",21,"climber",82],["Robert Gesink","Netherlands",40,"domestique",76],["Steven Kruijswijk","Netherlands",39,"domestique",77]
  ],
  ineos: [
    ["Egan Bernal","Colombia",29,"gc",87],["Carlos Rodríguez","Spain",25,"gc",89],["Thymen Arensman","Netherlands",26,"climber",86],["Filippo Ganna","Italy",29,"tt",91],
    ["Joshua Tarling","Great Britain",22,"tt",89],["Magnus Sheffield","United States",24,"rouleur",84],["Laurens De Plus","Belgium",30,"domestique",82],["Ben Turner","Great Britain",27,"classics",81],
    ["Geraint Thomas","Great Britain",40,"co",83],["Tom Pidcock","Great Britain",27,"puncheur",86],["Michal Kwiatkowski","Poland",36,"classics",82],["Jonathan Castroviejo","Spain",39,"tt",80],
    ["Omar Fraile","Spain",36,"domestique",78],["Luke Rowe","Great Britain",36,"rouleur",76],["Kim Heiduk","Germany",26,"rouleur",77],["Brandon Rivera","Colombia",30,"domestique",77],
    ["Tobias Foss","Norway",29,"tt",82],["Oscar Rodríguez","Spain",31,"climber",78],["Michael Leonard","Canada",22,"tt",78],["Artem Shmidt","United States",22,"rouleur",77],
    ["AJ August","United States",21,"climber",78],["Leo Hayter","Great Britain",25,"climber",77],["Connor Swift","Great Britain",31,"classics",78],["Ethan Hayter","Great Britain",27,"rouleur",80]
  ],
  movistar: [
    ["Enric Mas","Spain",31,"gc",88],["Nairo Quintana","Colombia",36,"climber",84],["Einer Rubio","Colombia",28,"climber",83],["Iván Romeo","Spain",23,"tt",82],
    ["Davide Formolo","Italy",33,"domestique",80],["Pelayo Sánchez","Spain",26,"puncheur",82],["Alex Aranburu","Spain",30,"classics",83],["Fernando Gaviria","Colombia",31,"sprinter",84],
    ["Javier Romo","Spain",27,"puncheur",80],["Carlos Canal","Spain",25,"classics",79],["Jorge Arcas","Spain",34,"domestique",77],["Iván García Cortina","Spain",31,"classics",80],
    ["Oier Lazkano","Spain",26,"classics",83],["Lorenzo Milesi","Italy",24,"tt",79],["Rémi Cavagna","France",31,"tt",80],["Manlio Moro","Italy",24,"rouleur",76],
    ["Cian Uijtdebroeks","Belgium",23,"gc",84],["Nélson Oliveira","Portugal",37,"tt",78],["Sergio Samitier","Spain",31,"climber",76],["Albert Torres","Spain",36,"rouleur",76],
    ["Will Barta","United States",30,"tt",78],["Mathias Norsgaard","Denmark",29,"rouleur",77],["Jon Barrenetxea","Spain",26,"classics",77],["Diego Pescador","Colombia",21,"climber",78]
  ],
  redbull: [
    ["Primož Roglič","Slovenia",36,"gc",94],["Remco Evenepoel","Belgium",26,"gc",96],["Jai Hindley","Australia",30,"climber",87],["Aleksandr Vlasov","Russia",30,"co",86],
    ["Daniel Felipe Martínez","Colombia",30,"climber",87],["Florian Lipowitz","Germany",25,"climber",85],["Roger Adrià","Spain",28,"puncheur",80],["Sam Welsford","Australia",30,"sprinter",86],
    ["Danny van Poppel","Netherlands",33,"sprinter",82],["Nico Denz","Germany",32,"rouleur",80],["Ryan Mullen","Ireland",32,"tt",80],["Bob Jungels","Luxembourg",33,"rouleur",80],
    ["Giovanni Aleotti","Italy",27,"climber",79],["Finn Fisher-Black","New Zealand",24,"puncheur",80],["Oier Lazkano","Spain",26,"classics",82],["Emil Herzog","Germany",21,"puncheur",78],
    ["Jonas Koch","Germany",33,"domestique",76],["Max Schachmann","Germany",32,"puncheur",80],["Gianni Moscon","Italy",32,"classics",78],["Laurence Pithie","New Zealand",24,"classics",81],
    ["Sergio Higuita","Colombia",29,"climber",81],["Jordi Meeus","Belgium",28,"sprinter",81],["Marco Haller","Austria",35,"domestique",76],["Patrick Gamper","Austria",29,"rouleur",77]
  ],
  soudal: [
    ["Mikel Landa","Spain",36,"climber",86],["Tim Merlier","Belgium",33,"sprinter",89],["Jasper Stuyven","Belgium",34,"classics",85],["Yves Lampaert","Belgium",35,"tt",82],
    ["Ilan Van Wilder","Belgium",26,"co",83],["Mauri Vansevenant","Belgium",27,"puncheur",81],["Bert Van Lerberghe","Belgium",33,"domestique",78],["Mattia Cattaneo","Italy",36,"tt",80],
    ["Paul Magnier","France",22,"sprinter",82],["Ethan Hayter","Great Britain",27,"rouleur",80],["Junior Lecerf","Belgium",23,"climber",80],["Casper Pedersen","Denmark",30,"classics",78],
    ["Dries Van Gestel","Belgium",31,"classics",79],["James Knox","Great Britain",30,"climber",78],["Louis Vervaeke","Belgium",32,"domestique",77],["Gil Gelders","Belgium",23,"classics",77],
    ["Luke Lamperti","United States",23,"sprinter",80],["Pascal Eenkhoorn","Netherlands",29,"rouleur",78],["Pieter Serry","Belgium",37,"domestique",76],["Antoine Huby","France",25,"puncheur",77],
    ["Kasper Asgreen","Denmark",31,"rouleur",82],["Fausto Masnada","Italy",33,"climber",78],["Josef Černý","Czech Republic",33,"tt",78],["William Junior Lecerf","Belgium",23,"climber",80]
  ],
  lidl: [
    ["Juan Ayuso","Spain",24,"gc",91],["Mads Pedersen","Denmark",30,"classics",91],["Jonathan Milan","Italy",26,"sprinter",90],["Giulio Ciccone","Italy",31,"climber",86],
    ["Mattias Skjelmose","Denmark",26,"co",87],["Tao Geoghegan Hart","Great Britain",31,"climber",83],["Jasper Stuyven","Belgium",34,"classics",84],["Simone Consonni","Italy",31,"rouleur",80],
    ["Matteo Sobrero","Italy",29,"tt",82],["Max Walscheid","Germany",33,"sprinter",80],["Toms Skujiņš","Latvia",35,"classics",82],["Quinn Simmons","United States",25,"classics",81],
    ["Mathias Vacek","Czech Republic",24,"tt",81],["Thibau Nys","Belgium",24,"puncheur",84],["Andrea Bagioli","Italy",27,"puncheur",80],["Sam Oomen","Netherlands",31,"domestique",78],
    ["Patrick Konrad","Austria",34,"climber",78],["Amanuel Ghebreigzabhier","Eritrea",32,"climber",77],["Tim Torn Teutenberg","Germany",24,"sprinter",77],["Daan Hoole","Netherlands",27,"tt",80],
    ["Søren Kragh Andersen","Denmark",32,"rouleur",80],["Kenny Elissonde","France",35,"climber",77],["Otto Vergaerde","Belgium",32,"domestique",76],["Ryan Gibbons","South Africa",32,"rouleur",77]
  ],
  alpecin: [
    ["Mathieu van der Poel","Netherlands",31,"classics",96],["Jasper Philipsen","Belgium",28,"sprinter",93],["Kaden Groves","Australia",27,"sprinter",87],["Florian Sénéchal","France",33,"classics",82],
    ["Gerben Thijssen","Belgium",28,"sprinter",82],["Tibor Del Grosso","Netherlands",23,"puncheur",82],["Henri Uhlig","Germany",25,"classics",80],["Quinten Hermans","Belgium",31,"puncheur",81],
    ["Gianni Vermeersch","Belgium",33,"classics",80],["Silvan Dillier","Switzerland",36,"rouleur",78],["Jonas Rickaert","Belgium",32,"rouleur",78],["Søren Kragh Andersen","Denmark",32,"rouleur",80],
    ["Emiel Verstrynge","Belgium",24,"climber",80],["Gal Glivar","Slovenia",24,"climber",78],["Michael Gogl","Austria",32,"classics",78],["Simon Dehairs","Belgium",25,"sprinter",78],
    ["Ramses Debruyne","Belgium",23,"climber",76],["Francesco Busatto","Italy",24,"puncheur",77],["Maurice Ballerstedt","Germany",25,"rouleur",76],["Sente Sentjens","Netherlands",21,"puncheur",76],
    ["Robbe Ghys","Belgium",29,"rouleur",77],["Nicola Conci","Italy",29,"climber",77],["Xandro Meurisse","Belgium",34,"puncheur",78],["Kristian Sbaragli","Italy",36,"sprinter",76]
  ],
  bahrain: [
    ["Pello Bilbao","Spain",36,"gc",84],["Damiano Caruso","Italy",39,"climber",82],["Matej Mohorič","Slovenia",31,"classics",86],["Santiago Buitrago","Colombia",26,"climber",86],
    ["Antonio Tiberi","Italy",25,"co",85],["Lenny Martinez","France",23,"climber",86],["Alec Segaert","Belgium",23,"tt",83],["Phil Bauhaus","Germany",32,"sprinter",82],
    ["Fred Wright","Great Britain",27,"classics",80],["Kamil Gradek","Poland",36,"tt",78],["Rainer Kepplinger","Austria",28,"climber",78],["Edoardo Zambanini","Italy",25,"climber",79],
    ["Nicolò Buratti","Italy",25,"puncheur",78],["Jack Haig","Australia",33,"climber",79],["Afonso Eulálio","Portugal",25,"climber",78],["Vlad Van Mechelen","Belgium",22,"sprinter",77],
    ["Roman Ermakov","Russia",21,"classics",77],["Alessandro Borgo","Italy",23,"classics",77],["Alberto Bruttomesso","Italy",23,"sprinter",76],["Max van der Meulen","Netherlands",22,"climber",76],
    ["Kaden Hopkins","Bermuda",26,"tt",76],["Nikias Arndt","Germany",35,"rouleur",77],["Andrea Pasqualon","Italy",38,"classics",76],["Robert Stannard","Australia",28,"puncheur",77]
  ],
  decathlon: [
    ["Paul Seixas","France",20,"gc",87],["Felix Gall","Austria",28,"climber",86],["Olav Kooij","Netherlands",24,"sprinter",89],["Tiesj Benoot","Belgium",32,"classics",84],
    ["Oliver Naesen","Belgium",35,"classics",81],["Paul Lapeira","France",26,"puncheur",83],["Dorian Godon","France",30,"classics",81],["Bruno Armirail","France",32,"tt",81],
    ["Aurélien Paret-Peintre","France",30,"climber",81],["Matthew Riccitello","United States",24,"climber",82],["Tobias Lund Andresen","Denmark",24,"sprinter",81],["Johannes Staune-Mittet","Norway",24,"climber",79],
    ["Noa Isidore","France",22,"rouleur",77],["Pierre Gautherat","France",23,"sprinter",78],["Antoine L'Hote","France",21,"rouleur",76],["Rasmus Søjberg Pedersen","Denmark",24,"rouleur",77],
    ["Oscar Chamberlain","Australia",21,"tt",77],["Benoît Cosnefroy","France",31,"puncheur",82],["Nans Peters","France",32,"climber",78],["Mickaël Cherel","France",40,"domestique",75],
    ["Sam Bennett","Ireland",35,"sprinter",81],["Valentin Paret-Peintre","France",25,"climber",79],["Victor Lafay","France",30,"puncheur",79],["Stan Dewulf","Belgium",29,"rouleur",76]
  ],
  caja: [
    ["Fernando Gaviria","Colombia",31,"sprinter",84],["Eduard Prades","Spain",39,"classics",80],["Stefano Oldani","Italy",28,"classics",80],["Sebastian Berwick","Australia",26,"climber",79],
    ["José Félix Parra","Spain",29,"climber",78],["Alex Molenaar","Netherlands",27,"puncheur",78],["Jakub Otruba","Czech Republic",28,"tt",78],["Joel Nicolau","Spain",29,"puncheur",76],
    ["Abel Balderstone","Great Britain",26,"climber",76],["Orluis Aular","Venezuela",30,"sprinter",80],["Jefferson Cepeda","Ecuador",30,"climber",79],["David González","Spain",30,"sprinter",76],
    ["Sergio Martín","Spain",29,"rouleur",75],["Iñigo Elosegui","Spain",28,"rouleur",76],["Jokin Murguialday","Spain",26,"climber",76],["Ander Okamika","Spain",33,"rouleur",75],
    ["Unai Iribar","Spain",26,"puncheur",75],["Mikel Iturria","Spain",34,"domestique",75],["Francisco Galván","Spain",29,"sprinter",74],["Jon Barrenetxea","Spain",26,"classics",76],
    ["Iúri Leitão","Portugal",28,"sprinter",78],["Guillermo Thomas Silva","Uruguay",24,"climber",74],["Joan Bou","Spain",29,"climber",76],["Fernando Barceló","Spain",30,"puncheur",77]
  ],
  burgos: [
    ["Jesús Herrada","Spain",36,"puncheur",82],["Merhawi Kudus","Eritrea",32,"climber",80],["Jambaljamts Sainbayar","Mongolia",29,"rouleur",78],["José Manuel Díaz","Spain",31,"climber",78],
    ["Eric Antonio Fagúndez","Uruguay",28,"puncheur",77],["Lorenzo Quartucci","Italy",26,"sprinter",77],["Alexandre Mayer","Mauritius",28,"rouleur",76],["Georgios Bouglas","Greece",35,"sprinter",76],
    ["Mario Aparicio","Spain",26,"climber",76],["Ángel Madrazo","Spain",38,"climber",75],["Pelayo Sánchez","Spain",26,"puncheur",79],["David Delgado","Spain",23,"climber",74],
    ["Ander Ganzabal","Spain",24,"rouleur",74],["Aaron Gate","New Zealand",36,"rouleur",78],["Cyril Barthe","France",30,"classics",76],["Rubén Pérez","Spain",25,"domestique",74],
    ["Diego Uriarte","Spain",26,"climber",74],["Óscar Cabedo","Spain",31,"climber",75],["Álvaro Sagrado","Spain",22,"rouleur",73],["Rodrigo Álvarez","Spain",24,"puncheur",73],
    ["Daniel Babor","Czech Republic",27,"sprinter",75],["Ricardo Vilela","Portugal",38,"climber",74],["Victor Langellotti","Monaco",31,"climber",76],["Pablo Castrillo","Spain",25,"puncheur",79]
  ],
  euskaltel: [
    ["Jonathan Lastra","Spain",33,"classics",78],["Mikel Bizkarra","Spain",37,"climber",77],["Gotzon Martín","Spain",30,"puncheur",77],["Xabier Berasategi","Spain",26,"climber",76],
    ["Txomin Juaristi","Spain",31,"rouleur",76],["Jordi López","Spain",27,"climber",76],["Jon Agirre","Spain",29,"puncheur",76],["Jokin Murguialday","Spain",26,"climber",76],
    ["Luis Ángel Maté","Spain",42,"climber",75],["Ibai Azurmendi","Spain",29,"climber",75],["Iker Ballarin","Spain",28,"rouleur",74],["Unai Zubeldia","Spain",23,"puncheur",74],
    ["Asier Etxeberria","Spain",25,"climber",74],["Mikel Retegi","Spain",24,"rouleur",73],["Haimar Etxeberria","Spain",23,"sprinter",73],["Enekoitz Azparren","Spain",24,"tt",74],
    ["Joan Bou","Spain",29,"climber",75],["Xabier Mikel Azparren","Spain",27,"tt",75],["Urko Berrade","Spain",28,"puncheur",76],["Ander Ganzabal","Spain",24,"rouleur",74],
    ["Unai Cuadrado","Spain",27,"domestique",73],["Víctor de la Parte","Spain",40,"climber",75],["Iker Mintegi","Spain",23,"climber",74],["Mikel Uncilla","Spain",22,"rouleur",73]
  ],
  polti: [
    ["Giovanni Lonardi","Italy",30,"sprinter",80],["Mirco Maestri","Italy",34,"rouleur",79],["Alessandro Tonelli","Italy",34,"puncheur",78],["Manuel Peñalver","Spain",27,"sprinter",78],
    ["Thomas Pesenti","Italy",26,"climber",77],["Mattia Bais","Italy",29,"rouleur",77],["Davide Bais","Italy",28,"climber",77],["Ludovico Crescioli","Italy",23,"climber",76],
    ["Fernando Tercero","Spain",25,"climber",77],["Germán Darío Gómez","Colombia",25,"climber",76],["Javier Serrano","Spain",25,"sprinter",76],["Andrea Pietrobon","Italy",27,"rouleur",76],
    ["Andrea Mifsud","Malta",24,"rouleur",75],["Francisco Muñoz","Spain",24,"climber",75],["Aidan Buttigieg","Malta",23,"rouleur",74],["Gabriele Raccagni","Italy",25,"tt",75],
    ["Dario Igor Belletta","Italy",22,"sprinter",74],["Diego Pablo Sevilla","Spain",30,"puncheur",75],["Fabrizio Crozzolo","Italy",24,"rouleur",74],["Adrián Benito","Spain",25,"domestique",74],
    ["Davide De Pretto","Italy",24,"puncheur",78],["Samuele Zoccarato","Italy",28,"classics",76],["Davide Persico","Italy",25,"sprinter",74],["Nicolò Garibbo","Italy",26,"climber",74]
  ]
};

/* Alias antiguo por compatibilidad */
const TEAM_RIDER_BLUEPRINTS = TEAM_RIDERS;

/* ============================================================
   CONSTRUCCIÓN DE CORREDORES
   ============================================================ */

function dataClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function deterministicNoise(teamIndex, riderIndex, statName) {
  const seed = teamIndex * 101 + riderIndex * 37 + statName.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const raw = Math.sin(seed) * 10000;
  const fractional = raw - Math.floor(raw);
  return Math.round((fractional - 0.5) * 8);
}

function riderId(teamId, name, index) {
  return `${teamId}_${String(index + 1).padStart(2, "0")}_${name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")}`;
}

function normalizeRole(role) {
  if (role === "co_leader") return "co";
  if (role === "time_trialist") return "tt";
  return role;
}

function buildStats(templateStats, base, teamModifiers, teamIndex, riderIndex) {
  const stats = {};
  const baseLift = (base - 78) * 0.55;

  Object.keys(templateStats).forEach(key => {
    const modifier =
      key === "tt" ? (teamModifiers.timeTrial || 0) :
      key === "ttt" ? (teamModifiers.teamTimeTrial || 0) :
      teamModifiers[key] || 0;

    stats[key] = dataClamp(
      Math.round(templateStats[key] + baseLift + modifier + deterministicNoise(teamIndex, riderIndex, key)),
      45,
      99
    );
  });

  stats.timeTrial = stats.tt;
  stats.teamTimeTrial = stats.ttt;

  return stats;
}

function buildRiders() {
  const riders = [];

  TEAM_BLUEPRINTS.forEach((team, teamIndex) => {
    const list = TEAM_RIDERS[team.id] || [];

    list.forEach((item, riderIndex) => {
      const [name, nationality, age, rawRole, base] = item;
      const roleKey = normalizeRole(rawRole);
      const template = ROLE_TEMPLATES[roleKey] || ROLE_TEMPLATES.domestique;
      const stats = buildStats(template.stats, base, team.modifiers || {}, teamIndex, riderIndex);

      riders.push({
        id: riderId(team.id, name, riderIndex),
        name,
        nationality,
        age,
        teamId: team.id,
        roleKey,
        role: template.label,
        speciality: template.label,
        base,
        defaultOrder: template.defaultOrder,
        defaultEffort: template.defaultEffort,
        stats,
        form: dataClamp(base + (team.modifiers?.form || 0) + deterministicNoise(teamIndex, riderIndex, "form"), 55, 99),
        morale: dataClamp(76 + (team.modifiers?.form || 0) + deterministicNoise(teamIndex, riderIndex, "morale"), 45, 99),
        energy: 100,
        fatigue: 0,
        totalTime: 0,
        raceDays: 0,
        points: 0,
        mountainPoints: 0,
        uciPoints: 0,
        stageWins: 0,
        abandonRisk: template.abandonRisk || 0.02,
        abandoned: false
      });
    });
  });

  return riders;
}

const RIDERS = buildRiders();

/* ============================================================
   ÓRDENES, TÁCTICAS Y PRESETS
   ============================================================ */

const RIDER_ORDERS = [
  { id: "sit", name: "Ir a rueda", desc: "Gasta poco. No tira. Puede quedarse si el grupo acelera.", description: "Gasta poco. No tira. Puede quedarse si el grupo acelera.", pull: 0, groupPull: 0, attack: 0, attackIntent: 0, energy: 0.72, energyMultiplier: 0.72 },
  { id: "hold", name: "Mantener posición", desc: "Rueda en grupo sin forzar.", description: "Rueda en grupo sin forzar.", pull: 0.15, groupPull: 0.15, attack: 0, attackIntent: 0, energy: 1.00, energyMultiplier: 1.00 },
  { id: "protect", name: "Proteger líder", desc: "Ayuda al líder y reduce cortes.", description: "Ayuda al líder y reduce cortes.", pull: 0.30, groupPull: 0.30, attack: 0, attackIntent: 0, energy: 1.18, energyMultiplier: 1.18, supportBonus: 2.5 },
  { id: "pull", name: "Tirar del grupo", desc: "Aumenta velocidad del grupo sin separarse.", description: "Aumenta velocidad del grupo sin separarse.", pull: 1.00, groupPull: 1.00, attack: 0, attackIntent: 0, energy: 1.42, energyMultiplier: 1.42 },
  { id: "catch", name: "Cazar fuga", desc: "Trabajo fuerte para recortar hueco.", description: "Trabajo fuerte para recortar hueco.", pull: 1.25, groupPull: 1.25, attack: 0, attackIntent: 0, energy: 1.58, energyMultiplier: 1.58 },
  { id: "tempo", name: "Subir a tempo", desc: "Ritmo alto en subida. Puede cortar rivales.", description: "Ritmo alto en subida. Puede cortar rivales.", pull: 1.10, groupPull: 1.10, attack: 0, attackIntent: 0, energy: 1.52, energyMultiplier: 1.52 },
  { id: "attack", name: "Atacar", desc: "Intenta salir del grupo hacia delante.", description: "Intenta salir del grupo hacia delante.", pull: 0.10, groupPull: 0.10, attack: 1.00, attackIntent: 1.00, energy: 1.85, energyMultiplier: 1.85 },
  { id: "bridge", name: "Saltar a grupo", desc: "Intenta cruzar al grupo delantero.", description: "Intenta cruzar al grupo delantero.", pull: 0.20, groupPull: 0.20, attack: 0.75, attackIntent: 0.75, energy: 1.70, energyMultiplier: 1.70 },
  { id: "wait", name: "Esperar líder", desc: "Pierde tiempo para ayudar al líder.", description: "Pierde tiempo para ayudar al líder.", pull: 0, groupPull: 0, attack: 0, attackIntent: 0, energy: 1.25, energyMultiplier: 1.25 },
  { id: "sprint_train", name: "Tren de sprint", desc: "Prepara al sprinter para el final.", description: "Prepara al sprinter para el final.", pull: 0.95, groupPull: 0.95, attack: 0, attackIntent: 0, energy: 1.42, energyMultiplier: 1.42, sprintTrainBonus: 3 }
];

const TACTICS = [
  { id: "conservative", name: "Conservar", description: "Menor riesgo y fatiga.", bonus: -2, risk: 0.06, fatigueMultiplier: 0.62, supportBonus: 0, sectorEnergy: 0.72 },
  { id: "balanced", name: "Equilibrado", description: "Compromiso entre rendimiento y desgaste.", bonus: 0, risk: 0.16, fatigueMultiplier: 1.0, supportBonus: 0, sectorEnergy: 1.0 },
  { id: "protect_leader", name: "Proteger líder", description: "Sacrifica rendimiento para ayudar al líder.", bonus: -1, risk: 0.12, fatigueMultiplier: 1.20, supportBonus: 2.4, sectorEnergy: 1.15 },
  { id: "aggressive", name: "Atacar", description: "Más rendimiento potencial, más riesgo.", bonus: 4, risk: 0.36, fatigueMultiplier: 1.45, supportBonus: 0, sectorEnergy: 1.45 },
  { id: "all_in", name: "Todo o nada", description: "Máximo riesgo y máximo desgaste.", bonus: 8, risk: 0.62, fatigueMultiplier: 2.0, supportBonus: 0, sectorEnergy: 2.0 },
  { id: "sprint_train", name: "Tren de sprint", description: "Ayuda al sprinter en finales rápidos.", bonus: -1, risk: 0.22, fatigueMultiplier: 1.30, supportBonus: 0, sectorEnergy: 1.35 }
];

const SMART_PRESETS = [
  { id: "protect_gc", name: "Proteger GC", description: "Líder equilibrado; gregarios protegen." },
  { id: "sprint", name: "Sprint masivo", description: "Sprinter espera; rodadores hacen tren." },
  { id: "breakaway", name: "Fuga del día", description: "Puncheurs/rouleurs atacan; líderes conservan." },
  { id: "mountain_attack", name: "Montaña agresiva", description: "GC y escaladores endurecen." },
  { id: "survival", name: "Supervivencia", description: "Todos conservan." },
  { id: "time_trial", name: "Crono a tope", description: "Croners y líderes a ritmo alto." }
];

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
    cobbles: [35, 25, 20, 17, 15, 13, 11, 9, 7, 6],
    cobbles_hills: [35, 25, 20, 17, 15, 13, 11, 9, 7, 6],
    tt: [20, 17, 15, 13, 11, 9, 7, 5, 3, 1],
    ttt: [20, 17, 15, 13, 11, 9, 7, 5, 3, 1],
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
    grandTourFinalGC: [1300, 1040, 880, 730, 620, 520, 425, 325, 275, 225, 175, 150, 125, 105, 85, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5],
    stageLeaderPerDay: 25,
    secondaryFinal: [120, 50, 25],
    oneDay: [500, 400, 325, 275, 225, 175, 150, 125, 100, 85, 70, 60, 50, 40, 30]
  }
};

const DIFFICULTY_LEVELS = {
  easy: { label: "Fácil", userBonus: 3, aiBonus: -1, incidentMultiplier: 0.75, crisisMultiplier: 0.75, sponsorMultiplier: 0.85 },
  normal: { label: "Normal", userBonus: 0, aiBonus: 0, incidentMultiplier: 1.0, crisisMultiplier: 1.0, sponsorMultiplier: 1.0 },
  realistic: { label: "Realista", userBonus: -1, aiBonus: 1, incidentMultiplier: 1.25, crisisMultiplier: 1.25, sponsorMultiplier: 1.15 }
};

/* ============================================================
   NUTRICIÓN
   IDs nuevos + alias antiguos.
   ============================================================ */

const NUTRITION_ITEMS = [
  { id: "gel", name: "Gel", description: "Energía rápida.", energy: 22, hydration: 0, stomach: 8, stomachLoad: 8, morale: 0, final: 0, finalBonus: 0, delay: 0 },
  { id: "bar", name: "Barrita", description: "Energía lenta.", energy: 26, hydration: -2, stomach: 14, stomachLoad: 14, morale: 0, final: 0, finalBonus: 0, delay: 1 },
  { id: "iso", name: "Isotónico", description: "Energía e hidratación.", energy: 12, hydration: 20, stomach: 5, stomachLoad: 5, morale: 0, final: 0, finalBonus: 0, delay: 0 },
  { id: "isotonic", name: "Bidón isotónico", description: "Energía e hidratación.", energy: 12, hydration: 20, stomach: 5, stomachLoad: 5, morale: 0, final: 0, finalBonus: 0, delay: 0 },
  { id: "caf", name: "Cafeína", description: "Bonus de final.", energy: 18, hydration: -2, stomach: 10, stomachLoad: 10, morale: 3, final: 3, finalBonus: 3, delay: 0 },
  { id: "caffeine_gel", name: "Gel cafeína", description: "Bonus de final.", energy: 18, hydration: -2, stomach: 10, stomachLoad: 10, morale: 3, final: 3, finalBonus: 3, delay: 0 },
  { id: "rice", name: "Rice cake", description: "Energía estable.", energy: 18, hydration: 0, stomach: 9, stomachLoad: 9, morale: 1, final: 0, finalBonus: 0, delay: 1 },
  { id: "rice_cake", name: "Rice cake", description: "Energía estable.", energy: 18, hydration: 0, stomach: 9, stomachLoad: 9, morale: 1, final: 0, finalBonus: 0, delay: 1 },
  { id: "water", name: "Agua", description: "Hidratación sin energía.", energy: 2, hydration: 25, stomach: 2, stomachLoad: 2, morale: 0, final: 0, finalBonus: 0, delay: 0 }
];

const NUTRITION_PLANS = [
  { id: "auto_balanced", name: "Equilibrado", description: "Stock equilibrado para todo tipo de etapa.", stock: { gel: 16, bar: 12, iso: 24, caf: 6, rice: 12, water: 24, isotonic: 24, caffeine_gel: 6, rice_cake: 12 } },
  { id: "mountain", name: "Montaña", description: "Más geles y cafeína.", stock: { gel: 24, bar: 8, iso: 24, caf: 8, rice: 8, water: 24, isotonic: 24, caffeine_gel: 8, rice_cake: 8 } },
  { id: "sprint", name: "Sprint", description: "Hidratación y cafeína para final rápido.", stock: { gel: 18, bar: 10, iso: 28, caf: 8, rice: 10, water: 24, isotonic: 28, caffeine_gel: 8, rice_cake: 10 } },
  { id: "hot", name: "Calor", description: "Prioriza hidratación.", stock: { gel: 18, bar: 8, iso: 34, caf: 6, rice: 8, water: 34, isotonic: 34, caffeine_gel: 6, rice_cake: 8 } }
];

const AUTO_NUTRITION_MODES = [
  { id: "auto", name: "Automático inteligente", description: "Come según energía, hidratación, sector y final." },
  { id: "auto_smart", name: "Automático inteligente", description: "Come según energía, hidratación, sector y final." },
  { id: "conservative", name: "Automático conservador", description: "Prioriza evitar pájaras y deshidratación." },
  { id: "auto_conservative", name: "Automático conservador", description: "Prioriza evitar pájaras y deshidratación." },
  { id: "aggressive", name: "Automático agresivo", description: "Reserva recursos para ataques/finales." },
  { id: "auto_aggressive", name: "Automático agresivo", description: "Reserva recursos para ataques/finales." },
  { id: "manual", name: "Manual", description: "Tú decides cuándo come cada corredor." }
];

/* ============================================================
   ENTRENAMIENTO
   ============================================================ */

const TRAINING_OPTIONS = [
  { id: "recovery", name: "Recuperación total", description: "Reduce mucha fatiga, baja ligeramente forma.", effects: { fatigue: -22, form: -1, morale: 1 } },
  { id: "activation", name: "Activación suave", description: "Reduce fatiga y mantiene tono.", effects: { fatigue: -12, form: 1, morale: 1 } },
  { id: "altitude", name: "Concentración en altura", description: "Mejora montaña/stamina.", effects: { fatigue: -6, form: 3, mountain: 1, stamina: 1, morale: 1 } },
  { id: "time_trial", name: "Bloque de crono", description: "Mejora CRI/CRE.", effects: { fatigue: -7, form: 2, timeTrial: 1, teamTimeTrial: 1, tt: 1, ttt: 1 } },
  { id: "sprint", name: "Tren de sprint", description: "Mejora sprint, colocación y aceleración.", effects: { fatigue: -7, form: 2, sprint: 1, positioning: 1, acceleration: 1 } }
];

/* ============================================================
   ETAPAS / PERFILES
   Tipos v0.10:
   flat, hilly, mountain, cobbles, tt, ttt.
   ============================================================ */

function climb(name, category, km, length, gradient, maxGradient = null, altitude = null) {
  return {
    name,
    category,
    km,
    length,
    gradient,
    maxGradient: maxGradient || Math.round(gradient + 3),
    altitude: altitude || Math.round(500 + km * 7 + length * gradient * 5),
    severity: category === "HC" ? 5 : category === "1" ? 4 : category === "2" ? 3 : category === "3" ? 2 : 1
  };
}

function pave(name, from, to, severity = 3) {
  return {
    name,
    from,
    to,
    kmStart: from,
    kmEnd: to,
    severity
  };
}

function wall(name, km, length, gradient, maxGradient = null) {
  return {
    name,
    km,
    length,
    gradient,
    maxGradient: maxGradient || Math.round(gradient + 4),
    severity: gradient >= 10 ? 5 : 4
  };
}

function sprint(km) {
  return { km, points: CLASSIFICATION_RULES.intermediateSprintPoints };
}

function typeLabel(type) {
  return {
    flat: "Llana",
    hilly: "Media montaña",
    mountain: "Alta montaña",
    cobbles: "Pavés y muros",
    cobbles_hills: "Pavés y muros",
    tt: "CRI",
    ttt: "CRE",
    time_trial: "CRI",
    team_time_trial: "CRE"
  }[type] || type;
}

function legacyType(type) {
  return {
    cobbles: "cobbles_hills",
    tt: "time_trial",
    ttt: "team_time_trial"
  }[type] || type;
}

function makeVisualSegments(stage) {
  const segments = [{ from: 0, to: stage.distance, type: "flat", label: "Carretera" }];

  stage.climbs.forEach(c => {
    segments.push({
      from: dataClamp(c.km - c.length, 0, stage.distance),
      to: c.km,
      type: c.category === "HC" || c.category === "1" ? "climb-hard" : "climb",
      label: `${c.category} ${c.name}`,
      severity: c.severity,
      gradient: c.gradient
    });

    if (c.km + 10 < stage.distance) {
      segments.push({
        from: c.km,
        to: dataClamp(c.km + 10, 0, stage.distance),
        type: "descent",
        label: "Descenso técnico",
        severity: stage.technicalDescent > 60 ? 4 : 2
      });
    }
  });

  stage.paves.forEach(p => {
    segments.push({
      from: p.from,
      to: p.to,
      type: "pave",
      label: p.name,
      severity: p.severity
    });
  });

  stage.walls.forEach(w => {
    segments.push({
      from: dataClamp(w.km - w.length, 0, stage.distance),
      to: w.km,
      type: "wall",
      label: w.name,
      severity: w.severity,
      gradient: w.gradient
    });
  });

  if (stage.wind > 58 && stage.type === "flat") {
    segments.push({
      from: Math.round(stage.distance * 0.35),
      to: Math.round(stage.distance * 0.72),
      type: "wind",
      label: "Zona de viento lateral",
      severity: Math.round(stage.wind / 20)
    });
  }

  return segments.sort((a, b) => a.from - b.from);
}

function makeSectors(stage) {
  const count = stage.distance > 220 ? 6 : stage.distance > 170 ? 5 : stage.distance > 90 ? 4 : 3;
  const sectors = [];

  for (let i = 0; i < count; i++) {
    const from = Math.round((stage.distance / count) * i);
    const to = i === count - 1 ? stage.distance : Math.round((stage.distance / count) * (i + 1));

    const c = stage.climbs.find(x => x.km >= from && x.km <= to);
    const p = stage.paves.find(x => x.from <= to && x.to >= from);
    const w = stage.walls.find(x => x.km >= from && x.km <= to);
    const final = i === count - 1;

    let sectorType = stage.type;

    if (final) sectorType = "final";
    else if (p) sectorType = "cobbles";
    else if (w) sectorType = "wall";
    else if (c) sectorType = "climb";
    else if (stage.type === "mountain") sectorType = "climb";
    else if (stage.type === "hilly") sectorType = "hilly";
    else if (stage.type === "flat") sectorType = "flat";
    else if (stage.type === "tt" || stage.type === "ttt") sectorType = "tt";

    sectors.push({
      id: `${stage.id}_s${i + 1}`,
      name:
        sectorType === "climb" ? `Subida ${c ? c.name : ""}` :
        sectorType === "cobbles" ? `Pavé ${p ? p.name : ""}` :
        sectorType === "wall" ? `Muro ${w ? w.name : ""}` :
        sectorType === "final" ? "Final de etapa" :
        sectorType === "flat" ? "Llano / control" :
        sectorType === "tt" ? "Sector crono" :
        "Terreno quebrado",
      from,
      to,
      kmStart: from,
      kmEnd: to,
      type: sectorType,
      difficulty: dataClamp(stage.difficulty + (c ? 12 : 0) + (p ? p.severity * 5 : 0) + (w ? 14 : 0) + (final ? 8 : 0), 15, 100),
      energyCost:
        sectorType === "flat" ? 14 :
        sectorType === "hilly" ? 22 :
        sectorType === "climb" ? 30 :
        sectorType === "wall" ? 32 :
        sectorType === "cobbles" ? 28 :
        sectorType === "tt" ? 26 :
        sectorType === "final" ? 34 : 18,
      attackValue:
        sectorType === "flat" ? 25 :
        sectorType === "hilly" ? 65 :
        sectorType === "climb" ? 85 :
        sectorType === "wall" ? 92 :
        sectorType === "cobbles" ? 75 :
        sectorType === "final" ? 95 : 50,
      risk:
        sectorType === "cobbles" ? 70 :
        sectorType === "wall" ? 58 :
        sectorType === "climb" ? 45 :
        sectorType === "final" ? 55 :
        stage.rain > 40 ? 45 : 30,
      question:
        sectorType === "flat" ? "¿Controlar fuga o ahorrar?" :
        sectorType === "climb" ? "¿Endurecer la subida o conservar?" :
        sectorType === "cobbles" ? "¿Pasar delante el pavé o evitar riesgos?" :
        sectorType === "wall" ? "¿Atacar en el muro o aguantar?" :
        sectorType === "final" ? "¿Disputar, atacar o proteger la general?" :
        sectorType === "tt" ? "¿Ritmo máximo o gestión?" :
        "¿Mantener grupo o preparar ataque?",
      tacticalQuestion:
        sectorType === "flat" ? "¿Controlar fuga o ahorrar?" :
        sectorType === "climb" ? "¿Endurecer la subida o conservar?" :
        sectorType === "cobbles" ? "¿Pasar delante el pavé o evitar riesgos?" :
        sectorType === "wall" ? "¿Atacar en el muro o aguantar?" :
        sectorType === "final" ? "¿Disputar, atacar o proteger la general?" :
        sectorType === "tt" ? "¿Ritmo máximo o gestión?" :
        "¿Mantener grupo o preparar ataque?"
    });
  }

  return sectors;
}

function stage(id, number, name, type, distance, difficulty, profile = {}) {
  const st = {
    id,
    number,
    name,
    type,
    legacyType: legacyType(type),
    label: typeLabel(type),
    distance,
    difficulty,
    elevation: profile.elevation || profile.elevationGain || 900,
    elevationGain: profile.elevation || profile.elevationGain || 900,
    wind: profile.wind || profile.windExposure || 30,
    windExposure: profile.wind || profile.windExposure || 30,
    heat: profile.heat || 45,
    rain: profile.rain || profile.rainRisk || 20,
    rainRisk: profile.rain || profile.rainRisk || 20,
    roadSurface: profile.roadSurface || (type === "cobbles" ? "pavé" : "normal"),
    technicalDescent: profile.technicalDescent || 25,
    climbs: profile.climbs || [],
    paves: profile.paves || profile.paveSegments || [],
    paveSegments: profile.paves || profile.paveSegments || [],
    walls: profile.walls || [],
    finalClimb: !!profile.finalClimb,
    description: profile.description || "Etapa del calendario."
  };

  st.profile = {
    elevationGain: st.elevation,
    finalClimb: st.finalClimb,
    technicalDescent: st.technicalDescent,
    windExposure: st.wind,
    heat: st.heat,
    rainRisk: st.rain,
    roadSurface: st.roadSurface,
    climbs: st.climbs,
    paves: st.paves,
    paveSegments: st.paves,
    walls: st.walls,
    intermediateSprints: profile.intermediateSprints === false ? [] : profile.intermediateSprints || [sprint(Math.round(distance * 0.45))],
    finishBonuses: profile.finishBonuses === false ? [] : CLASSIFICATION_RULES.finishBonuses
  };

  st.profile.visualSegments = makeVisualSegments(st);
  st.sectors = makeSectors(st);

  return st;
}

/* ============================================================
   GRANDES VUELTAS
   ============================================================ */

const TOUR_STAGES = [
  stage("tour_01", 1, "Grand Départ Costero", "flat", 182, 34, { wind: 65, elevation: 900, description: "Sprint con riesgo de abanicos." }),
  stage("tour_02", 2, "Muros del Interior", "hilly", 171, 68, { elevation: 2500, climbs: [climb("Saint-Romain", "3", 96, 3.8, 6.1, 11, 740)], walls: [wall("Mur final", 168, 2.2, 9.4, 15)] }),
  stage("tour_03", 3, "Llanura del Norte", "flat", 198, 38, { wind: 44, elevation: 700 }),
  stage("tour_04", 4, "Crono por Equipos", "ttt", 41, 62, { elevation: 420, intermediateSprints: false, finishBonuses: false, description: "El tiempo lo marca el 4º corredor." }),
  stage("tour_05", 5, "Pavés y Muros", "cobbles", 204, 88, { rain: 38, elevation: 2100, roadSurface: "pavé", paves: [pave("Bosque", 64, 68, 4), pave("Granja", 122, 127, 5), pave("Carrefour", 184, 190, 5)], walls: [wall("Chapelle", 187, 1.6, 10.2, 17)] }),
  stage("tour_06", 6, "Sprint del Valle", "flat", 176, 32, { elevation: 650 }),
  stage("tour_07", 7, "Primer Contacto Alpino", "mountain", 164, 84, { elevation: 3900, climbs: [climb("Col de la Biche", "1", 88, 11.5, 7.1, 12, 1450), climb("Mont du Cerf", "1", 153, 9.6, 8.0, 13, 1650)], finalClimb: true }),
  stage("tour_08", 8, "Etapa Trampa", "hilly", 186, 72, { elevation: 3100, climbs: [climb("Côte des Vignes", "3", 44, 4.1, 5.8, 10, 680)], walls: [wall("Signal", 176, 1.1, 11.5, 17)] }),
  stage("tour_09", 9, "Cima de los Lagos", "mountain", 152, 91, { elevation: 4300, climbs: [climb("Port de Balès", "HC", 94, 18.6, 7.2, 13, 1755), climb("Lagos", "HC", 152, 13.7, 8.4, 15, 1880)], finalClimb: true }),
  stage("tour_10", 10, "Llanura de Recuperación", "flat", 188, 36, { elevation: 800 }),
  stage("tour_11", 11, "Crono Individual", "tt", 37, 70, { elevation: 550, intermediateSprints: false, finishBonuses: false }),
  stage("tour_12", 12, "Camino de los Viñedos", "flat", 211, 42, { heat: 65, elevation: 1100 }),
  stage("tour_13", 13, "Colinas Encadenadas", "hilly", 194, 76, { elevation: 3400, climbs: [climb("Croix", "2", 121, 6.2, 7.0, 13, 960), climb("Château", "3", 181, 3.2, 8.2, 15, 820)] }),
  stage("tour_14", 14, "Etapa Reina", "mountain", 178, 98, { elevation: 5200, technicalDescent: 78, climbs: [climb("Madeleine", "HC", 82, 19.2, 7.8, 13, 1984), climb("Télégraphe", "1", 131, 11.8, 7.3, 12, 1566), climb("Final en alto", "HC", 178, 15.4, 8.1, 16, 2140)], finalClimb: true }),
  stage("tour_15", 15, "Montaña Acumulada", "mountain", 183, 94, { elevation: 4700, climbs: [climb("Sarenne", "1", 96, 13, 7.0, 12, 1650), climb("La Toussuire", "HC", 183, 16.1, 7.3, 14, 1705)], finalClimb: true }),
  stage("tour_16", 16, "Sprint Tardío", "flat", 169, 35, { elevation: 650 }),
  stage("tour_17", 17, "Alta Montaña Explosiva", "mountain", 136, 90, { elevation: 3900, climbs: [climb("Col court", "2", 45, 6.5, 7.7, 13, 1220), climb("Final explosivo", "1", 136, 8.8, 9.1, 16, 1740)], finalClimb: true }),
  stage("tour_18", 18, "Gran Fondo Alpino", "mountain", 201, 96, { elevation: 5000, technicalDescent: 82, climbs: [climb("Vars", "1", 73, 14.2, 6.8, 12, 2100), climb("Izoard", "HC", 141, 14.1, 7.3, 13, 2360), climb("Final alpino", "HC", 201, 12.9, 8.5, 16, 2200)], finalClimb: true }),
  stage("tour_19", 19, "Crono Final", "tt", 31, 74, { elevation: 700, intermediateSprints: false, finishBonuses: false }),
  stage("tour_20", 20, "Muros Finales", "hilly", 143, 82, { elevation: 2800, walls: [wall("Mur du Signal", 132, 2.4, 10.8, 18), wall("Côte Finale", 140, 1.8, 9, 15)] }),
  stage("tour_21", 21, "Paseo Final", "flat", 115, 25, { elevation: 400 })
];

function cloneRaceStages(source, prefix, label, bias = 0) {
  return source.map(st => {
    const copy = JSON.parse(JSON.stringify(st));
    copy.id = copy.id.replace("tour", prefix);
    copy.name = copy.name.replace("Tour", label);
    copy.difficulty = dataClamp(copy.difficulty + bias, 20, 100);
    copy.heat = prefix === "vuelta" ? dataClamp(copy.heat + 10, 0, 100) : copy.heat;
    copy.rain = prefix === "giro" ? dataClamp(copy.rain + 8, 0, 100) : copy.rain;
    copy.rainRisk = copy.rain;
    copy.windExposure = copy.wind;
    copy.elevationGain = copy.elevation;
    copy.profile.heat = copy.heat;
    copy.profile.rainRisk = copy.rain;
    copy.profile.windExposure = copy.wind;
    copy.profile.elevationGain = copy.elevation;
    copy.profile.visualSegments = makeVisualSegments(copy);
    copy.sectors = makeSectors(copy);
    return copy;
  });
}

/* ============================================================
   CLÁSICAS
   ============================================================ */

const ONE_DAY_RACES = [
  {
    id: "roubaix",
    name: "Paris-Roubaix",
    country: "France",
    jersey: "Ganador",
    jerseyClass: "jersey-cobbles",
    leaderJerseyName: "Ganador",
    leaderJerseyClass: "jersey-cobbles",
    type: "classic",
    uciClass: "monument",
    stages: [
      stage("roubaix_01", 1, "Paris-Roubaix", "cobbles", 257, 98, {
        rain: 45,
        wind: 55,
        elevation: 1600,
        roadSurface: "pavé",
        paves: [pave("Arenberg", 162, 164.3, 5), pave("Mons-en-Pévèle", 207, 210, 5), pave("Carrefour de l'Arbre", 240, 242.1, 5)]
      })
    ]
  },
  {
    id: "flanders",
    name: "Tour de Flandes",
    country: "Belgium",
    jersey: "Ganador",
    jerseyClass: "jersey-yellow",
    leaderJerseyName: "Ganador",
    leaderJerseyClass: "jersey-yellow",
    type: "classic",
    uciClass: "monument",
    stages: [
      stage("flanders_01", 1, "Tour de Flandes", "cobbles", 272, 96, {
        elevation: 2900,
        wind: 50,
        roadSurface: "pavé",
        paves: [pave("Oude Kwaremont", 220, 222.2, 4), pave("Paterberg", 247, 247.4, 5)],
        walls: [wall("Oude Kwaremont", 222, 2.2, 4, 11), wall("Paterberg", 247, 0.4, 12.9, 20)]
      })
    ]
  },
  {
    id: "liege",
    name: "Liège-Bastogne-Liège",
    country: "Belgium",
    jersey: "Ganador",
    jerseyClass: "jersey-red",
    leaderJerseyName: "Ganador",
    leaderJerseyClass: "jersey-red",
    type: "classic",
    uciClass: "monument",
    stages: [
      stage("liege_01", 1, "Liège-Bastogne-Liège", "hilly", 259, 94, {
        elevation: 4100,
        walls: [wall("La Redoute", 220, 2.0, 8.9, 16), wall("Roche-aux-Faucons", 242, 1.3, 11.0, 18)]
      })
    ]
  },
  {
    id: "lombardia",
    name: "Il Lombardia",
    country: "Italy",
    jersey: "Ganador",
    jerseyClass: "jersey-pink",
    leaderJerseyName: "Ganador",
    leaderJerseyClass: "jersey-pink",
    type: "classic",
    uciClass: "monument",
    stages: [
      stage("lombardia_01", 1, "Il Lombardia", "hilly", 253, 95, {
        elevation: 4400,
        technicalDescent: 75,
        climbs: [climb("Ghisallo", "1", 166, 8.6, 6.2, 12, 754), climb("Civiglio", "1", 235, 4.2, 9.7, 15, 620)],
        walls: [wall("Civiglio", 235, 4.2, 9.7, 15)]
      })
    ]
  },
  {
    id: "worlds",
    name: "Campeonato del Mundo",
    country: "World",
    jersey: "Arcoíris",
    jerseyClass: "jersey-rainbow",
    leaderJerseyName: "Arcoíris",
    leaderJerseyClass: "jersey-rainbow",
    type: "classic",
    uciClass: "worlds",
    stages: [
      stage("worlds_01", 1, "Mundial en ruta", "hilly", 268, 97, {
        elevation: 3600,
        climbs: [climb("Circuito duro", "2", 210, 3.1, 7.8, 14, 610), climb("Último muro", "3", 263, 1.0, 9.5, 17, 540)],
        walls: [wall("Último muro", 263, 1.0, 9.5, 17)]
      })
    ]
  }
];

/* ============================================================
   CARRERAS
   Campos nuevos + campos antiguos.
   ============================================================ */

const RACES = [
  {
    id: "tour",
    name: "Tour de France",
    country: "France",
    jersey: "Maillot amarillo",
    jerseyClass: "jersey-yellow",
    leaderJerseyName: "Maillot amarillo",
    leaderJerseyClass: "jersey-yellow",
    type: "grand_tour",
    uciClass: "grand_tour",
    stages: TOUR_STAGES
  },
  {
    id: "giro",
    name: "Giro d'Italia",
    country: "Italy",
    jersey: "Maglia rosa",
    jerseyClass: "jersey-pink",
    leaderJerseyName: "Maglia rosa",
    leaderJerseyClass: "jersey-pink",
    type: "grand_tour",
    uciClass: "grand_tour",
    stages: cloneRaceStages(TOUR_STAGES, "giro", "Giro", 2)
  },
  {
    id: "vuelta",
    name: "La Vuelta a España",
    country: "Spain",
    jersey: "Maillot rojo",
    jerseyClass: "jersey-red",
    leaderJerseyName: "Maillot rojo",
    leaderJerseyClass: "jersey-red",
    type: "grand_tour",
    uciClass: "grand_tour",
    stages: cloneRaceStages(TOUR_STAGES, "vuelta", "Vuelta", 1)
  },
  ...ONE_DAY_RACES
];

const SEASON_RACE_IDS = ["giro", "tour", "vuelta", "flanders", "roubaix", "liege", "lombardia", "worlds"];
const DEFAULT_RACE_ID = "tour";
const STAGES = RACES.find(race => race.id === DEFAULT_RACE_ID).stages;
