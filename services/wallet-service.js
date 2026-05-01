import { createDataSource } from '@/utils/data-source'
import { walletApi } from './wallet-api'
import { walletMock } from '@/mock/wallet-mock'

export const walletService = createDataSource(walletApi, walletMock)
