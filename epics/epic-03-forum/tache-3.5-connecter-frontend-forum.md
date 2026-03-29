# Tâche 3.5 - Connecter le frontend forum

**Epic :** 03 - Forum Communautaire Complet
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/forum/page.tsx`

## Description

Remplacer les 5 posts mock par des appels API réels et connecter le formulaire de création.

## Actions à réaliser

1. **Remplacer les données mock :**
   - Utiliser `useFetch<ForumPost[]>('/forum')` pour charger les posts
   - Passer les filtres catégorie et recherche en query params

2. **Connecter le modal "Nouveau post" :**
   - Envoyer `POST /forum` avec titre, contenu et catégorie
   - Rafraîchir la liste après création
   - Afficher un toast de succès

3. **Afficher les données réelles :**
   - Nom de l'auteur (depuis la relation, pas un champ string)
   - Nombre de réponses et vues réels
   - Date de création formatée en français

4. **Navigation vers le détail :**
   - Cliquer sur un post → `/forum/[id]` (page créée dans tâche 3.6)

## Critères d'acceptation

- [ ] Les posts proviennent de l'API
- [ ] Le filtre par catégorie fonctionne
- [ ] La recherche textuelle fonctionne
- [ ] La création de post fonctionne et rafraîchit la liste
- [ ] Navigation vers la page de détail
