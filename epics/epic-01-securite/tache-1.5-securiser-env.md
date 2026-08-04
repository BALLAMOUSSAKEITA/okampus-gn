# Tâche 1.5 - Sécuriser les fichiers .env

**Epic :** 01 - Corrections Critiques & Sécurité
**Priorité :** Critique
**Statut :** [x] Terminé
**Fichiers concernés :**
- `.gitignore`
- `okampus-app/.env`
- `okampus-app/.env.local`
- `okampus-api/.env`
- `okampus-api/.env.example`

## Description

Les fichiers `.env` contenant des secrets (NEXTAUTH_SECRET, DATABASE_URL, OPENAI_API_KEY) ne doivent jamais être commités. Il faut vérifier leur présence dans `.gitignore` et régénérer les secrets exposés.

## Actions à réaliser

1. **Vérifier `.gitignore` :**
   - S'assurer que `.env`, `.env.local`, `.env.production` sont ignorés dans les deux projets
   - Vérifier avec `git ls-files` qu'aucun .env n'est tracké

2. **Créer des fichiers `.env.example` :**
   ```
   # okampus-app/.env.example
   NEXT_PUBLIC_API_URL=http://localhost:8000
   API_URL=http://localhost:8000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<générer avec: openssl rand -base64 32>
   ```

   ```
   # okampus-api/.env.example
   DATABASE_URL=postgresql://user:password@localhost:5432/okampus
   SECRET_KEY=<générer avec: openssl rand -hex 32>
   OPENAI_API_KEY=<votre clé OpenAI>
   OPENAI_MODEL=gpt-4o-mini
   ```

3. **Régénérer les secrets en production :**
   - `NEXTAUTH_SECRET` : générer une nouvelle valeur aléatoire
   - `SECRET_KEY` backend : générer une nouvelle valeur
   - Mettre à jour les variables sur Railway

4. **Supprimer les .env du git history si nécessaire :**
   - Vérifier avec `git log --all --diff-filter=A -- "*.env*"`

## Critères d'acceptation

- [x] Aucun fichier .env n'est tracké par git
- [x] Des fichiers .env.example existent avec des placeholders
- [ ] Les secrets en production sont régénérés (action manuelle sur Railway)
- [ ] Le README mentionne la procédure de configuration des variables d'environnement
