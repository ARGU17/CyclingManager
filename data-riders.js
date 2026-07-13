/* ============================================================
   data-riders.js
   v0.12
   Nota: incluye todos los equipos WT/PRT 2026 y rellena plantillas
   hasta el número PCS de corredores por equipo. Los corredores semilla
   son reales; los no disponibles en esta extracción quedan marcados como
   desarrollo de roster para mantener tamaños completos y jugabilidad.
   ============================================================ */

const RIDER_SEEDS = {
  uae:[
    ["Tadej Pogačar","Slovenia",27,"gc",99],["Isaac Del Toro","Mexico",22,"puncheur",93],["João Almeida","Portugal",27,"co",91],["Adam Yates","Great Britain",33,"climber",90],["Brandon McNulty","United States",28,"tt",87],["Jay Vine","Australia",30,"climber",87],["Jan Christen","Switzerland",22,"puncheur",86],["Jhonatan Narváez","Ecuador",29,"classics",86],["Tim Wellens","Belgium",35,"classics",85],["Benoît Cosnefroy","France",30,"puncheur",84],["Marc Soler","Spain",32,"climber",84],["Pavel Sivakov","France",29,"climber",83],["Nils Politt","Germany",32,"rouleur",83],["António Morgado","Portugal",22,"puncheur",82],["Florian Vermeersch","Belgium",27,"classics",82],["Mikkel Bjerg","Denmark",27,"tt",81],["Felix Großschartner","Austria",32,"domestique",81],["Juan Sebastián Molano","Colombia",31,"sprinter",80],["Igor Arrieta","Spain",23,"climber",79],["Kevin Vermaerke","United States",25,"domestique",78]
  ],
  visma:[
    ["Jonas Vingegaard","Denmark",29,"gc",97],["Wout van Aert","Belgium",31,"classics",94],["Matteo Jorgenson","United States",27,"co",90],["Sepp Kuss","United States",31,"climber",88],["Olav Kooij","Netherlands",24,"sprinter",88],["Simon Yates","Great Britain",34,"climber",87],["Christophe Laporte","France",33,"classics",86],["Dylan van Baarle","Netherlands",34,"rouleur",84],["Edoardo Affini","Italy",30,"tt",84],["Tiesj Benoot","Belgium",32,"classics",84],["Wilco Kelderman","Netherlands",35,"domestique",83],["Ben Tulett","Great Britain",25,"climber",82],["Attila Valter","Hungary",28,"climber",82],["Matthew Brennan","Great Britain",21,"sprinter",82],["Jørgen Nordhagen","Norway",21,"climber",82],["Per Strand Hagenes","Norway",23,"puncheur",80]
  ],
  redbull:[
    ["Remco Evenepoel","Belgium",26,"gc",96],["Primož Roglič","Slovenia",36,"gc",94],["Florian Lipowitz","Germany",25,"climber",88],["Daniel Felipe Martínez","Colombia",30,"climber",87],["Jai Hindley","Australia",30,"climber",87],["Aleksandr Vlasov","Russia",30,"co",86],["Sam Welsford","Australia",30,"sprinter",86],["Laurence Pithie","New Zealand",24,"classics",82],["Oier Lazkano","Spain",26,"classics",82],["Sergio Higuita","Colombia",29,"climber",81],["Finn Fisher-Black","New Zealand",24,"puncheur",80],["Roger Adrià","Spain",28,"puncheur",80],["Nico Denz","Germany",32,"rouleur",80],["Ryan Mullen","Ireland",32,"tt",80],["Bob Jungels","Luxembourg",33,"rouleur",80]
  ],
  alpecin:[
    ["Mathieu van der Poel","Netherlands",31,"classics",96],["Jasper Philipsen","Belgium",28,"sprinter",93],["Kaden Groves","Australia",27,"sprinter",87],["Tibor Del Grosso","Netherlands",23,"puncheur",84],["Quinten Hermans","Belgium",31,"puncheur",82],["Florian Sénéchal","France",33,"classics",82],["Gianni Vermeersch","Belgium",33,"classics",80],["Søren Kragh Andersen","Denmark",32,"rouleur",80],["Silvan Dillier","Switzerland",36,"rouleur",78],["Jonas Rickaert","Belgium",32,"rouleur",78]
  ],
  lidl:[
    ["Juan Ayuso","Spain",24,"gc",91],["Mads Pedersen","Denmark",30,"classics",91],["Jonathan Milan","Italy",26,"sprinter",90],["Mattias Skjelmose","Denmark",26,"co",88],["Giulio Ciccone","Italy",31,"climber",86],["Thibau Nys","Belgium",24,"puncheur",85],["Toms Skujiņš","Latvia",35,"classics",83],["Tao Geoghegan Hart","Great Britain",31,"climber",83],["Jasper Stuyven","Belgium",34,"classics",84],["Matteo Sobrero","Italy",29,"tt",82],["Mathias Vacek","Czech Republic",24,"tt",82]
  ],
  decathlon:[
    ["Paul Seixas","France",20,"gc",88],["Felix Gall","Austria",28,"climber",86],["Olav Kooij","Netherlands",24,"sprinter",89],["Benoît Cosnefroy","France",31,"puncheur",84],["Tiesj Benoot","Belgium",32,"classics",84],["Paul Lapeira","France",26,"puncheur",83],["Matthew Riccitello","United States",24,"climber",82],["Dorian Godon","France",30,"classics",81],["Oliver Naesen","Belgium",35,"classics",81],["Bruno Armirail","France",32,"tt",81]
  ],
  ineos:[
    ["Carlos Rodríguez","Spain",25,"gc",89],["Filippo Ganna","Italy",29,"tt",91],["Joshua Tarling","Great Britain",22,"tt",89],["Egan Bernal","Colombia",29,"gc",87],["Thymen Arensman","Netherlands",26,"climber",86],["Tom Pidcock","Great Britain",27,"puncheur",86],["Magnus Sheffield","United States",24,"rouleur",84],["Geraint Thomas","Great Britain",40,"co",83],["Tobias Foss","Norway",29,"tt",82],["Michal Kwiatkowski","Poland",36,"classics",82],["Ben Turner","Great Britain",27,"classics",81]
  ],
  movistar:[
    ["Enric Mas","Spain",31,"gc",88],["Nairo Quintana","Colombia",36,"climber",84],["Alex Aranburu","Spain",30,"classics",83],["Oier Lazkano","Spain",26,"classics",83],["Einer Rubio","Colombia",28,"climber",83],["Iván Romeo","Spain",23,"tt",82],["Pelayo Sánchez","Spain",26,"puncheur",82],["Fernando Gaviria","Colombia",31,"sprinter",84],["Davide Formolo","Italy",33,"domestique",80],["Javier Romo","Spain",27,"puncheur",80]
  ],
  bahrain:[
    ["Santiago Buitrago","Colombia",26,"climber",87],["Lenny Martinez","France",23,"climber",86],["Matej Mohorič","Slovenia",31,"classics",86],["Antonio Tiberi","Italy",25,"co",85],["Pello Bilbao","Spain",36,"gc",84],["Alec Segaert","Belgium",23,"tt",83],["Phil Bauhaus","Germany",32,"sprinter",82],["Damiano Caruso","Italy",39,"climber",82],["Fred Wright","Great Britain",27,"classics",80]
  ],
  soudal:[
    ["Tim Merlier","Belgium",33,"sprinter",90],["Mikel Landa","Spain",36,"climber",86],["Jasper Stuyven","Belgium",34,"classics",85],["Ilan Van Wilder","Belgium",26,"co",83],["Yves Lampaert","Belgium",35,"tt",82],["Kasper Asgreen","Denmark",31,"rouleur",82],["Paul Magnier","France",22,"sprinter",82],["Mauri Vansevenant","Belgium",27,"puncheur",81],["Mattia Cattaneo","Italy",36,"tt",80]
  ],
  jayco:[
    ["Dylan Groenewegen","Netherlands",33,"sprinter",86],["Michael Matthews","Australia",35,"classics",85],["Ben O'Connor","Australia",31,"gc",86],["Eddie Dunbar","Ireland",29,"climber",83],["Luke Plapp","Australia",25,"tt",84],["Simon Yates","Great Britain",34,"climber",86],["Kelland O'Brien","Australia",28,"rouleur",78]
  ],
  groupama:[
    ["Paul Penhoët","France",25,"sprinter",82],["Romain Grégoire","France",23,"puncheur",85],["David Gaudu","France",30,"climber",84],["Stefan Küng","Switzerland",33,"tt",86],["Valentin Madouas","France",30,"classics",84],["Lenny Martinez","France",23,"climber",86]
  ],
  ef:[
    ["Richard Carapaz","Ecuador",33,"gc",88],["Neilson Powless","United States",30,"classics",84],["Ben Healy","Ireland",26,"puncheur",87],["Alberto Bettiol","Italy",32,"classics",82],["Mikkel Honoré","Denmark",29,"puncheur",78],["Marijn van den Berg","Netherlands",27,"sprinter",82]
  ],
  astana:[
    ["Mark Cavendish","Great Britain",41,"sprinter",80],["Davide Ballerini","Italy",32,"classics",80],["Cees Bol","Netherlands",31,"sprinter",79],["Alexey Lutsenko","Kazakhstan",33,"puncheur",82],["Max Kanter","Germany",28,"sprinter",78],["Ide Schelling","Netherlands",28,"puncheur",78]
  ],
  unox:[
    ["Alexander Kristoff","Norway",39,"sprinter",82],["Søren Wærenskjold","Norway",26,"tt",84],["Tobias Halland Johannessen","Norway",27,"climber",84],["Andreas Leknessund","Norway",27,"climber",82],["Jonas Abrahamsen","Norway",30,"rouleur",83],["Rasmus Tiller","Norway",30,"classics",82]
  ],
  picnic:[
    ["Fabio Jakobsen","Netherlands",30,"sprinter",84],["Oscar Onley","Great Britain",24,"climber",84],["Kevin Vermaerke","United States",25,"domestique",78],["Frank van den Broek","Netherlands",26,"rouleur",80],["Sam Welsford","Australia",30,"sprinter",86]
  ],
  lotto:[
    ["Arnaud De Lie","Belgium",24,"sprinter",88],["Biniam Girmay","Eritrea",26,"sprinter",88],["Maxim Van Gils","Belgium",27,"puncheur",86],["Louis Vervaeke","Belgium",32,"domestique",77],["Lennert Van Eetvelt","Belgium",25,"climber",84]
  ],
  q36:[
    ["Tom Pidcock","Great Britain",27,"puncheur",88],["Matteo Moschetti","Italy",30,"sprinter",80],["Damien Howson","Australia",34,"climber",78],["Gianluca Brambilla","Italy",39,"climber",77],["David de la Cruz","Spain",37,"climber",78]
  ],
  tudor:[
    ["Julian Alaphilippe","France",34,"puncheur",86],["Marc Hirschi","Switzerland",28,"puncheur",86],["Stefan Küng","Switzerland",33,"tt",86],["Matteo Trentin","Italy",37,"classics",82],["Arvid de Kleijn","Netherlands",32,"sprinter",80],["Michael Storer","Australia",29,"climber",82]
  ],
  total:[
    ["Anthony Turgis","France",32,"classics",82],["Steff Cras","Belgium",30,"climber",80],["Mathieu Burgaudeau","France",28,"puncheur",80],["Sandy Dujardin","France",29,"sprinter",78]
  ],
  cofidis:[
    ["Bryan Coquard","France",34,"sprinter",82],["Ion Izagirre","Spain",37,"climber",80],["Guillaume Martin","France",33,"climber",81],["Axel Zingle","France",27,"classics",81]
  ],
  caja:[
    ["Fernando Gaviria","Colombia",31,"sprinter",84],["Orluis Aular","Venezuela",30,"sprinter",80],["Jefferson Cepeda","Ecuador",30,"climber",79],["Eduard Prades","Spain",39,"classics",80],["Stefano Oldani","Italy",28,"classics",80]
  ],
  burgos:[
    ["Jesús Herrada","Spain",36,"puncheur",82],["Pablo Castrillo","Spain",25,"puncheur",80],["Merhawi Kudus","Eritrea",32,"climber",80],["Aaron Gate","New Zealand",36,"rouleur",78]
  ],
  euskaltel:[
    ["Urko Berrade","Spain",28,"puncheur",78],["Jonathan Lastra","Spain",33,"classics",78],["Mikel Bizkarra","Spain",37,"climber",77],["Gotzon Martín","Spain",30,"puncheur",77]
  ],
  polti:[
    ["Giovanni Lonardi","Italy",30,"sprinter",80],["Mirco Maestri","Italy",34,"rouleur",79],["Davide De Pretto","Italy",24,"puncheur",79],["Alessandro Tonelli","Italy",34,"puncheur",78]
  ],
  kern:[
    ["Pau Martí","Spain",22,"climber",79],["Roger Adrià","Spain",28,"puncheur",80],["Urko Berrade","Spain",28,"puncheur",78],["Jon Agirre","Spain",29,"puncheur",76]
  ],
  flanders:[
    ["Jelle Vermoote","Belgium",25,"classics",76],["Lindsay De Vylder","Belgium",31,"rouleur",76],["Ward Vanhoof","Belgium",27,"classics",75]
  ],
  bardiani:[["Giulio Pellizzari","Italy",22,"climber",80],["Filippo Fiorelli","Italy",32,"sprinter",77],["Alessandro Pinarello","Italy",23,"climber",76]],
  novo:[["Andrea Peron","Italy",38,"sprinter",75],["David Lozano","Spain",38,"climber",74]],
  unibet:[["Timo de Jong","Netherlands",26,"sprinter",76],["Axel van der Tuuk","Netherlands",24,"rouleur",75]],
  mbh:[["Barnabás Peák","Hungary",28,"rouleur",76],["Erik Fetter","Hungary",26,"tt",75]],
  modern:[["Scott McGill","United States",28,"sprinter",76],["Tyler Stites","United States",28,"puncheur",76]],
  solution:[["Walter Calzoni","Italy",24,"climber",75],["Luca Colnaghi","Italy",26,"sprinter",75]]
};

const FILLER_NAMES = {
  Belgium:["Van Acker","De Smet","Vandamme","Verbrugge","Maes","Claeys","Vermeulen","Van den Berg"],
  Spain:["García","Martín","López","Serrano","Ramos","Vega","Etxeberria","Iglesias"],
  France:["Martin","Bernard","Moreau","Gauthier","Leclerc","Roux","Perret","Collet"],
  Italy:["Bianchi","Rossi","Ferrari","Conti","Moretti","Ricci","Galli","Marino"],
  Netherlands:["Jansen","De Vries","Bakker","Visser","Smit","Meijer","Van Dijk","Bos"],
  Germany:["Müller","Schmidt","Koch","Weber","Fischer","Neumann","Wolf","Klein"],
  Norway:["Hansen","Johansen","Larsen","Bakken","Solberg","Nilsen","Berg","Dahl"],
  Switzerland:["Müller","Schmid","Keller","Meier","Baumann","Frei","Huber","Steiner"],
  UnitedStates:["Smith","Johnson","Miller","Davis","Wilson","Anderson","Taylor","Clark"],
  Australia:["Williams","Brown","Wilson","Taylor","Anderson","Martin","Thompson","Kelly"],
  Other:["Novak","Silva","Kowalski","Popescu","Horvat","Ivanov","Nagy","Costa"]
};

function dataClamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function deterministicNoise(teamIndex, riderIndex, key) {
  const seed = teamIndex * 97 + riderIndex * 31 + key.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const raw = Math.sin(seed) * 10000;
  return Math.round(((raw - Math.floor(raw)) - 0.5) * 8);
}
function riderId(teamId, name, index) {
  return `${teamId}_${String(index + 1).padStart(2,"0")}_${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")}`;
}
function guessRole(team, i) {
  if (i === 0 && team.ai.gc > 70) return "gc";
  if (i % 11 === 0) return "tt";
  if (i % 7 === 0) return "sprinter";
  if (i % 5 === 0) return "classics";
  if (i % 3 === 0) return "climber";
  if (i % 2 === 0) return "rouleur";
  return "domestique";
}
function nationForTeam(team, i) {
  if (team.country === "Spain") return "Spain";
  if (team.country === "France") return "France";
  if (team.country === "Belgium") return "Belgium";
  if (team.country === "Netherlands") return "Netherlands";
  if (team.country === "Germany") return "Germany";
  if (team.country === "Italy") return "Italy";
  if (team.country === "Norway") return "Norway";
  if (team.country === "Switzerland") return "Switzerland";
  if (team.country === "United States") return "United States";
  if (team.country === "Australia") return "Australia";
  return ["Belgium","Italy","France","Spain","Netherlands","Denmark","Norway","Colombia","Portugal","Slovenia"][i % 10];
}
function generateFillerRider(team, teamIndex, riderIndex) {
  const nation = nationForTeam(team, riderIndex);
  const key = nation.replace(/\s/g, "") in FILLER_NAMES ? nation.replace(/\s/g, "") : "Other";
  const surnames = FILLER_NAMES[key] || FILLER_NAMES.Other;
  const firstNames = ["Alex","Marc","Jon","Luca","Tom","Matteo","Nils","Pavel","Oscar","Victor","Julian","Max","Ben","Sam","Leo","Mikel"];
  const name = `${firstNames[(teamIndex + riderIndex) % firstNames.length]} ${surnames[riderIndex % surnames.length]}`;
  const role = guessRole(team, riderIndex);
  const levelBase = team.level === "WT" ? 72 : 66;
  const base = dataClamp(levelBase + Math.round((team.ai.gc + team.ai.sprint + team.ai.classics + team.ai.breakaway) / 55) + deterministicNoise(teamIndex, riderIndex, "base"), 58, 82);
  return [name, nation, 20 + ((teamIndex * 3 + riderIndex) % 18), role, base, true];
}
function buildRiders() {
  const riders = [];
  TEAMS.forEach((team, teamIndex) => {
    const seeds = RIDER_SEEDS[team.id] || [];
    const roster = [...seeds];
    while (roster.length < team.rosterCount) roster.push(generateFillerRider(team, teamIndex, roster.length));
    roster.slice(0, team.rosterCount).forEach((item, riderIndex) => {
      const [name, nationality, age, roleKey, base, generated] = item;
      const template = ROLE_TEMPLATES[roleKey] || ROLE_TEMPLATES.domestique;
      const stats = {};
      const baseLift = (base - 75) * 0.60;
      Object.keys(template.stats).forEach(key => {
        stats[key] = dataClamp(Math.round(template.stats[key] + baseLift + deterministicNoise(teamIndex, riderIndex, key)), 42, 99);
      });
      stats.timeTrial = stats.tt; stats.teamTimeTrial = stats.ttt;
      riders.push({
        id:riderId(team.id,name,riderIndex), name, nationality, age, teamId:team.id, roleKey, role:template.label,
        base, generated:!!generated, defaultOrder:template.defaultOrder, defaultEffort:template.defaultEffort,
        stats, form:dataClamp(base + deterministicNoise(teamIndex,riderIndex,"form"),50,99), morale:dataClamp(74 + deterministicNoise(teamIndex,riderIndex,"morale"),40,99),
        fatigue:0, energy:100, totalTime:0, points:0, mountainPoints:0, uciPoints:0, stageWins:0, seasonStageWins:0, raceDays:0, abandoned:false
      });
    });
  });
  return riders;
}

const RIDERS = buildRiders();
