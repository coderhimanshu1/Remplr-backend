"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class MealPlan {
  /** Create a meal plan (from data), update db, return new meal plan data.
   *
   * data should be { name, created_by }
   *
   * Returns { id, name, created_by }
   **/

  static async create(data) {
    const result = await db.query(
      `INSERT INTO meal_plans (name, created_by)
           VALUES ($1, $2)
           RETURNING id, name, created_by`,
      [data.name, data.created_by]
    );
    let mealPlan = result.rows[0];

    return mealPlan;
  }

  /** Add a recipe to a meal plan.
   *
   * data should be { meal_plan_id, recipe_id, meal_type, meal_day }
   *
   * Returns { id, meal_plan_id, recipe_id, meal_type, meal_day }
   **/

  static async addRecipe(data) {
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
           WHERE id = $1
           RETURNING id, meal_plan_id, recipe_id, meal_type, meal_day`,
      [id]
    );

    const mealPlanRecipe = result.rows[0];

    if (!mealPlanRecipe)
      throw new NotFoundError(`No recipe in meal plan: ${id}`);

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
   * Returns { id, name, created_by }
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
    const result = await db.query(
      `DELETE
           FROM meal_plans
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const mealPlan = result.rows[0];

    if (!mealPlan) throw new NotFoundError(`No meal plan: ${id}`);
  }
}

module.exports = MealPlan;
