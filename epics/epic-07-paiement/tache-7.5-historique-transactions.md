# Tâche 7.5 - Historique des transactions

**Epic :** 07 - Système de Paiement
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/payments.py`
- `okampus-app/src/app/profil/page.tsx`

## Description

Permettre aux utilisateurs de voir leur historique d'achats.

## Actions à réaliser

1. **Endpoint :** `GET /payments?user_id=` → Liste des paiements
2. **Section dans `/profil` :** Onglet "Mes achats" avec tableau des transactions
3. **Informations affichées :** Ressource, montant, date, statut, lien téléchargement

## Critères d'acceptation

- [ ] L'historique est accessible depuis le profil
- [ ] Chaque transaction montre le statut et le lien de téléchargement
