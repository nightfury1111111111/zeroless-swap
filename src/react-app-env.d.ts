/// <reference types="react-scripts" />

interface Window {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => Promise<void>
    networkVersion?: string
    isTrust?: any
  }
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
  }
  trustwallet?: {
    Provider?: {
      chainId: any
      request?: any
      networkVersion?: string
    }
  }
  TradingView?: any
  tvWidget?: any
  web3?: any
}
