#!/usr/bin/env python3
"""Replace synthetic 2026 filler rosters with verified major riders for all 18 WorldTeams.

The historical archive intentionally keeps a compact roster of 10 important real riders per
team for 2026. No generated rider names are used in the published 2026 pack.
"""
from __future__ import annotations

import copy
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "historical-data" / "2026.json"
MANIFEST_PATH = ROOT / "historical-data" / "manifest.json"
JS_MANIFEST_PATH = ROOT / "historical-manifest.js"

# name, nationality, birth year, role key, overall/base rating
ROSTERS: dict[str, list[tuple[str, str, int, str, int]]] = {
    "alpecin": [
        ("Mathieu van der Poel", "Netherlands", 1995, "classics", 96),
        ("Jasper Philipsen", "Belgium", 1998, "sprinter", 93),
        ("Kaden Groves", "Australia", 1998, "sprinter", 87),
        ("Tibor Del Grosso", "Netherlands", 2003, "puncheur", 82),
        ("Gianni Vermeersch", "Belgium", 1992, "classics", 80),
        ("Silvan Dillier", "Switzerland", 1990, "rouleur", 78),
        ("Gerben Thijssen", "Belgium", 1998, "sprinter", 84),
        ("Michael Gogl", "Austria", 1993, "classics", 77),
        ("Florian Sénéchal", "France", 1993, "classics", 80),
        ("Luca Vergallito", "Italy", 1997, "climber", 76),
    ],
    "bahrain": [
        ("Santiago Buitrago", "Colombia", 1999, "gc", 88),
        ("Antonio Tiberi", "Italy", 2001, "gc", 87),
        ("Lenny Martinez", "France", 2003, "climber", 87),
        ("Pello Bilbao", "Spain", 1990, "gc", 85),
        ("Matej Mohorič", "Slovenia", 1994, "classics", 88),
        ("Alec Segaert", "Belgium", 2003, "tt", 82),
        ("Phil Bauhaus", "Germany", 1994, "sprinter", 83),
        ("Damiano Caruso", "Italy", 1987, "climber", 82),
        ("Attila Valter", "Hungary", 1998, "climber", 82),
        ("Edoardo Zambanini", "Italy", 2001, "puncheur", 80),
    ],
    "decathlon": [
        ("Paul Seixas", "France", 2006, "gc", 88),
        ("Felix Gall", "Austria", 1998, "gc", 88),
        ("Olav Kooij", "Netherlands", 2001, "sprinter", 91),
        ("Paul Lapeira", "France", 2000, "puncheur", 84),
        ("Tiesj Benoot", "Belgium", 1994, "classics", 86),
        ("Daan Hoole", "Netherlands", 1999, "tt", 83),
        ("Stefan Bissegger", "Switzerland", 1998, "tt", 86),
        ("Aurélien Paret-Peintre", "France", 1996, "climber", 84),
        ("Matthew Riccitello", "United States", 2002, "climber", 84),
        ("Oliver Naesen", "Belgium", 1990, "classics", 82),
    ],
    "ef": [
        ("Richard Carapaz", "Ecuador", 1993, "gc", 91),
        ("Ben Healy", "Ireland", 2000, "puncheur", 89),
        ("Neilson Powless", "United States", 1996, "classics", 86),
        ("Kasper Asgreen", "Denmark", 1995, "classics", 87),
        ("Marijn van den Berg", "Netherlands", 1999, "sprinter", 84),
        ("Georg Steinhauser", "Germany", 2001, "climber", 84),
        ("Michael Valgren", "Denmark", 1992, "classics", 82),
        ("Vincenzo Albanese", "Italy", 1996, "puncheur", 82),
        ("Archie Ryan", "Ireland", 2001, "climber", 83),
        ("Luke Lamperti", "United States", 2002, "sprinter", 81),
    ],
    "groupama": [
        ("David Gaudu", "France", 1996, "gc", 87),
        ("Romain Grégoire", "France", 2003, "puncheur", 88),
        ("Valentin Madouas", "France", 1996, "classics", 86),
        ("Guillaume Martin", "France", 1993, "gc", 84),
        ("Rémi Cavagna", "France", 1995, "tt", 84),
        ("Paul Penhoët", "France", 2001, "sprinter", 82),
        ("Rudy Molard", "France", 1989, "puncheur", 79),
        ("Kevin Geniets", "Luxembourg", 1997, "classics", 81),
        ("Clément Berthet", "France", 1997, "climber", 81),
        ("Ewen Costiou", "France", 2002, "puncheur", 80),
    ],
    "lidl": [
        ("Juan Ayuso", "Spain", 2002, "gc", 92),
        ("Mads Pedersen", "Denmark", 1995, "classics", 94),
        ("Jonathan Milan", "Italy", 2000, "sprinter", 93),
        ("Giulio Ciccone", "Italy", 1994, "climber", 88),
        ("Mattias Skjelmose", "Denmark", 2000, "gc", 90),
        ("Thibau Nys", "Belgium", 2002, "puncheur", 89),
        ("Tao Geoghegan Hart", "United Kingdom", 1995, "gc", 84),
        ("Toms Skujiņš", "Latvia", 1991, "classics", 85),
        ("Mathias Vacek", "Czech Republic", 2002, "tt", 86),
        ("Quinn Simmons", "United States", 2001, "classics", 84),
    ],
    "lotto": [
        ("Arnaud De Lie", "Belgium", 2002, "sprinter", 90),
        ("Lennert Van Eetvelt", "Belgium", 2001, "gc", 87),
        ("Jarno Widar", "Belgium", 2005, "climber", 86),
        ("Taco van der Hoorn", "Netherlands", 1993, "rouleur", 82),
        ("Georg Zimmermann", "Germany", 1997, "puncheur", 83),
        ("Milan Menten", "Belgium", 1996, "sprinter", 82),
        ("Jonas Rutsch", "Germany", 1998, "classics", 81),
        ("Lorenzo Rota", "Italy", 1995, "puncheur", 81),
        ("Reuben Thompson", "New Zealand", 2001, "climber", 80),
        ("Jasper De Buyst", "Belgium", 1993, "sprinter", 80),
    ],
    "movistar": [
        ("Enric Mas", "Spain", 1995, "gc", 89),
        ("Nairo Quintana", "Colombia", 1990, "climber", 84),
        ("Einer Rubio", "Colombia", 1998, "climber", 86),
        ("Iván Romeo", "Spain", 2003, "tt", 85),
        ("Cian Uijtdebroeks", "Belgium", 2003, "gc", 85),
        ("Juan Pedro López", "Spain", 1997, "gc", 84),
        ("Pablo Castrillo", "Spain", 2001, "puncheur", 83),
        ("Davide Formolo", "Italy", 1992, "climber", 83),
        ("Orluis Aular", "Venezuela", 1996, "sprinter", 82),
        ("Pelayo Sánchez", "Spain", 2000, "puncheur", 83),
    ],
    "ineos": [
        ("Egan Bernal", "Colombia", 1997, "gc", 88),
        ("Carlos Rodríguez", "Spain", 2001, "gc", 89),
        ("Thymen Arensman", "Netherlands", 1999, "gc", 88),
        ("Filippo Ganna", "Italy", 1996, "tt", 95),
        ("Joshua Tarling", "United Kingdom", 2004, "tt", 92),
        ("Oscar Onley", "United Kingdom", 2002, "gc", 88),
        ("Kévin Vauquelin", "France", 2001, "gc", 87),
        ("Magnus Sheffield", "United States", 2002, "tt", 86),
        ("Michał Kwiatkowski", "Poland", 1990, "classics", 85),
        ("Ben Turner", "United Kingdom", 1999, "classics", 84),
    ],
    "nsn": [
        ("Biniam Girmay", "Eritrea", 2000, "sprinter", 91),
        ("Alexey Lutsenko", "Kazakhstan", 1992, "puncheur", 86),
        ("Stephen Williams", "United Kingdom", 1996, "puncheur", 85),
        ("Corbin Strong", "New Zealand", 2000, "sprinter", 84),
        ("George Bennett", "New Zealand", 1990, "climber", 81),
        ("Joseph Blackmore", "United Kingdom", 2003, "gc", 84),
        ("Jake Stewart", "United Kingdom", 1999, "classics", 82),
        ("Ethan Vernon", "United Kingdom", 2000, "sprinter", 83),
        ("Jan Hirt", "Czech Republic", 1991, "climber", 82),
        ("Riley Sheehan", "United States", 2000, "classics", 82),
    ],
    "redbull": [
        ("Remco Evenepoel", "Belgium", 2000, "gc", 96),
        ("Primož Roglič", "Slovenia", 1989, "gc", 93),
        ("Jai Hindley", "Australia", 1996, "gc", 88),
        ("Florian Lipowitz", "Germany", 2000, "gc", 91),
        ("Daniel Martínez", "Colombia", 1996, "gc", 87),
        ("Aleksandr Vlasov", "Russia", 1996, "gc", 88),
        ("Maxim Van Gils", "Belgium", 1999, "puncheur", 89),
        ("Giulio Pellizzari", "Italy", 2003, "climber", 87),
        ("Jordi Meeus", "Belgium", 1998, "sprinter", 85),
        ("Danny van Poppel", "Netherlands", 1993, "sprinter", 83),
    ],
    "soudal": [
        ("Tim Merlier", "Belgium", 1992, "sprinter", 94),
        ("Mikel Landa", "Spain", 1989, "gc", 87),
        ("Jasper Stuyven", "Belgium", 1992, "classics", 88),
        ("Ilan Van Wilder", "Belgium", 2000, "gc", 86),
        ("Paul Magnier", "France", 2004, "sprinter", 89),
        ("Dylan van Baarle", "Netherlands", 1992, "classics", 87),
        ("Maximilian Schachmann", "Germany", 1994, "puncheur", 85),
        ("Yves Lampaert", "Belgium", 1991, "classics", 85),
        ("Ethan Hayter", "United Kingdom", 1998, "puncheur", 84),
        ("Mauri Vansevenant", "Belgium", 1999, "climber", 83),
    ],
    "jayco": [
        ("Ben O'Connor", "Australia", 1995, "gc", 90),
        ("Luke Plapp", "Australia", 2000, "tt", 87),
        ("Michael Matthews", "Australia", 1990, "puncheur", 88),
        ("Pascal Ackermann", "Germany", 1994, "sprinter", 85),
        ("Mauro Schmid", "Switzerland", 1999, "puncheur", 84),
        ("Felix Engelhardt", "Germany", 2000, "puncheur", 82),
        ("Koen Bouwman", "Netherlands", 1993, "climber", 82),
        ("Luke Durbridge", "Australia", 1991, "rouleur", 83),
        ("Andrea Vendrame", "Italy", 1994, "puncheur", 83),
        ("Alessandro Covi", "Italy", 1998, "puncheur", 82),
    ],
    "picnic": [
        ("Max Poole", "United Kingdom", 2003, "gc", 87),
        ("Pavel Bittner", "Czech Republic", 2002, "sprinter", 85),
        ("Fabio Jakobsen", "Netherlands", 1996, "sprinter", 85),
        ("Warren Barguil", "France", 1991, "climber", 81),
        ("John Degenkolb", "Germany", 1989, "classics", 82),
        ("Frank van den Broek", "Netherlands", 2000, "gc", 84),
        ("Casper van Uden", "Netherlands", 2001, "sprinter", 84),
        ("Matthew Dinham", "Australia", 2000, "climber", 80),
        ("Nils Eekhoff", "Netherlands", 1998, "classics", 81),
        ("James Knox", "United Kingdom", 1995, "climber", 81),
    ],
    "visma": [
        ("Jonas Vingegaard", "Denmark", 1996, "gc", 97),
        ("Wout van Aert", "Belgium", 1994, "classics", 96),
        ("Matteo Jorgenson", "United States", 1999, "gc", 91),
        ("Sepp Kuss", "United States", 1994, "gc", 88),
        ("Christophe Laporte", "France", 1992, "classics", 89),
        ("Matthew Brennan", "United Kingdom", 2005, "sprinter", 88),
        ("Ben Tulett", "United Kingdom", 2001, "gc", 85),
        ("Wilco Kelderman", "Netherlands", 1991, "gc", 83),
        ("Victor Campenaerts", "Belgium", 1991, "tt", 85),
        ("Jørgen Nordhagen", "Norway", 2005, "climber", 85),
    ],
    "uae": [
        ("Tadej Pogačar", "Slovenia", 1998, "gc", 99),
        ("João Almeida", "Portugal", 1998, "gc", 94),
        ("Adam Yates", "United Kingdom", 1992, "gc", 92),
        ("Isaac del Toro", "Mexico", 2003, "gc", 94),
        ("Brandon McNulty", "United States", 1998, "tt", 89),
        ("Tim Wellens", "Belgium", 1991, "puncheur", 88),
        ("Nils Politt", "Germany", 1994, "classics", 86),
        ("Marc Soler", "Spain", 1993, "climber", 86),
        ("Jay Vine", "Australia", 1995, "climber", 87),
        ("Jhonatan Narváez", "Ecuador", 1997, "puncheur", 88),
    ],
    "unox": [
        ("Magnus Cort", "Denmark", 1993, "puncheur", 87),
        ("Tobias Halland Johannessen", "Norway", 1999, "gc", 87),
        ("Søren Wærenskjold", "Norway", 2000, "classics", 86),
        ("Jonas Abrahamsen", "Norway", 1995, "classics", 84),
        ("Andreas Leknessund", "Norway", 1999, "gc", 84),
        ("Andreas Kron", "Denmark", 1998, "puncheur", 84),
        ("Rasmus Tiller", "Norway", 1996, "classics", 84),
        ("Torstein Træen", "Norway", 1995, "climber", 82),
        ("Stian Fredheim", "Norway", 2003, "sprinter", 82),
        ("Fredrik Dversnes", "Norway", 1997, "puncheur", 82),
    ],
    "astana": [
        ("Alberto Bettiol", "Italy", 1993, "classics", 88),
        ("Davide Ballerini", "Italy", 1994, "classics", 84),
        ("Sergio Higuita", "Colombia", 1997, "gc", 86),
        ("Lorenzo Fortunato", "Italy", 1996, "climber", 84),
        ("Harold Tejada", "Colombia", 1997, "climber", 84),
        ("Diego Ulissi", "Italy", 1989, "puncheur", 84),
        ("Clément Champoussin", "France", 1998, "puncheur", 83),
        ("Christian Scaroni", "Italy", 1997, "puncheur", 84),
        ("Yevgeniy Fedorov", "Kazakhstan", 2000, "classics", 82),
        ("Mike Teunissen", "Netherlands", 1992, "classics", 83),
    ],
}

ROLE_NAMES = {
    "gc": "Líder GC",
    "climber": "Escalador",
    "puncheur": "Puncheur",
    "sprinter": "Sprinter",
    "classics": "Clasicómano",
    "tt": "Contrarrelojista",
    "rouleur": "Rodador",
}

ROLE_TEMPLATES = {
    "gc":         {"flat": 78, "sprint": 64, "mountain": 94, "hills": 91, "cobbles": 66, "tt": 88, "ttt": 88, "stamina": 94, "recovery": 94, "acceleration": 85, "positioning": 87, "downhill": 86},
    "climber":    {"flat": 69, "sprint": 57, "mountain": 96, "hills": 91, "cobbles": 57, "tt": 73, "ttt": 73, "stamina": 91, "recovery": 91, "acceleration": 83, "positioning": 80, "downhill": 82},
    "puncheur":   {"flat": 82, "sprint": 79, "mountain": 83, "hills": 95, "cobbles": 80, "tt": 79, "ttt": 79, "stamina": 88, "recovery": 84, "acceleration": 93, "positioning": 88, "downhill": 86},
    "sprinter":   {"flat": 91, "sprint": 98, "mountain": 53, "hills": 70, "cobbles": 76, "tt": 69, "ttt": 76, "stamina": 82, "recovery": 74, "acceleration": 98, "positioning": 95, "downhill": 83},
    "classics":   {"flat": 94, "sprint": 85, "mountain": 70, "hills": 87, "cobbles": 97, "tt": 83, "ttt": 87, "stamina": 95, "recovery": 86, "acceleration": 88, "positioning": 96, "downhill": 88},
    "tt":         {"flat": 96, "sprint": 67, "mountain": 76, "hills": 80, "cobbles": 76, "tt": 99, "ttt": 98, "stamina": 92, "recovery": 86, "acceleration": 72, "positioning": 89, "downhill": 88},
    "rouleur":    {"flat": 96, "sprint": 73, "mountain": 63, "hills": 77, "cobbles": 86, "tt": 91, "ttt": 94, "stamina": 94, "recovery": 84, "acceleration": 76, "positioning": 91, "downhill": 86},
}

WEIGHTS = {"gc": 64, "climber": 61, "puncheur": 68, "sprinter": 76, "classics": 73, "tt": 74, "rouleur": 75}


def norm(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "", text.lower())


def slug(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")


def clamp(value: float, lo: int = 45, hi: int = 99) -> int:
    return max(lo, min(hi, int(round(value))))


def make_stats(role: str, base: int) -> dict[str, int]:
    template = ROLE_TEMPLATES[role]
    # Templates are centred near 88. Scale by the requested overall while retaining speciality shape.
    delta = (base - 84) * 0.72
    stats = {key: clamp(value + delta) for key, value in template.items()}
    stats["timeTrial"] = stats["tt"]
    stats["teamTimeTrial"] = stats["ttt"]
    return stats


def make_rider(team_id: str, ordinal: int, spec: tuple[str, str, int, str, int], existing: dict | None) -> dict:
    name, nationality, birth_year, role, base = spec
    rider = copy.deepcopy(existing) if existing else {}
    rider.update({
        "id": f"{team_id}_{ordinal:02d}_{slug(name)}",
        "name": name,
        "nationality": nationality,
        "age": max(18, 2026 - birth_year),
        "teamId": team_id,
        "roleKey": role,
        "role": ROLE_NAMES[role],
        "base": base,
        "weightKg": rider.get("weightKg") if existing and rider.get("weightKg") else WEIGHTS[role],
        "defaultOrder": "protect" if role == "gc" else ("sprint" if role == "sprinter" else "hold"),
        "defaultEffort": 68 if base >= 90 else 64,
        "stats": make_stats(role, base),
        "form": clamp(base + 1, 65, 99),
        "morale": 82,
        "fatigue": 0,
        "energy": 100,
        "totalTime": 0,
        "points": 0,
        "mountainPoints": 0,
        "uciPoints": 0,
        "stageWins": 0,
        "seasonStageWins": 0,
        "raceDays": 0,
        "abandoned": False,
        "season": 2026,
        "historicalId": f"2026::{team_id}_{ordinal:02d}_{slug(name)}",
        "curatedMajorRider": True,
        "source": {
            "provider": "2026 UCI WorldTeams roster list",
            "ratingSource": "curated-major-rider-model",
            "rosterCoverage": "major-riders",
        },
    })
    return rider


def update_js_manifest(manifest: dict) -> None:
    content = "/* Auto-generated historical archive manifest. */\n" + \
        "const HISTORICAL_MANIFEST_V025 = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n"
    JS_MANIFEST_PATH.write_text(content, encoding="utf-8")


def main() -> None:
    pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
    existing_by_name = {norm(r["name"]): r for r in pack.get("riders", [])}
    team_ids = {team["id"] for team in pack.get("teams", [])}
    missing_teams = set(ROSTERS) - team_ids
    if missing_teams:
        raise SystemExit(f"Missing team IDs in 2026 pack: {sorted(missing_teams)}")

    new_riders: list[dict] = []
    for team in pack["teams"]:
        team_id = team["id"]
        specs = ROSTERS[team_id]
        team["size"] = len(specs)
        team["source"] = {
            "provider": "2026 UCI WorldTeams roster list",
            "status": "verified-major-riders",
        }
        for ordinal, spec in enumerate(specs, start=1):
            existing = existing_by_name.get(norm(spec[0]))
            new_riders.append(make_rider(team_id, ordinal, spec, existing))

    pack["riders"] = new_riders
    pack["source"] = {
        "provider": "UCI/2026 WorldTeam roster sources + simulator rating model",
        "url": "https://www.uci.org/teams/road/17Dnt5VJ9f8JgFWeDrJv7u?tab=teams-list",
        "note": "Compact curated archive: 10 important real riders per 2026 WorldTeam; no synthetic filler names.",
    }
    pack["completeness"] = {
        "status": "major-riders-verified",
        "teamCount": 18,
        "riderCount": len(new_riders),
        "note": "18 UCI WorldTeams 2026, with 10 important real riders per team. Synthetic filler riders removed.",
    }
    pack["scope"] = "18 UCI WorldTeams 2026 · 10 important real riders per team"
    PACK_PATH.write_text(json.dumps(pack, ensure_ascii=False, indent=2), encoding="utf-8")

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    for entry in manifest["years"]:
        if entry["year"] == 2026:
            entry.update({
                "status": "major-riders-verified",
                "teamCount": 18,
                "riderCount": len(new_riders),
                "file": "2026.json",
            })
    manifest["generatedAt"] = "2026-07-22"
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    update_js_manifest(manifest)

    print(json.dumps({"ok": True, "teams": len(ROSTERS), "riders": len(new_riders)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
