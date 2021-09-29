import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import bcrypt from 'bcryptjs'
import { User } from '../../entities/User'
import { RegisterInput } from './register/RegisterInput'

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
  async register(@Arg('data') registerInput: RegisterInput): Promise<User> {
    const { firstName, lastName, email, password } = registerInput
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
