const request = require('supertest');
// const fetch = require('node-fetch');
const app = require('../app');

it('GET /ping', async () => {
  const res = await request(app).get('/ping');

  expect(res.statusCode).toBe(200);
});