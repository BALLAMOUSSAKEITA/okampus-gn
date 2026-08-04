# Tâche 5.5 - Suggestions contextuelles

**Epic :** 05 - Assistant IA Intelligent
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/assistant.py`
- `okampus-app/src/app/assistant/page.tsx`

## Description

L'assistant doit recommander des bourses, stages et conseillers pertinents depuis la base de données de la plateforme.

## Actions à réaliser

1. **Enrichir le contexte IA avec les données de la plateforme :**
   - Avant d'appeler OpenAI, récupérer :
     - Les 5 bourses avec deadline la plus proche correspondant au profil
     - Les 5 stages du domaine de l'étudiant
     - Les 3 conseillers du même domaine
   - Injecter ces données dans le prompt system

2. **Afficher des cartes de suggestion dans le chat :**
   - Quand l'assistant mentionne une bourse → afficher une carte cliquable
   - Quand il mentionne un stage → carte avec lien vers `/stages`
   - Quand il mentionne un conseiller → carte avec lien vers `/conseil`

3. **Questions prédéfinies :**
   - Afficher des boutons de questions suggérées au début :
     - "Quelle filière me correspond ?"
     - "Quelles bourses sont disponibles ?"
     - "Comment postuler pour Campus France ?"
     - "Quels stages dans mon domaine ?"

## Critères d'acceptation

- [ ] L'assistant a accès aux données réelles de la plateforme
- [ ] Les recommandations sont pertinentes par rapport au profil
- [ ] Les cartes de suggestion sont cliquables et mènent aux bonnes pages
- [ ] Les questions prédéfinies facilitent l'interaction
