import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCakeVault } from 'state/pools/hooks'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { TokenPairImage } from 'components/TokenImage'
import CakeVaultTokenPairImage from '../../CakeVaultCard/CakeVaultTokenPairImage'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)<{ isMobile?: boolean }>`
  align-items:  ${({ isMobile }) => isMobile? 'flex-start' : 'center'};
  flex-direction: ${({ isMobile }) => isMobile? 'column' : 'row'};
  flex: 2;
  ${({ theme }) => theme.mediaQueries.sm} {
  }
`

const NameCell: React.FC<NameCellProps> = ({ pool }) => {
  const { chainId } = useActiveWeb3React()
  const index = chainId === undefined ? ChainId.MAINNET : chainId
  const { t } = useTranslation()
  const { isXs, isXl, isSm } = useMatchBreakpoints()
  const isMobile = !isXl
  const { sousId, stakingToken, earningToken, userData, isFinished, isAutoVault } = pool
  const {
    userData: { userShares },
  } = useCakeVault()
  const hasVaultShares = userShares && userShares.gt(0)

  const stakingTokenSymbol = stakingToken[index].symbol
  const earningTokenSymbol = earningToken[index].symbol

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isManualCakePool = sousId === 0

  const showStakedTag = isAutoVault ? hasVaultShares : isStaked

  let title = `${t('Earn')} ${earningTokenSymbol}`
  let subtitle = `${t('Stake')} ${stakingTokenSymbol}`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isXs && !isSm)

  if (isAutoVault) {
    title = t('Auto SPHYNX')
    subtitle = t('Automatic restaking')
  } else if (isManualCakePool) {
    title = t('Manual SPHYNX')
    subtitle = `${t('Earn')} SPHYNX ${t('Stake').toLocaleLowerCase()} SPHYNX`
  }

  return (
    <StyledCell role="cell" isMobile={isMobile}>
        {isAutoVault ? (
          <CakeVaultTokenPairImage mr="8px" width={isMobile? 50: 70} height={isMobile? 50: 70} />
        ) : (
          <TokenPairImage primaryToken={earningToken[index]} secondaryToken={stakingToken[index]} mr="8px" width={isMobile? 50: 70} height={isMobile? 50: 70} />
        )}
      <CellContent>
        {showStakedTag && (
          <Text fontSize="12px" bold color={isFinished ? 'failure' : 'secondary'} textTransform="uppercase">
            {t('Staked')}
          </Text>
        )}
        <Text bold={!isXs && !isSm} small={isXs || isSm} mb='5px'>
          {title}
        </Text>
        {showSubtitle && (
          <Text fontSize={isMobile? "12px": "15px"} color="white">
            {subtitle}
          </Text>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
