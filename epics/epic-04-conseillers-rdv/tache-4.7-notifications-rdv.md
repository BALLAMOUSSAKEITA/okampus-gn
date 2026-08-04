# Tâche 4.7 - Notifications de rendez-vous

**Epic :** 04 - Système de Conseillers & Rendez-vous
**Priorité :** Basse
**Statut :** [ ] À faire
**Dépendances :** Epic 08 (Notifications) et Epic 10 (Email)

## Description

Envoyer des notifications et emails pour les événements liés aux rendez-vous.

## Actions à réaliser

1. **Notifications in-app (dépend Epic 08) :**
   - Nouvelle demande de RDV → notification à l'advisor
   - RDV confirmé → notification à l'étudiant
   - RDV annulé → notification à l'autre partie
   - Rappel 1h avant le RDV → notification aux deux

2. **Notifications email (dépend Epic 10) :**
   - Email de confirmation avec détails + lien Meet
   - Email de rappel 24h avant
   - Email d'annulation

3. **Intégration :**
   - Appeler le service de notifications depuis le router appointments
   - Lors de `POST /appointments` → notifier l'advisor
   - Lors de `PATCH /appointments/{id}` (status change) → notifier l'autre partie

## Critères d'acceptation

- [ ] L'advisor reçoit une notification quand un RDV est demandé
- [ ] L'étudiant reçoit une notification quand le RDV est confirmé/annulé
- [ ] Les emails contiennent les détails et le lien Meet
- [ ] Un rappel est envoyé avant le RDV
