# Tâche 5.2 - Prompt engineering guinéen

**Epic :** 05 - Assistant IA Intelligent
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/assistant.py`
- `okampus-api/app/prompts/` (nouveau dossier)

## Description

Créer un système prompt spécialisé qui connaît le système éducatif guinéen et peut orienter les étudiants.

## Actions à réaliser

1. **Créer le system prompt principal :**
   - Rôle : Conseiller d'orientation spécialisé en éducation guinéenne
   - Connaissances :
     - Universités guinéennes (UGANC, Université de Sonfonia, ISAV, etc.)
     - Filières disponibles par université
     - Conditions d'admission (notes minimales, concours)
     - Système LMD en Guinée
     - Bourses nationales et internationales accessibles
     - Marché de l'emploi guinéen
     - Procédures Campus France pour la France
   - Ton : bienveillant, encourageant, réaliste
   - Langue : français avec compréhension du contexte local

2. **Prompts contextuels :**
   - Si bachelier : focus sur le choix de filière et l'inscription
   - Si étudiant : focus sur la spécialisation, stages et insertion
   - Adapter en fonction de la série (Sciences, Lettres, Social, Technique)

3. **Injection de données de la plateforme :**
   - Injecter les bourses disponibles (deadline proche) dans le contexte
   - Injecter les stages correspondant au profil
   - Injecter les conseillers du même domaine

4. **Stocker les prompts dans des fichiers séparés :**
   - `prompts/system.txt` - prompt système principal
   - `prompts/bachelier.txt` - contexte spécifique bachelier
   - `prompts/etudiant.txt` - contexte spécifique étudiant

## Critères d'acceptation

- [ ] L'assistant connaît les universités et filières guinéennes
- [ ] Les réponses sont pertinentes et adaptées au profil
- [ ] Le ton est bienveillant et encourageant
- [ ] Les données de la plateforme sont injectées quand pertinent
