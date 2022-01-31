import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip } from '@sphynxdex/uikit'
import { Pool } from 'state/types'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import ExpandedFooter from './ExpandedFooter'

interface FooterProps {
  pool: Pool
  account: string
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    outline: none;
    color: white!important;
    flex-flow: column;
    font-size: 12px;
    padding: 0;
    svg {
      margin: 0;
    }
  }
`

const CardFooterWrapper = styled(CardFooter)`
  background-color: transparent;
  border: 0px;
`

const Footer: React.FC<FooterProps> = ({ pool, account }) => {
  const { isAutoVault } = pool
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(isAutoVault ? autoTooltipText : manualTooltipText, {
    placement: 'bottom',
  })

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <CardFooterWrapper>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          {isAutoVault ? <CompoundingPoolTag /> : <ManualPoolTag />}
          {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="4px" width="14px" height="14px" color="#F9B043" />
          </Flex>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={handleExpand}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && <ExpandedFooter pool={pool} account={account} />}
    </CardFooterWrapper>
  )
}

export default Footer
