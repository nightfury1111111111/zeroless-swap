import React from 'react'
import { Flex, Text, Button, IconButton, AddIcon, useMatchBreakpoints, MinusIcon, useModal, Skeleton, useTooltip } from '@sphynxdex/uikit'
import BigNumber from 'bignumber.js'
import styled, {useTheme} from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import Balance from 'components/Balance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ColorButtonStyle } from 'style/buttonStyle'
import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'
import StakeModal from '../Modals/StakeModal'

const AddIconButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 48px;
    height: 48px;
    border-radius: 16px;
  }
`

interface StakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakedBalance: BigNumber
  isBnbPool: boolean
  isStaked: ConstrainBoolean
  isLoading?: boolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakedBalance,
  isBnbPool,
  isStaked,
  isLoading = false,
}) => {
  const { chainId } = useActiveWeb3React()
  const { stakingToken, stakingTokenPrice, stakingLimit, isFinished, userData } = pool
  const { t } = useTranslation()
  const theme = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken[chainId].decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken[chainId].decimals,
  )

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken[chainId].symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('You’ve already staked the maximum amount you can stake in this pool!'),
    { placement: 'bottom' },
  )

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  const renderStakeAction = () => {
    return isStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column" mr='10px'>
          <Balance bold fontSize={isMobile? "12px": "16px"} decimals={3} value={stakedTokenBalance} />
          {stakingTokenPrice !== 0 && (
            <Text fontSize="12px" color="textSubtle">
              <Balance
                fontSize={isMobile? "12px": "16px"}
                color="textSubtle"
                decimals={2}
                value={stakedTokenDollarBalance}
                prefix="~"
                unit=" USD"
              />
            </Text>
          )}
        </Flex>
        <Flex>
          <AddIconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
            <MinusIcon color="primary" width="24px" />
          </AddIconButton>
          {reachStakingLimit ? (
            <span ref={targetRef}>
              <AddIconButton variant="secondary" disabled>
                <AddIcon color="textDisabled" width="24px" height="24px" />
              </AddIconButton>
            </span>
          ) : (
            <AddIconButton
              variant="secondary"
              onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
              disabled={isFinished}
            >
              <AddIcon color="primary" width="24px" height="24px" />
            </AddIconButton>
          )}
        </Flex>
        {tooltipVisible && tooltip}
      </Flex>
    ) : (
      <Button disabled={isFinished} onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired} style={{...ColorButtonStyle, background: theme.custom.gradient}}>
        {t('Stake')}
      </Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default StakeAction
