# Tâche 13.5 - Logging structuré

**Epic :** 13 - Migrations DB & Robustesse Backend
**Priorité :** Moyenne
**Statut :** [ ] À faire

## Actions à réaliser

1. **Installer loguru :** `pip install loguru`
2. **Configurer le format JSON** pour les logs en production
3. **Logger :** Chaque requête (méthode, path, status, durée), les erreurs, les actions importantes (inscription, paiement)
4. **Niveaux :** DEBUG en dev, INFO en production

## Critères d'acceptation

- [ ] Les logs sont structurés en JSON en production
- [ ] Chaque requête est loggée avec sa durée
- [ ] Les erreurs incluent le contexte complet
