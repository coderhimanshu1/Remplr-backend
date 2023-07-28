"use strict";

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");

const router = express.Router({ mergeParams: true });

/**POST / { mealPlan } => {mealPlan}
 *
 *
 **/
