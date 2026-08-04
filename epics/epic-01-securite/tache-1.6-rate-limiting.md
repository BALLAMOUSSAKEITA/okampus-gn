# Tâche 1.6 - Ajouter Rate Limiting

**Epic :** 01 - Corrections Critiques & Sécurité
**Priorité :** Moyenne
**Statut :** [x] Terminé
**Fichiers concernés :**
- `okampus-api/requirements.txt`
- `okampus-api/app/main.py`
- `okampus-api/app/routers/auth.py`

## Description

Aucune protection contre les abus de requêtes. Un attaquant peut brute-force le login ou spammer les endpoints.

## Actions à réaliser

1. **Installer slowapi :**
   ```
   pip install slowapi
   ```
   Ajouter `slowapi==0.1.9` dans `requirements.txt`

2. **Configurer dans `main.py` :**
   ```python
   from slowapi import Limiter, _rate_limit_exceeded_handler
   from slowapi.util import get_remote_address
   from slowapi.errors import RateLimitExceeded

   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
   ```

3. **Appliquer les limites :**
   - `POST /auth/login` → `5/minute` (protection brute-force)
   - `POST /auth/register` → `3/minute` (anti-spam)
   - `POST /cv` (génération IA) → `10/hour` (coût OpenAI)
   - Endpoints GET → `60/minute` (usage normal)
   - Endpoints POST génériques → `30/minute`

4. **Réponse en cas de dépassement :**
   - HTTP 429 Too Many Requests
   - Header `Retry-After` avec le délai d'attente

## Critères d'acceptation

- [x] Le login est limité à 5 tentatives par minute par IP
- [x] La génération de CV est limitée à 10 par heure
- [x] Un HTTP 429 est retourné avec un message clair en cas de dépassement
- [x] Les limites n'impactent pas l'usage normal de la plateforme
