# Tâche 3.3 - Endpoints réponses forum

**Epic :** 03 - Forum Communautaire Complet
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/forum.py`

## Description

Ajouter les endpoints pour lister et créer des réponses à un post du forum.

## Actions à réaliser

1. **`GET /forum/{post_id}/replies` :**
   - Retourne la liste des réponses triées par created_at ASC
   - Inclure le nom de l'auteur (jointure avec User)
   - Pagination : skip/limit (défaut 50 réponses)

2. **`POST /forum/{post_id}/replies` :**
   - Requiert authentification
   - Crée une réponse associée au post et à l'utilisateur connecté
   - Incrémente le compteur `replies` du ForumPost
   - Retourne la réponse créée (201)

3. **`DELETE /forum/{post_id}/replies/{reply_id}` :**
   - Réservé à l'auteur de la réponse ou admin
   - Décrémente le compteur `replies` du ForumPost
   - Retourne 204 No Content

4. **Validation :**
   - Vérifier que le post existe (404 sinon)
   - Vérifier que la réponse appartient bien au post

## Critères d'acceptation

- [ ] Les réponses sont listées par ordre chronologique
- [ ] La création de réponse requiert l'authentification
- [ ] Le compteur de réponses est cohérent
- [ ] La suppression est réservée à l'auteur ou admin
- [ ] Un 404 est retourné si le post n'existe pas
