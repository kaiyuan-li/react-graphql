import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";

import mikroConfig from "./mikro-orm.config";

import express from "express";
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  // const post = orm.em.create(Post, {title: "a happy post"})
  // await orm.em.persistAndFlush(post);

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false
    }),
    // context will be accessable in all resolvers
    context: () => ({em: orm.em}),
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
