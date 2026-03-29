# Tâche 2.8 - Connecter la page Parcours

**Epic :** 02 - Connexion Frontend ↔ Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/parcours/page.tsx`
- `okampus-api/app/routers/parcours.py`

## Description

La page `/parcours` affiche des données mock (notes, objectifs, infos académiques). Connecter à l'API pour persister le parcours de l'étudiant.

## Actions à réaliser

1. **Charger le parcours depuis l'API :**
   - `GET /parcours/{userId}` au montage de la page
   - Si aucun parcours n'existe, afficher un formulaire de création

2. **Formulaire de configuration initiale :**
   - Université, filière, année en cours
   - Enregistrer via `PUT /parcours/{userId}`

3. **Onglet Notes :**
   - Charger les notes depuis le champ JSON `notes` du parcours
   - Formulaire d'ajout de note (matière, note, coefficient, semestre)
   - Sauvegarder via `PUT /parcours/{userId}`
   - Calcul de moyenne automatique côté frontend

4. **Onglet Objectifs :**
   - Charger depuis le champ JSON `objectifs`
   - Ajout/modification/suppression d'objectifs
   - Changement de statut (en cours → terminé → abandonné)
   - Sauvegarder via `PUT /parcours/{userId}`

5. **Auto-save ou bouton sauvegarder :**
   - Sauvegarder les modifications avec feedback visuel

## Critères d'acceptation

- [ ] Le parcours est chargé depuis l'API
- [ ] La création de parcours fonctionne si aucun n'existe
- [ ] Les notes sont sauvegardées en DB et la moyenne est correcte
- [ ] Les objectifs sont sauvegardés avec leur statut
- [ ] Un feedback visuel confirme la sauvegarde
