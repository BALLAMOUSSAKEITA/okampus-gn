# Tâche 7.7 - Gestion des prix en GNF

**Epic :** 07 - Système de Paiement
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/ressources/page.tsx`
- `okampus-api/app/schemas.py`

## Description

Afficher et gérer les prix en Francs Guinéens (GNF).

## Actions à réaliser

1. **Formateur de prix :**
   ```typescript
   function formatGNF(amount: number): string {
     return new Intl.NumberFormat('fr-GN', {
       style: 'currency',
       currency: 'GNF',
       minimumFractionDigits: 0
     }).format(amount);
   }
   // Ex: "5 000 GNF"
   ```

2. **Validation des prix :** Prix minimum 1 000 GNF, pas de centimes
3. **Affichage :** Utiliser le formateur partout où un prix est affiché

## Critères d'acceptation

- [ ] Les prix sont affichés au format "X 000 GNF"
- [ ] La validation empêche les prix invalides
- [ ] Le formateur est utilisé de manière cohérente
