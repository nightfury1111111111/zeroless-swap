import { ChainId } from '@sphynxdex/sdk-multichain'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address, defaultChainId = null): string => {
  if(defaultChainId === null) {
    const chainId = parseInt(window?.ethereum?.networkVersion || window?.trustwallet?.Provider?.chainId)
    return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
  } 
  return address[defaultChainId] ? address[defaultChainId] : ''
}

export const getCakeAddress = (chainId = 56) => {
  return getAddress(tokens.sphynx.address, chainId)
}
export const getSphynxAddress = (chainId = 56) => {
  return getAddress(tokens.sphynx.address, chainId)
}
export const getMasterChefAddress = (chainId = 56) => {
  return getAddress(addresses.masterChef, chainId)
}
export const getBondAddress = (chainId = 56) => {
  return getAddress(addresses.bond, chainId)
}
export const getBondTellerAddress = (chainId = 56) => {
  return getAddress(addresses.bondTeller, chainId)
}
export const getBondCalculatorAddress = (chainId = 56) => {
  return getAddress(addresses.bondCalculator, chainId)
}
export const getBondRedeemHelperAddress = (chainId = 56) => {
  return getAddress(addresses.bondRedeemHelper, chainId)
}
export const getBondTreasuryAddress = (chainId = 56) => {
  return getAddress(addresses.bondTreasury, chainId)
}
export const getBondStakingAddress = (chainId = 56) => {
  return getAddress(addresses.bondStaking, chainId)
}
export const getBondAuthorityAddress = (chainId = 56) => {
  return getAddress(addresses.bondAuthority, chainId)
}
export const getMulticallAddress = (chainId = 56) => {
  return getAddress(addresses.multiCall, chainId)
}
export const getWbnbAddress = (chainId = 56) => {
  return getAddress(tokens.wbnb.address, chainId)
}
export const getLotteryV2Address = (chainId = 56) => {
  return getAddress(addresses.lotteryV2, chainId)
}
export const getPancakeProfileAddress = (chainId = 56) => {
  return getAddress(addresses.pancakeProfile, chainId)
}
export const getPancakeRabbitsAddress = (chainId = 56) => {
  return getAddress(addresses.pancakeRabbits, chainId)
}
export const getBunnyFactoryAddress = (chainId = 56) => {
  return getAddress(addresses.bunnyFactory, chainId)
}
export const getClaimRefundAddress = (chainId = 56) => {
  return getAddress(addresses.claimRefund, chainId)
}
export const getPointCenterIfoAddress = (chainId = 56) => {
  return getAddress(addresses.pointCenterIfo, chainId)
}
export const getBunnySpecialAddress = (chainId = 56) => {
  return getAddress(addresses.bunnySpecial, chainId)
}
export const getTradingCompetitionAddress = (chainId = 56) => {
  return getAddress(addresses.tradingCompetition, chainId)
}
export const getEasterNftAddress = (chainId = 56) => {
  return getAddress(addresses.easterNft, chainId)
}
export const getCakeVaultAddress = (chainId = 56) => {
  return getAddress(addresses.cakeVault, chainId)
}
export const getPredictionsAddress = (chainId = 56) => {
  return getAddress(addresses.predictions, chainId)
}
export const getChainlinkOracleAddress = (chainId = 56) => {
  return getAddress(addresses.chainlinkOracle, chainId)
}
export const getBunnySpecialCakeVaultAddress = (chainId = 56) => {
  return getAddress(addresses.bunnySpecialCakeVault, chainId)
}
export const getBunnySpecialPredictionAddress = (chainId = 56) => {
  return getAddress(addresses.bunnySpecialPrediction, chainId)
}
export const getFarmAuctionAddress = (chainId = 56) => {
  return getAddress(addresses.farmAuction, chainId)
}
export const getPresaleAddress = (chainId = 56) => {
  return getAddress(addresses.presale, chainId)
}
export const getSphynxRouterAddress = (chainId = 56) => {
  return getAddress(addresses.sphynxRouter, chainId)
}
export const getRouterAddress = (chainId = 56) => {
  return getAddress(addresses.pancakeRouter, chainId)
}
export const getLockerAddress = (chainId = 56) => {
  return getAddress(addresses.locker, chainId)
}
export const getFairLaunchAddress = (chainId = 56) => {
  return getAddress(addresses.fairLaunch, chainId)
}
export const getLimitOrderAddress = (chainId = 56) => {
  return getAddress(addresses.limitOrder, chainId)
}
