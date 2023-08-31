const { BadRequestError, NotFoundError } = require("../expressError");
const db = require("../db.js");
const MealPlan = require("./mealplan.js");
const User = require("./user.js");
const Recipe = require("./recipe.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testMealPlanIds,
} = require("./_testCommon");

describe("MealPlan", function () {
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);

  describe("create", function () {
    const newMealPlanData = {
      name: "TestMealPlan",
      created_by: "testuser",
      user_id: null,
    };

    it("works", async function () {
      let newMealPlan = await MealPlan.create(newMealPlanData);
      expect(newMealPlan).toEqual({
        id: expect.any(Number),
        ...newMealPlanData,
      });

      const result = await db.query(
        `SELECT * FROM meal_plans WHERE id = ${newMealPlan.id}`
      );
      expect(result.rows).toEqual([
        {
          id: newMealPlan.id,
          ...newMealPlanData,
        },
      ]);
    });
  });
});

afterAll(commonAfterAll);
