# Tâche 10.7 - Frontend forgot password

**Epic :** 10 - Service Email
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/mot-de-passe-oublie/page.tsx` (nouveau)
- `okampus-app/src/app/reset-password/page.tsx` (nouveau)
- `okampus-app/src/app/inscription/page.tsx`

## Actions à réaliser

1. **Lien "Mot de passe oublié ?" dans la page de connexion**

2. **Page `/mot-de-passe-oublie` :**
   - Input email
   - Bouton "Envoyer le lien"
   - Message de confirmation : "Si un compte existe avec cet email, un lien vous a été envoyé"

3. **Page `/reset-password` :**
   - Lire le token depuis l'URL
   - Formulaire : nouveau mot de passe + confirmation
   - Validation (min 8 caractères, correspondance)
   - Message de succès + redirection vers connexion

## Critères d'acceptation

- [ ] Le lien "Mot de passe oublié" est visible sur la page de connexion
- [ ] Le flux complet fonctionne du frontend au backend
- [ ] Les validations sont en place
