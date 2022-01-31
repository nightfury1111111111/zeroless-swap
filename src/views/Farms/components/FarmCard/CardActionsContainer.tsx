import React, { useState, useCallback } from 'react'
import styled, { useTheme } from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Text } from '@sphynxdex/uikit'
import { getAddress } from 'utils/addressHelpers'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ColorButtonStyle } from 'style/buttonStyle'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'
import useApproveFarm from '../../hooks/useApproveFarm'

const Action = styled.div`

`

const UnderLineFlex = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.custom.divider};;
  padding: 9px 0;
`

export interface FarmWithStakedValue extends Farm {
  apr?: number
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = farm
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  const earnings = new BigNumber(earningsAsString)
  const lpAddress = getAddress(lpAddresses, chainId)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const dispatch = useAppDispatch()

  const lpContract = useERC20(lpAddress)

  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={farm.lpSymbol[chainId]}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
      />
    ) : (
      <Button mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove} style={{ ...ColorButtonStyle, background: theme.custom.gradient }}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <UnderLineFlex>
        <Text bold textTransform="uppercase" color="white" fontSize="14px" pr="4px">
          Sphynx
        </Text>
        <Text bold textTransform="uppercase" color="white" fontSize="14px">
          {t('Earned')}
        </Text>
      </UnderLineFlex>
      <HarvestAction earnings={earnings} pid={pid} />
      <Flex justifyContent='center'>
        <Text bold textTransform="uppercase" color="white" fontSize="14px" pr="4px">
          {farm.lpSymbol[chainId]}
        </Text>
        <Text bold textTransform="uppercase" color="white" fontSize="14px">
          {t('Staked')}
        </Text>
      </Flex>
      <Flex justifyContent='center'>
        {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
      </Flex>
    </Action>
  )
}

export default CardActions
