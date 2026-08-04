# Tâche 2.3 - Connecter la page Stages

**Epic :** 02 - Connexion Frontend ↔ Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/stages/page.tsx`
- `okampus-api/app/routers/stages.py`

## Description

La page `/stages` affiche 5 offres mock. Il faut connecter la liste ET le système de candidature.

## Actions à réaliser

1. **Remplacer les offres mock par `GET /stages` :**
   - Filtres : type (stage/emploi/alternance), domain (informatique/finance/etc.)
   - Recherche textuelle sur titre et entreprise

2. **Implémenter la candidature réelle :**
   - Bouton "Postuler" dans le modal de détail → `POST /stages/{id}/apply`
   - Champ message optionnel dans le formulaire de candidature
   - Afficher "Déjà postulé" si l'utilisateur a déjà candidaté

3. **Vérifier le statut de candidature :**
   - Appeler `GET /stages/{id}/apply?user_id=` pour chaque offre affichée
   - Ou créer un endpoint batch `GET /stages/my-applications`

4. **Adapter les types TypeScript :**
   - `StageOffer` avec tous les champs du backend
   - `StageApplication` pour le suivi

## Critères d'acceptation

- [ ] Les offres de stages proviennent de l'API
- [ ] La candidature est envoyée au backend et persiste en DB
- [ ] Le bouton "Postuler" se transforme en "Déjà postulé" après candidature
- [ ] Les filtres et la recherche fonctionnent
- [ ] Un message de confirmation s'affiche après candidature
