import { ChainId } from '@sphynxdex/sdk-multichain'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://bsc-dataseed1.defibit.io',
  [ChainId.TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  [ChainId.ETHEREUM]: 'https;//etherscan.io/',
  4: 'https://rinkeby.etherscan.io/',
}

export default NETWORK_URLS
