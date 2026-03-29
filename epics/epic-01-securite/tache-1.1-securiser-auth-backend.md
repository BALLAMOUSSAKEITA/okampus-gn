# Tâche 1.1 - Sécuriser l'authentification backend

**Epic :** 01 - Corrections Critiques & Sécurité
**Priorité :** Critique
**Statut :** [x] Terminé
**Fichiers concernés :**
- `okampus-api/app/routers/calendar.py`
- `okampus-api/app/routers/resources.py`
- `okampus-api/app/routers/entrepreneur.py`
- `okampus-api/app/routers/scholarships.py`
- `okampus-api/app/routers/success_stories.py`
- `okampus-api/app/routers/stages.py`
- `okampus-api/app/auth.py`

## Description

Actuellement, plusieurs endpoints POST/PUT/PATCH/DELETE n'exigent pas de token JWT. N'importe qui peut créer des bourses, stages, événements, etc. sans être authentifié.

## Actions à réaliser

1. **Ajouter `Depends(get_current_user)` sur tous les endpoints d'écriture :**
   - `POST /calendar` → requiert auth
   - `POST /resources` → requiert auth + associer `author_id` au user connecté
   - `POST /resources/{id}/purchase` → requiert auth + associer `user_id` au user connecté
   - `POST /entrepreneur` → requiert auth + associer `author_id` au user connecté
   - `POST /scholarships` → requiert auth (admin seulement après Epic 1.4)
   - `POST /success-stories` → requiert auth + associer `author_id` au user connecté
   - `POST /stages` → requiert auth (admin seulement après Epic 1.4)
   - `POST /stages/{id}/apply` → requiert auth + associer `user_id` au user connecté

2. **Supprimer les `user_id` / `author_id` du body des requêtes :**
   - Ces valeurs doivent être extraites du token JWT, pas envoyées par le client
   - Modifier les schemas Pydantic pour retirer ces champs des inputs

3. **Vérifier la cohérence :**
   - S'assurer que `get_current_user()` retourne bien un objet User complet
   - Ajouter des tests pour vérifier qu'un 401 est retourné sans token

## Critères d'acceptation

- [x] Aucun endpoint d'écriture n'est accessible sans token Bearer valide
- [x] Les `user_id`/`author_id` sont déduits du token, pas du body
- [x] Un 401 Unauthorized est retourné si le token est absent ou invalide
- [ ] Un 403 Forbidden est retourné si l'utilisateur n'a pas les droits (prévu dans Epic 1.4 - rôles admin)
