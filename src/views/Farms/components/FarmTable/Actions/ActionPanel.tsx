import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LinkExternal, Text, Flex, Button, useMatchBreakpoints, Input } from '@sphynxdex/uikit'
import { BASE_SWAP_URL } from 'config'
import AddLiquidity from 'views/AddLiquidity/FarmAddLiquidityWidget'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { getAddress } from 'utils/addressHelpers'
import { getBscScanLink } from 'utils'
import { CommunityTag, CoreTag, DualTag } from 'components/Tags'
import RemoveLiquidity from 'views/RemoveLiquidity/FarmRemoveLiquidityWidget'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import HarvestAction from './HarvestAction'
import TokenLogo from './TokenLogo'
import StakedAction from './StakedAction'
import { AprProps } from '../Apr'
import { MultiplierProps } from '../Multiplier'
import { LiquidityProps } from '../Liquidity'

export interface ActionPanelProps {
  apr: AprProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 1000px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 1000px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded; isMobile: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;

  background: ${({ theme }) => theme.custom.background};
  // background: ${({ theme }) => (theme ? '#1A1A3A' : '#20234E')};
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  justify-content: center;
  padding: 5px;
  border-radius: 10px;
  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 12px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 16px 32px;
  }
`
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
const StyledLinkExternal = styled(LinkExternal)`
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
const TagsContainer = styled.div`
  display: flex;
  align-items: center;

  > div {
    border: 0px;
    height: 24px;
    padding: 0 6px;
    font-size: 12px;
    margin-right: 4px;
    color: #f9b043;
    svg {
      width: 14px;
    }
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

const InfoContainer = styled.div`
  // min-width: 200px;
`

const DetailContainer = styled(Flex)`
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-grow: 2;
    flex-basis: 0;
  }
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.custom.background};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
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

const TokenLogoSection = styled(Flex)`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-grow: 1;
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
const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: ${({ theme }) => theme.custom.gradient};
  width: 82px;
  outline: none;
  color: white;
  margin-top: 38px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 130px;
    margin-top: 0;
  }
`
const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({ details, userDataReady, expanded }) => {
  const farm = details
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { chainId } = useActiveWeb3React()
  const { dual } = farm
  const lpLabel = farm.lpSymbol[chainId] && farm.lpSymbol[chainId].toUpperCase().replace('PANCAKE', '')
  const farmLabel = lpLabel && lpLabel.replace(' LP', '')
  const lpAddress = getAddress(farm.lpAddresses, chainId)
  const bsc = getBscScanLink(lpAddress, 'address', chainId)
  const [addLiquidity, setAddLiquidity] = React.useState(false)
  const [addRemove, setAddRemove] = React.useState(false)
  return (
    <Wrapper>
      <Container expanded={expanded} isMobile={isMobile}>
        <DetailContainer>
          <InfoContainer>
            <Flex mb="5px">
              <Text bold>{farmLabel}</Text>
              <TagsContainer>
                {farm.isCommunity ? <CommunityTag /> : <CoreTag />}
                {dual ? <DualTag /> : null}
              </TagsContainer>
            </Flex>
            <ViewGroupWrapper>
              <BorderFlex mr={isMobile ? '0' : '2px'}>
                <StyledLinkExternal href={bsc}>{t('View Contract')}</StyledLinkExternal>
              </BorderFlex>
              <BorderFlex ml={isMobile ? '0' : '2px'}>
                <StyledLinkExternal href={bsc}>{t('See Pair Info')}</StyledLinkExternal>
              </BorderFlex>
            </ViewGroupWrapper>
          </InfoContainer>
          <TokenLogoSection>
            <TokenLogo {...farm} userDataReady={userDataReady} />
          </TokenLogoSection>
        </DetailContainer>
        <ActionContainer>
          <HarvestAction {...farm} userDataReady={userDataReady} />
          <ColorButton
            onClick={() => {
              setAddLiquidity(!addLiquidity)
            }}
          >
            Add
          </ColorButton>
          <StakedAction {...farm} userDataReady={userDataReady} />
        </ActionContainer>
      </Container>
      {addLiquidity && (
        <Container expanded={expanded} isMobile>
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
          {addRemove ? <RemoveLiquidity farm={farm} card={false} /> : <AddLiquidity farm={farm} />}
        </Container>
      )}
    </Wrapper>
  )
}

export default ActionPanel
