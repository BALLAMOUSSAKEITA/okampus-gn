# Tâche 3.4 - Compteurs automatiques forum

**Epic :** 03 - Forum Communautaire Complet
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/forum.py`

## Description

Implémenter les compteurs de vues et de réponses de manière fiable.

## Actions à réaliser

1. **Compteur de vues :**
   - Incrémenter `views` sur `GET /forum/{id}` (détail du post)
   - Éviter les vues multiples : ne compter qu'une vue par utilisateur par post par session
   - Option simple : incrémenter à chaque appel (acceptable en V1)

2. **Compteur de réponses :**
   - Incrémenter `replies` sur `POST /forum/{post_id}/replies`
   - Décrémenter sur `DELETE /forum/{post_id}/replies/{id}`
   - Alternative : calculer dynamiquement avec `COUNT(*)` (plus fiable mais plus lent)

3. **Cohérence :**
   - Script de recalcul des compteurs si nécessaire
   - Les compteurs doivent toujours être >= 0

## Critères d'acceptation

- [ ] Les vues sont incrémentées quand un post est consulté
- [ ] Le compteur de réponses est mis à jour à chaque ajout/suppression
- [ ] Les compteurs ne deviennent jamais négatifs
