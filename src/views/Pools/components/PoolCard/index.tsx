import BigNumber from 'bignumber.js'
import styled, {useTheme} from 'styled-components'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@sphynxdex/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ColorButtonStyle } from 'style/buttonStyle'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const StyledCardBody = styled(CardBody)`
  background-color: transparent;
`

const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { chainId } = useActiveWeb3React()
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const theme = useTheme()
  
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <StyledCardHeader
        isStaking={accountHasStakedBalance}
        earningToken={earningToken[chainId]}
        stakingToken={stakingToken[chainId]}
        isFinished={isFinished && sousId !== 0}
      />
      <StyledCardBody>
        <AprRow pool={pool} />
        <Flex mt="24px" flexDirection="column" alignItems='center' style={{}}>
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="14px" color="white">
                {t('Start earning')}
              </Text>
              <ConnectWalletButton style={{...ColorButtonStyle, background: theme.custom.gradient}}/>
            </>
          )}
        </Flex>
      </StyledCardBody>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard
