import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async store({ request, response }: HttpContext) {
    const data = request.only(['email', 'password'])

    const user = await User.create(data)

    return response.created({ message: 'User created successfully', user })
    response.send('hello')
  }
}
