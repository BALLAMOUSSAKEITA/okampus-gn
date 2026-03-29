# Tâche 15.7 - HTTPS et headers sécurité

**Epic :** 15 - Déploiement, CI/CD & Monitoring
**Priorité :** Haute
**Statut :** [ ] À faire

## Actions à réaliser

1. **Vérifier HTTPS :** Railway fournit SSL automatiquement
2. **Headers de sécurité dans Next.js :**
   ```javascript
   // next.config.ts
   headers: [
     { key: 'X-Frame-Options', value: 'DENY' },
     { key: 'X-Content-Type-Options', value: 'nosniff' },
     { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
     { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
   ]
   ```
3. **CSP (Content Security Policy) :** Configurer les sources autorisées
4. **Forcer HTTPS :** Rediriger HTTP → HTTPS

## Critères d'acceptation

- [ ] HTTPS fonctionne en production
- [ ] Les headers de sécurité sont en place
- [ ] Le CSP est configuré
