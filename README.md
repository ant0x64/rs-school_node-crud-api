# Node GRUD API with clustering

Simple CRUD API using in-memory database underneath.

This project serves as a basic template for building a Node.js-based CRUD (Create, Read, Update, Delete) API with an in-memory database. The application provides endpoints to perform operations on a collection of items stored in memory.

Additionally, the application includes clustering and load balancing features to leverage multiple Node.js processes for improved performance.


## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)



## How to install

1. Clone the respository
   ```bash
   git clone https://github.com/ant0x64/rs-school_node-grud-api.git
2. Change the branch
    ```bash
    git pull origin dev && git checkout dev
    ```
3. Install dependencies
    ```bash
    npm install
    ```
    **Note**: Installing ts-node and ts-node-dev Globally

    On some systems, you may encounter permission issues or access problems when running ts-node or ts-node-dev within your project. To prevent such issues, consider installing ts-node and ts-node-dev globally on your machine using the following commands:
    ```bash
    npm install -g ts-node ts-node-dev
    ```

4. Setup the ENV
   
    You can change the ports used in the configuration file `<root>/.env`.

    Base configuration:
    ```env
    HOST_PORT=3000
    CLUSTER_PORT=4000
    ```

5. Running the Application
   ```bash
   npm run start:dev # dev mode
   npm run start:prod # prod mode
   npm run start:multi # cluster mode
   npm run test # execute testing scripts
   ```

## How to use

- **Create**: POST /api/users
- **Read (All)**: GET /api/users
- **Read (One)**: GET /api/users/{userId}
- **Update**: PUT /api/users/{userId}
- **Delete**: DELETE /api/users/{userId}

**Note**:  API does not handle redundant data such as undefined body content or not recognized parameters in the url like `/api/users/{userId}/{any}/`