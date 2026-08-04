# Tâche 3.6 - Page détail d'un post forum

**Epic :** 03 - Forum Communautaire Complet
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/forum/[id]/page.tsx` (nouveau)

## Description

Créer une page dédiée pour afficher un post et ses réponses.

## Actions à réaliser

1. **Créer la page `/forum/[id]` :**
   - Charger le post via `GET /forum/{id}`
   - Charger les réponses via `GET /forum/{id}/replies`

2. **Layout de la page :**
   - En-tête : titre, auteur (avatar + nom), date, catégorie badge, vues
   - Corps : contenu du post (formaté, possiblement avec markdown)
   - Séparateur
   - Section réponses : liste des réponses avec auteur, date, contenu
   - Formulaire de réponse en bas (textarea + bouton "Répondre")

3. **Formulaire de réponse :**
   - `POST /forum/{id}/replies` avec le contenu
   - Ajouter la nouvelle réponse à la liste sans recharger la page
   - Vider le formulaire après envoi
   - Toast de confirmation

4. **Actions sur le post :**
   - Bouton "Modifier" (si auteur) → modal d'édition
   - Bouton "Supprimer" (si auteur) → confirmation + redirection vers `/forum`

5. **Navigation :**
   - Lien retour vers `/forum`
   - Breadcrumb : Forum > [Catégorie] > [Titre du post]

## Critères d'acceptation

- [ ] Le post et ses réponses s'affichent correctement
- [ ] Le formulaire de réponse fonctionne
- [ ] La nouvelle réponse apparaît immédiatement
- [ ] Les actions modifier/supprimer sont réservées à l'auteur
- [ ] La page gère les cas 404 (post inexistant)
