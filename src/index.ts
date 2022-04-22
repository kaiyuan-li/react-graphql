import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'

import mikroConfig from './mikro-orm.config'

import express from 'express'
import { ApolloServer } from 'apollo-server-express'
// https://github.com/apollographql/apollo-server/issues/5341#issuecomment-961915680 for how to enable playground for cookie testing
import {ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { MyContext } from './types'
// import cors from 'cors'

const main = async () => {
  const orm = await MikroORM.init(mikroConfig)
  await orm.getMigrator().up()
  // const post = orm.em.create(Post, {title: "a happy post"})
  // await orm.em.persistAndFlush(post);

  const app = express()

  // session middle ware has to come before apollo because we will be using
  // session inside apollo
  const RedisStore = connectRedis(session)
  let redis = new Redis()
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: 'lax', // for CSRF
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'randomcat',
      resave: false,
    }),
  )
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // context will be accessable in all resolvers
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}

main().catch((err) => {
  console.log(err)
})
