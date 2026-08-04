# Tâche 7.2 - Endpoint initiation paiement

**Epic :** 07 - Système de Paiement
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/payments.py` (nouveau)
- `okampus-api/app/models.py`
- `okampus-api/app/schemas.py`

## Description

Créer les endpoints pour initier et gérer les paiements.

## Actions à réaliser

1. **Modèle `Payment` :**
   ```python
   class Payment(Base):
       __tablename__ = "payments"
       id = Column(String, primary_key=True)
       user_id = Column(String, ForeignKey("users.id"))
       resource_id = Column(String, ForeignKey("resources.id"))
       amount = Column(Float)
       currency = Column(String, default="GNF")
       status = Column(String, default="pending")  # pending, completed, failed
       provider = Column(String)  # paydunya, stripe
       provider_ref = Column(String)  # référence du provider
       created_at = Column(DateTime, server_default=func.now())
       completed_at = Column(DateTime, nullable=True)
   ```

2. **Endpoints :**
   - `POST /payments/initiate` → Initier un paiement
     - Input : resource_id
     - Retourne : URL de paiement ou instructions USSD
   - `GET /payments/{id}` → Vérifier le statut

3. **Flux :**
   - L'utilisateur clique "Acheter" → `POST /payments/initiate`
   - Redirection vers la page de paiement du provider
   - Callback du provider → `POST /payments/webhook` (tâche 7.3)
   - Création de ResourcePurchase si paiement réussi

## Critères d'acceptation

- [ ] L'initiation de paiement retourne l'URL/instructions
- [ ] Le paiement est enregistré en DB avec statut "pending"
- [ ] Le modèle Payment est créé
