const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const { SECRET_KEY } = require("../config");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  ensureAdminOrNutritionist,
  ensureAdminOrClient,
  ensureNutritionist,
  ensureClient,
} = require("./auth");

describe("Authentication and Authorization Middlewares", () => {
  let mockRequest;
  let mockResponse;
  const nextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {},
      params: {},
    };
    mockResponse = {
      locals: {},
    };
  });

  // Helper function to create tokens
  function createToken(data) {
    return jwt.sign(data, SECRET_KEY);
  }

  describe("authenticateJWT", () => {
    it("works with valid token", () => {
      mockRequest.headers.authorization = `Bearer ${createToken({
        username: "user1",
        isAdmin: false,
      })}`;
      authenticateJWT(mockRequest, mockResponse, nextFunction);
      expect(mockResponse.locals.user).toEqual({
        username: "user1",
        isAdmin: false,
        iat: expect.any(Number),
      });
    });

    it("works with no header", () => {
      authenticateJWT(mockRequest, mockResponse, nextFunction);
      expect(mockResponse.locals.user).toBeUndefined();
    });
  });

  describe("ensureLoggedIn", () => {
    it("works with logged-in user", () => {
      mockResponse.locals.user = { username: "user1", isAdmin: false };
      ensureLoggedIn(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("throws error if user not logged in", () => {
      ensureLoggedIn(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  //TODO: Write tests for other middlewares
});
