# Tâche 11.3 - Endpoint recherche globale

**Epic :** 11 - Recherche Globale & Pagination
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/search.py` (nouveau)

## Actions à réaliser

1. **Endpoint `GET /search?q=` :**
   - Chercher dans : bourses (titre), stages (titre, entreprise), ressources (titre, description), forum (titre, contenu), projets (titre), success stories (titre)
   - Retourner les résultats groupés par type
   - Limiter à 5 résultats par type

2. **Format de réponse :**
   ```json
   {
     "scholarships": [{ "id": "...", "title": "...", "type": "scholarship" }],
     "stages": [...],
     "resources": [...],
     "forum": [...],
     "projects": [...],
     "stories": [...]
   }
   ```

## Critères d'acceptation

- [ ] La recherche retourne des résultats de tous les types
- [ ] Les résultats sont pertinents
- [ ] La réponse est rapide (< 500ms)
