import React from 'react'
import styled from 'styled-components'
import { Flex, Heading } from '@sphynxdex/uikit'
import { CommunityTag, CoreTag } from 'components/Tags'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  
  > div {
    border: 0px;
    height: 24px;
    padding: 0 6px;
    font-size: 12px;
    margin-right: 4px;
    color: #F9B043;
    svg {
      width: 14px;
    }
  }
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, isCommunityFarm, token, quoteToken }) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Flex flexDirection="column" alignItems="center" justifyContent="center" width='100%'>
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} />
        <Flex mb="10px" flexDirection="row" alignItems="flex-end">
          <Heading style={{ color: 'white' }}>
            {lpLabel.split(' ')[0]}
          </Heading>
          <TagsContainer>
            {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
          </TagsContainer>
        </Flex>
      </Flex>
    </Wrapper >
  )
}

export default CardHeading
