import React from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'

export interface ExpandableSectionButtonProps {
  onClick?: () => void
  expanded?: boolean
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;

  svg {
    fill: white;
  }
`

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick, expanded }) => {
  const { t } = useTranslation()

  return (
    <Wrapper aria-label={t('Hide or show expandable content')} role="button" onClick={() => onClick()}>
      <Text color="white" fontSize='12px' bold>
        {expanded ? t('Hide') : t('Details')}
      </Text>
      {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </Wrapper>
  )
}

ExpandableSectionButton.defaultProps = {
  expanded: false,
}

export default ExpandableSectionButton
