/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Text, Link, Flex, useModal } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import LinkIcon from 'assets/svg/icon/LinkYellow.svg'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import TicketContentTable from './TicketContentTable'
import moment from 'moment'
import ViewTickets from './ViewTickets'
import { FormattedNumber } from './FormattedNumber'
import { SPHYNX_TOKEN_ADDRESS } from 'config/constants'

const Container = styled.div<{ isDetail: boolean }>`
  min-width: 340px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 340px;
  }
`

const ButtonWrapper = styled.div`
  background: ${({ theme }) => theme.custom.pancakePrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 12px;
  padding-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: white;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
    border-radius: 10px;
  }
`
const SeperateLine = styled.div`
  border-bottom: 1px solid #ffffff;
  margin: 0px 20px;
`
export default function TicketCard({ lastLoteryInfo, roundID }) {
  const [winningCards, setWinningCard] = React.useState([])
  const [totalCount, setTotalCount] = React.useState('')
  const [endTime, setEndTime] = React.useState('')
  const [onPresentViewTicketModal] = useModal(<ViewTickets roundID={roundID} winningCards={winningCards} />)

  const [showDetail, setShowDetail] = React.useState(false)
  const { account, chainId } = useActiveWeb3React()

  React.useEffect(() => {
    const ac = new AbortController()
    if (lastLoteryInfo !== null) {
      const arrayData = []
      for (let i = 1; i <= 6; i++) {
        arrayData.push(lastLoteryInfo.finalNumber.toString().charAt(i))
      }
      setWinningCard(arrayData.reverse())
      axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/price/${SPHYNX_TOKEN_ADDRESS}`).then((response) => {
        let price = response.data.price
        let _amountCollectedInSphynx = (lastLoteryInfo?.amountCollectedInSphynx / 10 ** 18).toString()
        let prizePot = (parseFloat(_amountCollectedInSphynx) * parseFloat(price)).toFixed(5)
        setTotalCount(prizePot)
        setEndTime(
          moment(new Date(parseInt(lastLoteryInfo?.endTime) * 1000).toLocaleString())
            .format('MMM d hh a')
            .toString()
            .concat(' UTC'),
        )
      })
    }

    return () => ac.abort()
  }, [lastLoteryInfo])

  const { t } = useTranslation()
  return (
    <Container isDetail={showDetail}>
      <div style={{ display: 'flex', padding: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text bold color="white" fontSize="24px">
          {t('Round')} {roundID}
        </Text>
        <Text bold color="white" fontSize="12px">
          {endTime}
        </Text>
      </div>
      <div style={{ display: 'flex', padding: '4px 20px' }}>
        <img width="60px" height="57px" src={MainLogo} alt="Logo" />
        <div style={{ margin: '8px' }}>
          <Text bold color="white" fontSize="16px">
            {t('Winning Numbers:')}
          </Text>
          <Flex>
            {winningCards.map((item, index) => (
              <Text key={index} bold color="white" fontSize="24px">
                {item === '' ? '?' : item} {index !== winningCards.length - 1 ? ',' : ''}
              </Text>
            ))}
          </Flex>
        </div>
      </div>
      <div style={{ display: 'flex', padding: '4px 20px 32px' }}>
        <img width="60px" height="57px" src={MainLogo} alt="Logo" />
        <div style={{ margin: '8px' }}>
          <Text bold color="white" fontSize="16px">
            {t('Prize Pot:')}
          </Text>
          <Text bold color="white" fontSize="24px">
            {totalCount === 'NaN' || totalCount === '' ? (
              'Calculating'
            ) : (
              <FormattedNumber prefix="$" value={totalCount} suffix="" />
            )}
          </Text>
        </div>
      </div>
      <SeperateLine />
      <TicketContentTable lastLoteryInfo={lastLoteryInfo} />
      <ButtonWrapper style={{ margin: '65px 20px 20px' }} onClick={onPresentViewTicketModal}>
        View your ticket
      </ButtonWrapper>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '36px' }}>
        <Text bold fontSize="16px" mr="12px">
          {t('View your BscScan')}
        </Text>
        <Link external href={'https://bscscan.com/address/'.toString().concat(account)}>
          <img width="12px" height="12px" src={LinkIcon} alt="Logo" />
        </Link>
      </div>
    </Container>
  )
}
