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
