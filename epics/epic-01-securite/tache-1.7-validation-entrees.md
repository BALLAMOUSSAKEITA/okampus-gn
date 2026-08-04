# Tâche 1.7 - Renforcer la validation des entrées

**Epic :** 01 - Corrections Critiques & Sécurité
**Priorité :** Haute
**Statut :** [x] Terminé
**Fichiers concernés :**
- `okampus-api/app/schemas.py`
- `okampus-app/src/app/inscription/page.tsx`
- `okampus-app/src/app/forum/page.tsx`

## Description

La validation Pydantic est basique. Il manque des contraintes de longueur, de format, et une sanitisation contre les injections HTML/XSS.

## Actions à réaliser

1. **Ajouter des contraintes de longueur dans les schemas Pydantic :**
   ```python
   from pydantic import Field, constr

   class UserCreate(BaseModel):
       name: constr(min_length=2, max_length=100)
       email: EmailStr
       password: constr(min_length=8, max_length=128)
       role: Literal["bachelier", "etudiant"]

   class ForumPostCreate(BaseModel):
       title: constr(min_length=5, max_length=200)
       content: constr(min_length=10, max_length=10000)
       category: constr(max_length=50)
   ```

2. **Sanitisation HTML/XSS :**
   - Installer `bleach` : `pip install bleach`
   - Créer un validateur Pydantic custom qui strip les tags HTML dangereux
   - Appliquer sur tous les champs texte libres (forum content, descriptions, etc.)

3. **Validation côté frontend :**
   - Ajouter des validations Zod sur le formulaire d'inscription
   - Messages d'erreur en français
   - Validation en temps réel (onChange)

4. **Validation des fichiers (préparation Epic 06) :**
   - Whitelister les types MIME acceptés
   - Limiter la taille des fichiers

## Critères d'acceptation

- [x] Les champs texte ont des limites min/max de longueur
- [x] Le HTML est sanitisé dans les contenus texte
- [x] Le mot de passe requiert minimum 8 caractères
- [x] Les erreurs de validation sont retournées en français
- [x] Aucune injection XSS n'est possible via les formulaires
