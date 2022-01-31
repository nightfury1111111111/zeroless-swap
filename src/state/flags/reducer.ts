import { createReducer } from '@reduxjs/toolkit'
import { autoSwap, autoSlippage } from './actions'

interface InputState {
  swapFlag: boolean,
  autoSlippageFlag: boolean
}

const initialState: InputState = {
  swapFlag: false,
  autoSlippageFlag: false
}

export default createReducer<any>(initialState, (builder) =>
  builder
    .addCase(autoSwap, (state, { payload: { swapFlag } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        swapFlag,
      }

      // they're typing into a new field, store the other value
    })
    .addCase(autoSlippage, (state, { payload: { autoSlippageFlag } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        autoSlippageFlag,
      }

      // they're typing into a new field, store the other value
    })
)
