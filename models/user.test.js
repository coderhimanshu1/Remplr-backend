const db = require("../db");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} = require("../expressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// Begin the tests
describe("User.authenticate", function () {
  test("unauth with non-existent user", async function () {
    try {
      await User.authenticate("no-user", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth with wrong password", async function () {
    try {
      await User.authenticate("testuser", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

describe("User.register", function () {
  test("works with valid data", async function () {
    const user = await User.register({
      username: "newuser",
      password: "password",
      firstName: "First",
      lastName: "Last",
      email: "new@user.com",
      isAdmin: false,
      isClient: true,
      isNutritionist: false,
    });
    expect(user).toEqual({
      id: expect.any(Number),
      username: "newuser",
      firstName: "First",
      lastName: "Last",
      email: "new@user.com",
      isAdmin: false,
      isClient: true,
      isNutritionist: false,
    });

    const found = await db.query(
      "SELECT * FROM users WHERE username = 'newuser'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].is_client).toEqual(true);
    expect(found.rows[0].is_nutritionist).toEqual(false);
    expect(bcrypt.compareSync("password", found.rows[0].password)).toBe(true);
  });
});
