import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@sphynxdex/uikit'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import { useTranslation } from 'contexts/Localization'

const RewardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-sapce: no-wrap;
`

const RewardsContent = styled(Flex)`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  img {
    width: 38px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 0px;
    justify-content: flex-end;
    width: max-content;
    img {
      width: 75px;
    }
  }
`

const LogoTitle = styled.div`
  display: block;
  width: 100%;
  white-space: nowrap;
  div:nth-child(1) {
    font-size: 10px;
  }
  div:nth-child(2) {
    font-size: 14px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    div:nth-child(1) {
      font-size: 16px;
    }
    div:nth-child(2) {
      font-size: 24px;
    }
  }
`

const LogoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

const RewardsPanel: React.FC = () => {
  const { t } = useTranslation()

  return (
    <RewardsWrapper>
      <RewardsContent>
        <img src={MainLogo} alt="Main Logo" width="75" height="72" />
        <LogoTitleWrapper>
          <LogoTitle>
            <Text color="white">{t('Sphynx Swap')}</Text>
            <Text color="white" bold>
              {t('Fee Rewards')}
            </Text>
          </LogoTitle>
        </LogoTitleWrapper>
      </RewardsContent>
    </RewardsWrapper>
  )
}

export default RewardsPanel
