import React, { useRef } from 'react'
import styled from 'styled-components'
import { useTable, Button, ChevronUpIcon, ColumnType, useMatchBreakpoints } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'

import Row, { RowProps } from './Row'

export interface ITableProps {
  data: RowProps[]
  columns: ColumnType<RowProps>[]
  userDataReady: boolean
  sortColumn?: string
}

const Container = styled.div<{ isMobile?: boolean }>`
  padding: ${({ isMobile }) => isMobile ? '10px' : '5px 40px 20px 40px'};
  background-color: transparent;
`

const TableWrapper = styled.div`
  overflow: visible;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const TableContainer = styled.div`
  position: relative;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const FarmTable: React.FC<ITableProps> = (props) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { data, columns, userDataReady } = props

  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <Container isMobile={isMobile}>
      {/* <TableContainer> */}
      <TableWrapper role="table" ref={tableWrapperEl}>
        {/* <StyledTable> */}
        {/* <TableBody> */}
        {rows.map((row) => {
          return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
        })}
        {/* </TableBody> */}
        {/* </StyledTable> */}
      </TableWrapper>
      {/* <ScrollButtonContainer>
          <Button variant="text" color="white" onClick={scrollToTop} style={{ color: 'white' }}>
            {t('To Top')}
            <ChevronUpIcon color="white" />
          </Button>
        </ScrollButtonContainer> */}
      {/* </TableContainer> */}
    </Container>
  )
}

export default FarmTable
