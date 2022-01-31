import tokens from './tokens'
import { FarmConfig } from './types'
/**
 * These 3 farms (PID 0, 1, 2) should always be at the top of the file.
 */
const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: {
      1: 'SPHYNX',
      4: 'SPHYNX',
      56: 'SPHYNX',
      97: 'SPHYNX',
    },
    lpAddresses: {
      1: '0x94DFd4E2210Fa5B752c3CD0f381edad9dA6640f8',
      4: '0x136f2A310a959744956Fa9a977BCD8E21D62c15e',
      97: '0x1b318e1C45147e8c4834d16BBed4c9994cf76f86',
      56: '0xe64972C311840cFaf2267DCfD365571F9D9544d9',
    },
    token: {
      1: tokens.syrup,
      4: tokens.syrup,
      56: tokens.syrup,
      97: tokens.syrup,
    }
    ,
    quoteToken: {
      1: tokens.weth,
      4: tokens.weth,
      56: tokens.wbnb,
      97: tokens.wbnb,
    },
  },
  {
    pid: 1,
    lpSymbol: {
      1: 'SPHYNX-ETH LP',
      4: 'SPHYNX-USDC LP',
      56: 'SPHYNX-BNB LP',
      97: 'SPHYNX-BNB LP',
    },
    lpAddresses: {
      1: '0x7b97066F9A251ce985b9321bDB62D39012BCfF33',
      4: '0x6e4A019757ECE11f65d6b675A7610738E0447411',
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x11c8C80878EcF44E1B7c4E87A1E7FB796C21E377',
    },
    token: {
      1: tokens.sphynx,
      4: tokens.sphynx,
      56: tokens.sphynx,
      97: tokens.sphynx,
    },
    quoteToken: {
      1: tokens.weth,
      4: tokens.usdc,
      56: tokens.wbnb,
      97: tokens.wbnb,
    },
  },
  {
    pid: 2,
    lpSymbol: {
      1: 'SPHYNX-USDC LP',
      4: 'SPHYNX-USDC LP',
      56: 'SPHYNX-BUSD LP',
      97: 'SPHYNX-BUSD LP',
    },
    lpAddresses: {
      1: '',
      4: '',
      97: '',
      56: '0x4317ADe8b8E184801E3fa3CaF13d3f55A3d8aF1c',
    },
    token: {
      1: tokens.sphynx,
      4: tokens.sphynx,
      56: tokens.sphynx,
      97: tokens.sphynx,
    },
    quoteToken: {
      1: tokens.usdc,
      4: tokens.usdc,
      56: tokens.busd,
      97: tokens.busd,
    },
  },
]

export default farms
