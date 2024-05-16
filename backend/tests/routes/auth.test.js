const supertest = require('supertest');
const app = require('../../server');

describe('Authentication Endpoints', () => {
  let userToken; 

  describe('POST /signup', () => {
    it('should create a new user and return 201 status', async () => {
      const res = await supertest(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
          role: '65d0f4f8a849448b8fb2e132', 
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('email', 'testuser@example.com');
    });
    
  });

  describe('POST /signin', () => {
    it('should authenticate user and return a token', async () => {
      const res = await supertest(app)
        .post('/api/auth/signin')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('token');
      userToken = res.body.data.token; 
    });
  });

  describe('GET /renew', () => {
    it('should renew the token', async () => {
    
      if (!userToken) {
        throw new Error('Token not defined');
      }

      const res = await supertest(app)
        .get('/api/auth/renew')
        .set('x-token', `${userToken}`); 

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('token');
    });
  });
});
