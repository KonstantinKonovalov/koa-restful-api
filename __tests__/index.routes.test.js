const request = require('supertest');
const mongoose = require('mongoose');
const http = require('http');
const { app } = require('../app');

let server;

beforeAll((done) => {
    server = http.createServer(app.callback());
    server.listen(done);
});

afterAll(() => {
    mongoose.disconnect();
    server.close();
});

describe('routes: index', () => {
    it('should respond success message', async () => {
        const response = await request(server).get('/');
        expect(response.status).toEqual(200);
        expect(response.body.message).toBeDefined();
        expect(response.body.message).toEqual('Success');
    });
});

describe('routes: /products', () => {
    test('should respond json from GET request', async () => {
        const response = await request(server).get('/api/v1/products');
        expect(response.status).toEqual(200);
        expect(response.type).toEqual('application/json');
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('items');
        expect(response.body).toHaveProperty('amount');
        expect(response.body.items).toContainEqual(
            expect.objectContaining(
                {
                    _id: expect.any(String),
                    description: expect.any(String),
                    name: expect.any(String),
                    productImage: expect.any(String)
                }
            )
        );
    });
});
