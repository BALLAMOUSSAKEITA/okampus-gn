# Tâche 7.1 - Intégrer un provider de paiement

**Epic :** 07 - Système de Paiement
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/services/payment.py` (nouveau)
- `okampus-api/app/config.py`
- `okampus-api/requirements.txt`

## Description

Choisir et intégrer un provider de paiement adapté au marché guinéen (mobile money).

## Options

| Provider | Méthodes | Avantages |
|----------|----------|-----------|
| PayDunya | Orange Money, MTN, Carte | API simple, adapté Afrique de l'Ouest |
| Stripe | Carte, Apple Pay | Standard mondial, pas de mobile money local |
| Fedapay | Mobile Money, Carte | Afrique francophone |

**Recommandation : PayDunya** (supporte Orange Money et MTN Money en Guinée)

## Actions à réaliser

1. **Créer un compte PayDunya (ou alternative)**
2. **Installer le SDK Python :**
   ```
   pip install paydunya
   ```

3. **Créer le service `payment.py` :**
   ```python
   class PaymentService:
       def initiate_payment(self, amount: float, description: str, callback_url: str) -> dict:
           # Créer une facture PayDunya
           # Retourner l'URL de paiement ou le code USSD

       def verify_payment(self, token: str) -> dict:
           # Vérifier le statut du paiement
   ```

4. **Variables d'environnement :**
   ```
   PAYDUNYA_MASTER_KEY=xxx
   PAYDUNYA_PRIVATE_KEY=xxx
   PAYDUNYA_PUBLIC_KEY=xxx
   PAYDUNYA_MODE=test  # test ou live
   ```

## Critères d'acceptation

- [ ] Le SDK est installé et configuré
- [ ] Le service peut initier un paiement en mode test
- [ ] Le service peut vérifier le statut d'un paiement
- [ ] Les variables d'environnement sont documentées
