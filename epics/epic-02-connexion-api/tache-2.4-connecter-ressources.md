# Tâche 2.4 - Connecter la page Ressources

**Epic :** 02 - Connexion Frontend ↔ Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/ressources/page.tsx`
- `okampus-api/app/routers/resources.py`

## Description

La page `/ressources` affiche 4 ressources mock. Il faut connecter le listing, le système d'achat, et préparer l'upload (Epic 06).

## Actions à réaliser

1. **Remplacer les ressources mock par `GET /resources` :**
   - Filtres : category (TD/Cours/Sujet), subject (Math/Info/Physique/Biochimie)
   - Recherche textuelle

2. **Implémenter l'achat de ressources :**
   - Ressources gratuites : téléchargement direct
   - Ressources premium : `POST /resources/{id}/purchase` → incrémenter downloads
   - Vérifier si déjà acheté avant d'afficher le prix

3. **Préparer le formulaire d'upload :**
   - Le modal existe déjà côté UI
   - Connecter le formulaire à `POST /resources` (sans fichier réel pour l'instant, URL manuelle)
   - Le vrai upload sera implémenté dans l'Epic 06

4. **Afficher les métriques :**
   - Nombre de téléchargements
   - Note moyenne
   - Auteur

## Critères d'acceptation

- [ ] Les ressources proviennent de l'API
- [ ] Les filtres category et subject fonctionnent
- [ ] L'achat de ressource fonctionne (enregistré en DB)
- [ ] Le formulaire d'upload envoie les données au backend
- [ ] Les métriques (downloads, rating) sont affichées correctement
