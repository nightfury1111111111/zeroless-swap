/* eslint-disable */
import React, { useCallback } from 'react'
import styled, { ThemeConsumer, useTheme } from 'styled-components'
import { useModal, Flex, Box, Text, useMatchBreakpoints } from '@sphynxdex/uikit'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Spinner from 'components/Loader/Spinner'
import { AppState } from '../../../state'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import DownArrow from 'assets/svg/icon/LotteryDownIcon.svg'
import PotContentTable from './PotContentTable'
import { claimTickets } from '../../../hooks/useLottery'
import ViewTickets from './ViewTickets'
import useToast from 'hooks/useToast'
import LatestWinningNumbers from './LatestWinningNumbers'
import LotteryLatestIcon from 'assets/images/winning-mark.png'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'

import { FormattedNumber } from './FormattedNumber'
import { SPHYNX_TOKEN_ADDRESS } from 'config/constants'
import { getDate, format } from 'date-fns'

const Container = styled.div<{ isDetail: boolean }>`
  width: 100%;
  // background: ${({ theme }) => (theme ? '#1A1A3A' : '#20234E')};
  background: ${({ theme }) => theme.custom.background};
  border-radius: 10px;
  position: relative;
`

const HeaderLabel = styled.div`
  font-family: Raleway;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: white;
  text-align: center;
  margin: 0px 9px 5px 9px;
`

const DetailContainer = styled.div<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  color: #ffffff;
  font-size: 20px;
  font-family: Raleway;
  font-style: normal;
  font-weight: bold;
  align-items: center;
  font-size: ${({ isMobile }) => (isMobile ? '16px' : '18px')};
`
const SummaryContainer = styled.div<{ isMobile?: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '30%')};
  text-align: ${({ isMobile }) => (isMobile ? 'center' : 'left')};
  padding-left: ${({ isMobile }) => (isMobile ? '0' : '30px')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const InfoContainer = styled.div<{ isMobile?: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '70%')};
  font-size: 14px;
  display: flex;
  flex-direction: column;
  margin: 10px;
  align-items: ${({ isMobile }) => (isMobile ? 'center' : 'left')};
`

const NavigationButtonContainer = styled.div`
  color: #ffffff;
  position: absolute;
  right: 10px;
  top: 10px;
  & > svg {
    transition: 0.5s all;
    cursor: pointer;
    &: hover {
      transform: scale(1.3);
      color: ${({ theme }) => theme.custom.primary};
      opacity: 0.65;
    }
  }
`
// { color: '#F2C94C', fontSize: '14px', marginTop:'30%'}
const FootdivWrapper = styled.div<{ isMobile?: boolean }>`
  color: #f2c94c;
  font-size: 14px;
  margin-top: ${({ isMobile }) => (isMobile ? '20px' : '30%')};
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #f2c94c;
  justify-content: center;
`

const WinningContainer = styled(Flex)`
  padding: 20px 4px;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.xl} {
    align-items: center;
  }
`

export default function SummaryCard({
  isNext,
  setModal,
  roundID,
  lotteryInfo,
  lastLoteryInfo,
  userTicketInfos,
  winningCards,
  historyType,
}) {
  const [showDetail, setShowDetail] = React.useState(false)
  const { t } = useTranslation()

  //Temp State: round

  const [round, setRound] = React.useState(330)
  const [toastMessage, setToastMessage] = React.useState({
    title: '',
    message: '',
  })
  const { toastSuccess, toastError } = useToast()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  //=============================TempData==============================//
  //     if historyType is "all" or "your", fetch corresponding data   //
  //===================================================================//

  interface dataProp {
    round?: number
    date?: string
    price?: number
    tokenNum?: number
    totalPlayer?: number
  }

  let tmpData: dataProp = {
    round: 330,
    date: format(new Date(2014, 1, 11), 'yyyy-mm-dd hh:mm:ss'),
    price: 109007,
    tokenNum: 9064,
    totalPlayer: 1032,
  }

  //===================================================//
  //         fetch corresponding data example          //
  //===================================================//

  const handleFirst = () => {
    if (round > 1) setRound(1)
  }

  const handleLast = () => {
    if (round < 330) setRound(330)
  }

  const handlePrev = () => {
    if (round > 1) setRound(round - 1)
  }

  const handleNext = () => {
    if (round < 330) setRound(round + 1)
  }

  /**=============================TempData==============================**/

  const handleShowDetail = useCallback(() => {
    setShowDetail(!showDetail)
  }, [showDetail])

  return (
    <Container isDetail={showDetail}>
      <Flex flexDirection="column" alignItems="center" pt={isNext ? '15px' : '8px'} style={{ position: 'relative' }}>
        <NavigationButtonContainer>
          <FirstPageIcon onClick={handleFirst} className="next-button" />
          <NavigateBeforeIcon onClick={handlePrev} />
          <NavigateNextIcon onClick={handleNext} />
          <LastPageIcon onClick={handleLast} />
        </NavigationButtonContainer>
        <img width="60px" height="57px" src={MainLogo} alt="Logo" />
        <div style={{ paddingTop: '8px' }}>
          <HeaderLabel>
            Round <span style={{ color: '#F2C94C' }}>{round}</span>
          </HeaderLabel>
          <HeaderLabel style={{ color: '#F2C94C' }}>
            {tmpData.date}
            {/* {tmpData.date.getFullYear()}{':'}{tmpData.date.getMonth()+1}{':'}{tmpData.date.getDate()}{' '}{tmpData.date.getHours()}{':'}{tmpData.date.getMinutes()} */}
          </HeaderLabel>
        </div>
        <div style={{ backgroundColor: '#d1d1e0', height: '1px', width: '100%' }}></div>
      </Flex>
      <WinningContainer>
        <Flex marginRight="14px">
          <img src={LotteryLatestIcon} height={isMobile ? '30px' : '70px'} alt="" />
        </Flex>
        <Flex flexDirection="column" justifyContent="space-between">
          <Text fontSize={isMobile ? "12px" : "20px"} fontWeight="600" color="white" lineHeight="130%">
            {t('Winning Numbers')}
          </Text>
          <LatestWinningNumbers winningCardNumbers={winningCards} size={isMobile ? "20" : "33"} numberWidth="15px" numberHeight="11px" />
        </Flex>
      </WinningContainer>

      {!isNext && (
        <>
          <Box width="100%">
            <Footer onClick={handleShowDetail}>
              {showDetail ? t('Hide') : t('Details')}
              <img style={{ margin: '4px 0px 14px' }} width="11px" height="14px" src={DownArrow} alt="Logo" />
            </Footer>
          </Box>
        </>
      )}
      {showDetail && (
        <DetailContainer isMobile={isMobile}>
          <SummaryContainer isMobile={isMobile}>
            <div>
              {t('Prize Pot')}
              <div style={{ color: '#F2C94C', marginTop: '20px' }}>~${tmpData.price}</div>
              <div style={{ color: '#F2C94C', marginTop: '20px', fontSize: '14px' }}>{tmpData.tokenNum} SPHYNX</div>
            </div>
            <FootdivWrapper isMobile={isMobile}>Total players this round {tmpData.totalPlayer}</FootdivWrapper>
          </SummaryContainer>
          <InfoContainer isMobile={isMobile}>
            <div style={{ padding: '10px' }}>Match the winning number to share the prize</div>
            <PotContentTable isDetail lotteryInfo={lastLoteryInfo} />
          </InfoContainer>
        </DetailContainer>
      )}
    </Container>
  )
}
