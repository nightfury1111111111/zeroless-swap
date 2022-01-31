import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { useMatchBreakpoints, Flex } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useFarmUser } from 'state/farms/hooks'

import Apr, { AprProps } from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import Multiplier, { MultiplierProps } from './Multiplier'
import Liquidity, { LiquidityProps } from './Liquidity'
import ActionPanel from './Actions/ActionPanel'
import CellLayout from './CellLayout'

const StyledRow = styled.div<{ expanded, isMobile }>`
  display: flex;
  padding-top: 10px;
  background-color: transparent;
  flex-direction: ${({ isMobile }) => isMobile ? 'column' : 'row'}; 
  cursor: pointer;
  border-bottom: ${({ expanded }) => expanded ? '0px' : '1px'} solid ${({ theme }) => theme.custom.divider};
`

export interface RowProps {
  apr: AprProps
  farm: FarmProps
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const Row: React.FunctionComponent<RowPropsWithLoading> = (props) => {
  const { details, userDataReady, farm, earned, apr, multiplier, liquidity } = props
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)
  const { t } = useTranslation()

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount)
  }, [hasStakedAmount])

  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <>
      <StyledRow role="row" expanded={actionPanelExpanded} isMobile={isMobile} onClick={toggleActionPanel}>
        <Flex width={isMobile ? '100%' : '75%'}>
          <Farm {...farm} />
          <Earned {...earned} userDataReady={userDataReady} />
          <Apr {...apr} hideButton />
          <Liquidity {...liquidity} />
        </Flex>
        <Flex width={isMobile ? '100%' : '25%'}>
          <Multiplier {...multiplier} />
          <Details actionPanelToggled={actionPanelExpanded} />
        </Flex>
      </StyledRow>
      {shouldRenderChild && (
        <ActionPanel {...props} expanded={actionPanelExpanded} />
      )}
    </>
  )
}

export default Row
