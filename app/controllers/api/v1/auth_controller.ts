import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'
import { errors } from '@vinejs/vine'

export default class AuthController {
  async register({ request }: HttpContext) {
    console.log(123);

    try {
      const data = await request.validateUsing(registerValidator)
      const user = await User.create(data)

      return User.accessTokens.create(user)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return { message: 'fail', errors: error.messages }
      }
    }
  }

  async login({ request }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)

      return User.accessTokens.create(user)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return { message: 'fail', errors: error.messages }
      } else {
        return { message:error }
      }
    }
  }

  async logout({ auth }: HttpContext) {
    console.log({"auth.user": auth.user});

    const user = auth.user!

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return { message: 'success' }
  }

  async me({ auth }: HttpContext) {
    try {
      await auth.check()
      return {
        user: auth.user,
      }
    } catch (error) {
      console.log({error});

    }
  }
}
