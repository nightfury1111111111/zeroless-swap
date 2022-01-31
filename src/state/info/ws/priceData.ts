import { Contract, utils } from 'ethers'
import { PANCAKE_FACTORY_ADDRESS, SPHYNX_FACTORY_ADDRESS } from '@sphynxdex/sdk-multichain'
import pancakeFactoryAbi from 'config/abi/pancakeSwapFactory.json'
import bscTokenAbi from 'config/abi/erc20.json'
import { ZERO_ADDRESS } from 'config/constants'

export interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: number
}

export const getMinTokenInfo = async (address, provider): Promise<TokenInfo> => {
  const tokenContract = new Contract(address, bscTokenAbi, provider)
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
