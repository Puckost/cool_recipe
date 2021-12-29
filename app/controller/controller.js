// Recipe model
const Recipedb = require('../model/recipe.model');

// Image manipulation
const {cropImage, upload} = require('../helpers/image.helper');

/**
 * Create and save new recipe
 *
 * @param  req
 * @param  res
 * @return recipe
 */
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    var imgName = '';

    // Resize image if it is uploaded and grab name
    if (typeof req.file !== 'undefined') {
        cropImage(req.file.filename);
        imgName = req.file.filename;
    }

    // New recipe
    const recipe = new Recipedb({
        title : req.body.title,
        ingredients : req.body.ingredients.filter(Boolean),
        description: req.body.description,
        image : imgName
    })

    // Save recipe in the database
    recipe
        .save(recipe)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating a recipe"
            });
        });
}

/**
 * Get one recipe or multiple recipe.
 * Uses filters, ordering and pagination.
 *
 * @param  req
 * @param  res
 * @return recipe
 */
exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;

        Recipedb.findById(id)
            .then(data => {
                if(!data) {
                    res.status(404).send({ message : "Not found recipe with id "+ id})
                } else {
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Error retrieving recipe with id " + id})
            })

    } else {
        let aggregateOptions = [];

        //Pagination
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 6;

        // Sorting
        let sortName = req.query.sort || 'createdAt';
        let sortDirection = parseInt(req.query.direction) || -1;

        let sort = { [sortName]: sortDirection };

        // Set the options for pagination
        const customLabels = {
            totalDocs: 'totalRecipes',
            docs: 'recipes',
        };

        const options = {
            page,
            limit,
            sort: sort,
            customLabels
        };

        // Filtering
        let match = {};

        // Filter by recipe title
        if (req.query.title) match.title = {
            $regex: req.query.title,
            $options: 'i'
        };

        // Filter by ingredient
        if (req.query.ingredient) match.ingredients = {
            $regex: req.query.ingredient,
            $options: 'i'
        };

        // Filter by both with or
        if (req.query.title && req.query.ingredient)
            match = {
                $or: [{title: match.title}, {ingredients: match.ingredients}]
            };

        aggregateOptions.push({
            $match: match,
        });

        myAggregate = Recipedb.aggregate(aggregateOptions);

        Recipedb
        .aggregatePaginate(myAggregate, options)
            .then(recipe => {
                recipe.getParams = req.query;
                res.send(recipe)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving recipe information" })
            })
    }
}

/**
 * Update recipe by id
 *
 * @param  req
 * @param  res
 * @return recipe
 */
exports.update = (req, res) => {

    if (!req.body) {
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    // Either is image uploaded, or only title of image
    if (typeof req.file === 'undefined') {
        req.body.image = req.body.hidden_image_title;
    } else {
        req.body.image = req.file.filename;
        cropImage(req.file.filename);
    }

    // Remove empty ingredients
    req.body.ingredients = req.body.ingredients.filter(Boolean);

    const id = req.params.id;

    Recipedb.findByIdAndUpdate(id, req.body, {
            useFindAndModify: false,
            new: true
        })
        .then(data => {
            if (!data) {
                res.status(404).send({ message : `Cannot update recipe with ${id}.`})
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message : `Error update recipe with ${id}`})
        })
}

/**
 * Delete a recipe by id
 *
 * @param req
 * @param res
 * @return string message
 */
exports.delete = (req, res) => {
    const id = req.params.id;

    Recipedb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message : `Cannot delete recipe with id ${id}.`})
            } else {
                res.send({
                    message : "Recipe was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete recipe with id=" + id
            });
        });
}
