-- users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    is_admin BOOLEAN,
    is_client BOOLEAN,
    is_nutritionist BOOLEAN
);

-- ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id INT PRIMARY KEY,
    aisle VARCHAR(255),
    image VARCHAR(255),
    name VARCHAR(255),
    original TEXT,
    amount DECIMAL,
    unit VARCHAR(50)
);

-- recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id INT PRIMARY KEY,
    vegetarian BOOLEAN,
    vegan BOOLEAN,
    dairyfree BOOLEAN,
    weightwatchersmartpoints INT,
    creditstext VARCHAR(255),
    title VARCHAR(255),
    readyinminutes INT,
    servings INT,
    sourceurl VARCHAR(255),
    image VARCHAR(255),
    imagetype VARCHAR(255),
    dishtype VARCHAR(255),
    diets VARCHAR(255),
    summary TEXT
);

--instructions table
CREATE TABLE IF NOT EXISTS instructions (
    id INT PRIMARY KEY,
    recipe_id INT,
    number INT,
    step TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- nutrients table
CREATE TABLE IF NOT EXISTS nutrients (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    amount DECIMAL,
    unit VARCHAR(50),
    percentofdailyneeds DECIMAL,
    recipe_id INT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- recipetoingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INT PRIMARY KEY,
    recipe_id INT,
    ingredient_id INT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);


-- meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- meal_plan_recipes table
CREATE TABLE IF NOT EXISTS meal_plan_recipes (
    id INT PRIMARY KEY,
    meal_plan_id INT,
    recipe_id INT,
    meal_type VARCHAR(255),
    meal_day INT,
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- meal_plan_users table
CREATE TABLE IF NOT EXISTS meal_plan_users (
    id INT PRIMARY KEY,
    user_id INT,
    meal_plan_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id)
);
