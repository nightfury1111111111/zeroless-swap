import { CurrencyAmount, ETHER, JSBI } from '@sphynxdex/sdk-multichain'
import { MIN_BNB } from '../config/constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  const nativeKeys = Object.keys(ETHER)
  const nativeCurrencies = nativeKeys.map(key => ETHER[parseInt(key)])
  if (!currencyAmount) return undefined
  if (nativeCurrencies.indexOf(currencyAmount.currency) !== -1) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_BNB)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_BNB))
    }
    return CurrencyAmount.ether(JSBI.BigInt(0))
  }
  return currencyAmount
}

export default maxAmountSpend
