import React from 'react'
import { Flex, Button, useModal, Skeleton } from '@sphynxdex/uikit'
import BigNumber from 'bignumber.js'
import {useTheme} from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ColorButtonStyle } from 'style/buttonStyle'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultStakeModal'
import HasSharesActions from './HasSharesActions'

interface VaultStakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  accountHasSharesStaked: boolean
  isLoading?: boolean
}

const VaultStakeActions: React.FC<VaultStakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  accountHasSharesStaked,
  isLoading = false,
}) => {
  const { chainId } = useActiveWeb3React()
  const { stakingToken } = pool
  const { t } = useTranslation()
  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken[chainId].symbol} />)
  const [onPresentStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />)
  const theme = useTheme()
  
  const renderStakeAction = () => {
    return accountHasSharesStaked ? (
      <HasSharesActions pool={pool} stakingTokenBalance={stakingTokenBalance} />
    ) : (
      <Button style={{...ColorButtonStyle, background: theme.custom.gradient}} onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>{t('Stake')}</Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default VaultStakeActions
