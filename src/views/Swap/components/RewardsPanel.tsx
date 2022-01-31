import React from 'react'
import styled from 'styled-components'
import { Flex } from '@sphynxdex/uikit'
import SwapFeeRewards from './SwapFeeRewards'
import TotalTransactionCollected from './TotalTransactionCollected'
import SphynxByBack from './SphynxByBack'
import DistributionIn from './DistributionIn'

const Wrapper = styled.div`
  color: white;
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;
  justify-content: center;
  & > div {
    flex-wrap: wrap;
    & > div:first-child {
      width: 100%;
    }
    & > div:nth-child(2) {
      width: 100%;
    }
    & > div:nth-child(2) {
      width: 100%;
    }
    & > div:nth-child(4) {
      width: 100%;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      flex-wrap: nowrap;
      & > div:first-child {
        width: unset;
      }
      & > div:nth-child(2) {
        width: unset;
      }
      & > div:nth-child(2) {
        width: unset;
      }
      & > div:nth-child(4) {
        width: unset;
      }
    }
  }
`

const RewardsPanel: React.FC = () => {
  return (
    <Wrapper style={{ width: '100%' }}>
      <Flex justifyContent="space-between" alignItems="center">
        <SwapFeeRewards />
        <TotalTransactionCollected />
        <DistributionIn />
        <SphynxByBack />
      </Flex>
    </Wrapper>
  )
}

export default RewardsPanel
