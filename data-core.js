/* ============================================================
   CYCLING MANAGER TOUR
   data-core.js
   v0.12 Pro Peloton + Chrono + Weather + Training Camps
   ============================================================ */

const SAVE_VERSION = "v0.12";
const ROSTER_SIZE = 8;
const PROFILE_RESOLUTION_KM = 1;

const TEAMS = [
  { id:"alpecin", name:"Alpecin - Premier Tech", level:"WT", country:"Belgium", rosterCount:30, archetype:"Clásicas / Sprint", color:"cyan", visual:{primary:"#0f172a",secondary:"#06b6d4",accent:"#ef4444",logoText:"ALPECIN"}, material:{frame:"canyon",wheels:"shimano"}, ai:{gc:22,sprint:96,classics:98,breakaway:74,control:58} },
  { id:"bahrain", name:"Bahrain - Victorious", level:"WT", country:"Bahrain", rosterCount:28, archetype:"Montaña / Clásicas", color:"red", visual:{primary:"#ef4444",secondary:"#ffffff",accent:"#111827",logoText:"BAHRAIN"}, material:{frame:"merida",wheels:"vision"}, ai:{gc:70,sprint:54,classics:72,breakaway:76,control:56} },
  { id:"decathlon", name:"Decathlon CMA CGM Team", level:"WT", country:"France", rosterCount:28, archetype:"Desarrollo / Montaña", color:"green", visual:{primary:"#10b981",secondary:"#0f172a",accent:"#f97316",logoText:"DECATHLON"}, material:{frame:"vanrysel",wheels:"swissside"}, ai:{gc:74,sprint:76,classics:70,breakaway:82,control:58} },
  { id:"ef", name:"EF Education - EasyPost", level:"WT", country:"United States", rosterCount:29, archetype:"Fugas / Clásicas", color:"pink", visual:{primary:"#ec4899",secondary:"#f97316",accent:"#ffffff",logoText:"EF"}, material:{frame:"cannondale",wheels:"vision"}, ai:{gc:58,sprint:62,classics:72,breakaway:88,control:46} },
  { id:"groupama", name:"Groupama - FDJ United", level:"WT", country:"France", rosterCount:29, archetype:"Sprint / Cantera", color:"blue", visual:{primary:"#2563eb",secondary:"#ffffff",accent:"#ef4444",logoText:"FDJ"}, material:{frame:"wilier",wheels:"shimano"}, ai:{gc:52,sprint:82,classics:66,breakaway:76,control:48} },
  { id:"lidl", name:"Lidl - Trek", level:"WT", country:"Germany", rosterCount:30, archetype:"Sprint / Clásicas / GC", color:"red", visual:{primary:"#0f172a",secondary:"#ef4444",accent:"#facc15",logoText:"LIDL TREK"}, material:{frame:"trek",wheels:"bontrager"}, ai:{gc:76,sprint:90,classics:88,breakaway:66,control:72} },
  { id:"lotto", name:"Lotto Intermarché", level:"WT", country:"Belgium", rosterCount:30, archetype:"Sprint / Fugas", color:"red", visual:{primary:"#ef4444",secondary:"#fbbf24",accent:"#ffffff",logoText:"LOTTO"}, material:{frame:"cube",wheels:"newmen"}, ai:{gc:44,sprint:88,classics:72,breakaway:82,control:50} },
  { id:"movistar", name:"Movistar Team", level:"WT", country:"Spain", rosterCount:28, archetype:"Montaña / Etapas", color:"blue", visual:{primary:"#2563eb",secondary:"#22c55e",accent:"#ffffff",logoText:"MOVISTAR"}, material:{frame:"canyon",wheels:"zipp"}, ai:{gc:76,sprint:42,classics:58,breakaway:86,control:52} },
  { id:"ineos", name:"Netcompany INEOS", level:"WT", country:"Great Britain", rosterCount:29, archetype:"Crono / GC", color:"red", visual:{primary:"#d91e36",secondary:"#111827",accent:"#ffffff",logoText:"INEOS"}, material:{frame:"pinarello",wheels:"shimano"}, ai:{gc:84,sprint:28,classics:55,breakaway:42,control:78} },
  { id:"nsn", name:"NSN Cycling Team", level:"WT", country:"Spain", rosterCount:31, archetype:"GC / Proyección", color:"purple", visual:{primary:"#7c3aed",secondary:"#0f172a",accent:"#22c55e",logoText:"NSN"}, material:{frame:"factor",wheels:"blackinc"}, ai:{gc:72,sprint:54,classics:64,breakaway:70,control:55} },
  { id:"redbull", name:"Red Bull - BORA - hansgrohe", level:"WT", country:"Germany", rosterCount:30, archetype:"GC / Potencia", color:"orange", visual:{primary:"#0f172a",secondary:"#f59e0b",accent:"#ef4444",logoText:"RED BULL"}, material:{frame:"specialized",wheels:"roval"}, ai:{gc:94,sprint:58,classics:68,breakaway:54,control:82} },
  { id:"soudal", name:"Soudal Quick-Step", level:"WT", country:"Belgium", rosterCount:30, archetype:"Sprint / Clásicas", color:"blue", visual:{primary:"#2563eb",secondary:"#ffffff",accent:"#ef4444",logoText:"SOUDAL"}, material:{frame:"specialized",wheels:"roval"}, ai:{gc:66,sprint:88,classics:82,breakaway:58,control:66} },
  { id:"jayco", name:"Team Jayco AlUla", level:"WT", country:"Australia", rosterCount:29, archetype:"Sprint / Etapas", color:"blue", visual:{primary:"#2563eb",secondary:"#ffffff",accent:"#f59e0b",logoText:"JAYCO"}, material:{frame:"giant",wheels:"cadex"}, ai:{gc:56,sprint:84,classics:66,breakaway:74,control:52} },
  { id:"picnic", name:"Team Picnic PostNL", level:"WT", country:"Netherlands", rosterCount:28, archetype:"Desarrollo / Sprint", color:"orange", visual:{primary:"#f97316",secondary:"#ffffff",accent:"#0f172a",logoText:"PICNIC"}, material:{frame:"scott",wheels:"syncros"}, ai:{gc:50,sprint:78,classics:66,breakaway:76,control:46} },
  { id:"visma", name:"Team Visma | Lease a Bike", level:"WT", country:"Netherlands", rosterCount:29, archetype:"GC / Bloque", color:"yellow", visual:{primary:"#facc15",secondary:"#111827",accent:"#2563eb",logoText:"VISMA"}, material:{frame:"cervelo",wheels:"reserve"}, ai:{gc:96,sprint:62,classics:78,breakaway:54,control:94} },
  { id:"uae", name:"UAE Team Emirates - XRG", level:"WT", country:"United Arab Emirates", rosterCount:30, archetype:"Superteam / GC", color:"green", visual:{primary:"#00843d",secondary:"#ffffff",accent:"#d32f2f",logoText:"UAE"}, material:{frame:"colnago",wheels:"enve"}, ai:{gc:98,sprint:42,classics:72,breakaway:48,control:92} },
  { id:"unox", name:"Uno-X Mobility", level:"WT", country:"Norway", rosterCount:30, archetype:"Clásicas / Fugas", color:"yellow", visual:{primary:"#facc15",secondary:"#ef4444",accent:"#0f172a",logoText:"UNO-X"}, material:{frame:"dare",wheels:"dt_swiss"}, ai:{gc:50,sprint:76,classics:78,breakaway:88,control:44} },
  { id:"astana", name:"XDS Astana Team", level:"WT", country:"Kazakhstan", rosterCount:30, archetype:"Sprint / Fugas", color:"cyan", visual:{primary:"#22d3ee",secondary:"#0f172a",accent:"#facc15",logoText:"ASTANA"}, material:{frame:"xds",wheels:"xds"}, ai:{gc:48,sprint:78,classics:62,breakaway:86,control:42} },
  { id:"bardiani", name:"Bardiani CSF 7 Saber", level:"PRT", country:"Italy", rosterCount:23, archetype:"Fugas / Jóvenes", color:"green", visual:{primary:"#16a34a",secondary:"#ffffff",accent:"#ef4444",logoText:"BARDIANI"}, material:{frame:"de_rosa",wheels:"fulcrum"}, ai:{gc:30,sprint:58,classics:54,breakaway:90,control:30} },
  { id:"burgos", name:"Burgos Burpellet BH", level:"PRT", country:"Spain", rosterCount:24, archetype:"Montaña-Fugas", color:"pink", visual:{primary:"#ffffff",secondary:"#ec4899",accent:"#7c3aed",logoText:"BURGOS BH"}, material:{frame:"bh",wheels:"vision"}, ai:{gc:42,sprint:46,classics:58,breakaway:94,control:30} },
  { id:"caja", name:"Caja Rural - Seguros RGA", level:"PRT", country:"Spain", rosterCount:26, archetype:"Sprint / Fugas", color:"green", visual:{primary:"#0f7d45",secondary:"#ffffff",accent:"#d9a441",logoText:"CAJA RURAL"}, material:{frame:"mmr",wheels:"vision"}, ai:{gc:38,sprint:72,classics:56,breakaway:92,control:34} },
  { id:"cofidis", name:"Cofidis", level:"PRT", country:"France", rosterCount:30, archetype:"Sprint / Etapas", color:"red", visual:{primary:"#ef4444",secondary:"#ffffff",accent:"#111827",logoText:"COFIDIS"}, material:{frame:"look",wheels:"corima"}, ai:{gc:44,sprint:78,classics:62,breakaway:82,control:42} },
  { id:"kern", name:"Equipo Kern Pharma", level:"PRT", country:"Spain", rosterCount:22, archetype:"Cantera / Montaña", color:"green", visual:{primary:"#22c55e",secondary:"#ffffff",accent:"#dc2626",logoText:"KERN"}, material:{frame:"giant",wheels:"cadex"}, ai:{gc:46,sprint:42,classics:54,breakaway:94,control:30} },
  { id:"euskaltel", name:"Euskaltel - Euskadi", level:"PRT", country:"Spain", rosterCount:22, archetype:"Cantera / Fugas", color:"orange", visual:{primary:"#f97316",secondary:"#fb7185",accent:"#111827",logoText:"EUSKALTEL"}, material:{frame:"orbea",wheels:"orbea"}, ai:{gc:36,sprint:30,classics:62,breakaway:96,control:28} },
  { id:"mbh", name:"MBH Bank CSB Telecom Fort", level:"PRT", country:"Hungary", rosterCount:21, archetype:"Fugas / Desarrollo", color:"blue", visual:{primary:"#1d4ed8",secondary:"#ffffff",accent:"#f59e0b",logoText:"MBH"}, material:{frame:"colnago",wheels:"fulcrum"}, ai:{gc:26,sprint:48,classics:46,breakaway:82,control:24} },
  { id:"modern", name:"Modern Adventure Pro Cycling", level:"PRT", country:"United States", rosterCount:21, archetype:"Desarrollo / Fugas", color:"black", visual:{primary:"#111827",secondary:"#22c55e",accent:"#ffffff",logoText:"MODERN"}, material:{frame:"cannondale",wheels:"vision"}, ai:{gc:30,sprint:52,classics:52,breakaway:84,control:28} },
  { id:"q36", name:"Pinarello Q36.5 Pro Cycling Team", level:"PRT", country:"Switzerland", rosterCount:30, archetype:"GC / Clásicas", color:"black", visual:{primary:"#111827",secondary:"#e5e7eb",accent:"#38bdf8",logoText:"Q36.5"}, material:{frame:"pinarello",wheels:"most"}, ai:{gc:68,sprint:58,classics:74,breakaway:78,control:50} },
  { id:"solution", name:"Solution Tech NIPPO Rali", level:"PRT", country:"Italy", rosterCount:23, archetype:"Fugas", color:"purple", visual:{primary:"#7c3aed",secondary:"#ffffff",accent:"#ef4444",logoText:"NIPPO"}, material:{frame:"de_rosa",wheels:"mavic"}, ai:{gc:28,sprint:54,classics:52,breakaway:88,control:26} },
  { id:"flanders", name:"Team Flanders - Baloise", level:"PRT", country:"Belgium", rosterCount:20, archetype:"Pavé / Fugas", color:"yellow", visual:{primary:"#facc15",secondary:"#111827",accent:"#ef4444",logoText:"FLANDERS"}, material:{frame:"eddy_merckx",wheels:"dt_swiss"}, ai:{gc:18,sprint:54,classics:72,breakaway:92,control:24} },
  { id:"novo", name:"Team Novo Nordisk", level:"PRT", country:"United States", rosterCount:21, archetype:"Fugas / Desarrollo", color:"blue", visual:{primary:"#2563eb",secondary:"#ffffff",accent:"#22c55e",logoText:"NOVO"}, material:{frame:"colnago",wheels:"vision"}, ai:{gc:16,sprint:46,classics:44,breakaway:86,control:18} },
  { id:"polti", name:"Team Polti VisitMalta", level:"PRT", country:"Italy", rosterCount:24, archetype:"Sprint / Fugas", color:"red", visual:{primary:"#ef4444",secondary:"#ffffff",accent:"#16a34a",logoText:"POLTI"}, material:{frame:"aurum",wheels:"fulcrum"}, ai:{gc:32,sprint:68,classics:58,breakaway:88,control:34} },
  { id:"total", name:"TotalEnergies", level:"PRT", country:"France", rosterCount:31, archetype:"Clásicas / Sprint", color:"blue", visual:{primary:"#2563eb",secondary:"#ffffff",accent:"#ef4444",logoText:"TOTAL"}, material:{frame:"enve",wheels:"enve"}, ai:{gc:38,sprint:72,classics:78,breakaway:82,control:38} },
  { id:"tudor", name:"Tudor Pro Cycling Team", level:"PRT", country:"Switzerland", rosterCount:31, archetype:"Clásicas / Crono", color:"black", visual:{primary:"#111827",secondary:"#ffffff",accent:"#ef4444",logoText:"TUDOR"}, material:{frame:"bmc",wheels:"dt_swiss"}, ai:{gc:52,sprint:68,classics:82,breakaway:76,control:46} },
  { id:"unibet", name:"Unibet Rose Rockets", level:"PRT", country:"Netherlands", rosterCount:30, archetype:"Fugas / Sprint", color:"pink", visual:{primary:"#ec4899",secondary:"#111827",accent:"#22c55e",logoText:"ROCKETS"}, material:{frame:"orbea",wheels:"dt_swiss"}, ai:{gc:26,sprint:66,classics:60,breakaway:88,control:26} }
];

const ROLE_TEMPLATES = {
  gc:{label:"Líder GC",defaultOrder:"hold",defaultEffort:68,stats:{flat:80,sprint:62,mountain:91,hills:85,cobbles:64,tt:84,ttt:84,stamina:91,recovery:89,acceleration:78,positioning:82,downhill:82}},
  co:{label:"Co-líder",defaultOrder:"hold",defaultEffort:66,stats:{flat:79,sprint:62,mountain:86,hills:82,cobbles:64,tt:80,ttt:82,stamina:87,recovery:85,acceleration:76,positioning:80,downhill:80}},
  climber:{label:"Escalador",defaultOrder:"hold",defaultEffort:64,stats:{flat:70,sprint:52,mountain:88,hills:80,cobbles:54,tt:68,ttt:70,stamina:86,recovery:84,acceleration:76,positioning:73,downhill:80}},
  tt:{label:"Croner",defaultOrder:"pull",defaultEffort:72,stats:{flat:87,sprint:60,mountain:70,hills:74,cobbles:66,tt:90,ttt:90,stamina:85,recovery:80,acceleration:68,positioning:78,downhill:74}},
  sprinter:{label:"Sprinter",defaultOrder:"sit",defaultEffort:50,stats:{flat:87,sprint:91,mountain:50,hills:68,cobbles:70,tt:65,ttt:72,stamina:76,recovery:74,acceleration:93,positioning:89,downhill:70}},
  classics:{label:"Clasicómano",defaultOrder:"hold",defaultEffort:66,stats:{flat:84,sprint:78,mountain:68,hills:84,cobbles:87,tt:74,ttt:78,stamina:84,recovery:80,acceleration:84,positioning:88,downhill:78}},
  rouleur:{label:"Rodador",defaultOrder:"pull",defaultEffort:72,stats:{flat:87,sprint:66,mountain:68,hills:74,cobbles:74,tt:80,ttt:85,stamina:85,recovery:80,acceleration:70,positioning:80,downhill:74}},
  domestique:{label:"Gregario",defaultOrder:"protect",defaultEffort:64,stats:{flat:78,sprint:60,mountain:77,hills:76,cobbles:66,tt:73,ttt:78,stamina:84,recovery:80,acceleration:70,positioning:78,downhill:76}},
  puncheur:{label:"Puncheur",defaultOrder:"hold",defaultEffort:68,stats:{flat:79,sprint:76,mountain:76,hills:88,cobbles:72,tt:73,ttt:75,stamina:82,recovery:79,acceleration:88,positioning:82,downhill:78}}
};

const FRAME_BRANDS = [
  {id:"colnago",name:"Colnago",aero:96,weight:94,stiffness:97,comfort:88,handling:93,cobbles:84,tt:88,reliability:94},
  {id:"cervelo",name:"Cervélo",aero:98,weight:93,stiffness:95,comfort:87,handling:92,cobbles:83,tt:97,reliability:93},
  {id:"pinarello",name:"Pinarello",aero:97,weight:92,stiffness:98,comfort:87,handling:96,cobbles:84,tt:95,reliability:94},
  {id:"canyon",name:"Canyon",aero:97,weight:94,stiffness:95,comfort:88,handling:92,cobbles:86,tt:95,reliability:93},
  {id:"specialized",name:"Specialized",aero:99,weight:95,stiffness:96,comfort:90,handling:94,cobbles:86,tt:94,reliability:95},
  {id:"trek",name:"Trek",aero:95,weight:93,stiffness:94,comfort:91,handling:93,cobbles:89,tt:91,reliability:95},
  {id:"merida",name:"Merida",aero:94,weight:92,stiffness:94,comfort:89,handling:91,cobbles:86,tt:90,reliability:94},
  {id:"vanrysel",name:"Van Rysel",aero:93,weight:91,stiffness:92,comfort:88,handling:90,cobbles:84,tt:88,reliability:91},
  {id:"mmr",name:"MMR",aero:90,weight:93,stiffness:91,comfort:87,handling:89,cobbles:82,tt:85,reliability:90},
  {id:"bh",name:"BH",aero:91,weight:94,stiffness:92,comfort:88,handling:90,cobbles:83,tt:86,reliability:91},
  {id:"orbea",name:"Orbea",aero:92,weight:93,stiffness:92,comfort:89,handling:91,cobbles:84,tt:87,reliability:92},
  {id:"aurum",name:"Aurum",aero:92,weight:92,stiffness:92,comfort:88,handling:90,cobbles:83,tt:87,reliability:90},
  {id:"cannondale",name:"Cannondale",aero:94,weight:92,stiffness:93,comfort:89,handling:91,cobbles:85,tt:89,reliability:92},
  {id:"wilier",name:"Wilier",aero:94,weight:93,stiffness:93,comfort:87,handling:91,cobbles:83,tt:89,reliability:91},
  {id:"giant",name:"Giant",aero:94,weight:92,stiffness:93,comfort:89,handling:91,cobbles:85,tt:90,reliability:94},
  {id:"scott",name:"Scott",aero:95,weight:93,stiffness:94,comfort:88,handling:91,cobbles:84,tt:91,reliability:93},
  {id:"factor",name:"Factor",aero:96,weight:92,stiffness:94,comfort:87,handling:91,cobbles:82,tt:93,reliability:91},
  {id:"cube",name:"Cube",aero:93,weight:91,stiffness:92,comfort:88,handling:90,cobbles:84,tt:88,reliability:91},
  {id:"xds",name:"XDS",aero:90,weight:90,stiffness:90,comfort:86,handling:88,cobbles:82,tt:85,reliability:88},
  {id:"de_rosa",name:"De Rosa",aero:89,weight:91,stiffness:90,comfort:88,handling:90,cobbles:83,tt:84,reliability:89},
  {id:"look",name:"Look",aero:92,weight:91,stiffness:93,comfort:88,handling:90,cobbles:84,tt:88,reliability:91},
  {id:"eddy_merckx",name:"Eddy Merckx",aero:89,weight:89,stiffness:90,comfort:89,handling:90,cobbles:88,tt:82,reliability:90},
  {id:"enve",name:"ENVE",aero:95,weight:92,stiffness:94,comfort:89,handling:91,cobbles:85,tt:91,reliability:93},
  {id:"bmc",name:"BMC",aero:94,weight:92,stiffness:93,comfort:90,handling:92,cobbles:86,tt:90,reliability:93}
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
  {id:"mavic",name:"Mavic",aero:90,weight:91,stiffness:91,crosswind:91,cobbles:88,tt:86,reliability:93},
  {id:"cadex",name:"CADEX",aero:95,weight:93,stiffness:94,crosswind:90,cobbles:85,tt:92,reliability:92},
  {id:"syncros",name:"Syncros",aero:92,weight:91,stiffness:91,crosswind:89,cobbles:84,tt:88,reliability:91},
  {id:"newmen",name:"Newmen",aero:91,weight:91,stiffness:91,crosswind:90,cobbles:85,tt:86,reliability:91},
  {id:"blackinc",name:"Black Inc",aero:95,weight:92,stiffness:94,crosswind:88,cobbles:84,tt:94,reliability:90},
  {id:"xds",name:"XDS Wheels",aero:88,weight:88,stiffness:88,crosswind:87,cobbles:82,tt:83,reliability:87},
  {id:"corima",name:"Corima",aero:94,weight:90,stiffness:92,crosswind:88,cobbles:83,tt:93,reliability:90},
  {id:"most",name:"Most",aero:93,weight:91,stiffness:93,crosswind:88,cobbles:83,tt:92,reliability:90}
];

const EQUIPMENT_PRESETS = [
  {id:"auto",name:"Auto según etapa",frameType:"auto",wheelType:"auto"},
  {id:"flat",name:"Llano aero",frameType:"aero",wheelType:"deep"},
  {id:"mountain",name:"Montaña",frameType:"light",wheelType:"light"},
  {id:"hilly",name:"Media montaña",frameType:"light",wheelType:"mid"},
  {id:"cobbles",name:"Pavé",frameType:"endurance",wheelType:"cobbles"},
  {id:"tt",name:"Crono",frameType:"tt",wheelType:"disc"},
  {id:"rain",name:"Seguro lluvia",frameType:"endurance",wheelType:"mid"}
];

const RIDER_ORDERS = [
  {id:"sit",name:"Ir a rueda",desc:"Gasta poco. No tira. Puede quedarse si el grupo acelera.",pull:0,attack:0,energy:0.72},
  {id:"hold",name:"Mantener posición",desc:"Rueda en el grupo sin forzar.",pull:0.15,attack:0,energy:1.00},
  {id:"protect",name:"Proteger líder",desc:"Reduce riesgo de corte del líder y aporta apoyo.",pull:0.30,attack:0,energy:1.18},
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

const TTT_CONTROLS = {
  rotationIntensity:{min:40,max:100,default:78,label:"Intensidad de relevos"},
  pullDuration:{values:["corto","medio","largo"],default:"medio",label:"Duración de relevo"},
  formation:{values:["conservadora","equilibrada","agresiva"],default:"equilibrada",label:"Formación"},
  protectWeak:{default:true,label:"Esperar al 4º corredor"}
};

const NUTRITION_ITEMS = [
  {id:"gel",name:"Gel",description:"Energía rápida.",energy:22,hydration:0,stomach:8,finalBonus:0},
  {id:"bar",name:"Barrita",description:"Energía lenta y estable.",energy:28,hydration:-2,stomach:14,finalBonus:0},
  {id:"iso",name:"Isotónico",description:"Energía e hidratación.",energy:14,hydration:22,stomach:5,finalBonus:0},
  {id:"caf",name:"Gel cafeína",description:"Extra para final o ataque.",energy:18,hydration:-2,stomach:10,finalBonus:3},
  {id:"rice",name:"Rice cake",description:"Energía estable con poca agresividad.",energy:18,hydration:0,stomach:9,finalBonus:0},
  {id:"water",name:"Agua",description:"Hidratación sin carga energética.",energy:2,hydration:28,stomach:2,finalBonus:0}
];

const NUTRITION_PLANS = [
  {id:"balanced",name:"Coche completo",stock:{gel:120,bar:80,iso:160,caf:50,rice:80,water:220}},
  {id:"mountain",name:"Montaña",stock:{gel:170,bar:70,iso:170,caf:70,rice:70,water:220}},
  {id:"hot",name:"Calor",stock:{gel:130,bar:60,iso:220,caf:50,rice:60,water:300}},
  {id:"classic",name:"Clásica dura",stock:{gel:150,bar:90,iso:180,caf:70,rice:80,water:230}}
];

const AUTO_NUTRITION_MODES = [
  {id:"auto_smart",name:"Automático inteligente",description:"Mantiene energía e hidratación en rango estable."},
  {id:"auto_conservative",name:"Automático conservador",description:"Come antes. Menos pájaras, más gasto de stock."},
  {id:"auto_aggressive",name:"Automático agresivo",description:"Reserva geles/cafeína para puertos, ataques y finales."},
  {id:"manual",name:"Manual",description:"Tú decides cuándo come cada corredor."}
];

const TRAINING_OPTIONS = [
  {id:"recovery",name:"Microciclo recuperación",location:"Casa / Centro equipo",days:5,description:"Baja fatiga y mantiene forma.",effects:{fatigue:-20,form:0,morale:2}},
  {id:"altitude_teide",name:"Training camp altura",location:"Teide",days:18,description:"Gran mejora aeróbica para vueltas y montaña.",effects:{mountain:2,stamina:2,recovery:1,form:3,fatigue:10}},
  {id:"altitude_sierra",name:"Training camp altura",location:"Sierra Nevada",days:16,description:"Bloque de puertos y resistencia al calor.",effects:{mountain:2,downhill:1,stamina:2,form:3,fatigue:9}},
  {id:"altitude_livigno",name:"Training camp altura",location:"Livigno",days:16,description:"Altura + fondo sostenido.",effects:{stamina:2,recovery:2,mountain:1,form:2,fatigue:8}},
  {id:"altitude_andorra",name:"Training camp altura",location:"Andorra",days:14,description:"Puertos, técnica de bajada y explosividad.",effects:{mountain:1,hills:1,downhill:2,acceleration:1,form:2,fatigue:8}},
  {id:"calpe_base",name:"Base aeróbica",location:"Calpe",days:12,description:"Fondo, trabajo suave y días largos.",effects:{stamina:2,recovery:1,flat:1,form:2,fatigue:6}},
  {id:"mallorca_sprint",name:"Sprint camp",location:"Mallorca",days:9,description:"Velocidad, lanzamientos y colocación.",effects:{sprint:2,acceleration:2,positioning:1,form:2,fatigue:7}},
  {id:"girona_hills",name:"Colinas y punch",location:"Girona",days:10,description:"Muros cortos, cambios de ritmo y media montaña.",effects:{hills:2,acceleration:1,mountain:1,form:2,fatigue:7}},
  {id:"flanders_classics",name:"Camp de clásicas",location:"Flandes",days:8,description:"Pavé, abanicos, colocación y muros.",effects:{cobbles:2,hills:1,positioning:2,stamina:1,form:2,fatigue:8}},
  {id:"roubaix_cobbles",name:"Recon pavé",location:"Roubaix / Arenberg",days:5,description:"Reduce riesgo en pavés y mejora comfort técnico.",effects:{cobbles:2,positioning:1,downhill:1,form:1,fatigue:5}},
  {id:"tt_aero",name:"Bloque aero/CRI",location:"Túnel + velódromo",days:7,description:"Postura, potencia sostenida y material.",effects:{tt:2,ttt:2,flat:1,positioning:1,form:2,fatigue:6}},
  {id:"team_ttt",name:"Camp CRE",location:"Circuito cerrado",days:6,description:"Relevos, rotación y cohesión de equipo.",effects:{ttt:3,flat:1,positioning:1,form:2,fatigue:6}},
  {id:"heat",name:"Aclimatación calor",location:"Alicante / Algarve",days:7,description:"Mejora hidratación y tolerancia al calor.",effects:{stamina:1,recovery:1,form:1,heatTolerance:2,fatigue:5}},
  {id:"race_sharpness",name:"Puesta a punto",location:"Pre-carrera",days:4,description:"Sube forma sin mucha fatiga.",effects:{form:3,acceleration:1,fatigue:3}},
  {id:"development",name:"Bloque desarrollo",location:"Sub-23 / Laboratorio",days:20,description:"Mejora lenta de jóvenes y base técnica.",effects:{stamina:1,tt:1,hills:1,form:1,fatigue:8}}
];

const CLASSIFICATION_RULES = {
  youthMaxAge:25,
  teamClassificationBestRiders:3,
  finishBonuses:[10,6,4],
  pointsByStageType:{flat:[50,30,20,18,16,14,12,10,8,7],hilly:[35,25,20,17,15,13,11,9,7,6],mountain:[25,20,16,14,12,10,8,6,4,2],cobbles:[35,25,20,17,15,13,11,9,7,6],tt:[20,17,15,13,11,9,7,5,3,1],ttt:[20,17,15,13,11,9,7,5,3,1]},
  mountainPoints:{HC:[20,15,12,10,8,6,4,2],"1":[10,8,6,4,2,1],"2":[5,3,2,1],"3":[2,1],"4":[1]},
  uci:{grandTourStage:[120,50,25,15,5],grandTourFinalGC:[1300,1040,880,730,620,520,425,325,275,225,175,150,125,105,85],oneDay:[500,400,325,275,225,175,150,125,100,85],majorTourGC:[500,400,325,275,225,175,150,125,100,85]}
};
