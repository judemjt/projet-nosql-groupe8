// =============================================================
// 📝 01-CRUD.JS — Opérations CRUD de base
// Usage : mongosh > load("scripts/01-crud.js")
// =============================================================

db = db.getSiblingDB("gestionStock");
print("\n========== 01 — OPÉRATIONS CRUD ==========\n");

// ─────────────────────────────────────────
// 1. INSERT ONE — Insérer un article
// ─────────────────────────────────────────
print("── 1. insertOne : Ajout d'un nouvel article ──");

const insertResult = db.articles.insertOne({
  nom: "Café Robusta 250g",
  reference: "CAF-250G",
  prix: 2500,
  seuilAlerte: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0
});

print("✅ Article inséré — _id : " + insertResult.insertedId);

// ─────────────────────────────────────────
// 2. INSERT MANY — Insérer plusieurs fournisseurs
// ─────────────────────────────────────────
print("\n── 2. insertMany : Ajout de fournisseurs ──");

const insertManyResult = db.fournisseurs.insertMany([
  {
    nom: "Import-Export Nkembo",
    contact: "M. Nkembo Gaston",
    email: "nkembo@impexp.ga",
    telephone: "+241 07 55 66 77",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  },
  {
    nom: "Boulangerie Industrielle du Gabon",
    contact: "Mme. Akaga Laure",
    email: "contact@big.ga",
    telephone: "+241 01 88 99 00",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  }
]);

print("✅ " + insertManyResult.insertedIds.length + " fournisseurs insérés.");

// ─────────────────────────────────────────
// 3. FIND — Lire les articles
// ─────────────────────────────────────────
print("\n── 3. find : Liste de tous les articles ──");

const articles = db.articles.find({}, { nom: 1, reference: 1, prix: 1 }).toArray();
articles.forEach(a => print("   → " + a.nom + " (" + a.reference + ") — " + a.prix + " FCFA"));

// ─────────────────────────────────────────
// 4. FIND ONE — Trouver un article par référence
// ─────────────────────────────────────────
print("\n── 4. findOne : Recherche par référence ──");

const article = db.articles.findOne({ reference: "RIZ-25KG" });
if (article) {
  print("✅ Trouvé : " + article.nom + " — Prix : " + article.prix + " FCFA");
} else {
  print("❌ Article non trouvé.");
}

// ─────────────────────────────────────────
// 5. UPDATE ONE — Modifier le prix d'un article
// ─────────────────────────────────────────
print("\n── 5. updateOne : Mise à jour du prix du riz ──");

const updateOneResult = db.articles.updateOne(
  { reference: "RIZ-25KG" },
  {
    $set: {
      prix: 16000,
      updatedAt: new Date()
    }
  }
);

print("✅ Documents modifiés : " + updateOneResult.modifiedCount);
const rizMaj = db.articles.findOne({ reference: "RIZ-25KG" });
print("   Nouveau prix : " + rizMaj.prix + " FCFA");

// ─────────────────────────────────────────
// 6. UPDATE MANY — Augmenter le seuil d'alerte de tous les articles alimentaires
// ─────────────────────────────────────────
print("\n── 6. updateMany : Augmentation des seuils d'alerte ──");

const updateManyResult = db.articles.updateMany(
  { seuilAlerte: { $lt: 30 } },
  {
    $inc: { seuilAlerte: 5 },
    $set: { updatedAt: new Date() }
  }
);

print("✅ Documents modifiés : " + updateManyResult.modifiedCount);

// ─────────────────────────────────────────
// 7. DELETE ONE — Supprimer le fournisseur de test
// ─────────────────────────────────────────
print("\n── 7. deleteOne : Suppression du fournisseur de test ──");

const deleteResult = db.fournisseurs.deleteOne(
  { nom: "Import-Export Nkembo" }
);

print("✅ Documents supprimés : " + deleteResult.deletedCount);

// ─────────────────────────────────────────
// 8. FIND avec projection — Résumé stock par entrepôt
// ─────────────────────────────────────────
print("\n── 8. find avec projection : Entrepôts ──");

const entrepots = db.entrepots.find(
  {},
  { nom: 1, localisation: 1, "stock": { $slice: 3 } }
).toArray();

entrepots.forEach(e => {
  print("   🏢 " + e.nom + " (" + e.localisation + ")");
});

print("\n✅ Script 01-crud.js terminé.\n");
