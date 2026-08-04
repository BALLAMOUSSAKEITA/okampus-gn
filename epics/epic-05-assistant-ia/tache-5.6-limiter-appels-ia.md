# Tâche 5.6 - Limiter les appels IA

**Epic :** 05 - Assistant IA Intelligent
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py`
- `okampus-api/app/routers/assistant.py`

## Description

Les appels à OpenAI coûtent de l'argent. Implémenter un système de quotas pour éviter les abus.

## Actions à réaliser

1. **Ajouter un compteur dans le modèle User :**
   ```python
   ai_messages_today = Column(Integer, default=0)
   ai_messages_reset_date = Column(Date)
   ```

2. **Logique de quota :**
   - 20 messages par jour par utilisateur (configurable)
   - Réinitialiser le compteur chaque jour
   - Retourner 429 avec message "Quota atteint" si dépassé

3. **Afficher le quota côté frontend :**
   - "Il vous reste X messages aujourd'hui"
   - Barre de progression du quota
   - Message quand le quota est atteint avec heure de réinitialisation

4. **Quota premium (futur) :**
   - Prévoir un champ `is_premium` pour des quotas augmentés
   - Gratuit : 20 messages/jour
   - Premium : 100 messages/jour

## Critères d'acceptation

- [ ] Le compteur de messages est incrémenté à chaque appel IA
- [ ] Le quota est réinitialisé chaque jour
- [ ] Un 429 est retourné quand le quota est atteint
- [ ] Le frontend affiche le quota restant
