# Tâche 12.6 - Cache API Redis

**Epic :** 12 - PWA & Performance
**Priorité :** Basse
**Statut :** [ ] À faire

## Description

Ajouter un cache Redis côté backend pour les requêtes fréquentes.

## Actions à réaliser

1. **Installer Redis** (Railway addon ou Upstash gratuit)
2. **Cacher les endpoints fréquents :** GET /scholarships (TTL 5min), GET /calendar (TTL 10min), GET /resources (TTL 5min)
3. **Invalidation :** Invalider le cache après un POST/PUT/DELETE

## Critères d'acceptation

- [ ] Les endpoints fréquents sont cachés
- [ ] Le cache est invalidé après modification
- [ ] Le temps de réponse est réduit de > 50%
