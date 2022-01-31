import { createAction } from '@reduxjs/toolkit'

export enum Field {
  BRIDGE_TOKENSPX = 'BRIDGE_TOKENSPX',
  BRIDGE_TOKENOTH = 'BRIDGE_TOKENOTH',
}

export const typeInput = createAction<{ field: Field; typedValue: string}>('bridge/typeInput')
export const othTypeInput = createAction<{ field: Field; othTypedValue: string}>('bridge/othTypeInput')
export const resetBridgeState = createAction<void>('bridge/resetBridgeState')
