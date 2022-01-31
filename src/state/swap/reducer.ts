import { createReducer } from '@reduxjs/toolkit'
import { WETH } from '@sphynxdex/sdk-multichain'
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
  selectBSCurrency,
  typeBSInput,
} from './actions'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
  readonly [Field.BUYINPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.BUYOUTPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.SELLINPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.SELLOUTPUT]: {
    readonly currencyId: string | undefined
  }
  readonly formattedBSAmounts: {
    readonly [Field.BUYINPUT]: string | undefined
    readonly [Field.BUYOUTPUT]: string | undefined
    readonly [Field.SELLINPUT]: string | undefined
    readonly [Field.SELLOUTPUT]: string | undefined
  }
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  recipient: null,
  [Field.BUYINPUT]: {
    currencyId: '',
  },
  [Field.BUYOUTPUT]: {
    currencyId: '',
  },
  [Field.SELLINPUT]: {
    currencyId: '',
  },
  [Field.SELLOUTPUT]: {
    currencyId: '',
  },
  formattedBSAmounts: {
    [Field.BUYINPUT]: '',
    [Field.BUYOUTPUT]: '',
    [Field.SELLINPUT]: '',
    [Field.SELLOUTPUT]: '',
  },
}

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(
      replaceSwapState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          independentField: field,
          typedValue,
          recipient,
          [Field.BUYINPUT]: {
            currencyId: WETH[56].address,
          },
          [Field.BUYOUTPUT]: {
            currencyId: '',
          },
          [Field.SELLINPUT]: {
            currencyId: '',
          },
          [Field.SELLOUTPUT]: {
            currencyId: WETH[56].address,
          },
          formattedBSAmounts: state.formattedBSAmounts,
        }
      },
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        }
      }
      // the normal case
      return {
        ...state,
        [field]: { currencyId },
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
    .addCase(selectBSCurrency, (state, { payload: { currencyId, field } }) => {
      // the normal case
      return {
        ...state,
        [field]: { currencyId },
      }
    })
    .addCase(typeBSInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        formattedBSAmounts: { ...state.formattedBSAmounts, [field]: typedValue },
      }
    }),
)
