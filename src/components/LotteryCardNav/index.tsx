import React from 'react'
import styled from 'styled-components'
import { Button } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledNav = styled.div`
  text-align: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  padding: 20px 0px;
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
const ButtonMenu = styled.div`
  background-color: #FFFFFF;
  color: #0A0A10;
  border-radius: 16px;
  display: inline-flex;
  border: 1px solid #524B63;
  width: auto;
}`

const Nav = ({ activeIndex = 0, handleClick }: { activeIndex?: number; handleClick?: any }) => {
  const { t } = useTranslation()
  return (
    <StyledNav>
      <ButtonMenu>
        <Button
          className={activeIndex === 0 ? 'active' : ''}
          id="auto-nav-link"
          onClick={() => {
            handleClick(0)
          }}
        >
          {t('Next Draw')}
        </Button>
        <Button
          className={activeIndex === 1 ? 'active' : ''}
          id="dgsn-nav-link"
          onClick={() => {
            handleClick(1)
          }}
        >
          {t('Past Draw')}
        </Button>
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
