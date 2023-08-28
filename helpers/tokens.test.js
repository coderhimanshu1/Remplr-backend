const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createToken", () => {
  test("creates a valid token with expected payload", () => {
    const user = {
      username: "testuser",
      isAdmin: true,
      isNutritionist: false,
      isClient: true,
    };

    const token = createToken(user);
    const payload = jwt.verify(token, SECRET_KEY);

    expect(payload).toEqual({
      username: "testuser",
      isAdmin: true,
      isNutritionist: false,
      isClient: true,
      iat: expect.any(Number),
    });
  });

  test("creates a valid token with defaults for missing properties", () => {
    const user = { username: "testuser" };

    const token = createToken(user);
    const payload = jwt.verify(token, SECRET_KEY);

    expect(payload).toEqual({
      username: "testuser",
      isAdmin: false,
      isNutritionist: false,
      isClient: false,
      iat: expect.any(Number),
    });
  });

  test("throws an error if required properties are missing", () => {
    const user = { username: "testuser" };

    // Override console.assert for testing purposes
    console.assert = (condition, ...args) => {
      if (!condition) throw new Error(args.join(", "));
    };

    expect(() => createToken(user)).toThrowError(
      "createToken passed user without isAdmin, isNutritionist and isClient property"
    );
  });
});
