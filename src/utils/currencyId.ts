import { ChainId, Currency, ETHER, Token } from '@sphynxdex/sdk-multichain'

export function currencyId(currency: Currency): string {
  if (currency === ETHER[ChainId.MAINNET]) return 'BNB'
  if (currency === ETHER[ChainId.ETHEREUM]) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
