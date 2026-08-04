# Tâche 2.5 - Connecter la page Calendrier

**Epic :** 02 - Connexion Frontend ↔ Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/calendrier/page.tsx`
- `okampus-api/app/routers/calendar.py`

## Description

La page `/calendrier` affiche 8 événements mock. Connecter à `GET /calendar`.

## Actions à réaliser

1. **Remplacer les événements mock par `GET /calendar` :**
   - Filtre par type d'événement (universitaire/national/examen/vacances/autre)

2. **Adapter le format des dates :**
   - Le backend stocke `start_date` et `end_date` comme strings
   - Formater côté frontend en français (ex: "15 Octobre 2025")

3. **Seed data :**
   - Script pour peupler le calendrier avec les vraies dates universitaires guinéennes 2024-2025
   - Jours fériés nationaux de Guinée
   - Périodes d'examen types

4. **Garder la vue timeline :**
   - Trier par start_date ascendant
   - Grouper par mois si possible

## Critères d'acceptation

- [ ] Les événements proviennent de l'API
- [ ] Le filtre par type fonctionne
- [ ] Les dates sont formatées en français
- [ ] Les données seed reflètent le vrai calendrier guinéen
