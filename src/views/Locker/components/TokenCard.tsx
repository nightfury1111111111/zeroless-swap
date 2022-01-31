import React from 'react'
import styled from 'styled-components'
import { Text } from '@sphynxdex/uikit'
import { useHistory } from 'react-router-dom'
import TimerComponent from 'components/Timer/TimerComponent'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const CardWrapper = styled.div`
  // background: ${({ theme }) => (theme ? '#040413' : '#20234e')};
  background: ${({ theme }) => theme.custom.lpCard};
  border-radius: 8px;
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
  gap: 16px;
`

const TokenSymbolWrapper = styled.div`
  div:first-child {
    font-weight: bold;
    font-size: 20px;
    text-transform: capitalize;
  }
  div:last-child {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    color: white;
    text-transform: capitalize;
  }
`

const EndTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  div:first-child {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    color: #f2c94c;
    margin-bottom: 16px;
    text-align: center;
  }
  div:last-child {
    font-weight: 600;
    white-space: nowrap;
    color: white;
    margin-bottom: 16px;
  }
`

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const SaleInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const SaleInfoTitle = styled.div`
  color: white;
  font-weight: 600;
  font-size: 14px;
`

const SaleInfoValue = styled.div`
  color: #f2c94c;
  font-weight: 600;
  font-size: 14px;
`

const AddressInfo = styled(SaleInfoValue)`
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: unset;
  }
`

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px 0px;
`
const SaleInfoWrapper = styled.div`
  padding: 24px 0px;
  width: calc(100% - 42px);
`

const TokenImg = styled.div`
  img {
    width: 64px;
    height: 64px;
    max-width: unset;
  }
`

const TokenWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  flex: 2;
`

interface TokenCardProps {
  id: number
  tokenLogo: string
  tokenSymbol: string
  tokenName: string
  startTime?: string
  endTime?: string
  amount?: number
  vestingRate?: number
  tokenAddress?: string
}

const TokenCard: React.FC<TokenCardProps> = ({
  id,
  tokenLogo,
  tokenName,
  tokenSymbol,
  startTime,
  endTime,
  amount,
  vestingRate,
  tokenAddress,
}: TokenCardProps) => {
  const history = useHistory()
  const { chainId } = useActiveWeb3React()

  const handleClicked = () => {
    history.push(`/launchpad/locker/tokendetail/${id}/${chainId}`)
  }

  return (
    <CardWrapper onClick={handleClicked}>
      <CardHeader>
        <TokenWrapper>
          <TokenImg>
            <img src={tokenLogo} alt="token icon" />
          </TokenImg>
          <TokenSymbolWrapper>
            <Text>{tokenSymbol}</Text>
            <Text>{tokenName}</Text>
          </TokenSymbolWrapper>
        </TokenWrapper>
      </CardHeader>
      <CardBody>
        <EndTimeWrapper>
          <Text>Lock end in:</Text>
          <TimerComponent time={endTime} />
        </EndTimeWrapper>
        <SaleInfoWrapper>
          <SaleInfo>
            <SaleInfoTitle>Lock started:</SaleInfoTitle>
            <SaleInfoValue>{new Date(parseInt(startTime) * 1000).toLocaleString()}</SaleInfoValue>
          </SaleInfo>
          <Divider />
          <SaleInfo>
            <SaleInfoTitle>Amount:</SaleInfoTitle>
            <SaleInfoValue>
              {amount} {tokenSymbol}
            </SaleInfoValue>
          </SaleInfo>
          <Divider />
          <SaleInfo>
            <SaleInfoTitle>Vesting Percent:</SaleInfoTitle>
            <SaleInfoValue>{vestingRate}%</SaleInfoValue>
          </SaleInfo>
          <Divider />
          <SaleInfo>
            <SaleInfoTitle style={{ marginRight: '10px' }}>Address:</SaleInfoTitle>
            <AddressInfo>{tokenAddress}</AddressInfo>
          </SaleInfo>
          <Divider />
        </SaleInfoWrapper>
      </CardBody>
    </CardWrapper>
  )
}

export default TokenCard
