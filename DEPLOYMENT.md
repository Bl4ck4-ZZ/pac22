# Guide de déploiement PAC 22 – Pas à pas

Ce guide est écrit pour une personne non-technique.  
Durée estimée : **30 à 45 minutes**.

---

## Ce dont vous avez besoin

- Un compte **Supabase** (gratuit) → https://supabase.com
- Un compte **Vercel** (gratuit) → https://vercel.com
- Un compte **GitHub** (gratuit) → https://github.com
- Le dossier du projet sur votre ordinateur

---

## Étape 1 – Créer le projet Supabase

1. Allez sur https://supabase.com et connectez-vous.
2. Cliquez **"New project"**.
3. Choisissez un nom (ex : `pac22`), une région proche de vous (ex : **West EU**), et un mot de passe fort pour la base de données. **Notez ce mot de passe quelque part.**
4. Attendez 1-2 minutes que le projet se crée.

---

## Étape 2 – Créer les tables (migration SQL)

1. Dans votre projet Supabase, cliquez sur **"SQL Editor"** dans le menu de gauche.
2. Cliquez **"New query"**.
3. Ouvrez le fichier `supabase/migrations/001_initial.sql` de ce projet sur votre ordinateur.
4. Copiez **tout le contenu** du fichier et collez-le dans la zone de texte de Supabase.
5. Cliquez **"Run"** (bouton vert).
6. Vous devez voir : `Success. No rows returned` — c'est normal, c'est bon signe.

---

## Étape 3 – Créer le compte administrateur

1. Dans Supabase, cliquez **"Authentication"** dans le menu de gauche.
2. Cliquez sur l'onglet **"Users"**.
3. Cliquez **"Add user"** → **"Create new user"**.
4. Entrez l'adresse e-mail de l'administrateur (ex : `admin@pac22.fr`).
5. Entrez un mot de passe fort. **Notez-le — c'est ce mot de passe qui servira à se connecter à `/admin`.**
6. Cliquez **"Create user"**.

---

## Étape 4 – Récupérer les clés API Supabase

1. Dans Supabase, cliquez **"Settings"** (icône engrenage) → **"API"**.
2. Notez les deux valeurs suivantes :
   - **Project URL** — ressemble à `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
   - **anon / public** (clé) — une longue chaîne commençant par `eyJ…`

---

## Étape 5 – Mettre le code sur GitHub

1. Allez sur https://github.com et connectez-vous.
2. Cliquez **"New repository"**, nommez-le `pac22-booking`, laissez-le en **Private**, et cliquez **"Create repository"**.
3. Sur votre ordinateur, ouvrez un terminal dans le dossier du projet et exécutez :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_NOM/pac22-booking.git
   git push -u origin main
   ```
   *(Remplacez `VOTRE_NOM` par votre nom d'utilisateur GitHub.)*

---

## Étape 6 – Déployer sur Vercel

1. Allez sur https://vercel.com et connectez-vous (de préférence avec votre compte GitHub).
2. Cliquez **"Add New…"** → **"Project"**.
3. Importez le dépôt `pac22-booking` que vous venez de créer.
4. Vercel détecte automatiquement que c'est un projet **Vite**. Ne changez rien au framework.
5. Avant de cliquer "Deploy", ouvrez la section **"Environment Variables"** et ajoutez :

   | Nom | Valeur |
   |-----|--------|
   | `VITE_SUPABASE_URL` | Votre Project URL (étape 4) |
   | `VITE_SUPABASE_ANON_KEY` | Votre clé anon/public (étape 4) |

6. Cliquez **"Deploy"**.
7. Attendez 1-2 minutes. Vercel vous donne une URL du type `pac22-booking.vercel.app`.

---

## Étape 7 – Vérifier que tout fonctionne

1. Ouvrez l'URL donnée par Vercel → vous devez voir la page de réservation PAC 22.
2. Allez sur `VOTRE_URL/admin` → vous devez voir la page de connexion.
3. Connectez-vous avec l'e-mail et le mot de passe créés à l'étape 3.
4. Vous devez voir le tableau de bord de l'administration.

---

## Étape 8 – Partager le lien

- **Lien de réservation publique** : `VOTRE_URL/` — partagez ce lien sur WhatsApp, Instagram, etc.
- **Lien admin** : `VOTRE_URL/admin` — gardez ce lien pour vous seul.

---

## Mettre à jour l'application

Si vous modifiez le code et souhaitez redéployer :

1. Dans le terminal, depuis le dossier du projet :
   ```bash
   git add .
   git commit -m "Mise à jour"
   git push
   ```
2. Vercel redéploie automatiquement en 1-2 minutes.

---

## Problèmes courants

| Problème | Solution |
|----------|---------|
| La page blanche s'affiche | Vérifiez que les variables d'environnement sont bien saisies dans Vercel (sans espace). |
| Impossible de se connecter à `/admin` | Vérifiez l'e-mail et le mot de passe dans Supabase → Authentication → Users. |
| Les créneaux n'apparaissent pas | Vérifiez que la migration SQL a bien été exécutée (Étape 2). |
| Erreur "Missing Supabase environment variables" | Les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont manquantes dans Vercel. |

---

## Configuration des créneaux horaires

Une fois connecté à `/admin` :

1. Cliquez **"Paramètres"** dans le menu.
2. Activez ou désactivez les créneaux horaires selon vos besoins.
3. Ajoutez de nouveaux créneaux avec le champ "Nouveau créneau".
4. Cliquez **"Enregistrer"**.

---

*Bonne saison de paintball ! 🎯*
