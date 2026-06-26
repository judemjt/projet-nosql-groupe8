// =============================================================
// 🔍 02-REQUETES.JS — Requêtes avancées
// Usage : mongosh > load("scripts/02-requetes.js")
// =============================================================

db = db.getSiblingDB("gestionStock");
print("\n========== 02 — REQUÊTES AVANCÉES ==========\n");

// ─────────────────────────────────────────
// 1. FILTRE $gt — Articles dont le prix > 5 000 FCFA
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
// 2. FILTRE $lt — Articles dont le prix < 50 000 FCFA
// ─────────────────────────────────────────
print("\n── 2. $lt : Articles prix < 50 000 FCFA ──");

const peuChers = db.articles.find(
  { prix: { $lt: 50000 } },
  { nom: 1, prix: 1 }
).toArray();

peuChers.forEach(a =>
  print("   💸 " + a.nom + " — " + a.prix + " FCFA")
);

// ─────────────────────────────────────────
// 3. FILTRE $gte $lte — Articles entre 10 000 et 100 000 FCFA
// ─────────────────────────────────────────
print("\n── 3. $gte / $lte : Articles entre 10 000 et 100 000 FCFA ──");

const gameMoyenne = db.articles.find(
  { prix: { $gte: 10000, $lte: 100000 } },
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
// 5. EXPRESSION RÉGULIÈRE — Recherche d'articles contenant "Dell"
// ─────────────────────────────────────────
print("\n── 5. Regex : Articles contenant 'Dell' (insensible casse) ──");

const articlesDell = db.articles.find(
  { nom: { $regex: /dell/i } },
  { nom: 1, reference: 1 }
).toArray();

articlesDell.forEach(a =>
  print("   🔎 " + a.nom + " [" + a.reference + "]")
);

// ─────────────────────────────────────────
// 6. EXPRESSION RÉGULIÈRE — Fournisseurs dont le nom commence par "T"
// ─────────────────────────────────────────
print("\n── 6. Regex : Fournisseurs dont le nom commence par 'T' ──");

const fournT = db.fournisseurs.find(
  { nom: { $regex: /^T/ } },
  { nom: 1, contact: 1 }
).toArray();

fournT.forEach(f =>
  print("   🏭 " + f.nom + " — " + f.contact)
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
// 8. TRI sort() — 5 derniers mouvements par date décroissante
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
// 11. COMBINAISON — Articles coûteux avec seuil d'alerte bas
//     Prix > 10 000 FCFA ET seuilAlerte <= 10
// ─────────────────────────────────────────
print("\n── 11. Combiné : Articles prix > 10 000 FCFA et seuil ≤ 10 ──");

const articlesAlerte = db.articles.find(
  {
    prix: { $gt: 10000 },
    seuilAlerte: { $lte: 10 }
  },
  { nom: 1, prix: 1, seuilAlerte: 1 }
).sort({ prix: -1 }).toArray();

articlesAlerte.forEach(a =>
  print("   ⚠️  " + a.nom + " — Prix: " + a.prix + " — Seuil: " + a.seuilAlerte)
);

print("\n✅ Script 02-requetes.js terminé.\n");
