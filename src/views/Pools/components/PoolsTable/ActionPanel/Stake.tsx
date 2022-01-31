import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, useModal, IconButton, AddIcon, MinusIcon, Skeleton, useTooltip, Flex, Text, useMatchBreakpoints } from '@sphynxdex/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCakeVault } from 'state/pools/hooks'
import { Pool } from 'state/types'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { PoolCategory } from 'config/constants/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAddress } from 'utils/addressHelpers'
import { useERC20 } from 'hooks/useContract'
import { convertSharesToCake } from 'views/Pools/helpers'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { StakeActionTitles, ActionContent } from './styles'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import StakeModal from '../../PoolCard/Modals/StakeModal'
import VaultStakeModal from '../../CakeVaultCard/VaultStakeModal'
import { useCheckVaultApprovalStatus, useApprovePool, useVaultApprove } from '../../../hooks/useApprove'

const ActionContainer = styled.div`
  padding: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 0;
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: center;
  // height: 110px;
  position: relative;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
    margin-bottom: 16px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
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
  color: white;
  font-size: 13px;
  background: ${({ theme }) => theme.custom.gradient};
  width: 102px;
  outline: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 176px;
  }
`
const ButtonSkeleton = styled(Skeleton)`
  width: 102px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 176px;
  }
`

const StackedFlex = styled(Flex)`
  flex: 1;
  flex-direction: column;
  margin-bottom: 10px;
  margin-right: 0px;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0px;
    margin-right: 10px;
  }
`

const StackedActionContent = styled(ActionContent)`
  flex-direction: column;
  gap: 8px;
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

interface StackedActionProps {
  pool: Pool
  userDataLoaded: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ pool, userDataLoaded }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    stakingLimit,
    isFinished,
    poolCategory,
    userData,
    stakingTokenPrice,
    isAutoVault,
  } = pool
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const index = chainId === undefined ? ChainId.MAINNET : chainId
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  const stakingTokenContract = useERC20(stakingToken[index].address ? getAddress(stakingToken[index].address, chainId) : '')
  const { handleApprove: handlePoolApprove, requestedApproval: requestedPoolApproval } = useApprovePool(
    stakingTokenContract,
    sousId,
    earningToken[index].symbol,
  )

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()
  const { handleApprove: handleVaultApprove, requestedApproval: requestedVaultApproval } =
    useVaultApprove(setLastUpdated)

  const handleApprove = isAutoVault ? handleVaultApprove : handlePoolApprove
  const requestedApproval = isAutoVault ? requestedVaultApproval : requestedPoolApproval

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !isAutoVault && stakedBalance.gt(0)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken[index].decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken[index].decimals,
  )

  const {
    userData: { userShares },
    pricePerFullShare,
  } = useCakeVault()

  const { cakeAsBigNumber, cakeAsNumberBalance } = convertSharesToCake(userShares, pricePerFullShare)
  const hasSharesStaked = userShares && userShares.gt(0)
  const isVaultWithShares = isAutoVault && hasSharesStaked
  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken[index].decimals)

  const needsApproval = isAutoVault ? !isVaultApproved : !allowance.gt(0) && !isBnbPool

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken[index].symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentVaultStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />)

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const [onPresentVaultUnstake] = useModal(<VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />)

  const onStake = () => {
    if (isAutoVault) {
      onPresentVaultStake()
    } else {
      onPresentStake()
    }
  }

  const onUnstake = () => {
    if (isAutoVault) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("You've already staked the maximum amount you can stake in this pool!"),
    { placement: 'bottom' },
  )

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  if (!account) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ConnectWalletButton />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ButtonSkeleton height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (needsApproval) {
    return (
      <ActionContainer>
        <StakeActionTitles>
          <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </StakeActionTitles>
        <ActionContent>
          <ColorButton onClick={handleApprove} variant="secondary">
            {t('Enable')}
          </ColorButton>
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {

    return (
      <ActionContainer>
        <Flex mb='5px' flexDirection='column'>
          <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase" textAlign="center">
            {stakingToken[index].symbol}{' '}
          </Text>
          <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase" textAlign="center">
            {isAutoVault ? t('Staked (compounding)') : t('Staked')}
          </Text>
        </Flex>
        <StackedActionContent>
          <StackedFlex>
            <Balance
              lineHeight="1"
              bold
              fontSize={isMobile ? "12px" : "16px"}
              decimals={5}
              value={isAutoVault ? cakeAsNumberBalance : stakedTokenBalance}
            />
            {/* <Balance
              fontSize={isMobile? "12px": "16px"}
              display="inline"
              color="textSubtle"
              decimals={2}
              value={isAutoVault ? stakedAutoDollarValue : stakedTokenDollarBalance}
              unit=" USD"
              prefix="~"
            /> */}
          </StackedFlex>
          <IconButtonWrapper>
            <AddButton variant="secondary" onClick={onUnstake} mr={isMobile ? "0" : "6px"}>
              <Text color="primary" fontSize="14px">Remove</Text>
            </AddButton>
            {reachStakingLimit ? (
              <span ref={targetRef}>
                <AddButton variant="secondary" disabled>
                  <Text color="primary" fontSize="14px">Add</Text>
                </AddButton>
              </span>
            ) : (
              <AddButton
                variant="secondary"
                onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
                disabled={isFinished}
              >
                <Text color="primary" fontSize="14px">Add</Text>
              </AddButton>
            )}
          </IconButtonWrapper>
          {tooltipVisible && tooltip}
        </StackedActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <StakeActionTitles>
        <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
          {t('Stake')}{' '}
        </Text>
        <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
          {stakingToken[index].symbol}
        </Text>
      </StakeActionTitles>
      <ActionContent>
        <ColorButton
          onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
          variant="secondary"
          disabled={isFinished}
        >
          {t('Stake')}
        </ColorButton>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
