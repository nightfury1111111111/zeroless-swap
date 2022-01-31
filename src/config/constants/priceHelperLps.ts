import tokens from './tokens'
import { FarmConfig } from './types'

const priceHelperLps: FarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absense of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  {
    pid: null,
    lpSymbol: {
      1: 'QSD-BNB LP',
      4: 'QSD-BNB LP',
      56: 'QSD-BNB LP',
      97: 'QSD-BNB LP',
    },
    lpAddresses: {
      1: '',
      4: '0x7b3ae32eE8C532016f3E31C8941D937c59e055B9',
      97: '',
      56: '0x7b3ae32eE8C532016f3E31C8941D937c59e055B9',
    },
    token: {
      1: tokens.qsd,
      4: tokens.qsd,
      97: tokens.qsd,
      56: tokens.qsd,
    },
    quoteToken: {
      1: tokens.weth,
      4: tokens.weth,
      56: tokens.wbnb,
      97: tokens.wbnb,
    }
  },
]

export default priceHelperLps
