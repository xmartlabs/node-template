![node version](https://img.shields.io/badge/node-20.9.0-brightgreen)
![express version](https://img.shields.io/badge/express-4.17.1-brightgreen)
![prisma version](https://img.shields.io/badge/prisma-5.0.0-brightgreen)
![tsoa version](https://img.shields.io/badge/tsoa-5.1.1-brightgreen)
![typescript version](https://img.shields.io/badge/typescript-5.1.6-brightgreen)
![jest version](https://img.shields.io/badge/jest-29.6.1-brightgreen)

# Xmartlabs Node.js Template
This project contains Xmartlabs' Node.js template.


## Contributing to this Template

Make sure you have the appropriate version of Node (20.9.0) installed.

Then install the required packages:

```shell
npm install
```

To run tests you'll need to create a `.env` file. You can simply copy the example file (`.env.example`) and rename it. You can check config.ts file for valid values.

Tests are run using the typical command:

```shell
npm test
```
----------------------------------------------------------------------

## Project Setup

* Install Node 20.9.0 (as documented on [`.node-version`](./.node-version))
* Install the appropriate version of npm: `npm i -g npm@10.1.0`
* Install packages with `npm install`
* Create a new `.env` file using the `.env.example` as an example. for that run `$ cp .env.example .env`.
* Set the variables in the new environment file `.env` you created above.
* Start the project with `npm start`

## Project structure
* `.github` - GitHub Actions config files.
* `.vs_code` - Visual Studio Code sdebugger config.
* `build` - Generated with `tsoa specs-and-routes`. This is where it generates the routes and controllers documentation. Needed to run the code and generated on `npm start` and `npm test`. Added on .gitignore.
* `node_modules` - Contains all the dependencies. Generated with `npm install`. Added on .gitignore.
* `prisma` - Prisma migrations and schema. This is where all database changes should be made.
* `src` - Has the following structure:
  * `config` - Contains app envs, logging and error handling config.
  * `controllers` - Contains all the controllers.
  * `middlewares` - Contains auth, error handling,logging and security middlewares.
  * `routes` - Contains index and `/docs` routes. Remember that all controller routes are generated by `tsoa`
  * `services` - Contains all the services.
  * `tests` - Contains tests setup and utils.
  * `types` - Contains all the TS types and interfaces (except the ones generated by prisma client).
  * `utils` - Contains all the utils.


## Prisma ORM
[Prisma](https://www.prisma.io/docs/concepts/overview/what-is-prisma) is a next-generation ORM for Node.js.
`prisma client` - Auto-generated and type-safe query builder for Node.js & TypeScript.
`prisma migrate` - Prisma migration system.
Requeriments:
* set a `DATABASE_URL` on .env - The format is specified in .env.example
* Running database: There's a docker-compose file example: `docker-compose up -d`
* Run database migrations: `npx prisma migrate dev`

If you want to change the database schema, you just have to change the `prisma/schema.prisma` file and generate a new migration with `npx prisma migrate dev --name migration_name`



## TSOA - Swagger docs and routes generation
[TSOA](https://tsoa-community.github.io/docs/introduction.html) is a framework with integrated OpenAPI compiler to build Node.js serve-side applications using TypeScript. It allows you to generate Swagger documentation and routes for your API.

### Generating Routes and Specs
To generate routes and specs (mandatory to run the project) a command (`tsoa specs-and-routes`) is needed and it's included in `npm start` and `npm test`.

### Decorators
TSOA uses decorators to define the API routes and docs. check out the [TSOA docs](https://tsoa-community.github.io/docs/getting-started.html#defining-a-simple-controller) for more info.

### Notes
* The security decorator acts as a middleware adding a `user` object to the request that contains the decoded JWT token (or whatever you put on the return of the function in `middlewares/auth.ts`).
* The class `ValidateError` (extends Error) is used by TSOA to handle validation errors. Ex: If there's a missing property in the request body. A `ValidateError` is thrown and the error is handled by the `ErrorHandler` middleware.


## Docker Configuration
A [`Dockerfile`](./Dockerfile) has been added to this project. The main reason to use Docker is to generate a production build, it is not intended for use for development.
In fact, the Dockerfile has instructions only for generating the production-ready build. This is a multi-stage build that will build the project, run the migrations, and then run the server only with production dependiencies.
