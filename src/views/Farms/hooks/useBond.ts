import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { useBond, useBondStaking, useBondTeller } from 'hooks/useContract'

const useBondHooks = () => {
  const bondContract = useBond()
  const { chainId } = useActiveWeb3React()  
}

export default useBond;
