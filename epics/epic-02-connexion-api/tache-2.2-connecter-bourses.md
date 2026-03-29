# Tâche 2.2 - Connecter la page Bourses

**Epic :** 02 - Connexion Frontend ↔ Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/bourses/page.tsx`
- `okampus-api/app/routers/scholarships.py`

## Description

La page `/bourses` affiche 6 bourses mock hardcodées. Il faut les remplacer par des appels à `GET /scholarships`.

## Actions à réaliser

1. **Supprimer les données mock** du composant (tableau `scholarships`)

2. **Appeler l'API avec le hook `useFetch` :**
   ```typescript
   const { data: scholarships, loading, error } = useFetch<Scholarship[]>('/scholarships', {
     params: {
       ...(typeFilter !== 'all' && { type: typeFilter }),
       ...(locationFilter !== 'all' && { location: locationFilter }),
     }
   });
   ```

3. **Adapter le typage TypeScript :**
   - S'assurer que le type `Scholarship` frontend correspond au schema `ScholarshipOut` backend
   - Mapping camelCase ↔ snake_case si nécessaire

4. **Gérer les états :**
   - Loading : afficher un skeleton loader
   - Erreur : afficher un message d'erreur avec bouton "Réessayer"
   - Vide : afficher "Aucune bourse trouvée pour ces critères"

5. **Seed data :**
   - Créer un script de seeding avec les vraies bourses guinéennes (Excellence, Campus France, etc.)

## Critères d'acceptation

- [ ] Les bourses proviennent de l'API, pas de données mock
- [ ] Les filtres type et location fonctionnent via query params
- [ ] La recherche textuelle fonctionne
- [ ] Un état de chargement est affiché pendant le fetch
- [ ] Les erreurs sont gérées avec possibilité de réessayer
