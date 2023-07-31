const express = require("express");
const Recipe = require("../models/recipe");
const router = new express.Router();
const { BadRequestError } = require("../expressError");
const jsonschema = require("jsonschema");
const recipeNewSchema = require("../schemas/recipeNew.json");
const recipeUpdateSchema = require("../schemas/recipeUpdate.json");

/** POST / { recipe } =>  { recipe }
 *
 * Recipe should be { id, vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext,
 * title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary }
 *
 * Returns { id, vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext,
 * title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary }
 *
 * TODO: Authorization required
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, recipeNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const recipe = await Recipe.create(req.body);
    return res.status(201).json({ recipe });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { recipes: [ { id, vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext,
 * title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary }, ...] }
 *
 * Can filter on provided search filters:
 * - TODO: add filter parameters
 *
 * TODO: Authorization required
 */

router.get("/", async function (req, res, next) {
  try {
    const recipes = await Recipe.findAll(req.query);
    return res.json({ recipes });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => { recipe }
 *
 *  Recipe is { id, vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext,
 * title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary, ingredients, nutrients }
 *
 * TODO: Authorization required
 */

router.get("/:id", async function (req, res, next) {
  try {
    const recipe = await Recipe.get(req.params.id);
    const ingredients = await Recipe.getIngredients(req.params.id);
    const nutrients = await Recipe.getRecipeNutrients(req.params.id);
    recipe.ingredients = ingredients;
    recipe.nutrients = nutrients;
    return res.json({ recipe });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { recipe } => { recipe }
 *
 * Data can include: { id, vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext,
 * title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary }
 *
 * Returns { id, vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext,
 * title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary }
 *
 * TODO: Authorization required
 */

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, recipeUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const recipe = await Recipe.update(req.params.id, req.body);
    return res.json({ recipe });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * TODO: Authorization
 */

router.delete("/:id", async function (req, res, next) {
  try {
    await Recipe.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
