import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { abi as ISphynxRouter02 } from '@sphynxswap/swap-periphery/build/ISphynxRouter02.json'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER, RouterType } from '@sphynxdex/sdk-multichain'
import { ROUTER_ADDRESS, PANCAKE_ROUTER_ADDRESS, UNISWAP_ROUTER_ADDRESS, ROUTER_ETH_ADDRESS } from '../config/constants'
import { BASE_BSC_SCAN_URLS } from '../config'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getBscScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainId: ChainId = ChainId.MAINNET,
): string {
  switch (type) {
    case 'transaction': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/token/${data}`
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/${data}`
    }
    case 'countdown': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/countdown/${data}`
    }
    default: {
      return `${BASE_BSC_SCAN_URLS[chainId]}/address/${data}`
    }
  }
}


// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// account is optional
export function getRouterContract(
  routerType: RouterType,
  _: number,
  library: Web3Provider,
  account?: string,
): Contract {
  if (routerType === RouterType.pancake) {
    return getContract(PANCAKE_ROUTER_ADDRESS, ISphynxRouter02, library, account)
  }
  if (routerType === RouterType.uniswap) {
    return getContract(UNISWAP_ROUTER_ADDRESS, ISphynxRouter02, library, account)
  }
  if (routerType === RouterType.sphynxeth) {
    return getContract(ROUTER_ETH_ADDRESS, ISphynxRouter02, library, account)
  }
  return getContract(ROUTER_ADDRESS, ISphynxRouter02, library, account) // todo
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: any, currency?: Currency): boolean {
  const nativeKeys = Object.keys(ETHER)
  const nativeCurrencies = nativeKeys.map(key => ETHER[parseInt(key)])
  if (nativeCurrencies.indexOf(currency) !== -1) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

export function reverseString(str) {
  const splitString = str.split("");
  const reverseArray = splitString.reverse();
  const joinArray = reverseArray.join("");
  return joinArray;
}

export function formatPrice (num: number, defaultFixed: number) {
  const formatNumber = num.toFixed(defaultFixed);
  if (Number(formatNumber) === 0) {
    const found = Array.from(convertNumberToString(num), Number).findIndex(e => Number(e) > 0)
    return found < 0 ? 0 : Number(num).toFixed(found);
  }
  return formatNumber;
}

export function numberWithCommas(num: number) {
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function convertNumberToString (n) {
  const sign = +n < 0 ? '-' : ''
  const toStr = n.toString()
  if (!/e/i.test(toStr)) {
    return n;
  }
  const [lead, decimal, pow] = n.toString()
    .replace(/^-/, '')
    .replace(/^([0-9]+)(e.*)/, '$1.$2')
    .split(/[e.]/)
  return +pow < 0
    ? `${sign}0.${"0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0))}${lead}${decimal}`
    : sign + lead + (+pow >= decimal.length ? (decimal + "0".repeat(Math.max(+pow-decimal.length || 0, 0))) : (`${decimal.slice(0, +pow)}.${decimal.slice(+pow)}`))
}
