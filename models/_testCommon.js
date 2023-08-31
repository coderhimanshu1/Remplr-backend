const db = require("../db.js");

// Store any globally required IDs or data for tests
const testIngredientIds = [];
const testRecipeIds = [];
const testUserIds = [];
const testMealPlanIds = [];

async function commonBeforeAll() {
  // Clean the database before tests
  await db.query("DELETE FROM ingredients CASCADE");
  await db.query("DELETE FROM ingredient_nutrients CASCADE");
  await db.query("DELETE FROM meal_plan_recipes");
  await db.query("DELETE FROM meal_plans");

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

  // Insert test users into the database
  const resultsUsers = await db.query(`
    INSERT INTO users (username, first_name, last_name, password, email, is_admin, is_client, is_nutritionist)
    VALUES ('user1', 'First1', 'Last1', 'password1', 'user1@example.com', false, true, false),
           ('nutri1', 'Nutri', 'One', 'password2', 'nutri1@example.com', false, false, true)
    RETURNING id`);
  testUserIds.splice(0, 0, ...resultsUsers.rows.map((r) => r.id));

  // Insert test recipes into the database
  const resultsRecipes = await db.query(`
    INSERT INTO recipes (vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext, title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary)
    VALUES (true, false, false, 5, 'Credit1', 'Recipe1', 30, 4, 'source1.com', 'image1.jpg', 'jpg', 'main course', 'vegetarian', 'This is a delicious vegetarian recipe.')
    RETURNING id`);
  testRecipeIds.splice(0, 0, ...resultsRecipes.rows.map((r) => r.id));

  // Insert test meal plans into the database
  const resultsMealPlans = await db.query(
    `
    INSERT INTO meal_plans (name, created_by, user_id)
    VALUES ('MealPlan1', 'user1', $1)
    RETURNING id`,
    [testUserIds[0]]
  );
  testMealPlanIds.splice(0, 0, ...resultsMealPlans.rows.map((r) => r.id));

  // Insert meal plan recipes
  await db.query(
    `
    INSERT INTO meal_plan_recipes (meal_plan_id, recipe_id, meal_type, meal_day)
    VALUES ($1, $2, 'Dinner', 'Monday')`,
    [testMealPlanIds[0], testRecipeIds[0]]
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
  testRecipeIds,
  testUserIds,
  testMealPlanIds,
};
