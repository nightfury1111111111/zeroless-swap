import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Link } from '@sphynxdex/uikit'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SEARCH_OPTION } from 'config/constants/launchpad'
import DefaultLogoIcon from 'assets/images/MainLogo.png'
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'
import LockIcon from '@material-ui/icons/Lock'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import GitIcon from 'assets/images/githubIcon.png'
import RedditIcon from 'assets/images/redditIcon.png'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'
// import { ReactComponent as DiscordIcon } from 'assets/svg/icon/DiscordIcon.svg'

const CardWrapper = styled.div`
  background: ${({ theme }) => (theme.isDark ? '#040413' : '#2A2E60')};
  border-radius: 8px;
  cursor: pointer;
  padding: 20px;
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

const ProgressBarWrapper = styled.div`
  width: 100%;
`

const ProgressBar = styled.div`
  margin: 0px 0px;
  background-color: #23234b;
  border-radius: 8px;
  position: relative;
`

const Progress = styled.div<{ state }>`
  width: ${(props) => `${props.state}%`};
  height: 22px;
  background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
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

const TokenImg = styled.div`
  img {
    width: 64px;
    height: 64px;
    margin-right: 20px;
    border-radius: 50%;
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

const Spacer = styled.div`
  flex-grow: 1!important;
`

const SocialIconsWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`

const groupColor = {
  [SEARCH_OPTION.GOLD]: '#ffbb00',
  [SEARCH_OPTION.SILVER]: '#ccc',
  [SEARCH_OPTION.BRONZE]: '#c85',
  [SEARCH_OPTION.OTHER]: '#4FD'
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
  defaultRouterRate?: number
  routerRate?: number
  unlock?: number
  totalTokenSupply?: number
  raise?: number
  websiteLink?: string
  githubLink?: string
  twitterLink?: string
  redditLink?: string
  telegramLink?: string
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

  defaultRouterRate,
  routerRate,
  unlock,
  totalTokenSupply,
  raise,
  websiteLink,
  githubLink,
  twitterLink,
  redditLink,
  telegramLink,
}: ImgCardProps) => {
  const history = useHistory()
  const { account, chainId } = useActiveWeb3React()

  const handleClicked = () => {
    if (account === ownerAddress) {
      history.push(`/launchpad/presale/${saleId}/${chainId}`)
    } else {
      history.push(`/launchpad/live/${saleId}/${chainId}`)
    }
  }

  const getDifferenceInDays = (dateLeft = endTime, dateRight = startTime) => {
    return differenceInDays(new Date(parseInt(dateLeft) * 1000), new Date(parseInt(dateRight) * 1000))
  }

  const getDifferenceInHours = (dateLeft = endTime, dateRight = startTime) => {
    return differenceInHours(new Date(parseInt(dateLeft) * 1000), new Date(parseInt(dateRight) * 1000))
  }

  const getDifferenceInMinutes = (dateLeft = endTime, dateRight = startTime) => {
    return differenceInMinutes(new Date(parseInt(dateLeft) * 1000), new Date(parseInt(dateRight) * 1000))
  }

  const getDifferenceInSeconds = (dateLeft = endTime, dateRight = startTime) => {
    return differenceInSeconds(new Date(parseInt(dateLeft) * 1000), new Date(parseInt(dateRight) * 1000))
  }

  const getStartsInText = () => {
    if ((Date.now() / 1000) > parseInt(endTime)) return 'Ended'
    
    const differenceInDays = getDifferenceInDays(startTime, `${Date.now() / 1000}`)
    if (differenceInDays > 0) return `Starts in ${differenceInDays} days`

    const differenceInHours = getDifferenceInHours(startTime, `${Date.now() / 1000}`)
    if (differenceInHours > 0) return `Starts in ${differenceInHours} hours`

    const differenceInMinutes = getDifferenceInMinutes(startTime, `${Date.now() / 1000}`)
    if (differenceInMinutes > 0) return `Starts in ${differenceInMinutes} hours`

    const differenceInSeconds = getDifferenceInSeconds(startTime, `${Date.now() / 1000}`)
    if (differenceInSeconds > 0) return `Starts in ${differenceInSeconds} hours`

    return 'Active'
  }

  return (
    <CardWrapper onClick={handleClicked}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
        <TokenImg>
          <img src={tokenLogo === '' ? DefaultLogoIcon : tokenLogo} alt="token icon" />
        </TokenImg>
        <div style={{flex: '1 1 0%'}}>
          <Flex>
            <TokenWrapper>
              <TokenSymbolWrapper>
                <Text>{tokenSymbole}</Text>
                <Text fontSize="10px">{tokenName}</Text>
              </TokenSymbolWrapper>
            </TokenWrapper>
            <Spacer />
            <div style={{marginLeft: '20px'}}>
              <EndTimeWrapper style={{fontWeight: 'bold', color: groupColor[level]}}>
                {level === SEARCH_OPTION.GOLD
                  ? 'GOLD'
                  : level === SEARCH_OPTION.SILVER
                  ? 'SILVER'
                  : level === SEARCH_OPTION.BRONZE
                  ? 'BRONZE'
                  : 'OTHER'}
              </EndTimeWrapper>
              <SocialIconsWrapper>
                {websiteLink ? <Link external href={websiteLink} aria-label="social2">
                    <SocialIcon2 width="15px" height="15px" />
                </Link> : null}
                {githubLink ? <Link external href={githubLink} aria-label="social2">
                    <img src={GitIcon} alt="Git Logo" width="15px" height="15px" />
                </Link> : null}
                {twitterLink ? <Link external href={twitterLink} aria-label="twitter">
                    <TwitterIcon width="15px" height="15px" />
                </Link> : null}
                {redditLink ? <Link external href={redditLink} aria-label="discord">
                    <img src={RedditIcon} alt="Git Logo" width="15px" height="15px" />
                </Link> : null}
                {telegramLink ? <Link external href={telegramLink} aria-label="telegram">
                    <TelegramIcon width="15px" height="15px" />
                </Link> : null}
              </SocialIconsWrapper>
            </div>
          </Flex>
          <Flex mt="10px">
            <Text fontSize="10px"> {`Starts ${format(new Date(parseInt(startTime) * 1000), 'EEE dd MMM hh:mm')} your time`} </Text>
          </Flex>
          <Flex mt="10px">
            <LockIcon fontSize="inherit" style={{marginTop: '2px', marginRight: '5px'}} />
            <Text fontSize="14px" mr="10px">{`${defaultRouterRate + routerRate}%`}</Text>
            <Text fontSize="14px" style={{ backgroundColor: '#710d89', padding: '0px 10px', borderRadius: '10px' }}>{`${parseFloat((100 - (unlock / totalTokenSupply * 100)).toFixed(2))}%`}</Text>
          </Flex>
        </div>
      </div>
      <div style={{flex: '1 1 0%', marginBottom: '10px'}}>
        <Flex>
          <Text fontSize="12px">{`Duration ${getDifferenceInDays() > 0 ? `${getDifferenceInDays()} days` : `${getDifferenceInHours()} hours`}`}</Text>
          <Spacer />
          <Text fontSize="12px">{getStartsInText()}</Text>
        </Flex>
      </div>
      <ProgressBarWrapper>
        <ProgressBar>
          <Progress state={activeSale} />
          <div style={{flex: '1 1 0%', position: 'absolute', top: '10%', left: 0, width: '100%', alignItems: 'center', padding: '0px 15px'}}>
            <Flex>
              <Text fontSize="12px">{`${raise}/${hardCap} BNB`}</Text>
              <Spacer />
              <Text fontSize="12px">{`${maxContribution} BNB`}</Text>
            </Flex>
          </div>
        </ProgressBar>
      </ProgressBarWrapper>
    </CardWrapper>
  )
}

export default TokenCard
