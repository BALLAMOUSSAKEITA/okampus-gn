# Tâche 10.1 - Configurer le service email

**Epic :** 10 - Service Email
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/services/email.py` (nouveau)
- `okampus-api/app/config.py`
- `okampus-api/requirements.txt`

## Description

Intégrer un service d'envoi d'emails. Recommandation : Resend (gratuit jusqu'à 3000 emails/mois).

## Actions à réaliser

1. **Installer le SDK :** `pip install resend`
2. **Créer le service :**
   ```python
   class EmailService:
       async def send(self, to: str, subject: str, html: str):
           resend.Emails.send({
               "from": "O'Kampus <noreply@okampus.gn>",
               "to": to,
               "subject": subject,
               "html": html
           })
   ```
3. **Variables d'environnement :** `RESEND_API_KEY`

## Critères d'acceptation

- [ ] Le service d'email est configuré
- [ ] Un email test peut être envoyé et reçu
