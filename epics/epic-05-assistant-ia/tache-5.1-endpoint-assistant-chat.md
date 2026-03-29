# Tâche 5.1 - Créer endpoint assistant chat

**Epic :** 05 - Assistant IA Intelligent
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/assistant.py` (nouveau)
- `okampus-api/app/main.py`
- `okampus-api/app/schemas.py`

## Description

Créer un endpoint backend qui reçoit le message de l'utilisateur et son profil, appelle OpenAI, et retourne la réponse en streaming.

## Actions à réaliser

1. **Créer `routers/assistant.py` :**
   ```python
   @router.post("/assistant/chat")
   async def chat(
       request: AssistantChatRequest,
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       # Construire le contexte avec le profil étudiant
       # Appeler OpenAI avec streaming
       # Retourner StreamingResponse
   ```

2. **Input schema :**
   ```python
   class AssistantChatRequest(BaseModel):
       message: str
       profile: Optional[dict]  # série, notes, intérêts
       conversation_id: Optional[str]  # pour continuer une conversation
   ```

3. **Streaming response :**
   - Utiliser `StreamingResponse` de FastAPI
   - Format Server-Sent Events (SSE) pour le streaming
   - Chaque chunk contient un morceau de la réponse

4. **Contexte OpenAI :**
   - System prompt spécialisé (voir tâche 5.2)
   - Historique des messages précédents (si conversation_id fourni)
   - Informations du profil étudiant

## Critères d'acceptation

- [ ] L'endpoint reçoit un message et retourne une réponse IA
- [ ] La réponse est streamée en temps réel
- [ ] Le profil étudiant est utilisé comme contexte
- [ ] L'authentification est requise
