# Tâche 6.4 - Upload avatar profil

**Epic :** 06 - Système d'Upload de Fichiers
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py` (ajouter champ avatar_url)
- `okampus-app/src/app/profil/page.tsx`
- `okampus-app/src/components/Navbar.tsx`

## Description

Permettre aux utilisateurs d'uploader une photo de profil au lieu d'afficher leurs initiales.

## Actions à réaliser

1. **Ajouter le champ `avatar_url` au modèle User**

2. **Bouton d'upload dans la page profil :**
   - Cliquer sur l'avatar → ouvrir le sélecteur de fichier
   - Prévisualiser l'image avant upload
   - Upload via `POST /upload` (folder: "avatars")
   - Sauvegarder l'URL via `PATCH /users/{id}`

3. **Afficher l'avatar partout :**
   - Navbar (au lieu des initiales)
   - Page profil
   - Posts du forum (auteur)
   - Réponses du forum
   - Fallback : initiales si pas d'avatar

4. **Composant Avatar réutilisable :**
   ```typescript
   function Avatar({ user, size }: { user: { name: string, avatar_url?: string }, size: number }) {
     if (user.avatar_url) return <img src={user.avatar_url} ... />;
     return <div>{getInitials(user.name)}</div>;
   }
   ```

## Critères d'acceptation

- [ ] L'upload d'avatar fonctionne (JPG, PNG, WebP)
- [ ] L'avatar est affiché dans la navbar et le profil
- [ ] Le fallback initiales fonctionne si pas d'avatar
- [ ] L'image est redimensionnée/compressée côté client avant upload
