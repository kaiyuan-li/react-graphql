# A tutorial

## Source
https://www.youtube.com/watch?v=I6ypD7qv3Z8

## Plugins

* Prettier - Code formatter
* Bracket pair colorizer 2


## Project

### Init

`npm init -y`

`yarn add -D @types/node typescript` to add typescript support for node.

`yarn add -D ts-node` to run node code with ts.

Then you can add the npm start script to `ts-node src/index.ts`.

Create a file called `src/index.ts`. Then in the root dir do npx `tsconfig.json`.


`ts-node` is slow. Do not use it.

Create a `watch` command. `"watch": "tsc -w"`. It will watch and convert ts to js so you can run the generated js file.

#### Mikro-orm
```
yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg
```

Install postgresql with homebrew: [ref](https://wiki.postgresql.org/wiki/Homebrew)


Connect to DB and define entities by copying from the example (class annotation style) from mikrorm website.

How to create a Postgresql table? check the mikroorm doc.