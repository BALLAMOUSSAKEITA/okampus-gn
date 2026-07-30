#!/usr/bin/env python3
"""Corrige les identifiants code cassés et les derniers accents."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FIXES = [
    # Attributs / identifiants code cassés par "complete" -> "complète"
    ("autoComplète", "autoComplete"),
    ("hasComplètedOnboarding", "hasCompletedOnboarding"),
    ("markOnboardingComplète", "markOnboardingComplete"),
    # Identifiants Unicode -> ASCII (convention code)
    ("filières", "filieres"),
    ("catégories", "categories"),
    ("postCatégories", "postCategories"),
    # Corrections de texte restantes
    ("Geographie", "Géographie"),
    ("Geologiques", "Géologiques"),
    ("genie civil", "génie civil"),
    ("genie,", "génie,"),
    ("fondee en", "fondée en"),
    ("fondee ", "fondée "),
    ("Precise la ville", "Précise la ville"),
    ("Precise ton projet", "Précise ton projet"),
    ("liste complete", "liste complète"),
    (" et ecoles", " et écoles"),
    ("Parler a l&apos;assistant", "Parler à l&apos;assistant"),
    ("Parler a l'assistant", "Parler à l'assistant"),
    ("deja recu un", "déjà reçu un"),
    ("a déjà recu un", "a déjà reçu un"),
    ("question a la fois", "question à la fois"),
    ("pas a la serie", "pas à la série"),
    ("Prive</option>", "Privé</option>"),
    ('"Prive"', '"Privé"'),
    (": \"Prive\"", ": \"Privé\""),
    ("Prives</p>", "Privés</p>"),
    ("professionnalisanté", "professionnalisante"),
    ("comparees selon", "comparées selon"),
    ("Echange avec", "Échange avec"),
    ("tres selectives", "très sélectives"),
    ("alignees sur", "alignées sur"),
    ("indecis :", "indécis :"),
    (" a ${inst.city}", " à ${inst.city}"),
    ("generation d&apos;étudiants", "génération d&apos;étudiants"),
    ("Université privée a Conakry", "Université privée à Conakry"),
    ("Positionnement marque", "Positionnement marqué"),
    ("formations en genie", "formations en génie"),
    ("mot de passe oublie", "mot de passe oublié"),
    ("Creation...", "Création..."),
    ("Etape ", "Étape "),
    ("aria-label={`Etape", "aria-label={`Étape"),
    ("Connecte-toi", "Connecte-toi"),  # imperatif OK
    ("reconnecte-toi", "reconnecte-toi"),
    ("Numero ", "Numéro "),
    ("mot de passe oublie", "mot de passe oublié"),
]

EXTENSIONS = {".tsx", ".ts", ".py"}


def should_process(path: Path) -> bool:
    if path.name.startswith("fix_accents"):
        return False
    parts = path.parts
    return ("okampus-app" in parts and "src" in parts) or ("okampus-api" in parts and "app" in parts)


def main() -> None:
    count = 0
    for path in ROOT.rglob("*"):
        if path.suffix not in EXTENSIONS or not should_process(path):
            continue
        if any(p in {"node_modules", ".next", "__pycache__", "scripts"} for p in path.parts):
            continue
        text = path.read_text(encoding="utf-8")
        original = text
        for old, new in FIXES:
            text = text.replace(old, new)
        if text != original:
            path.write_text(text, encoding="utf-8")
            print(f"Fixed: {path.relative_to(ROOT)}")
            count += 1
    print(f"\nTotal: {count} files")


if __name__ == "__main__":
    main()
