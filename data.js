/* ============================================================
   CYCLING MANAGER TOUR
   data.js
   v0.11 Season + Race Director Pro
   Sustituir archivo completo
   ============================================================ */

const ROSTER_SIZE = 8;
const SAVE_VERSION = "v0.11";

/* ============================================================
   EQUIPOS
   ============================================================ */

const TEAMS = [
  {
    id: "uae",
    name: "UAE Team Emirates XRG",
    level: "WT",
    country: "United Arab Emirates",
    archetype: "Superteam / GC",
    color: "green",
    visual: { primary: "#00843d", secondary: "#ffffff", accent: "#d32f2f", logoText: "UAE" },
    material: { frame: "colnago", wheels: "enve" },
    ai: { gc: 98, sprint: 42, classics: 72, breakaway: 48, control: 92 }
  },
  {
    id: "visma",
    name: "Team Visma | Lease a Bike",
    level: "WT",
    country: "Netherlands",
    archetype: "GC / Bloque",
    color: "yellow",
    visual: { primary: "#facc15", secondary: "#111827", accent: "#2563eb", logoText: "VISMA" },
    material: { frame: "cervelo", wheels: "reserve" },
    ai: { gc: 96, sprint: 62, classics: 78, breakaway: 54, control: 94 }
  },
  {
    id: "ineos",
    name: "Netcompany INEOS",
    level: "WT",
    country: "Great Britain",
    archetype: "Crono / GC",
    color: "red",
    visual: { primary: "#d91e36", secondary: "#111827", accent: "#ffffff", logoText: "INEOS" },
    material: { frame: "pinarello", wheels: "shimano" },
    ai: { gc: 84, sprint: 28, classics: 55, breakaway: 42, control: 78 }
  },
  {
    id: "movistar",
    name: "Movistar Team",
    level: "WT",
    country: "Spain",
    archetype: "Montaña / Etapas",
    color: "blue",
    visual: { primary: "#2563eb", secondary: "#22c55e", accent: "#ffffff", logoText: "MOVISTAR" },
    material: { frame: "canyon", wheels: "zipp" },
    ai: { gc: 76, sprint: 42, classics: 58, breakaway: 86, control: 52 }
  },
  {
    id: "redbull",
    name: "Red Bull - BORA - hansgrohe",
    level: "WT",
    country: "Germany",
    archetype: "GC / Potencia",
    color: "orange",
    visual: { primary: "#0f172a", secondary: "#f59e0b", accent: "#ef4444", logoText: "RED BULL" },
    material: { frame: "specialized", wheels: "roval" },
    ai: { gc: 94, sprint: 58, classics: 68, breakaway: 54, control: 82 }
  },
  {
    id: "soudal",
    name: "Soudal Quick-Step",
    level: "WT",
    country: "Belgium",
    archetype: "Sprint / Clásicas",
    color: "blue",
    visual: { primary: "#2563eb", secondary: "#ffffff", accent: "#ef4444", logoText: "SOUDAL" },
    material: { frame: "specialized", wheels: "roval" },
    ai: { gc: 66, sprint: 88, classics: 82, breakaway: 58, control: 66 }
  },
  {
    id: "lidl",
    name: "Lidl - Trek",
    level: "WT",
    country: "Germany",
    archetype: "Sprint / Clásicas / GC",
    color: "red",
    visual: { primary: "#0f172a", secondary: "#ef4444", accent: "#facc15", logoText: "LIDL TREK" },
    material: { frame: "trek", wheels: "bontrager" },
    ai: { gc: 76, sprint: 90, classics: 88, breakaway: 66, control: 72 }
  },
  {
    id: "alpecin",
    name: "Alpecin - Premier Tech",
    level: "WT",
    country: "Belgium",
    archetype: "Clásicas / Sprint",
    color: "cyan",
    visual: { primary: "#0f172a", secondary: "#06b6d4", accent: "#ef4444", logoText: "ALPECIN" },
    material: { frame: "canyon", wheels: "shimano" },
    ai: { gc: 22, sprint: 96, classics: 98, breakaway: 74, control: 58 }
  },
  {
    id: "bahrain",
    name: "Bahrain Victorious",
    level: "WT",
    country: "Bahrain",
    archetype: "Montaña / Clásicas",
    color: "red",
    visual: { primary: "#ef4444", secondary: "#ffffff", accent: "#111827", logoText: "BAHRAIN" },
    material: { frame: "merida", wheels: "vision" },
    ai: { gc: 70, sprint: 54, classics: 72, breakaway: 76, control: 56 }
  },
  {
    id: "decathlon",
    name: "Decathlon CMA CGM Team",
    level: "WT",
    country: "France",
    archetype: "Desarrollo / Montaña",
    color: "green",
    visual: { primary: "#10b981", secondary: "#0f172a", accent: "#f97316", logoText: "DECATHLON" },
    material: { frame: "vanrysel", wheels: "swissside" },
    ai: { gc: 74, sprint: 76, classics: 70, breakaway: 82, control: 58 }
  },
  {
    id: "caja",
    name: "Caja Rural - Seguros RGA",
    level: "PRT",
    country: "Spain",
    archetype: "ProTeam / Fugas",
    color: "green",
    visual: { primary: "#0f7d45", secondary: "#ffffff", accent: "#d9a441", logoText: "CAJA RURAL" },
    material: { frame: "mmr", wheels: "vision" },
    ai: { gc: 38, sprint: 72, classics: 56, breakaway: 92, control: 34 }
  },
  {
    id: "burgos",
    name: "Burgos Burpellet BH",
    level: "PRT",
    country: "Spain",
    archetype: "ProTeam / Montaña-Fugas",
    color: "pink",
    visual: { primary: "#ffffff", secondary: "#ec4899", accent: "#7c3aed", logoText: "BURGOS BH" },
    material: { frame: "bh", wheels: "vision" },
    ai: { gc: 42, sprint: 46, classics: 58, breakaway: 94, control: 30 }
  },
  {
    id: "euskaltel",
    name: "Euskaltel - Euskadi",
    level: "PRT",
    country: "Spain",
    archetype: "ProTeam / Cantera-Fugas",
    color: "orange",
    visual: { primary: "#f97316", secondary: "#fb7185", accent: "#111827", logoText: "EUSKALTEL" },
    material: { frame: "orbea", wheels: "orbea" },
    ai: { gc: 36, sprint: 30, classics: 62, breakaway: 96, control: 28 }
  },
  {
    id: "polti",
    name: "Team Polti VisitMalta",
    level: "PRT",
    country: "Italy",
    archetype: "ProTeam / Sprint-Fugas",
    color: "red",
    visual: { primary: "#ef4444", secondary: "#ffffff", accent: "#16a34a", logoText: "POLTI" },
    material: { frame: "aurum", wheels: "fulcrum" },
    ai: { gc: 32, sprint: 68, classics: 58, breakaway: 88, control: 34 }
  }
];

/* ============================================================
   MATERIAL
   100 = referencia máxima interna del simulador
   ============================================================ */

const FRAME_BRANDS = [
  { id: "colnago", name: "Colnago", aero: 96, weight: 94, stiffness: 97, comfort: 88, handling: 93, cobbles: 84, tt: 88, reliability: 94 },
  { id: "cervelo", name: "Cervélo", aero: 98, weight: 93, stiffness: 95, comfort: 87, handling: 92, cobbles: 83, tt: 97, reliability: 93 },
  { id: "pinarello", name: "Pinarello", aero: 97, weight: 92, stiffness: 98, comfort: 87, handling: 96, cobbles: 84, tt: 95, reliability: 94 },
  { id: "canyon", name: "Canyon", aero: 97, weight: 94, stiffness: 95, comfort: 88, handling: 92, cobbles: 86, tt: 95, reliability: 93 },
  { id: "specialized", name: "Specialized", aero: 99, weight: 95, stiffness: 96, comfort: 90, handling: 94, cobbles: 86, tt: 94, reliability: 95 },
  { id: "trek", name: "Trek", aero: 95, weight: 93, stiffness: 94, comfort: 91, handling: 93, cobbles: 89, tt: 91, reliability: 95 },
  { id: "merida", name: "Merida", aero: 94, weight: 92, stiffness: 94, comfort: 89, handling: 91, cobbles: 86, tt: 90, reliability: 94 },
  { id: "vanrysel", name: "Van Rysel", aero: 93, weight: 91, stiffness: 92, comfort: 88, handling: 90, cobbles: 84, tt: 88, reliability: 91 },
  { id: "mmr", name: "MMR", aero: 90, weight: 93, stiffness: 91, comfort: 87, handling: 89, cobbles: 82, tt: 85, reliability: 90 },
  { id: "bh", name: "BH", aero: 91, weight: 94, stiffness: 92, comfort: 88, handling: 90, cobbles: 83, tt: 86, reliability: 91 },
  { id: "orbea", name: "Orbea", aero: 92, weight: 93, stiffness: 92, comfort: 89, handling: 91, cobbles: 84, tt: 87, reliability: 92 },
  { id: "aurum", name: "Aurum", aero: 92, weight: 92, stiffness: 92, comfort: 88, handling: 90, cobbles: 83, tt: 87, reliability: 90 }
];

const WHEEL_BRANDS = [
  { id: "enve", name: "ENVE", aero: 96, weight: 93, stiffness: 95, crosswind: 90, cobbles: 87, tt: 94, reliability: 93 },
  { id: "reserve", name: "Reserve", aero: 97, weight: 93, stiffness: 95, crosswind: 91, cobbles: 85, tt: 96, reliability: 93 },
  { id: "shimano", name: "Shimano Dura-Ace", aero: 94, weight: 93, stiffness: 94, crosswind: 92, cobbles: 87, tt: 91, reliability: 96 },
  { id: "zipp", name: "Zipp", aero: 96, weight: 92, stiffness: 94, crosswind: 88, cobbles: 85, tt: 95, reliability: 92 },
  { id: "roval", name: "Roval", aero: 98, weight: 95, stiffness: 95, crosswind: 90, cobbles: 86, tt: 96, reliability: 94 },
  { id: "bontrager", name: "Bontrager", aero: 94, weight: 92, stiffness: 93, crosswind: 91, cobbles: 88, tt: 90, reliability: 95 },
  { id: "vision", name: "Vision Metron", aero: 95, weight: 91, stiffness: 94, crosswind: 88, cobbles: 84, tt: 94, reliability: 92 },
  { id: "swissside", name: "Swiss Side", aero: 93, weight: 90, stiffness: 91, crosswind: 89, cobbles: 84, tt: 92, reliability: 91 },
  { id: "fulcrum", name: "Fulcrum", aero: 92, weight: 92, stiffness: 92, crosswind: 90, cobbles: 86, tt: 88, reliability: 92 },
  { id: "orbea", name: "Orbea Oquo", aero: 90, weight: 90, stiffness: 90, crosswind: 89, cobbles: 84, tt: 85, reliability: 90 }
];

const EQUIPMENT_PRESETS = [
  { id: "auto", name: "Auto según etapa", frameType: "auto", wheelType: "auto" },
  { id: "flat", name: "Llano aero", frameType: "aero", wheelType: "deep" },
  { id: "mountain", name: "Montaña", frameType: "light", wheelType: "light" },
  { id: "hilly", name: "Media montaña", frameType: "light", wheelType: "mid" },
  { id: "cobbles", name: "Pavé", frameType: "endurance", wheelType: "cobbles" },
  { id: "tt", name: "Crono", frameType: "tt", wheelType: "disc" },
  { id: "safe", name: "Seguro lluvia", frameType: "endurance", wheelType: "mid" }
];

/* ============================================================
   ROLES
   ============================================================ */

const ROLE_TEMPLATES = {
  gc: {
    label: "Líder GC", defaultOrder: "hold", defaultEffort: 68,
    stats: { flat: 80, sprint: 62, mountain: 90, hills: 84, cobbles: 66, tt: 84, ttt: 84, stamina: 90, recovery: 88, acceleration: 78, positioning: 82, downhill: 82 }
  },
  co: {
    label: "Co-líder", defaultOrder: "hold", defaultEffort: 66,
    stats: { flat: 79, sprint: 62, mountain: 86, hills: 82, cobbles: 64, tt: 80, ttt: 82, stamina: 87, recovery: 85, acceleration: 76, positioning: 80, downhill: 80 }
  },
  climber: {
    label: "Escalador", defaultOrder: "hold", defaultEffort: 64,
    stats: { flat: 72, sprint: 54, mountain: 87, hills: 80, cobbles: 55, tt: 70, ttt: 72, stamina: 86, recovery: 84, acceleration: 76, positioning: 74, downhill: 80 }
  },
  tt: {
    label: "Croner", defaultOrder: "pull", defaultEffort: 72,
    stats: { flat: 86, sprint: 62, mountain: 72, hills: 74, cobbles: 66, tt: 88, ttt: 89, stamina: 85, recovery: 80, acceleration: 68, positioning: 78, downhill: 74 }
  },
  sprinter: {
    label: "Sprinter", defaultOrder: "sit", defaultEffort: 50,
    stats: { flat: 86, sprint: 90, mountain: 58, hills: 70, cobbles: 72, tt: 68, ttt: 74, stamina: 78, recovery: 75, acceleration: 92, positioning: 88, downhill: 72 }
  },
  classics: {
    label: "Clasicómano", defaultOrder: "hold", defaultEffort: 66,
    stats: { flat: 83, sprint: 78, mountain: 70, hills: 84, cobbles: 86, tt: 74, ttt: 78, stamina: 84, recovery: 80, acceleration: 84, positioning: 88, downhill: 78 }
  },
  rouleur: {
    label: "Rodador", defaultOrder: "pull", defaultEffort: 72,
    stats: { flat: 86, sprint: 68, mountain: 70, hills: 74, cobbles: 74, tt: 80, ttt: 84, stamina: 84, recovery: 80, acceleration: 70, positioning: 80, downhill: 74 }
  },
  domestique: {
    label: "Gregario", defaultOrder: "protect", defaultEffort: 64,
    stats: { flat: 78, sprint: 62, mountain: 78, hills: 76, cobbles: 66, tt: 74, ttt: 78, stamina: 83, recovery: 80, acceleration: 70, positioning: 78, downhill: 76 }
  },
  puncheur: {
    label: "Puncheur", defaultOrder: "hold", defaultEffort: 68,
    stats: { flat: 79, sprint: 76, mountain: 78, hills: 87, cobbles: 72, tt: 73, ttt: 75, stamina: 82, recovery: 79, acceleration: 87, positioning: 82, downhill: 78 }
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
    ["Ivo Oliveira","Portugal",30,"rouleur",78],["Rui Oliveira","Portugal",30,"rouleur",77],["Pablo Torres","Spain",20,"climber",80],["Jan Christen","Switzerland",22,"puncheur",82]
  ],
  visma: [
    ["Jonas Vingegaard","Denmark",29,"gc",97],["Wout van Aert","Belgium",31,"classics",94],["Matteo Jorgenson","United States",27,"co",90],["Sepp Kuss","United States",31,"climber",88],
    ["Wilco Kelderman","Netherlands",35,"domestique",83],["Christophe Laporte","France",33,"classics",86],["Dylan van Baarle","Netherlands",34,"rouleur",84],["Tiesj Benoot","Belgium",32,"classics",84],
    ["Edoardo Affini","Italy",30,"tt",84],["Attila Valter","Hungary",28,"climber",82],["Ben Tulett","Great Britain",25,"climber",82],["Per Strand Hagenes","Norway",23,"puncheur",80],
    ["Milan Vader","Netherlands",30,"climber",78],["Bart Lemmen","Netherlands",31,"rouleur",79],["Cian Uijtdebroeks","Belgium",23,"gc",84],["Olav Kooij","Netherlands",24,"sprinter",88],
    ["Axel Zingle","France",27,"classics",81],["Bruno Armirail","France",32,"tt",82],["Matthew Brennan","Great Britain",21,"sprinter",82],["Jørgen Nordhagen","Norway",21,"climber",82]
  ],
  ineos: [
    ["Egan Bernal","Colombia",29,"gc",87],["Carlos Rodríguez","Spain",25,"gc",89],["Thymen Arensman","Netherlands",26,"climber",86],["Filippo Ganna","Italy",29,"tt",91],
    ["Joshua Tarling","Great Britain",22,"tt",89],["Magnus Sheffield","United States",24,"rouleur",84],["Laurens De Plus","Belgium",30,"domestique",82],["Ben Turner","Great Britain",27,"classics",81],
    ["Geraint Thomas","Great Britain",40,"co",83],["Tom Pidcock","Great Britain",27,"puncheur",86],["Michal Kwiatkowski","Poland",36,"classics",82],["Jonathan Castroviejo","Spain",39,"tt",80],
    ["Omar Fraile","Spain",36,"domestique",78],["Luke Rowe","Great Britain",36,"rouleur",76],["Tobias Foss","Norway",29,"tt",82],["Oscar Rodríguez","Spain",31,"climber",78],
    ["Michael Leonard","Canada",22,"tt",78],["Artem Shmidt","United States",22,"rouleur",77],["AJ August","United States",21,"climber",78],["Connor Swift","Great Britain",31,"classics",78]
  ],
  movistar: [
    ["Enric Mas","Spain",31,"gc",88],["Nairo Quintana","Colombia",36,"climber",84],["Einer Rubio","Colombia",28,"climber",83],["Iván Romeo","Spain",23,"tt",82],
    ["Davide Formolo","Italy",33,"domestique",80],["Pelayo Sánchez","Spain",26,"puncheur",82],["Alex Aranburu","Spain",30,"classics",83],["Fernando Gaviria","Colombia",31,"sprinter",84],
    ["Javier Romo","Spain",27,"puncheur",80],["Carlos Canal","Spain",25,"classics",79],["Jorge Arcas","Spain",34,"domestique",77],["Iván García Cortina","Spain",31,"classics",80],
    ["Oier Lazkano","Spain",26,"classics",83],["Lorenzo Milesi","Italy",24,"tt",79],["Rémi Cavagna","France",31,"tt",80],["Nélson Oliveira","Portugal",37,"tt",78],
    ["Sergio Samitier","Spain",31,"climber",76],["Albert Torres","Spain",36,"rouleur",76],["Will Barta","United States",30,"tt",78],["Diego Pescador","Colombia",21,"climber",78]
  ],
  redbull: [
    ["Primož Roglič","Slovenia",36,"gc",94],["Remco Evenepoel","Belgium",26,"gc",96],["Jai Hindley","Australia",30,"climber",87],["Aleksandr Vlasov","Russia",30,"co",86],
    ["Daniel Felipe Martínez","Colombia",30,"climber",87],["Florian Lipowitz","Germany",25,"climber",85],["Roger Adrià","Spain",28,"puncheur",80],["Sam Welsford","Australia",30,"sprinter",86],
    ["Danny van Poppel","Netherlands",33,"sprinter",82],["Nico Denz","Germany",32,"rouleur",80],["Ryan Mullen","Ireland",32,"tt",80],["Bob Jungels","Luxembourg",33,"rouleur",80],
    ["Giovanni Aleotti","Italy",27,"climber",79],["Finn Fisher-Black","New Zealand",24,"puncheur",80],["Oier Lazkano","Spain",26,"classics",82],["Emil Herzog","Germany",21,"puncheur",78],
    ["Sergio Higuita","Colombia",29,"climber",81],["Jordi Meeus","Belgium",28,"sprinter",81],["Marco Haller","Austria",35,"domestique",76],["Laurence Pithie","New Zealand",24,"classics",81]
  ],
  soudal: [
    ["Mikel Landa","Spain",36,"climber",86],["Tim Merlier","Belgium",33,"sprinter",89],["Jasper Stuyven","Belgium",34,"classics",85],["Yves Lampaert","Belgium",35,"tt",82],
    ["Ilan Van Wilder","Belgium",26,"co",83],["Mauri Vansevenant","Belgium",27,"puncheur",81],["Bert Van Lerberghe","Belgium",33,"domestique",78],["Mattia Cattaneo","Italy",36,"tt",80],
    ["Paul Magnier","France",22,"sprinter",82],["Ethan Hayter","Great Britain",27,"rouleur",80],["Junior Lecerf","Belgium",23,"climber",80],["Casper Pedersen","Denmark",30,"classics",78],
    ["Dries Van Gestel","Belgium",31,"classics",79],["James Knox","Great Britain",30,"climber",78],["Louis Vervaeke","Belgium",32,"domestique",77],["Luke Lamperti","United States",23,"sprinter",80],
    ["Kasper Asgreen","Denmark",31,"rouleur",82],["Fausto Masnada","Italy",33,"climber",78],["Josef Černý","Czech Republic",33,"tt",78],["Antoine Huby","France",25,"puncheur",77]
  ],
  lidl: [
    ["Juan Ayuso","Spain",24,"gc",91],["Mads Pedersen","Denmark",30,"classics",91],["Jonathan Milan","Italy",26,"sprinter",90],["Giulio Ciccone","Italy",31,"climber",86],
    ["Mattias Skjelmose","Denmark",26,"co",87],["Tao Geoghegan Hart","Great Britain",31,"climber",83],["Jasper Stuyven","Belgium",34,"classics",84],["Simone Consonni","Italy",31,"rouleur",80],
    ["Matteo Sobrero","Italy",29,"tt",82],["Max Walscheid","Germany",33,"sprinter",80],["Toms Skujiņš","Latvia",35,"classics",82],["Quinn Simmons","United States",25,"classics",81],
    ["Mathias Vacek","Czech Republic",24,"tt",81],["Thibau Nys","Belgium",24,"puncheur",84],["Andrea Bagioli","Italy",27,"puncheur",80],["Sam Oomen","Netherlands",31,"domestique",78],
    ["Patrick Konrad","Austria",34,"climber",78],["Amanuel Ghebreigzabhier","Eritrea",32,"climber",77],["Tim Torn Teutenberg","Germany",24,"sprinter",77],["Daan Hoole","Netherlands",27,"tt",80]
  ],
  alpecin: [
    ["Mathieu van der Poel","Netherlands",31,"classics",96],["Jasper Philipsen","Belgium",28,"sprinter",93],["Kaden Groves","Australia",27,"sprinter",87],["Florian Sénéchal","France",33,"classics",82],
    ["Gerben Thijssen","Belgium",28,"sprinter",82],["Tibor Del Grosso","Netherlands",23,"puncheur",82],["Henri Uhlig","Germany",25,"classics",80],["Quinten Hermans","Belgium",31,"puncheur",81],
    ["Gianni Vermeersch","Belgium",33,"classics",80],["Silvan Dillier","Switzerland",36,"rouleur",78],["Jonas Rickaert","Belgium",32,"rouleur",78],["Søren Kragh Andersen","Denmark",32,"rouleur",80],
    ["Emiel Verstrynge","Belgium",24,"climber",80],["Gal Glivar","Slovenia",24,"climber",78],["Michael Gogl","Austria",32,"classics",78],["Simon Dehairs","Belgium",25,"sprinter",78],
    ["Francesco Busatto","Italy",24,"puncheur",77],["Robbe Ghys","Belgium",29,"rouleur",77],["Xandro Meurisse","Belgium",34,"puncheur",78],["Kristian Sbaragli","Italy",36,"sprinter",76]
  ],
  bahrain: [
    ["Pello Bilbao","Spain",36,"gc",84],["Damiano Caruso","Italy",39,"climber",82],["Matej Mohorič","Slovenia",31,"classics",86],["Santiago Buitrago","Colombia",26,"climber",86],
    ["Antonio Tiberi","Italy",25,"co",85],["Lenny Martinez","France",23,"climber",86],["Alec Segaert","Belgium",23,"tt",83],["Phil Bauhaus","Germany",32,"sprinter",82],
    ["Fred Wright","Great Britain",27,"classics",80],["Kamil Gradek","Poland",36,"tt",78],["Rainer Kepplinger","Austria",28,"climber",78],["Edoardo Zambanini","Italy",25,"climber",79],
    ["Nicolò Buratti","Italy",25,"puncheur",78],["Jack Haig","Australia",33,"climber",79],["Afonso Eulálio","Portugal",25,"climber",78],["Vlad Van Mechelen","Belgium",22,"sprinter",77],
    ["Nikias Arndt","Germany",35,"rouleur",77],["Andrea Pasqualon","Italy",38,"classics",76],["Robert Stannard","Australia",28,"puncheur",77],["Kaden Hopkins","Bermuda",26,"tt",76]
  ],
  decathlon: [
    ["Paul Seixas","France",20,"gc",87],["Felix Gall","Austria",28,"climber",86],["Olav Kooij","Netherlands",24,"sprinter",89],["Tiesj Benoot","Belgium",32,"classics",84],
    ["Oliver Naesen","Belgium",35,"classics",81],["Paul Lapeira","France",26,"puncheur",83],["Dorian Godon","France",30,"classics",81],["Bruno Armirail","France",32,"tt",81],
    ["Aurélien Paret-Peintre","France",30,"climber",81],["Matthew Riccitello","United States",24,"climber",82],["Tobias Lund Andresen","Denmark",24,"sprinter",81],["Johannes Staune-Mittet","Norway",24,"climber",79],
    ["Noa Isidore","France",22,"rouleur",77],["Pierre Gautherat","France",23,"sprinter",78],["Oscar Chamberlain","Australia",21,"tt",77],["Benoît Cosnefroy","France",31,"puncheur",82],
    ["Nans Peters","France",32,"climber",78],["Sam Bennett","Ireland",35,"sprinter",81],["Victor Lafay","France",30,"puncheur",79],["Valentin Paret-Peintre","France",25,"climber",79]
  ],
  caja: [
    ["Fernando Gaviria","Colombia",31,"sprinter",84],["Eduard Prades","Spain",39,"classics",80],["Stefano Oldani","Italy",28,"classics",80],["Sebastian Berwick","Australia",26,"climber",79],
    ["José Félix Parra","Spain",29,"climber",78],["Alex Molenaar","Netherlands",27,"puncheur",78],["Jakub Otruba","Czech Republic",28,"tt",78],["Joel Nicolau","Spain",29,"puncheur",76],
    ["Abel Balderstone","Great Britain",26,"climber",76],["Orluis Aular","Venezuela",30,"sprinter",80],["Jefferson Cepeda","Ecuador",30,"climber",79],["David González","Spain",30,"sprinter",76],
    ["Sergio Martín","Spain",29,"rouleur",75],["Iñigo Elosegui","Spain",28,"rouleur",76],["Jokin Murguialday","Spain",26,"climber",76],["Ander Okamika","Spain",33,"rouleur",75],
    ["Unai Iribar","Spain",26,"puncheur",75],["Mikel Iturria","Spain",34,"domestique",75],["Francisco Galván","Spain",29,"sprinter",74],["Jon Barrenetxea","Spain",26,"classics",76]
  ],
  burgos: [
    ["Jesús Herrada","Spain",36,"puncheur",82],["Merhawi Kudus","Eritrea",32,"climber",80],["Jambaljamts Sainbayar","Mongolia",29,"rouleur",78],["José Manuel Díaz","Spain",31,"climber",78],
    ["Eric Antonio Fagúndez","Uruguay",28,"puncheur",77],["Lorenzo Quartucci","Italy",26,"sprinter",77],["Alexandre Mayer","Mauritius",28,"rouleur",76],["Georgios Bouglas","Greece",35,"sprinter",76],
    ["Mario Aparicio","Spain",26,"climber",76],["Ángel Madrazo","Spain",38,"climber",75],["Pelayo Sánchez","Spain",26,"puncheur",79],["David Delgado","Spain",23,"climber",74],
    ["Ander Ganzabal","Spain",24,"rouleur",74],["Aaron Gate","New Zealand",36,"rouleur",78],["Cyril Barthe","France",30,"classics",76],["Rubén Pérez","Spain",25,"domestique",74],
    ["Diego Uriarte","Spain",26,"climber",74],["Óscar Cabedo","Spain",31,"climber",75],["Pablo Castrillo","Spain",25,"puncheur",79],["Daniel Babor","Czech Republic",27,"sprinter",75]
  ],
  euskaltel: [
    ["Jonathan Lastra","Spain",33,"classics",78],["Mikel Bizkarra","Spain",37,"climber",77],["Gotzon Martín","Spain",30,"puncheur",77],["Xabier Berasategi","Spain",26,"climber",76],
    ["Txomin Juaristi","Spain",31,"rouleur",76],["Jordi López","Spain",27,"climber",76],["Jon Agirre","Spain",29,"puncheur",76],["Jokin Murguialday","Spain",26,"climber",76],
    ["Luis Ángel Maté","Spain",42,"climber",75],["Ibai Azurmendi","Spain",29,"climber",75],["Iker Ballarin","Spain",28,"rouleur",74],["Unai Zubeldia","Spain",23,"puncheur",74],
    ["Asier Etxeberria","Spain",25,"climber",74],["Mikel Retegi","Spain",24,"rouleur",73],["Haimar Etxeberria","Spain",23,"sprinter",73],["Enekoitz Azparren","Spain",24,"tt",74],
    ["Joan Bou","Spain",29,"climber",75],["Xabier Mikel Azparren","Spain",27,"tt",75],["Urko Berrade","Spain",28,"puncheur",76],["Iker Mintegi","Spain",23,"climber",74]
  ],
  polti: [
    ["Giovanni Lonardi","Italy",30,"sprinter",80],["Mirco Maestri","Italy",34,"rouleur",79],["Alessandro Tonelli","Italy",34,"puncheur",78],["Manuel Peñalver","Spain",27,"sprinter",78],
    ["Thomas Pesenti","Italy",26,"climber",77],["Mattia Bais","Italy",29,"rouleur",77],["Davide Bais","Italy",28,"climber",77],["Ludovico Crescioli","Italy",23,"climber",76],
    ["Fernando Tercero","Spain",25,"climber",77],["Germán Darío Gómez","Colombia",25,"climber",76],["Javier Serrano","Spain",25,"sprinter",76],["Andrea Pietrobon","Italy",27,"rouleur",76],
    ["Andrea Mifsud","Malta",24,"rouleur",75],["Francisco Muñoz","Spain",24,"climber",75],["Aidan Buttigieg","Malta",23,"rouleur",74],["Gabriele Raccagni","Italy",25,"tt",75],
    ["Dario Igor Belletta","Italy",22,"sprinter",74],["Diego Pablo Sevilla","Spain",30,"puncheur",75],["Fabrizio Crozzolo","Italy",24,"rouleur",74],["Davide De Pretto","Italy",24,"puncheur",78]
  ]
};

/* ============================================================
   CONSTRUCCIÓN DE CORREDORES
   ============================================================ */

function dataClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function deterministicNoise(teamIndex, riderIndex, key) {
  const seed = teamIndex * 97 + riderIndex * 31 + key.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const raw = Math.sin(seed) * 10000;
  return Math.round(((raw - Math.floor(raw)) - 0.5) * 8);
}

function riderId(teamId, name, index) {
  return `${teamId}_${String(index + 1).padStart(2, "0")}_${name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")}`;
}

function buildRiders() {
  const riders = [];

  TEAMS.forEach((team, teamIndex) => {
    TEAM_RIDERS[team.id].forEach((item, riderIndex) => {
      const [name, nationality, age, roleKey, base] = item;
      const template = ROLE_TEMPLATES[roleKey] || ROLE_TEMPLATES.domestique;
      const stats = {};
      const baseLift = (base - 78) * 0.55;

      Object.keys(template.stats).forEach(key => {
        stats[key] = dataClamp(
          Math.round(template.stats[key] + baseLift + deterministicNoise(teamIndex, riderIndex, key)),
          45,
          99
        );
      });

      stats.timeTrial = stats.tt;
      stats.teamTimeTrial = stats.ttt;

      riders.push({
        id: riderId(team.id, name, riderIndex),
        name,
        nationality,
        age,
        teamId: team.id,
        roleKey,
        role: template.label,
        base,
        defaultOrder: template.defaultOrder,
        defaultEffort: template.defaultEffort,
        stats,
        form: dataClamp(base + deterministicNoise(teamIndex, riderIndex, "form"), 55, 99),
        morale: dataClamp(76 + deterministicNoise(teamIndex, riderIndex, "morale"), 45, 99),
        fatigue: 0,
        energy: 100,
        totalTime: 0,
        points: 0,
        mountainPoints: 0,
        uciPoints: 0,
        stageWins: 0,
        seasonStageWins: 0,
        raceDays: 0,
        abandoned: false
      });
    });
  });

  return riders;
}

const RIDERS = buildRiders();

/* ============================================================
   ÓRDENES / ESTRATEGIA
   ============================================================ */

const RIDER_ORDERS = [
  { id: "sit", name: "Ir a rueda", desc: "Gasta poco. No tira. Puede quedarse si el grupo acelera.", pull: 0, attack: 0, energy: 0.72 },
  { id: "hold", name: "Mantener posición", desc: "Rueda en el grupo sin forzar.", pull: 0.15, attack: 0, energy: 1.00 },
  { id: "protect", name: "Proteger líder", desc: "Reduce riesgo de corte del líder y le aporta apoyo.", pull: 0.30, attack: 0, energy: 1.18 },
  { id: "pull", name: "Tirar del grupo", desc: "Aumenta velocidad del grupo sin separarse.", pull: 1.00, attack: 0, energy: 1.42 },
  { id: "catch", name: "Cazar fuga", desc: "Trabajo fuerte para recortar hueco.", pull: 1.25, attack: 0, energy: 1.58 },
  { id: "tempo", name: "Subir a tempo", desc: "Ritmo alto en subida. Puede cortar rivales.", pull: 1.10, attack: 0, energy: 1.52 },
  { id: "attack", name: "Atacar", desc: "Intenta salir hacia delante.", pull: 0.10, attack: 1.00, energy: 1.85 },
  { id: "bridge", name: "Saltar a grupo", desc: "Intenta cruzar hacia el grupo delantero.", pull: 0.20, attack: 0.75, energy: 1.70 },
  { id: "wait", name: "Esperar líder", desc: "Pierde tiempo para ayudar a un compañero.", pull: 0, attack: 0, energy: 1.25 },
  { id: "sprint_train", name: "Tren de sprint", desc: "Prepara el sprint del líder rápido.", pull: 0.95, attack: 0, energy: 1.42 }
];

const SMART_PRESETS = [
  { id: "protect_gc", name: "Proteger GC", description: "Líder protegido, gregarios trabajan y sprinters conservan." },
  { id: "sprint", name: "Sprint masivo", description: "Sprinter a rueda, rodadores y clasicómanos hacen tren." },
  { id: "breakaway", name: "Fuga del día", description: "Puncheurs, rodadores y escaladores secundarios atacan." },
  { id: "mountain_attack", name: "Montaña agresiva", description: "Escaladores endurecen y líder preparado para atacar." },
  { id: "survival", name: "Supervivencia", description: "Todos conservan energía y evitan riesgos." },
  { id: "time_trial", name: "Crono a tope", description: "Croners, rodadores y líderes a esfuerzo alto." }
];

/* ============================================================
   NUTRICIÓN
   ============================================================ */

const NUTRITION_ITEMS = [
  { id: "gel", name: "Gel", description: "Energía rápida.", energy: 22, hydration: 0, stomach: 8, finalBonus: 0 },
  { id: "bar", name: "Barrita", description: "Energía lenta y estable.", energy: 26, hydration: -2, stomach: 14, finalBonus: 0 },
  { id: "iso", name: "Isotónico", description: "Energía e hidratación.", energy: 12, hydration: 20, stomach: 5, finalBonus: 0 },
  { id: "caf", name: "Gel cafeína", description: "Extra para final o ataque.", energy: 18, hydration: -2, stomach: 10, finalBonus: 3 },
  { id: "rice", name: "Rice cake", description: "Energía estable con poca agresividad.", energy: 18, hydration: 0, stomach: 9, finalBonus: 0 },
  { id: "water", name: "Agua", description: "Hidratación sin carga energética.", energy: 2, hydration: 25, stomach: 2, finalBonus: 0 }
];

const NUTRITION_PLANS = [
  { id: "auto_balanced", name: "Equilibrado", stock: { gel: 18, bar: 12, iso: 24, caf: 6, rice: 12, water: 24 } },
  { id: "mountain", name: "Montaña", stock: { gel: 26, bar: 8, iso: 24, caf: 8, rice: 8, water: 24 } },
  { id: "sprint", name: "Sprint", stock: { gel: 18, bar: 10, iso: 28, caf: 8, rice: 10, water: 24 } },
  { id: "hot", name: "Calor", stock: { gel: 18, bar: 8, iso: 34, caf: 6, rice: 8, water: 34 } }
];

const AUTO_NUTRITION_MODES = [
  { id: "auto_smart", name: "Automático inteligente", description: "Come según energía, hidratación y momento de carrera." },
  { id: "auto_conservative", name: "Automático conservador", description: "Prioriza evitar pájaras y deshidratación." },
  { id: "auto_aggressive", name: "Automático agresivo", description: "Reserva cafeína y geles para ataques y finales." },
  { id: "manual", name: "Manual", description: "Tú decides cuándo come cada corredor." }
];

/* ============================================================
   ENTRENAMIENTO DE TEMPORADA
   ============================================================ */

const TRAINING_OPTIONS = [
  {
    id: "recovery",
    name: "Recuperación",
    description: "Reduce fatiga. Ideal para corredores que vienen cargados.",
    effects: { fatigue: -18, form: 0, morale: 1 }
  },
  {
    id: "endurance",
    name: "Fondo y resistencia",
    description: "Mejora stamina, recuperación y fondo general.",
    effects: { stamina: 1, recovery: 1, form: 1, fatigue: 5 }
  },
  {
    id: "mountain",
    name: "Bloque de montaña",
    description: "Mejora montaña, bajada y resistencia en puertos.",
    effects: { mountain: 1, downhill: 1, stamina: 1, fatigue: 6 }
  },
  {
    id: "tt",
    name: "Bloque de crono",
    description: "Mejora CRI, CRE y llano.",
    effects: { tt: 1, ttt: 1, flat: 1, fatigue: 5 }
  },
  {
    id: "sprint",
    name: "Sprint y colocación",
    description: "Mejora sprint, aceleración y colocación.",
    effects: { sprint: 1, acceleration: 1, positioning: 1, fatigue: 5 }
  },
  {
    id: "classics",
    name: "Clásicas / pavé",
    description: "Mejora pavé, colinas, colocación y resistencia.",
    effects: { cobbles: 1, hills: 1, positioning: 1, fatigue: 6 }
  }
];

/* ============================================================
   REGLAS CLASIFICACIONES
   ============================================================ */

const CLASSIFICATION_RULES = {
  youthMaxAge: 25,
  teamClassificationBestRiders: 3,
  finishBonuses: [10, 6, 4],
  pointsByStageType: {
    flat: [50, 30, 20, 18, 16, 14, 12, 10, 8, 7],
    hilly: [35, 25, 20, 17, 15, 13, 11, 9, 7, 6],
    mountain: [25, 20, 16, 14, 12, 10, 8, 6, 4, 2],
    cobbles: [35, 25, 20, 17, 15, 13, 11, 9, 7, 6],
    tt: [20, 17, 15, 13, 11, 9, 7, 5, 3, 1],
    ttt: [20, 17, 15, 13, 11, 9, 7, 5, 3, 1]
  },
  mountainPoints: {
    HC: [20, 15, 12, 10, 8, 6, 4, 2],
    "1": [10, 8, 6, 4, 2, 1],
    "2": [5, 3, 2, 1],
    "3": [2, 1],
    "4": [1]
  },
  uci: {
    grandTourStage: [120, 50, 25, 15, 5],
    grandTourFinalGC: [1300, 1040, 880, 730, 620, 520, 425, 325, 275, 225, 175, 150, 125, 105, 85],
    oneDay: [500, 400, 325, 275, 225, 175, 150, 125, 100, 85]
  }
};

/* ============================================================
   ETAPAS / CARRERAS
   ============================================================ */

function climb(name, category, km, length, gradient, maxGradient, altitude) {
  return { name, category, km, length, gradient, maxGradient, altitude };
}

function pave(name, from, to, severity) {
  return { name, from, to, severity };
}

function wall(name, km, length, gradient, maxGradient) {
  return { name, km, length, gradient, maxGradient };
}

function stage(id, number, name, type, distance, difficulty, profile = {}) {
  const st = {
    id,
    number,
    name,
    type,
    label: { flat: "Llana", hilly: "Media montaña", mountain: "Alta montaña", cobbles: "Pavés y muros", tt: "CRI", ttt: "CRE" }[type],
    distance,
    difficulty,
    elevation: profile.elevation || 900,
    wind: profile.wind || 30,
    heat: profile.heat || 45,
    rain: profile.rain || 20,
    climbs: profile.climbs || [],
    paves: profile.paves || [],
    walls: profile.walls || [],
    finalClimb: !!profile.finalClimb,
    description: profile.description || "Etapa del calendario."
  };

  st.sectors = makeSectors(st);
  return st;
}

function makeSectors(stage) {
  const count = stage.distance > 200 ? 6 : stage.distance > 160 ? 5 : stage.distance > 90 ? 4 : 3;
  const sectors = [];

  for (let i = 0; i < count; i++) {
    const from = Math.round((stage.distance / count) * i);
    const to = i === count - 1 ? stage.distance : Math.round((stage.distance / count) * (i + 1));
    const c = stage.climbs.find(x => x.km >= from && x.km <= to);
    const p = stage.paves.find(x => x.from <= to && x.to >= from);
    const w = stage.walls.find(x => x.km >= from && x.km <= to);
    const final = i === count - 1;

    let type = stage.type;

    if (final) type = "final";
    else if (p) type = "cobbles";
    else if (w) type = "wall";
    else if (c) type = "climb";
    else if (stage.type === "mountain") type = "climb";
    else if (stage.type === "hilly") type = "hilly";
    else if (stage.type === "flat") type = "flat";
    else if (stage.type === "tt" || stage.type === "ttt") type = "tt";

    sectors.push({
      id: `${stage.id}_s${i + 1}`,
      name:
        type === "climb" ? `Subida ${c ? c.name : ""}` :
        type === "cobbles" ? `Pavé ${p ? p.name : ""}` :
        type === "wall" ? `Muro ${w ? w.name : ""}` :
        type === "final" ? "Final de etapa" :
        type === "flat" ? "Llano / control" :
        type === "tt" ? "Sector crono" :
        "Terreno quebrado",
      from,
      to,
      type,
      difficulty: dataClamp(stage.difficulty + (c ? 12 : 0) + (p ? p.severity * 5 : 0) + (w ? 14 : 0) + (final ? 8 : 0), 15, 100),
      question:
        type === "flat" ? "¿Controlar fuga o ahorrar?" :
        type === "climb" ? "¿Endurecer la subida o conservar?" :
        type === "cobbles" ? "¿Pasar delante el pavé o evitar riesgos?" :
        type === "wall" ? "¿Atacar en el muro o aguantar?" :
        type === "final" ? "¿Disputar, atacar o proteger la general?" :
        type === "tt" ? "¿Ritmo máximo o gestión?" :
        "¿Mantener grupo o preparar ataque?"
    });
  }

  return sectors;
}

const TOUR_STAGES = [
  stage("tour_01", 1, "Grand Départ Costero", "flat", 182, 34, { wind: 65, elevation: 900, description: "Sprint con riesgo de abanicos." }),
  stage("tour_02", 2, "Muros del Interior", "hilly", 171, 68, { elevation: 2500, climbs: [climb("Saint-Romain", "3", 96, 3.8, 6.1, 11, 740)], walls: [wall("Mur final", 168, 2.2, 9.4, 15)] }),
  stage("tour_03", 3, "Llanura del Norte", "flat", 198, 38, { wind: 44, elevation: 700 }),
  stage("tour_04", 4, "Crono por Equipos", "ttt", 41, 62, { elevation: 420, description: "El tiempo lo marca el 4º corredor." }),
  stage("tour_05", 5, "Pavés y Muros", "cobbles", 204, 88, { rain: 38, elevation: 2100, paves: [pave("Bosque", 64, 68, 4), pave("Granja", 122, 127, 5), pave("Carrefour", 184, 190, 5)], walls: [wall("Chapelle", 187, 1.6, 10.2, 17)] }),
  stage("tour_06", 6, "Sprint del Valle", "flat", 176, 32, { elevation: 650 }),
  stage("tour_07", 7, "Primer Contacto Alpino", "mountain", 164, 84, { elevation: 3900, climbs: [climb("Col de la Biche", "1", 88, 11.5, 7.1, 12, 1450), climb("Mont du Cerf", "1", 153, 9.6, 8.0, 13, 1650)], finalClimb: true }),
  stage("tour_08", 8, "Etapa Trampa", "hilly", 186, 72, { elevation: 3100, climbs: [climb("Côte des Vignes", "3", 44, 4.1, 5.8, 10, 680)], walls: [wall("Signal", 176, 1.1, 11.5, 17)] }),
  stage("tour_09", 9, "Cima de los Lagos", "mountain", 152, 91, { elevation: 4300, climbs: [climb("Port de Balès", "HC", 94, 18.6, 7.2, 13, 1755), climb("Lagos", "HC", 152, 13.7, 8.4, 15, 1880)], finalClimb: true }),
  stage("tour_10", 10, "Llanura de Recuperación", "flat", 188, 36, { elevation: 800 }),
  stage("tour_11", 11, "Crono Individual", "tt", 37, 70, { elevation: 550 }),
  stage("tour_12", 12, "Camino de los Viñedos", "flat", 211, 42, { heat: 65, elevation: 1100 }),
  stage("tour_13", 13, "Colinas Encadenadas", "hilly", 194, 76, { elevation: 3400, climbs: [climb("Croix", "2", 121, 6.2, 7.0, 13, 960), climb("Château", "3", 181, 3.2, 8.2, 15, 820)] }),
  stage("tour_14", 14, "Etapa Reina", "mountain", 178, 98, { elevation: 5200, climbs: [climb("Madeleine", "HC", 82, 19.2, 7.8, 13, 1984), climb("Télégraphe", "1", 131, 11.8, 7.3, 12, 1566), climb("Final en alto", "HC", 178, 15.4, 8.1, 16, 2140)], finalClimb: true }),
  stage("tour_15", 15, "Montaña Acumulada", "mountain", 183, 94, { elevation: 4700, climbs: [climb("Sarenne", "1", 96, 13, 7.0, 12, 1650), climb("La Toussuire", "HC", 183, 16.1, 7.3, 14, 1705)], finalClimb: true }),
  stage("tour_16", 16, "Sprint Tardío", "flat", 169, 35, { elevation: 650 }),
  stage("tour_17", 17, "Alta Montaña Explosiva", "mountain", 136, 90, { elevation: 3900, climbs: [climb("Col court", "2", 45, 6.5, 7.7, 13, 1220), climb("Final explosivo", "1", 136, 8.8, 9.1, 16, 1740)], finalClimb: true }),
  stage("tour_18", 18, "Gran Fondo Alpino", "mountain", 201, 96, { elevation: 5000, climbs: [climb("Vars", "1", 73, 14.2, 6.8, 12, 2100), climb("Izoard", "HC", 141, 14.1, 7.3, 13, 2360), climb("Final alpino", "HC", 201, 12.9, 8.5, 16, 2200)], finalClimb: true }),
  stage("tour_19", 19, "Crono Final", "tt", 31, 74, { elevation: 700 }),
  stage("tour_20", 20, "Muros Finales", "hilly", 143, 82, { elevation: 2800, walls: [wall("Mur du Signal", 132, 2.4, 10.8, 18), wall("Côte Finale", 140, 1.8, 9, 15)] }),
  stage("tour_21", 21, "Paseo Final", "flat", 115, 25, { elevation: 400 })
];

function cloneRaceStages(source, prefix, bias = 0) {
  return source.map(st => {
    const copy = JSON.parse(JSON.stringify(st));
    copy.id = copy.id.replace("tour", prefix);
    copy.difficulty = dataClamp(copy.difficulty + bias, 20, 100);
    copy.heat = prefix === "vuelta" ? dataClamp(copy.heat + 10, 0, 100) : copy.heat;
    copy.rain = prefix === "giro" ? dataClamp(copy.rain + 8, 0, 100) : copy.rain;
    copy.sectors = makeSectors(copy);
    return copy;
  });
}

const RACES = [
  { id: "tour", name: "Tour de France", country: "France", jersey: "Maillot amarillo", jerseyClass: "jersey-yellow", type: "grand_tour", stages: TOUR_STAGES },
  { id: "giro", name: "Giro d'Italia", country: "Italy", jersey: "Maglia rosa", jerseyClass: "jersey-pink", type: "grand_tour", stages: cloneRaceStages(TOUR_STAGES, "giro", 2) },
  { id: "vuelta", name: "La Vuelta a España", country: "Spain", jersey: "Maillot rojo", jerseyClass: "jersey-red", type: "grand_tour", stages: cloneRaceStages(TOUR_STAGES, "vuelta", 1) },
  { id: "roubaix", name: "Paris-Roubaix", country: "France", jersey: "Ganador", jerseyClass: "jersey-cobbles", type: "classic", stages: [stage("roubaix_01", 1, "Paris-Roubaix", "cobbles", 257, 98, { rain: 45, elevation: 1600, paves: [pave("Arenberg", 162, 164, 5), pave("Mons-en-Pévèle", 207, 210, 5), pave("Carrefour de l'Arbre", 240, 242, 5)] })] },
  { id: "flanders", name: "Tour de Flandes", country: "Belgium", jersey: "Ganador", jerseyClass: "jersey-yellow", type: "classic", stages: [stage("flanders_01", 1, "Tour de Flandes", "cobbles", 272, 96, { elevation: 2900, paves: [pave("Oude Kwaremont", 220, 222, 4), pave("Paterberg", 247, 248, 5)], walls: [wall("Paterberg", 247, 0.4, 12.9, 20)] })] },
  { id: "liege", name: "Liège-Bastogne-Liège", country: "Belgium", jersey: "Ganador", jerseyClass: "jersey-red", type: "classic", stages: [stage("liege_01", 1, "Liège-Bastogne-Liège", "hilly", 259, 94, { elevation: 4100, walls: [wall("La Redoute", 220, 2, 8.9, 16), wall("Roche-aux-Faucons", 242, 1.3, 11, 18)] })] },
  { id: "lombardia", name: "Il Lombardia", country: "Italy", jersey: "Ganador", jerseyClass: "jersey-pink", type: "classic", stages: [stage("lombardia_01", 1, "Il Lombardia", "hilly", 253, 95, { elevation: 4400, climbs: [climb("Ghisallo", "1", 166, 8.6, 6.2, 12, 754), climb("Civiglio", "1", 235, 4.2, 9.7, 15, 620)] })] },
  { id: "worlds", name: "Campeonato del Mundo", country: "World", jersey: "Arcoíris", jerseyClass: "jersey-rainbow", type: "classic", stages: [stage("worlds_01", 1, "Mundial en ruta", "hilly", 268, 97, { elevation: 3600, walls: [wall("Último muro", 263, 1.0, 9.5, 17)] })] }
];

const SEASON_RACE_IDS = ["giro", "tour", "vuelta", "flanders", "roubaix", "liege", "lombardia", "worlds"];
const DEFAULT_RACE_ID = "tour";
