import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@sphynxdex/sdk-multichain'
import useToast from 'hooks/useToast'

const useWithdrawalFeeTimer = (lastDepositedTime: number, userShares: BigNumber, withdrawalFeePeriod = 259200) => {
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const [hasUnstakingFee, setHasUnstakingFee] = useState(false)
  const [currentSeconds, setCurrentSeconds] = useState(Math.floor(Date.now() / 1000))
  const { chainId } = useActiveWeb3React()
  const { toastError } = useToast()

  useEffect(() => {
    const feeEndTime = lastDepositedTime + withdrawalFeePeriod
    const secondsRemainingCalc = feeEndTime - currentSeconds
    const doesUnstakingFeeApply = userShares.gt(0) && secondsRemainingCalc > 0

    const tick = () => {
      setCurrentSeconds((prevSeconds) => prevSeconds + 1)
    }
    const timerInterval = setInterval(() => tick(), 1000)
    if (doesUnstakingFeeApply) {
      setSecondsRemaining(secondsRemainingCalc)
      setHasUnstakingFee(true)
    } else {
      setHasUnstakingFee(false)
      clearInterval(timerInterval)
    }

    return () => clearInterval(timerInterval)
  }, [lastDepositedTime, withdrawalFeePeriod, setSecondsRemaining, currentSeconds, userShares])

  if(chainId !== ChainId.MAINNET && chainId !== ChainId.ETHEREUM && chainId !== 4) {
    return {}
  }

  return { hasUnstakingFee, secondsRemaining }
}

export default useWithdrawalFeeTimer
