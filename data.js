/* ============================================================
   CYCLING MANAGER TOUR
   data.js
   v0.12 Pro Peloton + WorldTour Calendar + Race Simulation Fixes
   Fuente de estructura 2026: PCS/UCI WorldTeams, ProTeams y calendario UWT.
   Nota: los ratings son internos del simulador.
   ============================================================ */

const SAVE_VERSION = "v0.12";
const ROSTER_SIZE = 8;
const DEFAULT_RACE_ID = "tour_down_under";
const DEFAULT_SEASON_RACE_IDS = [
  "tour_down_under", "cadel_evans", "uae_tour", "omloop", "strade_bianche",
  "paris_nice", "tirreno", "sanremo", "catalunya", "bruges", "e3", "gent_wevelgem",
  "dwars", "flanders", "itzulia", "roubaix", "amstel", "fleche", "liege",
  "romandie", "eschborn", "giro", "dauphine", "copenhagen", "suisse",
  "tour", "san_sebastian", "pologne", "cyclassics", "renewi", "vuelta",
  "bretagne", "quebec", "montreal", "lombardia", "guangxi"
];

/* ============================================================
   EQUIPOS 2026 WT + ProTeams
   Count PCS = número de corredores indicado por PCS para 2026.
   ============================================================ */
const TEAM_BLUEPRINTS = [
  ["alpecin","Alpecin - Premier Tech","WT","Belgium",30,"Clásicas / Sprint", "#0f172a", "#06b6d4", "#ef4444", "ALPECIN", "canyon", "shimano", {gc:22,sprint:96,classics:98,breakaway:74,control:58}],
  ["bahrain","Bahrain - Victorious","WT","Bahrain",28,"Montaña / Clásicas", "#ef4444", "#ffffff", "#111827", "BAHRAIN", "bianchi", "vision", {gc:70,sprint:54,classics:72,breakaway:76,control:56}],
  ["decathlon","Decathlon CMA CGM Team","WT","France",28,"Desarrollo / Montaña", "#10b981", "#0f172a", "#f97316", "DECATHLON", "vanrysel", "swissside", {gc:74,sprint:76,classics:70,breakaway:82,control:58}],
  ["ef","EF Education - EasyPost","WT","United States",29,"Ataque / Clásicas / GC", "#fb7185", "#fef08a", "#10b981", "EF", "cannondale", "vision", {gc:78,sprint:62,classics:82,breakaway:86,control:55}],
  ["groupama","Groupama - FDJ United","WT","France",29,"Francia / Montaña / Sprint", "#2563eb", "#ffffff", "#ef4444", "FDJ", "wilier", "shimano", {gc:68,sprint:74,classics:70,breakaway:82,control:50}],
  ["lidl","Lidl - Trek","WT","Germany",30,"Sprint / Clásicas / GC", "#0f172a", "#ef4444", "#facc15", "LIDL TREK", "trek", "bontrager", {gc:76,sprint:90,classics:88,breakaway:66,control:72}],
  ["lotto","Lotto Intermarché","WT","Belgium",30,"Sprint / Fugas", "#ef4444", "#f97316", "#ffffff", "LOTTO", "orbea", "dt_swiss", {gc:44,sprint:88,classics:80,breakaway:86,control:44}],
  ["movistar","Movistar Team","WT","Spain",28,"Montaña / Etapas", "#2563eb", "#22c55e", "#ffffff", "MOVISTAR", "canyon", "zipp", {gc:76,sprint:42,classics:58,breakaway:86,control:52}],
  ["ineos","Netcompany INEOS","WT","Great Britain",29,"Crono / GC", "#d91e36", "#111827", "#ffffff", "INEOS", "pinarello", "shimano", {gc:84,sprint:28,classics:55,breakaway:42,control:78}],
  ["nsn","NSN Cycling Team","WT","Israel",31,"Clásicas / Fugas / GC", "#38bdf8", "#0f172a", "#facc15", "NSN", "scott", "shimano", {gc:70,sprint:58,classics:78,breakaway:86,control:48}],
  ["redbull","Red Bull - BORA - hansgrohe","WT","Germany",30,"GC / Potencia", "#0f172a", "#f59e0b", "#ef4444", "RED BULL", "specialized", "roval", {gc:94,sprint:58,classics:68,breakaway:54,control:82}],
  ["soudal","Soudal Quick-Step","WT","Belgium",30,"Sprint / Crono / Clásicas", "#2563eb", "#ffffff", "#ef4444", "SOUDAL", "specialized", "roval", {gc:66,sprint:88,classics:82,breakaway:58,control:66}],
  ["jayco","Team Jayco AlUla","WT","Australia",29,"Sprint / Etapas", "#1d4ed8", "#facc15", "#ffffff", "JAYCO", "giant", "cadex", {gc:62,sprint:84,classics:70,breakaway:72,control:55}],
  ["picnic","Team Picnic PostNL","WT","Netherlands",28,"Jóvenes / Sprint / Montaña", "#fb923c", "#111827", "#ffffff", "PICNIC", "scott", "shimano", {gc:64,sprint:80,classics:66,breakaway:78,control:48}],
  ["visma","Team Visma | Lease a Bike","WT","Netherlands",29,"GC / Bloque", "#facc15", "#111827", "#2563eb", "VISMA", "cervelo", "reserve", {gc:96,sprint:62,classics:78,breakaway:54,control:94}],
  ["uae","UAE Team Emirates - XRG","WT","United Arab Emirates",30,"Superteam / GC", "#00843d", "#ffffff", "#d32f2f", "UAE", "colnago", "enve", {gc:98,sprint:42,classics:72,breakaway:48,control:92}],
  ["unox","Uno-X Mobility","WT","Norway",30,"Nórdico / Clásicas / Fugas", "#ef4444", "#facc15", "#111827", "UNO-X", "ridley", "dt_swiss", {gc:56,sprint:76,classics:82,breakaway:88,control:42}],
  ["astana","XDS Astana Team","WT","Kazakhstan",30,"Fugas / Montaña", "#38bdf8", "#facc15", "#111827", "ASTANA", "xlab", "shimano", {gc:60,sprint:52,classics:62,breakaway:90,control:36}],
  ["bardiani","Bardiani CSF 7 Saber","PRT","Italy",23,"ProTeam / Jóvenes", "#16a34a", "#ffffff", "#ef4444", "BARDIANI", "de_rosa", "vision", {gc:32,sprint:60,classics:55,breakaway:86,control:28}],
  ["burgos","Burgos Burpellet BH","PRT","Spain",24,"ProTeam / Montaña-Fugas", "#ffffff", "#ec4899", "#7c3aed", "BURGOS", "bh", "vision", {gc:42,sprint:46,classics:58,breakaway:94,control:30}],
  ["caja","Caja Rural - Seguros RGA","PRT","Spain",26,"ProTeam / Fugas", "#0f7d45", "#ffffff", "#d9a441", "CAJA", "mmr", "vision", {gc:38,sprint:72,classics:56,breakaway:92,control:34}],
  ["cofidis","Cofidis","PRT","France",30,"ProTeam / Sprint / Clásicas", "#ef4444", "#ffffff", "#111827", "COFIDIS", "look", "corima", {gc:48,sprint:78,classics:70,breakaway:74,control:44}],
  ["kern","Equipo Kern Pharma","PRT","Spain",22,"ProTeam / Desarrollo", "#0ea5e9", "#ffffff", "#16a34a", "KERN", "giant", "cadex", {gc:46,sprint:48,classics:62,breakaway:92,control:34}],
  ["euskaltel","Euskaltel - Euskadi","PRT","Spain",22,"ProTeam / Cantera-Fugas", "#f97316", "#fb7185", "#111827", "EUSKALTEL", "orbea", "orbea", {gc:36,sprint:30,classics:62,breakaway:96,control:28}],
  ["mbh","MBH Bank CSB Telecom Fort","PRT","Hungary",21,"ProTeam / Rodadores", "#581c87", "#facc15", "#ffffff", "MBH", "colnago", "fulcrum", {gc:28,sprint:58,classics:54,breakaway:82,control:28}],
  ["modern","Modern Adventure Pro Cycling","PRT","United States",21,"ProTeam / América", "#111827", "#22c55e", "#38bdf8", "MODERN", "cannondale", "vision", {gc:30,sprint:56,classics:56,breakaway:86,control:30}],
  ["q36","Pinarello Q36.5 Pro Cycling Team","PRT","Switzerland",30,"ProTeam / Clásicas-GC", "#111827", "#ffffff", "#38bdf8", "Q36.5", "pinarello", "dt_swiss", {gc:72,sprint:56,classics:84,breakaway:78,control:54}],
  ["solution","Solution Tech NIPPO Rali","PRT","Portugal",23,"ProTeam / Sprint-Fugas", "#0f172a", "#ffffff", "#ef4444", "NIPPO", "scott", "mavic", {gc:36,sprint:66,classics:58,breakaway:84,control:30}],
  ["flanders","Team Flanders - Baloise","PRT","Belgium",20,"ProTeam / Pavé", "#f97316", "#111827", "#ffffff", "FLANDERS", "eddy_merckx", "dt_swiss", {gc:20,sprint:60,classics:80,breakaway:88,control:30}],
  ["novo","Team Novo Nordisk","PRT","United States",21,"ProTeam / Desarrollo", "#2563eb", "#ffffff", "#ef4444", "NOVO", "colnago", "vision", {gc:22,sprint:52,classics:52,breakaway:80,control:25}],
  ["polti","Team Polti VisitMalta","PRT","Italy",24,"ProTeam / Sprint-Fugas", "#ef4444", "#ffffff", "#16a34a", "POLTI", "aurum", "fulcrum", {gc:32,sprint:68,classics:58,breakaway:88,control:34}],
  ["total","TotalEnergies","PRT","France",31,"ProTeam / Clásicas", "#0f172a", "#ef4444", "#ffffff", "TOTAL", "cube", "newmen", {gc:38,sprint:70,classics:76,breakaway:86,control:38}],
  ["tudor","Tudor Pro Cycling Team","PRT","Switzerland",31,"ProTeam / Ambicioso", "#ffffff", "#111827", "#ef4444", "TUDOR", "bianchi", "dt_swiss", {gc:70,sprint:78,classics:84,breakaway:76,control:54}],
  ["unibet","Unibet Rose Rockets","PRT","Netherlands",30,"ProTeam / Sprint-Clásicas", "#f472b6", "#111827", "#22c55e", "UNIBET", "wilier", "shimano", {gc:34,sprint:72,classics:70,breakaway:82,control:34}]
];

const TEAMS = TEAM_BLUEPRINTS.map(([id,name,level,country,count,archetype,primary,secondary,accent,logoText,frame,wheels,ai]) => ({
  id, name, level, country, riderCountPCS: count, archetype, color: primary, ai,
  visual: { primary, secondary, accent, logoText },
  material: { frame, wheels },
  management: { budget: level === "WT" ? 26000000 : 8000000, prestige: level === "WT" ? 82 : 58, sponsorPressure: level === "WT" ? 80 : 58 }
}));

/* ============================================================
   MATERIAL
   ============================================================ */
const FRAME_BRANDS = [
  {id:"colnago",name:"Colnago",aero:96,weight:94,stiffness:97,comfort:88,handling:93,cobbles:84,tt:88,reliability:94},
  {id:"cervelo",name:"Cervélo",aero:98,weight:93,stiffness:95,comfort:87,handling:92,cobbles:83,tt:97,reliability:93},
  {id:"pinarello",name:"Pinarello",aero:97,weight:92,stiffness:98,comfort:87,handling:96,cobbles:84,tt:95,reliability:94},
  {id:"canyon",name:"Canyon",aero:97,weight:94,stiffness:95,comfort:88,handling:92,cobbles:86,tt:95,reliability:93},
  {id:"specialized",name:"Specialized",aero:99,weight:95,stiffness:96,comfort:90,handling:94,cobbles:86,tt:94,reliability:95},
  {id:"trek",name:"Trek",aero:95,weight:93,stiffness:94,comfort:91,handling:93,cobbles:89,tt:91,reliability:95},
  {id:"bianchi",name:"Bianchi",aero:94,weight:94,stiffness:93,comfort:89,handling:92,cobbles:85,tt:90,reliability:92},
  {id:"vanrysel",name:"Van Rysel",aero:93,weight:91,stiffness:92,comfort:88,handling:90,cobbles:84,tt:88,reliability:91},
  {id:"cannondale",name:"Cannondale",aero:94,weight:93,stiffness:93,comfort:90,handling:93,cobbles:86,tt:90,reliability:92},
  {id:"wilier",name:"Wilier",aero:94,weight:93,stiffness:93,comfort:88,handling:91,cobbles:84,tt:91,reliability:92},
  {id:"orbea",name:"Orbea",aero:92,weight:93,stiffness:92,comfort:89,handling:91,cobbles:84,tt:87,reliability:92},
  {id:"ridley",name:"Ridley",aero:94,weight:92,stiffness:94,comfort:87,handling:90,cobbles:89,tt:88,reliability:92},
  {id:"scott",name:"Scott",aero:95,weight:93,stiffness:94,comfort:88,handling:91,cobbles:84,tt:91,reliability:93},
  {id:"giant",name:"Giant",aero:94,weight:92,stiffness:93,comfort:89,handling:91,cobbles:85,tt:90,reliability:94},
  {id:"xlab",name:"X-Lab",aero:91,weight:91,stiffness:91,comfort:86,handling:88,cobbles:82,tt:86,reliability:89},
  {id:"mmr",name:"MMR",aero:90,weight:93,stiffness:91,comfort:87,handling:89,cobbles:82,tt:85,reliability:90},
  {id:"bh",name:"BH",aero:91,weight:94,stiffness:92,comfort:88,handling:90,cobbles:83,tt:86,reliability:91},
  {id:"aurum",name:"Aurum",aero:92,weight:92,stiffness:92,comfort:88,handling:90,cobbles:83,tt:87,reliability:90},
  {id:"look",name:"Look",aero:93,weight:91,stiffness:93,comfort:87,handling:90,cobbles:83,tt:89,reliability:91},
  {id:"cube",name:"Cube",aero:93,weight:92,stiffness:92,comfort:88,handling:90,cobbles:83,tt:88,reliability:91},
  {id:"de_rosa",name:"De Rosa",aero:90,weight:90,stiffness:91,comfort:86,handling:88,cobbles:81,tt:85,reliability:89},
  {id:"eddy_merckx",name:"Eddy Merckx",aero:90,weight:89,stiffness:91,comfort:88,handling:88,cobbles:86,tt:84,reliability:90}
];
const WHEEL_BRANDS = [
  {id:"enve",name:"ENVE",aero:96,weight:93,stiffness:95,crosswind:90,cobbles:87,tt:94,reliability:93},
  {id:"reserve",name:"Reserve",aero:97,weight:93,stiffness:95,crosswind:91,cobbles:85,tt:96,reliability:93},
  {id:"shimano",name:"Shimano Dura-Ace",aero:94,weight:93,stiffness:94,crosswind:92,cobbles:87,tt:91,reliability:96},
  {id:"zipp",name:"Zipp",aero:96,weight:92,stiffness:94,crosswind:88,cobbles:85,tt:95,reliability:92},
  {id:"roval",name:"Roval",aero:98,weight:95,stiffness:95,crosswind:90,cobbles:86,tt:96,reliability:94},
  {id:"bontrager",name:"Bontrager",aero:94,weight:92,stiffness:93,crosswind:91,cobbles:88,tt:90,reliability:95},
  {id:"vision",name:"Vision Metron",aero:95,weight:91,stiffness:94,crosswind:88,cobbles:84,tt:94,reliability:92},
  {id:"swissside",name:"Swiss Side",aero:93,weight:90,stiffness:91,crosswind:89,cobbles:84,tt:92,reliability:91},
  {id:"fulcrum",name:"Fulcrum",aero:92,weight:92,stiffness:92,crosswind:90,cobbles:86,tt:88,reliability:92},
  {id:"orbea",name:"Orbea Oquo",aero:90,weight:90,stiffness:90,crosswind:89,cobbles:84,tt:85,reliability:90},
  {id:"dt_swiss",name:"DT Swiss",aero:93,weight:94,stiffness:93,crosswind:92,cobbles:89,tt:90,reliability:96},
  {id:"cadex",name:"CADEX",aero:94,weight:94,stiffness:93,crosswind:91,cobbles:86,tt:91,reliability:94},
  {id:"corima",name:"Corima",aero:93,weight:91,stiffness:92,crosswind:88,cobbles:83,tt:92,reliability:90},
  {id:"mavic",name:"Mavic",aero:90,weight:91,stiffness:91,crosswind:91,cobbles:88,tt:86,reliability:93},
  {id:"newmen",name:"Newmen",aero:91,weight:92,stiffness:90,crosswind:90,cobbles:85,tt:86,reliability:90}
];
const EQUIPMENT_PRESETS = [
  { id: "auto", name: "Auto según etapa", frameType: "auto", wheelType: "auto" },
  { id: "flat", name: "Llano aero", frameType: "aero", wheelType: "deep" },
  { id: "mountain", name: "Montaña", frameType: "light", wheelType: "light" },
  { id: "hilly", name: "Media montaña", frameType: "light", wheelType: "mid" },
  { id: "cobbles", name: "Pavé", frameType: "endurance", wheelType: "cobbles" },
  { id: "tt", name: "Crono", frameType: "tt", wheelType: "disc" },
  { id: "safe", name: "Seguro lluvia/viento", frameType: "endurance", wheelType: "mid" }
];

/* ============================================================
   ROLES / STATS
   ============================================================ */
const ROLE_TEMPLATES = {
  gc: { label:"Líder GC", defaultOrder:"hold", defaultEffort:68, stats:{flat:80,sprint:62,mountain:92,hills:84,cobbles:64,tt:84,ttt:84,stamina:91,recovery:89,acceleration:78,positioning:82,downhill:82,weightKg:64} },
  co: { label:"Co-líder", defaultOrder:"hold", defaultEffort:66, stats:{flat:79,sprint:62,mountain:87,hills:82,cobbles:64,tt:80,ttt:82,stamina:87,recovery:85,acceleration:76,positioning:80,downhill:80,weightKg:66} },
  climber: { label:"Escalador", defaultOrder:"hold", defaultEffort:64, stats:{flat:71,sprint:54,mountain:88,hills:80,cobbles:54,tt:69,ttt:71,stamina:86,recovery:84,acceleration:76,positioning:73,downhill:80,weightKg:61} },
  tt: { label:"Croner", defaultOrder:"pull", defaultEffort:72, stats:{flat:86,sprint:62,mountain:71,hills:74,cobbles:66,tt:89,ttt:90,stamina:85,recovery:80,acceleration:68,positioning:78,downhill:74,weightKg:75} },
  sprinter: { label:"Sprinter", defaultOrder:"sit", defaultEffort:50, stats:{flat:87,sprint:91,mountain:55,hills:69,cobbles:72,tt:67,ttt:73,stamina:77,recovery:75,acceleration:93,positioning:88,downhill:72,weightKg:76} },
  classics: { label:"Clasicómano", defaultOrder:"hold", defaultEffort:66, stats:{flat:84,sprint:78,mountain:70,hills:84,cobbles:87,tt:74,ttt:78,stamina:85,recovery:80,acceleration:84,positioning:88,downhill:78,weightKg:72} },
  rouleur: { label:"Rodador", defaultOrder:"pull", defaultEffort:72, stats:{flat:87,sprint:68,mountain:69,hills:74,cobbles:74,tt:80,ttt:84,stamina:84,recovery:80,acceleration:70,positioning:80,downhill:74,weightKg:74} },
  domestique: { label:"Gregario", defaultOrder:"protect", defaultEffort:64, stats:{flat:78,sprint:62,mountain:78,hills:76,cobbles:66,tt:74,ttt:78,stamina:83,recovery:80,acceleration:70,positioning:78,downhill:76,weightKg:69} },
  puncheur: { label:"Puncheur", defaultOrder:"hold", defaultEffort:68, stats:{flat:79,sprint:76,mountain:78,hills:88,cobbles:72,tt:73,ttt:75,stamina:82,recovery:79,acceleration:88,positioning:82,downhill:78,weightKg:66} }
};

/* ============================================================
   ROSTERS 2026: líderes y corredores conocidos + relleno automático hasta count PCS.
   Los equipos que no tienen listado completo manual se completan como neo-pros internos.
   ============================================================ */
const TEAM_RIDERS_SEED = {
  uae: [["Tadej Pogačar","Slovenia",27,"gc",99],["João Almeida","Portugal",27,"co",91],["Adam Yates","Great Britain",33,"climber",90],["Isaac del Toro","Mexico",22,"puncheur",90],["Brandon McNulty","United States",28,"tt",86],["Tim Wellens","Belgium",35,"classics",85],["Nils Politt","Germany",32,"rouleur",84],["Felix Großschartner","Austria",32,"domestique",82],["Marc Soler","Spain",32,"climber",84],["Jay Vine","Australia",30,"climber",85],["Pavel Sivakov","France",29,"climber",83],["Jhonatan Narváez","Ecuador",29,"classics",86],["Mikkel Bjerg","Denmark",27,"tt",81],["Juan Sebastián Molano","Colombia",31,"sprinter",82],["Igor Arrieta","Spain",23,"climber",79],["Jan Christen","Switzerland",21,"puncheur",82]],
  visma: [["Jonas Vingegaard","Denmark",29,"gc",97],["Wout van Aert","Belgium",31,"classics",94],["Matteo Jorgenson","United States",27,"co",90],["Sepp Kuss","United States",31,"climber",88],["Simon Yates","Great Britain",33,"climber",87],["Wilco Kelderman","Netherlands",35,"domestique",83],["Christophe Laporte","France",33,"classics",86],["Victor Campenaerts","Belgium",34,"tt",84],["Edoardo Affini","Italy",30,"tt",84],["Axel Zingle","France",27,"classics",81],["Ben Tulett","Great Britain",24,"climber",82],["Davide Piganzoli","Italy",24,"gc",82],["Matthew Brennan","Great Britain",20,"sprinter",84],["Per Strand Hagenes","Norway",23,"classics",80],["Bruno Armirail","France",32,"tt",82],["Jørgen Nordhagen","Norway",21,"gc",82],["Bart Lemmen","Netherlands",30,"gc",79]],
  ineos: [["Carlos Rodríguez","Spain",25,"gc",89],["Egan Bernal","Colombia",29,"gc",87],["Thymen Arensman","Netherlands",26,"climber",86],["Filippo Ganna","Italy",29,"tt",91],["Joshua Tarling","Great Britain",22,"tt",89],["Magnus Sheffield","United States",24,"rouleur",84],["Laurens De Plus","Belgium",30,"domestique",82],["Ben Turner","Great Britain",27,"classics",81],["Geraint Thomas","Great Britain",40,"co",83],["Michal Kwiatkowski","Poland",36,"classics",82],["Tobias Foss","Norway",29,"tt",82],["Omar Fraile","Spain",36,"domestique",78],["Jonathan Castroviejo","Spain",39,"tt",80],["AJ August","United States",21,"climber",78]],
  alpecin: [["Mathieu van der Poel","Netherlands",31,"classics",96],["Jasper Philipsen","Belgium",28,"sprinter",93],["Kaden Groves","Australia",27,"sprinter",87],["Tibor Del Grosso","Netherlands",23,"puncheur",82],["Quinten Hermans","Belgium",31,"puncheur",81],["Gianni Vermeersch","Belgium",33,"classics",80],["Silvan Dillier","Switzerland",36,"rouleur",78],["Søren Kragh Andersen","Denmark",32,"rouleur",80],["Florian Sénéchal","France",33,"classics",82],["Gerben Thijssen","Belgium",28,"sprinter",82],["Xandro Meurisse","Belgium",34,"puncheur",78]],
  redbull: [["Remco Evenepoel","Belgium",26,"gc",96],["Primož Roglič","Slovenia",36,"gc",94],["Jai Hindley","Australia",30,"climber",87],["Aleksandr Vlasov","Russia",30,"co",86],["Daniel Felipe Martínez","Colombia",30,"climber",87],["Florian Lipowitz","Germany",25,"climber",85],["Roger Adrià","Spain",28,"puncheur",80],["Sam Welsford","Australia",30,"sprinter",86],["Danny van Poppel","Netherlands",33,"sprinter",82],["Nico Denz","Germany",32,"rouleur",80],["Ryan Mullen","Ireland",32,"tt",80],["Laurence Pithie","New Zealand",24,"classics",81],["Finn Fisher-Black","New Zealand",24,"puncheur",80]],
  lidl: [["Juan Ayuso","Spain",24,"gc",91],["Mads Pedersen","Denmark",30,"classics",91],["Jonathan Milan","Italy",26,"sprinter",90],["Giulio Ciccone","Italy",31,"climber",86],["Mattias Skjelmose","Denmark",26,"co",87],["Tao Geoghegan Hart","Great Britain",31,"climber",83],["Thibau Nys","Belgium",24,"puncheur",84],["Toms Skujiņš","Latvia",35,"classics",82],["Quinn Simmons","United States",25,"classics",81],["Mathias Vacek","Czech Republic",24,"tt",81],["Daan Hoole","Netherlands",27,"tt",80]],
  movistar: [["Enric Mas","Spain",31,"gc",88],["Nairo Quintana","Colombia",36,"climber",84],["Einer Rubio","Colombia",28,"climber",83],["Iván Romeo","Spain",23,"tt",82],["Alex Aranburu","Spain",30,"classics",83],["Fernando Gaviria","Colombia",31,"sprinter",84],["Pelayo Sánchez","Spain",26,"puncheur",82],["Javier Romo","Spain",27,"puncheur",80],["Oier Lazkano","Spain",26,"classics",83],["Davide Formolo","Italy",33,"domestique",80],["Rémi Cavagna","France",31,"tt",80]],
  soudal: [["Mikel Landa","Spain",36,"climber",86],["Tim Merlier","Belgium",33,"sprinter",89],["Jasper Stuyven","Belgium",34,"classics",85],["Yves Lampaert","Belgium",35,"tt",82],["Ilan Van Wilder","Belgium",26,"co",83],["Mauri Vansevenant","Belgium",27,"puncheur",81],["Paul Magnier","France",22,"sprinter",82],["Kasper Asgreen","Denmark",31,"rouleur",82],["Mattia Cattaneo","Italy",36,"tt",80],["Luke Lamperti","United States",23,"sprinter",80]],
  decathlon: [["Paul Seixas","France",20,"gc",87],["Felix Gall","Austria",28,"climber",86],["Olav Kooij","Netherlands",24,"sprinter",89],["Tiesj Benoot","Belgium",32,"classics",84],["Paul Lapeira","France",26,"puncheur",83],["Dorian Godon","France",30,"classics",81],["Bruno Armirail","France",32,"tt",81],["Aurélien Paret-Peintre","France",30,"climber",81],["Matthew Riccitello","United States",24,"climber",82],["Sam Bennett","Ireland",35,"sprinter",81]],
  bahrain: [["Pello Bilbao","Spain",36,"gc",84],["Santiago Buitrago","Colombia",26,"climber",86],["Antonio Tiberi","Italy",25,"co",85],["Lenny Martinez","France",23,"climber",86],["Matej Mohorič","Slovenia",31,"classics",86],["Alec Segaert","Belgium",23,"tt",83],["Phil Bauhaus","Germany",32,"sprinter",82],["Fred Wright","Great Britain",27,"classics",80],["Damiano Caruso","Italy",39,"climber",82]],
  ef: [["Richard Carapaz","Ecuador",33,"gc",88],["Ben Healy","Ireland",25,"puncheur",88],["Neilson Powless","United States",29,"classics",84],["Stefan Bissegger","Switzerland",27,"tt",83],["Marijn van den Berg","Netherlands",27,"sprinter",83],["Rui Costa","Portugal",39,"puncheur",80],["Hugh Carthy","Great Britain",32,"climber",80],["Alberto Bettiol","Italy",32,"classics",83]],
  groupama: [["David Gaudu","France",29,"climber",84],["Romain Grégoire","France",23,"puncheur",84],["Valentin Madouas","France",30,"classics",83],["Stefan Küng","Switzerland",32,"tt",86],["Paul Penhoët","France",25,"sprinter",80],["Quentin Pacher","France",34,"puncheur",79],["Enzo Paleni","France",23,"rouleur",77]],
  jayco: [["Michael Matthews","Australia",35,"classics",84],["Dylan Groenewegen","Netherlands",33,"sprinter",85],["Luke Plapp","Australia",25,"tt",84],["Eddie Dunbar","Ireland",30,"climber",82],["Mauro Schmid","Switzerland",26,"puncheur",81],["Chris Harper","Australia",31,"climber",79],["Elmar Reinders","Netherlands",34,"rouleur",76]],
  picnic: [["Oscar Onley","Great Britain",23,"gc",84],["Max Poole","Great Britain",23,"climber",83],["Pavel Bittner","Czech Republic",23,"sprinter",82],["Frank van den Broek","Netherlands",25,"rouleur",80],["Nils Eekhoff","Netherlands",28,"classics",80],["Warren Barguil","France",34,"climber",80],["Fabio Jakobsen","Netherlands",29,"sprinter",82]],
  lotto: [["Biniam Girmay","Eritrea",26,"sprinter",88],["Arnaud De Lie","Belgium",24,"sprinter",87],["Laurenz Rex","Belgium",27,"classics",80],["Louis Vervaeke","Belgium",32,"domestique",77],["Mike Teunissen","Netherlands",34,"classics",78],["Rune Herregodts","Belgium",27,"rouleur",80]],
  unox: [["Tobias Halland Johannessen","Norway",26,"gc",83],["Søren Wærenskjold","Norway",26,"tt",84],["Alexander Kristoff","Norway",39,"sprinter",82],["Jonas Abrahamsen","Norway",30,"rouleur",82],["Andreas Leknessund","Norway",27,"climber",80],["Rasmus Tiller","Norway",30,"classics",80]],
  astana: [["Lorenzo Fortunato","Italy",30,"climber",82],["Harold Tejada","Colombia",29,"climber",80],["Christian Scaroni","Italy",29,"puncheur",79],["Alexey Lutsenko","Kazakhstan",33,"classics",80],["Cees Bol","Netherlands",31,"sprinter",79],["Gleb Syritsa","Russia",26,"sprinter",78]],
  nsn: [["Derek Gee","Canada",28,"gc",84],["Stephen Williams","Great Britain",30,"puncheur",83],["Michael Woods","Canada",39,"climber",82],["Corbin Strong","New Zealand",26,"classics",82],["Riley Sheehan","United States",26,"classics",79],["Jake Stewart","Great Britain",27,"sprinter",78]],
  q36: [["Tom Pidcock","Great Britain",27,"classics",88],["Julian Alaphilippe","France",34,"puncheur",85],["Matteo Trentin","Italy",37,"classics",80],["Mark Donovan","Great Britain",27,"climber",78],["Sjoerd Bax","Netherlands",30,"puncheur",78]],
  tudor: [["Marc Hirschi","Switzerland",28,"puncheur",87],["Michael Storer","Australia",29,"climber",84],["Arvid de Kleijn","Netherlands",32,"sprinter",82],["Nils Brun","Switzerland",25,"rouleur",76],["Marius Mayrhofer","Germany",26,"classics",78]],
  caja: [["Fernando Gaviria","Colombia",31,"sprinter",84],["Orluis Aular","Venezuela",30,"sprinter",80],["Jefferson Cepeda","Ecuador",30,"climber",79],["Eduard Prades","Spain",39,"classics",80],["Stefano Oldani","Italy",28,"classics",80],["Jakub Otruba","Czech Republic",28,"tt",78],["José Félix Parra","Spain",29,"climber",78]],
  burgos: [["Jesús Herrada","Spain",36,"puncheur",82],["Pablo Castrillo","Spain",25,"puncheur",81],["Merhawi Kudus","Eritrea",32,"climber",80],["Aaron Gate","New Zealand",36,"rouleur",78],["Jambaljamts Sainbayar","Mongolia",29,"rouleur",78],["José Manuel Díaz","Spain",31,"climber",78]],
  euskaltel: [["Jonathan Lastra","Spain",33,"classics",78],["Mikel Bizkarra","Spain",37,"climber",77],["Gotzon Martín","Spain",30,"puncheur",77],["Txomin Juaristi","Spain",31,"rouleur",76],["Xabier Berasategi","Spain",26,"climber",76],["Urko Berrade","Spain",28,"puncheur",76]],
  polti: [["Giovanni Lonardi","Italy",30,"sprinter",80],["Mirco Maestri","Italy",34,"rouleur",79],["Davide De Pretto","Italy",24,"puncheur",78],["Alessandro Tonelli","Italy",34,"puncheur",78],["Manuel Peñalver","Spain",27,"sprinter",78],["Fernando Tercero","Spain",25,"climber",77]],
  cofidis: [["Ion Izagirre","Spain",37,"climber",81],["Bryan Coquard","France",34,"sprinter",82],["Dylan Teuns","Belgium",34,"puncheur",82],["Simon Geschke","Germany",40,"climber",76],["Alexis Renard","France",27,"sprinter",78]],
  total: [["Anthony Turgis","France",32,"classics",82],["Mathieu Burgaudeau","France",28,"puncheur",80],["Valentin Ferron","France",28,"puncheur",78],["Dries Van Gestel","Belgium",31,"classics",79],["Emilien Jeannière","France",27,"sprinter",78]],
  bardiani: [["Filippo Fiorelli","Italy",31,"puncheur",78],["Enrico Zanoncello","Italy",29,"sprinter",78],["Giovanni Carboni","Italy",31,"climber",77],["Luca Covili","Italy",29,"climber",76]],
  kern: [["Urko Berrade","Spain",28,"puncheur",79],["Pau Miquel","Spain",26,"classics",78],["Roger Adrià","Spain",28,"puncheur",80],["Pablo Castrillo","Spain",25,"puncheur",80]],
  flanders: [["Lindsay De Vylder","Belgium",31,"rouleur",76],["Aaron Van Poucke","Belgium",28,"puncheur",75],["Jens Reynders","Belgium",28,"classics",76]],
  novo: [["Andrea Peron","Italy",38,"sprinter",75],["Sam Brand","Great Britain",35,"rouleur",74],["David Lozano","Spain",37,"climber",74]],
  unibet: [["Taco van der Hoorn","Netherlands",32,"rouleur",80],["Harry Tanfield","Great Britain",32,"tt",76],["Sjoerd Bax","Netherlands",30,"puncheur",78]],
  mbh: [], modern: [], solution: []
};

const NATIONALITY_POOL = ["Spain","France","Belgium","Italy","Netherlands","Germany","Denmark","Norway","Portugal","Great Britain","Australia","Colombia","United States","Switzerland","Poland","Czech Republic","Slovenia","Austria"];
const FILLER_FIRST = ["Alex","Lucas","Marc","Nicolas","Tom","Pablo","Victor","Luca","Martin","Oscar","Jon","Max","Jules","Simon","Nils","Bruno","Milan","Diego","Ander","Ruben","Felix","Leo","Mathis","Enzo"];
const FILLER_LAST = ["Martin","Lefevre","Rossi","Van Dijk","Müller","Garcia","Petersen","Moreau","Bianchi","Hansen","Smith","Lopez","Kowalski","Dubois","Romero","Vidal","Ferrari","Bakker","Meier","Costa"];
function dataClamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function deterministicNoise(a,b,key) { const seed = a*131 + b*37 + String(key).split("").reduce((s,c)=>s+c.charCodeAt(0),0); const raw = Math.sin(seed)*10000; return Math.round(((raw - Math.floor(raw)) - 0.5) * 8); }
function makeFillerRider(team, index) {
  const roleCycle = ["domestique","rouleur","climber","puncheur","sprinter","classics","tt"];
  const role = roleCycle[(index + team.id.length) % roleCycle.length];
  const first = FILLER_FIRST[(index * 3 + team.name.length) % FILLER_FIRST.length];
  const last = FILLER_LAST[(index * 5 + team.id.length) % FILLER_LAST.length];
  const nat = NATIONALITY_POOL[(index * 7 + team.country.length) % NATIONALITY_POOL.length];
  const base = team.level === "WT" ? 73 + ((index * 11) % 8) : 68 + ((index * 11) % 8);
  return [`${first} ${last}`, nat, 20 + ((index * 3) % 18), role, base];
}
function getFullTeamRiderSeeds(team) {
  const base = (TEAM_RIDERS_SEED[team.id] || []).map(x => [...x]);
  const names = new Set(base.map(r => r[0]));
  let idx = 1;
  while (base.length < team.riderCountPCS) {
    const f = makeFillerRider(team, idx++);
    if (!names.has(f[0])) { base.push(f); names.add(f[0]); }
  }
  return base.slice(0, team.riderCountPCS);
}
const TEAM_RIDERS = Object.fromEntries(TEAMS.map(team => [team.id, getFullTeamRiderSeeds(team)]));
const TEAM_RIDER_BLUEPRINTS = TEAM_RIDERS;

function riderId(teamId, name, index) {
  return `${teamId}_${String(index+1).padStart(2,"0")}_${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")}`;
}
function buildStats(templateStats, base, team, teamIndex, riderIndex) {
  const stats = {};
  const lift = (base - 76) * 0.60;
  Object.keys(templateStats).forEach(key => {
    let teamBias = 0;
    if (key === "mountain") teamBias = (team.ai.gc - 60) / 13;
    if (key === "sprint") teamBias = (team.ai.sprint - 60) / 13;
    if (key === "cobbles" || key === "hills") teamBias = (team.ai.classics - 60) / 13;
    if (key === "stamina" || key === "recovery") teamBias = (team.ai.control - 55) / 18;
    stats[key] = dataClamp(Math.round(templateStats[key] + lift + teamBias + deterministicNoise(teamIndex, riderIndex, key)), 42, 99);
  });
  stats.timeTrial = stats.tt;
  stats.teamTimeTrial = stats.ttt;
  stats.weightKg = dataClamp(Math.round(templateStats.weightKg + deterministicNoise(teamIndex, riderIndex, "kg") * 0.6), 54, 82);
  return stats;
}
function buildRiders() {
  const riders = [];
  TEAMS.forEach((team, teamIndex) => {
    TEAM_RIDERS[team.id].forEach((item, riderIndex) => {
      const [name, nationality, age, roleKey, base] = item;
      const template = ROLE_TEMPLATES[roleKey] || ROLE_TEMPLATES.domestique;
      const stats = buildStats(template.stats, base, team, teamIndex, riderIndex);
      riders.push({
        id: riderId(team.id, name, riderIndex), name, nationality, age, teamId: team.id,
        roleKey, role: template.label, base, defaultOrder: template.defaultOrder, defaultEffort: template.defaultEffort,
        stats, form: dataClamp(base + deterministicNoise(teamIndex, riderIndex, "form"), 50, 99), morale: dataClamp(76 + deterministicNoise(teamIndex, riderIndex, "morale"), 40, 99),
        fatigue: 0, energy: 100, totalTime: 0, points: 0, mountainPoints: 0, uciPoints: 0, stageWins: 0, seasonStageWins: 0, raceDays: 0, abandoned: false
      });
    });
  });
  return riders;
}
const RIDERS = buildRiders();

/* ============================================================
   ÓRDENES / ESTRATEGIA / CRE
   ============================================================ */
const RIDER_ORDERS = [
  {id:"sit",name:"Ir a rueda",desc:"Gasta poco. No tira. Puede quedarse si el grupo acelera.",pull:0,attack:0,energy:0.72},
  {id:"hold",name:"Mantener posición",desc:"Rueda en el grupo sin forzar.",pull:0.15,attack:0,energy:1.00},
  {id:"protect",name:"Proteger líder",desc:"Reduce riesgo de corte del líder y le aporta apoyo.",pull:0.30,attack:0,energy:1.18},
  {id:"pull",name:"Tirar del grupo",desc:"Aumenta velocidad del grupo sin separarse.",pull:1.00,attack:0,energy:1.42},
  {id:"catch",name:"Cazar fuga",desc:"Trabajo fuerte para recortar hueco.",pull:1.25,attack:0,energy:1.58},
  {id:"tempo",name:"Subir a tempo",desc:"Ritmo alto en subida. Puede cortar rivales.",pull:1.10,attack:0,energy:1.52},
  {id:"attack",name:"Atacar",desc:"Intenta salir hacia delante.",pull:0.10,attack:1.00,energy:1.85},
  {id:"bridge",name:"Saltar a grupo",desc:"Intenta cruzar hacia el grupo delantero.",pull:0.20,attack:0.75,energy:1.70},
  {id:"wait",name:"Esperar líder",desc:"Pierde tiempo para ayudar a un compañero.",pull:0,attack:0,energy:1.25},
  {id:"sprint_train",name:"Tren de sprint",desc:"Prepara el sprint del líder rápido.",pull:0.95,attack:0,energy:1.42}
];
const SMART_PRESETS = [
  {id:"protect_gc",name:"Proteger GC",description:"Líder protegido, gregarios trabajan y sprinters conservan."},
  {id:"sprint",name:"Sprint masivo",description:"Sprinter a rueda, rodadores y clasicómanos hacen tren."},
  {id:"breakaway",name:"Fuga del día",description:"Puncheurs, rodadores y escaladores secundarios atacan."},
  {id:"mountain_attack",name:"Montaña agresiva",description:"Escaladores endurecen y líder preparado para atacar."},
  {id:"survival",name:"Supervivencia",description:"Todos conservan energía y evitan riesgos."},
  {id:"time_trial",name:"Crono a tope",description:"Croners, rodadores y líderes a esfuerzo alto."}
];
const TTT_RELAY_MODES = [
  {id:"smooth",name:"Relevos suaves",description:"Menor riesgo, ritmo estable, poca pérdida de gregarios.",intensity:0.88,risk:0.75,cohesion:1.20},
  {id:"steady",name:"Relevos regulares",description:"Ritmo competitivo equilibrado.",intensity:1.00,risk:1.00,cohesion:1.00},
  {id:"hard",name:"Relevos fuertes",description:"Más velocidad, más riesgo de descolgar corredores débiles.",intensity:1.13,risk:1.30,cohesion:0.82},
  {id:"full",name:"A bloque",description:"Máximo ritmo. Muy exigente, puede romper el bloque.",intensity:1.25,risk:1.70,cohesion:0.62}
];

/* ============================================================
   NUTRICIÓN: stock más amplio, coche casi siempre abastecido
   ============================================================ */
const NUTRITION_ITEMS = [
  {id:"gel",name:"Gel",description:"Energía rápida.",energy:24,hydration:0,stomach:7,finalBonus:0},
  {id:"bar",name:"Barrita",description:"Energía lenta y estable.",energy:28,hydration:-1,stomach:13,finalBonus:0},
  {id:"iso",name:"Bidón isotónico",description:"Energía e hidratación.",energy:14,hydration:24,stomach:5,finalBonus:0},
  {id:"caf",name:"Gel cafeína",description:"Extra para final o ataque.",energy:20,hydration:-1,stomach:9,finalBonus:4},
  {id:"rice",name:"Rice cake",description:"Energía estable con poca agresividad.",energy:20,hydration:0,stomach:8,finalBonus:0},
  {id:"water",name:"Agua",description:"Hidratación sin carga energética.",energy:2,hydration:30,stomach:2,finalBonus:0}
];
const NUTRITION_PLANS = [
  {id:"auto_balanced",name:"Coche equilibrado",stock:{gel:80,bar:50,iso:120,caf:28,rice:60,water:140}},
  {id:"mountain",name:"Coche montaña",stock:{gel:120,bar:35,iso:130,caf:36,rice:45,water:150}},
  {id:"sprint",name:"Coche sprint",stock:{gel:90,bar:45,iso:140,caf:40,rice:45,water:140}},
  {id:"hot",name:"Coche calor",stock:{gel:90,bar:35,iso:170,caf:28,rice:45,water:190}}
];
const AUTO_NUTRITION_MODES = [
  {id:"auto_smart",name:"Automático inteligente",description:"Toma geles/bidones por umbrales y tipo de sector."},
  {id:"auto_conservative",name:"Automático conservador",description:"Come antes; evita pájaras y deshidratación."},
  {id:"auto_aggressive",name:"Automático agresivo",description:"Reserva cafeína/geles para ataques y finales."},
  {id:"manual",name:"Manual",description:"Tú decides cada ingesta."}
];

/* ============================================================
   ENTRENAMIENTO AMPLIADO
   ============================================================ */
const TRAINING_OPTIONS = [
  {id:"recovery",name:"Recuperación activa",destination:"Casa / hotel",days:3,description:"Reduce fatiga y mantiene forma.",effects:{fatigue:-18,form:1,morale:1}},
  {id:"rest_block",name:"Descanso completo",destination:"Casa",days:5,description:"Baja mucha fatiga; pequeña caída de tono.",effects:{fatigue:-30,form:-1,morale:2}},
  {id:"altitude_teide",name:"Training camp altura · Teide",destination:"Tenerife",days:14,description:"Gran bloque para GC y escaladores.",effects:{mountain:2,stamina:2,recovery:1,form:4,fatigue:8}},
  {id:"altitude_sierra",name:"Training camp altura · Sierra Nevada",destination:"Granada",days:12,description:"Mejora umbral, montaña y recuperación.",effects:{mountain:2,stamina:1,recovery:2,form:3,fatigue:7}},
  {id:"altitude_andorra",name:"Training camp altura · Andorra",destination:"Andorra",days:10,description:"Bloque mixto de puertos y resistencia.",effects:{mountain:1,hills:1,stamina:2,form:3,fatigue:6}},
  {id:"tt_aero",name:"Aero testing + crono",destination:"Velódromo / túnel",days:5,description:"Mejora CRI/CRE, posición y llano.",effects:{tt:2,ttt:2,flat:1,positioning:1,form:2,fatigue:4}},
  {id:"cobbles_belgium",name:"Camp pavé Flandes/Roubaix",destination:"Bélgica / Norte Francia",days:6,description:"Mejora pavé, técnica y colocación.",effects:{cobbles:2,positioning:2,handling:1,form:2,fatigue:5}},
  {id:"sprint_track",name:"Sprint + pista",destination:"Velódromo",days:4,description:"Mejora sprint, aceleración y salida de curva.",effects:{sprint:2,acceleration:2,positioning:1,form:2,fatigue:4}},
  {id:"hills_ardennes",name:"Muros y Ardenas",destination:"Ardenas",days:7,description:"Ideal para puncheurs y clásicas duras.",effects:{hills:2,acceleration:1,stamina:1,form:3,fatigue:5}},
  {id:"heat_adaptation",name:"Aclimatación calor",destination:"Calpe / UAE",days:8,description:"Reduce penalización en etapas calurosas.",effects:{heatAdaptation:2,stamina:1,recovery:1,form:2,fatigue:5}},
  {id:"team_ttt",name:"Concentración CRE",destination:"Circuito cerrado",days:5,description:"Mejora cohesión y relevos de CRE.",effects:{ttt:2,flat:1,positioning:2,form:2,fatigue:4}},
  {id:"grand_tour_base",name:"Base gran vuelta",destination:"Alpes / Pirineos",days:18,description:"Bloque largo, muy potente pero fatigante.",effects:{stamina:3,recovery:2,mountain:2,form:5,fatigue:14}},
  {id:"race_sharpness",name:"Activación pre-carrera",destination:"Circuito final",days:2,description:"Pequeño pico de forma sin mucha carga.",effects:{form:2,morale:1,fatigue:2}}
];

/* ============================================================
   REGLAS
   ============================================================ */
const CLASSIFICATION_RULES = {
  youthMaxAge: 25, teamClassificationBestRiders: 3, finishBonuses: [10,6,4],
  pointsByStageType: {
    flat:[50,30,20,18,16,14,12,10,8,7], hilly:[35,25,20,17,15,13,11,9,7,6],
    mountain:[25,20,16,14,12,10,8,6,4,2], cobbles:[35,25,20,17,15,13,11,9,7,6],
    tt:[20,17,15,13,11,9,7,5,3,1], ttt:[20,17,15,13,11,9,7,5,3,1]
  },
  mountainPoints:{HC:[20,15,12,10,8,6,4,2],"1":[10,8,6,4,2,1],"2":[5,3,2,1],"3":[2,1],"4":[1]},
  uci:{grandTourStage:[120,50,25,15,5],grandTourFinalGC:[1300,1040,880,730,620,520,425,325,275,225,175,150,125,105,85],oneDay:[500,400,325,275,225,175,150,125,100,85],stageRaceGC:[500,400,325,275,225,175,150,125,100,85]}
};

/* ============================================================
   CARRERAS Y ETAPAS
   ============================================================ */
function climb(name, category, km, length, gradient, maxGradient, altitude) { return {name,category,km,length,gradient,maxGradient,altitude}; }
function pave(name, from, to, severity) { return {name,from,to,severity}; }
function wall(name, km, length, gradient, maxGradient) { return {name,km,length,gradient,maxGradient}; }
function weather(tempC, rainMm, windKmh, crosswindKmh=0) { return {tempC, rainMm, windKmh, crosswindKmh, roadWetness:dataClamp(Math.round(rainMm*16 + windKmh*0.2),0,100), heatStress:dataClamp(Math.round((tempC-18)*4),0,100)}; }
function makeProfilePoints(stage) {
  const points = [];
  let alt = 120 + ((stage.number || 1) * 7) % 120;
  const climbs = (stage.climbs || []).slice().sort((a,b)=>a.km-b.km);
  for (let km=0; km<=Math.round(stage.distance); km++) {
    let targetAlt = alt + 80*Math.sin(km/17) + 40*Math.sin(km/6);
    climbs.forEach(c => {
      const start = Math.max(0, c.km - c.length);
      if (km >= start && km <= c.km) {
        const p = (km - start) / Math.max(1,c.length);
        targetAlt += (c.altitude || 1000) * p;
      } else if (km > c.km && km < c.km + c.length*0.8) {
        const p = 1 - ((km - c.km)/(c.length*0.8));
        targetAlt += (c.altitude || 1000) * Math.max(0,p) * 0.65;
      }
    });
    points.push({km, alt: Math.max(0, Math.round(targetAlt))});
  }
  return points;
}
function stage(id, number, name, type, distance, difficulty, profile={}) {
  const st = { id, number, name, type, label:{flat:"Llana",hilly:"Media montaña",mountain:"Alta montaña",cobbles:"Pavé / muros",tt:"CRI",ttt:"CRE"}[type],
    distance, difficulty, elevation:profile.elevation||900, climbs:profile.climbs||[], paves:profile.paves||[], walls:profile.walls||[], finalClimb:!!profile.finalClimb,
    weather: profile.weather || weather(profile.tempC||22, profile.rainMm||0, profile.windKmh||20, profile.crosswindKmh||0), description:profile.description||"Etapa del calendario 2026." };
  st.tempC = st.weather.tempC; st.rain = st.weather.rainMm; st.wind = st.weather.windKmh;
  st.profilePoints = makeProfilePoints(st); st.sectors = makeSectors(st); return st;
}
function makeSectors(stage) {
  const count = stage.type === "tt" || stage.type === "ttt" ? 3 : stage.distance > 220 ? 6 : stage.distance > 160 ? 5 : stage.distance > 90 ? 4 : 3;
  const sectors = [];
  for (let i=0;i<count;i++) {
    const from = Math.round((stage.distance/count)*i); const to = i===count-1 ? stage.distance : Math.round((stage.distance/count)*(i+1));
    const c = stage.climbs.find(x=>x.km>=from && x.km<=to); const p = stage.paves.find(x=>x.from<=to && x.to>=from); const w = stage.walls.find(x=>x.km>=from && x.km<=to);
    let type = i===count-1 ? "final" : stage.type;
    if (stage.type === "tt" || stage.type === "ttt") type="tt"; else if (p) type="cobbles"; else if (w) type="wall"; else if (c || stage.type==="mountain") type="climb"; else if (stage.type==="hilly") type="hilly"; else if (stage.type==="flat") type="flat";
    sectors.push({id:`${stage.id}_s${i+1}`,name:type==="climb"?`Subida ${c?c.name:""}`:type==="cobbles"?`Pavé ${p?p.name:""}`:type==="wall"?`Muro ${w?w.name:""}`:type==="final"?"Final":type==="tt"?"Sector crono":"Sector de carrera",from,to,type,difficulty:dataClamp(stage.difficulty+(c?12:0)+(p?p.severity*5:0)+(w?14:0)+(i===count-1?8:0),15,100),question:type==="tt"?"¿Ritmo de salida, tramo central y cierre?":type==="climb"?"¿Endurecer la subida o conservar?":type==="cobbles"?"¿Pasar delante y evitar riesgos?":type==="flat"?"¿Controlar fuga o ahorrar?":"¿Atacar, controlar o proteger?"});
  }
  return sectors;
}
function race(id,name,dateStart,dateEnd,type,country,stages,jersey="Ganador",jerseyClass="jersey-blue",category="1.UWT") { return {id,name,dateStart,dateEnd,type,country,stages,jersey,jerseyClass,category}; }
function oneDayStage(rid,name,type,distance,difficulty,profile={}) { return [stage(`${rid}_01`,1,name,type,distance,difficulty,profile)]; }
function stageRaceStages(prefix, name, days, profileType="mixed") {
  const arr=[];
  for (let i=1;i<=days;i++) {
    const isTT = i===1 && days>=5;
    const isMountain = profileType==="mountain" ? (i>days-3) : (i===days-1 || (days>6 && i===Math.ceil(days*0.65)));
    const isHilly = !isTT && !isMountain && i%3===0;
    const type = isTT ? "tt" : isMountain ? "mountain" : isHilly ? "hilly" : "flat";
    const dist = type==="tt" ? 22+days : type==="mountain" ? 145+((i*17)%45) : type==="hilly" ? 165+((i*13)%35) : 175+((i*11)%45);
    const climbs = type==="mountain" ? [climb("Puerto principal","1",Math.round(dist*0.65),10+((i*3)%8),6.5+((i%4)*0.6),13,1200+((i*123)%900)), climb("Final en alto", i===days-1?"HC":"1", dist, 8+((i*2)%8),7.2+((i%3)*0.7),15,1500+((i*101)%900))] : type==="hilly" ? [climb("Cota decisiva","3",Math.round(dist*0.82),3.2+(i%4),6.2,12,600)] : [];
    arr.push(stage(`${prefix}_${String(i).padStart(2,"0")}`, i, `${name} · Etapa ${i}`, type, dist, type==="mountain"?82:type==="hilly"?66:type==="tt"?65:38, {elevation:type==="mountain"?3600:type==="hilly"?2200:700, climbs, finalClimb:type==="mountain", tempC:18+((i*3)%12), rainMm:(i%4===0?2:0), windKmh:18+((i*7)%22), crosswindKmh:i%5===0?26:8}));
  }
  return arr;
}
function grandTourStages(prefix, label, heatBias=0, rainBias=0) {
  const base=[];
  for (let i=1;i<=21;i++) {
    const type = i===4 ? "ttt" : [1,3,6,10,12,16,21].includes(i)?"flat" : [11,19].includes(i)?"tt" : [7,9,14,15,17,18].includes(i)?"mountain" : i===5?"cobbles":"hilly";
    const dist = type==="tt"? (i===11?37:31) : type==="ttt"?41 : type==="mountain"? 138+((i*17)%65) : type==="cobbles"?204 : type==="hilly"? 150+((i*19)%50) : 170+((i*13)%45);
    const climbs = type==="mountain" ? [climb("Col largo","1",Math.round(dist*0.55),12+(i%8),6.8+(i%3),13,1400+(i*91)%900), climb("Final en alto", i%2?"HC":"1", dist, 9+(i%8),7.5+(i%3),16,1700+(i*137)%900)] : type==="hilly" ? [climb("Côte", "3", Math.round(dist*0.75), 3+(i%5), 5.8+(i%3), 11, 600+(i*53)%500)] : [];
    const paves = type==="cobbles" ? [pave("Bosque",64,68,4),pave("Granja",122,127,5),pave("Carrefour",184,190,5)] : [];
    const walls = type==="cobbles" ? [wall("Chapelle",187,1.6,10.2,17)] : (type==="hilly" && i%2===0 ? [wall("Muro final", dist-4, 1.2, 9.5, 16)] : []);
    base.push(stage(`${prefix}_${String(i).padStart(2,"0")}`, i, `${label} · Etapa ${i}`, type, dist, type==="mountain"?88+(i%10):type==="cobbles"?88:type==="hilly"?68:type==="tt"?70:type==="ttt"?62:36, {elevation:type==="mountain"?4200+(i%3)*350:type==="hilly"?2600:type==="cobbles"?2100:700, climbs, paves, walls, finalClimb:type==="mountain", tempC:20+heatBias+((i*2)%12), rainMm:rainBias+(i%5===0?2:0), windKmh:18+((i*5)%30), crosswindKmh:(i===1||i===3)?32:10, description:type==="tt"?"Crono individual: salida cada 2 minutos, sin rebufo.":type==="ttt"?"Crono por equipos: equipos cada 5 minutos, tiempo por 4º corredor.":""}));
  }
  return base;
}
const RACES = [
  race("tour_down_under","Santos Tour Down Under","2026-01-20","2026-01-25","stage_race","Australia",stageRaceStages("tdu","Tour Down Under",6,"mixed"),"Ocre","jersey-orange","2.UWT"),
  race("cadel_evans","Mapei Cadel Evans Great Ocean Road Race","2026-02-01","2026-02-01","classic","Australia",oneDayStage("cadel_evans","Cadel Evans Great Ocean Road Race","hilly",174,62,{tempC:25,windKmh:26}),"Ganador","jersey-blue","1.UWT"),
  race("uae_tour","UAE Tour","2026-02-16","2026-02-22","stage_race","UAE",stageRaceStages("uae_tour","UAE Tour",7,"mixed"),"Rojo","jersey-red","2.UWT"),
  race("omloop","Omloop Nieuwsblad ME","2026-02-28","2026-02-28","classic","Belgium",oneDayStage("omloop","Omloop Nieuwsblad","cobbles",204,82,{rainMm:3,windKmh:25,paves:[pave("Leberg",150,151,3)],walls:[wall("Muur",188,1.1,9,18)]}),"Ganador","jersey-cobbles","1.UWT"),
  race("strade_bianche","Strade Bianche","2026-03-07","2026-03-07","classic","Italy",oneDayStage("strade","Strade Bianche","cobbles",215,90,{elevation:3200,paves:[pave("Sterro 1",78,90,5),pave("Sterro 2",145,156,5)],walls:[wall("Santa Caterina",213,0.7,12,18)]}),"Ganador","jersey-white","1.UWT"),
  race("paris_nice","Paris-Nice","2026-03-08","2026-03-15","stage_race","France",stageRaceStages("paris_nice","Paris-Nice",8,"mixed"),"Amarillo","jersey-yellow","2.UWT"),
  race("tirreno","Tirreno-Adriatico","2026-03-09","2026-03-15","stage_race","Italy",stageRaceStages("tirreno","Tirreno-Adriatico",7,"mixed"),"Azul","jersey-blue","2.UWT"),
  race("sanremo","Milano-Sanremo","2026-03-21","2026-03-21","classic","Italy",oneDayStage("sanremo","Milano-Sanremo","hilly",289,78,{elevation:2100,climbs:[climb("Cipressa","3",268,5.6,4.1,9,239),climb("Poggio","3",284,3.7,3.7,8,160)]}),"Ganador","jersey-blue","1.UWT"),
  race("catalunya","Volta Ciclista a Catalunya","2026-03-23","2026-03-29","stage_race","Spain",stageRaceStages("catalunya","Volta a Catalunya",7,"mountain"),"Blanco-Verde","jersey-green","2.UWT"),
  race("bruges","Ronde Van Brugge - Tour of Bruges ME","2026-03-25","2026-03-25","classic","Belgium",oneDayStage("bruges","Tour of Bruges","flat",188,45,{windKmh:32,crosswindKmh:30,rainMm:1}),"Ganador","jersey-blue","1.UWT"),
  race("e3","E3 Saxo Classic ME","2026-03-27","2026-03-27","classic","Belgium",oneDayStage("e3","E3 Saxo Classic","cobbles",204,86,{paves:[pave("Kwaremont",160,162,4)],walls:[wall("Paterberg",185,0.4,12.9,20)]}),"Ganador","jersey-cobbles","1.UWT"),
  race("gent_wevelgem","In Flanders Fields - Middelkerke to Wevelgem","2026-03-29","2026-03-29","classic","Belgium",oneDayStage("gent","Gent-Wevelgem","cobbles",253,78,{windKmh:34,crosswindKmh:28,paves:[pave("Kemmel",210,212,4)]}),"Ganador","jersey-cobbles","1.UWT"),
  race("dwars","Dwars door Vlaanderen","2026-04-01","2026-04-01","classic","Belgium",oneDayStage("dwars","Dwars door Vlaanderen","cobbles",184,80,{paves:[pave("Sector pavé",130,136,4)],walls:[wall("Muro final",170,1.0,9,16)]}),"Ganador","jersey-cobbles","1.UWT"),
  race("flanders","Ronde van Vlaanderen ME","2026-04-05","2026-04-05","classic","Belgium",oneDayStage("flanders","Tour de Flandes","cobbles",272,96,{elevation:2900,paves:[pave("Oude Kwaremont",220,222,4),pave("Paterberg",247,248,5)],walls:[wall("Paterberg",247,0.4,12.9,20)]}),"Ganador","jersey-yellow","1.UWT"),
  race("itzulia","Itzulia Basque Country","2026-04-06","2026-04-11","stage_race","Spain",stageRaceStages("itzulia","Itzulia",6,"mountain"),"Amarillo","jersey-yellow","2.UWT"),
  race("roubaix","Paris-Roubaix Hauts-de-France","2026-04-12","2026-04-12","classic","France",oneDayStage("roubaix","Paris-Roubaix","cobbles",257,98,{rainMm:3,elevation:1600,paves:[pave("Arenberg",162,164,5),pave("Mons-en-Pévèle",207,210,5),pave("Carrefour de l'Arbre",240,242,5)]}),"Ganador","jersey-cobbles","1.UWT"),
  race("amstel","Amstel Gold Race","2026-04-19","2026-04-19","classic","Netherlands",oneDayStage("amstel","Amstel Gold Race","hilly",255,82,{elevation:3100,walls:[wall("Cauberg",248,0.9,8,13)]}),"Ganador","jersey-yellow","1.UWT"),
  race("fleche","La Flèche Wallonne","2026-04-22","2026-04-22","classic","Belgium",oneDayStage("fleche","La Flèche Wallonne","hilly",199,88,{walls:[wall("Mur de Huy",199,1.3,9.6,19)]}),"Ganador","jersey-red","1.UWT"),
  race("liege","Liège-Bastogne-Liège","2026-04-26","2026-04-26","classic","Belgium",oneDayStage("liege","Liège-Bastogne-Liège","hilly",259,94,{elevation:4100,walls:[wall("La Redoute",220,2.0,8.9,16),wall("Roche-aux-Faucons",242,1.3,11,18)]}),"Ganador","jersey-red","1.UWT"),
  race("romandie","Tour de Romandie","2026-04-28","2026-05-03","stage_race","Switzerland",stageRaceStages("romandie","Tour de Romandie",6,"mountain"),"Amarillo","jersey-yellow","2.UWT"),
  race("eschborn","Eschborn-Frankfurt","2026-05-01","2026-05-01","classic","Germany",oneDayStage("eschborn","Eschborn-Frankfurt","hilly",203,62,{elevation:2100}),"Ganador","jersey-blue","1.UWT"),
  race("giro","Giro d'Italia","2026-05-08","2026-05-31","grand_tour","Italy",grandTourStages("giro","Giro d'Italia",0,2),"Maglia rosa","jersey-pink","2.UWT"),
  race("dauphine","Tour Auvergne - Rhône-Alpes","2026-06-07","2026-06-14","stage_race","France",stageRaceStages("dauphine","Dauphiné",8,"mountain"),"Amarillo","jersey-yellow","2.UWT"),
  race("copenhagen","Copenhagen Sprint ME","2026-06-14","2026-06-14","classic","Denmark",oneDayStage("copenhagen","Copenhagen Sprint","flat",172,42,{windKmh:26,crosswindKmh:22}),"Ganador","jersey-blue","1.UWT"),
  race("suisse","Tour de Suisse","2026-06-17","2026-06-21","stage_race","Switzerland",stageRaceStages("suisse","Tour de Suisse",5,"mountain"),"Amarillo","jersey-yellow","2.UWT"),
  race("tour","Tour de France","2026-07-04","2026-07-26","grand_tour","France",grandTourStages("tour","Tour de France",1,0),"Maillot amarillo","jersey-yellow","2.UWT"),
  race("san_sebastian","DSSK Donostia San Sebastián Klasikoa","2026-08-01","2026-08-01","classic","Spain",oneDayStage("sanseb","San Sebastián Klasikoa","hilly",225,90,{elevation:3800,climbs:[climb("Jaizkibel","1",170,7.8,6.2,13,545),climb("Murgil",218,2.1,10,18,320)]}),"Ganador","jersey-blue","1.UWT"),
  race("pologne","Tour de Pologne","2026-08-03","2026-08-09","stage_race","Poland",stageRaceStages("pologne","Tour de Pologne",7,"mixed"),"Amarillo","jersey-yellow","2.UWT"),
  race("cyclassics","ADAC Cyclassics","2026-08-16","2026-08-16","classic","Germany",oneDayStage("cyclassics","ADAC Cyclassics","flat",205,48,{windKmh:28}),"Ganador","jersey-blue","1.UWT"),
  race("renewi","Renewi Tour","2026-08-19","2026-08-23","stage_race","Belgium/Netherlands",stageRaceStages("renewi","Renewi Tour",5,"mixed"),"Verde","jersey-green","2.UWT"),
  race("vuelta","La Vuelta Ciclista a España","2026-08-22","2026-09-13","grand_tour","Spain",grandTourStages("vuelta","La Vuelta",4,0),"Maillot rojo","jersey-red","2.UWT"),
  race("bretagne","Bretagne Classic - CIC","2026-08-30","2026-08-30","classic","France",oneDayStage("bretagne","Bretagne Classic","hilly",258,82,{elevation:3100}),"Ganador","jersey-blue","1.UWT"),
  race("quebec","Grand Prix Cycliste de Québec","2026-09-11","2026-09-11","classic","Canada",oneDayStage("quebec","GP Québec","hilly",201,78,{walls:[wall("Côte finale",198,1.0,8,13)]}),"Ganador","jersey-blue","1.UWT"),
  race("montreal","Grand Prix Cycliste de Montréal","2026-09-13","2026-09-13","classic","Canada",oneDayStage("montreal","GP Montréal","hilly",221,84,{elevation:3900,walls:[wall("Camillien-Houde",205,1.8,8,14)]}),"Ganador","jersey-blue","1.UWT"),
  race("lombardia","Il Lombardia","2026-10-10","2026-10-10","classic","Italy",oneDayStage("lombardia","Il Lombardia","hilly",253,95,{elevation:4400,climbs:[climb("Ghisallo","1",166,8.6,6.2,12,754),climb("Civiglio","1",235,4.2,9.7,15,620)]}),"Ganador","jersey-pink","1.UWT"),
  race("guangxi","Tour of Guangxi","2026-10-13","2026-10-18","stage_race","China",stageRaceStages("guangxi","Tour of Guangxi",6,"mixed"),"Rojo","jersey-red","2.UWT")
];
const SEASON_RACE_IDS = DEFAULT_SEASON_RACE_IDS;
const STAGES = RACES.find(r => r.id === DEFAULT_RACE_ID).stages;
