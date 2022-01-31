import React from 'react'
import styled from 'styled-components'

interface ToggleProps {
    current: number
    toggleFunc: () => void
}

const ToggleWrapper = styled.div`
    height: 20px;
    width: 40px;
    border-radius: 10px; 
    background: ${({ theme }) => theme.custom.pancakePrimary};
    position: relative;
    cursor: pointer;
    transition: background-color 200ms;
`

const ToggleButton = styled.div<{ current: number }>`
    width: 18px;
    height: 18px;
    border-radius: 9px;
    margin: 1px;
    position: absolute;
    background: ${({ theme }) => theme.custom.secondary};
    left: ${({ current }) => current * 10}px;
    transition: left 200ms ease-in;
`

function ThemeToggle({ current, toggleFunc }: ToggleProps) {

    return (
        <ToggleWrapper onClick={toggleFunc}>
            <ToggleButton current={current} />
        </ToggleWrapper>
    )
}

export default ThemeToggle