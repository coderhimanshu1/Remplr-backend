const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const { SECRET_KEY } = require("../config");
const { createToken } = require("../helpers/tokens");
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
        isClient: false,
        isNutritionist: false,
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

  describe("ensureAdmin", () => {
    it("allows an admin through", () => {
      mockResponse.locals.user = { username: "admin", isAdmin: true };
      ensureAdmin(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("throws an error if user is not an admin", () => {
      mockResponse.locals.user = { username: "user1", isAdmin: false };
      ensureAdmin(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe("ensureCorrectUserOrAdmin", () => {
    it("allows an admin through", () => {
      mockResponse.locals.user = { username: "admin", isAdmin: true };
      ensureCorrectUserOrAdmin(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("allows correct user through", () => {
      mockRequest.params.username = "user1";
      mockResponse.locals.user = { username: "user1", isAdmin: false };
      ensureCorrectUserOrAdmin(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("blocks an incorrect user", () => {
      mockRequest.params.username = "user2";
      mockResponse.locals.user = { username: "user1", isAdmin: false };
      ensureCorrectUserOrAdmin(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe("ensureAdminOrNutritionist", () => {
    it("allows an admin through", () => {
      mockResponse.locals.user = {
        username: "admin",
        isAdmin: true,
        isNutritionist: false,
      };
      ensureAdminOrNutritionist(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("allows a nutritionist through", () => {
      mockResponse.locals.user = {
        username: "user1",
        isAdmin: false,
        isNutritionist: true,
      };
      ensureAdminOrNutritionist(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("blocks a non-nutritionist, non-admin user", () => {
      mockResponse.locals.user = {
        username: "user1",
        isAdmin: false,
        isNutritionist: false,
      };
      ensureAdminOrNutritionist(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe("ensureAdminOrClient", () => {
    it("allows an admin through", () => {
      mockResponse.locals.user = {
        username: "admin",
        isAdmin: true,
        isclient: false,
        isClient: true,
      };
      ensureAdminOrClient(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("allows a client through", () => {
      mockResponse.locals.user = {
        username: "user1",
        isAdmin: false,
        isClient: true,
      };
      ensureAdminOrClient(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("blocks a non-client, non-admin user", () => {
      mockResponse.locals.user = {
        username: "user1",
        isAdmin: false,
        isClient: false,
      };
      ensureAdminOrClient(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe("ensureNutritionist", () => {
    it("allows a nutritionist through", () => {
      mockResponse.locals.user = {
        username: "user1",
        isNutritionist: true,
      };
      ensureNutritionist(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("blocks a non-nutritionist", () => {
      mockResponse.locals.user = {
        username: "user1",
        isNutritionist: false,
      };
      ensureNutritionist(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  describe("ensureClient", () => {
    it("allows a client through", () => {
      mockResponse.locals.user = {
        username: "user1",
        isClient: true,
      };
      ensureClient(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("blocks a non-client", () => {
      mockResponse.locals.user = {
        username: "user1",
        isClient: false,
      };
      ensureClient(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
