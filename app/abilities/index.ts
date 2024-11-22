import type { Response } from '@adonisjs/core/http'

type responseJsonType = {
  response: Response
  status: number
  success: boolean
  message: string
  data?: any
  errors?: any
}
export const responseJson = ({
  response,
  status,
  success,
  message,
  data,
  errors,
}: responseJsonType) => {
  console.log({ data })

  return response.status(status).send({
    success,
    message,
    data,
    errors,
  })
}
