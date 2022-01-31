import { createReducer } from '@reduxjs/toolkit'
import { SPHYNX_TOKEN_ADDRESS } from 'config/constants'
import { WBNB_ADDRESS } from 'config/constants/addresses'
import {
  resetMintState,
  typeInput,
  setIsInput,
  typeRouterVersion,
  marketCap,
  setCustomChartType,
  setConnectedNetworkID,
  setSelectedQuoteCurrency
} from './actions'

interface InputState {
  input: string
  isInput: boolean
  routerVersion: string
  marketCapacity: number
  customChartType: any
  connectedNetworkID: any
  quoteCurrency: string
}

const CHART_TYPE = 'tv.chart.type'
const CONNECTED_NETWORKID = 'chainID'
const QUOTE_CURRENCY= 'quoteCurrency'

const initialState: InputState = {
  input: `${SPHYNX_TOKEN_ADDRESS}`,
  isInput: true,
  routerVersion: 'sphynx',
  marketCapacity: 0,
  customChartType: localStorage.getItem(CHART_TYPE) ?? 2,
  connectedNetworkID: localStorage.getItem(CONNECTED_NETWORKID) ?? 56,
  quoteCurrency: WBNB_ADDRESS
}


export default createReducer<any>(initialState, (builder) =>
  builder
    .addCase(resetMintState, () => initialState)
    .addCase(typeInput, (state, { payload: { input } }) => {
      // they're typing into the field they've last typed in
      return {
        ...state,
        input,
      }

      // they're typing into a new field, store the other value
    })
    .addCase(setIsInput, (state, { payload: { isInput } }) => {
      return {
        ...state,
        isInput,
      }
    })
    .addCase(typeRouterVersion, (state, { payload: { routerVersion } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        routerVersion,
      }

      // they're typing into a new field, store the other value
    })
    .addCase(marketCap, (state, { payload: { marketCapacity } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        marketCapacity,
      }

      // they're typing into a new field, store the other value
    })
    .addCase(setCustomChartType, (state, { payload: { customChartType } }) => {
      // they're typing into the field they've last typed in

      localStorage.setItem(CHART_TYPE, customChartType.toString())
      return {
        ...state,
        customChartType,
      }
    })
    .addCase(setConnectedNetworkID, (state, { payload: { connectedNetworkID }}) => {

      localStorage.setItem(CONNECTED_NETWORKID, connectedNetworkID.toString())
      return {
        ...state,
        connectedNetworkID,
      }
    })
    .addCase(setSelectedQuoteCurrency, (state, { payload: { quoteCurrency }}) => {
      
      localStorage.setItem(QUOTE_CURRENCY, quoteCurrency)
      return {
        ...state,
        quoteCurrency
      }
    })
    ,
)
