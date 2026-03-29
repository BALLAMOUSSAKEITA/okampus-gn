# Tâche 13.7 - Tests unitaires backend

**Epic :** 13 - Migrations DB & Robustesse Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/tests/` (nouveau dossier)
- `okampus-api/requirements.txt`

## Actions à réaliser

1. **Installer pytest :** `pip install pytest pytest-asyncio httpx`
2. **Configurer le test client FastAPI**
3. **Tests à écrire :**
   - Auth : inscription, login, token invalide, email dupliqué
   - Users : get profil, update profil, accès interdit
   - CRUD : créer/lister/filtrer pour chaque entité
   - Validation : champs manquants, valeurs invalides
4. **Couverture > 80%**

## Critères d'acceptation

- [ ] Les tests passent en CI
- [ ] La couverture est > 80%
- [ ] Les cas d'erreur sont testés
