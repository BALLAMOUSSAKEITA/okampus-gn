# Tâche 6.3 - Upload de ressources

**Epic :** 06 - Système d'Upload de Fichiers
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/ressources/page.tsx`

## Description

Connecter le modal d'upload de ressources à l'endpoint d'upload de fichiers.

## Actions à réaliser

1. **Modifier le formulaire d'upload :**
   - Étape 1 : Upload du fichier via `POST /upload` (folder: "resources")
   - Étape 2 : Créer la ressource via `POST /resources` avec l'URL retournée
   - Afficher une progress bar pendant l'upload

2. **Drag & drop :**
   - Le composant drag & drop existe déjà dans le modal
   - Connecter l'événement drop à l'upload réel
   - Afficher le nom et la taille du fichier sélectionné

3. **Validation frontend :**
   - Vérifier le type de fichier avant l'envoi
   - Vérifier la taille (max 10MB)
   - Message d'erreur si le fichier est invalide

4. **Feedback utilisateur :**
   - Progress bar pendant l'upload
   - Toast de succès après création
   - Rafraîchir la liste des ressources

## Critères d'acceptation

- [ ] L'upload de fichier fonctionne (PDF, DOCX, etc.)
- [ ] La progress bar s'affiche pendant l'upload
- [ ] La ressource est créée en DB avec l'URL du fichier
- [ ] La validation côté client empêche les fichiers invalides
