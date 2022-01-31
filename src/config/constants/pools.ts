import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: {
      1: tokens.sphynx,
      4: tokens.sphynx,
      56: tokens.sphynx,
      97: tokens.sphynx,
    },
    earningToken: {
      1: tokens.sphynx,
      4: tokens.sphynx,
      56: tokens.sphynx,
      97: tokens.sphynx,
    },
    contractAddress: {
      1: '0xf5938544429ED86A10e5F7F47daD0fE59DAB4c46',
      4: '0xB0CDD9B250433f60181AF3c7ccDeE8e579F9C2F7',
      97: '0xEE0C0E647d6E78d74C42E3747e0c38Cef41d6C88',
      56: '0x0a8ce75CDD9aa2e0C5f5B54626F1559B40098429',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '37.5',
    sortOrder: 1,
    isFinished: false,
  },
  // {
  //   sousId: 9,
  //   stakingToken: tokens.sphynx,
  //   earningToken: tokens.adamant,
  //   contractAddress: {
  //     97: '0xfdbccb150c4f546ae0f8832c3c63ef15b1ea99ec',
  //     56: '0xe21223d8ab6a808bb3886b85d97c4d15b4601a53',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   sortOrder: 999,
  //   tokenPerBlock: '10',
  // }
  // ,
  // {
  //   sousId: 10,
  //   stakingToken: tokens.sphynx,
  //   earningToken: tokens.old,
  //   contractAddress: {
  //     97: '0xfdbccb150c4f546ae0f8832c3c63ef15b1ea99ec',
  //     56: '0x3833b14b8D86CE71Ab2413386F0BdDE4b3125b8D',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   sortOrder: 999,
  //   tokenPerBlock: '10',
  // }
]

export default pools
