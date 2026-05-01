import { createDataSource } from '@/utils/data-source'
import { userApi } from './user-api'
import { userMock } from '@/mock/user-mock'

export const userService = createDataSource(userApi, userMock)
