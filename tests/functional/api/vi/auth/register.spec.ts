import { test } from '@japa/runner'
import User from '#models/user'

test.group('POST /api/v1/register', (group) => {
  const PATH = '/api/v1/register'

  group.each.teardown(async () => {
    await User.query().delete()
  })

  test('should register a new user with valid data', async ({ assert, client }) => {
    const response = await client.post(PATH).json({
      first_name: 'john',
      last_name: 'doe',
      email: 'test@example.com',
      password: 'securepassword123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Đăng ký thành công',
    })

    // Validate that the user was created in the database
    const user = await User.findBy('email', 'test@example.com')
    assert.isNotNull(user)
  })

  test('should fail when first_name is missing', async ({ client }) => {
    const response = await client.post(PATH).json({
      last_name: 'doe',
      email: 'email@example.com',
      password: 'secret',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: [
        {
          field: 'first_name',
          rule: 'required',
          message: 'Trường first_name là bắt buộc',
        },
      ],
    })
  })

  test('should fail when last_name is missing', async ({ client }) => {
    const response = await client.post(PATH).json({
      first_name: 'doe',
      email: 'email@example.com',
      password: 'secret',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: [
        {
          field: 'last_name',
          rule: 'required',
          message: 'Trường last_name là bắt buộc',
        },
      ],
    })
  })

  test('should fail when email is missing', async ({ client }) => {
    const response = await client.post(PATH).json({
      first_name: 'doe',
      last_name: 'doe',
      password: 'secret',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: [
        {
          field: 'email',
          rule: 'required',
          message: 'Trường email là bắt buộc',
        },
      ],
    })
  })

  test('should fail when password is missing', async ({ client }) => {
    const response = await client.post(PATH).json({
      first_name: 'doe',
      last_name: 'doe',
      email: 'email@gmail.com',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: [
        {
          field: 'password',
          rule: 'required',
          message: 'Trường mật khẩu là bắt buộc',
        },
      ],
    })
  })

  test('should fail when email is already in use', async ({ client }) => {
    // Create a user with the same email
    await User.create({
      first_name: 'john',
      last_name: 'doe',
      email: 'duplicate@example.com',
      password: 'securepassword123',
    })

    const response = await client.post(PATH).json({
      email: 'duplicate@example.com',
      password: 'newpassword456',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: [
        {
          field: 'email',
          rule: 'database.unique',
          message: 'Trường email đã tồn tại',
        },
      ],
    })
  })

  test('should fail with invalid email format', async ({ client }) => {
    const response = await client.post(PATH).json({
      email: 'invalid-email',
      password: 'securepassword123',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: [
        {
          field: 'email',
          rule: 'email',
          message: 'Trường email phải là một địa chỉ hợp lệ',
        },
      ],
    })
  })
})
