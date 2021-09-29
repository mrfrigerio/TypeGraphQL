import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import bcrypt from 'bcryptjs'
import { User } from '../../entities/User'
import { RegisterInput } from './register/RegisterInput'
import { MyContext } from './types/MyContext'

@Resolver(User)
export class MeResolver {
  @Query(() => User)
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    const userId = ctx.req.session.userId
    console.log(userId)
    if (!userId) {
      throw new Error('User not found')
    }
    return User.findOne(userId)
  }
}
