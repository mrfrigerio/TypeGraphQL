import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { Query, Resolver, buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { RegisterResolver } from './modules/user/Register'

@Resolver()
class HelloResolver {
  @Query(() => String, {
    name: 'helloWorld',
    nullable: true
  })
  async hello() {
    return 'Hello Resolver'
  }
}

const main = async () => {
  await createConnection()
  const schema = await buildSchema({
    resolvers: [HelloResolver, RegisterResolver]
  })

  /**
   ** Integração do apollo-server com o express
   */
  const apolloServer = new ApolloServer({ schema })

  const app = express()
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })

  app.listen(4000, () =>
    console.log('Server started at http://localhost:4000/graphql')
  )
}

main()
