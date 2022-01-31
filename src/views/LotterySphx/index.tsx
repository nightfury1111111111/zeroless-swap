/* eslint-disable */

import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled, { useTheme } from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Nav from 'components/LotteryCardNav'
import { Button, Flex, Heading, Link, Text, Box, useModal, useMatchBreakpoints } from '@sphynxdex/uikit'
import { MenuItem } from '@material-ui/core'
import PageHeader from 'components/PageHeader'
import WebFont from 'webfontloader'
import { useTranslation } from 'contexts/Localization'
import SearchIcon from 'assets/images/search.png'
import { ReactComponent as LotteryMarkIcon } from 'assets/svg/icon/LotteryMark.svg'
import LotteryLatestIcon from 'assets/images/winning-mark.png'
import { setIsInput, typeInput } from '../../state/input/actions'
import PrizePotCard from './components/PrizePotCard'
import SummaryCard from './components/SummaryCard'
import LatestWinningCard from './components/LatestWinningCard'
import TicketCard from './components/TicketCard'
import History from './components/LotteryHistory'
import HowToPlay from './components/HowToPlay'
import LatestWinningNumbers from './components/LatestWinningNumbers'
import { isAddress, reverseString } from '../../utils'
import BuyTicketModal from './components/BuyTicketModal'
import { SwapTabs, SwapTabList, SwapTab, SwapTabPanel } from '../../components/Tab/tab'
import { useLotteryBalance, viewLotterys, viewUserInfoForLotteryId } from '../../hooks/useLottery'
import Card, { GreyCard } from '../../components/Card'
import SummaryNav from './components/SummaryNav'

import axios from 'axios'

const size = {
  xs: '320px',
  sm: '768px',
  lg: '1200px',
}
const device = {
  xs: `(max-width: ${size.xs})`,
  sm: `(max-width: ${size.sm})`,
  lg: `(max-width: ${size.lg})`,
}

const Container = styled(Flex)`
  flex-direction: column;
  margin: 35px 10px 0px;
  font-family: Raleway;
  ${({ theme }) => theme.mediaQueries.xl} {
    margin: 35px 30px 0px;
    font-family: Raleway;
  }
`
const ContractCard = styled(Text)`
  padding: 0 4px;
  max-width: 505px;
  height: 48px;
  text-overflow: ellipsis;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  & button:last-child {
    background: ${({ theme }) => theme.custom.pancakePrimary};
  }
`
const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  z-index: 3;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 420px;
  }
  & input {
    background: transparent;
    border: none;
    width: 100%;
    box-shadow: none;
    outline: none;
    color: #f7931a;
    font-size: 16px;
    &::placeholder {
      color: #8f80ba;
    }
  }
`
const MenuWrapper = styled.div`
  position: absolute;
  width: 100%;
  background: #131313;
  color: #eee;
  margin-top: 12px;
  overflow-y: auto;
  max-height: 90vh;
  & a {
    color: white !important;
  }
  & .selectedItem {
    background: rgba(0, 0, 0, 0.4);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 600px;
  }
`

const ContractPanelOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  left: 0;
  top: 0;
`
const PrizePotCardContainer = styled.div`
  display: flex;
  jusitfy-content: center;
  flex-direction: column;
  align-items: center;
  max-width: 1392px;
  margin: auto;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`
const PastDrawCardContainer = styled.div`
  display: flex;
  margin: 20px 0px 200px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: baseline;
  }
`
const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    right: 0px;
    height: auto;
    width: auto;
    visibility: visible;
  }
`
const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 382px);
    justify-content: space-between;
    align-items: center;
  }
`
const CustomTabs = styled(SwapTabs)`
  padding-top: 50px;
  ${({ theme }) => theme.mediaQueries.xl} {
    padding-top: 0px;
  }
`

// alignItems="center" justifyContent="right" border="1px solid #5E2B60" px="18px" py="20px"

const RightHeader = styled(Flex)`
  padding: 20px 4px;
  border: 1px solid ${({ theme }) => theme.custom.coloredBorder};;
  ${({ theme }) => theme.mediaQueries.xl} {
    align-items: center;
    justify-content: space-between;
    border: 1px solid ${({ theme }) => theme.custom.coloredBorder};;
    padding: 20px 18px;
  }
`

export default function Lottery() {
  const { account, library } = useActiveWeb3React()
  const signer = library.getSigner()
  const dispatch = useDispatch()
  const [winningCards, setWinningCard] = React.useState([])
  const [cursor, setCursor] = React.useState(0)
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [ticketSearch, setTicketSearch] = React.useState('')
  const [showDrop, setShowDrop] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const [data, setdata] = useState([])
  const [lastLoteryInfo, setLastLotteryInfo] = React.useState(null)
  const [forceValue, setForceValue] = useState(0) // integer state
  const [userTicketInfos, setUserInfoTickets] = React.useState([])
  const { roundID, lotteryInfo, setRefetch } = useLotteryBalance()
  const [userUpdateTicket, setUserUpdateTicket] = React.useState(0)
  const [summaryRouter, setSummaryRouter] = useState('all')
  const theme = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const setUpdateUserTicket = () => {
    setUserUpdateTicket(userUpdateTicket + 1)
  }
  const [onPresentSettingsModal] = useModal(<BuyTicketModal setUpdateUserTicket={setUpdateUserTicket} />)

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ['Raleway', 'Chilanka'],
      },
    })
  }, [])
  //
  React.useEffect(() => {
    if (lastLoteryInfo !== null) {
      const arrayData = []
      const winningCardNumber = reverseString(lastLoteryInfo.finalNumber.toString())
      for (let i = 0; i <= 5; i++) {
        arrayData.push(winningCardNumber.charAt(i))
      }
      setWinningCard(arrayData)
    }
  }, [lastLoteryInfo])

  React.useEffect(() => {
    clearInterval()
    setInterval(() => {
      setRefetch(false)
      setRefetch(true)
    }, 60 * 1000)
  }, [])
  //getting lottery status
  React.useEffect(() => {
    const ac = new AbortController()
    if (lotteryInfo !== null) {
      if (new Date().getTime() / 1000 > lotteryInfo?.endTime) {
        viewLotterys(roundID, lastLoteryInfo, setLastLotteryInfo)
      } else {
        // viewLotterys
        viewLotterys(roundID - 1, lastLoteryInfo, setLastLotteryInfo)
      }
      setCursor(lotteryInfo?.firstTicketId)
    }

    return () => ac.abort()
  }, [lotteryInfo, roundID])

  //getting user tickets

  React.useEffect(() => {
    const fetchData = async () => {
      await viewUserInfoForLotteryId(account, roundID.toString(), 0, 2500, setUserInfoTickets)
    }
    fetchData()
    setForceValue(forceValue + 1)
  }, [account, roundID, cursor, userUpdateTicket])

  const handleItemClick = (index) => {
    if (activeIndex === index) return
    if (activeIndex === 0) {
      setActiveIndex(1)
    } else {
      setActiveIndex(0)
    }
  }

  const submitFuntioncall = () => {
    dispatch(typeInput({ input: ticketSearch }))
    dispatch(
      setIsInput({
        isInput: true,
      }),
    )
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      submitFuntioncall()
    }
  }

  const onSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      if (selectedItemIndex < data.length - 1) {
        setSelectedItemIndex(selectedItemIndex + 1)
      } else {
        setSelectedItemIndex(0)
      }
    } else if (event.key === 'ArrowUp') {
      if (selectedItemIndex > 0) {
        setSelectedItemIndex(selectedItemIndex - 1)
      } else {
        setSelectedItemIndex(data.length - 1)
      }
    }
  }

  const handlerChange = async (e: any) => {
    try {
      if (e.target.value && e.target.value.length > 0) {
        axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/search/${e.target.value}`).then((response) => {
          setdata(response.data)
        })
      } else {
        setdata([])
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('errr', err.message)
    }

    const result = isAddress(e.target.value)
    if (result) {
      setTicketSearch(e.target.value)
    } else {
      setTicketSearch(e.target.value)
    }
  }

  const handleShowDrop = () => {
    setShowDrop(false)
  }

  return (
    <Container>
      <Grid>
        <Flex>
          <Flex marginRight="14px">
            <LotteryMarkIcon />
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize="26px" fontWeight="600" color="white" lineHeight="110%">
              {t('Lottery')}
            </Text>
            <Text fontSize="15px" fontWeight="600" color="white" lineHeight="130%" mt="12px">
              {t('Win Lottery if 2, 3, 4, 5 or 6 of your ticket')}
            </Text>
            <Text fontSize="15px" fontWeight="600" color="white" lineHeight="130%">
              {t('numbers matched')}
            </Text>
          </Flex>
        </Flex>
        <RightContainer>
          <RightHeader>
            <Flex marginRight="14px">
              <img src={LotteryLatestIcon} height="50px" alt="" />
            </Flex>
            <Flex flexDirection="column" justifyContent="space-between">
              <Text fontSize={isMobile ? "12px" : "20px"} fontWeight="600" color="white" lineHeight="130%">
                {t('Latest Winning Numbers')}
              </Text>
              <LatestWinningNumbers
                winningCardNumbers={winningCards}
                size={isMobile ? "20" : "33"}
                numberWidth="15px"
                numberHeight="11px"
              />
            </Flex>
          </RightHeader>
        </RightContainer>
      </Grid>
      <CustomTabs selectedTabClassName="is-selected" selectedTabPanelClassName="is-selected">
        <SwapTabList>
          <SwapTab>
            <Text textAlign="center" fontSize="14px" bold textTransform="capitalize" color="white">
              {t('Next Draw')}
            </Text>
          </SwapTab>
          <SwapTab>
            <Text textAlign="center" fontSize="14px" bold textTransform="capitalize" color="white">
              {t('Past Draw')}
            </Text>
          </SwapTab>
        </SwapTabList>
        <Card bgColor={theme.custom.tertiary} borderRadius="0 0 3px 3px" padding={isMobile ? "40px 5px" : "40px"}>
          {/* <Card bgColor={theme ? '#0E0E26' : '#2A2E60'} borderRadius="0 0 3px 3px" padding="40px"> */}
          <SwapTabPanel>
            <PrizePotCardContainer>
              <div style={{ margin: '16px', width: '100%' }}>
                {forceValue > 0 && (
                  <PrizePotCard
                    isNext={false}
                    setModal={null}
                    roundID={roundID}
                    lotteryInfo={lotteryInfo}
                    lastLoteryInfo={lastLoteryInfo}
                    userTicketInfos={userTicketInfos}
                    winningCards={winningCards}
                  />
                )}
              </div>
              <div style={{ margin: '16px', width: '100%' }}>
                {forceValue > 0 && (
                  <PrizePotCard
                    isNext
                    setModal={onPresentSettingsModal}
                    roundID={roundID}
                    lotteryInfo={lotteryInfo}
                    lastLoteryInfo={lastLoteryInfo}
                    userTicketInfos={userTicketInfos}
                    winningCards={winningCards}
                  />
                )}
              </div>
              <div style={{ margin: '16px', width: '100%' }}>
                {forceValue > 0 && <LatestWinningCard winningCards={winningCards} />}
              </div>
            </PrizePotCardContainer>
          </SwapTabPanel>
          <SwapTabPanel>
            <SummaryNav setRouter={setSummaryRouter} router={summaryRouter} />
            <div style={{ marginTop: '16px', width: '100%' }}>
              {forceValue > 0 && (
                <SummaryCard
                  isNext={false}
                  setModal={null}
                  roundID={roundID}
                  lotteryInfo={lotteryInfo}
                  lastLoteryInfo={lastLoteryInfo}
                  userTicketInfos={userTicketInfos}
                  winningCards={winningCards}
                  historyType={summaryRouter}
                />
              )}
            </div>
          </SwapTabPanel>
        </Card>
      </CustomTabs>
      {activeIndex === 1 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContractCard>
              <img src={SearchIcon} style={{ marginLeft: '4px' }} alt="search" />
              <SearchInputWrapper>
                <input
                  placeholder=""
                  value={ticketSearch}
                  onFocus={() => setShowDrop(true)}
                  onKeyPress={handleKeyPress}
                  onKeyUp={onSearchKeyDown}
                  onChange={handlerChange}
                />
                {showDrop && (
                  <MenuWrapper>
                    {data.length > 0 ? (
                      <span>
                        {data?.map((item: any, index: number) => {
                          return (
                            <Link href={`/swap/${item.address}`}>
                              <MenuItem className={index === selectedItemIndex ? 'selectedItem' : ''}>
                                {item.name}
                                <br />
                                {item.symbol}
                                <br />
                                {item.address}
                              </MenuItem>
                            </Link>
                          )
                        })}
                      </span>
                    ) : (
                      <span style={{ padding: '0 16px' }}>no record</span>
                    )}
                  </MenuWrapper>
                )}
              </SearchInputWrapper>
              <Button scale="sm" onClick={submitFuntioncall} style={{ height: 'inherit' }}>
                {t(`Search`)}
              </Button>
            </ContractCard>
          </div>
          <PastDrawCardContainer>
            <div style={{ margin: '10px' }}>
              <TicketCard lastLoteryInfo={lastLoteryInfo} roundID={roundID - 1} />
            </div>
            <div style={{ margin: '10px' }}>
              <History />
            </div>
          </PastDrawCardContainer>
          {showDrop && <ContractPanelOverlay onClick={handleShowDrop} />}
        </>
      )}
      <Flex mt="24px">
        <HowToPlay />
      </Flex>
    </Container>
  )
}
