import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { IconButton, Text, Flex, useMatchBreakpoints } from '@sphynxdex/uikit'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import SearchIcon from 'components/Icon/SearchIcon'
import { FILTER_OPTION } from 'config/constants/fairlaunch'

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  align-items: center;
  width: 100%;
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.tertiary};
  padding: 0px 15px;
  margin: 21px 0px;
  border-radius: 3px;
  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: center;

    > div {
      padding: 0;
    }
  }
`

const ControlStretch = styled(Flex) <{ isMobile?: boolean }>`
  height: 47px;
  margin: 12px 0;
  margin-right: ${({ isMobile }) => (isMobile ? '0' : '38px')};
  width: ${({ isMobile }) => (isMobile ? '100%' : 'auto')};
  background: ${({ theme }) => theme.custom.tertiary};
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  > div {
    flex: 1;
    height: 47px;
    border-radius: 5px;
    box-sizing: border-box;
    background: ${({ theme }) => theme.custom.tertiary};
    // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
    > div {
      // border: 1px solid ${({ theme }) => (theme ? '#2E2E55' : '#4A5187')};
      border: 1px solid ${({ theme }) => theme.custom.currencySelectButton};
      height: 47px;
      background: ${({ theme }) => theme.custom.tertiary};
      // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
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

const ContractCard = styled(Text) <{ isMobile?: boolean }>`
  padding: 0 4px;
  width: ${({ isMobile }) => (isMobile ? '100%' : 'auto')};
  height: 47px;
  text-overflow: ellipsis;
  border-radius: 16px;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.custom.currencySelectButton};
  // border: 1px solid ${({ theme }) => (theme ? '#2E2E55' : '#4A5187')};
  border-radius: 5px;
  margin: 12px 0;
  & button:last-child {
    background: ${({ theme }) => theme.custom.pancakePrimary};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
    border: 1px solid ${({ theme }) => theme.custom.currencySelectButton};
    border-radius: 5px;
  }
`
const TransparentIconButton = styled(IconButton)`
  background-color: transparent !important;
  margin: 0px 3px;
  border: none;
  outline: none !important;
  box-shadow: none;
}
`

interface PropsFunction {
  setSearchOption: (o) => void
  setSearchKey: (k) => void
  setPageIndex: (i) => void
}

const SearchPanel: React.FC<PropsFunction> = ({ setSearchOption, setSearchKey, setPageIndex }) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [query, setQuery] = useState('')

  const handleSortOptionChange = (option: OptionProps): void => {
    setPageIndex(0)
    setSearchOption(option.value)
  }

  const handlerChange = (e: any) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      setPageIndex(0)
      setSearchKey(query)
    }
  }

  const submitFuntioncall = () => {
    setSearchKey(query)
  }

  return (
    <ViewControls>
      <ControlStretch isMobile={isMobile}>
        <Select
          options={[
            {
              label: t('ALL'),
              value: FILTER_OPTION.ALL,
            },
            {
              label: t('Upcoming'),
              value: FILTER_OPTION.UPCOMING,
            },
            {
              label: t('Success'),
              value: FILTER_OPTION.SUCCESS,
            },
            {
              label: t('Failed'),
              value: FILTER_OPTION.FAILED,
            },
          ]}
          onChange={handleSortOptionChange}
        />
      </ControlStretch>
      <ContractCard isMobile={isMobile}>
        <SearchInputWrapper>
          <input placeholder="Search" onChange={handlerChange} onKeyDown={handleKeyDown} />
        </SearchInputWrapper>
        <TransparentIconButton onClick={submitFuntioncall}>
          <SearchIcon width="22px" height="22px" color={useTheme().colors.primary} />
        </TransparentIconButton>
      </ContractCard>
    </ViewControls>
  )
}

export default SearchPanel
