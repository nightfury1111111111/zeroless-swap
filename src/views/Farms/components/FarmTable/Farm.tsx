import React from 'react'
import styled from 'styled-components'
import { useFarmUser } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { Text, useMatchBreakpoints } from '@sphynxdex/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'

export interface FarmProps {
  label: string
  pid: number
  token: Token
  quoteToken: Token
}

const Container = styled.div<{ isMobile?: boolean }>`
  display: flex;
  align-items:  ${({ isMobile }) => isMobile? 'flex-start' : 'center'};
  flex-direction: ${({ isMobile }) => isMobile? 'column' : 'row'};
  flex: 2;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
  }
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 50px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 70px; 
  }
`

const Farm: React.FunctionComponent<FarmProps> = ({ token, quoteToken, label, pid }) => {
  const { stakedBalance } = useFarmUser(pid)
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Farming')}
        </Text>
      )
    }

    return null
  }

  return (
    <Container isMobile={isMobile}>
      <TokenWrapper>
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken}  width={isMobile? 50: 70} height={isMobile? 50: 70} />
      </TokenWrapper>
      <div>
        {handleRenderFarming()}
        <Text bold>{label}</Text>
      </div>
    </Container>
  )
}

export default Farm
