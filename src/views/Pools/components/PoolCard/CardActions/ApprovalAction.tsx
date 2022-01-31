import React from 'react'
import { Button, AutoRenewIcon, Skeleton } from '@sphynxdex/uikit'
import {useTheme} from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { Pool } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ColorButtonStyle } from 'style/buttonStyle'
import { useApprovePool } from '../../../hooks/useApprove'

interface ApprovalActionProps {
  pool: Pool
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ pool, isLoading = false }) => {
  const { chainId } = useActiveWeb3React()
  const { sousId, stakingToken, earningToken } = pool
  const { t } = useTranslation()
  const theme = useTheme()
  const stakingTokenContract = useERC20(stakingToken[chainId].address ? getAddress(stakingToken[chainId].address, chainId) : '')
  const { handleApprove, requestedApproval } = useApprovePool(stakingTokenContract, sousId, earningToken[chainId].symbol)

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          isLoading={requestedApproval}
          endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={requestedApproval}
          onClick={handleApprove}
          style={{...ColorButtonStyle, background: theme.custom.gradient}}
        >
          {t('Enable')}
        </Button>
      )}
    </>
  )
}

export default ApprovalAction
