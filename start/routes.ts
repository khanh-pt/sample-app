/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/api/v1/auth_controller')
const UsersController = () => import('#controllers/api/v1/users_controller')
const ManagerUsersController = () => import('#controllers/api/v1/manager/users_controller')

router
  .group(() => {
    router.resource('users', UsersController).only(['store'])
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.delete('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('api/v1')

router
  .group(() => {
    router.resource('users', ManagerUsersController).only(['index']).as('manager.users')
  })
  .prefix('api/v1/manager')
