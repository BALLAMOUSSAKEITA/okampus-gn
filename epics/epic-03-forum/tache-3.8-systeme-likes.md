# Tâche 3.8 - Système de likes forum

**Epic :** 03 - Forum Communautaire Complet
**Priorité :** Basse
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py`
- `okampus-api/app/routers/forum.py`
- `okampus-app/src/app/forum/[id]/page.tsx`

## Description

Permettre aux utilisateurs de liker des posts et réponses.

## Actions à réaliser

1. **Créer le modèle `ForumLike` :**
   ```python
   class ForumLike(Base):
       __tablename__ = "forum_likes"
       id = Column(String, primary_key=True)
       user_id = Column(String, ForeignKey("users.id"), nullable=False)
       post_id = Column(String, ForeignKey("forum_posts.id"), nullable=True)
       reply_id = Column(String, ForeignKey("forum_replies.id"), nullable=True)
       created_at = Column(DateTime(timezone=True), server_default=func.now())
       __table_args__ = (
           UniqueConstraint('user_id', 'post_id', name='unique_post_like'),
           UniqueConstraint('user_id', 'reply_id', name='unique_reply_like'),
       )
   ```

2. **Endpoints :**
   - `POST /forum/{id}/like` → Toggle like (ajouter si absent, supprimer si présent)
   - Retourner `{ liked: true/false, total_likes: N }`

3. **Frontend :**
   - Bouton coeur/pouce sur chaque post et réponse
   - Couleur différente si liké par l'utilisateur courant
   - Compteur de likes affiché

4. **Ajouter un champ `likes` au modèle ForumPost :**
   - Compteur dénormalisé pour éviter les COUNT à chaque affichage

## Critères d'acceptation

- [ ] Un utilisateur ne peut liker qu'une fois un post/réponse
- [ ] Le toggle like/unlike fonctionne
- [ ] Le compteur de likes est affiché et mis à jour
- [ ] L'état "liké" est visible pour l'utilisateur connecté
