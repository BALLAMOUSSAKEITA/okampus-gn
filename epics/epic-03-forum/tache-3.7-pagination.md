# Tâche 3.7 - Pagination forum

**Epic :** 03 - Forum Communautaire Complet
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/forum.py`
- `okampus-app/src/app/forum/page.tsx`
- `okampus-app/src/components/Pagination.tsx` (nouveau)

## Description

Implémenter la pagination côté backend et frontend pour le forum (réutilisable par les autres pages).

## Actions à réaliser

1. **Backend - Ajouter pagination au `GET /forum` :**
   ```python
   @router.get("/")
   async def list_posts(
       skip: int = Query(0, ge=0),
       limit: int = Query(20, ge=1, le=100),
       category: Optional[str] = None,
       search: Optional[str] = None,
       db: AsyncSession = Depends(get_db)
   ):
       # Compter le total
       total = await db.scalar(select(func.count(ForumPost.id)).where(...))
       # Récupérer la page
       posts = await db.scalars(select(ForumPost).where(...).offset(skip).limit(limit))
       return {"items": posts, "total": total, "skip": skip, "limit": limit}
   ```

2. **Créer le composant `Pagination.tsx` :**
   - Afficher : "< 1 2 3 ... 10 >"
   - Props : `total`, `page`, `perPage`, `onChange`
   - Responsive : numéros sur desktop, précédent/suivant sur mobile

3. **Intégrer dans la page forum :**
   - État `page` dans le composant
   - Passer `skip = (page - 1) * 20` au hook useFetch

## Critères d'acceptation

- [ ] Le backend retourne `total`, `skip`, `limit` avec les items
- [ ] Le composant Pagination est réutilisable
- [ ] La navigation entre pages fonctionne
- [ ] Le composant est responsive
