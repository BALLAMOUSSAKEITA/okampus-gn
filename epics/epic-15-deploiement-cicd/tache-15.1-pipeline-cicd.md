# Tâche 15.1 - Pipeline CI/CD

**Epic :** 15 - Déploiement, CI/CD & Monitoring
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `.github/workflows/ci.yml` (nouveau)

## Actions à réaliser

1. **GitHub Actions workflow :**
   ```yaml
   name: CI
   on: [push, pull_request]
   jobs:
     backend:
       - Installer Python 3.12
       - pip install -r requirements.txt
       - Linting (ruff ou flake8)
       - Tests (pytest)
     frontend:
       - Installer Node 20
       - npm ci
       - Linting (eslint)
       - Build (next build)
   ```

2. **Branch protection :** Bloquer le merge si CI échoue
3. **Cache :** Cacher node_modules et pip pour accélérer

## Critères d'acceptation

- [ ] Le CI tourne sur chaque push et PR
- [ ] Les tests backend passent en CI
- [ ] Le build frontend réussit en CI
- [ ] Les PR ne peuvent pas être mergées si le CI échoue
