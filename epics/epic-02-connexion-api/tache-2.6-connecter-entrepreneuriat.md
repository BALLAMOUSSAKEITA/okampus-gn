# Tâche 2.6 - Connecter la page Entrepreneuriat

**Epic :** 02 - Connexion Frontend ↔ Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/entrepreneuriat/page.tsx`
- `okampus-api/app/routers/entrepreneur.py`

## Description

La page `/entrepreneuriat` affiche 5 projets mock. Connecter le listing et la soumission de projets.

## Actions à réaliser

1. **Remplacer les projets mock par `GET /entrepreneur` :**
   - Filtres : category (EdTech/AgriTech/HealthTech/etc.), status (Idée/En cours/Lancé)

2. **Connecter le modal de soumission :**
   - Le modal UI existe déjà
   - Envoyer les données via `POST /entrepreneur`
   - Associer automatiquement l'auteur (user connecté)

3. **Système de likes :**
   - Ajouter un endpoint `POST /entrepreneur/{id}/like` backend
   - Bouton like fonctionnel côté frontend
   - Éviter les doubles likes (un like par user par projet)

4. **Compteur de vues :**
   - Incrémenter les vues quand un utilisateur ouvre le détail d'un projet

## Critères d'acceptation

- [ ] Les projets proviennent de l'API
- [ ] Les filtres category et status fonctionnent
- [ ] La soumission de projet fonctionne et persiste en DB
- [ ] Le système de likes fonctionne (1 like par user)
- [ ] Les vues sont comptabilisées
