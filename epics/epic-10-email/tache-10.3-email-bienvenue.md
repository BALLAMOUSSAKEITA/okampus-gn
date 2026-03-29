# Tâche 10.3 - Email de bienvenue

**Epic :** 10 - Service Email
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/auth.py`

## Actions à réaliser

1. **Envoyer un email après `POST /auth/register` :**
   - Sujet : "Bienvenue sur O'Kampus, {name} !"
   - Contenu : présentation de la plateforme, liens vers les fonctionnalités principales
2. **Envoi asynchrone** pour ne pas ralentir l'inscription

## Critères d'acceptation

- [ ] L'email est envoyé après chaque inscription réussie
- [ ] L'inscription n'est pas bloquée si l'email échoue
