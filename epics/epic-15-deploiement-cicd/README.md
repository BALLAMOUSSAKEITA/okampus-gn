# Epic 15 : Déploiement, CI/CD & Monitoring

**Priorité :** BASSE
**Phase :** 5 (Qualité)
**Objectif :** Mettre en place le pipeline CI/CD, le monitoring et finaliser le déploiement production.

## Tâches

- [ ] [15.1 - Pipeline CI/CD](./tache-15.1-pipeline-cicd.md)
- [ ] [15.2 - Environnements staging/prod](./tache-15.2-environnements.md)
- [ ] [15.3 - Monitoring Sentry](./tache-15.3-monitoring-sentry.md)
- [ ] [15.4 - Uptime monitoring](./tache-15.4-uptime-monitoring.md)
- [ ] [15.5 - Backups DB](./tache-15.5-backups-db.md)
- [ ] [15.6 - Documentation API](./tache-15.6-documentation-api.md)
- [ ] [15.7 - HTTPS et headers sécurité](./tache-15.7-https-securite.md)
- [ ] [15.8 - Tests E2E Playwright](./tache-15.8-tests-e2e.md)
- [ ] [15.9 - Domaine personnalisé](./tache-15.9-domaine-personnalise.md)

## Critères de validation

- Le pipeline CI/CD bloque les PRs si les tests échouent
- Les erreurs sont trackées dans Sentry
- Les backups DB sont automatiques
- Le site est accessible via un domaine personnalisé avec HTTPS
