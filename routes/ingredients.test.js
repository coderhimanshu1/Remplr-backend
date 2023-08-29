const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  testIngredientIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /ingredients", function () {
  test("works for admins", async function () {
    const response = await request(app)
      .post("/ingredients")
      .send({
        aisle: "Veggies",
        image: "http://broccoli.img",
        name: "Broccoli",
        amount: 1,
        unit: "Bunch",
        original: "1 bunch of broccoli",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      ingredient: expect.objectContaining({ id: expect.any(Number) }),
    });
  });

  // TODO:
  //   test("works for nutritionists", async function () {

  //   });

  //   test("unauth for regular users", async function () {

  //   });

  //   test("bad request if missing data", async function () {

  //   });
});

describe("GET /ingredients", function () {
  test("works", async function () {
    const response = await request(app)
      .get("/ingredients")
      .set("authorization", `Bearer ${adminToken}`);
    expect(response.body).toEqual({
      ingredients: expect.any(Array),
    });
  });
});

describe("GET /ingredients/:id", function () {
  test("works", async function () {
    const response = await request(app)
      .get(`/ingredients/${testIngredientIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(Number(response.body.ingredient.id)).toEqual(testIngredientIds[0]);
  });

  test("not found for invalid id", async function () {
    const response = await request(app)
      .get("/ingredients/0")
      .set("authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("PATCH /ingredients/:id", function () {
  test("works for admins", async function () {
    const response = await request(app)
      .patch(`/ingredients/${testIngredientIds[0]}`)
      .send({
        name: "Updated Milk",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(response.body).toEqual({
      ingredient: expect.objectContaining({ name: "Updated Milk" }),
    });
  });

  //TODO: Additional tests: unauth users, not found for invalid ID, bad request if invalid data, etc.
});

describe("DELETE /ingredients/:id", function () {
  test("works for admins", async function () {
    const response = await request(app)
      .delete(`/ingredients/${testIngredientIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(response.body).toEqual({ deleted: `${testIngredientIds[0]}` });
  });

  //TODO: Additional tests: unauth users, not found for invalid ID, etc.
});
