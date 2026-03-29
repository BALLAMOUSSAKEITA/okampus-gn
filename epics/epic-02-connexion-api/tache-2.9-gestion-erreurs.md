# Tâche 2.9 - Gestion d'erreurs unifiée

**Epic :** 02 - Connexion Frontend ↔ Backend
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/components/Toast.tsx` (nouveau)
- `okampus-app/src/context/ToastContext.tsx` (nouveau)
- `okampus-app/src/hooks/useFetch.ts`
- `okampus-app/src/lib/api.ts`

## Description

Créer un système unifié de gestion des erreurs et notifications pour toute l'application.

## Actions à réaliser

1. **Créer un composant Toast/Notification :**
   - Types : success (vert), error (rouge), warning (orange), info (bleu)
   - Auto-dismiss après 5 secondes
   - Position : en haut à droite
   - Stackable (plusieurs toasts simultanés)

2. **Créer un ToastContext :**
   ```typescript
   const { showToast } = useToast();
   showToast({ type: 'success', message: 'Sauvegardé avec succès' });
   showToast({ type: 'error', message: 'Erreur de connexion' });
   ```

3. **Mapper les erreurs HTTP en messages français :**
   - 400 → "Données invalides"
   - 401 → "Session expirée, veuillez vous reconnecter"
   - 403 → "Vous n'avez pas les droits pour cette action"
   - 404 → "Ressource non trouvée"
   - 429 → "Trop de requêtes, veuillez patienter"
   - 500 → "Erreur serveur, veuillez réessayer plus tard"
   - Network Error → "Impossible de contacter le serveur"

4. **Intégrer dans le hook `useFetch` :**
   - Afficher automatiquement un toast en cas d'erreur
   - Option pour désactiver le toast auto (certaines pages gèrent elles-mêmes)

5. **Gestion de la session expirée :**
   - Si 401 reçu, rediriger vers `/inscription` et afficher un message

## Critères d'acceptation

- [ ] Le composant Toast s'affiche correctement avec les 4 types
- [ ] Les erreurs API affichent automatiquement un toast
- [ ] Les messages d'erreur sont en français et compréhensibles
- [ ] La session expirée redirige vers la page de connexion
- [ ] Plusieurs toasts peuvent s'afficher simultanément
