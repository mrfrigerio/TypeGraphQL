import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import bcrypt from 'bcryptjs'
import { User } from '../../entities/User'
import { MyContext } from './types/MyContext'

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | undefined> {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new Error('User not found')
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      throw new Error('Password does not match')
    }
    ctx.req.session.userId = user.id
    console.log(ctx.req.session)
    return user
  }
}
