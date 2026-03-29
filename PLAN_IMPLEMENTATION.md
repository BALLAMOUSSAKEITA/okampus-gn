# O'Kampus — Plan d'implémentation détaillé

> **Dernière mise à jour** : 28 mars 2026
> Ce document recense **toutes les tâches** à réaliser pour passer de l'état actuel (prototype avec données fictives) à une plateforme fonctionnelle et connectée.
> Chaque tâche est pensée pour être implémentée **individuellement**, dans l'ordre proposé.

---

## Légende

- ✅ = Déjà fait
- 🔧 = Partiellement fait (à compléter)
- ❌ = Pas encore fait
- 🔒 = Tâche liée à la sécurité
- 📱 = Tâche liée au mobile/PWA

---

## PHASE 0 — Corrections et fondations (priorité critique)

> Corriger les problèmes existants avant d'avancer. Sans ça, le reste sera instable.

### 0.1 🔧 Supprimer l'import Prisma côté client dans AuthContext
- **Fichier** : `src/context/AuthContext.tsx` (ligne 5)
- **Problème** : `import { prisma } from "@/lib/prisma"` dans un composant `"use client"` — Prisma ne doit jamais être importé côté client
- **Action** : Supprimer cette ligne d'import inutilisée
- **Durée estimée** : 5 min

### 0.2 🔒 Sécuriser les routes API (vérification de session)
- **Fichier** : Toutes les routes dans `src/app/api/`
- **Problème** : Les POST/PATCH/PUT ne vérifient pas que l'utilisateur est authentifié ni qu'il a le droit d'agir
- **Actions** :
  - Créer un helper `src/lib/auth-utils.ts` avec une fonction `getAuthenticatedUser()` qui appelle `auth()` et retourne la session ou une 401
  - Ajouter la vérification dans `PATCH /api/user/[id]` (vérifier que `session.user.id === params.id`)
  - Ajouter la vérification dans toutes les routes POST (stages, bourses, calendrier, etc.)
- **Durée estimée** : 1h

### 0.3 🔒 Étendre le middleware d'authentification
- **Fichier** : `src/middleware.ts`
- **Problème** : Seules `/profil` et `/cv` sont protégées
- **Actions** :
  - Ajouter `/parcours`, `/forum` (pour poster), et les futures pages sensibles au matcher
  - Ou mieux : protéger tout sauf `/`, `/inscription`, `/bourses`, `/stages`, `/success-stories` (pages publiques)
- **Durée estimée** : 15 min

### 0.4 🔒 Sécuriser le fichier .env.local
- **Problème** : `.env.local.example` contient ce qui ressemble à de vraies clés (OpenAI, DATABASE_URL, NEXTAUTH_SECRET)
- **Actions** :
  - Vérifier que `.env.local` est dans `.gitignore`
  - Remplacer les vraies valeurs dans `.env.local.example` par des placeholders (`your_openai_key_here`, etc.)
  - Si les clés ont été commitées, les révoquer et en générer de nouvelles
- **Durée estimée** : 15 min

---

## PHASE 1 — Brancher les pages existantes sur les API existantes

> Les API Prisma existent déjà pour beaucoup de fonctionnalités, mais les pages utilisent des données en dur. Il faut les connecter.

### 1.1 🔧 Bourses — Connecter à l'API
- **Fichiers** : `src/app/bourses/page.tsx`, `src/app/api/scholarships/route.ts`
- **État actuel** : UI complète avec filtres et recherche, mais données simulées en dur (~80 lignes de mock)
- **Actions** :
  - Remplacer le tableau `scholarships` par un `useEffect` + `fetch("/api/scholarships")`
  - Ajouter un état `loading` et un affichage de chargement (skeleton ou spinner)
  - Ajouter un état `error` avec message utilisateur
  - Créer un script de seed Prisma (`prisma/seed.ts`) pour insérer des bourses réelles en BDD
  - Adapter les filtres pour fonctionner avec les données de l'API
- **Durée estimée** : 1h30

### 1.2 🔧 Calendrier — Connecter à l'API
- **Fichiers** : `src/app/calendrier/page.tsx`, `src/app/api/calendar/route.ts`
- **État actuel** : UI avec timeline et filtres, données simulées, variable `currentMonth` inutilisée
- **Actions** :
  - Remplacer les events simulés par `fetch("/api/calendar")`
  - Supprimer la variable `currentMonth` inutilisée
  - Ajouter loading/error states
  - Implémenter un filtre par mois (utiliser `currentMonth`)
  - Ajouter la possibilité pour un admin de créer des événements
- **Durée estimée** : 1h30

### 1.3 🔧 Stages — Connecter à l'API + candidature
- **Fichiers** : `src/app/stages/page.tsx`, `src/app/api/stages/route.ts`, `src/app/api/stages/[offerId]/apply/route.ts`
- **État actuel** : UI avec filtres et modals, données simulées, bouton "Postuler" sans handler
- **Actions** :
  - Remplacer `offers` simulées par `fetch("/api/stages")`
  - Câbler le bouton "Postuler" sur `POST /api/stages/{offerId}/apply` avec `userId`, `motivation`, `cvUrl`
  - Ajouter un formulaire de candidature (textarea motivation + upload CV ou lien)
  - Gérer la réponse 409 (déjà postulé) avec un message clair
  - Ajouter loading/error states
- **Durée estimée** : 2h

### 1.4 🔧 Entrepreneuriat — Connecter à l'API
- **Fichiers** : `src/app/entrepreneuriat/page.tsx`, `src/app/api/entrepreneur/route.ts`
- **État actuel** : UI avec cartes et modal "Soumettre", mais aucun `onSubmit` sur le formulaire
- **Actions** :
  - Remplacer `projects` simulés par `fetch("/api/entrepreneur")`
  - Câbler le modal de soumission sur `POST /api/entrepreneur` avec les champs du formulaire
  - Ajouter des `useState` contrôlés pour tous les champs du formulaire
  - Rafraîchir la liste après soumission
  - Ajouter loading/error states
- **Durée estimée** : 1h30

### 1.5 🔧 Success Stories — Connecter à l'API
- **Fichiers** : `src/app/success-stories/page.tsx`, `src/app/api/success-stories/route.ts`
- **État actuel** : UI avec filtres et sections, données simulées, boutons "Lire plus" sans action
- **Actions** :
  - Remplacer `stories` simulées par `fetch("/api/success-stories")`
  - Ajouter un modal ou page détail pour "Lire plus" (afficher `content` complet)
  - Câbler le CTA "Partager mon histoire" sur un formulaire + `POST /api/success-stories`
  - Ajouter loading/error states
- **Durée estimée** : 2h

### 1.6 🔧 Parcours — Connecter à l'API
- **Fichiers** : `src/app/parcours/page.tsx`, `src/app/api/parcours/[userId]/route.ts`
- **État actuel** : Auth OK, mais objectifs et notes en dur, infos université hardcodées
- **Actions** :
  - Charger le parcours via `GET /api/parcours/{userId}` au mount
  - Sauvegarder les modifications (objectifs, notes) via `PUT /api/parcours/{userId}`
  - Rendre les infos université/filière dynamiques (depuis le profil user)
  - Ajouter un bouton "Sauvegarder" explicite
- **Durée estimée** : 1h30

### 1.7 🔧 Ressources — Connecter à l'API + achat
- **Fichiers** : `src/app/ressources/page.tsx`, `src/app/api/resources/route.ts`, `src/app/api/resources/[resourceId]/purchase/route.ts`
- **État actuel** : UI avec grille et modal upload, données simulées, aucune action sur les boutons
- **Actions** :
  - Remplacer `resources` simulées par `fetch("/api/resources")`
  - Câbler le bouton de téléchargement/achat sur `POST /api/resources/{id}/purchase`
  - Pour les ressources gratuites : téléchargement direct
  - Pour les ressources payantes : afficher un message (paiement simulé pour l'instant)
  - Câbler le modal upload sur `POST /api/resources` (pour l'instant avec une URL externe)
  - Ajouter loading/error states
- **Durée estimée** : 2h

### 1.8 🔧 CV — Compléter la sauvegarde
- **Fichier** : `src/app/cv/page.tsx`
- **État actuel** : Génération IA OK, mais le markdown généré n'est pas sauvegardé en BDD
- **Actions** :
  - Implémenter `saveMarkdownToProfile` : `PATCH /api/user/{userId}` pour stocker le CV markdown dans `CvProfile`
  - Ajouter un bouton "Sauvegarder mon CV"
  - Au rechargement, pré-remplir avec le dernier CV sauvegardé si existant
- **Durée estimée** : 45 min

---

## PHASE 2 — Créer les API manquantes + brancher les pages

> Certaines pages n'ont pas d'API correspondante. Il faut les créer.

### 2.1 ❌ Forum — Créer l'API complète
- **Modèle Prisma** : `ForumPost` existe déjà (titre, contenu, catégorie, auteur, likes, réponses)
- **Actions** :
  - Créer `src/app/api/forum/route.ts` :
    - `GET` : liste des posts avec pagination, filtre par catégorie, recherche textuelle, include `author`
    - `POST` : créer un post (authentification requise)
  - Créer `src/app/api/forum/[postId]/route.ts` :
    - `GET` : détail d'un post avec ses réponses
    - `PATCH` : mettre à jour (auteur uniquement)
    - `DELETE` : supprimer (auteur ou admin)
  - Créer `src/app/api/forum/[postId]/like/route.ts` :
    - `POST` : liker/unliker un post
  - Créer `src/app/api/forum/[postId]/reply/route.ts` :
    - `POST` : répondre à un post
- **Durée estimée** : 3h

### 2.2 🔧 Forum — Connecter la page à l'API
- **Fichier** : `src/app/forum/page.tsx`
- **État actuel** : UI avec recherche, catégories, modal de création — données mockées, `handleSubmitPost` vide
- **Actions** :
  - Remplacer `mockPosts` par `fetch("/api/forum")`
  - Câbler `handleSubmitPost` sur `POST /api/forum`
  - Implémenter la recherche et les filtres côté API (query params)
  - Ajouter les likes fonctionnels
  - Ajouter une page/modal de détail pour voir les réponses et répondre
  - Ajouter loading/error states + pagination
- **Durée estimée** : 2h30

### 2.3 ❌ Conseillers — Créer l'API
- **Modèle Prisma** : `AdvisorProfile` et `Appointment` existent
- **Actions** :
  - Créer `src/app/api/advisors/route.ts` :
    - `GET` : liste des conseillers actifs (users avec `isAdvisor: true` et `advisorProfile` renseigné)
  - Créer `src/app/api/advisors/[advisorId]/route.ts` :
    - `GET` : profil détaillé du conseiller
  - Créer `src/app/api/appointments/route.ts` :
    - `POST` : créer un RDV (`Appointment` en BDD)
    - `GET` : liste des RDV de l'utilisateur connecté
  - Créer `src/app/api/appointments/[id]/route.ts` :
    - `PATCH` : confirmer/annuler un RDV
- **Durée estimée** : 2h30

### 2.4 🔧 Conseillers — Connecter la page à l'API
- **Fichier** : `src/app/conseil/page.tsx`
- **État actuel** : Conseillers en dur, chat simulé (setTimeout + réponses aléatoires), RDV non persisté
- **Actions** :
  - Remplacer `advisors` par `fetch("/api/advisors")`
  - Câbler `confirmBooking` sur `POST /api/appointments`
  - Le chat restera simulé pour l'instant (Phase 4 pour le chat temps réel)
  - Afficher les vrais profils conseillers (nom, filière, photo, description)
- **Durée estimée** : 2h

### 2.5 ❌ Assistant IA — Créer une vraie API d'orientation
- **Fichier actuel** : `src/app/assistant/page.tsx` — règles locales JS, pas d'appel API
- **Actions** :
  - Créer `src/app/api/assistant/route.ts` :
    - `POST` : envoyer le profil (notes, série, intérêts) à OpenAI avec un prompt système orienté éducation guinéenne
    - Retourner les recommandations structurées (filières, universités, conseils)
  - Modifier la page assistant pour appeler cette API au lieu de la logique locale
  - Garder un fallback (logique locale) si l'API OpenAI n'est pas disponible
  - Optionnel : sauvegarder l'historique des consultations en BDD
- **Durée estimée** : 2h

---

## PHASE 3 — Nouvelles fonctionnalités essentielles

> Ajouter des fonctionnalités qui manquent et qui apportent de la valeur immédiate.

### 3.1 ❌ Système de notifications
- **Actions** :
  - Ajouter un modèle `Notification` dans Prisma : `id`, `userId`, `type`, `title`, `message`, `read`, `link`, `createdAt`
  - Créer `src/app/api/notifications/route.ts` (GET: liste, POST: marquer comme lu)
  - Créer un composant `NotificationBell` dans la Navbar avec badge de compteur
  - Déclencher des notifications sur : nouveau message forum, RDV confirmé, nouvelle bourse, candidature acceptée
- **Durée estimée** : 3h

### 3.2 ❌ Recherche globale
- **Actions** :
  - Créer `src/app/api/search/route.ts` qui cherche dans : bourses, stages, forum posts, ressources, success stories
  - Ajouter un composant `SearchBar` dans la Navbar (ou page dédiée `/recherche`)
  - Afficher les résultats groupés par catégorie
- **Durée estimée** : 2h

### 3.3 ❌ Page Admin (gestion de contenu)
- **Actions** :
  - Ajouter un rôle `ADMIN` dans le schéma User (enum `Role { USER ADVISOR ADMIN }`)
  - Créer une migration Prisma
  - Créer `src/app/admin/page.tsx` avec des onglets pour gérer :
    - Bourses (CRUD)
    - Stages (CRUD + validation)
    - Événements calendrier (CRUD)
    - Ressources (validation)
    - Modération forum (suppression posts)
    - Utilisateurs (liste, rôles, bannir)
  - Protéger la route `/admin` dans le middleware (vérifier `role === "ADMIN"`)
- **Durée estimée** : 6h

### 3.4 ❌ Seed de données réalistes
- **Actions** :
  - Créer `prisma/seed.ts` avec des données réalistes pour la Guinée :
    - Bourses réelles (bourses d'État, partenaires internationaux, etc.)
    - Universités guinéennes (UGANC, UGLC-SC, Kofi Annan, etc.)
    - Filières courantes
    - Événements académiques types
  - Configurer le script seed dans `package.json`
  - Exécuter avec `npx prisma db seed`
- **Durée estimée** : 2h

### 3.5 ❌ Upload de fichiers
- **Problème** : Aucun système d'upload (CV PDF, ressources, photos profil)
- **Actions** :
  - Intégrer un service de stockage (options : Cloudinary gratuit, Uploadthing, ou Vercel Blob)
  - Créer `src/app/api/upload/route.ts` pour gérer l'upload
  - Utiliser dans : profil (photo), ressources (fichiers), stages (CV PDF)
  - Mettre à jour `POST /api/resources` pour accepter les vrais fichiers
- **Durée estimée** : 3h

### 3.6 ❌ Landing page dynamique
- **Fichier** : `src/app/page.tsx`
- **État actuel** : Stats fictives (30+, 50+, 10+), contenu statique
- **Actions** :
  - Créer `src/app/api/stats/route.ts` qui compte en BDD : users, bourses, stages, posts forum
  - Afficher les vraies stats sur la landing page
  - Ajouter une section "Dernières bourses" et "Derniers stages" (3-4 items)
  - Ajouter une section "Témoignages récents"
- **Durée estimée** : 1h30

---

## PHASE 4 — Fonctionnalités avancées

> Fonctionnalités plus complexes pour enrichir la plateforme.

### 4.1 ❌ Chat temps réel entre étudiants et conseillers
- **Actions** :
  - Ajouter un modèle `Message` dans Prisma : `id`, `senderId`, `receiverId`, `content`, `createdAt`, `read`
  - Option A (simple) : polling toutes les 5s avec `GET /api/messages?conversationWith={userId}`
  - Option B (avancé) : WebSocket avec `Socket.io` ou `Pusher` (service tiers gratuit)
  - Créer un composant `ChatWindow` réutilisable
  - Intégrer dans `/conseil` pour remplacer le chat simulé
- **Durée estimée** : 4-8h selon l'option

### 4.2 ❌ Intégration Meet/Zoom pour les RDV
- **Actions** :
  - Option simple : champ `meetLink` dans `Appointment`, le conseiller colle son lien Google Meet
  - Option avancée : Utiliser l'API Google Calendar pour générer un lien Meet automatiquement
  - Afficher le lien dans la page de confirmation de RDV
  - Envoyer un rappel (notification) 1h avant le RDV
- **Durée estimée** : 2-4h selon l'option

### 4.3 ❌ Système de paiement pour les ressources
- **Actions** :
  - Intégrer une passerelle adaptée à la Guinée (Orange Money, MTN Mobile Money, ou Stripe)
  - Créer `src/app/api/payment/route.ts` pour initier un paiement
  - Créer un webhook pour confirmer le paiement
  - Mettre à jour `ResourcePurchase` après paiement confirmé
  - Ajouter un portefeuille créateur (les auteurs de ressources voient leurs revenus)
- **Durée estimée** : 8h+

### 4.4 ❌ Préparation aux entretiens
- **Actions** :
  - Créer une page `/entretiens`
  - Proposer des questions fréquentes par secteur (banque, tech, ONG, etc.)
  - Intégrer l'IA pour simuler un entretien (chat question/réponse avec feedback)
  - Ajouter des conseils et vidéos
- **Durée estimée** : 4h

### 4.5 ❌ Comparateur de filières
- **Actions** :
  - Créer un modèle `Filiere` dans Prisma : `nom`, `universite`, `duree`, `cout`, `debouches`, `difficulte`, `tauxReussite`
  - Créer une page `/comparateur` avec sélection de 2-3 filières côte à côte
  - Afficher un tableau comparatif (durée, coût, débouchés, difficulté)
  - Seed avec les données des universités guinéennes
- **Durée estimée** : 4h

### 4.6 ❌ Système de badges et gamification
- **Actions** :
  - Ajouter un modèle `Badge` et `UserBadge` dans Prisma
  - Définir les badges : "Premier post", "Conseiller actif", "10 réponses", "CV créé", etc.
  - Créer une logique d'attribution automatique (après chaque action, vérifier les critères)
  - Afficher les badges sur le profil utilisateur
  - Ajouter un classement/leaderboard optionnel
- **Durée estimée** : 4h

---

## PHASE 5 — PWA, mobile et performance

### 5.1 📱 Améliorer le support PWA
- **État actuel** : `manifest.json` + `PWAInstallPrompt` existent, `next-pwa` configuré
- **Actions** :
  - Vérifier que le service worker fonctionne (cache offline)
  - Ajouter les icônes manquantes référencées dans `manifest.json` (`icon-192x192.png`, `icon-512x512.png`)
  - Tester l'installation sur Android et iOS
  - Ajouter une page offline de fallback
  - Configurer le cache des routes API fréquentes (bourses, stages)
- **Durée estimée** : 2h

### 5.2 📱 Notifications push
- **Actions** :
  - Configurer `web-push` avec les clés VAPID
  - Créer `src/app/api/push/subscribe/route.ts` pour enregistrer les abonnements
  - Envoyer des notifications : nouveau message, RDV, nouvelle bourse
  - Gérer les préférences utilisateur (activer/désactiver par type)
- **Durée estimée** : 4h

### 5.3 ❌ Optimisation des performances
- **Actions** :
  - Convertir les pages qui le peuvent en Server Components (bourses, stages, success stories = données publiques)
  - Ajouter `loading.tsx` et `error.tsx` dans chaque dossier de page
  - Implémenter la pagination côté API (limit/offset) pour le forum, bourses, stages
  - Ajouter des méta-données SEO (`metadata` export) dans chaque page
  - Optimiser les images avec `next/image`
- **Durée estimée** : 3h

### 5.4 ❌ Ajouter /cv à la Navbar
- **Fichier** : `src/components/Navbar.tsx`
- **Problème** : La page `/cv` existe mais n'est pas dans le menu
- **Action** : Ajouter un lien vers `/cv` dans la navigation (menu principal ou dropdown "Plus")
- **Durée estimée** : 10 min

---

## PHASE 6 — Auth avancée et sécurité

### 6.1 ❌ Récupération de mot de passe
- **Actions** :
  - Créer `src/app/api/auth/forgot-password/route.ts` : génère un token, envoie un email
  - Créer `src/app/api/auth/reset-password/route.ts` : vérifie le token, met à jour le mot de passe
  - Créer une page `/mot-de-passe-oublie`
  - Intégrer un service email (Resend, Nodemailer + SMTP)
  - Ajouter un lien "Mot de passe oublié ?" sur la page d'inscription/connexion
- **Durée estimée** : 3h

### 6.2 ❌ Connexion OAuth (Google, Facebook)
- **Actions** :
  - Ajouter les providers Google et Facebook dans `src/auth.ts`
  - Créer les apps OAuth sur Google Cloud Console et Meta Developer
  - Ajouter les boutons "Se connecter avec Google/Facebook" sur `/inscription`
  - Gérer le merge de comptes (même email, providers différents)
- **Durée estimée** : 2h

### 6.3 ❌ Vérification d'email
- **Actions** :
  - Ajouter `emailVerified` et `verificationToken` dans le modèle User
  - Envoyer un email de vérification à l'inscription
  - Bloquer certaines actions (poster sur le forum, postuler) si email non vérifié
- **Durée estimée** : 2h

---

## Récapitulatif par priorité

| Phase | Nom | Nb tâches | Durée estimée | Priorité |
|-------|-----|-----------|---------------|----------|
| 0 | Corrections et fondations | 4 | ~2h | 🔴 Critique |
| 1 | Brancher pages ↔ API existantes | 8 | ~13h | 🔴 Haute |
| 2 | Créer les API manquantes | 5 | ~13h | 🟠 Haute |
| 3 | Nouvelles fonctionnalités essentielles | 6 | ~18h | 🟠 Moyenne-Haute |
| 4 | Fonctionnalités avancées | 6 | ~30h+ | 🟡 Moyenne |
| 5 | PWA, mobile et performance | 4 | ~9h | 🟡 Moyenne |
| 6 | Auth avancée et sécurité | 3 | ~7h | 🟠 Moyenne-Haute |

**Total estimé : ~90 heures de développement**

---

## Ordre d'implémentation recommandé

```
0.1 → 0.2 → 0.3 → 0.4          (fondations — en premier)
       ↓
5.4                               (quick win — ajouter /cv à la Navbar)
       ↓
1.1 → 1.2 → 1.3 → 1.4 → 1.5    (brancher les pages faciles)
       ↓
1.6 → 1.7 → 1.8                  (brancher parcours, ressources, CV)
       ↓
2.1 → 2.2                        (forum complet)
       ↓
2.3 → 2.4                        (conseillers complet)
       ↓
2.5                               (assistant IA réel)
       ↓
3.4 → 3.6                        (seed + landing dynamique)
       ↓
3.5 → 3.1 → 3.2                  (upload, notifs, recherche)
       ↓
3.3                               (admin)
       ↓
6.1 → 6.2 → 6.3                  (auth avancée)
       ↓
5.1 → 5.2 → 5.3                  (PWA + perf)
       ↓
4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6  (fonctionnalités avancées)
```

---

## Comment utiliser ce plan

1. **Choisissez une tâche** en suivant l'ordre recommandé
2. **Demandez-moi** de l'implémenter : "Implémente la tâche 1.1"
3. **Testez** la fonctionnalité
4. **Passez à la suivante**

> 💡 Chaque tâche est conçue pour être un commit indépendant. N'hésitez pas à adapter l'ordre selon vos priorités produit.
