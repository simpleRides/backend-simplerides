const request = require('supertest');
const app = require('../app');

describe('POST /user/signin', () => {
  it('should validate the endpoint', async () => {
    const res = await request(app).post('/users/signin');

    expect(res.statusCode).toBe(200);
  });

  it('shoud return an error message if the email field is missing', async () => {
    const loginInfo = { password: 'xxddxx' };
    const res = await request(app).post('/users/signin').send(loginInfo);

    expect(res.body.error).toContain('Missing or empty fields');
  });

  it('shoud return an error message if the password field is missing', async () => {
    const loginInfo = { email: 'myemail@email.com' };
    const res = await request(app).post('/users/signin').send(loginInfo);

    expect(res.body.error).toContain('Missing or empty fields');
  });
});
