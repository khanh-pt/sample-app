import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import PermissionRole from '#models/permission_role'
import RoleUser from '#models/role_user'

export default class DevelopmentSeeder extends BaseSeeder {
  async run() {
    async function createUsers() {
      const payload: Partial<User>[] = []

      for (let index = 0; index < 5; index++) {
        payload.push({
          first_name: 'User',
          last_name: `${index + 1}`,
          email: `user${index + 1}@gmail.com`,
          password: 'secret',
        })
      }

      await User.updateOrCreateMany('email', payload)
    }

    async function createPermissions() {
      const payload: Partial<Permission>[] = []

      for (let index = 0; index < 5; index++) {
        payload.push({
          name: `permission_${index + 1}`,
        })
      }

      await Permission.updateOrCreateMany('name', payload)
    }

    async function createRoles() {
      const payload: Partial<Role>[] = []

      for (let index = 0; index < 5; index++) {
        payload.push({
          name: `role_${index + 1}`,
        })
      }

      await Role.updateOrCreateMany('name', payload)
    }

    async function createPermissionRoles() {
      const permissions = await Permission.query().select('id')
      const role = await Role.first()

      if (permissions.length && role) {
        const payload: Partial<PermissionRole>[] = []

        permissions.forEach((permission) => {
          payload.push({
            permission_id: permission.serialize().id,
            role_id: role.id,
          })
        })

        await PermissionRole.updateOrCreateMany(['permission_id', 'role_id'], payload)
      }
    }

    async function createRoleUsers() {
      const roles = await Role.query().select('id')
      const user = await User.first()

      if (roles.length && user) {
        const payload: Partial<RoleUser>[] = []

        roles.forEach((role) => {
          payload.push({
            role_id: role.serialize().id,
            user_id: user.id,
          })
        })

        await RoleUser.updateOrCreateMany(['role_id', 'user_id'], payload)
      }
    }

    await createUsers()
    await createPermissions()
    await createRoles()
    await createPermissionRoles()
    await createRoleUsers()
  }
}
