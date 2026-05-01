import { createDataSource } from '@/utils/data-source'
import { orderApi } from './order-api'
import { orderMock } from '@/mock/order-mock'

export const orderService = createDataSource(orderApi, orderMock)
