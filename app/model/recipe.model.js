const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

var schema = new mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    ingredients : {
        type: Array,
        required: true
    },
    description : String,
    image : String
    }, {
        timestamps: true
})

schema.plugin(aggregatePaginate);

const Recipedb = mongoose.model('recipedb', schema);

module.exports = Recipedb;
