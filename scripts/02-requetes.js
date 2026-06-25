// =============================================================
// 🔍 02-REQUETES.JS — Requêtes avancées
// Usage : mongosh > load("scripts/02-requetes.js")
// =============================================================

db = db.getSiblingDB("gestionStock");
print("\n========== 02 — REQUÊTES AVANCÉES ==========\n");

// ─────────────────────────────────────────
// 1. FILTRE $gt — Articles dont le prix > 5000 FCFA
// ─────────────────────────────────────────
print("── 1. $gt : Articles prix > 5 000 FCFA ──");

const chersArticles = db.articles.find(
  { prix: { $gt: 5000 } },
  { nom: 1, prix: 1, reference: 1 }
).toArray();

chersArticles.forEach(a =>
  print("   💰 " + a.nom + " — " + a.prix + " FCFA")
);
print("   Total : " + chersArticles.length + " article(s)");

// ─────────────────────────────────────────
// 2. FILTRE $lt — Articles dont le prix < 1000 FCFA
// ─────────────────────────────────────────
print("\n── 2. $lt : Articles prix < 1 000 FCFA ──");

const peuChers = db.articles.find(
  { prix: { $lt: 1000 } },
  { nom: 1, prix: 1 }
).toArray();

peuChers.forEach(a =>
  print("   💸 " + a.nom + " — " + a.prix + " FCFA")
);

// ─────────────────────────────────────────
// 3. FILTRE $gte $lte — Articles entre 1000 et 10000 FCFA
// ─────────────────────────────────────────
print("\n── 3. $gte / $lte : Articles entre 1 000 et 10 000 FCFA ──");

const gameMoyenne = db.articles.find(
  { prix: { $gte: 1000, $lte: 10000 } },
  { nom: 1, prix: 1 }
).sort({ prix: 1 }).toArray();

gameMoyenne.forEach(a =>
  print("   📦 " + a.nom + " — " + a.prix + " FCFA")
);

// ─────────────────────────────────────────
// 4. FILTRE $in — Mouvements de type ENTREE ou TRANSFERT
// ─────────────────────────────────────────
print("\n── 4. $in : Mouvements ENTREE ou TRANSFERT ──");

const mouvEntreeTransfert = db.mouvements.find(
  { type: { $in: ["ENTREE", "TRANSFERT"] } },
  { type: 1, quantite: 1, date: 1 }
).toArray();

mouvEntreeTransfert.forEach(m =>
  print("   🔁 " + m.type + " — Qté : " + m.quantite)
);
print("   Total : " + mouvEntreeTransfert.length + " mouvement(s)");

// ─────────────────────────────────────────
// 5. EXPRESSION RÉGULIÈRE — Recherche d'articles contenant "kg"
// ─────────────────────────────────────────
print("\n── 5. Regex : Articles contenant 'kg' (insensible casse) ──");

const articlesKg = db.articles.find(
  { nom: { $regex: /kg/i } },
  { nom: 1, reference: 1 }
).toArray();

articlesKg.forEach(a =>
  print("   🔎 " + a.nom + " [" + a.reference + "]")
);

// ─────────────────────────────────────────
// 6. EXPRESSION RÉGULIÈRE — Fournisseurs dont le nom commence par une lettre majuscule G
// ─────────────────────────────────────────
print("\n── 6. Regex : Fournisseurs dont le nom commence par 'G' ──");

const fournG = db.fournisseurs.find(
  { nom: { $regex: /^G/ } },
  { nom: 1, email: 1 }
).toArray();

fournG.forEach(f =>
  print("   🏭 " + f.nom + " — " + f.email)
);

// ─────────────────────────────────────────
// 7. TRI sort() — Articles triés par prix décroissant
// ─────────────────────────────────────────
print("\n── 7. sort() : Articles par prix décroissant ──");

const articlesTriesPrix = db.articles.find(
  {},
  { nom: 1, prix: 1 }
).sort({ prix: -1 }).toArray();

articlesTriesPrix.forEach((a, i) =>
  print("   " + (i + 1) + ". " + a.nom + " — " + a.prix + " FCFA")
);

// ─────────────────────────────────────────
// 8. TRI sort() — Mouvements triés par date décroissante
// ─────────────────────────────────────────
print("\n── 8. sort() : 5 derniers mouvements ──");

const derniersMovts = db.mouvements.find(
  {},
  { type: 1, quantite: 1, date: 1 }
).sort({ date: -1 }).limit(5).toArray();

derniersMovts.forEach(m =>
  print("   📅 " + m.date.toISOString().substring(0, 10) + " — " + m.type + " (" + m.quantite + ")")
);

// ─────────────────────────────────────────
// 9. PAGINATION skip() / limit() — Page 1 (3 articles par page)
// ─────────────────────────────────────────
print("\n── 9. Pagination : Page 1 (3 articles / page) ──");

const page = 1;
const pageSize = 3;
const skip = (page - 1) * pageSize;

const articlesPage1 = db.articles.find(
  {},
  { nom: 1, prix: 1 }
).sort({ nom: 1 }).skip(skip).limit(pageSize).toArray();

print("   Page " + page + " :");
articlesPage1.forEach(a =>
  print("   • " + a.nom + " — " + a.prix + " FCFA")
);

// ─────────────────────────────────────────
// 10. PAGINATION — Page 2
// ─────────────────────────────────────────
print("\n── 10. Pagination : Page 2 ──");

const articlesPage2 = db.articles.find(
  {},
  { nom: 1, prix: 1 }
).sort({ nom: 1 }).skip(pageSize).limit(pageSize).toArray();

print("   Page 2 :");
articlesPage2.forEach(a =>
  print("   • " + a.nom + " — " + a.prix + " FCFA")
);

// ─────────────────────────────────────────
// 11. COMBINAISON — Articles chers et en alerte basse
// ─────────────────────────────────────────
print("\n── 11. Combiné : Articles prix > 5000 et seuil > 20 ──");

const articlesAlerte = db.articles.find(
  {
    prix: { $gt: 5000 },
    seuilAlerte: { $gt: 20 }
  },
  { nom: 1, prix: 1, seuilAlerte: 1 }
).sort({ seuilAlerte: -1 }).toArray();

articlesAlerte.forEach(a =>
  print("   ⚠️  " + a.nom + " — Prix: " + a.prix + " — Seuil: " + a.seuilAlerte)
);

print("\n✅ Script 02-requetes.js terminé.\n");
