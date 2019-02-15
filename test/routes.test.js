const request = require('supertest');
const mongoose = require('mongoose');
const http = require('http');
const chai = require('chai');
const { app } = require('../app');

const { expect } = chai;

let server;

before(async () => {
    console.log('-------------', process.env.NODE_ENV)
    server = http.createServer(app.callback());
    server.listen();

    global.user = {
        email: 'test@test.com',
        password: 'testpassword'
    };

    global.product = {
        name: 'some product name',
        description: 'some product description'
    };

    const db = mongoose.connection;
    await db.dropDatabase();
});

after(() => {
    mongoose.disconnect();
    server.close();

    delete global.user;
    delete global.product;
});

describe('routes: index', () => {
    it('should respond success message', async () => {
        const response = await request(server).get('/');
        expect(response.status).equal(200);
        // expect(response.body.message).toBeDefined();
        expect(response.body.message).equal('Success');
    });
});

describe('routes: /products without auth', () => {
    it('should respond json from GET request', async () => {
        const response = await request(server).get('/api/v1/products');
        expect(response.status).equal(200);
        expect(response.type).equal('application/json');
        // expect(response.body).toBeDefined();
        expect(response.body).to.have.property('items').that.deep.equals([]);
        expect(response.body).to.have.property('amount').that.equals(0);
    });

    it('should fail to post product without login', async () => {
        const response = await request(server)
            .post('/api/v1/products')
            .set('Accept', 'application/json')
            .send(global.product);

        expect(response.status).equal(401);
        expect(response.type).equal('application/json');
        // expect(response.body).toBeDefined();
        expect(response.body).to.have.property('message').that.equals('Auth failed');
    });
});

describe('routes: /signup', () => {
    it('should respond json from post signup request', async () => {
        const response = await request(server)
            .post('/api/v1/signup')
            .set('Accept', 'application/json')
            .send(global.user);

        expect(response.status).equal(200);
        expect(response.type).equal('application/json');
        // expect(response.body).toBeDefined();
    });
});

describe('routes: /login', () => {
    it('should fail login user with wrong password', async () => {
        const response = await request(server)
            .post('/api/v1/login')
            .set('Accept', 'application/json')
            .send({
                ...global.user,
                password: 'wrong password'
            });

        expect(response.status).equal(401);
        expect(response.type).equal('application/json');
        // expect(response.body).toBeDefined();
        expect(response.body).to.have.property('message').that.equals('Auth failed');
    });

    it('should success login user', async () => {
        const response = await request(server)
            .post('/api/v1/login')
            .set('Accept', 'application/json')
            .send(global.user);

        expect(response.status).equal(200);
        expect(response.type).equal('application/json');
        // expect(response.body).toBeDefined();
    });
});

// // TODO: auth failed - cookies = undefined ?

describe('routes: /products with auth', () => {
    it('should success post product', async () => {
        const loginResponse = await request(server)
            .post('/api/v1/login')
            .set('Accept', 'application/json')
            .send(global.user);

        const response = await request(server)
            .post('/api/v1/products')
            .set('Accept', 'application/json')
            .send(global.product);

        expect(response.status).equal(200);
        expect(response.type).equal('application/json');
        // expect(response.body).toBeDefined();
        expect(response.body).to.have.property('amount').that.equals(1);
    });
});
