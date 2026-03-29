# Tâche 6.6 - Téléchargement sécurisé

**Epic :** 06 - Système d'Upload de Fichiers
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/resources.py`
- `okampus-api/app/services/storage.py`

## Description

Les ressources premium ne doivent être téléchargeables que par les utilisateurs ayant effectué l'achat.

## Actions à réaliser

1. **Endpoint de téléchargement sécurisé :**
   ```python
   @router.get("/resources/{id}/download")
   async def download_resource(
       id: str,
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ):
       resource = await get_resource(id, db)
       if resource.is_premium:
           purchase = await check_purchase(current_user.id, id, db)
           if not purchase:
               raise HTTPException(403, "Veuillez acheter cette ressource")
       # Générer URL signée avec expiration
       signed_url = storage.generate_presigned_url(resource.file_url, expiration=3600)
       return {"download_url": signed_url}
   ```

2. **URLs signées :**
   - Générer des URLs avec expiration (1h)
   - L'URL directe du fichier n'est pas exposée publiquement pour les resources premium

3. **Frontend :**
   - Bouton "Télécharger" pour les ressources gratuites → téléchargement direct
   - Bouton "Acheter" pour les ressources premium → flux d'achat puis téléchargement

## Critères d'acceptation

- [ ] Les ressources gratuites sont téléchargeables par tous les utilisateurs connectés
- [ ] Les ressources premium nécessitent un achat
- [ ] Les URLs signées expirent après 1h
- [ ] Le compteur de téléchargements est incrémenté
