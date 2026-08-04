# Tâche 4.2 - Créer le router appointments

**Epic :** 04 - Système de Conseillers & Rendez-vous
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/appointments.py` (nouveau)
- `okampus-api/app/main.py`
- `okampus-api/app/schemas.py`

## Description

Créer les endpoints pour gérer les rendez-vous entre étudiants et conseillers.

## Actions à réaliser

1. **Créer `routers/appointments.py` :**
   - `POST /appointments` → Réserver un créneau (requiert auth)
     - Input : advisor_id, date, time
     - Vérifier que le créneau est disponible
     - Créer l'appointment avec status "pending"
     - Copier le meet_link de l'advisor
   - `GET /appointments` → Mes rendez-vous (requiert auth)
     - Query param : `role=student` ou `role=advisor`
     - Si student : mes RDV en tant qu'étudiant
     - Si advisor : les RDV que j'ai reçus
   - `PATCH /appointments/{id}` → Changer le statut (requiert auth)
     - Status possibles : pending → confirmed, cancelled, completed
     - L'advisor peut confirmer/annuler
     - L'étudiant peut annuler

2. **Schemas Pydantic :**
   ```python
   class AppointmentCreate(BaseModel):
       advisor_id: str
       date: str  # format YYYY-MM-DD
       time: str  # format HH:MM

   class AppointmentOut(BaseModel):
       id: str
       user_id: str
       advisor_id: str
       advisor_name: str
       date: str
       time: str
       meet_link: Optional[str]
       status: str
       created_at: datetime
   ```

## Critères d'acceptation

- [ ] La réservation crée un appointment en DB
- [ ] Les créneaux déjà réservés ne sont pas acceptés
- [ ] L'étudiant et l'advisor voient leurs RDV respectifs
- [ ] Le changement de statut est contrôlé (permissions)
