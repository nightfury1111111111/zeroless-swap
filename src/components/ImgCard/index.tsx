import React from 'react'
import styled from 'styled-components';
import {  Text } from '@sphynxdex/uikit'

const CardWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    border-radius: 8px;
    flex-flow: column;
    width: 30%;
`

interface ImgCardProps {
    desc?: string;
}

const ImgCard: React.FC<ImgCardProps> = ({ children, desc }) => {
    return (
        <CardWrapper>
            {children}
            <Text fontSize='16px' bold>{desc}</Text>
        </CardWrapper>
    )
}

export default ImgCard;