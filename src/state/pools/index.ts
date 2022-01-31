import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import { BIG_ZERO } from 'utils/bigNumber'
import { PoolsState, Pool, CakeVault, VaultFees, VaultUser, AppThunk } from 'state/types'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import { getTokenPrice } from 'utils/priceProvider'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { fetchPoolsBlockLimits, fetchPoolsStakingLimits, fetchPoolsTotalStaking } from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchPoolsUser'
import { fetchPublicVaultData, fetchVaultFees } from './fetchVaultPublic'
import fetchVaultUser from './fetchVaultUser'
import { getTokenPricesFromFarm } from './helpers'
import fetchTokenPerBlock from './fetchTokenPerBlock'

const initialState: PoolsState = {
  data: [...poolsConfig],
  userDataLoaded: false,
  cakeVault: {
    totalShares: null,
    pricePerFullShare: null,
    totalCakeInVault: null,
    estimatedCakeBountyReward: null,
    totalPendingCakeHarvest: null,
    fees: {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    },
    userData: {
      isLoading: true,
      userShares: null,
      cakeAtLastUserAction: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
    },
  },
}

export const fetchCakeVaultPublicData = createAsyncThunk<CakeVault, {chainId: number}>('cakeVault/fetchPublicData', async (chainId) => {
  const publicVaultInfo = await fetchPublicVaultData(chainId.chainId)
  return publicVaultInfo
})

export const fetchCakeVaultFees = createAsyncThunk<VaultFees>('cakeVault/fetchFees', async (chainId) => {
  const vaultFees = await fetchVaultFees(chainId)
  return vaultFees
})

export const fetchCakeVaultUserData = createAsyncThunk<VaultUser, { account: string, chainId: number }>(
  'cakeVault/fetchUser',
  async ({ account, chainId }) => {
    const userData = await fetchVaultUser(account, chainId)
    return userData
  },
)

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setPoolsPublicData: (state, action) => {
      const livePoolsData: Pool[] = action.payload
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    },
    setPoolsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, userData: userPoolData }
      })
      state.userDataLoaded = true
    },
    updatePoolsUserData: (state, action) => {
      const { field, value, sousId } = action.payload
      const index = state.data.findIndex((p) => p.sousId === sousId)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  },
  extraReducers: (builder) => {
    // Vault public data that updates frequently
    builder.addCase(fetchCakeVaultPublicData.fulfilled, (state, action: PayloadAction<CakeVault>) => {
      state.cakeVault = { ...state.cakeVault, ...action.payload }
    })
    // Vault fees
    builder.addCase(fetchCakeVaultFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
      const fees = action.payload
      state.cakeVault = { ...state.cakeVault, fees }
    })
    // Vault user data
    builder.addCase(fetchCakeVaultUserData.fulfilled, (state, action: PayloadAction<VaultUser>) => {
      const userData = action.payload
      userData.isLoading = false
      state.cakeVault = { ...state.cakeVault, userData }
    })
  },
})

// Actions
export const { setPoolsPublicData, setPoolsUserData, updatePoolsUserData } = PoolsSlice.actions

export const updateUserAllowance =
  (sousId: number, account: string, chainId: ChainId): AppThunk =>
    async (dispatch) => {
      const allowances = await fetchPoolsAllowance(account, chainId)
      dispatch(updatePoolsUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
    }

export const updateUserBalance =
  (sousId: number, account: string, chainId: ChainId): AppThunk =>
    async (dispatch) => {
      const tokenBalances = await fetchUserBalances(account, chainId)
      dispatch(updatePoolsUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
    }

export const updateUserStakedBalance =
  (sousId: number, account: string, chainId: ChainId): AppThunk =>
    async (dispatch) => {
      const stakedBalances = await fetchUserStakeBalances(account, chainId)
      dispatch(updatePoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
    }

export const updateUserPendingReward =
  (sousId: number, account: string, chainId: ChainId): AppThunk =>
    async (dispatch) => {
      const pendingRewards = await fetchUserPendingRewards(account, chainId)
      dispatch(updatePoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
    }

export const fetchPoolsUserDataAsync =
  (account: string, chainId: ChainId): AppThunk =>
    async (dispatch) => {
      const allowances = await fetchPoolsAllowance(account, chainId)
      const stakingTokenBalances = await fetchUserBalances(account, chainId)
      const stakedBalances = await fetchUserStakeBalances(account, chainId)
      const pendingRewards = await fetchUserPendingRewards(account, chainId)

      const userData = poolsConfig.map((pool) => ({
        sousId: pool.sousId,
        allowance: allowances[pool.sousId],
        stakingTokenBalance: stakingTokenBalances[pool.sousId],
        stakedBalance: stakedBalances[pool.sousId],
        pendingReward: pendingRewards[pool.sousId],
      }))

      dispatch(setPoolsUserData(userData))
    }

// Thunks
export const fetchPoolsPublicDataAsync = (currentBlock: number, chainId: ChainId) => async (dispatch, getState) => {
  const index = chainId === undefined ? ChainId.MAINNET : chainId
  const blockLimits = await fetchPoolsBlockLimits(chainId)
  const totalStakings = await fetchPoolsTotalStaking(index)
  const prices = getTokenPricesFromFarm(getState().farms.data, index)

  const liveData = await Promise.all(poolsConfig.map(async (pool) => {
    const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
    const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
    const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
    const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

    const stakingTokenAddress = pool.stakingToken[index].address ? getAddress(pool.stakingToken[index].address, chainId).toLowerCase() : null
    const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

    const earningTokenAddress = pool.earningToken[index].address ? getAddress(pool.earningToken[index].address, chainId).toLowerCase() : null
    const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
    const earningTokenPrice1 = earningTokenPrice === undefined ? await getTokenPrice(earningTokenAddress) : earningTokenPrice
    const tokenPerBlock = pool.sousId === 0 ? await fetchTokenPerBlock(pool.sousId, chainId) : parseFloat(pool.tokenPerBlock)

    const apr = !isPoolFinished
      ? getPoolApr(
        stakingTokenPrice,
        earningTokenPrice,
        getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken[index].decimals),
        tokenPerBlock,
      )
      : 0

    return {
      ...blockLimit,
      ...totalStaking,
      stakingTokenPrice,
      earningTokenPrice,
      apr,
      isFinished: isPoolFinished,
    }
  }))

  dispatch(setPoolsPublicData(liveData))
}

export const fetchPoolsStakingLimitsAsync = (chainId: ChainId) => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool) => pool.sousId)

  const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit, chainId)

  const stakingLimitData = poolsConfig.map((pool) => {
    if (poolsWithStakingLimit.includes(pool.sousId)) {
      return { sousId: pool.sousId }
    }
    const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO
    return {
      sousId: pool.sousId,
      stakingLimit: stakingLimit.toJSON(),
    }
  })

  dispatch(setPoolsPublicData(stakingLimitData))
}

export default PoolsSlice.reducer
