import { createReducer } from '@reduxjs/toolkit'
import { RouterType } from '@sphynxdex/sdk-multichain'
import {
  updateBlockNumber,
  toggleMenu,
  toggleTheme,
  setRouterType,
  setSwapType,
  setSwapTransCard,
  setLiquidityPairA,
  setLiquidityPairB,
  updateRemovedAssets,
} from './actions'

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  menuToggled: boolean
  theme: number
  routerType: RouterType
  swapType: string
  swapTransCard: string
  liquidityPairA: string
  liquidityPairB: string
  removedAssets: string[]
}

const initialState: ApplicationState = {
  blockNumber: {},
  menuToggled: true,
  theme: localStorage.getItem('sphynxTheme') ? parseInt(localStorage.getItem('sphynxTheme')) : 0,
  routerType: RouterType.sphynx,
  swapType: 'swap',
  swapTransCard: 'tokenDX',
  liquidityPairA: null,
  liquidityPairB: null,
  removedAssets: [],
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(toggleMenu, (state) => {
      state.menuToggled = !state.menuToggled
    })
    .addCase(toggleTheme, (state) => {
      state.theme = (state.theme + 1) % 3
      localStorage.setItem('sphynxTheme', (state.theme % 3).toString())
    })
    .addCase(setRouterType, (state, { payload }) => {
      state.routerType = payload
    })
    .addCase(setSwapType, (state, { payload }) => {
      state.swapType = payload
    })
    .addCase(setSwapTransCard, (state, { payload }) => {
      state.swapTransCard = payload
    })
    .addCase(setLiquidityPairA, (state, { payload }) => {
      state.liquidityPairA = payload
    })
    .addCase(setLiquidityPairB, (state, { payload }) => {
      state.liquidityPairB = payload
    })
    .addCase(updateRemovedAssets, (state, { payload }) => {
      state.removedAssets = payload
    }),
)
