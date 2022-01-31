/* eslint-disable */
import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'state'
import { autoSwap } from 'state/flags/actions'
import styled, { useTheme, keyframes } from 'styled-components'
import { useLocation, useParams } from 'react-router'
import { CurrencyAmount, JSBI, Token, Trade, RouterType, ChainId } from '@sphynxdex/sdk-multichain'
import { Button, Text, ArrowDownIcon, Box, useModal, Flex, AutoRenewIcon } from '@sphynxdex/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import { getAddress, getLimitOrderAddress } from 'utils/addressHelpers'
import { getLimitOrderContract } from 'utils/contractHelpers'
import AutoCardNav from 'components/AutoCardNav'
import LimitCardNav from 'components/LimitCardNav'
import { FullHeightColumn } from 'components/Column'
import Column, { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AppHeader } from 'components/App'
import { BalanceNumber } from 'components/BalanceNumber'
import { useMatchBreakpoints } from '@sphynxdex/uikit'
import { useSetRouterType } from 'state/application/hooks'
import SwapIcon from 'components/Icon/SwapIcon'
import { typeInput, marketCap, typeRouterVersion, setSelectedQuoteCurrency } from 'state/input/actions'
import { BITQUERY_API, BITQUERY_API_KEY } from 'config/constants/endpoints'
import SwapRouter, { messages } from 'config/constants/swaps'
import LPToken_ABI from 'config/abi/lpToken.json'
import AddressInputPanel from './components/AddressInputPanel'
import Card, { GreyCard } from '../../components/Card'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
import ImportTokenWarningModal from './components/ImportTokenWarningModal'
import ProgressSteps from './components/ProgressSteps'
import TokenInfo from './components/TokenInfo'
import Cards from './components/Layout'
import CoinStatsBoard from './components/CoinStatsBoard'
import TransactionCard from './components/TransactionCard'
import BuySellOrderCard from './components/BuySellOrderCard'
import OrderRow from './components/OrderRow'
import ContractPanel from './components/ContractPanel'
import LiquidityWidget from '../Pool/LiquidityWidget'
import ChartContainer from './components/Chart'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import SphynxAbi from 'config/abi/sphynx.json'
import { useAllTokens, useAllUniTokens, useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSingleHopOnly, useUserSlippageTolerance } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import BuyersCard from './components/BuyersCard'
import SellersCard from './components/SellersCard'
import SwapWarningModal from './components/SwapWarningModal'
import LiveAmountPanel from './components/LiveAmountPanel'
import { Field, replaceSwapState } from '../../state/swap/actions'
import Web3 from 'web3'
import ERC20ABI from 'assets/abis/erc20.json'
import { getPancakePairAddress, getSphynxPairAddress, getTokenPrice, getTokenPriceETH } from 'utils/priceProvider'
import * as ethers from 'ethers'
import { getBNBPrice, getETHPrice } from 'utils/priceProvider'
import { simpleRpcProvider, simpleRpcETHProvider } from 'utils/providers'
import { UNSET_PRICE } from 'config/constants/info'
import storages from 'config/constants/storages'
import RewardsPanel from './components/RewardsPanel'
import { SwapTabs, SwapTabList, SwapTab, SwapTabPanel } from '../../components/Tab/tab'
import { web3ArchiveProvider } from 'utils/providers'
import { BUSD } from 'config/constants/tokens'
import formatTimeString from 'utils/formatTimeString'
import { sphynxAddress, wrappedAddr } from 'config/constants/tokenHelper'
import { isUndefined } from 'lodash'
import {
  WBNB_ADDRESS,
  BUSD_ADDRESS,
  BSC_USDT_ADDRESS,
  BSC_USDC_ADDRESS,
  ETH_USDT_ADDRESS,
  ETH_USDC_ADDRESS,
} from 'config/constants/addresses'

let tokenDecimal = 18

const abi: any = ERC20ABI

let config = {
  headers: {
    'X-API-KEY': BITQUERY_API_KEY,
  },
}

const web3 = new Web3(web3ArchiveProvider)
const dataFeedProvider = new Web3.providers.HttpProvider(
  'https://speedy-nodes-nyc.moralis.io/fbb4b2b82993bf507eaaab13/bsc/mainnet/archive',
)
const datafeedWeb3 = new Web3(dataFeedProvider)
const providerURLETH = 'https://speedy-nodes-nyc.moralis.io/fbb4b2b82993bf507eaaab13/eth/mainnet/archive'
const web3ETH = new Web3(new Web3.providers.HttpProvider(providerURLETH))
const originTokenAddress = '0xd38ec16caf3464ca04929e847e4550dcff25b27a'
const newTokenAddress = '0xe64972C311840cFaf2267DCfD365571F9D9544d9'

const ArrowContainer = styled(ArrowWrapper)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.custom.primary};
  border-radius: 15px;
  margin: 0;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
  & svg {
    width: 14px;
    height: 16px;
  }
`

const BalanceText = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 12px;
  color: #f2c94c;
  margin-left: auto;
`

const SlippageText = styled.p`
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  color: white;
  margin: 0 8px;
`

const Slippage18Text = styled.p.attrs({ selected: false })`
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border: 1px solid ${({ theme }) => (theme.isDark ? '#2E2E55' : '#4A5187')};
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  user-select: none;
  padding: 15px 8px;
  margin-right: 4px;

  :focus,
  :hover {
    opacity: 0.6;
  }

  & > div {
    & > div {
      font-weight: 600;
      font-size: 10px;
      letter-spacing: -0.02em;
      color: #a7a7cc;
    }
    & > svg > path {
      fill: white;
    }
  }
`

const SlippageTextWrapper = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-direction: column;
  gap: 6px;
`

const SlippageMBTextWrapper = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-direction: column;
  gap: 6px;
`

const BottomGrouping = styled(Box)`
  & button {
    background-color: ${({ theme }) => theme.custom.pancakePrimary} !important;
    &:hover {
      opacity: 0.6;
    }
  }
`

const TokenInfoWrapper = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const SwapPage = styled(Page)`
  padding: 0;
  .pendingTx {
    animation: ${rotate} 2s linear infinite;
  }
`

/*
declare support chainID for swap Page
*/
const supportedChainID = [56, 1, 97]

export default function Swap({ history }: RouteComponentProps) {
  const dispatch = useDispatch()
  const { setRouterType } = useSetRouterType()
  const { pathname } = useLocation()
  const params = useLocation().search
  const paramChainId = parseInt(new URLSearchParams(params).get('chainId'))
  const tokenAddress = pathname.substr(6)
  const [swapRouter, setSwapRouter] = useState(SwapRouter.SPHYNX_SWAP)
  const [transactionData, setTransactions] = useState([])
  const stateRef = useRef([])
  const loadingRef = useRef(false)
  const busyRef = useRef(false)
  const chainIdRef = useRef(null)
  const [isLoading, setLoading] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const [currentBlock, setCurrentBlock] = useState(null)
  const [blockFlag, setBlockFlag] = useState(false)
  const [tokenData, setTokenData] = useState<any>(null)
  const swapFlag = useSelector<AppState, AppState['autoSwapReducer']>((state) => state.autoSwapReducer.swapFlag)
  const inputTokenName = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const quoteCurrency = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.quoteCurrency)
  const { address: quoteAddress, pair: pairAddress, symbol: quoteSymbol } = quoteCurrency
  const tokens = useSelector<AppState, AppState['tokens']>((state) => state.tokens)
  const [inputBalance, setInputBalance] = useState(0)
  const [outputBalance, setOutputBalance] = useState(0)
  const [buyInputBalance, setBuyInputBalance] = useState(0)
  const [buyOutputBalance, setBuyOutputBalance] = useState(0)
  const [sellInputBalance, setSellInputBalance] = useState(0)
  const [sellOutputBalance, setSellOutputBalance] = useState(0)
  const [userOrders, setUserOrders] = useState([])
  const [buyState, setBuyState] = useState(3)
  const [sellState, setSellState] = useState(3)
  const [tokenAmount, setTokenAmount] = useState(0)
  const [tokenPrice, setTokenPrice] = useState(0)
  const [originBalance, setOriginBalance] = useState('0')
  const [pendingTx, setPendingTx] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [symbol, setSymbol] = useState('')
  const theme = useTheme()
  const [currency, setCurrency] = useState(null)
  const [otherCurrency, setOtherCurrency] = useState(null)
  const [fieldType, setFieldType] = useState(Field.BUYOUTPUT)
  const { account, chainId, library } = useActiveWeb3React()
  const signer = library.getSigner()
  const originTokenContract = useMemo(() => new ethers.Contract(originTokenAddress, SphynxAbi, signer), [signer])
  const limitOrderContract = useMemo(() => getLimitOrderContract(signer, chainId), [signer, chainId])
  const newTokenContract = new ethers.Contract(newTokenAddress, SphynxAbi, signer)
  const [chainIdState, setChainIdState] = useState(
    paramChainId === null || Number.isNaN(paramChainId) ? 56 : paramChainId,
  )
  const [quoteCurrencies, setQuoteCurrencies] = useState([])
  const quoteCurrencyRef = useRef(null)
  useEffect(() => {
    if (!Number.isNaN(chainId) && !isUndefined(chainId) && chainId !== chainIdState) {
      setChainIdState(chainId)
    }
  }, [chainId])

  const [pairAddresses, setPairAddresses] = useState([])
  const BUSDAddr = BUSD[chainIdState]?.address

  const wrappedCurrencySymbol = chainIdState === ChainId.ETHEREUM ? 'WETH' : 'WBNB'
  stateRef.current = transactionData
  loadingRef.current = isLoading
  busyRef.current = isBusy
  chainIdRef.current = chainIdState
  quoteCurrencyRef.current = quoteCurrencies
  let input = tokenAddress
  if (input === '-' || input === '') input = sphynxAddress[chainIdState]

  useEffect(() => {
    const setBalance = async () => {
      if (chainIdState === ChainId.MAINNET && account) {
        const tokenBalance = await originTokenContract.balanceOf(account)
        setOriginBalance(tokenBalance.toString())
      }
    }
    setBalance()
  }, [originTokenContract])

  useEffect(() => {
    const setInitData = async () => {
      try {
        const provider = chainIdState === ChainId.MAINNET ? simpleRpcProvider : simpleRpcETHProvider
        const pair = await getSphynxPairAddress(input, wrappedAddr[chainIdState], provider, chainIdState)

        if (chainIdState != chainIdRef.current) return
        if (pair !== null && pair !== undefined) {
          if (routerVersion !== 'sphynx') {
            dispatch(typeRouterVersion({ routerVersion: 'sphynx' }))
          }
          if (swapRouter !== SwapRouter.SPHYNX_SWAP || swapRouter !== SwapRouter.SPHYNX_ETH_SWAP) {
            if (chainIdState === ChainId.MAINNET) {
              setSwapRouter(SwapRouter.SPHYNX_SWAP)
              setRouterType(RouterType.sphynx)
            } else {
              setSwapRouter(SwapRouter.SPHYNX_ETH_SWAP)
              setRouterType(RouterType.sphynxeth)
            }
          }
          dispatch(
            replaceSwapState({
              outputCurrencyId: chainIdState === ChainId.ETHEREUM ? 'ETH' : 'BNB',
              inputCurrencyId: input,
              typedValue: '',
              field: Field.OUTPUT,
              recipient: null,
            }),
          )
        } else {
          if (routerVersion !== 'v2') {
            dispatch(typeRouterVersion({ routerVersion: 'v2' }))
          }
          if (
            (swapRouter !== SwapRouter.PANCAKE_SWAP && chainIdState === ChainId.MAINNET) ||
            (swapRouter !== SwapRouter.UNI_SWAP && chainIdState === ChainId.ETHEREUM)
          ) {
            if (chainIdState === ChainId.MAINNET) {
              setSwapRouter(SwapRouter.PANCAKE_SWAP)
              setRouterType(RouterType.pancake)
            } else {
              setSwapRouter(SwapRouter.UNI_SWAP)
              setRouterType(RouterType.uniswap)
            }
          }
          dispatch(
            replaceSwapState({
              outputCurrencyId: chainIdState === ChainId.ETHEREUM ? 'ETH' : 'BNB',
              inputCurrencyId: input,
              typedValue: '',
              field: Field.OUTPUT,
              recipient: null,
            }),
          )
        }
      } catch (err) {
        console.log('ERERERRRRRRRRRRR', err)
      }
    }

    setInitData()
  }, [input, chainIdState])

  const getDataQuery = useCallback(() => {
    const network = chainIdState === ChainId.ETHEREUM ? 'ethereum' : 'bsc'
    const quoteCurrencies =
      chainIdState === ChainId.ETHEREUM
        ? `"${wrappedAddr[chainIdState]}", "${BUSDAddr}", "${ETH_USDT_ADDRESS}", "${ETH_USDC_ADDRESS}"`
        : `"${wrappedAddr[chainIdState]}", "${BUSDAddr}", "${BSC_USDT_ADDRESS}", "${BSC_USDC_ADDRESS}"`
    return `
    {
    ethereum(network: ${network}) {
        dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: 30, offset: 0}
        date: {till: null}
        baseCurrency: {is: "${input}"}
        quoteCurrency:{in : [${quoteCurrencies}]}
        ) {
        block {
          timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        tradeIndex
        protocol
        exchange {
          fullName
        }
        smartContract {
          address {
          address
          annotation
          }
        }
        baseAmount
        baseCurrency {
          address
          symbol
        }
        quoteAmount
        quoteCurrency {
          address
          symbol
        }
        transaction {
          hash
        }
        buyCurrency {
          symbol
          address
          name
        }
        sellCurrency {
          symbol
          address
          name
          }
        price
        quotePrice
        }
      }
    }`
  }, [input, chainIdState])

  const isToken0EqualInput = async (address) => {
    if (pairAddresses[address] !== false || pairAddresses[address] !== true) {
      try {
        const currentProvider = chainIdState === ChainId.ETHEREUM ? simpleRpcETHProvider : simpleRpcProvider
        const lpAbi: any = LPToken_ABI
        const lpContract = new ethers.Contract(address, lpAbi, currentProvider)
        const token0 = await lpContract.token0()
        const flag = token0.toLowerCase() === input.toLowerCase() ? true : false
        pairAddresses[address] = flag
        return flag
      } catch (err) {
        console.log('error', err)
        return false
      }
    } else {
      return pairAddresses[address]
    }
  }

  const parseData: any = async (events: any, blockNumber: any) => {
    setBusy(true)

    let newTransactions = stateRef.current
    return new Promise(async (resolve) => {
      const price = chainIdState === ChainId.ETHEREUM ? await getETHPrice() : await getBNBPrice()
      let curPrice = UNSET_PRICE
      let curAmount = 0

      for (let i = 0; i <= events.length; i++) {
        if (loadingRef.current === false) {
          setBusy(false)
          setCurrentBlock(blockNumber)
          setBlockFlag(!blockFlag)
          resolve(true)
          break
        }
        if (i === events.length) {
          if (events.length > 0 && curPrice !== UNSET_PRICE && chainIdRef.current === chainIdState) {
            let sessionData = {
              input: inputTokenName,
              price: curPrice,
              amount: curAmount,
              timestamp: new Date().getTime(),
            }
            sessionStorage.setItem(storages.SESSION_LIVE_PRICE, JSON.stringify(sessionData))
          }

          setTimeout(() => {
            setTransactions(newTransactions)
            setBusy(false)
            setCurrentBlock(blockNumber)
            setBlockFlag(!blockFlag)
            resolve(true)
          }, 200)
        } else {
          try {
            const event = events[i]
            const datas = web3.eth.abi.decodeParameters(
              [
                { type: 'uint256', name: 'amount0In' },
                { type: 'uint256', name: 'amount1In' },
                { type: 'uint256', name: 'amount0Out' },
                { type: 'uint256', name: 'amount1Out' },
              ],
              event.data,
            )
            let tokenAmt, quoteAmount, isBuy

            if (await isToken0EqualInput(event.address)) {
              tokenAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount0In + '', tokenDecimal)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount0Out + '', tokenDecimal)),
              )

              isBuy = datas.amount1In === '0'
              quoteAmount = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount1In + '', 18)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount1Out + '', 18)),
              )
            } else {
              quoteAmount = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount0In + '', 18)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount0Out + '', 18)),
              )
              tokenAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount1In + '', tokenDecimal)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount1Out + '', tokenDecimal)),
              )
              isBuy = datas.amount0In === '0'
            }

            let oneData: any = {}
            oneData.amount = tokenAmt
            oneData.value = quoteAmount
            const quoteToken = quoteCurrencyRef.current.filter(
              (data) => data.value.pair.toLowerCase() === event.address.toLowerCase(),
            )

            oneData.price =
              quoteToken[0].value.address.toLowerCase() === wrappedAddr[chainIdState].toLowerCase()
                ? (quoteAmount / tokenAmt) * price
                : quoteAmount / tokenAmt
            const estimatedDateValue = new Date(new Date().getTime() - (blockNumber - event.blockNumber) * 3000)
            oneData.transactionTime = formatTimeString(
              `${estimatedDateValue.getUTCFullYear()}-${
                estimatedDateValue.getUTCMonth() + 1
              }-${estimatedDateValue.getDate()} ${estimatedDateValue.getUTCHours()}:${estimatedDateValue.getUTCMinutes()}:${estimatedDateValue.getUTCSeconds()}`,
            )

            oneData.tx = event.transactionHash
            oneData.isBuy = isBuy
            oneData.usdValue = oneData.amount * oneData.price
            oneData.quoteCurrency = quoteToken[0].value.symbol
            newTransactions.unshift(oneData)
            if (newTransactions.length > 300) {
              newTransactions.pop()
            }

            if (pairAddress.toLowerCase() === event.address.toLowerCase()) {
              curPrice = oneData.price
              curAmount += oneData.usdValue
              setTokenPrice(curPrice)
            }
          } catch (err) {
            console.log('error', err)
          }
        }
      }
    })
  }

  const getTransactions = async (blockNumber) => {
    let cachedBlockNumber = blockNumber
    try {
      const currentWeb3 = chainIdState === ChainId.ETHEREUM ? web3ETH : datafeedWeb3
      currentWeb3.eth
        .getPastLogs({
          fromBlock: blockNumber,
          toBlock: 'latest',
          topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822'],
        })
        .then(async (info) => {
          if (info.length) {
            cachedBlockNumber = info[info.length - 1].blockNumber
          }
          info = info.filter((oneData) => oneData.blockNumber !== cachedBlockNumber)
          const pairs = quoteCurrencyRef.current.map((data) => data.value.pair.toLowerCase())
          info = info.filter((oneData) => pairs.indexOf(oneData.address.toLowerCase()) !== -1)

          info = [...new Set(info)]

          if (!isBusy) {
            parseData(info, cachedBlockNumber)
          }
        })
    } catch (err) {
      console.log('error', err)
      setTimeout(() => getTransactions(blockNumber), 3000)
    }
  }

  const startRealTimeData = (blockNumber) => {
    if (blockNumber === null) {
      const currentWeb3 = chainIdState === ChainId.ETHEREUM ? web3ETH : datafeedWeb3
      currentWeb3.eth.getBlockNumber().then((blockNumber) => {
        setCurrentBlock(blockNumber)
        setBlockFlag(!blockFlag)
      })
    } else {
      const currentWeb3 = chainIdState === ChainId.ETHEREUM ? web3ETH : datafeedWeb3
      currentWeb3.eth.getBlockNumber().then((blockNumberCache) => {
        if (parseInt(blockNumber) + 50 <= blockNumberCache) {
          setCurrentBlock(blockNumberCache - 50)
          setBlockFlag(!blockFlag)
        } else {
          setCurrentBlock(blockNumber)
          setBlockFlag(!blockFlag)
        }
      })
    }
  }

  React.useEffect(() => {
    const ab = new AbortController()
    if (currentBlock !== null) getTransactions(currentBlock)
    return () => {
      ab.abort()
    }
  }, [blockFlag])

  const setDatas = (transactions, blockNumber) => {
    if (busyRef.current === false) {
      setTransactions(transactions)
      setLoading(true)
      startRealTimeData(blockNumber + 1)
    } else {
      setTimeout(() => {
        setDatas(transactions, blockNumber)
      }, 1000)
    }
  }

  const handleClaimToken = async () => {
    setPendingTx(true)
    try {
      const tx = await originTokenContract.approve(newTokenAddress, '0xfffffffffffffffffffffffffffffffff')
      await tx.wait()
      const tx1 = await newTokenContract.claimToken(originBalance)
      await tx1.wait()
      setPendingTx(false)
      setOriginBalance('0')
    } catch (err) {
      setPendingTx(false)
    }
  }

  useEffect(() => {
    if (chainIdState !== null) {
      const fetchDecimals = async () => {
        const contract: any =
          chainIdState === ChainId.MAINNET ? new web3.eth.Contract(abi, input) : new web3ETH.eth.Contract(abi, input)
        tokenDecimal = await contract.methods.decimals().call()
      }

      setLoading(false)
      const ac = new AbortController()
      let newTransactions = []
      const fetchData = async (network) => {
        try {
          const bnbPrice = network === ChainId.ETHEREUM ? await getETHPrice() : await getBNBPrice()
          // pull historical data
          const queryResult = await axios.post(BITQUERY_API, { query: getDataQuery() }, config)
          if (chainIdRef.current === network) {
            if (queryResult.data.data && queryResult.data.data.ethereum.dexTrades) {
              let dexTrades = queryResult.data.data.ethereum.dexTrades
              setSymbol(queryResult.data.data.ethereum.dexTrades[0].baseCurrency.symbol)
              newTransactions = queryResult.data.data.ethereum.dexTrades.map((item, index) => {
                return {
                  transactionTime: formatTimeString(item.block.timestamp.time),
                  amount: item.baseAmount,
                  value: item.quoteAmount,
                  quoteCurrency: item.quoteCurrency.symbol,
                  price:
                    item.quoteCurrency.symbol === wrappedCurrencySymbol ? item.quotePrice * bnbPrice : item.quotePrice,
                  usdValue:
                    item.quoteCurrency.symbol === wrappedCurrencySymbol
                      ? item.baseAmount * item.quotePrice * bnbPrice
                      : item.baseAmount * item.quotePrice,
                  isBuy: item.baseCurrency.symbol === item.buyCurrency.symbol,
                  tx: item.transaction.hash,
                }
              })

              if (dexTrades.length > 0) {
                const curPrice =
                  dexTrades[0].quoteCurrency.symbol === wrappedCurrencySymbol
                    ? dexTrades[0].quotePrice * bnbPrice
                    : dexTrades[0].quotePrice
                const sessionData = {
                  input,
                  price: curPrice,
                  amount: 0,
                  timestamp: new Date().getTime(),
                }
                // sessionStorage.setItem(storages.SESSION_LIVE_PRICE, JSON.stringify(sessionData))
                // setTokenPrice(curPrice)
              }
              setDatas(newTransactions, queryResult.data.data.ethereum.dexTrades[0].block.height)
            } else {
              web3.eth.getBlockNumber().then((blockNumber) => {
                setDatas([], blockNumber - 200)
              })
            }
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log('err', err.message)
          web3.eth.getBlockNumber().then((blockNumber) => {
            setDatas([], blockNumber - 200)
          })
        }
      }

      if (input) {
        setTokenPrice(0)
        fetchDecimals()
        fetchData(chainIdRef.current)
      }

      return () => ac.abort()
    }
  }, [tokenAddress, chainIdState])

  React.useEffect(() => {
    const ab = new AbortController()
    if (input) {
      dispatch(typeInput({ input }))
    }
    return () => {
      ab.abort()
    }
  }, [dispatch, tokenAddress])

  const getTokenData = async (tokenAddress, chainIdState) => {
    if (tokenAddress === '' || tokenAddress === '-') return
    if (tokenAddress === undefined || tokenAddress === null) return
    try {
      const currentWeb3 = chainIdState === ChainId.ETHEREUM ? web3ETH : web3
      const contract = new currentWeb3.eth.Contract(abi, tokenAddress)
      let totalSupply = await contract.methods.totalSupply().call()
      let decimals = await contract.methods.decimals().call()
      let symbol = await contract.methods.symbol().call()
      let name = await contract.methods.name().call()
      totalSupply = totalSupply / 10 ** decimals
      const data = {
        marketCap,
        totalSupply,
        decimals,
        symbol: `${name} (${symbol})`,
      }
      setTokenData(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
      setTimeout(() => getTokenData(tokenAddress, chainIdState), 3000)
    }
  }

  React.useEffect(() => {
    if (input === undefined) return
    sessionStorage.removeItem(storages.SESSION_LIVE_PRICE)
    getTokenData(input, chainIdState)
  }, [quoteCurrencies, chainIdState])

  const loadedUrlParams = useDefaultsFromURLSearch()

  const { t } = useTranslation()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  let defaultTokens = useAllTokens()
  console.log("swapPage",defaultTokens)
  const uniTokens = useAllUniTokens()
  if (chainId !== ChainId.MAINNET) {
    defaultTokens = uniTokens
  }

  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient, formattedBSAmounts } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  // Limit Order State management
  useEffect(() => {
    const parseData = async () => {
      const info = await limitOrderContract.getUserOrders()
      const realInfo = info.map((oneData) => {
        return {
          tokenA: oneData.tokenA,
          tokenB: oneData.tokenB,
          amountA: oneData.amountA,
          amountB: oneData.amountB,
        }
      })

      setUserOrders(realInfo)
    }

    parseData()
  }, [chainId, account])

  useEffect(() => {
    if (
      !currencies[Field.BUYINPUT] ||
      !currencies[Field.BUYOUTPUT] ||
      parseFloat(formattedBSAmounts[Field.BUYINPUT]) == 0 ||
      parseFloat(formattedBSAmounts[Field.BUYOUTPUT]) == 0 ||
      formattedBSAmounts[Field.BUYINPUT] === '' ||
      formattedBSAmounts[Field.BUYOUTPUT] === ''
    ) {
      setBuyState(3)
      return
    }
    const parseData = async () => {
      const inputToken: any = currencies[Field.BUYINPUT]
      const inputContract = new ethers.Contract(inputToken?.address, SphynxAbi, simpleRpcProvider)
      let balance = await inputContract.balanceOf(account)
      const decimals = await inputContract.decimals()
      balance = parseFloat(ethers.utils.formatUnits(balance.toString(), decimals).toString())
      if (parseFloat(formattedBSAmounts[Field.BUYINPUT]) > balance) {
        setBuyState(2)
        return
      }
      const approvedAmount = await inputContract.allowance(account, getLimitOrderAddress(chainId))
      if (approvedAmount.toString() === '0') {
        setBuyState(1)
        return
      }
      setBuyState(0)
    }

    parseData()
  }, [
    currencies[Field.BUYINPUT],
    currencies[Field.BUYOUTPUT],
    formattedBSAmounts[Field.BUYINPUT],
    formattedBSAmounts[Field.BUYOUTPUT],
    account,
    chainId,
  ])

  useEffect(() => {
    if (
      !currencies[Field.SELLINPUT] ||
      !currencies[Field.SELLOUTPUT] ||
      parseFloat(formattedBSAmounts[Field.SELLINPUT]) == 0 ||
      parseFloat(formattedBSAmounts[Field.SELLOUTPUT]) == 0 ||
      formattedBSAmounts[Field.SELLINPUT] === '' ||
      formattedBSAmounts[Field.SELLOUTPUT] === ''
    ) {
      setSellState(3)
      return
    }
    const parseData = async () => {
      const inputToken: any = currencies[Field.SELLINPUT]
      const inputContract = new ethers.Contract(inputToken?.address, SphynxAbi, simpleRpcProvider)
      let balance = await inputContract.balanceOf(account)
      const decimals = await inputContract.decimals()
      balance = parseFloat(ethers.utils.formatUnits(balance.toString(), decimals).toString())
      if (parseFloat(formattedBSAmounts[Field.SELLINPUT]) > balance) {
        setSellState(2)
        return
      }
      const approvedAmount = await inputContract.allowance(account, getLimitOrderAddress(chainId))
      if (approvedAmount.toString() === '0') {
        setSellState(1)
        return
      }
      setSellState(0)
    }

    parseData()
  }, [
    currencies[Field.SELLINPUT],
    currencies[Field.SELLOUTPUT],
    formattedBSAmounts[Field.SELLINPUT],
    formattedBSAmounts[Field.SELLOUTPUT],
    account,
    chainId,
  ])

  const handleLimitApprove = async () => {
    const inputToken: any = currencies[Field.BUYINPUT]
    const inputContract = new ethers.Contract(inputToken?.address, SphynxAbi, signer)
    const approveTx = await inputContract.approve(
      getLimitOrderAddress(chainId),
      '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    )
    await approveTx.wait()
  }

  const handleLimitOrderBuy = async () => {
    const inputCurrency: any = currencies[Field.BUYINPUT]
    const outputCurrency: any = currencies[Field.BUYOUTPUT]
    const createTx = await limitOrderContract.createOrder(
      ethers.utils.parseUnits(formattedBSAmounts[Field.BUYINPUT], currencies[Field.BUYINPUT].decimals),
      ethers.utils.parseUnits(formattedBSAmounts[Field.BUYOUTPUT], currencies[Field.BUYOUTPUT].decimals),
      inputCurrency.address,
      outputCurrency.address,
      parseInt((Math.ceil(new Date().getTime() / 1000) + 60 * 60 * 24 * 30).toString()).toString(),
      '0x0c8094a69e8e44404371676f07b2c32923b5699c',
      { value: ethers.utils.parseEther('0.01') },
    )
    await createTx.wait()
  }

  const handleLimitOrderSell = async () => {
    const inputCurrency: any = currencies[Field.SELLINPUT]
    const outputCurrency: any = currencies[Field.SELLOUTPUT]
    const createTx = await limitOrderContract.createOrder(
      ethers.utils.parseUnits(formattedBSAmounts[Field.SELLINPUT], currencies[Field.SELLINPUT].decimals),
      ethers.utils.parseUnits(formattedBSAmounts[Field.SELLOUTPUT], currencies[Field.SELLOUTPUT].decimals),
      inputCurrency.address,
      outputCurrency.address,
      parseInt((Math.ceil(new Date().getTime() / 1000) + 60 * 60 * 24 * 30).toString()).toString(),
      '0x0c8094a69e8e44404371676f07b2c32923b5699c',
      { value: ethers.utils.parseEther('0.1') },
    )
    await createTx.wait()
  }
  // ////////////////////////////////////

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient, onCurrencyBSSelection, onUserBSInput } =
    useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )
  const handleTypeBuyInput = useCallback(
    (value: string) => {
      onUserBSInput(Field.BUYINPUT, value)
    },
    [onUserBSInput],
  )
  const handleTypeBuyOutPut = useCallback(
    (value: string) => {
      onUserBSInput(Field.BUYOUTPUT, value)
    },
    [onUserBSInput],
  )
  const handleTypeSellInput = useCallback(
    (value: string) => {
      onUserBSInput(Field.SELLINPUT, value)
    },
    [onUserBSInput],
  )
  const handleTypeSellOutPut = useCallback(
    (value: string) => {
      onUserBSInput(Field.SELLOUTPUT, value)
    },
    [onUserBSInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        console.log('hash: ', hash)
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        let message = error.message
        if (error.message.includes(messages.SWAP_TRANSACTION_ERROR)) {
          message = messages.SLIPPAGE_ISSUE
        }
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm])

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />)

  const shouldShowSwapWarning = (swapCurrency) => {
    const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
      const warningTokenData = warningTokenConfig[1]
      const warningTokenAddress = getAddress(warningTokenData.address, chainId)
      return swapCurrency.address === warningTokenAddress
    })
    return Boolean(isWarningToken)
  }

  const getCurrencyList = async () => {
    const rpcProvider = chainIdState === ChainId.ETHEREUM ? simpleRpcETHProvider : simpleRpcProvider
    const quoteCurrencyList = []
    console.log('ChainIDState', chainIdState)
    const currencies =
      chainIdState === ChainId.ETHEREUM
        ? [
            {
              symbol: 'ETH',
              address: wrappedAddr[1],
            },
            {
              symbol: 'USDT',
              address: ETH_USDT_ADDRESS,
            },
            {
              symbol: 'USDC',
              address: ETH_USDC_ADDRESS,
            },
          ]
        : [
            {
              symbol: 'BNB',
              address: WBNB_ADDRESS,
            },
            {
              symbol: 'BUSD',
              address: BUSD_ADDRESS,
            },
            {
              symbol: 'USDT',
              address: BSC_USDT_ADDRESS,
            },
            {
              symbol: 'USDC',
              address: BSC_USDC_ADDRESS,
            },
          ]

    await Promise.all(
      currencies.map(async (currency) => {
        const pairAddress = await getSphynxPairAddress(input, currency.address, rpcProvider, chainIdState)

        if (pairAddress) {
          quoteCurrencyList.push({
            label: `Sphynx - ${currency.symbol}`,
            value: {
              ...currency,
              pair: pairAddress,
              exchangeName: 'Sphynx',
            },
          })
        }
      }),
    )

    await Promise.all(
      currencies.map(async (currency) => {
        const pairAddress = await getPancakePairAddress(input, currency.address, rpcProvider, chainIdState)

        if (pairAddress) {
          quoteCurrencyList.push({
            label: chainIdState === ChainId.ETHEREUM ? `Uniswap - ${currency.symbol}` : `Pancake - ${currency.symbol}`,
            value: {
              ...currency,
              pair: pairAddress,
              exchangeName: chainIdState === ChainId.ETHEREUM ? 'Uniswap V2' : 'Pancake V2',
            },
          })
        }
      }),
    )

    if (quoteCurrencyList.length > 0 && chainIdState === chainIdRef.current) {
      const bscIndex = quoteCurrencyList.findIndex((currency: any) => currency.value.symbol === 'BNB')
      if (bscIndex > 0) {
        const removed = quoteCurrencyList.splice(bscIndex, 1)
        quoteCurrencyList.unshift(removed[0])
      }

      setQuoteCurrencies(quoteCurrencyList)
      dispatch(setSelectedQuoteCurrency({ quoteCurrency: quoteCurrencyList[0].value }))
    }
  }

  useEffect(() => {
    getCurrencyList()
  }, [chainIdState])

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      const showSwapWarning = shouldShowSwapWarning(inputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(inputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      const showSwapWarning = shouldShowSwapWarning(outputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(outputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  useEffect(() => {
    if (tokenData === null || tokenData.symbol === null) return

    let flag = false
    tokens.forEach((cell) => {
      if (tokenData.symbol.indexOf('(' + cell.symbol + ')') !== -1) {
        setTokenAmount(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setTokenAmount(0)
    }
  }, [tokenData, tokens])

  useEffect(() => {
    let flag = false
    tokens.forEach((cell) => {
      if (cell.symbol === currencies?.INPUT?.symbol) {
        setInputBalance(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setInputBalance(0)
    }
  }, [currencies?.INPUT?.symbol, tokens])

  useEffect(() => {
    let flag = false
    tokens.forEach((cell) => {
      if (cell.symbol === currencies?.OUTPUT?.symbol) {
        setOutputBalance(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setOutputBalance(0)
    }
  }, [currencies?.OUTPUT?.symbol, tokens])

  useEffect(() => {
    let flag = false
    tokens.forEach((cell) => {
      if (cell.symbol === currencies?.BUYINPUT?.symbol) {
        setBuyInputBalance(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setBuyInputBalance(0)
    }
  }, [currencies?.BUYINPUT?.symbol, tokens])

  useEffect(() => {
    let flag = false
    tokens.forEach((cell) => {
      if (cell.symbol === currencies?.BUYOUTPUT?.symbol) {
        setBuyOutputBalance(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setBuyOutputBalance(0)
    }
  }, [currencies?.BUYOUTPUT?.symbol, tokens])

  useEffect(() => {
    let flag = false
    tokens.forEach((cell) => {
      if (cell.symbol === currencies?.SELLINPUT?.symbol) {
        setSellInputBalance(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setSellInputBalance(0)
    }
  }, [currencies?.SELLINPUT?.symbol, tokens])

  useEffect(() => {
    let flag = false
    tokens.forEach((cell) => {
      if (cell.symbol === currencies?.SELLOUTPUT?.symbol) {
        setSellOutputBalance(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setSellOutputBalance(0)
    }
  }, [currencies?.SELLOUTPUT?.symbol, tokens])

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/swap/')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  const [timeNow, setTimeNow] = useState(Date.now())
  const countDownDeadline = new Date(Date.UTC(2021, 6, 1, 0, 0, 0, 0)).getTime()

  useEffect(() => {
    let timeout
    if (timeNow < countDownDeadline) {
      timeout = setTimeout(() => {
        setTimeNow(Date.now())
      }, 1000)
    } else {
      clearTimeout(timeout)
      setTimeNow(countDownDeadline)
    }
  }, [timeNow, countDownDeadline])

  useEffect(() => {
    if (swapFlag) {
      handleSwap()
      dispatch(autoSwap({ swapFlag: false }))
    }
  }, [swapFlag, handleSwap, dispatch])
  const handleArrowContainer = useCallback(() => {
    setApprovalSubmitted(false) // reset 2 step UI for approvals
    onSwitchTokens()
  }, [onSwitchTokens])

  const handleChangeRecipient = useCallback(() => {
    onChangeRecipient('')
  }, [onChangeRecipient])

  const handleRemoveRecipient = useCallback(() => {
    onChangeRecipient(null)
  }, [onChangeRecipient])

  const handleSwapState = useCallback(() => {
    if (isExpertMode) {
      handleSwap()
    } else {
      setSwapState({
        tradeToConfirm: trade,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined,
      })
      onPresentConfirmModal()
    }
  }, [handleSwap, isExpertMode, onPresentConfirmModal, trade])

  const handleBuyInputSelect = useCallback(
    (buyInputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencyBSSelection(Field.BUYINPUT, buyInputCurrency)
    },
    [onCurrencyBSSelection],
  )
  const handleBuyOutputSelect = useCallback(
    (buyOutputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencyBSSelection(Field.BUYOUTPUT, buyOutputCurrency)
    },
    [onCurrencyBSSelection],
  )
  const handleSellInputSelect = useCallback(
    (sellInputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencyBSSelection(Field.SELLINPUT, sellInputCurrency)
    },
    [onCurrencyBSSelection],
  )
  const handleSellOutputSelect = useCallback(
    (sellOutputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencyBSSelection(Field.SELLOUTPUT, sellOutputCurrency)
    },
    [onCurrencyBSSelection],
  )

  const onCurrencySelect = (curr) => {
    if (fieldType === Field.BUYOUTPUT) {
      handleBuyOutputSelect(curr)
    }
    if (fieldType === Field.SELLINPUT) {
      handleSellInputSelect(curr)
    }
  }

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={false}
      isLimit={true}
    />,
  )

  const handleSelectCurrencyModal = (type) => {
    onPresentCurrencyModal()
  }

  const handleBuySellTab = (type) => {
    setFieldType(type)
    if (type === Field.BUYOUTPUT) {
      setCurrency(currencies[Field.BUYINPUT])
      setOtherCurrency(currencies[Field.BUYOUTPUT])
    }
    if (type === Field.SELLINPUT) {
      setCurrency(currencies[Field.SELLINPUT])
      setOtherCurrency(currencies[Field.SELLOUTPUT])
    }
  }

  return supportedChainID.indexOf(chainIdState) !== -1 ? (
    <SwapPage>
      <RewardsPanel />
      <Cards>
        <div>
          <Flex justifyContent="center" margin="12px">
            <Button disabled onClick={handleClaimToken}>
              Migrate Token {pendingTx && <AutoRenewIcon className="pendingTx" />}
            </Button>
          </Flex>
          {!isMobile ? (
            <LiveAmountPanel
              symbol={tokenData && tokenData.symbol ? tokenData.symbol : ''}
              amount={tokenAmount}
              price={tokenPrice}
            />
          ) : null}
          <SwapTabs selectedTabClassName="is-selected" selectedTabPanelClassName="is-selected">
            <SwapTabList>
              <SwapTab>
                <Text textAlign="center" fontSize="14px" bold color="white">
                  {t('Swap')}
                </Text>
              </SwapTab>
              <SwapTab>
                <Text textAlign="center" fontSize="14px" bold color="white">
                  {t('Liquidity')}
                </Text>
              </SwapTab>
              {chainId === 56 && (
                <SwapTab>
                  <Text textAlign="center" fontSize="14px" bold color="white">
                    {t('Limit Buy/Sell')}
                  </Text>
                </SwapTab>
              )}
            </SwapTabList>
            <Card borderRadius="0 0 3px 3px" padding="20px 10px">
              <SwapTabPanel>
                <Wrapper id="swap-page">
                  <Flex alignItems="center" justifyContent="center">
                    <AutoCardNav
                      swapRouter={swapRouter}
                      setSwapRouter={setSwapRouter}
                      connectedNetworkID={chainIdState}
                    />
                  </Flex>
                  <AppHeader title={t('Swap')} showAuto />
                  <AutoColumn gap="md">
                    <CurrencyInputPanel
                      label={
                        independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                      }
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                    />
                    <AutoColumn justify="space-between">
                      <BalanceText>
                        <BalanceNumber prefix="" value={Number(inputBalance).toFixed(2)} />
                      </BalanceText>
                      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                        <ArrowContainer
                          clickable
                          onClick={handleArrowContainer}
                          color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                        >
                          {/* <DownArrow /> */}
                          <SwapIcon color="white" width="14px" height="18px" />
                        </ArrowContainer>
                        {recipient === null && !showWrap && isExpertMode ? (
                          <Button variant="text" id="add-recipient-button" onClick={handleChangeRecipient}>
                            {t('+ Add a send (optional)')}
                          </Button>
                        ) : null}
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onCurrencySelect={handleOutputSelect}
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                    />
                    <BalanceText>
                      <BalanceNumber prefix="" value={Number(outputBalance).toFixed(2)} />
                    </BalanceText>
                    {isExpertMode && recipient !== null && !showWrap ? (
                      <>
                        <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                          <ArrowWrapper clickable={false}>
                            <ArrowDownIcon width="16px" />
                          </ArrowWrapper>
                          <Button variant="text" id="remove-recipient-button" onClick={handleRemoveRecipient}>
                            {t('- Remove send')}
                          </Button>
                        </AutoRow>
                        <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                      </>
                    ) : null}
                    <SlippageTextWrapper>
                      <Flex alignItems="center">
                        <SlippageText>
                          <span>{t('Slippage Tolerance')}</span>
                          <b>: {allowedSlippage / 100}%</b>
                        </SlippageText>
                      </Flex>
                      {currencies[Field.INPUT] && currencies[Field.OUTPUT] && (
                        <Flex alignItems="center">
                          <SlippageText>
                            <b>
                              1 {currencies[Field.INPUT]?.symbol} = {trade?.executionPrice.toSignificant(6)}{' '}
                              {currencies[Field.OUTPUT]?.symbol}
                            </b>
                          </SlippageText>
                        </Flex>
                      )}
                    </SlippageTextWrapper>
                  </AutoColumn>
                  <BottomGrouping mt="1rem">
                    {swapIsUnsupported ? (
                      <Button width="100%" disabled mb="4px">
                        {t('Unsupported Asset')}
                      </Button>
                    ) : !account ? (
                      <Flex justifyContent="center">
                        <ConnectWalletButton width="100%" />
                      </Flex>
                    ) : showWrap ? (
                      <Button width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                      </Button>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <GreyCard style={{ textAlign: 'center' }}>
                        <Text color="textSubtle" mb="4px">
                          {t('Insufficient liquidity for this trade.')}
                        </Text>
                        {singleHopOnly && (
                          <Text color="textSubtle" mb="4px">
                            {t('Try enabling multi-hop trades.')}
                          </Text>
                        )}
                      </GreyCard>
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <Button
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          width="48%"
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              {t('Enabling')} <CircleLoader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            t('Enabled')
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                          )}
                        </Button>
                        <Button
                          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                          onClick={handleSwapState}
                          width="48%"
                          id="swap-button"
                          disabled={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3 && !isExpertMode)
                          }
                        >
                          {priceImpactSeverity > 3 && !isExpertMode
                            ? t('Price Impact High')
                            : priceImpactSeverity > 2
                            ? t('Swap Anyway')
                            : t('Swap')}
                        </Button>
                      </RowBetween>
                    ) : (
                      <Button
                        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                        onClick={handleSwapState}
                        id="swap-button"
                        width="100%"
                        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                      >
                        {swapInputError ||
                          (priceImpactSeverity > 3 && !isExpertMode
                            ? `Price Impact Too High`
                            : priceImpactSeverity > 2
                            ? t('Swap Anyway')
                            : t('Swap'))}
                      </Button>
                    )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                    {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                  </BottomGrouping>
                </Wrapper>
              </SwapTabPanel>
              <SwapTabPanel>
                <Wrapper id="pool-page">
                  <Flex alignItems="center" justifyContent="center">
                    <AutoCardNav
                      swapRouter={swapRouter}
                      setSwapRouter={setSwapRouter}
                      connectedNetworkID={chainIdState}
                    />
                  </Flex>
                  <p style={{ color: 'white', fontSize: '14x', textAlign: 'center', lineHeight: '24px' }}>
                    {swapRouter === SwapRouter.SPHYNX_SWAP || swapRouter === SwapRouter.SPHYNX_ETH_SWAP
                      ? 'You are on SphynxSwap!'
                      : swapRouter === SwapRouter.PANCAKE_SWAP
                      ? 'You are on PancakeSwap V2!'
                      : 'You are on Uniswap V2!'}
                  </p>
                  <LiquidityWidget />
                </Wrapper>
              </SwapTabPanel>
              <SwapTabPanel>
                <Wrapper id="pool-page">
                  <Flex alignItems="center" justifyContent="center">
                    <LimitCardNav handleBuySellTab={handleBuySellTab} fieldType={fieldType} />
                  </Flex>
                  {fieldType === Field.BUYOUTPUT ? (
                    <>
                      <AppHeader title={t('')} />
                      <AutoColumn gap="md">
                        <CurrencyInputPanel
                          label={t('')}
                          value={formattedBSAmounts[Field.BUYINPUT]}
                          showMaxButton={!atMaxAmountInput}
                          currency={currencies[Field.BUYINPUT]}
                          onUserInput={handleTypeBuyInput}
                          onMax={handleMaxInput}
                          onCurrencySelect={handleBuyInputSelect}
                          otherCurrency={currencies[Field.BUYOUTPUT]}
                          id="swap-currency-input"
                          isLimit={true}
                        />
                        <AutoColumn justify="space-between">
                          <BalanceText>
                            <BalanceNumber prefix="" value={Number(buyInputBalance).toFixed(2)} />
                          </BalanceText>
                        </AutoColumn>
                        {currencies[Field.BUYOUTPUT] ? (
                          <>
                            <CurrencyInputPanel
                              value={formattedBSAmounts[Field.BUYOUTPUT]}
                              onUserInput={handleTypeBuyOutPut}
                              label={t('')}
                              showMaxButton={false}
                              currency={currencies[Field.BUYOUTPUT]}
                              onCurrencySelect={handleBuyOutputSelect}
                              otherCurrency={currencies[Field.BUYINPUT]}
                              id="swap-currency-output"
                              isLimit={true}
                            />
                            <BalanceText>
                              <BalanceNumber prefix="" value={Number(buyOutputBalance).toFixed(2)} />
                            </BalanceText>
                          </>
                        ) : null}
                      </AutoColumn>
                      {currencies[Field.BUYOUTPUT] ? null : (
                        <SlippageTextWrapper>
                          <Flex alignItems="center">
                            <Slippage18Text onClick={() => handleSelectCurrencyModal(Field.BUYOUTPUT)}>
                              <b>{t('Select a Token to Buy')}</b>
                            </Slippage18Text>
                          </Flex>
                        </SlippageTextWrapper>
                      )}
                      <SlippageTextWrapper>
                        <Flex alignItems="center">
                          <SlippageText>
                            <span>{t('Slippage Tolerance')}</span>
                            <b>: {allowedSlippage / 100}%</b>
                          </SlippageText>
                        </Flex>
                        {currencies[Field.BUYINPUT] && currencies[Field.BUYOUTPUT] && (
                          <Flex alignItems="center">
                            <SlippageText>
                              <b>
                                1 {currencies[Field.BUYINPUT]?.symbol} = {trade?.executionPrice.toSignificant(6)}{' '}
                                {currencies[Field.BUYOUTPUT]?.symbol}
                              </b>
                            </SlippageText>
                          </Flex>
                        )}
                      </SlippageTextWrapper>
                      <BottomGrouping mt="1rem">
                        <Button
                          variant={'primary'}
                          disabled={buyState != 0 && buyState != 1}
                          onClick={() => {
                            if (buyState === 1) {
                              handleLimitApprove()
                            } else {
                              handleLimitOrderBuy()
                            }
                          }}
                          id="swap-button"
                          width="100%"
                        >
                          {buyState === 1
                            ? t('Approve')
                            : buyState === 2
                            ? t(`Insiffient ${currencies[Field.BUYINPUT].symbol} Amount`)
                            : t('Place order')}
                        </Button>
                      </BottomGrouping>
                    </>
                  ) : fieldType === Field.SELLINPUT ? (
                    <>
                      <AppHeader title={t('')} />
                      {currencies[Field.SELLINPUT] ? null : (
                        <SlippageMBTextWrapper>
                          <Flex alignItems="center" border={1}>
                            <Slippage18Text onClick={() => handleSelectCurrencyModal(Field.SELLINPUT)}>
                              <b>{t('Select a Token to Sell')}</b>
                            </Slippage18Text>
                          </Flex>
                        </SlippageMBTextWrapper>
                      )}
                      <AutoColumn gap="md">
                        {currencies[Field.SELLINPUT] ? (
                          <>
                            <CurrencyInputPanel
                              label={t('')}
                              value={formattedBSAmounts[Field.SELLINPUT]}
                              showMaxButton={!atMaxAmountInput}
                              currency={currencies[Field.SELLINPUT]}
                              onUserInput={handleTypeSellInput}
                              onMax={handleMaxInput}
                              onCurrencySelect={handleSellInputSelect}
                              otherCurrency={currencies[Field.SELLOUTPUT]}
                              id="swap-currency-input"
                              isLimit={true}
                            />
                            <AutoColumn justify="space-between">
                              <BalanceText>
                                <BalanceNumber prefix="" value={Number(sellInputBalance).toFixed(2)} />
                              </BalanceText>
                            </AutoColumn>
                          </>
                        ) : null}
                        <CurrencyInputPanel
                          value={formattedBSAmounts[Field.SELLOUTPUT]}
                          onUserInput={handleTypeSellOutPut}
                          label={t('')}
                          showMaxButton={false}
                          currency={currencies[Field.SELLOUTPUT]}
                          onCurrencySelect={handleSellOutputSelect}
                          otherCurrency={currencies[Field.SELLINPUT]}
                          id="swap-currency-output"
                          isLimit={true}
                        />
                        <BalanceText>
                          <BalanceNumber prefix="" value={Number(sellOutputBalance).toFixed(2)} />
                        </BalanceText>
                      </AutoColumn>
                      <SlippageTextWrapper>
                        <Flex alignItems="center">
                          <SlippageText>
                            <span>{t('Slippage Tolerance')}</span>
                            <b>: {allowedSlippage / 100}%</b>
                          </SlippageText>
                        </Flex>
                        {currencies[Field.SELLINPUT] && currencies[Field.SELLOUTPUT] && (
                          <Flex alignItems="center">
                            <SlippageText>
                              <b>
                                1 {currencies[Field.SELLINPUT]?.symbol} = {trade?.executionPrice.toSignificant(6)}{' '}
                                {currencies[Field.SELLOUTPUT]?.symbol}
                              </b>
                            </SlippageText>
                          </Flex>
                        )}
                      </SlippageTextWrapper>
                      <BottomGrouping mt="1rem">
                        <Button
                          variant={'primary'}
                          onClick={() => {
                            if (sellState === 1) {
                              handleLimitApprove()
                            } else {
                              handleLimitOrderSell()
                            }
                          }}
                          id="swap-button"
                          width="100%"
                          disabled={sellState !== 0 && sellState !== 1}
                        >
                          {sellState === 1
                            ? t('Approve')
                            : sellState === 2
                            ? t(`Insiffient ${currencies[Field.SELLINPUT].symbol} Amount`)
                            : t('Place order')}
                        </Button>
                      </BottomGrouping>
                    </>
                  ) : userOrders.length === 0 ? (
                    <Text style={{ textAlign: 'center' }}>No Orders yet</Text>
                  ) : (
                    <>
                      {userOrders.map((order) => (
                        <OrderRow
                          tokenAAddress={order.tokenA}
                          tokenBAddress={order.tokenB}
                          amountA={order.amountA.toString()}
                          amountB={order.amountB.toString()}
                        />
                      ))}
                    </>
                  )}
                </Wrapper>
              </SwapTabPanel>
            </Card>
          </SwapTabs>
          <AdvancedSwapDetailsDropdown trade={trade} />
          <TokenInfoWrapper>
            <TokenInfo tokenData={tokenData} tokenAddress={input} chainId={chainIdState} />
          </TokenInfoWrapper>
        </div>
        <div>
          <FullHeightColumn>
            <ContractPanel
              value=""
              symbol={tokenData && tokenData.symbol ? tokenData.symbol : ''}
              amount={tokenAmount}
              price={tokenPrice}
              quoteCurrencies={quoteCurrencies}
            />
            <CoinStatsBoard
              tokenData={tokenData}
              chainId={chainIdState}
              input={input}
              pairAddress={pairAddress}
              quoteAddress={quoteAddress}
              quoteSymbol={quoteSymbol}
            />
            <ChartContainer
              tokenAddress={input}
              tokenData={tokenData}
              routerVersion={routerVersion}
              chainId={chainIdState}
            />
            <SwapTabs selectedTabClassName="is-selected" selectedTabPanelClassName="is-selected">
              <SwapTabList>
                <SwapTab>
                  <Text textAlign="center" fontSize="14px" bold textTransform="capitalize" color="white">
                    {t('tokenDX')}
                  </Text>
                </SwapTab>
                <SwapTab>
                  <Text textAlign="center" fontSize="14px" bold textTransform="capitalize" color="white">
                    {t('buyers')}
                  </Text>
                </SwapTab>
                <SwapTab>
                  <Text textAlign="center" fontSize="14px" bold textTransform="capitalize" color="white">
                    {t('sellers')}
                  </Text>
                </SwapTab>
                {isMobile && (
                  <SwapTab>
                    <Text textAlign="center" fontSize="14px" bold textTransform="capitalize" color="white">
                      {t('info')}
                    </Text>
                  </SwapTab>
                )}
              </SwapTabList>
              {/* <Card bgColor={theme ? '#0E0E26' : '#2A2E60'} borderRadius="0 0 3px 3px" padding="20px 10px"> */}
              <Card bgColor={theme.custom.tertiary} borderRadius="0 0 3px 3px" padding="20px 10px">
                <SwapTabPanel>
                  <TransactionCard transactionData={transactionData} isLoading={isLoading} symbol={symbol} />
                </SwapTabPanel>
                <SwapTabPanel>
                  <BuyersCard pairAddress={quoteCurrencies[0]?.pair} />
                </SwapTabPanel>
                <SwapTabPanel>
                  <SellersCard pairAddress={quoteCurrencies[0]?.pair} />
                </SwapTabPanel>
                {isMobile && (
                  <SwapTabPanel>
                    <TokenInfo tokenData={tokenData} tokenAddress={input} />
                  </SwapTabPanel>
                )}
              </Card>
            </SwapTabs>
          </FullHeightColumn>
        </div>
      </Cards>
    </SwapPage>
  ) : (
    <Flex justifyContent="center" alignItems="center" style={{ height: 'calc(100vh - 57px)', color: 'red' }}>
      <h3>Please switch to BSC mainnet!</h3>
    </Flex>
  )
}
