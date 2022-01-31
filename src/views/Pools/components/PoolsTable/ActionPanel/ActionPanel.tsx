import React, { useCallback } from 'react'
import styled, { keyframes, css } from 'styled-components'
import {
  Box,
  Button,
  Flex,
  HelpIcon,
  Link,
  LinkExternal,
  MetamaskIcon,
  Skeleton,
  Text,
  TimerIcon,
  useTooltip,
  useMatchBreakpoints,
} from '@sphynxdex/uikit'
import { BASE_BSC_SCAN_URL } from 'config'
import { getBscScanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBlock } from 'state/block/hooks'
import { useCakeVault } from 'state/pools/hooks'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import TokenLogo from './TokenLogo'
import Harvest from './Harvest'
import Stake from './Stake'
import Apr from '../Apr'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean; isMobile: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: ${({ theme }) => theme.custom.background};
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  justify-content: center;
  padding: 5px;

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 12px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 16px 32px;
  }
`
const DetailContainer = styled(Flex)`
  display: flex;
  flex-direction: row;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 2;
    flex-basis: 0;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
}

interface ActionPanelProps {
  account: string
  pool: Pool
  userDataLoaded: boolean
  expanded: boolean
  breakpoints: MediaBreakpoints
}

const InfoSection = styled(Box)`
  justify-content: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  padding: 8px 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
  }
`

const TokenLogoSection = styled(Flex)`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-grow: 1;
`

const LargeLinkExternal = styled(LinkExternal)`
  font-size: 18px;
  font-weight: 600;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
`

const SmallLinkExternal = styled(LinkExternal)`
  font-size: 8px;
  font-weight: 400;
  flex-flow: row-reverse;
  > svg {
    width: 15px;
    margin-right: 3px;
    margin-left: 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 10px;
  }
`

const BorderFlex = styled(Flex)`
  color: white;
  border-radius: 5px;
  border: 1px solid #2e2e55;
  padding: 3px;
  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 8px;
  }
`

const ViewGroupWrapper = styled(Flex)`
  display: flex;
  flex-direction: column;
  margin-bottom: unset;
  gap: 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    margin-bottom: 8px;
  }
`

const ActionPanel: React.FC<ActionPanelProps> = ({ account, pool, userDataLoaded, expanded, breakpoints }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    contractAddress,
    isAutoVault,
  } = pool
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { chainId } = useActiveWeb3React()
  const index = chainId === undefined ? ChainId.MAINNET : chainId
  const poolContractAddress = getAddress(contractAddress, chainId)
  const cakeVaultContractAddress = getCakeVaultAddress(chainId)
  const { currentBlock } = useBlock()
  const { isXs, isSm, isMd } = breakpoints
  const showSubtitle = (isXs || isSm) && sousId === 0

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const tokenAddress = earningToken[index].address ? getAddress(earningToken[index].address, chainId) : ''

  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useCakeVault()

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100
  const isManualCakePool = sousId === 0

  const getTotalStakedBalance = () => {
    if (isAutoVault) {
      return getBalanceNumber(totalCakeInVault, stakingToken[index].decimals)
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(totalCakeInVault)
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken[index].decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken[index].decimals)
  }

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this pool', { symbol: stakingToken[index].symbol }), {
    placement: 'bottom',
  })

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
  )

  const {
    targetRef: tagTargetRef,
    tooltip: tagTooltip,
    tooltipVisible: tagTooltipVisible,
  } = useTooltip(isAutoVault ? autoTooltipText : manualTooltipText, {
    placement: 'bottom-start',
  })

  const maxStakeRow = stakingLimit.gt(0) ? (
    <Flex mb="8px" justifyContent="space-between">
      <Text>{t('Max. stake per user')}:</Text>
      <Text>{`${getFullDisplayBalance(stakingLimit, stakingToken[index].decimals, 0)} ${
        stakingToken[index].symbol
      }`}</Text>
    </Flex>
  ) : null

  const blocksRow =
    blocksRemaining || blocksUntilStart ? (
      <Flex mb="8px" justifyContent="space-between">
        <Text>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
        <Flex>
          <Link external href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
            <Balance fontSize="16px" value={blocksToDisplay} decimals={0} color="primary" />
            <Text ml="4px" color="primary" textTransform="lowercase">
              {t('Blocks')}
            </Text>
            <TimerIcon ml="4px" color="primary" />
          </Link>
        </Flex>
      </Flex>
    ) : (
      <Skeleton width="56px" height="16px" />
    )

  const aprRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text>{isAutoVault ? t('APY') : t('APR')}:</Text>
      <Apr pool={pool} showIcon performanceFee={isAutoVault ? performanceFeeAsDecimal : 0} />
    </Flex>
  )

  const totalStakedRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text maxWidth={['50px', '100%']}>{t('Total staked')}:</Text>
      <Flex alignItems="center">
        {totalStaked && totalStaked.gte(0) ? (
          <>
            <Balance
              fontSize="16px"
              value={getTotalStakedBalance()}
              decimals={0}
              unit={` ${stakingToken[index].symbol}`}
            />
            <span ref={totalStakedTargetRef}>
              <HelpIcon color="textSubtle" width="20px" ml="4px" />
            </span>
          </>
        ) : (
          <Skeleton width="56px" height="16px" />
        )}
        {totalStakedTooltipVisible && totalStakedTooltip}
      </Flex>
    </Flex>
  )

  const handleRegisterToken = useCallback(() => {
    registerToken(tokenAddress, earningToken[index].symbol, earningToken[index].decimals)
  }, [earningToken, tokenAddress])

  return (
    <StyledActionPanel expanded={expanded} isMobile={isMobile}>
      <DetailContainer>
        <InfoSection>
          <Flex flexDirection="row" alignItems="center">
            {isAutoVault ? <CompoundingPoolTag /> : <ManualPoolTag />}
            {tagTooltipVisible && tagTooltip}
            <span ref={tagTargetRef}>
              <HelpIcon ml="4px" width="14px" height="14px" color="#F9B043" />
            </span>
          </Flex>
          {maxStakeRow}
          {/* {(isXs || isSm) && aprRow}
          {(isXs || isSm || isMd) && totalStakedRow}
          {shouldShowBlockCountdown && blocksRow} */}
          <Flex mb="8px">
            <LargeLinkExternal href={getBscScanLink(getAddress(earningToken[index].address, chainId), 'token', index)}>
              {t('See Token Info')}
            </LargeLinkExternal>
          </Flex>
          <ViewGroupWrapper>
            <BorderFlex mr={isMobile ? '0' : '2px'}>
              <SmallLinkExternal href={earningToken[index].projectLink}>{t('View Project Site')}</SmallLinkExternal>
            </BorderFlex>
            {poolContractAddress && (
              <BorderFlex ml={isMobile ? '0' : '2px'}>
                <SmallLinkExternal
                  href={getBscScanLink(isAutoVault ? cakeVaultContractAddress : poolContractAddress, 'address', index)}
                >
                  {t('View Contract')}
                </SmallLinkExternal>
              </BorderFlex>
            )}
          </ViewGroupWrapper>
          {/* {account && isMetaMaskInScope && tokenAddress && (
            <Flex mb="8px">
              <Button
                variant="text"
                p="0"
                height="auto"
                onClick={handleRegisterToken}
              >
                <Text color="primary">{t('Add to Metamask')}</Text>
                <MetamaskIcon ml="4px" />
              </Button>
            </Flex>
          )} */}
        </InfoSection>
        <TokenLogoSection>
          <TokenLogo {...pool} userDataLoaded={userDataLoaded} />
        </TokenLogoSection>
      </DetailContainer>
      <ActionContainer>
        {/* {showSubtitle && (
          <Text mt="4px" mb="16px" color="textSubtle">
            {isAutoVault ? t('Automatic restaking') : `${t('Earn')} SPHYNX ${t('Stake').toLocaleLowerCase()} SPHYNX`}
          </Text>
        )} */}
        <Harvest {...pool} userDataLoaded={userDataLoaded} />
        <Stake pool={pool} userDataLoaded={userDataLoaded} />
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
