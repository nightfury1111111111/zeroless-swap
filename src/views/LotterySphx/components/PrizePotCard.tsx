/* eslint-disable */
import React, { useCallback } from 'react'
import styled, { ThemeConsumer, useTheme } from 'styled-components'
import { useModal, Flex, Box } from '@sphynxdex/uikit'
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
import { FormattedNumber } from './FormattedNumber'
import { SPHYNX_TOKEN_ADDRESS } from 'config/constants'

const Container = styled.div<{ isDetail: boolean }>`
  width: 100%;
  // background: ${({ theme }) => (theme ? '#1A1A3A' : '#20234E')};
  background: ${({ theme }) => theme.custom.background};
  border-radius: 10px;
  min-height: 400px;
  position: relative;
  ${({ theme }) => theme.mediaQueries.md} {
    min-height: 500px;
  }
`
const HeaderLabel = styled.div`
  font-family: Raleway;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: white;
  margin: 0px 0px 5px 9px;
`
// background: ${(props) =>
//   !props.isEnable
//     ? props.theme
//       ? '#0E0E26'
//       : '#2A2E60'
//     : 'linear-gradient(90deg, #610D89 0%, #C42BB4 100%)'};

const ButtonWrapper = styled.div<{ isEnable: boolean; theme }>`
  background: ${(props) => (!props.isEnable ? props.theme.custom.tertiary : props.theme.custom.gradient)};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 12px;
  padding-bottom: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 19px;
  color: ${(props) => (!props.isEnable ? '#aaaaaa' : 'white')};
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
    border-radius: 10px;
  }
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  justify-content: center;
`

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, auto);
  padding: 20px 20px 0px 20px;
`
const GridHeaderItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: ${(props) => (props.isLeft ? 'left' : 'right')};
  color: white;
`
const GridItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: ${(props) => (props.isLeft ? 'left' : 'right')};
  color: white;
  padding: 6px 0px;
`

const TicketIdContainer = styled(Flex)`
  overflow-y: 'auto';
  max-height: 155px;
  ${({ theme }) => theme.mediaQueries.md} {
    overflow-y: 'auto';
    max-height: 255px;
  }
`
export default function PrizePotCard({
  isNext,
  setModal,
  roundID,
  lotteryInfo,
  lastLoteryInfo,
  userTicketInfos,
  winningCards,
}) {
  const [totalCount, setTotalCount] = React.useState('')
  const [showDetail, setShowDetail] = React.useState(false)
  const { t } = useTranslation()
  const [remainningTime, setRemainingTime] = React.useState('')
  const [enabled, setEnabled] = React.useState(false)
  const [isClaimable, setClaimable] = React.useState(false)
  const [isLoading, setLoading] = React.useState(false)
  const { account, library, chainId } = useActiveWeb3React()
  const signer = library.getSigner()
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const [toastMessage, setToastMessage] = React.useState({
    title: '',
    message: '',
  })
  const { toastSuccess, toastError } = useToast()
  const [onPresentViewTicketModal] = useModal(<ViewTickets roundID={roundID} winningCards={winningCards} />)

  React.useEffect(() => {
    if (toastMessage.title !== '' && toastMessage.title.includes('Error')) {
      toastError(t(toastMessage.title), t(toastMessage.message))
    }
    if (toastMessage.title !== '' && toastMessage.title.includes('Success')) {
      toastSuccess(t(toastMessage.title), t(toastMessage.message))
    }
    if (toastMessage.title !== '') {
      setToastMessage({
        title: '',
        message: '',
      })
    }
  }, [toastMessage])

  React.useEffect(() => {
    if (userTicketInfos?.length > 0) {
      userTicketInfos.map((item) => {
        if (item.status === true) {
          setClaimable(false)
        }
      })
    }
  }, [userTicketInfos])

  const handleClaimTickets = async () => {
    const ticketIDS = []
    const brackets = []
    userTicketInfos.map((ticket) => {
      let bracket = -1
      for (let i = 0; i <= 5; i++) {
        if (ticket.ticketnumber.charAt(i) !== winningCards[i]) {
          break
        }
        bracket = i
      }
      if (bracket >= 0) {
        ticketIDS.push(ticket.id)
        brackets.push(bracket)
      }
    })

    setLoading(true)
    await claimTickets(signer, roundID, ticketIDS, brackets, setToastMessage)
    setLoading(false)
  }

  React.useEffect(() => {
    const ac = new AbortController()
    if (lotteryInfo !== null) {
      const now = new Date()
      if (new Date().getTime() / 1000 > lotteryInfo.endTime) {
        setEnabled(false)
      } else {
        const date = new Date(lotteryInfo.endTime * 1000 - now.getTime())
        let day = Math.floor((lotteryInfo.endTime * 1000 - now.getTime()) / 24 / 3600000)
        const hours = '0'.toString().concat(date.getUTCHours().toString()).slice(-2)
        const minutes = '0'.toString().concat(date.getUTCMinutes().toString()).slice(-2)
        if (day > 0)
          setRemainingTime(
            day.toString().concat('d ').concat(hours.toString().concat('h ')).concat(minutes.toString()).concat('m'),
          )
        else setRemainingTime(hours.toString().concat('h ').concat(minutes.toString()).concat('m'))
        setEnabled(true)
      }

      axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/price/${SPHYNX_TOKEN_ADDRESS}`).then((response) => {
        let price = response.data.price
        let _amountCollectedInSphynx = (lotteryInfo?.amountCollectedInSphynx / 10 ** 18).toString()
        let prizePot = (parseFloat(_amountCollectedInSphynx) * parseFloat(price)).toFixed(5)
        setTotalCount(prizePot)
      })
    }

    return () => ac.abort()
  }, [lotteryInfo])

  const handleShowDetail = useCallback(() => {
    setShowDetail(!showDetail)
  }, [showDetail])

  const handleBuyModal = useCallback(() => {
    if (enabled) setModal()
  }, [enabled])
  const theme = useTheme()

  return (
    <Container isDetail={showDetail}>
      <Flex flexDirection="column" alignItems="center" pt={isNext ? '15px' : '8px'}>
        <img width="60px" height="57px" src={MainLogo} alt="Logo" />
        <div style={{ paddingTop: '8px' }}>
          <HeaderLabel>{isNext ? t('Next Draw in:') : t('Prize Pot')}</HeaderLabel>
          <HeaderLabel style={{ color: theme.custom.distributeContent }}>
            {isNext ? (
              enabled ? (
                remainningTime
              ) : (
                t('On sale soon')
              )
            ) : totalCount === 'NaN' || totalCount === '' ? (
              t('Calculating')
            ) : (
              <FormattedNumber prefix="$" value={totalCount} suffix="" />
            )}
          </HeaderLabel>
        </div>
      </Flex>
      {!isNext && (
        <>
          <Box mt="10px">
            <PotContentTable isDetail={false} lotteryInfo={lastLoteryInfo} />
          </Box>
          <Box width="100%">
            <ButtonWrapper isEnable style={{ margin: '30px 51px 14px' }} onClick={handleClaimTickets}>
              {t(`Claim Tickets`)}
            </ButtonWrapper>
            <Footer onClick={handleShowDetail}>
              {showDetail ? t('Hide') : t('Details')}
              <img style={{ margin: '4px 0px 14px' }} width="11px" height="14px" src={DownArrow} alt="Logo" />
            </Footer>
          </Box>
        </>
      )}
      {isNext && (
        <div style={{ margin: ' 10x 0px 30px' }}>
          <Flex style={{ flexDirection: 'column' }}>
            <Box style={{ borderBottom: `1px solid ${theme.custom.divider}`, margin: '20px 20px 0px' }}></Box>
            <Grid>
              <GridHeaderItem isLeft style={{ borderRight: `1px solid ${theme.custom.divider}` }}>
                {t('Ticket ID')}
              </GridHeaderItem>
              <GridHeaderItem isLeft={false} style={{ borderLeft: `1px solid ${theme.custom.divider}` }}>
                {t('Ticket Number')}
              </GridHeaderItem>
            </Grid>
            <TicketIdContainer>
              <Grid>
                {userTicketInfos?.map((it, index) => (
                  <React.Fragment key={index}>
                    <GridItem isLeft>{it.id}</GridItem>
                    <GridItem isLeft={false}>{it.ticketnumber.toString().slice(0, 6)}</GridItem>
                  </React.Fragment>
                ))}
              </Grid>
            </TicketIdContainer>
          </Flex>

          {isClaimable && (
            <ButtonWrapper isEnable style={{ marginTop: '10px' }} onClick={handleClaimTickets}>
              {isLoading ? <Spinner /> : t(`Check Tickets`)}
            </ButtonWrapper>
          )}
        </div>
      )}
      {showDetail && <PotContentTable isDetail lotteryInfo={lastLoteryInfo} />}
      {isNext && (
        <Box style={{ position: 'absolute', bottom: '0', width: '100%' }}>
          <ButtonWrapper isEnable={enabled} style={{ margin: '10px 20px 0px ' }} onClick={handleBuyModal}>
            {t(`Buy Now`)}
          </ButtonWrapper>
          <ButtonWrapper
            isEnable={userTicketInfos.length > 0}
            style={{ margin: '10px 20px 24px' }}
            onClick={onPresentViewTicketModal}
          >
            {t('View your ticket')}
          </ButtonWrapper>
        </Box>
      )}
    </Container>
  )
}
