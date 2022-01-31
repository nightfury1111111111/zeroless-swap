import React from 'react'
import styled from 'styled-components'
import { Text } from '@sphynxdex/uikit'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SEARCH_OPTION } from 'config/constants/launchpad'
import TimerComponent from 'components/Timer/TimerComponent'
import ContractHelper from 'components/ContractHelper'
import DefaultLogoIcon from 'assets/images/MainLogo.png'
import { ChainId } from '@sphynxdex/sdk-multichain'

const CardWrapper = styled.div`
  // background: ${({ theme }) => (theme ? '#040413' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.inputWrapper};
  border-radius: 8px;
  cursor: pointer;
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

const CardFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-bottom: 37px;
  div:last-child {
    text-align: center;
    font-size: 14px;
    color: white;
  }
`

const ActiveSaleText = styled.span<{ state }>`
  color: ${(props) => (props.state === 'active' ? '#00AC1C' : props.state === 'pending' ? '#FFC700' : 'white')};
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.2em;
`

const ProgressBarWrapper = styled.div`
  width: 100%;
`

const ProgressBar = styled.div`
  margin: 8px 24px;
  background-color: #23234b;
  border-radius: 8px;
  position: relative;
`

const Progress = styled.div<{ state }>`
  width: ${(props) => `${props.state}%`};
  height: 16px;
  background: ${({ theme }) => theme.custom.gradient};
  border-radius: 8px;
  padding: 1px;
  display: flex;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`

const SaleInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  // padding: 0px 24px;
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

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.custom.divider};;
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

const groupColor = {
  [SEARCH_OPTION.GOLD]: '#ffbb00',
  [SEARCH_OPTION.SILVER]: '#ccc',
  [SEARCH_OPTION.BRONZE]: '#c85',
  [SEARCH_OPTION.OTHER]: '#4FD',
}

interface ImgCardProps {
  saleId: number
  ownerAddress: string
  tokenSymbole?: string
  tokenName?: string
  tokenLogo?: string
  activeSale?: number
  totalCap?: number
  softCap?: number
  hardCap?: number
  minContribution?: number
  maxContribution?: number
  startTime?: string
  endTime?: string
  tokenState?: string
  level?: number
}

const TokenCard: React.FC<ImgCardProps> = ({
  saleId,
  ownerAddress,
  tokenSymbole,
  tokenName,
  tokenLogo,
  activeSale,
  softCap,
  hardCap,
  totalCap,
  minContribution,
  maxContribution,
  startTime,
  endTime,
  tokenState,
  level,
}: ImgCardProps) => {
  const history = useHistory()
  const { account, chainId } = useActiveWeb3React()
  const nativeCurrency = chainId === ChainId.ETHEREUM ? 'ETH' : 'BNB'
  const now = Math.floor(new Date().getTime() / 1000)

  const handleClicked = () => {
    if (account === ownerAddress) {
      history.push(`/launchpad/presale/${saleId}/${chainId}`)
    } else {
      history.push(`/launchpad/live/${saleId}/${chainId}`)
    }
  }

  return (
    <CardWrapper onClick={handleClicked}>
      <CardHeader>
        <TokenWrapper>
          <TokenImg>
            <img src={tokenLogo === '' ? DefaultLogoIcon : tokenLogo} alt="token icon" />
          </TokenImg>
          <TokenSymbolWrapper>
            <Text>{tokenSymbole}</Text>
            <Text>{tokenName}</Text>
          </TokenSymbolWrapper>
        </TokenWrapper>
        <EndTimeWrapper style={{ fontWeight: 'bold', color: groupColor[level] }}>
          {level === SEARCH_OPTION.GOLD
            ? 'GOLD'
            : level === SEARCH_OPTION.SILVER
              ? 'SILVER'
              : level === SEARCH_OPTION.BRONZE
                ? 'BRONZE'
                : 'OTHER'}
        </EndTimeWrapper>
      </CardHeader>
      <CardBody>
        <EndTimeWrapper>
          {now >= parseInt(startTime) ? (
            <>
              <Text>Sale end in:</Text>
              <TimerComponent time={endTime} />
            </>
          ) : (
            <>
              <Text>Sale start in:</Text>
              <TimerComponent time={startTime} />
            </>
          )}
        </EndTimeWrapper>
        <ActiveSaleText state={tokenState}>
          {tokenState !== 'ended' ? `${tokenState} Sale` : 'Sale Ended'}
        </ActiveSaleText>
        <ProgressBarWrapper>
          <ProgressBar>
            <Progress state={activeSale}>{activeSale.toFixed(2)}%</Progress>
          </ProgressBar>
        </ProgressBarWrapper>
        <SaleInfoWrapper>
          <SaleInfo>
            <SaleInfoTitle>Raised:</SaleInfoTitle>
            <SaleInfoValue>
              {totalCap}/{hardCap}
            </SaleInfoValue>
          </SaleInfo>
          <Divider />
          <SaleInfo>
            <SaleInfoTitle>Soft Cap / Hard Cap:</SaleInfoTitle>
            <SaleInfoValue>
              {softCap}/{hardCap} {nativeCurrency}
            </SaleInfoValue>
          </SaleInfo>
          <Divider />
          <SaleInfo>
            <SaleInfoTitle>Min/Max Contribution:</SaleInfoTitle>
            <SaleInfoValue>
              {minContribution}/{maxContribution} {nativeCurrency}
            </SaleInfoValue>
          </SaleInfo>
          <Divider />
        </SaleInfoWrapper>
      </CardBody>
      <CardFooter>
        <ContractHelper text="Tokens can be clones and can have the same name as existing coins. Token creators can pretend to be owners of the real project. Please use provided social links to research and examine every project to avoid scams." />
        <Text>Custom Contract</Text>
      </CardFooter>
    </CardWrapper>
  )
}

export default TokenCard
