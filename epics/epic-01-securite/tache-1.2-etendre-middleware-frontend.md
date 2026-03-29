# Tâche 1.2 - Étendre le middleware frontend

**Epic :** 01 - Corrections Critiques & Sécurité
**Priorité :** Critique
**Statut :** [x] Terminé
**Fichiers concernés :**
- `okampus-app/src/middleware.ts`

## Description

Actuellement, seules les routes `/profil` et `/cv` sont protégées par le middleware NextAuth. Les autres pages sensibles sont accessibles sans connexion.

## Actions à réaliser

1. **Étendre la liste des routes protégées dans `middleware.ts` :**
   ```typescript
   export const config = {
     matcher: [
       '/profil',
       '/cv',
       '/parcours',
       '/forum',
       '/conseil',
       '/stages',
       '/bourses',
       '/ressources',
       '/calendrier',
       '/entrepreneuriat',
       '/success-stories'
     ]
   }
   ```

2. **Vérifier la redirection :**
   - Un utilisateur non connecté accédant à une route protégée doit être redirigé vers `/inscription`
   - Après connexion, il doit être renvoyé vers la page qu'il tentait d'accéder (callback URL)

3. **Garder les pages publiques :**
   - `/` (landing page) → publique
   - `/inscription` → publique
   - `/assistant` → publique (pour inciter à s'inscrire)

## Critères d'acceptation

- [x] Toutes les routes listées redirigent vers `/inscription` si non connecté
- [x] La page d'accueil et `/inscription` restent accessibles sans connexion
- [x] Le callback URL fonctionne (redirection post-login vers la page demandée)
