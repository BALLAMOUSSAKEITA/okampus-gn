# Tâche 1.3 - Corriger le bug CV langues

**Epic :** 01 - Corrections Critiques & Sécurité
**Priorité :** Haute
**Statut :** [x] Terminé
**Fichiers concernés :**
- `okampus-api/app/routers/cv.py` (ligne 15)

## Description

Bug dans le formatage des langues lors de la génération du CV. La variable de boucle n'est pas interpolée dans la f-string.

## Bug actuel

```python
languages = "\n".join(f"- l" for l in cv.get("languages", [])) or "—"
```

Le résultat produit `"- l"` pour chaque langue au lieu du nom réel de la langue.

## Correction

```python
languages = "\n".join(f"- {l}" for l in cv.get("languages", [])) or "—"
```

## Critères d'acceptation

- [x] Les langues sont correctement affichées dans le CV généré (ex: `- Français`, `- Anglais`)
- [ ] Tester avec un profil ayant 0, 1 et plusieurs langues
