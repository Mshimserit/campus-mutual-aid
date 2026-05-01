import { createDataSource } from '@/utils/data-source'
import { messageApi } from './message-api'
import { messageMock } from '@/mock/message-mock'

export const messageService = createDataSource(messageApi, messageMock)
