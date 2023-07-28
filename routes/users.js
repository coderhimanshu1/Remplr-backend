"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * TODO:Authorization required: admin
 **/

router.post("/", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * TODO:Authorization required: admin
 **/

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, isNutritionist, isClient, recipes, ingredients, mealplans }
 *   where recipes is [id(s)]
 *   where ingredients is [id(s)]
 *   where mealplans is [id(s)]
 *
 * TODO:Authorization required: admin or same user-as-:username
 **/

router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin, isNutritionist, isClient }
 *
 * TODO:Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * TODO:Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", async (req, res, next) => {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/ingredients/{ingredientId} => { ingredient }
 *
 * Associates an ingredient with a user.
 *
 * Returns { ingredient: { id, aisle, image, name, original, amount, unit } }
 *
 * TODO: Authorization required: admin or same-user-as-:username
 **/
router.post("/:username/ingredients/:ingredientId", async (req, res, next) => {
  try {
    const { username, ingredientId } = req.params;
    const ingredient = await User.saveIngredient(username, ingredientId);
    return res.status(201).json({ ingredient });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/recipes/{recipeId} => { recipe }
 *
 * Associates a recipe with a user.
 *
 * Returns { recipe: { id, title, vegetarian, ...etc } }
 *
 * TODO: Authorization required: admin or same-user-as-:username
 **/
router.post("/:username/recipes/:recipeId", async (req, res, next) => {
  try {
    const { username, recipeId } = req.params;
    const recipe = await User.saveRecipe(username, recipeId);
    return res.status(201).json({ recipe });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/mealplans/{mealPlanId} => { mealPlan }
 *
 * Associates a meal plan with a user.
 *
 * Returns { mealPlan: { id, name, created_by } }
 *
 * TODO: Authorization required: admin or same-user-as-:username
 **/
router.post("/:username/mealplans/:mealPlanId", async (req, res, next) => {
  try {
    const { username, mealPlanId } = req.params;
    const mealPlan = await User.saveMealPlan(username, mealPlanId);
    return res.status(201).json({ mealPlan });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/ingredients => { ingredients }
 *
 * Returns { ingredients: [{id, aisle, image, name, original, amount, unit}, ...] }
 *
 * TODO:Authorization required: admin or same-user-as-:username
 **/

router.get("/:username/ingredients", async (req, res, next) => {
  try {
    const ingredients = await User.getSavedIngredients(req.params.username);
    return res.json({ ingredients });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/recipes => { recipes }
 *
 * Returns { recipes: [{id, vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext, title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary}, ...] }
 *
 * TODO:Authorization required: admin or same-user-as-:username
 **/

router.get("/:username/recipes", async (req, res, next) => {
  try {
    const recipes = await User.getSavedRecipes(req.params.username);
    return res.json({ recipes });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/mealplans => { mealplans }
 *
 * Returns { mealplans: [{id, name, created_by}, ...] }
 *
 * TODO:Authorization required: admin or same-user-as-:username
 **/

router.get("/:username/mealplans", async (req, res, next) => {
  try {
    const mealplans = await User.getSavedMealPlans(req.params.username);
    return res.json({ mealplans });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
