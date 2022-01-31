import React from 'react'
import styled, { useTheme } from 'styled-components'
import { Text, ChevronDownIcon } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell from './BaseCell'

interface ExpandActionCellProps {
  expanded: boolean
  isFullLayout: boolean
}

const StyledCell = styled(BaseCell)`
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.md} {
  }
`

const ArrowIcon = styled(ChevronDownIcon) <{ toggled: boolean }>`
  width: 44px;  
  height: 44px;
  margin-bottom: auto;
`

const TotalStakedCell: React.FC<ExpandActionCellProps> = ({ expanded, isFullLayout }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <StyledCell role="cell">
      {isFullLayout && (
        <Text color="white" fontSize='12px'>
          {expanded ? t('Hide') : t('Details')}
        </Text>
      )}
      <ArrowIcon color={expanded ? theme.custom.pancakePrimary : 'white'} toggled={expanded} />
    </StyledCell>
  )
}

export default TotalStakedCell
