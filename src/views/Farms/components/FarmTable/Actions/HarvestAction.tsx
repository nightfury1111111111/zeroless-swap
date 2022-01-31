import React, { useState } from 'react'
import { Button, Skeleton } from '@sphynxdex/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceCakeBusd } from 'state/farms/hooks'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useHarvestFarm from '../../../hooks/useHarvestFarm'

export const HarvestActionContainer = styled.div`
  padding: 16px;
  flex-grow: 1;
  flex-basis: 0;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    height: 130px;
    max-height: 130px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 0;
    height: 130px;
    max-height: 130px;
  }
`

const DarkButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.tertiary};
  width: 82px;
  outline: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 130px;
  }

  &:disabled {
    // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
    background: ${({ theme }) => theme.custom.tertiary};
  }
`

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({ pid, userData, userDataReady }) => {
  const { toastSuccess, toastError } = useToast()
  const earningsBigNumber = new BigNumber(userData.earnings)
  const { account, chainId } = useActiveWeb3React()
  const cakePrice = usePriceCakeBusd(chainId)
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber)
    earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
    displayBalance = earnings.toFixed(3, BigNumber.ROUND_DOWN)
  }

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvestFarm(pid)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleHarvest = async () => {
    setPendingTx(true)
    try {
      await onReward()
      toastSuccess(
        `${t('Harvested')}!`,
        t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'SPHYNX' }),
      )
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(e)
    } finally {
      setPendingTx(false)
    }
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
  }

  return (
    <HarvestActionContainer>
      <DarkButton disabled={earnings.eq(0) || pendingTx || !userDataReady} onClick={handleHarvest}>
        {t('Harvest')}
      </DarkButton>
    </HarvestActionContainer>
  )
}

export default HarvestAction
