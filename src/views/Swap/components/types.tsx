export interface HotTokenType {
  dexId: string
  contractAddress: string
  name: string
  symbol: string
  direction?: string
}

export interface TokenDetailProps {
  dexId?: string
  geckoId?: string
  name: string
  symbol: string
  contractAddress: string
  reddit?: string
  slack?: string
  twitter?: string
  facebook?: string
  telegram?: string
  website: string
  iconSmall: string
  iconLarge: string
  iconThumb: string
  price: number
  priceChange24H: number
  volumne24H: number
  liquidity: number
  totalSupply: number
  marketCap: number
  bnbLPHoldings: number
  bnbLPHoldingsUSD: number
  transactions: number
  holders: number
}

export interface HistoricalDataProps {
  time: number
  open: number
  high: number
  low: number
  close: number
}
