import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Flex, Text } from '@sphynxdex/uikit'
import { ReactComponent as ArrowDropDownIcon } from 'assets/svg/icon/DropDownIconSmall.svg'

const DropDownHeader = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 8px;
`

const DropDownListContainer = styled.div`
  min-width: 73px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: rgb(0, 0, 0);
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 73px;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 73px;
  }
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: ${({ width }) => width}px;
  position: relative;
  background: rgb(0, 0, 0);
  height: 32px;
  min-width: 110px;
  user-select: none;
  border: 1px solid ${({ theme }) => theme.custom.global};
  border-radius:5px;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 73px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        border-top-width: 0;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 8px;
  &:hover {
    background: rgba(160, 160, 255, 0.8);
  }
`

export interface SelectProps {
  options: OptionProps[]
  onChange?: (option: OptionProps) => void
  network: string
  chainId: number
}

export interface OptionProps {
  label: string
  value: any
}

const Select: React.FunctionComponent<SelectProps> = ({ options, onChange, network, chainId }) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  React.useEffect(() => {
    if (network === 'bsc') {
      setSelectedOptionIndex(0);
    } else {
      setSelectedOptionIndex(1);
    }
  }, [network])
  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    if (chainId === 56 && options[selectedIndex].value === 'bsc') {
      return
    }
    if (chainId === 1 && options[selectedIndex].value === 'eth') {
      return
    }
    setSelectedOptionIndex(selectedIndex)
    setIsOpen(false)

    if (onChange) {
      onChange(options[selectedIndex])
    }
  }

  useEffect(() => {
    setContainerSize({
      width: dropdownRef.current.offsetWidth, // Consider border
      height: dropdownRef.current.offsetHeight,
    })

    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <DropDownContainer isOpen={isOpen} ref={containerRef} {...containerSize}>
      <Flex>
        {containerSize.width !== 0 && (
          <DropDownHeader onClick={toggling}>
            <Text fontSize="13px" fontWeight="600">{options[selectedOptionIndex].label}</Text>
          </DropDownHeader>
        )}
        <Flex onClick={toggling}>
          <ArrowDropDownIcon />
        </Flex>
      </Flex>
      <DropDownListContainer>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                <Text fontSize="13px" fontWeight="600">{option.label}</Text>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
