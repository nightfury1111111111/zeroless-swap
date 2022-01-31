export const messages = {
    SWAP_TRANSACTION_ERROR: "The transaction cannot succeed due to error",
    SLIPPAGE_ISSUE: "Please increase Slippage Tolerance percent.",
}

export const methods = {
    SWAP_ETH_NO_FEE: "swapETHForExactTokens",
    SWAP_ETH_USE_FEE: "swapExactETHForTokensSupportingFeeOnTransferTokens",
    SWAP_TOKEN_NO_FEE: "swapExactTokensForETH",
    SWAP_TOKEN_USE_FEE: "swapExactTokensForETHSupportingFeeOnTransferTokens"
}

const SwapRouter = {
    AUTO_SWAP: 0,
    SPHYNX_SWAP: 1,
    PANCAKE_SWAP: 2,
    UNI_SWAP:3,
    SPHYNX_ETH_SWAP:4,
}

export default SwapRouter