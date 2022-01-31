import React from 'react'
import {useTheme} from 'styled-components'
import { Button, AutoRenewIcon, Skeleton } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { ColorButtonStyle } from 'style/buttonStyle'
import { useVaultApprove } from '../../../hooks/useApprove'

interface ApprovalActionProps {
  setLastUpdated: () => void
  isLoading?: boolean
}

const VaultApprovalAction: React.FC<ApprovalActionProps> = ({ isLoading = false, setLastUpdated }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { handleApprove, requestedApproval } = useVaultApprove(setLastUpdated)

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

export default VaultApprovalAction
