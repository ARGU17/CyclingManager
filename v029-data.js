/* ============================================================
   CYCLING MANAGER TOUR v0.29 · CLUB HQ & SPONSORS
   Catálogos de sedes, instalaciones, bases, patrocinadores y marca.
   Todos los nombres comerciales no marcados como "historical" son
   ficticios y se usan únicamente como contenido de simulación.
   ============================================================ */

const V029_VERSION = "v0.29-club-hq-sponsors";

const V029_HEADQUARTERS = [
  {id:"girona",city:"Girona",country:"España",region:"Cataluña",costIndex:78,connectivity:82,terrain:94,climate:91,commercial:74,talent:86,qualityOfLife:92,cyclingCulture:93,science:79,altitude:54,opex:1450000,relocationCost:2800000,specialties:["Terreno variado","Clima estable","Pelotón internacional"]},
  {id:"san_sebastian",city:"San Sebastián",country:"España",region:"Euskadi",costIndex:76,connectivity:71,terrain:96,climate:68,commercial:73,talent:91,qualityOfLife:93,cyclingCulture:98,science:81,altitude:48,opex:1390000,relocationCost:2650000,specialties:["Montaña","Clásicas","Identidad regional"]},
  {id:"oudenaarde",city:"Oudenaarde",country:"Bélgica",region:"Flandes",costIndex:67,connectivity:78,terrain:86,climate:59,commercial:84,talent:94,qualityOfLife:77,cyclingCulture:100,science:76,altitude:12,opex:1240000,relocationCost:2350000,specialties:["Pavé","Clásicas","Patrocinio belga"]},
  {id:"andorra",city:"Andorra la Vella",country:"Andorra",region:"Pirineos",costIndex:84,connectivity:48,terrain:100,climate:78,commercial:61,talent:82,qualityOfLife:86,cyclingCulture:88,science:63,altitude:98,opex:1520000,relocationCost:3100000,specialties:["Altitud","Montaña","Concentraciones"]},
  {id:"nice",city:"Niza",country:"Francia",region:"Provenza-Alpes-Costa Azul",costIndex:91,connectivity:93,terrain:94,climate:94,commercial:88,talent:84,qualityOfLife:95,cyclingCulture:85,science:83,altitude:42,opex:1780000,relocationCost:3450000,specialties:["Aeropuerto","Montaña y costa","Imagen premium"]},
  {id:"eindhoven",city:"Eindhoven",country:"Países Bajos",region:"Brabante Septentrional",costIndex:74,connectivity:88,terrain:44,climate:63,commercial:96,talent:87,qualityOfLife:88,cyclingCulture:90,science:99,altitude:8,opex:1510000,relocationCost:2950000,specialties:["Tecnología","Datos","Aerodinámica"]},
  {id:"manchester",city:"Manchester",country:"Reino Unido",region:"Greater Manchester",costIndex:79,connectivity:91,terrain:66,climate:52,commercial:90,talent:83,qualityOfLife:78,cyclingCulture:87,science:94,altitude:20,opex:1610000,relocationCost:3200000,specialties:["Velódromo","Biomecánica","Tecnología"]},
  {id:"innsbruck",city:"Innsbruck",country:"Austria",region:"Tirol",costIndex:82,connectivity:75,terrain:99,climate:72,commercial:75,talent:80,qualityOfLife:94,cyclingCulture:84,science:85,altitude:78,opex:1540000,relocationCost:3050000,specialties:["Alpes","Altitud moderada","Centroeuropa"]},
  {id:"dubai",city:"Dubái",country:"Emiratos Árabes Unidos",region:"Dubái",costIndex:94,connectivity:100,terrain:28,climate:66,commercial:100,talent:56,qualityOfLife:86,cyclingCulture:55,science:87,altitude:2,opex:1980000,relocationCost:4300000,specialties:["Capital","Calor","Conectividad global"]},
  {id:"bogota",city:"Bogotá",country:"Colombia",region:"Cundinamarca",costIndex:47,connectivity:83,terrain:98,climate:75,commercial:71,talent:99,qualityOfLife:70,cyclingCulture:96,science:72,altitude:100,opex:920000,relocationCost:3900000,specialties:["Altitud","Escaladores","Mercado latinoamericano"]},
  {id:"milan",city:"Milán",country:"Italia",region:"Lombardía",costIndex:88,connectivity:97,terrain:81,climate:76,commercial:98,talent:91,qualityOfLife:84,cyclingCulture:96,science:92,altitude:26,opex:1810000,relocationCost:3500000,specialties:["Industria ciclista","Patrocinio","Calendario italiano"]},
  {id:"grenoble",city:"Grenoble",country:"Francia",region:"Auvernia-Ródano-Alpes",costIndex:69,connectivity:73,terrain:100,climate:73,commercial:73,talent:88,qualityOfLife:85,cyclingCulture:89,science:96,altitude:71,opex:1320000,relocationCost:2700000,specialties:["Alpes","Universidades","Fisiología"]},
  {id:"munich",city:"Múnich",country:"Alemania",region:"Baviera",costIndex:96,connectivity:100,terrain:77,climate:70,commercial:100,talent:79,qualityOfLife:96,cyclingCulture:75,science:98,altitude:58,opex:2050000,relocationCost:3950000,specialties:["Industria","Tecnología","Mercado alemán"]},
  {id:"bilbao",city:"Bilbao",country:"España",region:"Euskadi",costIndex:70,connectivity:80,terrain:95,climate:64,commercial:82,talent:92,qualityOfLife:89,cyclingCulture:97,science:83,altitude:39,opex:1360000,relocationCost:2600000,specialties:["Muros","Industria","Afición"]},
  {id:"copenhagen",city:"Copenhague",country:"Dinamarca",region:"Hovedstaden",costIndex:98,connectivity:96,terrain:38,climate:57,commercial:97,talent:90,qualityOfLife:98,cyclingCulture:100,science:95,altitude:5,opex:2120000,relocationCost:4050000,specialties:["Cultura ciclista","Datos","Talento nórdico"]},
  {id:"zurich",city:"Zúrich",country:"Suiza",region:"Zúrich",costIndex:100,connectivity:99,terrain:88,climate:71,commercial:100,talent:78,qualityOfLife:100,cyclingCulture:82,science:100,altitude:61,opex:2350000,relocationCost:4500000,specialties:["Finanzas","Ciencia","Conectividad"]},
  {id:"lisbon",city:"Lisboa",country:"Portugal",region:"Lisboa",costIndex:64,connectivity:92,terrain:73,climate:96,commercial:79,talent:75,qualityOfLife:91,cyclingCulture:70,science:77,altitude:18,opex:1180000,relocationCost:2450000,specialties:["Clima","Coste","Expansión ibérica"]},
  {id:"adelaide",city:"Adelaida",country:"Australia",region:"Australia Meridional",costIndex:76,connectivity:75,terrain:87,climate:92,commercial:77,talent:78,qualityOfLife:93,cyclingCulture:86,science:82,altitude:34,opex:1480000,relocationCost:4800000,specialties:["Calor","Pretemporada","Asia-Pacífico"]}
];

const V029_FACILITIES = [
  {id:"performance",name:"Centro de rendimiento",icon:"⚡",baseCost:400000,levelFactor:2.05,baseOpex:80000,weeks:8,max:5,capacity:[0,4,8,16,24,36],description:"Tests de CP/W′, VO₂max, lactato, calor, hipoxia y planificación de picos.",effects:{training:2,form:2,forecast:2,recovery:1}},
  {id:"medical_center",name:"Centro médico y recuperación",icon:"✚",baseCost:250000,levelFactor:2.15,baseOpex:70000,weeks:7,max:5,capacity:[0,4,8,16,24,36],description:"Diagnóstico, fisioterapia, sueño, rehabilitación y prevención longitudinal.",effects:{medical:3,recovery:2,fatigue:-1,injuryRisk:-2}},
  {id:"technical_workshop",name:"Taller técnico y almacén",icon:"🔧",baseCost:300000,levelFactor:1.92,baseOpex:65000,weeks:7,max:5,capacity:[0,12,24,48,72,120],description:"Montaje, mantenimiento preventivo, repuestos, flota de bicicletas y control de calidad.",effects:{reliability:3,equipment:2,repair:2,cobbles:1}},
  {id:"aero_center",name:"Centro aero e ingeniería",icon:"◁",baseCost:750000,levelFactor:2.10,baseOpex:140000,weeks:12,max:5,capacity:[0,2,6,12,20,32],description:"Bike fitting, CFD, velódromo, pruebas Chung, túnel compartido y túnel propio.",effects:{aero:3,ttt:2,pacing:2,comfort:1}},
  {id:"nutrition_center",name:"Centro de nutrición",icon:"◉",baseCost:280000,levelFactor:1.88,baseOpex:60000,weeks:6,max:5,capacity:[0,8,16,24,32,45],description:"Cocina, composición corporal, hidratación, tolerancia de carbohidratos y menús de viaje.",effects:{nutrition:3,recovery:1,heat:2,gutTolerance:2}},
  {id:"academy_residence",name:"Academia y residencia U23",icon:"◆",baseCost:350000,levelFactor:2.02,baseOpex:95000,weeks:10,max:5,capacity:[0,6,12,20,30,45],description:"Residencia, entrenadores, calendario U23, becas, equipo afiliado y mentoría.",effects:{academy:3,potential:2,training:1,retention:1}},
  {id:"scouting_center",name:"Centro de scouting",icon:"⌖",baseCost:320000,levelFactor:1.95,baseOpex:82000,weeks:7,max:5,capacity:[0,2,5,9,14,22],description:"Scouting juvenil, profesional, rival y contractual con informes probabilísticos.",effects:{scouting:3,knowledge:3,market:1,potential:1}},
  {id:"logistics_hub",name:"Centro logístico",icon:"▣",baseCost:500000,levelFactor:2.00,baseOpex:120000,weeks:10,max:5,capacity:[0,1,2,4,6,10],description:"Almacén, autobuses, camiones, cocina móvil, flota duplicada y desplazamientos globales.",effects:{travel:3,logistics:3,recovery:1,costEfficiency:1}},
  {id:"commercial_media",name:"Comercial, marketing y medios",icon:"◫",baseCost:200000,levelFactor:1.90,baseOpex:75000,weeks:6,max:5,capacity:[0,3,7,12,20,32],description:"Patrocinios, redes, contenido, merchandising, prensa, hospitality y reputación.",effects:{commercial:3,exposure:2,fans:2,sponsorValue:2}},
  {id:"hospitality_museum",name:"Hospitality y museo",icon:"★",baseCost:550000,levelFactor:2.00,baseOpex:125000,weeks:11,max:5,capacity:[0,40,100,220,450,800],description:"Museo, experiencias VIP, eventos corporativos, presentaciones y tienda oficial.",effects:{hospitality:3,merchandising:2,fans:1,sponsorSatisfaction:2}}
];

const V029_SATELLITE_BASES = [
  {id:"teide",name:"Base de altitud del Teide",country:"España",annualCost:540000,setupCost:850000,effects:{altitude:5,mountain:3,form:2},description:"Alojamiento, hipoxia natural y rutas de ascenso continuo."},
  {id:"girona_apartments",name:"Apartamentos de Girona",country:"España",annualCost:390000,setupCost:610000,effects:{training:3,qualityOfLife:2,travel:1},description:"Base permanente de entrenamiento y residencia temporal."},
  {id:"flanders_service",name:"Base de clásicas de Flandes",country:"Bélgica",annualCost:430000,setupCost:690000,effects:{cobbles:4,positioning:2,logistics:2},description:"Reconocimientos, almacén reforzado y acceso directo a los sectores."},
  {id:"almeria_heat",name:"Centro de calor de Almería",country:"España",annualCost:330000,setupCost:520000,effects:{heat:4,hydration:2,recovery:1},description:"Aclimatación térmica y control de hidratación."},
  {id:"colombia_scout",name:"Hub de scouting Colombia",country:"Colombia",annualCost:280000,setupCost:460000,effects:{scouting:4,climberTalent:4},description:"Red local para junior, U23 y escaladores de altitud."},
  {id:"france_logistics",name:"Almacén logístico francés",country:"Francia",annualCost:470000,setupCost:740000,effects:{logistics:4,travel:2,costEfficiency:2},description:"Flota duplicada para Tour, Dauphiné y calendario francés."},
  {id:"eindhoven_data",name:"Laboratorio de datos Eindhoven",country:"Países Bajos",annualCost:620000,setupCost:1100000,effects:{data:4,ai:4,aero:2},description:"Colaboración tecnológica para modelado, IA y gemelos digitales."},
  {id:"dubai_commercial",name:"Oficina comercial de Dubái",country:"Emiratos Árabes Unidos",annualCost:760000,setupCost:1350000,effects:{commercial:5,sponsorValue:4,heat:1},description:"Captación de capital, hospitality y activaciones internacionales."},
  {id:"us_media",name:"Oficina de medios Estados Unidos",country:"Estados Unidos",annualCost:690000,setupCost:1250000,effects:{fans:4,media:4,commercial:3},description:"Contenido, acuerdos audiovisuales y expansión en Norteamérica."},
  {id:"adelaide_preseason",name:"Base de pretemporada Adelaida",country:"Australia",annualCost:510000,setupCost:820000,effects:{heat:3,travel:2,asiaPacific:3},description:"Preparación temprana, adaptación horaria y mercado Asia-Pacífico."}
];

const V029_CLUB_IDENTITIES = [
  {id:"grand_tours",name:"Grandes vueltas",description:"Construir la plantilla y la ciencia alrededor de la clasificación general.",effects:{gc:4,prestige:2,sponsorValue:1}},
  {id:"classics",name:"Clásicas",description:"Pavé, colocación, fiabilidad y victorias de un día.",effects:{classics:4,cobbles:3,cyclingCulture:2}},
  {id:"sprint",name:"Sprint y velocidad",description:"Trenes de lanzamiento, marketing de estrellas y victorias masivas.",effects:{sprint:4,exposure:2,fans:2}},
  {id:"youth",name:"Desarrollo de jóvenes",description:"Academia, scouting, mentoría y venta o promoción de talentos.",effects:{academy:4,potential:3,commercial:1}},
  {id:"technology",name:"Innovación tecnológica",description:"Datos, IA, aerodinámica, telemetría y socios técnicos.",effects:{data:4,ai:4,aero:3}},
  {id:"regional",name:"Equipo regional",description:"Identidad territorial, corredores locales y patrocinadores institucionales.",effects:{regionalFans:4,localSponsors:4,morale:2}},
  {id:"international",name:"Proyecto internacional",description:"Diversidad, calendario global y presencia comercial multinacional.",effects:{commercial:3,travel:2,globalFans:3}},
  {id:"combativity",name:"Fugas y combatividad",description:"Visibilidad televisiva, libertad táctica y patrocinadores orientados a exposición.",effects:{breakaway:4,exposure:4,prestige:1}},
  {id:"science",name:"Excelencia científica",description:"Fisiología, medicina, nutrición y preparación individual.",effects:{training:3,recovery:3,medical:3}},
  {id:"budget_efficiency",name:"Eficiencia presupuestaria",description:"Maximizar rendimiento, formación y visibilidad con estructura ligera.",effects:{costEfficiency:4,scouting:2,combativity:2}}
];

const V029_SPONSOR_SECTORS = [
  {id:"banking",name:"Banca y finanzas",base:6400000,risk:22,objectives:["ranking","stability","markets"]},
  {id:"insurance",name:"Seguros",base:4900000,risk:18,objectives:["reputation","stability","health"]},
  {id:"energy",name:"Energía",base:7200000,risk:28,objectives:["international","technology","wins"]},
  {id:"telecom",name:"Telecomunicaciones",base:6500000,risk:25,objectives:["exposure","digital","markets"]},
  {id:"software",name:"Software e IA",base:5700000,risk:32,objectives:["technology","content","innovation"]},
  {id:"tourism",name:"Turismo",base:6100000,risk:24,objectives:["markets","events","localRaces"]},
  {id:"food",name:"Alimentación",base:4400000,risk:18,objectives:["exposure","hospitality","wins"]},
  {id:"automotive",name:"Automoción",base:6900000,risk:23,objectives:["technology","vehicles","premium"]},
  {id:"construction",name:"Construcción e infraestructuras",base:5200000,risk:27,objectives:["regional","stability","events"]},
  {id:"logistics",name:"Logística",base:4800000,risk:20,objectives:["international","reliability","markets"]},
  {id:"fashion",name:"Moda y premium",base:5900000,risk:29,objectives:["image","stars","content"]},
  {id:"health",name:"Salud y biotecnología",base:5300000,risk:21,objectives:["science","reputation","health"]},
  {id:"institutional",name:"Institucional",base:3600000,risk:12,objectives:["regional","localRiders","localRaces"]}
];

const V029_SPONSOR_COMPANIES = [
  ["Caja Atlántica","banking","España"],["NordKredit Group","banking","Alemania"],["Helvetia Capital Partners","banking","Suiza"],["Oranje Finance","banking","Países Bajos"],["Pacific Union Bank","banking","Australia"],
  ["Aegis Mutual","insurance","Reino Unido"],["Securia Europe","insurance","Francia"],["VidaNova Seguros","insurance","España"],["Alpine Assurance","insurance","Austria"],
  ["VoltEdge Energy","energy","Alemania"],["Solara Grid","energy","España"],["NorthSea Renewables","energy","Dinamarca"],["Atlas Hydrogen","energy","Francia"],["Andes Power","energy","Colombia"],
  ["Nexus Mobile","telecom","Países Bajos"],["IberTel","telecom","España"],["BlueWave Networks","telecom","Reino Unido"],["Alpine Connect","telecom","Suiza"],["Pacific Link","telecom","Australia"],
  ["QuantumPeloton AI","software","Estados Unidos"],["Velocitiq Systems","software","Dinamarca"],["DataForge Labs","software","Alemania"],["Nimbus Cloud Sport","software","Irlanda"],["Euskadi Analytics","software","España"],
  ["Pacific Horizon Tourism","tourism","Australia"],["Visit Alpine Arc","tourism","Austria"],["Costa Norte Travel","tourism","España"],["Flanders Experience","tourism","Bélgica"],["Colombia Altitude","tourism","Colombia"],
  ["PureFuel Foods","food","Países Bajos"],["Casa Verde Nutrition","food","España"],["Nordic Harvest","food","Dinamarca"],["Alpine Kitchen","food","Suiza"],["Cacao Andes","food","Colombia"],
  ["Aurelia Mobility","automotive","Alemania"],["Vektor Motors","automotive","Suecia"],["Iberia EV Works","automotive","España"],["Orion Automotive","automotive","Italia"],["Horizon Mobility","automotive","Japón"],
  ["ArcStone Infrastructure","construction","Francia"],["Boreal Engineering","construction","Noruega"],["Construcciones Cantábricas","construction","España"],["RhineWorks","construction","Alemania"],
  ["TransVelo Logistics","logistics","Bélgica"],["EuroFreight Dynamics","logistics","Países Bajos"],["Atlas Cargo","logistics","España"],["GlobalChain Mobility","logistics","Singapur"],
  ["Maison Aureon","fashion","Francia"],["Lombardia Atelier","fashion","Italia"],["Nordline Performance","fashion","Dinamarca"],["Basque Studio","fashion","España"],
  ["BioMotion Health","health","Suiza"],["NeuroRecovery Labs","health","Alemania"],["IberMed Performance","health","España"],["Altitude BioSystems","health","Colombia"],
  ["Región Cantábrica","institutional","España"],["Flanders Cycling Office","institutional","Bélgica"],["Tirol Sport Region","institutional","Austria"],["Visit Colombia Pro","institutional","Colombia"],["Greater Copenhagen Sport","institutional","Dinamarca"]
].map(([name,sectorId,country],index)=>({id:`sponsor_${index+1}`,name,sectorId,country,fictional:true}));

const V029_TECHNICAL_PARTNERS = [
  {id:"frame",name:"Cuadros",slots:1,brands:["AeroForge","VeloNex","Montara","Helix Carbon","ArcFrame","StradaLab"]},
  {id:"wheels",name:"Ruedas",slots:1,brands:["AeroForge Wheels","VelocityLab","NordRim","CarbonArc","Vector Disc","Peloton Dynamics"]},
  {id:"drivetrain",name:"Transmisión",slots:1,brands:["ShiftCore","Kinetic Drive","RatioWorks","Precision Motion","Velox Systems"]},
  {id:"tires",name:"Neumáticos",slots:1,brands:["GripNova","RoadSilk","TerraSpeed","Vector Tire","EnduraRoll"]},
  {id:"apparel",name:"Ropa y casco",slots:1,brands:["Nordline Performance","AeroSkin","Peloton Atelier","FluxWear","Strata Helmets"]},
  {id:"nutrition",name:"Nutrición",slots:1,brands:["PureFuel","CarboFlow","EnduraLab","HydraPro","RaceKitchen"]},
  {id:"vehicles",name:"Vehículos",slots:1,brands:["Aurelia Mobility","Vektor Motors","Orion Automotive","Horizon Mobility","Iberia EV Works"]},
  {id:"software",name:"Software y datos",slots:1,brands:["QuantumPeloton AI","Velocitiq Systems","DataForge Labs","Nimbus Cloud Sport"]},
  {id:"medical",name:"Equipamiento médico",slots:1,brands:["BioMotion Health","NeuroRecovery Labs","IberMed Performance","Altitude BioSystems"]}
];

const V029_SPONSOR_SLOTS = {
  title:1,
  coTitle:1,
  secondary:6,
  technical:4,
  institutional:2
};

const V029_FAN_REGIONS = ["España","Francia","Alemania","Bélgica","Italia","Países Bajos","Reino Unido","Escandinavia","Latinoamérica","Norteamérica","Asia-Pacífico","Otros"];

const V029_DYNAMIC_EVENTS = [
  {id:"sponsor_crisis",title:"Crisis financiera del patrocinador",severity:"high",description:"El patrocinador solicita renegociar pagos y variables.",effects:{cash:-900000,satisfaction:-8}},
  {id:"title_interest",title:"Interés por los derechos de nombre",severity:"positive",description:"Una empresa quiere entrar como title sponsor con prima de firma.",effects:{newOffer:1,exposure:5}},
  {id:"city_land",title:"Oferta municipal para trasladar la sede",severity:"positive",description:"Una ciudad ofrece terreno y una subvención parcial para el campus.",effects:{relocationDiscount:0.25}},
  {id:"university_lab",title:"Convenio con universidad",severity:"positive",description:"Un centro científico propone compartir laboratorio y personal investigador.",effects:{science:2,facilityDiscount:0.12}},
  {id:"staff_poach",title:"Competidor intenta fichar a un jefe de departamento",severity:"medium",description:"Deberás renovar o asumir la salida de un profesional clave.",effects:{staffPressure:1}},
  {id:"prototype_issue",title:"Problemas de fiabilidad en un prototipo",severity:"medium",description:"El socio técnico exige decidir entre retirar o seguir desarrollando el componente.",effects:{reliability:-3,technology:2}},
  {id:"academy_generation",title:"Generación excepcional en la academia",severity:"positive",description:"Los ojeadores detectan una cohorte con alto potencial.",effects:{academyBoost:1}},
  {id:"construction_delay",title:"Retraso de obra",severity:"medium",description:"Una instalación en construcción necesita semanas adicionales.",effects:{projectWeeks:2}},
  {id:"viral_content",title:"Contenido viral",severity:"positive",description:"Una pieza audiovisual del equipo dispara la audiencia y el merchandising.",effects:{fans:4,merchandising:180000,exposure:8}},
  {id:"reputation_issue",title:"Incidente reputacional",severity:"high",description:"Una controversia exige intervención de prensa y patrocinadores.",effects:{satisfaction:-6,fans:-2,commercialCost:180000}},
  {id:"merchandising_boom",title:"Ventas récord de merchandising",severity:"positive",description:"El éxito deportivo y la nueva identidad elevan la demanda.",effects:{merchandising:320000,fans:2}},
  {id:"new_regulation",title:"Nueva regulación operativa",severity:"medium",description:"La estructura debe invertir en cumplimiento médico y logístico.",effects:{cash:-300000,medical:1,logistics:1}}
];

function v029FindHeadquarters(id){return V029_HEADQUARTERS.find(x=>x.id===id)||V029_HEADQUARTERS[0];}
function v029FindFacility(id){return V029_FACILITIES.find(x=>x.id===id)||null;}
function v029FindIdentity(id){return V029_CLUB_IDENTITIES.find(x=>x.id===id)||V029_CLUB_IDENTITIES[0];}
