const axios = require('axios');

/**
 * Gets all recipes and renders home page
 */
exports.home = (req, res) => {
    // Get params for pagination
    let getParams = {
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort || 'createdAt',
        direction: req.query.direction || -1,
        title: req.query.title,
        ingredient: req.query.ingredient,
        frase: req.query.frase
    };

    // Make a get request to /api/recipes
    axios.get('http://localhost:3000/api/recipes', {params: getParams})
        .then(function(response) {
            let moment = require('moment');
            res.render('index', {recipes: response.data, moment: moment});
        })
        .catch(err => {
            res.send(err);
        })
}

/**
 * Renders form for creating recipe
 */
exports.add_recipe = (req, res) => {
    res.render('add_recipe');
}

/**
 * Gets single recipe data
 */
exports.update_recipe = (req, res) => {
    axios.get('http://localhost:3000/api/recipes', {params: {id : req.query.id}})
        .then(function(recipedata) {
            res.render("update_recipe", {recipe : recipedata.data})
        })
        .catch(err => {
            res.send(err);
        })
}
