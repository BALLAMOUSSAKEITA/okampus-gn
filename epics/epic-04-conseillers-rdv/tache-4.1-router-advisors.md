# Tâche 4.1 - Créer le router advisors

**Epic :** 04 - Système de Conseillers & Rendez-vous
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/advisors.py` (nouveau)
- `okampus-api/app/main.py`
- `okampus-api/app/schemas.py`

## Description

Créer les endpoints pour lister et consulter les profils d'advisors (étudiants ayant activé le mode conseiller).

## Actions à réaliser

1. **Créer `routers/advisors.py` :**
   - `GET /advisors` → Liste des advisors avec leurs profils
     - Filtres : field (domaine), university
     - Recherche sur nom et domaine
     - Jointure avec User pour le nom et l'email
   - `GET /advisors/{id}` → Détail d'un advisor avec créneaux disponibles

2. **Schemas Pydantic :**
   ```python
   class AdvisorOut(BaseModel):
       id: str
       user_id: str
       name: str
       field: str
       university: str
       year: int
       description: str
       meet_link: Optional[str]
       available_slots: list[str]
   ```

3. **Enregistrer le router dans `main.py`**

## Critères d'acceptation

- [ ] La liste des advisors retourne les vrais profils de la DB
- [ ] Les filtres par domaine et université fonctionnent
- [ ] Le détail inclut les créneaux disponibles
- [ ] Seuls les users avec `is_advisor: true` apparaissent
