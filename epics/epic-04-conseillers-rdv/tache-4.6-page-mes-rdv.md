# Tâche 4.6 - Page "Mes rendez-vous"

**Epic :** 04 - Système de Conseillers & Rendez-vous
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/profil/page.tsx`

## Description

Ajouter une section dans la page profil pour voir et gérer ses rendez-vous.

## Actions à réaliser

1. **Section "Mes rendez-vous" dans `/profil` :**
   - Charger via `GET /appointments`
   - Onglets : "À venir" / "Passés"

2. **Card de rendez-vous :**
   - Nom de l'advisor, domaine
   - Date et heure
   - Statut (badge coloré : pending=jaune, confirmed=vert, cancelled=rouge, completed=gris)
   - Lien Meet (si confirmé)
   - Bouton "Annuler" (si pending ou confirmed, date future)

3. **Vue advisor :**
   - Si l'utilisateur est advisor, afficher aussi les RDV reçus
   - Boutons "Confirmer" / "Refuser" pour les RDV pending

4. **États vides :**
   - "Aucun rendez-vous à venir" avec lien vers `/conseil`

## Critères d'acceptation

- [ ] Les RDV sont chargés depuis l'API
- [ ] La distinction à venir / passés fonctionne
- [ ] L'annulation met à jour le statut
- [ ] L'advisor peut confirmer/refuser les demandes
- [ ] Le lien Meet est accessible pour les RDV confirmés
