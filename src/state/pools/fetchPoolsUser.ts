import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getMasterchefContract } from 'utils/contractHelpers'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider, getProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonMasterPools = poolsConfig.filter((p) => p.sousId !== 0)

export const fetchPoolsAllowance = async (account, chainId) => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingToken[chainId].symbol !== 'BNB')
  const calls = nonBnbPools.map((p) => ({
    address: getAddress(p.stakingToken[chainId].address, chainId),
    name: 'allowance',
    params: [account, getAddress(p.contractAddress, chainId)],
  }))

  const allowances = await multicall(erc20ABI, calls, chainId)
  return nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account, chainId) => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingToken[chainId].symbol !== 'BNB')
  const bnbPools = poolsConfig.filter((p) => p.stakingToken[chainId].symbol === 'BNB')
  // Non BNB pools
  const calls = nonBnbPools.map((p) => ({
    address: getAddress(p.stakingToken[chainId].address, chainId),
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls, chainId)
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  // BNB pools
  const bnbBalance = await getProvider(chainId).getBalance(account)
  const bnbBalances = bnbPools.reduce(
    (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance.toString()).toJSON() }),
    {},
  )

  return { ...tokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account, chainId) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress, chainId),
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(sousChefABI, calls, chainId)
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  const masterChefContract = getMasterchefContract(getProvider(chainId), chainId)
  // Cake / Cake pool
  const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount.toString()).toJSON() }
}

export const fetchUserPendingRewards = async (account, chainId) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress, chainId),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(sousChefABI, calls, chainId)
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  const masterChefContract = getMasterchefContract(getProvider(chainId), chainId)
  // Cake / Cake pool
  const pendingReward = await masterChefContract.pendingSphynx('0', account)

  return { ...pendingRewards, 0: new BigNumber(pendingReward.toString()).toJSON() }
}
