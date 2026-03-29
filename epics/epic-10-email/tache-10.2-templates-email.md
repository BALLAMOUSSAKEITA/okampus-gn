# Tâche 10.2 - Templates email

**Epic :** 10 - Service Email
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/templates/` (nouveau dossier)

## Actions à réaliser

1. **Créer des templates HTML responsive :**
   - `welcome.html` - Email de bienvenue
   - `reset_password.html` - Réinitialisation mot de passe
   - `verify_email.html` - Vérification d'adresse email
   - `appointment_confirmation.html` - Confirmation de RDV
   - `payment_confirmation.html` - Confirmation de paiement
   - `notification.html` - Template générique de notification

2. **Design :**
   - Couleurs O'Kampus (rouge, or, vert)
   - Logo en en-tête
   - Responsive (lisible sur mobile)
   - Footer avec liens utiles

3. **Système de templating :** Utiliser Jinja2 pour les variables dynamiques

## Critères d'acceptation

- [ ] Les templates sont créés et responsive
- [ ] Les variables dynamiques fonctionnent (nom, lien, etc.)
- [ ] Les emails sont lisibles sur Gmail, Yahoo, Outlook
