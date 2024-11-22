import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'
import { errors } from '@vinejs/vine'
import { responseJson } from '#abilities/index'

export default class AuthController {
  async register({ request, response, i18n }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)
      const user = await User.create(data)

      responseJson({
        response,
        success: true,
        status: 200,
        message: i18n.t('auth.register.success'),
        data: await User.accessTokens.create(user),
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        responseJson({
          response,
          success: false,
          status: 400,
          message: i18n.t('auth.register.fail'),
          errors: error.messages,
        })
      }
    }
  }

  async login({ request, response, i18n }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)

      responseJson({
        response,
        success: true,
        status: 200,
        message: i18n.t('auth.login.success'),
        data: await User.accessTokens.create(user),
      })
    } catch (error) {
      responseJson({
        response,
        success: false,
        status: 400,
        message: i18n.t('auth.login.fail'),
        errors: error instanceof errors.E_VALIDATION_ERROR ? error.messages : error,
      })
    }
  }

  async logout({ auth }: HttpContext) {
    console.log({ 'auth.user': auth.user })

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
      console.log({ error })
    }
  }
}
