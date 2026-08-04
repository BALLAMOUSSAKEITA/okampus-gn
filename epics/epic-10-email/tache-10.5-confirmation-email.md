# Tâche 10.5 - Confirmation d'email

**Epic :** 10 - Service Email
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py`
- `okampus-api/app/routers/auth.py`

## Actions à réaliser

1. **Ajouter `email_verified: bool = False` au modèle User**
2. **Envoyer un email de vérification à l'inscription** avec un lien unique
3. **`GET /auth/verify-email?token=`** → Marquer l'email comme vérifié
4. **Restreindre certaines actions aux emails vérifiés** (poster sur le forum, acheter)
5. **Bouton "Renvoyer l'email de vérification" dans le profil**

## Critères d'acceptation

- [ ] L'email de vérification est envoyé à l'inscription
- [ ] Le clic sur le lien marque l'email comme vérifié
- [ ] Certaines actions sont restreintes aux emails vérifiés
