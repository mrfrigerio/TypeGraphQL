import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import session from 'express-session'
import express from 'express'
import connectRedis from 'connect-redis'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { RegisterResolver } from './modules/user/Register'
import { redis } from './redis'
import { LoginResolver } from './modules/user/Login'
import { MeResolver } from './modules/user/Me'

const main = async () => {
  await createConnection()
  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver]
  })

  /**
   ** Integração do apollo-server com o express
   */
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res })
  })

  const app = express()

  // Session Middleware
  app.use(
    cors({
      credentials: true,
      origin: '*'
    })
  )

  const RedisStore = connectRedis(session)

  app.use(
    session({
      store: new RedisStore({
        client: redis
      }),
      name: 'qid', // Nome do Cookie
      secret: 'aslkdfjoiq12312',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  )

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () =>
    console.log('Server started at http://localhost:4000/graphql')
  )
}

main()
