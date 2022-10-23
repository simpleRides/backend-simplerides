const request = require('supertest');
const app = require('../app');

it('GET /ping', async () => {
  const res = await request(app).get('/ping');

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toContain('Welcome to simpleRide API');
});
