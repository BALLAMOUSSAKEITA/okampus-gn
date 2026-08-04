# Tâche 2.1 - Créer un hook useFetch générique

**Epic :** 02 - Connexion Frontend ↔ Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/hooks/useFetch.ts` (nouveau)
- `okampus-app/src/lib/api.ts`

## Description

Créer un hook React réutilisable pour tous les appels API, avec gestion automatique du loading, des erreurs, du token d'authentification et du rafraîchissement.

## Actions à réaliser

1. **Créer le hook `useFetch<T>` :**
   ```typescript
   interface UseFetchResult<T> {
     data: T | null;
     loading: boolean;
     error: string | null;
     refetch: () => Promise<void>;
   }

   function useFetch<T>(path: string, options?: {
     params?: Record<string, string>;
     enabled?: boolean;
   }): UseFetchResult<T>
   ```

2. **Fonctionnalités :**
   - Récupère automatiquement le token depuis la session NextAuth
   - Ajoute le header `Authorization: Bearer {token}`
   - Gère les états loading/error/data
   - Supporte les query params pour les filtres
   - `enabled` permet de conditionner l'appel (ex: attendre que le user soit chargé)
   - `refetch()` permet de relancer la requête manuellement

3. **Créer un helper `useApiMutation` pour les POST/PUT/PATCH :**
   ```typescript
   function useApiMutation<TInput, TOutput>(
     path: string,
     method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
   ): {
     mutate: (data: TInput) => Promise<TOutput>;
     loading: boolean;
     error: string | null;
   }
   ```

## Critères d'acceptation

- [ ] Le hook gère automatiquement le token d'authentification
- [ ] Les états loading/error/data sont correctement mis à jour
- [ ] Le hook supporte les query params pour les filtres
- [ ] `useApiMutation` permet les opérations d'écriture
- [ ] Les erreurs HTTP sont transformées en messages lisibles en français
