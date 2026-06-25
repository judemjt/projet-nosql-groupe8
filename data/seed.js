// =============================================================
// 🌱 SEED.JS — Données de test StockPro (base réelle)
// Usage : mongosh > load("data/seed.js")
// =============================================================

db = db.getSiblingDB("gestionStock");

// ─────────────────────────────────────────
// 🧹 Nettoyage
// ─────────────────────────────────────────
print("🧹 Nettoyage des collections...");
db.articles.deleteMany({});
db.entrepots.deleteMany({});
db.fournisseurs.deleteMany({});
db.mouvements.deleteMany({});
db.users.deleteMany({});
print("✅ Collections vidées.");

// ─────────────────────────────────────────
// 👤 UTILISATEURS
// ─────────────────────────────────────────
print("\n👤 Insertion des utilisateurs...");
db.users.insertMany([
  {
    nom: "MJT",
    email: "admin@stockpro.com",
    motDePasse: "$2b$10$Km04TR8cmyVsc5.sG0idrezyvC0.sEibkx4AU7ypIYsNGfgqbN6WS",
    role: "ADMIN",
    isActive: true,
    sessionId: null,
    createdAt: ISODate("2026-06-14T19:02:34.655Z"),
    updatedAt: ISODate("2026-06-14T23:48:37.143Z"),
    __v: 0
  },
  {
    nom: "Jude",
    email: "jude@stockpro.com",
    motDePasse: "$2b$10$V4pbnpNx6XeoFksiXgrw6Ojo1KjQBun1zCFL.YMvzOOp9VIsPd0Xq",
    role: "MAGASINIER",
    isActive: true,
    sessionId: null,
    createdAt: ISODate("2026-06-14T21:50:25.592Z"),
    updatedAt: ISODate("2026-06-14T23:45:59.176Z"),
    __v: 0
  },
  {
    nom: "vincianne",
    email: "vincianne@stockpro.com",
    motDePasse: "$2b$10$YI1O6R86OX9PVeqFxsq0ZOxq5Oz3WuMdWf/uqUo.JtdL32jmDr3QS",
    role: "MAGASINIER",
    sessionId: null,
    createdAt: ISODate("2026-06-14T23:57:30.478Z"),
    updatedAt: ISODate("2026-06-14T23:57:30.478Z"),
    __v: 0
  },
  {
    nom: "Julius",
    email: "Julius@stockpro.com",
    motDePasse: "$2b$10$bBWPyCtuBljLfxBajcNWK.Wzzr71lEJIyt1PkgJLhH.Ebw1G367Be",
    role: "MAGASINIER",
    sessionId: null,
    createdAt: ISODate("2026-06-14T23:58:46.473Z"),
    updatedAt: ISODate("2026-06-14T23:58:46.473Z"),
    __v: 0
  }
]);
print("✅ " + db.users.countDocuments() + " utilisateurs insérés.");

// ─────────────────────────────────────────
// 🏭 FOURNISSEURS
// ─────────────────────────────────────────
print("\n🏭 Insertion des fournisseurs...");
db.fournisseurs.insertMany([
  {
    nom: "Tech Supply Gabon",
    contact: "074000000"
  },
  {
    nom: "Informatique Plus",
    contact: "077000000"
  },
  {
    nom: "Test Fournisseur",
    telephone: "070000000",
    email: "test@mail.com",
    createdAt: ISODate("2026-06-10T22:02:52.813Z"),
    updatedAt: ISODate("2026-06-10T22:02:52.813Z"),
    __v: 0
  }
]);
print("✅ " + db.fournisseurs.countDocuments() + " fournisseurs insérés.");

// ─────────────────────────────────────────
// 📦 ARTICLES
// ─────────────────────────────────────────
print("\n📦 Insertion des articles...");
db.articles.insertMany([
  {
    nom: "Ordinateur HP",
    reference: "HP001",
    prix: 350000,
    seuilAlerte: 5
  },
  {
    nom: "Clavier Logitech",
    reference: "LOGI001",
    prix: 15000,
    seuilAlerte: 10
  },
  {
    nom: "Souris Dell",
    reference: "DELL001",
    prix: 10000,
    seuilAlerte: 8
  },
  {
    nom: "PC Test",
    reference: "TEST123",
    prix: 100000,
    seuilAlerte: 5,
    createdAt: ISODate("2026-06-10T22:03:38.194Z"),
    updatedAt: ISODate("2026-06-10T22:03:38.194Z"),
    __v: 0
  }
]);
print("✅ " + db.articles.countDocuments() + " articles insérés.");

// Récupérer les IDs
const hp      = db.articles.findOne({ reference: "HP001" })._id;
const clavier = db.articles.findOne({ reference: "LOGI001" })._id;
const souris  = db.articles.findOne({ reference: "DELL001" })._id;

const fournTech  = db.fournisseurs.findOne({ nom: "Tech Supply Gabon" })._id;
const fournInfo  = db.fournisseurs.findOne({ nom: "Informatique Plus" })._id;

const userAdmin = db.users.findOne({ role: "ADMIN" })._id;
const userJude  = db.users.findOne({ email: "jude@stockpro.com" })._id;

// ─────────────────────────────────────────
// 🏢 ENTREPÔTS avec stock embarqué
// ─────────────────────────────────────────
print("\n🏢 Insertion des entrepôts...");
db.entrepots.insertMany([
  {
    nom: "Entrepôt Libreville",
    localisation: "Libreville",
    stock: [
      { article: hp,      quantite: 40 },
      { article: souris,  quantite: 54 },
      { article: clavier, quantite: 2  }
    ],
    __v: 3,
    updatedAt: ISODate("2026-06-14T23:52:02.651Z")
  },
  {
    nom: "Entrepôt Owendo",
    localisation: "Owendo",
    stock: [
      { article: clavier, quantite: 72  },
      { article: souris,  quantite: 252 },
      { article: hp,      quantite: 106 }
    ],
    __v: 3,
    updatedAt: ISODate("2026-06-14T23:52:02.652Z")
  },
  {
    nom: "MBS",
    localisation: "Libreville",
    stock: [
      { article: souris,  quantite: 114 },
      { article: clavier, quantite: 144 }
    ],
    createdAt: ISODate("2026-06-12T19:35:53.908Z"),
    updatedAt: ISODate("2026-06-14T21:30:39.119Z"),
    __v: 2
  }
]);
print("✅ " + db.entrepots.countDocuments() + " entrepôts insérés.");

const entLib  = db.entrepots.findOne({ nom: "Entrepôt Libreville" })._id;
const entOwen = db.entrepots.findOne({ nom: "Entrepôt Owendo" })._id;
const entMBS  = db.entrepots.findOne({ nom: "MBS" })._id;

// ─────────────────────────────────────────
// 🔁 MOUVEMENTS
// ─────────────────────────────────────────
print("\n🔁 Insertion des mouvements...");
db.mouvements.insertMany([
  // ENTRÉES
  { type:"ENTREE", article:souris,  fournisseur:fournInfo,  quantite:20,  destination:entLib,  date:ISODate("2026-06-11T00:09:08Z"), createdAt:ISODate("2026-06-11T00:09:08Z"), updatedAt:ISODate("2026-06-11T00:09:08Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournInfo,  quantite:100, destination:entLib,  date:ISODate("2026-06-11T00:13:13Z"), createdAt:ISODate("2026-06-11T00:13:13Z"), updatedAt:ISODate("2026-06-11T00:13:13Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournInfo,  quantite:120, destination:entOwen, date:ISODate("2026-06-11T00:14:07Z"), createdAt:ISODate("2026-06-11T00:14:07Z"), updatedAt:ISODate("2026-06-11T00:14:07Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech,  quantite:20,  destination:entLib,  date:ISODate("2026-06-11T01:02:06Z"), createdAt:ISODate("2026-06-11T01:02:06Z"), updatedAt:ISODate("2026-06-11T01:02:06Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech,  quantite:25,  destination:entLib,  date:ISODate("2026-06-12T00:39:39Z"), createdAt:ISODate("2026-06-12T00:39:39Z"), updatedAt:ISODate("2026-06-12T00:39:39Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournInfo,  quantite:40,  destination:entOwen, date:ISODate("2026-06-12T01:03:37Z"), createdAt:ISODate("2026-06-12T01:03:37Z"), updatedAt:ISODate("2026-06-12T01:03:37Z"), __v:0 },
  { type:"ENTREE", article:clavier, fournisseur:fournInfo,  quantite:40,  destination:entOwen, date:ISODate("2026-06-12T01:04:38Z"), createdAt:ISODate("2026-06-12T01:04:38Z"), updatedAt:ISODate("2026-06-12T01:04:38Z"), __v:0 },
  { type:"ENTREE", article:souris,  fournisseur:fournTech,  quantite:11,  destination:entLib,  source:null, date:ISODate("2026-06-12T12:43:44Z"), createdAt:ISODate("2026-06-12T12:43:44Z"), updatedAt:ISODate("2026-06-12T12:43:44Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech,  quantite:10,  destination:entLib,  source:null, date:ISODate("2026-06-12T12:47:34Z"), createdAt:ISODate("2026-06-12T12:47:34Z"), updatedAt:ISODate("2026-06-12T12:47:34Z"), __v:0 },
  { type:"ENTREE", article:souris,  fournisseur:fournInfo,  quantite:100, destination:entOwen, source:null, date:ISODate("2026-06-12T19:08:50Z"), createdAt:ISODate("2026-06-12T19:08:50Z"), updatedAt:ISODate("2026-06-12T19:08:50Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech,  quantite:25,  destination:entLib,  source:null, date:ISODate("2026-06-12T19:21:30Z"), createdAt:ISODate("2026-06-12T19:21:30Z"), updatedAt:ISODate("2026-06-12T19:21:30Z"), __v:0 },
  { type:"ENTREE", article:souris,  fournisseur:fournTech,  quantite:25,  destination:entLib,  source:null, date:ISODate("2026-06-12T19:21:35Z"), createdAt:ISODate("2026-06-12T19:21:35Z"), updatedAt:ISODate("2026-06-12T19:21:35Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech,  quantite:12,  destination:entLib,  source:null, date:ISODate("2026-06-12T20:00:28Z"), createdAt:ISODate("2026-06-12T20:00:28Z"), updatedAt:ISODate("2026-06-12T20:00:28Z"), __v:0 },
  { type:"ENTREE", article:souris,  fournisseur:fournInfo,  quantite:112, destination:entMBS,  source:null, date:ISODate("2026-06-12T20:07:02Z"), createdAt:ISODate("2026-06-12T20:07:02Z"), updatedAt:ISODate("2026-06-12T20:07:02Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech, utilisateur:userAdmin, quantite:12, destination:entLib, source:null, date:ISODate("2026-06-14T20:12:32Z"), createdAt:ISODate("2026-06-14T20:12:32Z"), updatedAt:ISODate("2026-06-14T20:12:32Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech, utilisateur:userAdmin, quantite:120,destination:entMBS,  source:null, date:ISODate("2026-06-14T21:30:39Z"), createdAt:ISODate("2026-06-14T21:30:39Z"), updatedAt:ISODate("2026-06-14T21:30:39Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech, utilisateur:userJude,  quantite:11, destination:entLib,  source:null, date:ISODate("2026-06-14T21:58:50Z"), createdAt:ISODate("2026-06-14T21:58:50Z"), updatedAt:ISODate("2026-06-14T21:58:50Z"), __v:0 },
  { type:"ENTREE", article:souris,  fournisseur:fournTech, utilisateur:userJude,  quantite:14, destination:entLib,  source:null, date:ISODate("2026-06-14T22:18:15Z"), createdAt:ISODate("2026-06-14T22:18:15Z"), updatedAt:ISODate("2026-06-14T22:18:15Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech, utilisateur:userAdmin, quantite:1,  destination:entLib,  source:null, date:ISODate("2026-06-14T22:43:14Z"), createdAt:ISODate("2026-06-14T22:43:14Z"), updatedAt:ISODate("2026-06-14T22:43:14Z"), __v:0 },
  { type:"ENTREE", article:clavier, fournisseur:fournInfo, utilisateur:userAdmin, quantite:200,destination:entOwen, source:null, date:ISODate("2026-06-14T22:59:31Z"), createdAt:ISODate("2026-06-14T22:59:31Z"), updatedAt:ISODate("2026-06-14T22:59:31Z"), __v:0 },
  { type:"ENTREE", article:souris,  fournisseur:fournTech, utilisateur:userJude,  quantite:14, destination:entLib,  source:null, date:ISODate("2026-06-14T23:03:33Z"), createdAt:ISODate("2026-06-14T23:03:33Z"), updatedAt:ISODate("2026-06-14T23:03:33Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech, utilisateur:userJude,  quantite:25, destination:entLib,  source:null, date:ISODate("2026-06-14T23:25:52Z"), createdAt:ISODate("2026-06-14T23:25:52Z"), updatedAt:ISODate("2026-06-14T23:25:52Z"), __v:0 },
  { type:"ENTREE", article:hp,      fournisseur:fournTech, utilisateur:userJude,  quantite:20, destination:entLib,  source:null, date:ISODate("2026-06-14T23:47:20Z"), createdAt:ISODate("2026-06-14T23:47:20Z"), updatedAt:ISODate("2026-06-14T23:47:20Z"), __v:0 },
  // SORTIES
  { type:"SORTIE", article:hp,      fournisseur:null, quantite:100, source:entLib,  destination:null, date:ISODate("2026-06-12T12:45:08Z"), createdAt:ISODate("2026-06-12T12:45:08Z"), updatedAt:ISODate("2026-06-12T12:45:08Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, quantite:46,  source:entLib,  destination:null, date:ISODate("2026-06-12T12:46:35Z"), createdAt:ISODate("2026-06-12T12:46:35Z"), updatedAt:ISODate("2026-06-12T12:46:35Z"), __v:0 },
  { type:"SORTIE", article:souris,  fournisseur:null, quantite:20,  source:entOwen, destination:null, date:ISODate("2026-06-12T12:51:54Z"), createdAt:ISODate("2026-06-12T12:51:54Z"), updatedAt:ISODate("2026-06-12T12:51:54Z"), __v:0 },
  { type:"SORTIE", article:souris,  fournisseur:null, quantite:2,   source:entOwen, destination:null, date:ISODate("2026-06-12T12:52:45Z"), createdAt:ISODate("2026-06-12T12:52:45Z"), updatedAt:ISODate("2026-06-12T12:52:45Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, quantite:10,  source:entLib,  destination:null, date:ISODate("2026-06-12T12:53:52Z"), createdAt:ISODate("2026-06-12T12:53:52Z"), updatedAt:ISODate("2026-06-12T12:53:52Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, quantite:50,  source:entOwen, destination:null, date:ISODate("2026-06-12T13:12:45Z"), createdAt:ISODate("2026-06-12T13:12:45Z"), updatedAt:ISODate("2026-06-12T13:12:45Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, quantite:50,  source:entOwen, destination:null, date:ISODate("2026-06-12T13:14:44Z"), createdAt:ISODate("2026-06-12T13:14:44Z"), updatedAt:ISODate("2026-06-12T13:14:44Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, quantite:3,   source:entLib,  destination:null, date:ISODate("2026-06-12T13:21:30Z"), createdAt:ISODate("2026-06-12T13:21:30Z"), updatedAt:ISODate("2026-06-12T13:21:30Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, destinataire:"MJT", quantite:5, source:entOwen, destination:null, date:ISODate("2026-06-12T19:04:52Z"), createdAt:ISODate("2026-06-12T19:04:52Z"), updatedAt:ISODate("2026-06-12T19:04:52Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, destinataire:"HJK", quantite:5, source:entLib,  destination:null, date:ISODate("2026-06-13T02:25:29Z"), createdAt:ISODate("2026-06-13T02:25:29Z"), updatedAt:ISODate("2026-06-13T02:25:29Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, destinataire:"TYUIO", utilisateur:userAdmin, quantite:10, source:entLib, destination:null, date:ISODate("2026-06-13T10:07:05Z"), createdAt:ISODate("2026-06-13T10:07:05Z"), updatedAt:ISODate("2026-06-13T10:07:05Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, destinataire:"ALT", utilisateur:userJude,  quantite:10, source:entLib, destination:null, date:ISODate("2026-06-14T21:59:39Z"), createdAt:ISODate("2026-06-14T21:59:39Z"), updatedAt:ISODate("2026-06-14T21:59:39Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, destinataire:"ADS", utilisateur:userAdmin, quantite:10, source:entLib, destination:null, date:ISODate("2026-06-14T23:04:11Z"), createdAt:ISODate("2026-06-14T23:04:11Z"), updatedAt:ISODate("2026-06-14T23:04:11Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, destinataire:"BMT", utilisateur:userAdmin, quantite:30, source:entLib, destination:null, date:ISODate("2026-06-14T23:49:43Z"), createdAt:ISODate("2026-06-14T23:49:43Z"), updatedAt:ISODate("2026-06-14T23:49:43Z"), __v:0 },
  { type:"SORTIE", article:hp,      fournisseur:null, destinataire:"BMT", utilisateur:userAdmin, quantite:14, source:entLib, destination:null, date:ISODate("2026-06-14T23:50:16Z"), createdAt:ISODate("2026-06-14T23:50:16Z"), updatedAt:ISODate("2026-06-14T23:50:16Z"), __v:0 },
  // TRANSFERTS
  { type:"TRANSFERT", article:souris,  fournisseur:null, quantite:10,  source:entLib,  destination:entOwen, date:ISODate("2026-06-12T12:49:07Z"), createdAt:ISODate("2026-06-12T12:49:07Z"), updatedAt:ISODate("2026-06-12T12:49:07Z"), __v:0 },
  { type:"TRANSFERT", article:souris,  fournisseur:null, quantite:18,  source:entLib,  destination:entOwen, date:ISODate("2026-06-12T12:51:11Z"), createdAt:ISODate("2026-06-12T12:51:11Z"), updatedAt:ISODate("2026-06-12T12:51:11Z"), __v:0 },
  { type:"TRANSFERT", article:hp,      fournisseur:null, destinataire:null, quantite:3,  source:entOwen, destination:entLib,  date:ISODate("2026-06-12T18:47:44Z"), createdAt:ISODate("2026-06-12T18:47:44Z"), updatedAt:ISODate("2026-06-12T18:47:44Z"), __v:0 },
  { type:"TRANSFERT", article:souris,  fournisseur:null, destinataire:null, quantite:2,  source:entLib,  destination:entMBS,  date:ISODate("2026-06-12T20:06:01Z"), createdAt:ISODate("2026-06-12T20:06:01Z"), updatedAt:ISODate("2026-06-12T20:06:01Z"), __v:0 },
  { type:"TRANSFERT", article:hp,      fournisseur:null, destinataire:null, quantite:10, source:entLib,  destination:entOwen, date:ISODate("2026-06-13T01:24:43Z"), createdAt:ISODate("2026-06-13T01:24:43Z"), updatedAt:ISODate("2026-06-13T01:24:43Z"), __v:0 },
  { type:"TRANSFERT", article:hp,      fournisseur:null, destinataire:null, quantite:11, source:entLib,  destination:entMBS,  date:ISODate("2026-06-13T02:24:35Z"), createdAt:ISODate("2026-06-13T02:24:35Z"), updatedAt:ISODate("2026-06-13T02:24:35Z"), __v:0 },
  { type:"TRANSFERT", article:hp,      fournisseur:null, destinataire:null, utilisateur:userAdmin, quantite:5, source:entLib, destination:entOwen, date:ISODate("2026-06-14T23:52:02Z"), createdAt:ISODate("2026-06-14T23:52:02Z"), updatedAt:ISODate("2026-06-14T23:52:02Z"), __v:0 }
]);
print("✅ " + db.mouvements.countDocuments() + " mouvements insérés.");

print("\n📊 ========== RÉCAPITULATIF ==========");
print("   Articles    : " + db.articles.countDocuments());
print("   Entrepôts   : " + db.entrepots.countDocuments());
print("   Fournisseurs: " + db.fournisseurs.countDocuments());
print("   Mouvements  : " + db.mouvements.countDocuments());
print("   Utilisateurs: " + db.users.countDocuments());
print("=====================================");
print("✅ Seed terminé !");
