import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex, Box } from '@sphynxdex/uikit'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import styled, { useTheme } from 'styled-components'
import { SwapTabs, SwapTabList, SwapTab, SwapTabPanel } from 'components/Tab/tab'
import TokenLocker from './components/TokenLocker'
import LPLocker from './components/LPLocker'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  padding: 5px;
  margin-top: 24px;
  text-align: center;
  font-weight: bold;
  padding: 0px;
  p {
    line-height: 24px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 5px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 14px;
  }
`

const PageHeader = styled.div`
  width: 100%;
`

const WelcomeText = styled(Text)`
  color: white;
  font-weight: 600;
  line-height: 1.5;
  font-size: 20px;
  text-align: left;
  padding: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 30px;
  }
`

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
  bgColor?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  box-shadow: 0px 2px 12px rgba(37, 51, 66, 0.15);
  background-color: ${({ bgColor }) => bgColor};
`

const Locker: React.FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Wrapper>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Flex alignItems="center">
            <MainLogo width="80" height="80" />
            <Flex flexDirection="column" ml="10px">
              <WelcomeText>{t('SPHYNX LOCKERS')}</WelcomeText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <SwapTabs selectedTabClassName="is-selected" selectedTabPanelClassName="is-selected" style={{ width: '100%' }}>
        <SwapTabList>
          <SwapTab>
            <Text>{t('Liquidity Locker')}</Text>
          </SwapTab>
          <SwapTab>
            <Text>{t('Token Locker')}</Text>
          </SwapTab>
        </SwapTabList>
        <Card bgColor={theme.custom.tertiary} borderRadius="0 0 3px 3px" padding="20px 10px">
          <SwapTabPanel>
            <LPLocker />
          </SwapTabPanel>
          <SwapTabPanel>
            <TokenLocker />
          </SwapTabPanel>
        </Card>
      </SwapTabs>
    </Wrapper>
  )
}

export default Locker
