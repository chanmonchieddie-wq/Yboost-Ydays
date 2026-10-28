"""Calculs descriptifs pour comparer les statistiques de deux equipes."""

from __future__ import annotations

import json
import math
import sys
from typing import Any


def _team_name(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value.strip() or len(value.strip()) > 80:
        raise ValueError(f"Le champ {field} doit contenir entre 1 et 80 caracteres.")
    return value.strip()


def _pair(stats: dict[str, Any], field: str, *, integer: bool = False) -> tuple[float, float]:
    value = stats.get(field)
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError(f"La statistique {field} doit contenir deux valeurs.")

    values: list[float] = []
    for item in value:
        if isinstance(item, bool) or not isinstance(item, (int, float)):
            raise ValueError(f"Les valeurs de {field} doivent etre numeriques.")
        if not math.isfinite(item) or item < 0:
            raise ValueError(f"Les valeurs de {field} doivent etre finies et positives.")
        if integer and not isinstance(item, int):
            raise ValueError(f"Les valeurs de {field} doivent etre des nombres entiers.")
        values.append(float(item))
    return values[0], values[1]


def analyze_match(data: Any) -> dict[str, Any]:
    """Valide les statistiques d'un match et renvoie des indicateurs calcules."""
    if not isinstance(data, dict):
        raise ValueError("Les donnees du match doivent etre un objet JSON.")

    home = _team_name(data.get("home"), "home")
    away = _team_name(data.get("away"), "away")
    stats = data.get("stats")
    if not isinstance(stats, dict):
        raise ValueError("Les statistiques du match sont manquantes.")

    possession = _pair(stats, "possession", integer=True)
    shots = _pair(stats, "tirs", integer=True)
    shots_on_target = _pair(stats, "cadres", integer=True)
    expected_goals = _pair(stats, "xg")

    if any(value > 100 for value in possession) or sum(possession) != 100:
        raise ValueError("Les deux possessions doivent etre comprises entre 0 et 100 et totaliser 100.")
    if any(target > total for target, total in zip(shots_on_target, shots)):
        raise ValueError("Le nombre de tirs cadres ne peut pas depasser le nombre de tirs.")
    if any(value > 50 for value in expected_goals):
        raise ValueError("Chaque valeur xG doit etre inferieure ou egale a 50.")
    if any(total == 0 and xg > 0 for total, xg in zip(shots, expected_goals)):
        raise ValueError("Un xG positif necessite au moins un tir.")

    shot_accuracy = [
        round(target / total * 100, 1) if total else 0.0
        for target, total in zip(shots_on_target, shots)
    ]
    xg_per_shot = [
        round(xg / total, 3) if total else None
        for xg, total in zip(expected_goals, shots)
    ]
    xg_difference = round(expected_goals[0] - expected_goals[1], 2)

    if abs(xg_difference) < 0.15:
        insight = "Les deux equipes ont genere un volume d'occasions attendu assez proche."
    elif xg_difference > 0:
        insight = f"{home} a genere le xG le plus eleve dans ces statistiques."
    else:
        insight = f"{away} a genere le xG le plus eleve dans ces statistiques."

    return {
        "home": home,
        "away": away,
        "metrics": {
            "possession": [int(value) for value in possession],
            "tirs": [int(value) for value in shots],
            "cadres": [int(value) for value in shots_on_target],
            "xg": [round(value, 2) for value in expected_goals],
            "precisionTirs": shot_accuracy,
            "xgParTir": xg_per_shot,
            "ecartXg": xg_difference,
        },
        "insight": insight,
        "note": "Analyse descriptive des statistiques fournies; ce resultat n'est pas une prediction.",
    }


def main() -> int:
    try:
        payload = json.load(sys.stdin)
        result = analyze_match(payload)
    except (json.JSONDecodeError, ValueError) as error:
        print(str(error), file=sys.stderr)
        return 2

    json.dump(result, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())