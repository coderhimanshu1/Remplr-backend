const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", () => {
  test("works: 1 item", function () {
    const result = sqlForPartialUpdate(
      { firstName: "A" },
      { firstName: "first_name" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1',
      values: ["A"],
    });
  });

  test("works: 2 items", function () {
    const result = sqlForPartialUpdate(
      { firstName: "A", lastName: "B" },
      { firstName: "first_name", lastName: "last_name" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1, "last_name"=$2',
      values: ["A", "B"],
    });
  });

  test("works: 2 items, 1 missing from jsToSql", function () {
    const result = sqlForPartialUpdate(
      { firstName: "A", age: 30 },
      { firstName: "first_name" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["A", 30],
    });
  });

  test("throws BadRequestError with no data", function () {
    expect(() => sqlForPartialUpdate({}, {})).toThrow(BadRequestError);
  });
});
