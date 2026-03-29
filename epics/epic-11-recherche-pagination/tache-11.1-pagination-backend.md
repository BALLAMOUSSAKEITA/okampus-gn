# Tâche 11.1 - Pagination backend

**Epic :** 11 - Recherche Globale & Pagination
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- Tous les routers avec des endpoints GET liste

## Actions à réaliser

1. **Ajouter `skip` et `limit` sur tous les endpoints GET liste :**
   - `/forum`, `/resources`, `/stages`, `/scholarships`, `/entrepreneur`, `/success-stories`, `/advisors`, `/notifications`
   - Défaut : skip=0, limit=20, max limit=100

2. **Retourner le total dans la réponse :**
   ```python
   return {"items": results, "total": total_count, "skip": skip, "limit": limit}
   ```

3. **Helper réutilisable :**
   ```python
   async def paginate(db, query, skip, limit):
       total = await db.scalar(select(func.count()).select_from(query.subquery()))
       items = await db.scalars(query.offset(skip).limit(limit))
       return {"items": items.all(), "total": total, "skip": skip, "limit": limit}
   ```

## Critères d'acceptation

- [ ] Tous les endpoints liste supportent skip/limit
- [ ] Le total est retourné dans chaque réponse
- [ ] Le limit maximum est de 100
