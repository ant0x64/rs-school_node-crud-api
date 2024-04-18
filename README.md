# Node CRUD API with Clustering

This repository serves as the solution to [the assignment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md) creating custom CRUD API which uses only Node.js core modules and an in-memory database. The API is designed to handle basic operations for managing user records.

In addition, the application includes Jest unit tests, Webpack pipelining, clustering and load balancing features to leverage multiple Node.js processes for improved performance.

## Usage

1. Clone this repository.

2. Install dependencies `npm install`.

3. Set the port value in the `.env` file.

4. Start the application and run tests

   ```bash
   npm run start:dev # dev mode
   npm run start:prod # prod mode
   npm run start:multi # cluster mode
   npm run test # execute testing scripts
   ```

## Endpoints

- **Create**: `POST /api/users`
- **Read (All)**: `GET /api/users`
- **Read (One)**: `GET /api/users/{userId}`
- **Update**: `PUT /api/users/{userId}`
- **Delete**: `DELETE /api/users/{userId}`