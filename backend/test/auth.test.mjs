
import app from '../index.js';
import request from 'supertest';
import { User } from '../models/User.js';

describe("auth /POST", () => {

    beforeEach(async () => {
        await User.deleteMany();
    });

    it('should create a new user if not present', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                name: "testing",
                email: "test@gmail.com",
                password: "test123@"
            });

        expect(res.status).toBe(200);
    });

    it('should login a user if present', async () => {

        await request(app)
            .post('/api/register')
            .send({
                name: "testing",
                email: "test@gmail.com",
                password: "test123@"
            });

        const res = await request(app)
            .post('/api/login')
            .send({
                email: "test@gmail.com",
                password: "test123@"
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

});