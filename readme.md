# A tutorial

## Source
https://www.youtube.com/watch?v=I6ypD7qv3Z8

## Plugins

* Prettier - Code formatter
* Bracket pair colorizer 2

## How to run the project

1. create postgres database
```
brew install postgresql
brew services start postgresql
pstl postgres
# CREATE USER postgres SUPERUSER;
# CREATE DATABASE lireddit WITH OWNER postgres;
```
1. do the database migration: `yarn migration:create`
1. install redis: `brew install redis` and `brew services start redis`
1. start the dev server: `yarn dev`



## Project details

### Init

`npm init -y`

`yarn add -D @types/node typescript` to add typescript support for node.

`yarn add -D ts-node` to run node code with ts.

Then you can add the npm start script to `ts-node src/index.ts`.

Create a file called `src/index.ts`. Then in the root dir do npx `tsconfig.json`.


`ts-node` is slow. Do not use it.

Create a `watch` command. `"watch": "tsc -w"`. It will watch and convert ts to js so you can run the generated js file.

#### Running postgres
Install postgresql with homebrew: [ref](https://wiki.postgresql.org/wiki/Homebrew)

Run the postgresql locally:
```
brew services start postgresql
psql postgres
```


#### Mikro-orm
```
yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg
```



Connect to DB and define entities by copying from the example (class annotation style) from mikrorm website.

How to create a Postgresql table? check the mikroorm doc.

```
npx mikro-orm migration:create
```

It complains that `role 'postgres' doesn't exist` because homebrew creates the role as the unix user name. So either create a new role or configure the mikro-orm to another user. [ref](https://stackoverflow.com/questions/15301826/psql-fatal-role-postgres-does-not-exist)

Here's what I did:
```
psql postgres
# CREATE USER postgres SUPERUSER;
# CREATE DATABASE lireddit WITH OWNER postgres;
```

If there's an error saying that TABLE already exists, just create another database. I don't know why???

Maybe check the migrations, you might have multiple migrations for creating the same table during development, remove those migrations.


Password hasing: argon2

Session keeping: express-session

Connect to redis (for redis session storage): connect-redis. Redis v4 is incompatible with connect-redis, use ioredis instead

Solve the problem of `Express.Session`: https://forum.freecodecamp.org/t/ts-namespace-global-express-has-no-exported-member-session/436838/11

Install redis: `brew install redis`

Start redis: `redis-server`

