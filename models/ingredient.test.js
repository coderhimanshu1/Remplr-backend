"use strict";

const db = require("../db");
const Ingredient = require("./ingredient");
const { NotFoundError, BadRequestError } = require("../expressError");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testIngredientIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function () {
  const newIngredient = {
    aisle: "TestAisle",
    image: "test.jpg",
    name: "TestIngredient",
    amount: 150,
    unit: "g",
    original: "150g TestIngredient",
  };

  test("works", async function () {
    let ingredient = await Ingredient.create(newIngredient);
    expect(ingredient).toEqual({
      id: expect.any(Number),
      aisle: "TestAisle",
      image: "test.jpg",
      name: "TestIngredient",
      amount: "150",
      unit: "g",
      details: "150g TestIngredient",
    });
    const result = await db.query(
      `SELECT * FROM ingredients WHERE name = 'TestIngredient'`
    );
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        aisle: "TestAisle",
        image: "test.jpg",
        name: "TestIngredient",
        amount: "150",
        unit: "g",
        original: "150g TestIngredient",
      },
    ]);
  });
});

describe("findAll", function () {
  test("works", async function () {
    const ingredients = await Ingredient.findAll();
    expect(ingredients).toEqual([
      {
        id: testIngredientIds[0],
        aisle: "Aisle1",
        image: "img1.jpg",
        name: "Ingredient1",
        amount: "100",
        unit: "g",
        details: "100g Ingredient1",
      },
      {
        id: testIngredientIds[1],
        aisle: "Aisle2",
        image: "img2.jpg",
        name: "Ingredient2",
        amount: "200",
        unit: "ml",
        details: "200ml Ingredient2",
      },
    ]);
  });
});

describe("get ingredient by id", function () {
  test("works", async function () {
    let ingredient = await Ingredient.get(testIngredientIds[0]);
    expect(ingredient).toEqual({
      id: testIngredientIds[0],
      aisle: "Aisle1",
      image: "img1.jpg",
      name: "Ingredient1",
      amount: "100",
      unit: "g",
      details: "100g Ingredient1",
      nutrients: [
        {
          amount: "5",
          name: "Nutrient1",
          percentofdailyneeds: "0.1",
          unit: "mg",
        },
        {
          amount: "10",
          name: "Nutrient2",
          percentofdailyneeds: "1.5",
          unit: "g",
        },
      ],
    });
  });

  test("not found if no such ingredient", async function () {
    try {
      await Ingredient.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("update", function () {
  const updateData = {
    aisle: "UpdatedAisle",
    image: "updated.jpg",
    name: "UpdatedIngredient",
    amount: "250",
    unit: "ml",
    original: "250ml UpdatedIngredient",
  };

  test("works", async function () {
    let ingredient = await Ingredient.update(testIngredientIds[0], updateData);
    expect(ingredient).toEqual({
      id: testIngredientIds[0],
      aisle: updateData.aisle,
      image: updateData.image,
      name: updateData.name,
      amount: updateData.amount.toString(),
      unit: updateData.unit,
      details: updateData.original, // This is how it is returned from the database
    });

    const result = await db.query(`SELECT * FROM ingredients WHERE id = $1`, [
      testIngredientIds[0],
    ]);
    expect(result.rows).toEqual([
      {
        id: testIngredientIds[0],
        ...updateData,
      },
    ]);
  });

  test("not found if no such ingredient", async function () {
    try {
      await Ingredient.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Ingredient.update(testIngredientIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("remove", function () {
  test("works", async function () {
    await Ingredient.remove(testIngredientIds[1]);
    const res = await db.query("SELECT id FROM ingredients WHERE id=$1", [
      testIngredientIds[1],
    ]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such ingredient", async function () {
    try {
      await Ingredient.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
