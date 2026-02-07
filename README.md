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

### 1. Cloner et installer

```bash
git clone https://github.com/VOTRE_USERNAME/okampus-gn.git
cd okampus-gn/okampus-app
npm install
```

### 2. Configurer la base de données (Neon)

1. Crée un compte sur [Neon](https://neon.tech)
2. Crée un nouveau projet PostgreSQL
3. Copie l'URL de connexion

### 3. Variables d'environnement

Crée un fichier `.env.local` à la racine de `okampus-app/` :

```env
# OpenAI (pour génération CV)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Next-Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
```

Pour générer `NEXTAUTH_SECRET` :
```bash
openssl rand -base64 32
```

### 4. Créer les tables (migration Prisma)

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Lancer le serveur

```bash
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
- **Prisma** - ORM pour PostgreSQL
- **Next-Auth v5** - Authentification
- **Neon** - Base de données PostgreSQL serverless
- **OpenAI** - Génération de CV

## 📝 Architecture

### Backend
- **Base de données** : Neon (PostgreSQL serverless)
- **ORM** : Prisma
- **Auth** : Next-Auth (Credentials + sessions JWT)
- **API Routes** : Next.js App Router

### Authentification
- Inscription : email/password (hash bcrypt)
- Connexion : Next-Auth Credentials provider
- Sessions : JWT stockées côté client
- Routes protégées : middleware Next-Auth (`/profil`, `/cv`)

### Modèles de données
- **User** : id, email, password, name, role, timestamps
- **CvProfile** : infos CV liées à User (1-to-1)
- **AdvisorProfile** : profil conseiller lié à User (1-to-1)
- **Appointment** : rendez-vous entre User et Advisor
- **ForumPost** : posts du forum

## 📝 Notes

- Les conseillers et messages du chat sont encore simulés (frontend)
- Les posts du forum seront bientôt connectés à la BDD
- Pour la production : configurer `NEXTAUTH_URL` avec l'URL de prod

## 🎯 Vision

O'Kampus vise à être la plateforme unique pour l’étudiant guinéen :
- **Préparation au bac** : ressources, annales, quiz, méthodologie
- **Orientation** : assistant IA + conseillers étudiants
- **Pendant les études** : suivi de parcours, ressources par filière, groupes d’étude
- **Insertion professionnelle** : CV, stages, bourses, opportunités, préparation entretiens

Voir [PROPOSITIONS_AMELIORATIONS.md](../PROPOSITIONS_AMELIORATIONS.md) pour la feuille de route complète.

## 📄 Licence

Ce projet est destiné à aider les étudiants guinéens dans leur orientation.
