# Tâche 13.3 - Seed data

**Epic :** 13 - Migrations DB & Robustesse Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/scripts/seed.py` (nouveau)

## Description

Peupler la base de données avec des données réelles du contexte guinéen.

## Actions à réaliser

1. **Script `seed.py` exécutable :** `python scripts/seed.py`

2. **Données à seeder :**

   **Bourses (10+) :**
   - Bourse d'Excellence du Gouvernement Guinéen
   - Bourse Mastercard Foundation
   - Campus France - Guinée
   - Bourse de la BAD (Banque Africaine de Développement)
   - Bourse de l'Union Africaine
   - Bourse DAAD (Allemagne)
   - Bourse Chevening (UK)
   - Bourse Turquie (Türkiye Bursları)
   - Bourse OIF (Organisation Internationale de la Francophonie)
   - Concours d'entrée ENA Guinée
   - Concours Écoles d'ingénieurs

   **Calendrier universitaire 2024-2025 :**
   - Rentrée universitaire, examens, vacances, jours fériés guinéens
   - Fête de l'Indépendance (2 octobre), Journée de la femme, etc.

   **Stages partenaires (5+) :**
   - Orange Guinée, MTN Guinée, BCRG, Société Générale, Total Energies

   **Compte admin :** admin@okampus.gn / mot de passe sécurisé

3. **Idempotent :** Le script peut être relancé sans créer de doublons

## Critères d'acceptation

- [ ] Le script crée les données sans erreur
- [ ] Les bourses reflètent les vraies opportunités guinéennes
- [ ] Le calendrier est réaliste
- [ ] Le script est idempotent
