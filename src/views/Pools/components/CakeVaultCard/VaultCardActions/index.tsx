import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'

const InlineText = styled(Text)`
  display: inline;
`

const CakeVaultCardActions: React.FC<{
  pool: Pool
  accountHasSharesStaked: boolean
  isLoading: boolean
}> = ({ pool, accountHasSharesStaked, isLoading }) => {
  const { chainId } = useActiveWeb3React()
  const { stakingToken, userData } = pool
  const { t } = useTranslation()
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" alignItems='center'>
        <Box display="inline" mb="10px">
          <InlineText
            color='white'
            textTransform="uppercase"
            fontSize="14px"
          >
            {accountHasSharesStaked ? stakingToken[chainId].symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText
            color='white'
            textTransform="uppercase"
            fontSize="14px"
          >
            {accountHasSharesStaked ? t('Staked (compounding)') : `${stakingToken[chainId].symbol}`}
          </InlineText>
        </Box>
        {isVaultApproved ? (
          <VaultStakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            accountHasSharesStaked={accountHasSharesStaked}
          />
        ) : (
          <VaultApprovalAction isLoading={isLoading} setLastUpdated={setLastUpdated} />
        )}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
