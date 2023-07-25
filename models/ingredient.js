"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Ingredient {
  /** Create a ingredient (from data), update db, return new ingredient data.
   *
   * data should be { aisle, image, name, amount, unit, original }
   *
   * Returns { id, aisle, image, name, amount, unit, details }
   **/

  static async create(data) {
    const result = await db.query(
      `INSERT INTO ingredients (aisle,
        image,
        name,
        amount,
        unit,
        original)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, aisle, image, name, amount, unit, original as details"`,
      [data.aisle, data.image, data.name, data.amount, data.unit, data.original]
    );
    let ingredient = result.rows[0];

    return ingredient;
  }

  /** Find all ingredients
   *
   * Returns [{ id, aisle, image, name, amount, unit, details }, ...]
   * */

  static async findAll() {
    let query = `SELECT i.id,
                        i.aisle,
                        i.image,
                        i.name,
                        i.amount,
                        i.unit,
                        i.original as "details"
                 FROM ingredients i`;
    let whereExpressions = [];
    let queryValues = [];

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY title";
    const ingredientsRes = await db.query(query, queryValues);
    return ingredientsRes.rows;
  }

  /** Given a ingredient id, return data about ingredient.
   *
   * Returns { id, aisle, image, name, amount, unit, details }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const ingredientRes = await db.query(
      `SELECT id,
            aisle, 
            image, 
            name, 
            amount, 
            unit, 
            original as "details"
           FROM ingredients
           WHERE id = $1`,
      [id]
    );

    const ingredient = ingredientRes.rows[0];

    if (!ingredient) throw new NotFoundError(`No ingredient: ${id}`);

    return ingredient;
  }

  /** Update ingredient data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { aisle, image, name, amount, unit, original }
   *
   * Returns { id, aisle, image, name, amount, unit, details }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE ingredients 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING { id, 
                                aisle, 
                                image, 
                                name, 
                                amount, 
                                unit, 
                                original as "details" }`;
    const result = await db.query(querySql, [...values, id]);
    const ingredient = result.rows[0];

    if (!ingredient) throw new NotFoundError(`No ingredient: ${id}`);

    return ingredient;
  }

  /** Delete given ingredient from database; returns undefined.
   *
   * Throws NotFoundError if ingredient not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM ingredients
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const ingredient = result.rows[0];

    if (!ingredient) throw new NotFoundError(`No ingredient: ${id}`);
  }
}

module.exports = Ingredient;
