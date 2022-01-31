import Web3 from 'web3'
import { RouterType, SPHYNX_FACTORY_ADDRESS } from '@sphynxdex/sdk-multichain'
import { AbiItem } from 'web3-utils'
import { web3Provider } from './providers'
import factoryAbi from '../config/abi/factoryAbi.json'
import factoryV1Abi from '../config/abi/factoryV1.json'

const web3 = new Web3(web3Provider)

const getVersion = async (address: string, routerVersion: string) => {
  try {
    const wbnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

    const factoryAddress =
      routerVersion === RouterType.sphynx
        ? SPHYNX_FACTORY_ADDRESS
        : routerVersion === 'Pancake v1'
        ? '0xBCfCcbde45cE874adCB698cC183deBcF17952812'
        : '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
    const factory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress)
    const pair = await factory.methods.getPair(address, wbnbAddress).call()

    if(!pair) {
      return { status: false, version: '', pairAddress: '' }  
    }

    return { status: true, version: routerVersion, pairAddress: pair }
  } catch (error) {
    return { status: false, version: '', pairAddress: '' }
  }
}

const getVersion1 = async (address) => {
  try {
    const wbnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

    const factoryv1 = new web3.eth.Contract(factoryV1Abi as AbiItem[], '0xBCfCcbde45cE874adCB698cC183deBcF17952812')

    const v1Pair = await factoryv1.methods.getPair(address, wbnbAddress).call()

    if (!v1Pair) {
      return { status: false, version: '', pairAddress: '' }
    }

    const version = 'Pancake v1'
    const pairAddress = v1Pair

    return { status: true, version, pairAddress }
  } catch (error) {
    return { status: false, version: '', pairAddress: '' }
  }
}

export { getVersion, getVersion1 }
