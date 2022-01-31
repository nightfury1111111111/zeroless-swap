import React from 'react'
import styled from 'styled-components'
import { useSwapType } from 'state/application/hooks'
import { Button } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledNav = styled.div`
  text-align: center;
  display: flex;
  height: 24px;
  background: white;
  border-radius: 16px;
  & button {
    color: black;
    height: 24px;
    padding: 0 16px;
    background: transparent;
    border: none;
    box-shadow: none !important;
    outline: none;
    &:hover,
    &.active {
      background: ${({ theme }) => theme.custom.pancakePrimary} !important;
      color: white;
    }
  }
`

const SwapCardNav = () => {
  const { swapType, setSwapType } = useSwapType()
  const { t } = useTranslation()

  return (
    <StyledNav>
      <Button
        className={swapType === 'swap' ? 'active' : ''}
        id="auto-nav-link"
        onClick={() => {
          setSwapType('swap')
        }}
      >
        {t('Swap')}
      </Button>
      <Button
        className={
          swapType === 'liquidity' || swapType === 'addLiquidity' || swapType === 'removeLiquidity' ? 'active' : ''
        }
        id="liquidity-nav-link"
        onClick={() => {
          setSwapType('liquidity')
        }}
      >
        {t('Liquidity')}
      </Button>
    </StyledNav>
  )
}

export default SwapCardNav
