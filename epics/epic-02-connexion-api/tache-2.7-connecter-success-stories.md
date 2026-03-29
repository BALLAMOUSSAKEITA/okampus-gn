# Tâche 2.7 - Connecter la page Success Stories

**Epic :** 02 - Connexion Frontend ↔ Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/success-stories/page.tsx`
- `okampus-api/app/routers/success_stories.py`

## Description

La page `/success-stories` affiche 5 témoignages mock. Connecter le listing avec distinction featured/regular.

## Actions à réaliser

1. **Remplacer les témoignages mock par `GET /success-stories` :**
   - Filtre : category (Career/Entrepreneur/Academic)
   - Le backend trie déjà par is_featured DESC, likes DESC

2. **Séparer featured et regular :**
   - Les stories avec `is_featured: true` → section cards en haut
   - Les autres → liste en dessous

3. **Connecter le formulaire de soumission :**
   - Créer un modal ou une page pour soumettre son témoignage
   - `POST /success-stories` avec les données du formulaire
   - Les nouvelles stories ne sont pas featured par défaut (admin les promeut)

4. **Système de likes :**
   - Ajouter un endpoint `POST /success-stories/{id}/like`
   - Bouton like côté frontend

## Critères d'acceptation

- [ ] Les témoignages proviennent de l'API
- [ ] La distinction featured/regular fonctionne
- [ ] Le filtre par catégorie fonctionne
- [ ] La soumission de témoignage fonctionne
