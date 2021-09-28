import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import bcrypt from 'bcryptjs'
import { User } from '../../entities/User'

@Resolver(User)
export class RegisterResolver {
  @Query(() => String, {
    name: 'helloWorld',
    nullable: true
  })
  async hello() {
    return 'Hello Resolver'
  }

  @Mutation(() => User)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save()
    return user
  }
}
