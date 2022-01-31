import React from 'react'
import styled from 'styled-components'
import { HelpIcon, Skeleton, useTooltip, Flex, Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'

const ReferenceElement = styled.div`
  display: inline-block;
`

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

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;
  margin-right: 14px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

export interface MultiplierProps {
  multiplier: string
}

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={60} />
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      {t('The multiplier represents the amount of SPHYNX rewards each farm gets.')}
      <br />
      <br />
      {t('For example, if a 1x farm was getting 1 SPHYNX per block, a 40x farm would be getting 40 SPHYNX per block.')}
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container>
      <Flex mb='5px'>
        <TitleText>{t('Multiplier')}</TitleText>
        <ReferenceElement ref={targetRef}>
          <HelpIcon color="white" width='15'/>
        </ReferenceElement>
      </Flex>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default Multiplier
