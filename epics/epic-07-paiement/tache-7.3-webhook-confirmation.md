# Tâche 7.3 - Webhook de confirmation

**Epic :** 07 - Système de Paiement
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/payments.py`

## Description

Créer l'endpoint webhook qui reçoit la confirmation du provider de paiement.

## Actions à réaliser

1. **Endpoint webhook :**
   ```python
   @router.post("/payments/webhook")
   async def payment_webhook(request: Request, db: AsyncSession = Depends(get_db)):
       # Vérifier la signature du webhook
       # Mettre à jour le statut du paiement
       # Créer ResourcePurchase si succès
       # Envoyer notification à l'utilisateur
   ```

2. **Vérification de signature :**
   - Valider que le webhook vient bien du provider (pas de spoofing)
   - Utiliser la clé secrète du provider

3. **Actions post-paiement :**
   - Mettre à jour `payment.status = "completed"`
   - Créer `ResourcePurchase` pour débloquer la ressource
   - Incrémenter `resource.downloads`
   - Créer une notification (dépend Epic 08)

4. **Gestion des échecs :**
   - Si paiement échoué → `payment.status = "failed"`
   - Notifier l'utilisateur de l'échec

## Critères d'acceptation

- [ ] Le webhook est appelé par le provider après paiement
- [ ] La signature est vérifiée
- [ ] La ressource est débloquée après paiement réussi
- [ ] Les échecs sont gérés correctement
