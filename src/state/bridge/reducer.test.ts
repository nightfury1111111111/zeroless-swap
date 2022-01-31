import { createStore, Store } from 'redux'

import { Field, typeInput } from './actions'
import reducer, { BridgeState } from './reducer'

describe('mint reducer', () => {
  let store: Store<BridgeState>

  beforeEach(() => {
    store = createStore(reducer, {
      independentField: Field.BRIDGE_CURRENCY,
      typedValue: '',
    })
  })

  describe('typeInput', () => {
    it('sets typed value', () => {
      store.dispatch(typeInput({ field: Field.BRIDGE_CURRENCY, typedValue: '1.0'}))
      expect(store.getState()).toEqual({ independentField: Field.BRIDGE_CURRENCY, typedValue: '1.0'})
    })
    it('clears other value', () => {
      store.dispatch(typeInput({ field: Field.BRIDGE_CURRENCY, typedValue: '1.0'}))
      expect(store.getState()).toEqual({ independentField: Field.BRIDGE_CURRENCY, typedValue: '1.0', otherTypedValue: '' })
    })
  })
})
