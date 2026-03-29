# Tâche 7.4 - Page de paiement frontend

**Epic :** 07 - Système de Paiement
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/ressources/page.tsx`
- `okampus-app/src/components/PaymentModal.tsx` (nouveau)

## Description

Créer l'interface de paiement pour les ressources premium.

## Actions à réaliser

1. **Modal de paiement :**
   - Résumé : nom de la ressource, prix en GNF
   - Sélection du mode de paiement : Orange Money, MTN Money
   - Instructions de paiement (numéro USSD ou QR code)
   - Bouton "J'ai payé" → vérifier le statut

2. **Flux utilisateur :**
   - Cliquer "Acheter" sur une ressource premium
   - `POST /payments/initiate` → récupérer les instructions
   - Afficher les instructions
   - Polling du statut toutes les 5 secondes
   - Quand statut = "completed" → afficher "Paiement réussi" + bouton télécharger

3. **États :**
   - En attente : instructions affichées + spinner
   - Réussi : icône de succès + bouton télécharger
   - Échoué : message d'erreur + bouton réessayer
   - Timeout (5 min) : message de relance

## Critères d'acceptation

- [ ] Le modal affiche les instructions de paiement
- [ ] Le polling vérifie le statut automatiquement
- [ ] Le téléchargement est disponible après paiement
- [ ] Les erreurs et timeouts sont gérés
