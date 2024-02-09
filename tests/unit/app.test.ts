import request from 'supertest';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';

import Server from 'services/server';
import Database from 'services/db.service';
import UserController from 'controllers/user.controller';

dotenv.config();

const validBody = {
  username: 'User Name',
  age: 20,
  hobbies: ['hobbie'],
};

// const invalidBodies = [
//   {
//     username: '',
//     age: 20,
//     hobbies: ['hobbie'],
//   },
//   {
//     username: 'User Name',
//     age: '20',
//     hobbies: ['hobbie'],
//   },
//   {
//     username: 'User Name',
//     age: 20,
//     hobbies: [100],
//   },
// ];

const database = new Database();
const server = new Server(database);
const listener = server.run();

describe('Server Requests Testing', () => {
  listener.listen(process.env.HOST_PORT ?? 3500);
  jest.mock('services/db.service');

  const userController = new UserController(new Database());
  const controller_root = userController.root;

  jest.unmock('services/db.service');

  test('Get all records with a GET api/users request (an empty array is expected)', async () => {
    const response = await request(listener).get(controller_root);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ result: [] });
  });

  test('Get not existed user (404 status and the message expected)', async () => {
    const valid_id = uuid();
    const response = await request(listener).get(
      controller_root + '/' + valid_id,
    );
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('message');
  });

  test('Get invalid user ID (400 status and the message expected)', async () => {
    const invalid_id = uuid() + '__';
    const response = await request(listener).get(
      controller_root + '/' + invalid_id,
    );
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  test('Add new valid user (201 status and the result expected)', async () => {
    const response = await request(listener)
      .post(controller_root)
      .send(validBody);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('result.id');
  });

  test('Get existed user (200 status and the result expected)', async () => {
    const createUserResponce = await request(listener)
      .post(controller_root)
      .send(validBody);

    expect(createUserResponce.body).toHaveProperty('result.id');
    const user_id = createUserResponce.body.result.id;

    const getUserResponce = await request(listener).get(
      controller_root + '/' + user_id,
    );

    expect(getUserResponce.status).toEqual(200);
    expect(getUserResponce.body).toHaveProperty('result.id');
  });

  test('Delete existed user (204 status expected)', async () => {
    const createUserResponce = await request(listener)
      .post(controller_root)
      .send(validBody);

    expect(createUserResponce.body).toHaveProperty('result.id');
    const user_id = createUserResponce.body.result.id;

    const getUserResponce = await request(listener).delete(
      controller_root + '/' + user_id,
    );

    expect(getUserResponce.status).toEqual(204);
  });

  test('Update existed user (200 status and the result expected)', async () => {
    const createUserResponce = await request(listener)
      .post(controller_root)
      .send(validBody);

    expect(createUserResponce.body).toHaveProperty('result.id');
    const user_id = createUserResponce.body.result.id;

    validBody.username = 'New Name';

    const putUserResponce = await request(listener)
      .put(controller_root + '/' + user_id)
      .send(validBody);

    expect(putUserResponce.status).toEqual(200);
    expect(putUserResponce.body).toHaveProperty('result');
    expect(putUserResponce.body.result).toMatchObject({
      ...validBody,
      id: user_id,
    });
  });

  test('Requests to non-existing endpoints', async () => {
    const createUserResponce = await request(listener).get(
      '/no/' + controller_root,
    );

    expect(createUserResponce.status).toEqual(404);
    expect(createUserResponce.body).toHaveProperty('message');
  });

  listener.close();
});
