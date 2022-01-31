import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: center;
  height: 110px;
  position: relative;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
    margin-bottom: 0;
    height: 130px;
    max-height: 130px;
  }
`

export const ActionTitles = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 12px;
`

export const StakeActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
  position: absolute;
  top: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    top: 10px;
  }
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
