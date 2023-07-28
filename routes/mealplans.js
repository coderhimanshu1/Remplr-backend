"use strict";

const jsonschema = require("jsonschema");
const MealPlan = require("../models/mealplan");
const express = require("express");
const { BadRequestError } = require("../expressError");

const router = express.Router({ mergeParams: true });

/** POST / { mealPlan } =>  { mealPlan }
 *
 * MealPlan should be { id, name, created_by }
 *
 * Returns { id, name, created_by }
 *
 * TODO: Authorization required
 */
app.post("/", async function (req, res, next) {
  try {
    // Create the meal plan
    const mealPlan = await MealPlan.create({
      name: req.body.name,
      created_by: req.body.created_by,
    });

    // Add each recipe to the meal plan
    for (let recipe of req.body.recipes) {
      await MealPlan.addRecipeToMealPlan(
        mealPlan.id,
        recipe.recipe_id,
        recipe.meal_type,
        recipe.meal_day
      );
    }

    return res.status(201).json({ mealPlan });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { mealPlans: [ { id, name, created_by }, ...] }
 *
 * TODO: Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const mealPlans = await MealPlan.findAll();
    return res.json({ mealPlans });
  } catch (err) {
    return next(err);
  }
});
