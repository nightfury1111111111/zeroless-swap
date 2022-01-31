import React, { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Flex } from '@sphynxdex/uikit'
import { Pool } from 'state/types'
import { useCakeVault } from 'state/pools/hooks'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './ActionPanel/ActionPanel'

interface PoolRowProps {
  pool: Pool
  account: string
  userDataLoaded: boolean
}

const StyledRow = styled.div<{ expanded, isMobile }>`
  background-color: transparent;
  display: flex;
  flex-direction: ${({ isMobile }) => isMobile ? 'column' : 'row'}; 
  cursor: pointer;
  border-bottom: ${({ expanded, theme }) => expanded ? `0px solid ${theme.custom.divider}` : `1px solid ${theme.custom.divider}`};
`

const PoolRow: React.FC<PoolRowProps> = ({ pool, account, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const {
    fees: { performanceFee },
  } = useCakeVault()
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  return (
    <>
      <StyledRow role="row" expanded={expanded} isMobile={isMobile} onClick={toggleExpanded}>
        <Flex width={isMobile ? '100%' : '60%'}>
          <NameCell pool={pool} />
          <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
          <AprCell pool={pool} performanceFee={performanceFeeAsDecimal} />
        </Flex>
        <Flex width={isMobile ? '100%' : '40%'}>
          {/* {(isLg || isXl) && <TotalStakedCell pool={pool} />}
          {isXl && <EndsInCell pool={pool} />} */}
          <TotalStakedCell pool={pool} />
          <EndsInCell pool={pool} />
          <ExpandActionCell expanded={expanded} isFullLayout={isMd || isLg || isXl} />
        </Flex>
      </StyledRow>
      {shouldRenderActionPanel && (
        <ActionPanel
          account={account}
          pool={pool}
          userDataLoaded={userDataLoaded}
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl }}
        />
      )}
    </>
  )
}

export default PoolRow
