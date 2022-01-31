import React from 'react'
import styled from 'styled-components'
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

export interface EarnedProps {
  earnings: number
  pid: number
}

interface EarnedPropsWithLoading extends EarnedProps {
  userDataReady: boolean
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.custom.zeroEarned)};
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
`

const Earned: React.FunctionComponent<EarnedPropsWithLoading> = ({ earnings, userDataReady }) => {
  const { t } = useTranslation()
  return (
    <Container>
      <Flex mb='5px'>
        <TitleText>{t('Earned')}</TitleText>
      </Flex>
      {userDataReady ?
        <Amount earned={earnings}>{earnings.toLocaleString()}</Amount>
        :
        <Amount earned={0}>
          <Skeleton width={60} />
        </Amount>
      }
    </Container>
  )
}

export default Earned
