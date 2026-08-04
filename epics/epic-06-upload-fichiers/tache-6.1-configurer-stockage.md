# Tâche 6.1 - Configurer le stockage

**Epic :** 06 - Système d'Upload de Fichiers
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/config.py`
- `okampus-api/app/services/storage.py` (nouveau)
- `okampus-api/requirements.txt`

## Description

Choisir et configurer un service de stockage de fichiers pour la plateforme.

## Options de stockage

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| Railway Volume | Simple, inclus | Limité, pas de CDN |
| Cloudflare R2 | Gratuit (10GB), CDN, S3-compatible | Config supplémentaire |
| AWS S3 | Standard, fiable | Payant dès le début |
| Supabase Storage | Gratuit (1GB), simple | Dépendance externe |

**Recommandation : Cloudflare R2** (gratuit jusqu'à 10GB, CDN inclus, API S3-compatible)

## Actions à réaliser

1. **Créer un compte Cloudflare R2 (ou alternative choisie)**

2. **Installer boto3 (client S3) :**
   ```
   pip install boto3
   ```

3. **Créer le service `storage.py` :**
   ```python
   class StorageService:
       def __init__(self):
           self.client = boto3.client('s3',
               endpoint_url=settings.storage_endpoint,
               aws_access_key_id=settings.storage_key,
               aws_secret_access_key=settings.storage_secret,
           )
           self.bucket = settings.storage_bucket

       async def upload(self, file: UploadFile, folder: str) -> str:
           key = f"{folder}/{uuid4()}_{file.filename}"
           self.client.upload_fileobj(file.file, self.bucket, key)
           return f"{settings.storage_public_url}/{key}"

       async def delete(self, url: str) -> bool:
           key = url.replace(f"{settings.storage_public_url}/", "")
           self.client.delete_object(Bucket=self.bucket, Key=key)
           return True
   ```

4. **Variables d'environnement :**
   ```
   STORAGE_ENDPOINT=https://xxx.r2.cloudflarestorage.com
   STORAGE_KEY=xxx
   STORAGE_SECRET=xxx
   STORAGE_BUCKET=okampus
   STORAGE_PUBLIC_URL=https://pub-xxx.r2.dev
   ```

## Critères d'acceptation

- [ ] Le service de stockage est configuré et fonctionnel
- [ ] L'upload et le delete fonctionnent
- [ ] Les URLs publiques sont accessibles
- [ ] Les variables d'environnement sont documentées dans .env.example
