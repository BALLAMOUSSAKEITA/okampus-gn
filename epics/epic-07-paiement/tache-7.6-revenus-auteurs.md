# Tâche 7.6 - Revenus des auteurs

**Epic :** 07 - Système de Paiement
**Priorité :** Basse
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/payments.py`
- `okampus-app/src/app/profil/page.tsx`

## Description

Permettre aux auteurs de ressources de voir leurs revenus.

## Actions à réaliser

1. **Endpoint :** `GET /payments/earnings` → Revenus de l'utilisateur connecté
   - Total des ventes
   - Ventes par ressource
   - Graphique des revenus par mois

2. **Section dans `/profil` :** Onglet "Mes revenus" pour les auteurs de ressources
3. **Dashboard simple :** Total gagné, nombre de ventes, top ressources

## Critères d'acceptation

- [ ] L'auteur voit le total de ses revenus
- [ ] Le détail par ressource est disponible
- [ ] Les revenus sont calculés correctement
