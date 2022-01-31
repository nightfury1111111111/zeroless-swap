import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled, { useTheme } from 'styled-components'
import {
  useMatchBreakpoints,
  Card,
  CardBody,
  Text,
  Flex,
  HelpIcon,
  Button,
  Heading,
  Skeleton,
  useModal,
  Box,
  useTooltip,
} from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useCakeVault } from 'state/pools/hooks'
import Balance from 'components/Balance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import StopwatchIcon from 'assets/svg/icon/StopwatchIcon.svg'
import BountyModal from './BountyModal'

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  background: transparent;

  & > div > div {
    padding: 24px 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const LogoContent = styled(Flex) <{ isMobile?: boolean }>`
  align-items: center;
  flex-direction: ${({ isMobile }) => isMobile ? 'column' : 'row'};
`

const BountyText = styled(Text)`
    font-size: 12px;
    font-weight: bold;
    color: white;
    margin-right: 4px;
    text-align: center;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 15px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
`

const TooltipText = styled(Text)`
  color: white;
`

const BountyCard = () => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const theme = useTheme()
  const isMobile = !isXl
  const {
    estimatedCakeBountyReward,
    fees: { callFee },
  } = useCakeVault()
  const cakePriceBusd = usePriceCakeBusd(chainId)

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyReward).multipliedBy(cakePriceBusd)
  }, [cakePriceBusd, estimatedCakeBountyReward])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedCakeBounty = estimatedCakeBountyReward ? estimatedCakeBountyReward.gte(0) : false
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0
  const cakeBountyToDisplay = hasFetchedCakeBounty ? getBalanceNumber(estimatedCakeBountyReward, 18) : 0

  const TooltipComponent = ({ fee }: { fee: number }) => (
    <>
      <TooltipText mb="16px">{t('This bounty is given as a reward for providing a service to other users.')}</TooltipText>
      <TooltipText mb="16px">
        {t(
          'Whenever you successfully claim the bounty, you’re also helping out by activating the Auto SPHYNX Pool’s compounding function for everyone.',
        )}
      </TooltipText>
      <TooltipText style={{ fontWeight: 'bold' }}>
        {t('Auto-Compound Bounty: %fee%% of all Auto SPHYNX pool users pending yield', { fee: fee / 100 })}
      </TooltipText>
    </>
  )

  const [onPresentBountyModal] = useModal(<BountyModal TooltipComponent={TooltipComponent} />)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent fee={callFee} />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard background="transparent">
        <CardBody>
          <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems='center'>
            <Flex flexGrow={1} style={{ borderRight: `${isMobile ? '0px' : '1px'} solid ${theme.custom.divider}` }}>
              <LogoContent isMobile={isMobile}>
                <img src={StopwatchIcon} alt="Stopwatch Logo" width={isMobile ? '50' : '100'} />
                <Flex flexDirection="column">
                  <Flex alignItems="center" mb="2px">
                    <BountyText>
                      {t('Auto SPHYNX Bounty')}
                    </BountyText>
                    <Box ref={targetRef}>
                      <HelpIcon color="white" />
                    </Box>
                  </Flex>
                  <Flex flexDirection="column" alignItems={isMobile ? 'center' : 'star-flex'}>
                    <Heading>
                      {hasFetchedCakeBounty ? (
                        <Balance fontSize={isMobile ? '13px' : '15px'} color="white" value={cakeBountyToDisplay} decimals={3} />
                      ) : (
                        <Skeleton height={20} width={96} mb="2px" />
                      )}
                    </Heading>
                  </Flex>
                </Flex>
              </LogoContent>
            </Flex>
            <Flex flexGrow={1} alignItems="center" justifyContent="end">
              <Button
                variant="primary"
                disabled={!dollarBountyToDisplay || !cakeBountyToDisplay || !callFee}
                onClick={onPresentBountyModal}
                scale="sm"
                id="clickClaimVaultBounty"
                style={{ fontSize: '13px', color: "white", backgroundColor: theme.custom.currencySelectButton, borderColor: theme.custom.currencySelectButton, borderRadius: '5px' }}
              >
                {t('Claim')}
              </Button>
            </Flex>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default BountyCard
