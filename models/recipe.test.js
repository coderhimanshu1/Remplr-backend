"use strict";

const { NotFoundError } = require("../expressError");
const Recipe = require("../models/recipe");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testRecipeIds,
  testIngredientIds,
} = require("./_testCommon");

describe("Recipe", function () {
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);

  describe("create", function () {
    it("should create a new recipe", async function () {
      const data = {
        vegetarian: true,
        vegan: false,
        dairyfree: false,
        weightwatchersmartpoints: 5,
        creditstext: "Credit1",
        title: "Test Recipe",
        readyinminutes: 30,
        servings: 4,
        sourceurl: "test.com",
        image: "test.jpg",
        imagetype: "jpg",
        dishtype: "main course",
        diets: "vegetarian",
        summary: "This is a test recipe.",
      };
      const recipe = await Recipe.create(data);

      expect(recipe).toHaveProperty("id");
      expect(recipe.title).toEqual(data.title);
    });
  });

  describe("findAll", function () {
    it("should find all recipes", async function () {
      const recipes = await Recipe.findAll();
      expect(recipes[0].title).toContain("Recipe1");
    });
  });

  describe("get", function () {
    it("should retrieve a recipe by id", async function () {
      const recipe = await Recipe.get(testRecipeIds[0]);
      expect(recipe).toHaveProperty("id");
      expect(recipe.title).toEqual("Recipe1");
    });

    it("should throw NotFoundError if recipe doesn't exist", async function () {
      try {
        await Recipe.get(0);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  // TODO:tests for getIngredients, getRecipeNutrients, update, and remove
});
