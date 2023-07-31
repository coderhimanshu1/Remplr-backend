"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const Recipe = require("./recipe");
const { sqlForPartialUpdate } = require("../helpers/sql");

class MealPlan {
  /** Create a meal plan (from data), update db, return new meal plan data.
   *
   * data should be { name, created_by }
   *
   * Returns { id, name, created_by }
   **/

  static async create(data) {
    // Check if a meal plan with the same name already exists
    const duplicateCheck = await db.query(
      `SELECT * FROM meal_plans WHERE name = $1`,
      [data.name]
    );

    if (duplicateCheck.rows.length > 0)
      throw new BadRequestError(`Duplicate mealPlan: ${data.name}`);

    // Create the meal plan
    const result = await db.query(
      `INSERT INTO meal_plans (name, created_by)
           VALUES ($1, $2)
           RETURNING id, name, created_by`,
      [data.name, data.created_by]
    );

    let mealPlan = result.rows[0];
    return mealPlan;
  }

  /** Add/link a recipe to a meal plan.
   *
   * data should be { meal_plan_id, recipe_id, meal_type, meal_day }
   *
   * Returns { id, meal_plan_id, recipe_id, meal_type, meal_day }
   **/

  static async addRecipeToMealPlan(data) {
    const result = await db.query(
      `INSERT INTO meal_plan_recipes (meal_plan_id, recipe_id, meal_type, meal_day)
           VALUES ($1, $2, $3, $4)
           RETURNING id, meal_plan_id, recipe_id, meal_type, meal_day`,
      [data.meal_plan_id, data.recipe_id, data.meal_type, data.meal_day]
    );

    return result.rows[0];
  }

  /** Remove a recipe from a meal plan.
   *
   * Returns { id, meal_plan_id, recipe_id, meal_type, meal_day }
   *
   * Throws NotFoundError if not found.
   **/
  static async removeRecipe(id) {
    const result = await db.query(
      `DELETE
           FROM meal_plan_recipes
           WHERE recipe_id = $1
           RETURNING id, meal_plan_id, recipe_id, meal_type, meal_day`,
      [id]
    );

    const mealPlanRecipe = result.rows[0];

    if (!mealPlanRecipe)
      throw new NotFoundError(`No recipe in meal plan with id: ${id}`);

    return mealPlanRecipe;
  }

  /** Find all meal plans
   *
   * Returns [{ id, name, created_by }, ...]
   * */

  static async findAll() {
    const mealPlansRes = await db.query(
      `SELECT id,
              name,
              created_by
           FROM meal_plans
           ORDER BY name`
    );
    return mealPlansRes.rows;
  }

  /** Given a meal plan id, return data about meal plan.
   *
   * Returns { id, name, created_by, recipes: [{ { id, vegetarian, vegan, dairyfree, weightwatchersmartpoints, creditstext,
   * title, readyinminutes, servings, sourceurl, image, imagetype, dishtype, diets, summary } ,meal_type, meal_day}, ...] }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const mealPlanRes = await db.query(
      `SELECT id,
            name,
            created_by
         FROM meal_plans
         WHERE id = $1`,
      [id]
    );

    const mealPlan = mealPlanRes.rows[0];

    if (!mealPlan) throw new NotFoundError(`No meal plan: ${id}`);

    const mealPlanRecipesRes = await db.query(
      `SELECT mpr.recipe_id,
            mpr.meal_type,
            mpr.meal_day,
            r.id AS recipe_id,
            r.vegetarian,
            r.vegan,
            r.dairyfree,
            r.weightwatchersmartpoints,
            r.creditstext,
            r.title,
            r.readyinminutes,
            r.servings,
            r.sourceurl,
            r.image,
            r.imagetype,
            r.dishtype,
            r.diets,
            r.summary
     FROM meal_plan_recipes AS mpr
     JOIN recipes AS r ON mpr.recipe_id = r.id
     WHERE mpr.meal_plan_id = $1`,
      [id]
    );

    mealPlan.recipes = mealPlanRecipesRes.rows;

    return mealPlan;
  }

  /** Update meal plan data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { name, created_by }
   *
   * Returns { id, name, created_by }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE meal_plans 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, name, created_by`;
    const result = await db.query(querySql, [...values, id]);
    const mealPlan = result.rows[0];

    if (!mealPlan) throw new NotFoundError(`No meal plan: ${id}`);

    return mealPlan;
  }

  /** Delete given meal plan from database; returns undefined.
   *
   * Throws NotFoundError if meal plan not found.
   **/

  static async remove(id) {
    try {
      // First, delete associated data from meal_plan_recipes table
      await db.query(`DELETE FROM meal_plan_recipes WHERE meal_plan_id = $1`, [
        id,
      ]);

      // Then, delete the meal plan from meal_plans table
      const result = await db.query(
        `DELETE FROM meal_plans WHERE id = $1 RETURNING id`,
        [id]
      );

      const mealPlan = result.rows[0];

      if (!mealPlan) throw new NotFoundError(`No meal plan: ${id}`);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = MealPlan;
