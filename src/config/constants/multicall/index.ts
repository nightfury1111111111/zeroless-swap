import { ChainId } from '@sphynxdex/sdk-multichain'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [ChainId.TESTNET]: '0x301907b5835a2d723Fe3e9E8C5Bc5375d5c1236A',
  [ChainId.ETHEREUM]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  4: '0x6De8183B092b4d11948FB77DdF3ce6e972084DF7',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
