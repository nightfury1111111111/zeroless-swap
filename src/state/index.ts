/* eslint-disable */
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import { useDispatch } from 'react-redux'
import farmsReducer from './farms'
import poolsReducer from './pools'
import predictionsReducer from './predictions'
import blockReducer from './block'
import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import bridge from './bridge/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'
import inputReducer from './input/reducer'
import autoSwapReducer from './flags/reducer'
import tokenReducer from './wallet/tokenSlice'
import bondingReducer from './bond/BondSlice'
import accountReducer from './bond/AccountSlice'
import pendingTransactionsReducer from './bond/PendingSlice'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    account: accountReducer,
    block: blockReducer,
    farms: farmsReducer,
    pools: poolsReducer,
    predictions: predictionsReducer,
    tokens: tokenReducer,
    bonding: bondingReducer,
    pendingTransactions: pendingTransactionsReducer,
    // Exchange
    application,
    user,
    transactions,
    swap,
    mint,
    bridge,
    burn,
    multicall,
    lists,
    inputReducer,
    autoSwapReducer,
  },
  middleware: [...getDefaultMiddleware({ thunk: true }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch()

export default store
