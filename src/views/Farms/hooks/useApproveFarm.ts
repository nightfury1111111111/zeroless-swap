import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { useMasterchef } from 'hooks/useContract'

const useApproveFarm = (lpContract: Contract) => {
  const { chainId } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const handleApprove = useCallback(async () => {
    try {
      const tx = await lpContract.approve(masterChefContract.address, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      return receipt.status
    } catch (e) {
      return false
    }
  }, [lpContract, masterChefContract])

  if(chainId !== ChainId.MAINNET && chainId !== ChainId.ETHEREUM && chainId !== 4) {
    return { onApprove: () => false }
  }

  return { onApprove: handleApprove }
}

export default useApproveFarm
