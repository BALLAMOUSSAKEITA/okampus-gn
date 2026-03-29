# Tâche 10.4 - Réinitialisation mot de passe

**Epic :** 10 - Service Email
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/auth.py`
- `okampus-api/app/models.py`

## Actions à réaliser

1. **`POST /auth/forgot-password` :**
   - Input : email
   - Générer un token unique (UUID + expiration 1h)
   - Sauvegarder le token en DB (modèle `PasswordResetToken`)
   - Envoyer un email avec le lien : `{FRONTEND_URL}/reset-password?token={token}`
   - Toujours retourner 200 (même si l'email n'existe pas, pour la sécurité)

2. **`POST /auth/reset-password` :**
   - Input : token, new_password
   - Vérifier que le token est valide et non expiré
   - Changer le mot de passe de l'utilisateur
   - Invalider le token
   - Envoyer un email de confirmation

3. **Modèle PasswordResetToken :**
   - id, user_id, token, expires_at, used

## Critères d'acceptation

- [ ] Le flux complet fonctionne (demande → email → lien → nouveau mot de passe)
- [ ] Le token expire après 1h
- [ ] Le token ne peut être utilisé qu'une fois
- [ ] Aucune information n'est divulguée (email existe ou non)
