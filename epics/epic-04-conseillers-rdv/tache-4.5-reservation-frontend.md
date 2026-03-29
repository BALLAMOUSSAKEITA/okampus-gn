# Tâche 4.5 - Système de réservation frontend

**Epic :** 04 - Système de Conseillers & Rendez-vous
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/conseil/page.tsx`
- `okampus-app/src/components/BookingModal.tsx` (nouveau)

## Description

Créer un modal de réservation connecté à l'API des appointments.

## Actions à réaliser

1. **Créer le composant `BookingModal` :**
   - Sélection de la date (calendrier ou date picker)
   - Affichage des créneaux disponibles pour la date choisie
   - Créneaux grisés si déjà réservés
   - Bouton de confirmation

2. **Flux de réservation :**
   - Sélectionner un advisor → ouvrir le modal
   - Choisir une date → charger les créneaux (`GET /advisors/{id}/slots?date=`)
   - Sélectionner un créneau → confirmer
   - `POST /appointments` → afficher confirmation avec lien Meet

3. **Confirmation :**
   - Afficher un récapitulatif : advisor, date, heure, lien Meet
   - Bouton "Copier le lien Meet"
   - Toast de succès

4. **Gestion d'erreurs :**
   - Créneau plus disponible → message d'erreur + rafraîchir les créneaux
   - Pas de créneaux disponibles → message informatif

## Critères d'acceptation

- [ ] Le modal affiche les créneaux disponibles par date
- [ ] La réservation est envoyée à l'API
- [ ] Le lien Meet est affiché après confirmation
- [ ] Les erreurs de conflit sont gérées gracieusement
