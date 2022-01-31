import { createAction } from '@reduxjs/toolkit'

export interface Field {
  input: ''
  typeRouterVersion: 'v1'
  type: 'INPUT_ADDRESS'
  setCustomChartType: 1
  connectedNetworkID: 0
}

export const typeInput = createAction<{ input: string }>('input/typeInput')
export const setIsInput = createAction<{ isInput: boolean }>('input/setIsInput')
export const typeRouterVersion = createAction<{ routerVersion: string }>('input/typeRouterVersion')
export const resetMintState = createAction<void>('input/resetState')
export const marketCap = createAction<{ marketCapacity: number }>('input/marketCap')
export const setCustomChartType = createAction<{ customChartType: number }>('input/setCustomChartType')
export const setConnectedNetworkID = createAction<{ connectedNetworkID: number}>('input/setConnectedNetworkID')
export const setSelectedQuoteCurrency = createAction<{quoteCurrency: string}>('input/setSelectedQuoteCurrency')
