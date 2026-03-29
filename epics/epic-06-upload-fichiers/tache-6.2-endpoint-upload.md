# Tâche 6.2 - Endpoint upload backend

**Epic :** 06 - Système d'Upload de Fichiers
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/upload.py` (nouveau)
- `okampus-api/app/main.py`

## Description

Créer un endpoint générique d'upload de fichiers avec validation.

## Actions à réaliser

1. **Créer `routers/upload.py` :**
   ```python
   @router.post("/upload")
   async def upload_file(
       file: UploadFile = File(...),
       folder: str = Form("general"),
       current_user: User = Depends(get_current_user),
       storage: StorageService = Depends(get_storage)
   ):
       # Valider le fichier
       validate_file(file, folder)
       # Upload
       url = await storage.upload(file, folder)
       return {"url": url, "filename": file.filename, "size": file.size}
   ```

2. **Validation par type de dossier :**
   - `resources` : PDF, DOCX, PPTX, XLSX (max 10MB)
   - `avatars` : JPG, PNG, WebP (max 2MB)
   - `images` : JPG, PNG, WebP, GIF (max 5MB)

3. **Retour :**
   - URL publique du fichier uploadé
   - Nom original du fichier
   - Taille en bytes

## Critères d'acceptation

- [ ] L'upload fonctionne pour les 3 types (resources, avatars, images)
- [ ] Les types MIME sont validés
- [ ] La taille maximale est respectée
- [ ] Un 400 est retourné pour les fichiers invalides
- [ ] L'authentification est requise
