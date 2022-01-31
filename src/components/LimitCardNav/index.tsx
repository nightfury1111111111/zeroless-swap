import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Field } from 'state/swap/actions'
import { Button } from '@sphynxdex/uikit'

const StyledNav = styled.div`
  display: flex;
  height: 24px;
  width: 100%;
  justify-content: center;
  background: transparent;
  border-radius: 16px;
  margin-bottom: 16px;
  button:nth-child(1) {
    width: 100%;
    max-width: 120px;
    font-weight: 600;
    font-size: 12px;
    color: white;
    height: 36px;
    padding: 0 16px;
    background: ${({ theme }) => theme.custom.autoCardBackground};
    border: 1px solid ${({ theme }) => theme.custom.autoCardBorder};
    border-radius: 16px 0px 0px 16px;
    box-shadow: none !important;
    outline: none;
    &:hover,
    &.active {
      background: ${({ theme }) => theme.custom.pancakePrimary};
      border: 1px solid ${({ theme }) => theme.custom.primary};
    }
  }
  button:nth-child(2) {
    width: 100%;
    max-width: 120px;
    font-weight: 600;
    font-size: 12px;
    color: white;
    height: 36px;
    padding: 0 16px;
    background: ${({ theme }) => theme.custom.autoCardBackground};
    border: 1px solid ${({ theme }) => theme.custom.autoCardBorder};
    border-radius: 0px;
    box-shadow: none !important;
    outline: none;
    &:hover,
    &.active {
      background: ${({ theme }) => theme.custom.pancakePrimary};
      border: 1px solid ${({ theme }) => theme.custom.primary};
    }
  }
  button:nth-child(3) {
    width: 100%;
    max-width: 120px;
    font-weight: 600;
    font-size: 12px;
    color: white;
    height: 36px;
    padding: 0 16px;
    background: ${({ theme }) => theme.custom.autoCardBackground};
    border: 1px solid ${({ theme }) => theme.custom.autoCardBorder};
    border-radius: 0px 16px 16px 0px;
    box-shadow: none !important;
    outline: none;
    &:hover,
    &.active {
      background: ${({ theme }) => theme.custom.pancakePrimary} !important;
      border: 1px solid ${({ theme }) => theme.custom.primary};
    }
  }
`

const LimitCardNav = (props) => {
  const { handleBuySellTab, fieldType } = props
  const { t } = useTranslation()
  return (
    <StyledNav>
      <Button className={fieldType === Field.BUYOUTPUT ? 'active' : ''} onClick={() => handleBuySellTab(Field.BUYOUTPUT)}>
        {t('Limit Buy')}
      </Button>
      <Button className={fieldType === Field.SELLINPUT ? 'active' : ''} onClick={() => handleBuySellTab(Field.SELLINPUT)}>
        {t('Limit Sell')}
      </Button>
      <Button className={fieldType === 'ORDER' ? 'active' : ''} onClick={() => handleBuySellTab('ORDER')}>
        {t('Your Orders')}
      </Button>
    </StyledNav>
  )
}

export default LimitCardNav