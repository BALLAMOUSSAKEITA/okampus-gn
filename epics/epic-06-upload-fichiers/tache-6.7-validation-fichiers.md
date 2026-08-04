# Tâche 6.7 - Validation des fichiers

**Epic :** 06 - Système d'Upload de Fichiers
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/upload.py`
- `okampus-api/app/utils/file_validation.py` (nouveau)

## Description

Valider rigoureusement les fichiers uploadés pour éviter les failles de sécurité.

## Actions à réaliser

1. **Validation du type MIME :**
   - Vérifier le Content-Type du fichier
   - Vérifier aussi les magic bytes (les premiers octets du fichier)
   - Ne pas se fier uniquement à l'extension

2. **Whitelist par dossier :**
   ```python
   ALLOWED_TYPES = {
       "resources": ["application/pdf", "application/vnd.openxmlformats-officedocument.*"],
       "avatars": ["image/jpeg", "image/png", "image/webp"],
       "images": ["image/jpeg", "image/png", "image/webp", "image/gif"],
   }
   MAX_SIZES = {
       "resources": 10 * 1024 * 1024,  # 10MB
       "avatars": 2 * 1024 * 1024,     # 2MB
       "images": 5 * 1024 * 1024,      # 5MB
   }
   ```

3. **Nettoyage des noms de fichiers :**
   - Retirer les caractères spéciaux
   - Ajouter un UUID pour éviter les collisions
   - Limiter la longueur du nom

4. **Protection contre les attaques :**
   - Pas d'exécution de fichiers uploadés
   - Pas de path traversal (../)
   - Content-Disposition: attachment pour forcer le téléchargement

## Critères d'acceptation

- [ ] Seuls les types MIME autorisés sont acceptés
- [ ] La taille maximale est respectée par type de dossier
- [ ] Les noms de fichiers sont sanitisés
- [ ] Un 400 est retourné avec un message clair pour les fichiers invalides
