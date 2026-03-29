# Tâche 5.4 - Historique des conversations

**Epic :** 05 - Assistant IA Intelligent
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py`
- `okampus-api/app/routers/assistant.py`
- `okampus-app/src/app/assistant/page.tsx`

## Description

Sauvegarder les conversations avec l'assistant pour permettre la continuité entre sessions.

## Actions à réaliser

1. **Créer les modèles :**
   ```python
   class Conversation(Base):
       __tablename__ = "conversations"
       id = Column(String, primary_key=True)
       user_id = Column(String, ForeignKey("users.id"))
       title = Column(String)  # Généré depuis le premier message
       created_at = Column(DateTime, server_default=func.now())
       updated_at = Column(DateTime, onupdate=func.now())
       messages = relationship("ConversationMessage", back_populates="conversation")

   class ConversationMessage(Base):
       __tablename__ = "conversation_messages"
       id = Column(String, primary_key=True)
       conversation_id = Column(String, ForeignKey("conversations.id"))
       role = Column(String)  # "user" ou "assistant"
       content = Column(Text)
       created_at = Column(DateTime, server_default=func.now())
   ```

2. **Endpoints :**
   - `GET /assistant/conversations` → Liste des conversations de l'utilisateur
   - `GET /assistant/conversations/{id}` → Messages d'une conversation
   - `DELETE /assistant/conversations/{id}` → Supprimer une conversation

3. **Frontend :**
   - Sidebar avec la liste des conversations passées
   - Cliquer sur une conversation → recharger les messages
   - Bouton "Nouvelle conversation"
   - Titre auto-généré depuis le premier message

## Critères d'acceptation

- [ ] Les messages sont sauvegardés en DB après chaque échange
- [ ] L'utilisateur peut reprendre une conversation passée
- [ ] La liste des conversations est affichée dans une sidebar
- [ ] La suppression d'une conversation fonctionne
