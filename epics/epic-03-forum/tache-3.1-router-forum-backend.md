# Tâche 3.1 - Créer le router forum backend

**Epic :** 03 - Forum Communautaire Complet
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/forum.py` (nouveau)
- `okampus-api/app/main.py` (enregistrer le router)
- `okampus-api/app/schemas.py` (nouveaux schemas)

## Description

Le modèle `ForumPost` existe dans `models.py` mais aucun router n'est implémenté. Créer le CRUD complet.

## Actions à réaliser

1. **Créer `routers/forum.py` avec les endpoints :**
   - `GET /forum` → Liste des posts avec filtres (category, search) + pagination
   - `GET /forum/{id}` → Détail d'un post (incrémente les vues)
   - `POST /forum` → Créer un post (requiert auth)
   - `PATCH /forum/{id}` → Modifier un post (auteur seulement)
   - `DELETE /forum/{id}` → Supprimer un post (auteur ou admin)

2. **Modifier le modèle ForumPost :**
   - Changer le champ `author` (String) en `author_id` (FK vers User)
   - Ajouter une relation `author` vers User
   - Ajouter `is_active` (Boolean, default True)

3. **Créer les schemas Pydantic :**
   ```python
   class ForumPostCreate(BaseModel):
       title: constr(min_length=5, max_length=200)
       content: constr(min_length=10, max_length=10000)
       category: str

   class ForumPostOut(BaseModel):
       id: str
       title: str
       content: str
       category: str
       author_id: str
       author_name: str
       replies: int
       views: int
       created_at: datetime
   ```

4. **Enregistrer le router dans `main.py` :**
   ```python
   from app.routers import forum
   app.include_router(forum.router, prefix="/forum", tags=["Forum"])
   ```

## Critères d'acceptation

- [ ] Tous les endpoints CRUD fonctionnent
- [ ] La création requiert un token d'authentification
- [ ] La modification/suppression est réservée à l'auteur (ou admin)
- [ ] Les filtres category et search fonctionnent
- [ ] Le router est enregistré et visible dans la doc Swagger
