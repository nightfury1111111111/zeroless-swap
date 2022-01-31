import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton, Button } from '@sphynxdex/uikit'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { Farm } from 'state/types'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_SWAP_URL } from 'config'
import AddLiquidity from 'views/AddLiquidity/FarmAddLiquidityWidget'
import { getAddress } from 'utils/addressHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import RemoveLiquidity from 'views/RemoveLiquidity/FarmRemoveLiquidityWidget'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface FarmWithStakedValue extends Farm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}
const StyledNav = styled.div`
  display: flex;
  height: 24px;
  width: 100%;
  justify-content: center;
  background: transparent;
  border-radius: 16px;
  margin-bottom: 16px;
  button:nth-child(1) {
    width: 100%;
    max-width: 120px;
    font-weight: 600;
    font-size: 12px;
    color: white;
    height: 24px;
    padding: 0 16px;
    background: ${({ theme }) => theme.custom.autoCardBackground};
    border: 1px solid ${({ theme }) => theme.custom.autoCardBorder};
    border-radius: 16px 0px 0px 16px;
    box-shadow: none !important;
    outline: none;
    &:hover,
    &.active {
      background: ${({ theme }) => theme.custom.pancakePrimary};
      border: 1px solid ${({ theme }) => theme.custom.primary};
    }
  }
  button:nth-child(2) {
    width: 100%;
    max-width: 120px;
    font-weight: 600;
    font-size: 12px;
    color: white;
    height: 24px;
    padding: 0 16px;
    background: ${({ theme }) => theme.custom.autoCardBackground};
    border: 1px solid ${({ theme }) => theme.custom.autoCardBorder};
    border-radius: 0px 16px 16px 0px;
    box-shadow: none !important;
    outline: none;
    &:hover,
    &.active {
      background: ${({ theme }) => theme.custom.pancakePrimary} !important;
      border: 1px solid ${({ theme }) => theme.custom.primary};
    }
  }
`
const StyledCard = styled(Card)`
  max-width: 352px;
  margin: 0 8px 24px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  background: ${({ theme }) => theme.custom.background};
  // background: ${({ theme }) => (theme ? '#1A1A3A' : '#20234E')};
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
  border-radius: 10px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
  > div {
    background: transparent;
  }
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

const ExpandingWrapper = styled.div`
  padding: 0 24px 24px 24px;
  overflow: hidden;
`

const LabelText = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  color: white;
`

const ValueText = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  color: #f2c94c;
`

const UnderLineFlex = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.custom.divider};
  padding: 9px 0;
`
interface FarmCardProps {
  farm: FarmWithStakedValue
  displayApr: string
  removed: boolean
  cakePrice?: BigNumber
  account?: string
  viewDetail: any
  detailed: number
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, cakePrice, account, detailed, viewDetail }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const index = chainId === undefined ? ChainId.MAINNET : chainId
  const lpLabel = farm.lpSymbol[index] && farm.lpSymbol[index].toUpperCase().replace('PANCAKE', '')
  const earnLabel = farm.dual ? farm.dual.earnLabel : t('Sphynx + Fees')
  const addLiquidityUrl = `${BASE_SWAP_URL}`
  const lpAddress = getAddress(farm.lpAddresses, index)
  const isPromotedFarm = farm.token[index]?.symbol === 'SPHYNX'
  const [addLiquidity, setAddLiquidity] = React.useState(false)
  const [addRemove, setAddRemove] = React.useState(false)
  return (
    <StyledCard isActive={isPromotedFarm}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token[index]}
          quoteToken={farm.quoteToken[index]}
        />
        {!removed && (
          <UnderLineFlex justifyContent="space-between" alignItems="center">
            <LabelText>{t('APR')}:</LabelText>
            <ValueText>
              {farm.apr ? (
                <>
                  <ApyButton
                    lpLabel={lpLabel}
                    addLiquidityUrl={addLiquidityUrl}
                    cakePrice={cakePrice}
                    apr={farm.apr}
                    displayApr={displayApr}
                  />
                  {displayApr}%
                </>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </ValueText>
          </UnderLineFlex>
        )}
        <UnderLineFlex justifyContent="space-between">
          <LabelText>{t('Earn')}:</LabelText>
          <ValueText>{earnLabel}</ValueText>
        </UnderLineFlex>
        <CardActionsContainer farm={farm} account={account} addLiquidityUrl={addLiquidityUrl} />
      </FarmCardInnerContainer>
      <ExpandingWrapper>
        <ExpandableSectionButton
          onClick={() => viewDetail(detailed === farm.pid ? 0 : farm.pid)}
          expanded={detailed === farm.pid}
        />
        {detailed === farm.pid && (
          <StyledNav>
            <Button
              className={!addRemove ? 'active' : ''}
              id="dgsn-nav-link"
              onClick={() => {
                setAddRemove(false)
              }}
            >
              {t('Add')}
            </Button>
            <Button
              className={addRemove ? 'active' : ''}
              id="pcv-nav-link"
              onClick={() => {
                setAddRemove(true)
              }}
            >
              {t('Remove')}
            </Button>
          </StyledNav>
        )}
        {detailed === farm.pid && (addRemove ? <RemoveLiquidity farm={farm} card /> : <AddLiquidity farm={farm} />)}
        {detailed === farm.pid && (
          <DetailsSection
            removed={removed}
            bscScanAddress={getBscScanLink(lpAddress, 'address', index)}
            infoAddress={`#/pool/${lpAddress}`}
            totalValueFormatted={totalValueFormatted}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default FarmCard
