# 📦 StockPro — Système de Gestion de Stock et d'Inventaire

> Projet Base de Données Avancées — NoSQL / MongoDB  
> Département Informatique — Année universitaire 2024/2025  
> Libreville, Gabon

---

## 👥 Membres du groupe

| Nom | Prénom |
|-----|--------|
| MAVIOGA | Jude Tanguy |
| PEMBE MOUPOMA | Vinciane Franelle |
| NZOGHE NKOGHE | Abénislain Yannick |

---

## 🏢 Contexte métier

StockPro est une application web de gestion de stock destinée à une entreprise de distribution opérant plusieurs entrepôts à **Libreville** et **Owendo** (Gabon).

Elle permet de :
- Suivre en temps réel les **articles** (référence, prix, seuil d'alerte)
- Enregistrer tous les **mouvements de stock** : entrées fournisseur, sorties client, transferts inter-entrepôts
- Assurer la **traçabilité complète** : qui a fait quoi, quand, d'où et vers où
- Déclencher des **alertes automatiques** lorsque le stock passe sous le seuil critique
- Gérer les **fournisseurs** et les **utilisateurs** avec rôles (ADMIN / USER)
- Afficher un **tableau de bord temps réel** avec indicateurs clés

Le défi technique central est l'implémentation de **transactions MongoDB multi-documents** garantissant l'atomicité des transferts entre entrepôts.

---

## ⚙️ Prérequis

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) v6+ (local) ou [MongoDB Atlas](https://www.mongodb.com/atlas)
- `mongosh` (MongoDB Shell)
- npm v9+

---

## 🚀 Instructions d'exécution

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-groupe/projet-nosql-stockpro.git
cd projet-nosql-stockpro
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
# Éditer .env avec votre URI MongoDB et votre clé JWT
```

### 4. Insérer les données de test

```bash
mongosh
```

```js
load("data/seed.js")
```

### 5. Exécuter les scripts

```js
load("scripts/01-crud.js")
load("scripts/02-requetes.js")
load("scripts/03-agregations.js")
load("scripts/04-index.js")
```

### 6. Lancer le serveur

```bash
node server.js
```

L'application sera disponible sur `http://localhost:3000`

---

## 🌐 Déploiement production

- **Backend** : [Railway](https://railway.app) — `https://gestion-stock-production-0630.up.railway.app`
- **Base de données** : MongoDB Atlas — cluster dédié
- **Frontend** : Servi statiquement par Express

---

## 📁 Structure du dépôt

```
projet-nosql-stockpro/
├── README.md
├── conception/
│   ├── modele-donnees.pdf
│   └── schema.png
├── data/
│   └── seed.js
├── scripts/
│   ├── 01-crud.js
│   ├── 02-requetes.js
│   ├── 03-agregations.js
│   └── 04-index.js
├── explain/
│   └── explain-avant-apres.pdf
├── rapport/
│   └── rapport.pdf
└── api/
    ├── server.js
    ├── models/
    ├── routes/
    └── controllers/
```

---

## 🗄️ Collections MongoDB

| Collection | Description |
|------------|-------------|
| `articles` | Références produits avec prix et seuil d'alerte |
| `entrepots` | Entrepôts avec stock embarqué (embed) |
| `mouvements` | Historique complet des flux de stock |
| `fournisseurs` | Catalogue des fournisseurs |
| `users` | Utilisateurs avec authentification JWT |
