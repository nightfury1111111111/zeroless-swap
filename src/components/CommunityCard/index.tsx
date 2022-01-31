import React from 'react'
import styled from 'styled-components'
import { Text } from '@sphynxdex/uikit'

const CardWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 9px;
  background: ${({ theme }) => theme.custom.communityCardBackground};
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 10px;
  flex-flow: column;
  & > *:first-child {
    margin-bottom: 12px;
  }
  margin: 10px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 48%;
    padding: 18px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 24%;
    padding: 36px;
  }
`

interface ImgCardProps {
  desc?: string
}

const CommunityCard: React.FC<ImgCardProps> = ({ children, desc }) => {
  return (
    <CardWrapper>
      {children}
      <Text fontSize="16px" color="white" fontWeight="bold">
        {desc}
      </Text>
    </CardWrapper>
  )
}

export default CommunityCard
