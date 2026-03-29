# Tâche 11.5 - Recherche full-text PostgreSQL

**Epic :** 11 - Recherche Globale & Pagination
**Priorité :** Basse
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py`
- `okampus-api/app/routers/search.py`

## Description

Utiliser les capacités full-text de PostgreSQL pour une recherche performante en français.

## Actions à réaliser

1. **Ajouter des colonnes `tsvector` sur les modèles recherchables**
2. **Créer des index GIN pour la performance**
3. **Utiliser `ts_query` avec configuration française**
4. **Ranking des résultats par pertinence**

## Critères d'acceptation

- [ ] La recherche utilise les index full-text
- [ ] La recherche est performante (< 200ms)
- [ ] Le ranking par pertinence fonctionne
