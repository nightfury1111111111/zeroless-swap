import { createAction } from '@reduxjs/toolkit'
import { RouterType } from '@sphynxdex/sdk-multichain'

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')

export const toggleMenu = createAction<boolean>('app/toggleMenu')
export const toggleTheme = createAction<boolean>('app/toggleTheme')
export const setRouterType = createAction<RouterType>('app/useSetRouterType')
export const setSwapType = createAction<string>('app/setSwapType')
export const setSwapTransCard = createAction<string>('app/setSwapTransCard')
export const setLiquidityPairA = createAction<string>('app/setLiquidityPairA')
export const setLiquidityPairB = createAction<string>('app/setLiquidityPairB')
export const updateRemovedAssets = createAction<string[]>('app/updateRemovedAssets')

export default updateBlockNumber
