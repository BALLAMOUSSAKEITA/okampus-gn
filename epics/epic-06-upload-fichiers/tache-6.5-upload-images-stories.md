# Tâche 6.5 - Upload images success stories

**Epic :** 06 - Système d'Upload de Fichiers
**Priorité :** Basse
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/success-stories/page.tsx`

## Description

Permettre l'ajout d'images pour les témoignages de réussite.

## Actions à réaliser

1. **Ajouter un champ image dans le formulaire de soumission :**
   - Input file pour sélectionner une image
   - Prévisualisation avant upload
   - Upload via `POST /upload` (folder: "images")
   - Passer l'URL dans `POST /success-stories`

2. **Afficher les images :**
   - Image de couverture pour les stories featured
   - Thumbnail dans la liste des stories
   - Fallback : image placeholder si pas d'image

## Critères d'acceptation

- [ ] L'upload d'image fonctionne lors de la soumission d'une story
- [ ] Les images sont affichées dans les cards
- [ ] Un placeholder s'affiche si pas d'image
