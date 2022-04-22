import { User } from '../entities/User'
import { MyContext } from 'src/types'
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import argon2 from 'argon2'

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

// Object type is used for return, input type for args
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@Resolver()
export class UserResolver {

  @Query(() => User, {nullable: true})
  async me(@Ctx() {req, em}: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return await em.findOne(User, {id: req.session.userId});
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext,
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'user name must be longer than 2',
          },
        ],
      }
    }
    if (options.password.length <= 4) {
      return {
        errors: [
          {
            field: 'password',
            message: 'user name must be longer than 4',
          },
        ],
      }
    }

    const hashedPassword = await argon2.hash(options.password)
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    })
    try {
      await em.persistAndFlush(user)
    } catch (err) {
      if (err.code === '23505' || err.detail.includes('already exists')) {
        //duplicate username error
        return {
          errors: [
            {
              field: 'username',
              message: 'username already exists',
            },
          ],
        }
      }
      console.log('message: ', err.message)
    }
    // set the cookie to enable login state.
    req.session.userId = user.id;
    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext,
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username })
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: "that username doesn't exist",
          },
        ],
      }
    }
    const valid = await argon2.verify(user.password, options.password)
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      }
    }
    req.session.userId = user.id
    return { user }
  }
}
