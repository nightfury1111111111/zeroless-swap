import styled from 'styled-components'
import { Card } from '@sphynxdex/uikit'

export const StyledCard = styled(Card)<{ isFinished?: boolean }>`
  max-width: 352px;
  margin: 0 8px 24px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  // background: ${({ theme }) => (theme ? '#1A1A3A' : '#20234E')};
  background: ${({ theme }) => theme.custom.background};
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
  border-radius: 10px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
  > div {
    background: transparent;
  }
`

export default StyledCard
