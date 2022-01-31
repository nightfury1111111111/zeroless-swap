import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  BUYINPUT = 'BUYINPUT',
  BUYOUTPUT = 'BUYOUTPUT',
  SELLINPUT = 'SELLINPUT',
  SELLOUTPUT = 'SELLOUTPUT',
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('swap/selectCurrency')
export const switchCurrencies = createAction<void>('swap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('swap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('swap/setRecipient')
export const selectBSCurrency = createAction<{ field: Field; currencyId: string }>('swap/selectBSCurrency')
export const typeBSInput = createAction<{ field: Field; typedValue: string }>('swap/typeBSInput')
