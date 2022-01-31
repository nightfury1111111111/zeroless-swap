import React from 'react'
import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { BASE_SWAP_URL } from 'config'
import { Skeleton, Flex, Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'

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

const APRContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
`

export interface AprProps {
  value: string
  multiplier: string
  lpLabel: string
  tokenAddress?: Address
  quoteTokenAddress?: Address
  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
}

const Apr: React.FC<AprProps> = ({
  value,
  lpLabel,
  cakePrice,
  originalValue,
  hideButton = false,
}) => {
  const { t } = useTranslation()
  const addLiquidityUrl = `${BASE_SWAP_URL}`

  return (
    <Container>
      <Flex mb='5px'>
        <TitleText>{t('APR')}</TitleText>
      </Flex>
      {originalValue !== 0 ?
        <APRContainer>
          {originalValue ?
            <>
              <AprWrapper>{value}%</AprWrapper>
              {!hideButton && (
                <ApyButton
                  lpLabel={lpLabel}
                  cakePrice={cakePrice}
                  apr={originalValue}
                  displayApr={value}
                  addLiquidityUrl={addLiquidityUrl}
                />
              )}
            </>
            :
            <AprWrapper>
              <Skeleton width={60} />
            </AprWrapper>
          }
        </APRContainer>
        :
        <APRContainer>
          <AprWrapper>{originalValue}%</AprWrapper>
        </APRContainer>
      }
    </Container>
  )
}

export default Apr
