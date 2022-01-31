import React from 'react'
import { CardHeader, Heading, Text, Flex } from '@sphynxdex/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'
import CakeVaultTokenPairImage from '../CakeVaultCard/CakeVaultTokenPairImage'

const Wrapper = styled(CardHeader) <{ isFinished?: boolean; background?: string }>`
  background: transparent;
`

const StyledCardHeader: React.FC<{
  earningToken: Token
  stakingToken: Token
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
}> = ({ earningToken, stakingToken, isFinished = false, isAutoVault = false, isStaking = false }) => {
  const { t } = useTranslation()
  const isCakePool = earningToken.symbol === 'SPHYNX' && stakingToken.symbol === 'SPHYNX'
  const background = isStaking ? 'bubblegum' : 'cardHeader'

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return t('Auto')
    }
    if (isCakePool) {
      // manual cake
      return t('Manual')
    }
    // all other pools
    return t('Earn')
  }

  const getSubHeading = () => {
    if (isAutoVault) {
      return t('Automatic restaking')
    }
    if (isCakePool) {
      return t('Earn SPHYNX, stake SPHYNX')
    }
    return t('Stake %symbol%', { symbol: stakingToken.symbol })
  }

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="center" >
        <Flex flexDirection="column" alignItems="center">
          {isAutoVault ? (
            <CakeVaultTokenPairImage width={100} height={100} />
          ) : (
            <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={100} height={100} />
          )}
          <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
            {`${getHeadingPrefix()} ${earningToken.symbol}`}
          </Heading>
          <Text color='white' fontSize='15px'>{getSubHeading()}</Text>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader

