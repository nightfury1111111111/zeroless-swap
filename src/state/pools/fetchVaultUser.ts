import BigNumber from 'bignumber.js'
import { getCakeVaultContract } from 'utils/contractHelpers'
import { getProvider } from 'utils/providers'


const fetchVaultUser = async (account: string, chainId: number) => {
  try {
    const cakeVaultContract = getCakeVaultContract(getProvider(chainId), chainId)
    const userContractResponse = await cakeVaultContract.userInfo(account)
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      cakeAtLastUserAction: new BigNumber(userContractResponse.sphynxAtLastUserAction.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
    }
  }
}

export default fetchVaultUser
