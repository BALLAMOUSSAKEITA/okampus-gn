# Tâche 9.5 - Modération du contenu

**Epic :** 09 - Dashboard Admin
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py` (ajouter champ status)
- `okampus-api/app/routers/admin.py`

## Actions à réaliser

1. **Ajouter un champ `status` aux contenus modérables :**
   - ForumPost, Resource, EntrepreneurProject, SuccessStory
   - Status : "pending", "approved", "rejected"
   - Par défaut : "approved" (modération a posteriori) ou "pending" (modération a priori)

2. **Système de signalement :**
   - Modèle `Report` : user_id, content_type, content_id, reason, created_at
   - `POST /report` → Signaler un contenu
   - `GET /admin/reports` → Liste des signalements

3. **Actions admin :**
   - Approuver / Rejeter un contenu signalé
   - Supprimer un contenu
   - Bannir l'auteur si récidive

## Critères d'acceptation

- [ ] Les utilisateurs peuvent signaler du contenu
- [ ] L'admin voit les signalements dans le dashboard
- [ ] L'admin peut approuver/rejeter/supprimer du contenu
