// =============================================================
// 📊 03-AGREGATIONS.JS — Pipelines d'agrégation MongoDB
// Usage : mongosh > load("scripts/03-agregations.js")
// =============================================================

db = db.getSiblingDB("gestionStock");
print("\n========== 03 — AGRÉGATIONS ==========\n");

// ─────────────────────────────────────────
// 1. $group — Statistiques des mouvements par type
// ─────────────────────────────────────────
print("── 1. $group : Statistiques des mouvements par type ──");

const statsMouvements = db.mouvements.aggregate([
  {
    $group: {
      _id: "$type",
      nombreOperations: { $sum: 1 },
      quantiteTotale:   { $sum: "$quantite" },
      quantiteMoyenne:  { $avg: "$quantite" }
    }
  },
  { $sort: { nombreOperations: -1 } }
]).toArray();

statsMouvements.forEach(s =>
  print(
    "   " + s._id +
    " — Opérations: " + s.nombreOperations +
    " | Qté totale: " + s.quantiteTotale +
    " | Qté moy: " + Math.round(s.quantiteMoyenne)
  )
);

// ─────────────────────────────────────────
// 2. $match + $group — Mouvements ENTREE seulement, groupés par fournisseur
// ─────────────────────────────────────────
print("\n── 2. $match + $group : Entrées par fournisseur ──");

const entreesParFournisseur = db.mouvements.aggregate([
  { $match: { type: "ENTREE" } },
  {
    $group: {
      _id: "$fournisseur",
      totalEntrees: { $sum: 1 },
      quantiteTotal: { $sum: "$quantite" }
    }
  },
  { $sort: { quantiteTotal: -1 } }
]).toArray();

entreesParFournisseur.forEach(e =>
  print("   Fournisseur ID: " + e._id + " — " + e.totalEntrees + " livraison(s) — " + e.quantiteTotal + " unités")
);

// ─────────────────────────────────────────
// 3. $lookup — Joindre mouvements avec articles
// ─────────────────────────────────────────
print("\n── 3. $lookup : Mouvements avec détail article ──");

const mouvAvecArticle = db.mouvements.aggregate([
  { $match: { type: "SORTIE" } },
  {
    $lookup: {
      from: "articles",
      localField: "article",
      foreignField: "_id",
      as: "articleInfo"
    }
  },
  { $unwind: "$articleInfo" },
  {
    $project: {
      type: 1,
      quantite: 1,
      destinataire: 1,
      "articleInfo.nom": 1,
      "articleInfo.prix": 1,
      valeurSortie: { $multiply: ["$quantite", "$articleInfo.prix"] }
    }
  },
  { $sort: { valeurSortie: -1 } }
]).toArray();

mouvAvecArticle.forEach(m =>
  print(
    "   📤 " + m.articleInfo.nom +
    " × " + m.quantite +
    " → " + (m.destinataire || "Client") +
    " | Valeur: " + m.valeurSortie + " FCFA"
  )
);

// ─────────────────────────────────────────
// 4. $unwind + $lookup + $match — Articles sous seuil d'alerte
//    (Requête clé du tableau de bord)
// ─────────────────────────────────────────
print("\n── 4. Alertes stock — Articles sous seuil (par entrepôt) ──");

const alertesStock = db.entrepots.aggregate([
  { $unwind: "$stock" },
  {
    $lookup: {
      from: "articles",
      localField: "stock.article",
      foreignField: "_id",
      as: "articleInfo"
    }
  },
  { $unwind: "$articleInfo" },
  {
    $match: {
      $expr: {
        $lt: ["$stock.quantite", "$articleInfo.seuilAlerte"]
      }
    }
  },
  {
    $project: {
      entrepot: "$nom",
      localisation: "$localisation",
      article: "$articleInfo.nom",
      reference: "$articleInfo.reference",
      quantiteActuelle: "$stock.quantite",
      seuilAlerte: "$articleInfo.seuilAlerte",
      deficit: { $subtract: ["$articleInfo.seuilAlerte", "$stock.quantite"] }
    }
  },
  { $sort: { deficit: -1 } }
]).toArray();

if (alertesStock.length === 0) {
  print("   ✅ Aucune alerte stock.");
} else {
  alertesStock.forEach(a =>
    print(
      "   ⚠️  [" + a.entrepot + "] " + a.article +
      " : " + a.quantiteActuelle + " / seuil " + a.seuilAlerte +
      " (déficit: " + a.deficit + ")"
    )
  );
}

// ─────────────────────────────────────────
// 5. $group + $sort — Valeur totale du stock par entrepôt
//    (unwind stock + lookup article + multiply quantité × prix)
// ─────────────────────────────────────────
print("\n── 5. Valeur totale du stock par entrepôt ──");

const valeurStock = db.entrepots.aggregate([
  { $unwind: "$stock" },
  {
    $lookup: {
      from: "articles",
      localField: "stock.article",
      foreignField: "_id",
      as: "articleInfo"
    }
  },
  { $unwind: "$articleInfo" },
  {
    $group: {
      _id: "$nom",
      valeurTotale: {
        $sum: { $multiply: ["$stock.quantite", "$articleInfo.prix"] }
      },
      nombreReferences: { $sum: 1 }
    }
  },
  { $sort: { valeurTotale: -1 } }
]).toArray();

valeurStock.forEach(v =>
  print(
    "   🏢 " + v._id +
    " — Valeur: " + v.valeurTotale.toLocaleString() + " FCFA" +
    " | " + v.nombreReferences + " référence(s)"
  )
);

// ─────────────────────────────────────────
// 6. $lookup (fournisseurs) + $group — Quantité reçue par fournisseur avec nom
// ─────────────────────────────────────────
print("\n── 6. $lookup fournisseur : Livraisons avec nom du fournisseur ──");

const livraisonsParFournisseur = db.mouvements.aggregate([
  { $match: { type: "ENTREE", fournisseur: { $ne: null } } },
  {
    $lookup: {
      from: "fournisseurs",
      localField: "fournisseur",
      foreignField: "_id",
      as: "fournisseurInfo"
    }
  },
  { $unwind: "$fournisseurInfo" },
  {
    $group: {
      _id: "$fournisseurInfo.nom",
      nbLivraisons: { $sum: 1 },
      totalUnites: { $sum: "$quantite" }
    }
  },
  { $sort: { totalUnites: -1 } }
]).toArray();

livraisonsParFournisseur.forEach(f =>
  print(
    "   🏭 " + f._id +
    " — " + f.nbLivraisons + " livraison(s)" +
    " — " + f.totalUnites + " unités"
  )
);

print("\n✅ Script 03-agregations.js terminé.\n");
