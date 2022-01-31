import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { IconButton, Toggle, Text, Flex, useMatchBreakpoints } from '@sphynxdex/uikit'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import SearchIcon from 'components/Icon/SearchIcon'
import ToggleView, { ViewMode } from './ToggleView/ToggleView'

const ToggleWrapper = styled.div<{ isMobile?: boolean }>`
  display: flex;
  align-items: center;
  margin: ${({ isMobile }) => (isMobile ? '0px 25px 0px 0px' : '0px 25px 0px 25px')};

  ${Text} {
    margin-left: 8px;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.custom.tertiary};
  padding: 15px;
  margin: 21px 0px;
  border-radius: 3px;
  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: center;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const ControlStretch = styled(Flex)<{ isMobile?: boolean }>`
  height: 47px;
  margin: 12px 0;
  margin-right: ${({ isMobile }) => (isMobile ? '0' : '38px')};
  width: ${({ isMobile }) => (isMobile ? '100%' : 'auto')};
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.tertiary};
  > div {
    flex: 1;
    height: 47px;
    border-radius: 5px;
    box-sizing: border-box;
    // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
    background: ${({ theme }) => theme.custom.tertiary};
    > div {
      // border: 1px solid ${({ theme }) => (theme ? '#2E2E55' : '#4A5187')};
      border: 1px solid ${({ theme }) => theme.custom.currencySelectButton};
      height: 47px;
      // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
      background: ${({ theme }) => theme.custom.tertiary};
      > div {
        color: white;
      }
    }
  }
`

const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  padding: 0 20px;
  z-index: 3;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 420px;
  }
  & input {
    background: transparent;
    border: none;
    width: 100%;
    box-shadow: none;
    outline: none;
    color: white;
    font-size: 16px;
    &::placeholder {
      color: white;
    }
  }
`

const MenuWrapper = styled.div`
  position: absolute;
  width: 100%;
  background: #131313;
  color: #eee;
  margin-top: 12px;
  overflow-y: auto;
  max-height: 90vh;
  & a {
    color: white !important;
  }
  & .selectedItem {
    background: rgba(0, 0, 0, 0.4);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 600px;
  }
`

const ContractCard = styled(Text)<{ isMobile?: boolean }>`
  padding: 0 4px;
  width: ${({ isMobile }) => (isMobile ? '100%' : 'auto')};
  height: 47px;
  text-overflow: ellipsis;
  border-radius: 16px;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.custom.currencySelectButton};
  border-radius: 5px;
  margin: 12px 0;
  & button:last-child {
    background: ${({ theme }) => theme.custom.pancakePrimary};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
    margin: 0;
    border: 1px solid ${({ theme }) => theme.custom.currencySelectButton};
    // border: 1px solid ${({ theme }) => (theme ? '#2E2E55' : '#4A5187')};
    border-radius: 5px;
  }
`
const TransparentIconButton = styled(IconButton)`
  background-color: transparent !important;
  margin: 0px 3px;
  border: none;
  outline: none !important;
`

const SearchPannel = ({ stakedOnly, setStakedOnly, viewMode, setViewMode, setSortOption, setSearchQuery }) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [showDrop, setShowDrop] = useState(false)
  const [data, setdata] = useState([])

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const handlerChange = (e: any) => {
    setSearchQuery(e.target.value)
  }

  const submitFuntioncall = () => {
    console.log('search')
  }

  const viewModeToggle = <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
  const stakedOnlySwitch = (
    <ToggleWrapper isMobile={isMobile}>
      <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
      <Text color="white"> {t('Staked only')}</Text>
    </ToggleWrapper>
  )

  return (
    <ViewControls>
      <ControlStretch isMobile={isMobile}>
        <Select
          options={[
            {
              label: t('Hot'),
              value: 'hot',
            },
            {
              label: t('APR'),
              value: 'apr',
            },
            {
              label: t('Earned'),
              value: 'earned',
            },
            {
              label: t('Total staked'),
              value: 'totalStaked',
            },
          ]}
          onChange={handleSortOptionChange}
        />
      </ControlStretch>
      <ContractCard isMobile={isMobile}>
        <SearchInputWrapper>
          <input placeholder="Search pools" onChange={handlerChange} />
          {showDrop && (
            <MenuWrapper>
              {
                data.length > 0 ? <span>ddd</span> : null
                // <span style={{ padding: '0 16px' }}>no pool</span>
              }
            </MenuWrapper>
          )}
        </SearchInputWrapper>
        <TransparentIconButton onClick={submitFuntioncall}>
          <SearchIcon width="22px" height="22px" color={useTheme().colors.primary} />
        </TransparentIconButton>
      </ContractCard>
      <Flex justifyContent="center" alignItems="center" width={isMobile ? '100%' : 'auto'} height="47px">
        {stakedOnlySwitch}
        {viewModeToggle}
      </Flex>
    </ViewControls>
  )
}

export default SearchPannel
