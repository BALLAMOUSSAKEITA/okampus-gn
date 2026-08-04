# Tâche 11.4 - Barre de recherche navbar

**Epic :** 11 - Recherche Globale & Pagination
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/components/Navbar.tsx`
- `okampus-app/src/components/SearchDropdown.tsx` (nouveau)

## Actions à réaliser

1. **Input de recherche dans la navbar** (icône loupe, expand on click)
2. **Dropdown de résultats :** Résultats groupés par catégorie avec icônes
3. **Debounce :** Attendre 300ms après la dernière frappe avant d'appeler l'API
4. **Navigation :** Cliquer sur un résultat → naviguer vers la page correspondante

## Critères d'acceptation

- [ ] La barre de recherche est intégrée dans la navbar
- [ ] Les résultats s'affichent en dropdown
- [ ] Le debounce évite les appels excessifs
- [ ] La navigation fonctionne
