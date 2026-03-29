# Tâche 8.4 - Événements déclencheurs

**Epic :** 08 - Système de Notifications
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- Tous les routers qui doivent déclencher des notifications

## Description

Intégrer `create_notification()` dans les flux existants.

## Événements à notifier

| Événement | Destinataire | Message |
|-----------|-------------|---------|
| Nouvelle réponse forum | Auteur du post | "Nouvelle réponse sur votre post : {title}" |
| RDV demandé | Advisor | "Nouvelle demande de RDV de {student_name}" |
| RDV confirmé | Étudiant | "Votre RDV avec {advisor_name} est confirmé" |
| RDV annulé | L'autre partie | "Le RDV du {date} a été annulé" |
| Candidature stage envoyée | Étudiant (confirmation) | "Votre candidature pour {stage_title} a été envoyée" |
| Paiement réussi | Acheteur | "Votre achat de {resource_title} est confirmé" |
| Paiement reçu | Auteur ressource | "{user_name} a acheté votre ressource {title}" |
| Nouvelle bourse | Tous les users du domaine | "Nouvelle bourse disponible : {title}" |
| Deadline bourse proche | Users intéressés | "La bourse {title} expire dans 3 jours" |

## Critères d'acceptation

- [ ] Chaque événement listé crée une notification
- [ ] Les notifications contiennent un lien vers la ressource concernée
- [ ] Les notifications ne sont pas créées pour l'auteur de l'action
