const db = require("../db.js");

// Store any globally required IDs or data for tests
const testIngredientIds = [];

async function commonBeforeAll() {
  // Clean the database before tests
  await db.query("DELETE FROM ingredients CASCADE");
  await db.query("DELETE FROM ingredient_nutrients CASCADE");

  // Insert test ingredients into the database
  const resultsIngredients = await db.query(`
    INSERT INTO ingredients (aisle, image, name, amount, unit, original)
    VALUES ('Aisle1', 'img1.jpg', 'Ingredient1', 100, 'g', '100g Ingredient1'),
           ('Aisle2', 'img2.jpg', 'Ingredient2', 200, 'ml', '200ml Ingredient2')
    RETURNING id`);
  testIngredientIds.splice(0, 0, ...resultsIngredients.rows.map((r) => r.id));

  await db.query(
    `
    INSERT INTO ingredient_nutrients (ingredient_id, name, amount, unit, percentofdailyneeds)
    VALUES ($1, 'Nutrient1', 5, 'mg', 0.1),
           ($1, 'Nutrient2', 10, 'g', 1.5)`,
    [testIngredientIds[0]]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testIngredientIds,
};
