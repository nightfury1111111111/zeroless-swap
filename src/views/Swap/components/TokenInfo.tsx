import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Flex, Text, Link } from '@sphynxdex/uikit'
import { ReactComponent as BscscanIcon } from 'assets/svg/icon/Bscscan.svg'
import CopyHelper from 'components/AccountDetails/Copy'
import { BITQUERY_API, BITQUERY_API_KEY } from 'config/constants/endpoints'
import axios from 'axios'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { AppState, AppDispatch } from '../../../state'
import { selectCurrency, Field } from '../../../state/swap/actions'
import { isAddress, getBscScanLink } from '../../../utils'
import { useTranslation } from '../../../contexts/Localization'

const TextWrapper = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  word-break: break-all;
  & a {
    color: white;
  }
  & > div:first-child {
    color: white;
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
  }
  & > div:last-child {
    font-size: 14px;
    line-height: 16px;
    color: #adb5bd;
    margin-top: 2px;
  }
  & .textWithCopy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & button {
      padding: 0;
      color: white;
    }
  }
`

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  & > img,
  span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const TokenInfoContainer = styled.div`
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.tertiary};
  border-radius: 5px;
  margin: 12px 0;
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0;
  }
`

export default function TokenInfo(props) {
  const { tokenAddress, chainId } = props
  const input = tokenAddress
  const isInput = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.isInput)
  const marketCapacity = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.marketCapacity)
  const [transactionNum, setTransactionNum] = useState(0)
  const [holderNum, setHolderNum] = useState(0)
  const { tokenData } = props
  const { t } = useTranslation()
  const result = isAddress(input)
  const network = chainId === ChainId.ETHEREUM ? 'ethereum' : 'bsc'
  const tokenLink = chainId === ChainId.ETHEREUM ? 'https://etherscan.io/token' : 'https://bscscan.com/token'

  const dispatch = useDispatch<AppDispatch>()

  const getTableData = useCallback(async () => {
    try {
      if (result) {
        dispatch(
          selectCurrency({
            field: isInput ? Field.OUTPUT : Field.INPUT,
            currencyId: input,
          }),
        )
        const currencyId = chainId === 1 ? 'ETH' : 'BNB'
        dispatch(
          selectCurrency({
            field: isInput ? Field.INPUT : Field.OUTPUT,
            currencyId,
          }),
        )
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }, [dispatch, input, isInput, result, chainId])

  useEffect(() => {
    const ac = new AbortController()
    getTableData()
    return () => ac.abort()
  }, [getTableData, input, isInput])

  useEffect(() => {
    const ac = new AbortController()
    const fetchTransaction = async () => {
      try {
        const bitConfig = {
          headers: {
            'X-API-KEY': BITQUERY_API_KEY,
          },
        }

        const queryTx = `{
          ethereum(network: ${network}) {
            transactions(txTo: {is: "${input}"}) {
              count
            }
          }
        }`
        const queryResult = await axios.post(BITQUERY_API, { query: queryTx }, bitConfig)
        setTransactionNum(queryResult.data.data.ethereum.transactions[0].count)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('err', err.message)
        setTransactionNum(0)
      }
    }

    const fetchHolder = async () => {
      try {
        axios
          .post(`${process.env.REACT_APP_BACKEND_API_URL2}/holders`, { address: input, chainId })
          .then((response) => {
            setHolderNum(Number(response.data.holders))
          })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('err', err.message)
        setHolderNum(0)
      }
    }

    if (input) {
      fetchTransaction()
      fetchHolder()
    }

    return () => ac.abort()
  }, [input, chainId, network])

  return (
    <TokenInfoContainer>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <IconWrapper size={32}>
            <Text color="white">{tokenData && t(`${tokenData.symbol}`)}</Text>
          </IconWrapper>
        </Flex>
        <Flex style={{ width: 40 }}>
          <Link href={`${tokenLink}/${input}`} aria-label="scan" external>
            <BscscanIcon />
          </Link>
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <TextWrapper>
          <Text>{t('Total Supply')}</Text>
          <Text>{tokenData && Number(tokenData.totalSupply).toLocaleString()}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>{t('Market Cap')}:</Text>
          <Text>$ {marketCapacity.toLocaleString()}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>{t('Transactions')}</Text>
          <Text>{transactionNum}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text className="textWithCopy">
            {t('Contract Address')}
            <CopyHelper toCopy={input}>&nbsp;</CopyHelper>
          </Text>
          <Text>
            <a href={`${tokenLink}/${input}`} target="_blank" rel="noreferrer">
              {input}
            </a>
          </Text>
        </TextWrapper>
        <TextWrapper>
          <Text>{t('Holders')}</Text>
          <Text>
            <a href={`${tokenLink}/${input}#balances`} target="_blank" rel="noreferrer">
              {holderNum}
            </a>
          </Text>
        </TextWrapper>
      </Flex>
    </TokenInfoContainer>
  )
}
