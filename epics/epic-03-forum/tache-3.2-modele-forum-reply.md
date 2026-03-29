# Tâche 3.2 - Créer le modèle ForumReply

**Epic :** 03 - Forum Communautaire Complet
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py`
- `okampus-api/app/schemas.py`

## Description

Créer un modèle pour les réponses aux posts du forum.

## Actions à réaliser

1. **Ajouter le modèle `ForumReply` dans `models.py` :**
   ```python
   class ForumReply(Base):
       __tablename__ = "forum_replies"

       id = Column(String, primary_key=True, default=lambda: str(uuid4()))
       post_id = Column(String, ForeignKey("forum_posts.id", ondelete="CASCADE"), nullable=False)
       author_id = Column(String, ForeignKey("users.id"), nullable=False)
       content = Column(Text, nullable=False)
       created_at = Column(DateTime(timezone=True), server_default=func.now())
       updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

       # Relations
       post = relationship("ForumPost", back_populates="reply_list")
       author = relationship("User")
   ```

2. **Mettre à jour le modèle `ForumPost` :**
   ```python
   reply_list = relationship("ForumReply", back_populates="post", cascade="all, delete-orphan")
   ```

3. **Créer les schemas Pydantic :**
   ```python
   class ForumReplyCreate(BaseModel):
       content: constr(min_length=1, max_length=5000)

   class ForumReplyOut(BaseModel):
       id: str
       post_id: str
       author_id: str
       author_name: str
       content: str
       created_at: datetime
   ```

## Critères d'acceptation

- [ ] Le modèle ForumReply est créé avec les bonnes relations
- [ ] La suppression d'un post supprime ses réponses (CASCADE)
- [ ] Les schemas Pydantic sont créés et validés
- [ ] La table est auto-créée au démarrage de l'application
