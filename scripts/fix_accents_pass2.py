#!/usr/bin/env python3
"""Corrige les remplacements erronés du pass 1 et les accents restants."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Corrections des remplacements trop agressifs (tres -> très dans des mots)
FIX_BROKEN = [
    ("filtrès", "filtres"),
    ("Filtrès", "Filtres"),
    ("autrès", "autres"),
    ("lettrès", "lettres"),
    ("Lettrès", "Lettres"),
    ("Centrès", "Centres"),
    ("centrès", "centres"),
    ("trouvér", "trouver"),
    ("réservér", "réserver"),
    ("demandees", "demandées"),
    ("selectif", "sélectif"),
    ("prepare-toi", "prépare-toi"),
    ("sante", "santé"),
]

# Accents restants (UI uniquement)
REMAINING = [
    ("Retour a l&apos;inscription", "Retour à l&apos;inscription"),
    ("Retour a l'accueil", "Retour à l'accueil"),
    ("Retour a l&apos;accueil", "Retour à l&apos;accueil"),
    (" a choisir", " à choisir"),
    (" a l'action", " à l'action"),
    (" a renforcer", " à renforcer"),
    (" a construire", " à construire"),
    (" a l'UGANC", " à l'UGANC"),
    (" a des TD", " à des TD"),
    (" a ta situation", " à ta situation"),
    ("Parle a un", "Parle à un"),
    ("admission a l'", "admission à l'"),
    ("1 a 2", "1 à 2"),
    ("des qu'", "dès qu'"),
    ("des qu'ils", "dès qu'ils"),
    ("des qu'elles", "dès qu'elles"),
    ("pres de chez", "près de chez"),
    ("portes par", "portés par"),
    ("generation d'", "génération d'"),
    ("temoignages", "témoignages"),
    ("reponds aux", "réponds aux"),
    ("appel video", "appel vidéo"),
    ("bacheliere", "bachelière"),
    ("clarifie son", "clarifié son"),
    ("accede gratuitement", "accède gratuitement"),
    ("reel de quelqu'un", "réel de quelqu'un"),
    ("a vecu les memes", "a vécu les mêmes"),
    ("vecu les memes", "vécu les mêmes"),
    ("Ne repete pas", "Ne répète pas"),
    ("deja recu un", "déjà reçu un"),
    ("matieres fortes", "matières fortes"),
    ("un element sur", "un élément sur"),
    ("les matieres", "les matières"),
    ("Non precise", "Non précisé"),
    ("duree d'études", "durée d'études"),
    ("duree (7+", "durée (7+"),
    ("la competition", "la compétition"),
    ("Experimentales", "Expérimentales"),
    ("Histoire-Geo", "Histoire-Géo"),
    ("Education.", "Éducation."),
    ("Role important", "Rôle important"),
    ("Role / filière", "Rôle / filière"),
    ("Fondee en", "Fondée en"),
    ("professions de sante", "professions de santé"),
    ("economie et", "économie et"),
    ("telechargement", "téléchargement"),
    ("arrete.", "arrêté."),
    ("arrete,", "arrêté,"),
    ("réservé un créneau", "réserver un créneau"),
    ("Consulte les profils mentors et réservé", "Consulte les profils mentors et réserve"),
    ("Connecte-toi pour", "Connecte-toi pour"),  # keep imperative
]

EXTENSIONS = {".tsx", ".ts", ".py"}
SKIP_DIRS = {"node_modules", ".next", "__pycache__", ".git", "scripts"}


def should_process(path: Path) -> bool:
    parts = path.parts
    if "okampus-app" in parts and "src" in parts:
        return True
    if "okampus-api" in parts and "app" in parts:
        return True
    return False


def main() -> None:
    count = 0
    for path in ROOT.rglob("*"):
        if path.suffix not in EXTENSIONS or not should_process(path):
            continue
        if any(p in SKIP_DIRS for p in path.parts):
            continue
        text = path.read_text(encoding="utf-8")
        original = text
        for old, new in FIX_BROKEN + REMAINING:
            text = text.replace(old, new)
        if text != original:
            path.write_text(text, encoding="utf-8")
            print(f"Fixed: {path.relative_to(ROOT)}")
            count += 1
    print(f"\nTotal: {count} files")


if __name__ == "__main__":
    main()
