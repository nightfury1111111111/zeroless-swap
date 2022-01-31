import { createAction } from '@reduxjs/toolkit'

const autoSwap = createAction<{ swapFlag: boolean }>('flags/autoSwap')
const autoSlippage = createAction<{ autoSlippageFlag: boolean }>('flags/autoSlippage')

export {
    autoSwap,
    autoSlippage
}

export default autoSwap