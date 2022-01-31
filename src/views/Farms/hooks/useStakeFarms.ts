import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { useMasterchef } from 'hooks/useContract'

const useStakeFarms = (pid: number) => {
  const { chainId } = useActiveWeb3React()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stakeFarm(masterChefContract, pid, amount)
      console.info(txHash)
    },
    [masterChefContract, pid],
  )

  if(chainId !== ChainId.MAINNET && chainId !== ChainId.ETHEREUM && chainId !== 4) {
    return { onStake: () => false }
  }

  return { onStake: handleStake }
}

export default useStakeFarms
