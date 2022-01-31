import { ChainId, Currency, CurrencyAmount, ETHER, Token, TokenAmount, WETH } from '@sphynxdex/sdk-multichain'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  const nativeKeys = Object.keys(ETHER)
  const nativeCurrencies = nativeKeys.map(key => ETHER[parseInt(key)])
  return chainId && nativeCurrencies.indexOf(currency) !== -1 ? WETH[chainId] : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined,
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WETH[token.chainId])) return ETHER[token.chainId]
  return token
}
