const request = require('supertest')
const app = require('../../server')
const mongoose = require('mongoose')

const apiRoute = "/api/"

let recipeId
let title

describe('Post Endpoints', () => {
    // Create recipe
    it('should create a new recipe', async () => {
        const res = await request(app)
            .post('/api/recipes')
            .set("Accept", "application/json")
            .send({
                "title": "Test recipe 1",
                "description": "Test recipe description 1",
                "ingredients": [
                    "Ingredient 1",
                    "Ingredient 2",
                    "Ingredient 3",
                    "Ingredient 4",
                ]
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title');
        expect(res.body).toHaveProperty('ingredients');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('image');
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('updatedAt');
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toEqual('Test recipe 1');

        recipeId = res.body._id;
    });
});

describe('Put Endpoints', () => {
     // Update recipe
    it('should update created recipe', async () => {
        const res = await request(app)
            .put('/api/recipes/' + recipeId)
            .set("Accept", "application/json")
            .send({
                "title": "Test recipe updated",
                "description": "Test recipe description updated",
                "ingredients": [
                    "Ingredient updated",
                    "Ingredient updated",
                    "Ingredient updated",
                    "Ingredient updated",
                ]
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title');
        expect(res.body).toHaveProperty('ingredients');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('image');
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('updatedAt');
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toEqual('Test recipe updated');
        expect(res.body._id).toEqual(recipeId);
    });

});


describe('Get Endpoints', () => {
    // Retrive vreated recipe
    it('should get one recipe', async () => {
        const res = await request(app)
            .get('/api/recipes?id='+recipeId)
            .set("Accept", "application/json");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title');
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toEqual(recipeId);
    });

    // Fail to retrive recipe couse bad id
    it('should fail getting recipe with bad id', async () => {
        let falseId = '111'
        const res = await request(app)
            .get('/api/recipes?id=' + falseId)
            .set("Accept", "application/json");

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Error retrieving recipe with id ' + falseId);
    });

});


describe('Delete Endpoints', () => {
    // Delete previously created recipe
    it('should delete previously created recipe', async () => {

        const res = await request(app)
            .delete('/api/recipes/'+recipeId)
            .set("Accept", "application/json");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Recipe was deleted successfully!');
    });

});


afterAll( async () => {
    await mongoose.connection.close()
})
