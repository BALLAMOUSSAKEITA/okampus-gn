# Tâche 8.5 - Cloche de notifications frontend

**Epic :** 08 - Système de Notifications
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/components/Navbar.tsx`
- `okampus-app/src/components/NotificationDropdown.tsx` (nouveau)

## Actions à réaliser

1. **Icône cloche dans la Navbar :**
   - Badge rouge avec le nombre de non-lues
   - Cliquer → dropdown avec les 5 dernières notifications
   - Lien "Voir toutes les notifications" en bas

2. **Polling ou SSE :**
   - Polling toutes les 30 secondes sur `GET /notifications/count`
   - Ou Server-Sent Events pour du temps réel (V2)

3. **Dropdown :**
   - Titre + message tronqué
   - Indicateur non-lu (point bleu)
   - Cliquer → naviguer vers le lien + marquer comme lu

## Critères d'acceptation

- [ ] La cloche est visible dans la navbar
- [ ] Le badge affiche le bon compteur
- [ ] Le dropdown affiche les notifications récentes
- [ ] Cliquer navigue et marque comme lu
