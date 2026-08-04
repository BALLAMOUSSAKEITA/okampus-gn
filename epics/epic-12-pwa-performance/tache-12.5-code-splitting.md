# Tâche 12.5 - Code splitting

**Epic :** 12 - PWA & Performance
**Priorité :** Basse
**Statut :** [ ] À faire

## Actions à réaliser

1. **Lazy load des modals** avec `dynamic()` de Next.js
2. **Vérifier le bundle analyzer** : `npm run build` et analyser les chunks
3. **Séparer les dépendances lourdes** (chart.js, openai SDK) en chunks séparés

## Critères d'acceptation

- [ ] Les modals sont chargés à la demande
- [ ] Le bundle initial est < 200KB gzipped
- [ ] Pas de dépendance lourde dans le bundle initial
