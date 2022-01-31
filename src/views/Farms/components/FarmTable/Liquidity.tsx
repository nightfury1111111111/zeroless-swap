import React from 'react'
import styled from 'styled-components'
import { HelpIcon, Text, Skeleton, useTooltip, Flex } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface LiquidityProps {
  liquidity: BigNumber
}

const Container = styled.div`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px 8px;
`

const TitleText = styled(Text)`
  font-size: 14px;
  color: white;
  text-align: left;
  margin-right: 5px;
`

const LiquidityWrapper = styled.div`
  font-weight: 600;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity }) => {
  const displayLiquidity =
    liquidity && liquidity.gt(0) ? (
      `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    ) : (
      <Skeleton width={60} />
    )
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Total value of the funds in this farm’s liquidity pool'),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  return (
    <Container>
      <Flex mb='5px'>
        <TitleText>{t('Liquidity')}</TitleText>
        <ReferenceElement ref={targetRef}>
          <HelpIcon color="white" width='15'/>
        </ReferenceElement>
      </Flex>
      <LiquidityWrapper>
        <Text>{displayLiquidity}</Text>
      </LiquidityWrapper>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default Liquidity
