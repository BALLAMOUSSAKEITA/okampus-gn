# Epic 01 : Corrections Critiques & Sécurité

**Priorité :** URGENTE
**Phase :** 1 (Fondations)
**Objectif :** Corriger les failles de sécurité et les bugs critiques avant tout développement.

## Tâches

- [ ] [1.1 - Sécuriser l'authentification backend](./tache-1.1-securiser-auth-backend.md)
- [ ] [1.2 - Étendre le middleware frontend](./tache-1.2-etendre-middleware-frontend.md)
- [ ] [1.3 - Corriger le bug CV langues](./tache-1.3-corriger-bug-cv-langues.md)
- [ ] [1.4 - Implémenter RBAC](./tache-1.4-implementer-rbac.md)
- [ ] [1.5 - Sécuriser les fichiers .env](./tache-1.5-securiser-env.md)
- [ ] [1.6 - Ajouter rate limiting](./tache-1.6-rate-limiting.md)
- [ ] [1.7 - Renforcer la validation des entrées](./tache-1.7-validation-entrees.md)

## Critères de validation

- Tous les endpoints POST/PUT/PATCH/DELETE requièrent un token JWT valide
- Les routes frontend sensibles redirigent vers /inscription si non authentifié
- Le bug de formatage des langues dans le CV est corrigé
- Un rôle admin existe et protège les endpoints sensibles
- Les fichiers .env ne sont pas exposés dans le repo
- Le rate limiting empêche les abus (login: 5/min, API: 60/min)
