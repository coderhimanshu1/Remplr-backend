"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Ingredient = require("../models/ingredient");
const { createToken } = require("../helpers/tokens");

const testIngredientIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM ingredients");

  testIngredientIds[0] = (
    await Ingredient.create({
      aisle: "Dairy",
      image: "http://milk.img",
      name: "Milk",
      amount: 1,
      unit: "L",
      original: "1L of milk",
    })
  ).id;
  testIngredientIds[1] = (
    await Ingredient.create({
      aisle: "Grains",
      image: "http://bread.img",
      name: "Bread",
      amount: 1,
      unit: "Loaf",
      original: "1 loaf of bread",
    })
  ).id;

  await User.register({
    username: "admin",
    firstName: "Admin",
    lastName: "Admin",
    email: "admin@ingredient.com",
    password: "adminpassword",
    isAdmin: true,
  });
  await User.register({
    username: "nutritionist1",
    firstName: "Nutri",
    lastName: "One",
    email: "nutritionist1@ingredient.com",
    password: "nutritionistpassword",
    isAdmin: false,
  });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const adminToken = createToken({ username: "admin", isAdmin: true });
const nutritionist1Token = createToken({
  username: "nutritionist1",
  isAdmin: false,
});

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testIngredientIds,
  adminToken,
  nutritionist1Token,
};
