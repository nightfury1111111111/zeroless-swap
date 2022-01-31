import Web3 from 'web3'
import * as ethers from 'ethers'
import { Contract, utils } from 'ethers'
import { PANCAKE_FACTORY_ADDRESS, SPHYNX_FACTORY_ADDRESS, UNISWAP_FACTORY_ADDRESS, SPHYNX_ETH_FACTORY_ADDRESS, ChainId } from '@sphynxdex/sdk-multichain'
import pancakeFactoryAbi from 'config/abi/pancakeSwapFactory.json'
import tokenAbi from 'config/abi/erc20.json'
import { PANCAKE_ROUTER_ADDRESS, ROUTER_ADDRESS, SPHYNX_TOKEN_ADDRESS, ZERO_ADDRESS } from 'config/constants'
import routerABI from 'assets/abis/pancakeRouter.json'
import { web3Provider, ethWeb3Provider, simpleRpcProvider, simpleRpcETHProvider } from './providers'

const routerAbi: any = routerABI
const bnbWeb3 = new Web3(web3Provider)
const pancakeRouterContract = new bnbWeb3.eth.Contract(routerAbi, PANCAKE_ROUTER_ADDRESS)
const sphynxRouterContract = new bnbWeb3.eth.Contract(routerAbi, ROUTER_ADDRESS)

const busdAddr = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const wBNBAddr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

const ethWeb3 = new Web3(ethWeb3Provider)
const uniV2: any = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const uniRouterContract = new ethWeb3.eth.Contract(routerAbi, uniV2)
const daiAddr = '0x6b175474e89094c44da98b954eedeac495271d0f'
const wETHAddr = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

export const getBNBPrice: any = () => {
  return new Promise((resolve) => {
    const path = [wBNBAddr, busdAddr]
    pancakeRouterContract.methods
      .getAmountsOut(bnbWeb3.utils.toBN(1 * 10 ** 18), path)
      .call()
      .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
  })
}

export const getETHPrice: any = () => {
  return new Promise((resolve) => {
    const path = [wETHAddr, daiAddr]
    uniRouterContract.methods
      .getAmountsOut(ethWeb3.utils.toBN(1 * 10 ** 18), path)
      .call()
      .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
  })
}

export const getTokenPrice: any = async (tokenAddress) => {
  return new Promise((resolve) => {
    if (tokenAddress === wBNBAddr) {
      const path = [wBNBAddr, busdAddr]
      const routerContract = SPHYNX_TOKEN_ADDRESS === tokenAddress ? sphynxRouterContract : pancakeRouterContract
      routerContract.methods
        .getAmountsOut(bnbWeb3.utils.toBN(1 * 10 ** 18), path)
        .call()
        .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
    } else {
      const path = [tokenAddress, wBNBAddr, busdAddr]
      const routerContract = SPHYNX_TOKEN_ADDRESS === tokenAddress ? sphynxRouterContract : pancakeRouterContract
      const tokenContract = new Contract(tokenAddress, tokenAbi, simpleRpcProvider)
      tokenContract.decimals()
      .then((result) => {
        routerContract.methods
        .getAmountsOut(bnbWeb3.utils.toBN(1 * 10 ** result), path)
        .call()
        .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
      })
    }
  })
}

export const getTokenPriceETH: any = (tokenAddress) => {
  return new Promise((resolve) => {
    if (tokenAddress === wETHAddr) {
      const path = [wETHAddr, daiAddr]
      const routerContract = uniRouterContract
      routerContract.methods
        .getAmountsOut(ethWeb3.utils.toBN(1 * 10 ** 18), path)
        .call()
        .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
    } else {
      const path = [tokenAddress, wETHAddr, daiAddr]
      const routerContract = uniRouterContract
      const tokenContract = new Contract(tokenAddress, tokenAbi, simpleRpcETHProvider)
      tokenContract.decimals()
      .then((result) => {
        routerContract.methods
        .getAmountsOut(bnbWeb3.utils.toBN(1 * 10 ** result), path)
        .call()
        .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
      })
    }
  })
}

export interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: number
}

export const getMinTokenInfo = async (address, provider): Promise<TokenInfo> => {
  const tokenContract = new Contract(address, tokenAbi, provider)
  try {
    const decimals = await tokenContract.decimals()
    const name = await tokenContract.name()
    const symbol = await tokenContract.symbol()
    const totalSupply = await tokenContract.totalSupply()
    const tokenInfo = {
      name,
      symbol,
      decimals,
      totalSupply: parseInt(utils.formatUnits(totalSupply, decimals)),
    }
    return tokenInfo
  } catch (e) {
    return null
  }
}

export const getSphynxPairAddress = async (quoteToken, baseToken, provider, chainId) => {
  const factoryAddress = chainId === ChainId.MAINNET ? SPHYNX_FACTORY_ADDRESS : SPHYNX_ETH_FACTORY_ADDRESS
  const sphynxFactoryContract = new Contract(factoryAddress, pancakeFactoryAbi, provider)
  const pairAddress = await sphynxFactoryContract.getPair(quoteToken, baseToken)
  if (pairAddress === ZERO_ADDRESS) {
    return null
  }
  return pairAddress
}

export const getPancakePairAddress = async (quoteToken, baseToken, provider, chainId) => {
  if (chainId === ChainId.MAINNET) {
    const pancakeFactoryContract = new Contract(PANCAKE_FACTORY_ADDRESS, pancakeFactoryAbi, provider)
    const pairAddress = await pancakeFactoryContract.getPair(quoteToken, baseToken)
    if (pairAddress === ZERO_ADDRESS) {
      return null
    }
    return pairAddress
  }

  if (chainId === ChainId.ETHEREUM) {
    const uniswapFactoryContract = new Contract(UNISWAP_FACTORY_ADDRESS, pancakeFactoryAbi, provider)
    const pairAddress = await uniswapFactoryContract.getPair(quoteToken, baseToken)
    if (pairAddress === ZERO_ADDRESS) {
      return null
    }
    return pairAddress
  }

  return null
}

export const getPancakePairAddressV1 = async (quoteToken, baseToken, provider) => {
  const pancakeFactoryContract = new Contract('0xbcfccbde45ce874adcb698cc183debcf17952812', pancakeFactoryAbi, provider)
  const pairAddress = await pancakeFactoryContract.getPair(quoteToken, baseToken)
  if (pairAddress === ZERO_ADDRESS) {
    return null
  }
  return pairAddress
}

