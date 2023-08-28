[![Github](github.png)](https://github.com/coderhimanshu1/Remplr-backend)

# Remplr-backend
Node.js-based backend API for REMPLR 2.0


## Overview
### Introduction
  The Recipe and Meal Plan API provides a comprehensive interface for managing recipes and meal plans within a nutrition and dietary application. The API is designed for use by administrators, nutritionists, and clients, and offers a range of features for creating, updating, deleting, and sharing recipes and meal plans.

### Features

#### Ingredients Management
* Create Ingredients: Authorized users can create new ingredients with all related details.
* Retrieve Ingredients: Retrieve all or a specific ingredient's details, including ingredients and nutritional information.
* Update Ingredients: Modify existing ingredients.
* Delete Ingredients: Remove specific ingredients.

#### Recipes Management
* Create Recipes: Authorized users can create new recipes with all related details.
* Retrieve Recipes: Retrieve all or a specific recipe's details, including ingredients and nutritional information.
* Update Recipes: Modify existing recipes.
* Delete Recipes: Remove specific recipes.

#### Meal Plans Management
* Create Meal Plans: Create meal plans that contain multiple recipes for different days and meal types.
* Retrieve Meal Plans: View all meal plans or detailed information on a specific meal plan.
* Update Meal Plans: Modify meal plans including adding or removing recipes.
* Share Meal Plans: Nutritionists can share specific meal plans with clients.
* Retrieve Shared Meal Plans: Clients can view meal plans shared with them.

### Authorization
The API provides varying levels of access based on user roles. Specific endpoints require administrator or nutritionist authorization, while others may be accessed by logged-in users, including clients.

## Base URL

If you want to run this project locally, the base URL is:<br />

```
http://localhost:3001/
```
I’ll suggest using the following base URL which is already deployed:

[https://jobly-backend.onrender.com/](https://remplr-backend.onrender.com)

## REMPLR Design Architecture

<img width="2762" alt="REMPLR Design Architecture (4)" src="https://github.com/coderhimanshu1/Remplr-backend/assets/87880250/8b6d208f-dfce-4f7f-9971-1e0c6f22b7aa">


## REMPLR Database Schema


![REMPLR](https://github.com/coderhimanshu1/Remplr-backend/assets/87880250/0f2b6f9e-41a9-41dd-ada2-465068d3ced0)


# Endpoints

## Recipes

### Create a new recipe

**POST** `/`

- **Description**: Create a new recipe.
- **Body**: JSON object containing recipe details.
- **Authorization**: Admin or Nutritionist.
- **Response**: JSON object containing the created recipe.
- **Status Code**: `201` Created.

### Retrieve all recipes

**GET** `/`

- **Description**: Retrieve all recipes.
- **Authorization**: Admin or logged-in user.
- **Response**: JSON object containing an array of recipes.
- **Status Code**: `200` OK.

### Retrieve a specific recipe

**GET** `/:id`

- **Description**: Retrieve a specific recipe by ID.
- **Authorization**: Admin or logged-in user.
- **Response**: JSON object containing recipe details, including ingredients and nutrients.
- **Status Code**: `200` OK.

### Update a recipe

**PATCH** `/:id`

- **Description**: Update a specific recipe by ID.
- **Body**: JSON object containing update details.
- **Authorization**: Admin.
- **Response**: JSON object containing updated recipe.
- **Status Code**: `200` OK.

### Delete a recipe

**DELETE** `/:id`

- **Description**: Delete a specific recipe by ID.
- **Authorization**: Admin.
- **Response**: JSON object containing deleted recipe ID.
- **Status Code**: `200` OK.

## Meal Plans

### Create a new meal plan

**POST** `/`

- **Description**: Create a new meal plan.
- **Body**: JSON object containing meal plan details and associated recipes.
- **Authorization**: Admin or Nutritionist.
- **Response**: JSON object containing created meal plan.
- **Status Code**: `201` Created.

### Retrieve all meal plans

**GET** `/`

- **Description**: Retrieve all meal plans.
- **Authorization**: Admin or Nutritionist.
- **Response**: JSON object containing an array of meal plans.
- **Status Code**: `200` OK.

### Retrieve a specific meal plan

**GET** `/:mealPlanId`

- **Description**: Retrieve a specific meal plan by ID.
- **Authorization**: Admin or Nutritionist.
- **Response**: JSON object containing meal plan details.
- **Status Code**: `200` OK.

### Update a meal plan

**PATCH** `/:mealPlanId`

- **Description**: Update a specific meal plan by ID.
- **Body**: JSON object containing update details.
- **Authorization**: Admin or Nutritionist.
- **Response**: JSON object containing updated meal plan.
- **Status Code**: `200` OK.

### Add a recipe to a meal plan

**POST** `/:mealPlanId/recipes/:recipeId`

- **Description**: Add a recipe to a meal plan.
- **Body**: JSON object containing recipe details.
- **Authorization**: Admin or Nutritionist.
- **Response**: JSON object containing added recipe.
- **Status Code**: `201` Created.

### Remove a recipe from a meal plan

**DELETE** `/:mealPlanId/recipes/:recipeId`

- **Description**: Remove a recipe from a meal plan.
- **Authorization**: Admin or Nutritionist.
- **Response**: JSON object containing deleted recipe ID.
- **Status Code**: `200` OK.

### Delete a meal plan

**DELETE** `/:mealPlanId`

- **Description**: Delete a specific meal plan by ID.
- **Authorization**: Admin.
- **Response**: JSON object containing deleted meal plan ID.
- **Status Code**: `200` OK.

### Share a meal plan with a client

**POST** `/:mealPlanId/share`

- **Description**: Share a meal plan with a client.
- **Body**: JSON object containing nutritionist and client usernames.
- **Authorization**: Admin or Nutritionist.
- **Response**: Message confirming sharing.
- **Status Code**: `200` OK.

### Retrieve shared meal plans for a client

**GET** `/shared/:clientUsername`

- **Description**: Retrieve shared meal plans for a client.
- **Authorization**: Admin or Client.
- **Response**: JSON object containing shared meal plans.
- **Status Code**: `200` OK.

