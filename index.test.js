const request = require('supertest');

jest.mock('pg', () => {
  const mQuery = jest.fn();
  const mPool = { query: mQuery };
  return { Pool: jest.fn(() => mPool) };
});

const { Pool } = require('pg');
const mockPool = new Pool();

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
  mockPool.query.mockResolvedValueOnce({ rows: [] });
});

const app = require('./index');

describe('To-Do API', () => {
  test('GET /health responde 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /tasks retorna lista de tareas', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'Estudiar Docker', completed: false }],
    });
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /tasks crea una tarea nueva', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 2, title: 'Aprender GitHub Actions', completed: false }],
    });
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Aprender GitHub Actions' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Aprender GitHub Actions');
  });

  test('POST /tasks sin title retorna 400', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
  });
});