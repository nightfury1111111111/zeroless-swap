import { createReducer } from '@reduxjs/toolkit'
import { Field, resetBridgeState, typeInput, othTypeInput } from './actions'

export interface BridgeState {
  readonly independentField: Field
  readonly dependentField: Field
  readonly typedValue: string
  readonly othTypedValue: string
}

const initialState: BridgeState = {
  independentField: Field.BRIDGE_TOKENSPX,
  dependentField: Field.BRIDGE_TOKENOTH,
  typedValue: '',
  othTypedValue: '',
}

export default createReducer<BridgeState>(initialState, (builder) =>
  builder
    .addCase(resetBridgeState, () => initialState)
    .addCase(typeInput, (state, { payload: { field, typedValue} }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(othTypeInput, (state, { payload: { field, othTypedValue} }) => {
      return {
        ...state,
        dependentField: field,
        othTypedValue,
      }
    }),
)
