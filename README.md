# O'Kampus - Plateforme de l’étudiant guinéen 🇬🇳

O'Kampus est une **plateforme complète pour l’étudiant guinéen** : de la réussite au bac jusqu’à l’insertion professionnelle.

## ✨ Fonctionnalités

### 🤖 Assistant IA d'orientation
- Analyse personnalisée : projet d'études, forces, faiblesses, notes du lycée
- Recommandations de filières adaptées à votre profil
- Chat interactif pour poser des questions

### 💬 Conseil & Rendez-vous
- Chat en direct avec des étudiants-conseillers par filière
- Chaque conseiller a sa description personnalisée
- Prise de rendez-vous pour appels Meet/Zoom

### 📚 Forum communautaire
- Posez vos questions sur les universités, filières et débouchés
- Catégories : Universités, Filières, Débouchés, Vie étudiante
- Réponses de la communauté O'Kampus

### 👤 Profil utilisateur
- Inscription en tant que **Nouveau bachelier** ou **Étudiant**
- Les étudiants peuvent devenir conseillers
- Gestion du profil et des disponibilités
- Informations CV (formation, expériences, projets) + génération via OpenAI

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
src/
├── app/
│   ├── page.tsx           # Landing page
│   ├── assistant/         # Assistant IA d'orientation
│   ├── conseil/           # Section conseil avec chat et RDV
│   ├── forum/             # Forum communautaire
│   ├── inscription/       # Inscription/Connexion
│   └── profil/            # Profil utilisateur
├── components/
│   └── Navbar.tsx         # Navigation
├── context/
│   └── AuthContext.tsx    # Contexte d'authentification
├── types/
│   └── index.ts           # Types TypeScript
└── globals.css            # Styles globaux
```

## 🛠️ Technologies

- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires

## 📝 Notes

- L'authentification utilise actuellement `localStorage` (démo)
- Pour la production, intégrer un backend (Supabase, Firebase, etc.)
- Les conseillers et messages sont simulés pour la démo

## 🎯 Vision

O'Kampus vise à être la plateforme unique pour l’étudiant guinéen :
- **Préparation au bac** : ressources, annales, quiz, méthodologie
- **Orientation** : assistant IA + conseillers étudiants
- **Pendant les études** : suivi de parcours, ressources par filière, groupes d’étude
- **Insertion professionnelle** : CV, stages, bourses, opportunités, préparation entretiens

Voir [PROPOSITIONS_AMELIORATIONS.md](../PROPOSITIONS_AMELIORATIONS.md) pour la feuille de route complète.

## 📄 Licence

Ce projet est destiné à aider les étudiants guinéens dans leur orientation.
