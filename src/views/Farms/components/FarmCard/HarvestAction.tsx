import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button, Flex, Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import useToast from 'hooks/useToast'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { DarkButtonStyle } from 'style/buttonStyle'
import useHarvestFarm from '../../hooks/useHarvestFarm'

const UnderLineFlex = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.custom.divider};
  padding: 9px 0;
`

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid }) => {
  const { account, chainId } = useActiveWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvestFarm(pid)
  const dispatch = useAppDispatch()
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)

  const handleHarvest = async () => {
    setPendingTx(true)
    try {
      await onReward()
      toastSuccess(
        `${t('Harvested')}!`,
        t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'SPHYNX' }),
      )
    } catch (e) {
      toastError(
        t('Error'),
        t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
      )
      console.error(e)
    } finally {
      setPendingTx(false)
    }
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
  }

  return (
    <UnderLineFlex mb="8px" justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Text fontSize="14px" color='white'>{displayBalance}</Text>
        {/* {earningsBusd > 0 && (
          <Balance fontSize="14px" color="white" decimals={3} value={earningsBusd} prefix="$" />
        )}  */}
      </Flex>
      <Button
        disabled={rawEarningsBalance.eq(0) || pendingTx}
        onClick={handleHarvest}
        style={DarkButtonStyle}
      >
        {t('Harvest')}
      </Button>
    </UnderLineFlex>
  )
}

export default HarvestAction
