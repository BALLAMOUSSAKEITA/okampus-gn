# Tâche 4.3 - Logique de créneaux

**Epic :** 04 - Système de Conseillers & Rendez-vous
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/appointments.py`
- `okampus-api/app/routers/advisors.py`

## Description

Implémenter la logique de disponibilité des créneaux pour éviter les double-réservations.

## Actions à réaliser

1. **Vérification à la réservation :**
   - Avant de créer un appointment, vérifier qu'aucun autre appointment avec le même advisor à la même date+heure n'existe (status != cancelled)
   - Retourner 409 Conflict si le créneau est pris

2. **Calcul des créneaux disponibles :**
   - L'advisor définit ses créneaux dans `available_slots` (ex: ["Lundi 14h-16h", "Mercredi 10h-12h"])
   - Endpoint `GET /advisors/{id}/slots?date=YYYY-MM-DD` :
     - Retourner les créneaux du jour de la semaine correspondant
     - Exclure les créneaux déjà réservés

3. **Format des créneaux :**
   - Stocker en format structuré : `{ day: "monday", start: "14:00", end: "16:00" }`
   - Ou garder le format string actuel et parser côté backend

4. **Gestion des annulations :**
   - Un créneau annulé redevient disponible

## Critères d'acceptation

- [ ] Impossible de réserver un créneau déjà pris
- [ ] Les créneaux disponibles sont calculés dynamiquement
- [ ] Les annulations libèrent les créneaux
- [ ] Un 409 est retourné en cas de conflit
