const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');

const {cropImage, upload} = require('../helpers/image.helper');

/**
 * @description Root route with all recipes
 * @method GET /
 */
route.get('/', services.home);

/**
 * @description See the form for create the recipe
 * @method GET /add-recipe
 */
route.get('/add-recipe', services.add_recipe)

/**
 * @description See the form for update the recipe
 * @method GET /update-recipe
 */
route.get('/update-recipe', services.update_recipe)


//----------------------------------------
// API routes
//----------------------------------------

/**
 * @description Create the recipe
 * @method POST /api/recipes
 */
route.post('/api/recipes', upload.single('image'), controller.create);

/**
 * @description Find one or more recipes
 * @method GET /api/recipes
 * @queryParam id optional
 */
route.get('/api/recipes', controller.find);

/**
 * @description Update the recipe
 * @method PUT /api/recipes/:id
 */
route.put('/api/recipes/:id', upload.single('image'), controller.update);

/**
 * @description Delete the recipe
 * @method DELETE /api/recipes/:id
 */
route.delete('/api/recipes/:id', controller.delete);


module.exports = route
