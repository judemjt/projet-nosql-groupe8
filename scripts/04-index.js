// =============================================================
// ⚡ 04-INDEX.JS — Indexation et analyse des performances
// Usage : mongosh > load("scripts/04-index.js")
// =============================================================

db = db.getSiblingDB("gestionStock");
print("\n========== 04 — INDEXATION ET PERFORMANCES ==========\n");

// ─────────────────────────────────────────
// ÉTAPE 1 : Supprimer les index existants (sauf _id)
//           pour simuler la situation SANS index
// ─────────────────────────────────────────
print("── ÉTAPE 1 : Suppression des index existants ──");

db.articles.dropIndexes();
db.mouvements.dropIndexes();
db.entrepots.dropIndexes();

print("✅ Index supprimés (sauf _id).");

// ─────────────────────────────────────────
// ÉTAPE 2 : AVANT INDEX — explain() sur articles.reference
// ─────────────────────────────────────────
print("\n── ÉTAPE 2 : AVANT index — Recherche par référence (articles) ──");

const explainAvantReference = db.articles.find(
  { reference: "RIZ-25KG" }
).explain("executionStats");

const statsAvant1 = explainAvantReference.executionStats;
print("   Plan utilisé    : " + explainAvantReference.queryPlanner.winningPlan.stage);
print("   Docs examinés   : " + statsAvant1.totalDocsExamined);
print("   Docs retournés  : " + statsAvant1.totalDocsReturned);
print("   Temps exécution : " + statsAvant1.executionTimeMillis + " ms");
print("   Type scan       : COLLSCAN (parcours complet de la collection)");

// ─────────────────────────────────────────
// ÉTAPE 3 : AVANT INDEX — explain() sur mouvements.type
// ─────────────────────────────────────────
print("\n── ÉTAPE 3 : AVANT index — Recherche par type (mouvements) ──");

const explainAvantType = db.mouvements.find(
  { type: "ENTREE" }
).explain("executionStats");

const statsAvant2 = explainAvantType.executionStats;
print("   Plan utilisé    : " + explainAvantType.queryPlanner.winningPlan.stage);
print("   Docs examinés   : " + statsAvant2.totalDocsExamined);
print("   Docs retournés  : " + statsAvant2.totalDocsReturned);
print("   Temps exécution : " + statsAvant2.executionTimeMillis + " ms");
print("   Type scan       : COLLSCAN");

// ─────────────────────────────────────────
// ÉTAPE 4 : AVANT INDEX — explain() sur mouvements.article + date
// ─────────────────────────────────────────
print("\n── ÉTAPE 4 : AVANT index — Requête composée (article + date) ──");

const articleRef = db.articles.findOne({ reference: "RIZ-25KG" })?._id;

let explainAvantCompose = null;
if (articleRef) {
  explainAvantCompose = db.mouvements.find(
    { article: articleRef, date: { $gte: new Date("2025-01-01") } }
  ).explain("executionStats");

  const statsAvant3 = explainAvantCompose.executionStats;
  print("   Plan utilisé    : " + explainAvantCompose.queryPlanner.winningPlan.stage);
  print("   Docs examinés   : " + statsAvant3.totalDocsExamined);
  print("   Docs retournés  : " + statsAvant3.totalDocsReturned);
  print("   Temps exécution : " + statsAvant3.executionTimeMillis + " ms");
}

// ─────────────────────────────────────────
// ÉTAPE 5 : CRÉATION DES INDEX
// ─────────────────────────────────────────
print("\n── ÉTAPE 5 : Création des index ──");

// Index unique sur reference des articles
db.articles.createIndex(
  { reference: 1 },
  { unique: true, name: "idx_articles_reference" }
);
print("✅ Index créé : articles.reference (unique)");

// Index sur le nom des articles (recherche textuelle)
db.articles.createIndex(
  { nom: 1 },
  { name: "idx_articles_nom" }
);
print("✅ Index créé : articles.nom");

// Index sur le type et la date des mouvements (requêtes fréquentes)
db.mouvements.createIndex(
  { type: 1 },
  { name: "idx_mouvements_type" }
);
print("✅ Index créé : mouvements.type");

// Index composé sur article + date (traçabilité)
db.mouvements.createIndex(
  { article: 1, date: -1 },
  { name: "idx_mouvements_article_date" }
);
print("✅ Index créé : mouvements.article + date (composé)");

// Index sur l'utilisateur (audit)
db.mouvements.createIndex(
  { utilisateur: 1 },
  { name: "idx_mouvements_utilisateur" }
);
print("✅ Index créé : mouvements.utilisateur");

// Index sur la localisation des entrepôts
db.entrepots.createIndex(
  { localisation: 1 },
  { name: "idx_entrepots_localisation" }
);
print("✅ Index créé : entrepots.localisation");

// Index unique sur email utilisateur
db.users.createIndex(
  { email: 1 },
  { unique: true, name: "idx_users_email" }
);
print("✅ Index créé : users.email (unique)");

// ─────────────────────────────────────────
// ÉTAPE 6 : APRÈS INDEX — explain() sur articles.reference
// ─────────────────────────────────────────
print("\n── ÉTAPE 6 : APRÈS index — Recherche par référence (articles) ──");

const explainApresReference = db.articles.find(
  { reference: "RIZ-25KG" }
).explain("executionStats");

const statsApres1 = explainApresReference.executionStats;
const stageName1 = explainApresReference.queryPlanner.winningPlan.inputStage
  ? explainApresReference.queryPlanner.winningPlan.inputStage.stage
  : explainApresReference.queryPlanner.winningPlan.stage;

print("   Plan utilisé    : " + stageName1);
print("   Docs examinés   : " + statsApres1.totalDocsExamined);
print("   Docs retournés  : " + statsApres1.totalDocsReturned);
print("   Temps exécution : " + statsApres1.executionTimeMillis + " ms");
print("   Type scan       : IXSCAN (utilisation de l'index)");

// ─────────────────────────────────────────
// ÉTAPE 7 : APRÈS INDEX — explain() sur mouvements.type
// ─────────────────────────────────────────
print("\n── ÉTAPE 7 : APRÈS index — Recherche par type (mouvements) ──");

const explainApresType = db.mouvements.find(
  { type: "ENTREE" }
).explain("executionStats");

const statsApres2 = explainApresType.executionStats;
const stageName2 = explainApresType.queryPlanner.winningPlan.inputStage
  ? explainApresType.queryPlanner.winningPlan.inputStage.stage
  : explainApresType.queryPlanner.winningPlan.stage;

print("   Plan utilisé    : " + stageName2);
print("   Docs examinés   : " + statsApres2.totalDocsExamined);
print("   Docs retournés  : " + statsApres2.totalDocsReturned);
print("   Temps exécution : " + statsApres2.executionTimeMillis + " ms");

// ─────────────────────────────────────────
// ÉTAPE 8 : APRÈS INDEX — explain() composé article + date
// ─────────────────────────────────────────
print("\n── ÉTAPE 8 : APRÈS index — Requête composée (article + date) ──");

if (articleRef) {
  const explainApresCompose = db.mouvements.find(
    { article: articleRef, date: { $gte: new Date("2025-01-01") } }
  ).explain("executionStats");

  const statsApres3 = explainApresCompose.executionStats;
  const stageName3 = explainApresCompose.queryPlanner.winningPlan.inputStage
    ? explainApresCompose.queryPlanner.winningPlan.inputStage.stage
    : explainApresCompose.queryPlanner.winningPlan.stage;

  print("   Plan utilisé    : " + stageName3);
  print("   Docs examinés   : " + statsApres3.totalDocsExamined);
  print("   Docs retournés  : " + statsApres3.totalDocsReturned);
  print("   Temps exécution : " + statsApres3.executionTimeMillis + " ms");
}

// ─────────────────────────────────────────
// ÉTAPE 9 : COMPARAISON FINALE
// ─────────────────────────────────────────
print("\n── ÉTAPE 9 : COMPARAISON AVANT / APRÈS ──\n");

print("   Requête              | Scan AVANT | Scan APRÈS | Docs exam. avant | Docs exam. après");
print("   ---------------------|------------|------------|------------------|------------------");
print(
  "   articles.reference   | COLLSCAN   | IXSCAN     | " +
  String(statsAvant1.totalDocsExamined).padEnd(16) + " | " +
  statsApres1.totalDocsExamined
);
print(
  "   mouvements.type      | COLLSCAN   | IXSCAN     | " +
  String(statsAvant2.totalDocsExamined).padEnd(16) + " | " +
  statsApres2.totalDocsExamined
);

// ─────────────────────────────────────────
// ÉTAPE 10 : Liste de tous les index créés
// ─────────────────────────────────────────
print("\n── ÉTAPE 10 : Inventaire des index ──");

print("\n   Articles :");
db.articles.getIndexes().forEach(idx =>
  print("   • " + idx.name + " — clé : " + JSON.stringify(idx.key))
);

print("\n   Mouvements :");
db.mouvements.getIndexes().forEach(idx =>
  print("   • " + idx.name + " — clé : " + JSON.stringify(idx.key))
);

print("\n   Entrepôts :");
db.entrepots.getIndexes().forEach(idx =>
  print("   • " + idx.name + " — clé : " + JSON.stringify(idx.key))
);

print("\n✅ Script 04-index.js terminé.\n");
