import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 16px;
  flex-grow: 1;
  flex-basis: 0;
  flex-direction: column;
  display: flex;
  justify-content: center;
  height: 110px;
  align-items: center;
  position: relative;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 130px;
    max-height: 130px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 0;
    height: 130px;
    max-height: 130px;
  }
`

export const ActionTitles = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xs} {
    display: flex;
  }
`

export const StakeActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
  position: absolute;
  top: 20px;
  display: flex;
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
