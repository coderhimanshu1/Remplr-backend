"use strict";

const jsonschema = require("jsonschema");
const MealPlan = require("../models/mealplan");
const express = require("express");
const { BadRequestError } = require("../expressError");

const router = express.Router({ mergeParams: true });

/** POST / { mealPlan } =>  { mealPlan }
 *
 * MealPlan should be { name, created_by, recipes : [{recipe_id, meal_type, meal_day},...] }
 *
 * Returns { id, name, created_by, recipes : [{recipe_id, meal_type, meal_day},...] }
 *
 * TODO: Authorization required
 */
router.post("/", async (req, res, next) => {
  try {
    // Create the meal plan
    const mealPlan = await MealPlan.create({
      name: req.body.name,
      created_by: req.body.created_by,
    });

    // Add each recipe to the meal plan
    for (let recipe of req.body.recipes) {
      await MealPlan.addRecipeToMealPlan({
        meal_plan_id: mealPlan.id,
        recipe_id: recipe.recipe_id,
        meal_type: recipe.meal_type,
        meal_day: recipe.meal_day,
      });
    }

    return res.status(201).json({ mealPlan });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { mealPlans: [ { id, name, created_by }, ...] }
 *
 * TODO: Authorization required
 */

router.get("/", async (req, res, next) => {
  try {
    const mealPlans = await MealPlan.findAll();
    return res.json({ mealPlans });
  } catch (err) {
    return next(err);
  }
});

/** GET /[mealPlanId]  =>
 *  { id, name, created_by, recipes: [{ { id, vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext,
 *  title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary } ,meal_type, meal_day}, ...] }
 *
 * TODO: Authorization required
 */
router.get("/:mealPlanId", async (req, res, next) => {
  try {
    const mealPlan = await MealPlan.get(req.params.mealPlanId);
    return res.json({ mealPlan });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[mealPlanId] { mealPlan } => { mealPlan }
 *
 * Data can include: { name, created_by }
 *
 * Returns { id, name, created_by }
 *
 * TODO: Authorization required
 */

router.patch("/:mealPlanId", async function (req, res, next) {
  try {
    const mealPlan = await MealPlan.update(req.params.mealPlanId, req.body);
    return res.json({ mealPlan });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /[mealPlanId]/recipes { recipe } => { recipe }
 *
 * Data can include: { recipe_id, meal_type, meal_day }
 *
 * Returns { id, meal_plan_id, recipe_id, meal_type, meal_day }
 *
 * This route is used to add a new recipe to the specified meal plan.
 *
 * TODO: Authorization required
 */

router.post("/:mealPlanId/recipes", async function (req, res, next) {
  try {
    const recipe = await MealPlan.addRecipeToMealPlan({
      meal_plan_id: req.params.mealPlanId,
      ...req.body,
    });
    return res.status(201).json({ recipe });
  } catch (err) {
    return next(err);
  }
});

/**
 * DELETE /[mealPlanId]/recipes/[recipeId] { recipe } => { deleted: recipeId }
 *
 * TODO: Authorization required
 */

router.delete(
  "/:mealPlanId/recipes/:recipeId",
  async function (req, res, next) {
    try {
      await MealPlan.removeRecipe(req.params.recipeId);
      return res.json({ deleted: req.params.recipeId });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
