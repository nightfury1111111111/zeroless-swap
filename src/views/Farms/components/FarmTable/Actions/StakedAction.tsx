import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import {
  Button,
  useModal,
  IconButton,
  AddIcon,
  MinusIcon,
  Skeleton,
  Text,
  Flex,
  useMatchBreakpoints,
} from '@sphynxdex/uikit'
import { useLocation } from 'react-router-dom'
import { BigNumber } from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarmUser } from 'state/farms/hooks'
import { fetchFarmUserDataAsync } from 'state/farms'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { BASE_SWAP_URL } from 'config'
import { useAppDispatch } from 'state'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getFullDisplayBalance } from 'utils/formatBalance'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useApproveFarm from '../../../hooks/useApproveFarm'
import { ActionContainer, StakeActionTitles, ActionContent } from './styles'

const StakedActionContainer = styled.div`
  padding: 0px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 0;
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
    margin-bottom: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 16px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
  }
`

const StakeActionTitlesWrapper = styled.div`
  font-weight: 600;
  font-size: 12px;
  top: 20px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const IconButtonWrapper = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: unset;
  }
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: ${({ theme }) => theme.custom.gradient};
  width: 82px;
  outline: none;
  color: white;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 130px;
  }
`
const ButtonSkeleton = styled(Skeleton)`
  width: 102px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 130px;
  }
`

const AddButton = styled(Button)`
  border-radius: 9px;
  width: 112px;
  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: 12px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 16px;
  }
`

const StackedActionContent = styled(ActionContent)`
  flex-direction: column;
  gap: 8px;
`

const StackedFlex = styled(Flex)`
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
  margin-right: 0px;
  -webkit-box-align: end;
  -webkit-flex-align: end;
  -ms-flex-align: end;
  -webkit-align-items: end;
  align-items: end;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0px;
    margin-right: 10px;
  }
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ pid, lpSymbol, lpAddresses, userDataReady }) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { account, chainId } = useActiveWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const location = useLocation()

  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const lpAddress = getAddress(lpAddresses, chainId)
  const addLiquidityUrl = `${BASE_SWAP_URL}`
  const dispatch = useAppDispatch()

  const handleStake = async (amount: string) => {
    await onStake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
    }
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol[chainId]}
      addLiquidityUrl={addLiquidityUrl}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol[chainId]} />,
  )
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

  if (!account) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text bold textTransform="uppercase" color="white" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <StakedActionContainer>
          <StakeActionTitlesWrapper>
            <Text
              bold
              textAlign="center"
              textTransform="uppercase"
              color="white"
              fontSize="12px"
              pr={isMobile ? '0' : '4px'}
            >
              {lpSymbol[chainId]}
            </Text>
            <Text bold textAlign="center" textTransform="uppercase" color="white" fontSize="12px">
              {t('Staked')}
            </Text>
          </StakeActionTitlesWrapper>
          <StackedActionContent>
            <StackedFlex>
              <Text fontSize={isMobile ? '12px' : '16px'}>{displayBalance()}</Text>
              {/* {stakedBalance.gt(0) && lpPrice.gt(0) && (
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  value={getBalanceNumber(lpPrice.times(stakedBalance))}
                  unit=" USD"
                  prefix="~"
                />
              )} */}
            </StackedFlex>
            <IconButtonWrapper>
              <AddButton variant="secondary" onClick={onPresentWithdraw} mr={isMobile ? '0' : '6px'}>
                <Text color="primary" fontSize="14px">
                  Remove
                </Text>
              </AddButton>
              <AddButton
                variant="secondary"
                onClick={onPresentDeposit}
                disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
              >
                <Text color="primary" fontSize="14px">
                  Add
                </Text>
              </AddButton>
            </IconButtonWrapper>
          </StackedActionContent>
        </StakedActionContainer>
      )
    }

    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text bold textTransform="uppercase" color="white" fontSize="12px" pr="4px">
            {t('Stake').toUpperCase()}
          </Text>
          <Text bold textTransform="uppercase" color="white" fontSize="12px">
            {lpSymbol[chainId]}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ColorButton
            width="100%"
            onClick={onPresentDeposit}
            variant="secondary"
            disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
          >
            {t('Stake LP')}
          </ColorButton>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataReady) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text bold textTransform="uppercase" color="white" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ButtonSkeleton height="32px" />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <StakeActionTitles>
        <Text bold textTransform="uppercase" color="white" fontSize="12px">
          {t('Enable Farm')}
        </Text>
      </StakeActionTitles>
      <ActionContent>
        <ColorButton width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
          {t('Enable')}
        </ColorButton>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
