import React, { useEffect, useState, useRef, useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Text, Flex, Link, AutoRenewIcon, useMatchBreakpoints } from '@sphynxdex/uikit'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { useTranslation } from 'contexts/Localization'
import { useMenuToggle } from 'state/application/hooks'
import { ERC20_ABI } from 'config/abi/erc20'
import NETWORK_NAMES from 'config/constants/networknames'
import { BURN_ADDRESS } from 'config/constants/addresses'
import { ReactComponent as MainLogo } from 'assets/svg/icon/WarningIcon.svg'
import { ReactComponent as WarningIcon2 } from 'assets/svg/icon/WarningIcon2.svg'
import { ReactComponent as SettingIcon } from 'assets/svg/icon/SettingIcon.svg'
import { ReactComponent as StopwatchIcon } from 'assets/svg/icon/StopwatchIcon1.svg'
import { ReactComponent as LightIcon } from 'assets/svg/icon/LightIcon.svg'
import useToast from 'hooks/useToast'
import LikeIcon from 'assets/images/LikeIcon.png'
import DislikeIcon from 'assets/images/DislikeIcon.png'
import HillariousIcon from 'assets/images/HillariousIcon.png'
import WarningIcon from 'assets/images/WarningIcon.png'
import { getPresaleContract } from 'utils/contractHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useParams } from 'react-router'
import axios from 'axios'
import * as ethers from 'ethers'
import { getDate, format } from 'date-fns'
import { getPresaleAddress } from 'utils/addressHelpers'
import TimerComponent from 'components/Timer/TimerComponent'

import DefaultLogoIcon from 'assets/images/MainLogo.png'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import GitIcon from 'assets/images/githubIcon.png'
import RedditIcon from 'assets/images/redditIcon.png'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'
import { ReactComponent as DiscordIcon } from 'assets/svg/icon/DiscordIcon.svg'
import Loading from 'components/Loading'
import { numberWithCommas } from 'utils'
import DistributeChart from './components/DistributeChart'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  margin-top: 24px;
  text-align: center;
  p {
    line-height: 24px;
  }
  .pendingTx {
    animation: ${rotate} 2s linear infinite;
  }
`

const PageHeader = styled.div`
  width: 100%;
`

const HeaderTitleText = styled(Text)`
  color: white;
  font-weight: 600;
  line-height: 1.5;
  font-size: 14px;
  text-align: left;
  padding: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 30px;
  }
`

const WarningTitleText = styled(HeaderTitleText)`
  font-size: 15px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 22px;
  }
`

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  flex-wrap: wrap;
`

const TokenPresaleContainder = styled.div<{ toggled: boolean }>`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`

const CardWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 10px;
  // background: ${({ theme }) => (theme ? '#1A1A3A' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.cardWrapper};
  min-width: 240px;
  height: fit-content;
  padding: 14px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 24px 34px;
  }
`

const MainCardWrapper = styled(CardWrapper)`
  width: auto;
`

const SubCardWrapper = styled(CardWrapper)`
  width: 300px;
  padding: 30px;
`

const DefiFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
  background: #e93f33;
  border: 1px solid ${({ theme }) => theme.custom.coloredBorder};;
  border-radius: 5px;
  padding: 17px;
  margin-bottom: 10px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 57%;
    margin-bottom: 0px;
  }
`

const SoftFlex = styled(Flex)`
  width: 49%;
  flex-direction: column;
  background: #e97f33;
  border: 1px solid ${({ theme }) => theme.custom.coloredBorder};;
  border-radius: 5px;
  padding: 17px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 19%;
  }
`

const LiquidityFlex = styled(Flex)`
  width: 49%;
  flex-direction: column;
  background: #ffb800;
  border: 1px solid ${({ theme }) => theme.custom.coloredBorder};;
  border-radius: 5px;
  padding: 17px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 19%;
  }
`

const WarningTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: white;
  padding-bottom: 4px;
  text-align: left;
  font-weight: 600;
`

const WarningSubTitle = styled(Text)`
  font-size: 14px;
  text-align: left;
  font-weight: 500;
`

const Separate = styled.div`
  margin-top: 30px;
`

const UnderLine = styled.div`
  width: 100%;
  opacity: 0.1;
  border-bottom: 1px solid #ffffff;
  margin: 10px 0;
`

const TokenContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 16px;
`

const TokenSymbol = styled.div`
  font-weight: 600;
  font-size: 25px;
  text-align: left;
`

const TokenName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #a7a7cc;
  text-align: left;
`

const TokenSymbolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TokenDescription = styled.div`
  margin-top: 25px;
`

const TokenAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 30px;
`

const AddressFlex = styled(Flex)`
  flex-wrap: wrap;
  padding-bottom: 10px;
  justify-content: space-between;
`

const AddressWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  flex-direction: row;
  div {
    font-size: 14px;
  }
  div:last-child {
    color: #f2c94c;
    font-size: 14px;
    font-weight: 600;
    word-break: break-word;
    text-align: left;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: space-between;
  }
`

const AddressSendError = styled.div`
  margin-top: -28px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.15em;
  color: #f2c94c;
  text-align: left;
`

const CustomContract = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  div:last-child {
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    color: white;
  }
`

const WhitelistCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  // border: 1px solid ${({ theme }) => (theme ? '#5E2B60' : '#4A5187')};
  border: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
  box-sizing: border-box;
  border-radius: 5px;
  width: 100%;
  padding: 15px;
  position: relative;
  margin: 10px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 25px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 49%;
    margin: 0;
    padding: 25px;
  }
`

const WhitelistTitle = styled(Text)`
  font-weight: 600;
  font-size: 15px;
  margin-top: 16px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
`

const WhitelistSubText = styled(Text)`
  font-weight: 600;
  font-size: 12px;
  color: white;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 15px;
  }
`

const WalletAddressError = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  div:last-child {
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    color: white;
  }
`

const ContributeWrapper = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
  border-radius: 5px;
  & > div > div {
    font-size: 12px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 49%;
    margin: 0;
    & > div > div {
      font-size: 12px;
    }
  }
`

const TokenRateView = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

const ContributeFlex = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
`

const InputWrapper = styled.div`
  padding: 0 10px;
  border: 1px solid #595989;
  box-sizing: border-box;
  border-radius: 5px;
  justify-content: center;
  display: flex;
  max-width: 50%;
  margin-right: 5px;
  & input {
    width: 100%;
    background: transparent;
    border: none;
    box-shadow: none;
    outline: none;
    color: white;
    font-size: 13px;
    &::placeholder {
      color: white;
    }
  }
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: ${({ theme }) => theme.custom.gradient};
  outline: none;
  color: white;
  width: 98px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 156px;
  }
`

const DarkButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: ${({ theme }) => (theme ? '#0E0E26' : '#191C41')};
  background: ${({ theme }) => theme.custom.secondary};
  outline: none;
  color: white;
  width: 100%;
`

const TokenAmountView = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const DataItem = styled.div`
  display: flex;
  justify-content: center;
  div:first-child {
    flex: 1;
    align-items: center;
    display: flex;
    padding: 5px;
    text-align: start;
    color: #a7a7cc;
    font-style: normal;
    border-bottom: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
    border-right: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
    font-weight: 500;
    font-size: 11px;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 14px;
    }
  }
  div:last-child {
    flex: 1;
    align-items: center;
    display: flex;
    padding: 5px;
    text-align: start;
    color: #f2c94c;
    font-style: normal;
    border-right: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
    border-bottom: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
    font-weight: 500;
    font-size: 11px;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 14px;
    }
  }
`

const DataLatestItem = styled(DataItem)`
  div:first-child {
    border-bottom: 0px;
  }
  div:last-child {
    border-bottom: 0px;
  }
`

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`

const ThinkItem = styled.div`
  border-right: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
  // border: 1px solid ${({ theme }) => (theme ? '#5E2B60' : '#4A5187')};
  box-sizing: border-box;
  border-radius: 11px;
  display: flex;
  height: fit-content;
  padding: 10px;
  flex-direction: column;
  width: 40%;
  align-items: center;
  margin: 9px 9px;
  img {
    width: 25px;
    height: 25px;
  }
  div {
    margin-top: 5px;
    font-weight: 500;
    font-size: 14px;
    color: #a7a7cc;
  }
`

const TokenPresaleBody = styled.div<{ isMobile: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  background: ${({ theme }) => theme.custom.secondary};
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#191C41')};
  padding: ${({ isMobile }) => (isMobile ? '15px 5px' : '23px 28px')};
  border-radius: 5px;
  margin-top: 30px;
  .chart-field {
    padding: 10px;
  }
`

const ThinkCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ProgressBarWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

const ProgressBar = styled.div`
  background-color: #23234b;
  border-radius: 8px;
  position: relative;
`

const Progress = styled.div<{ state }>`
  width: ${(props) => `${props.state}%`};
  height: 12px;
  background: ${({ theme }) => theme.custom.gradient};
  // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  border-radius: 8px;
  padding: 1px;
  display: flex;
  justify-content: center;
  font-size: 9px;
  font-weight: bold;
`

const SocialIconsWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const IconBox = styled.div<{ color?: string }>`
  background: ${({ color }) => color};
  padding: 10px;
  border-radius: 3px;
  display: flex;
  width: fit-content;
  align-items: center;
`

const PresaleLive: React.FC = () => {
  const param: any = useParams()
  const { t } = useTranslation()
  const history = useHistory()
  const { toastSuccess, toastError } = useToast()
  const { menuToggled } = useMenuToggle()
  const [presaleStatus, setPresaleStatus] = useState(false)
  const { library, account, chainId } = useActiveWeb3React()
  const signer = library.getSigner()
  const presaleContract = useMemo(() => getPresaleContract(signer, chainId), [signer])
  const [contribute, setContribute] = useState('')
  const [tokenData, setTokenData] = useState(null)
  const [raise, setRaise] = useState(0)
  const [userContributeBNB, setUserContributeBNB] = useState(0)
  const [userContributeToken, setUserContributeToken] = useState(0)
  const [totalTokenSupply, setTotalTokenSupply] = useState(0)
  const [isClaimed, setIsClaimed] = useState(false)
  const [isDeposited, setIsDeposited] = useState(false)
  const [isWhiteList, setIsWhiteList] = useState(false)
  const [whiteList1, setWhiteList1] = useState(false)
  const [whiteList2, setWhiteList2] = useState(false)
  const [baseWhiteList, setBaseWhiteList] = useState(false)
  const [privateSale1, setPrivateSale1] = useState(false)
  const [privateSale2, setPrivateSale2] = useState(false)
  const [publicSale, setPublicSale] = useState(false)
  const [pendingSale, setPendingSale] = useState(false)
  const [endSale, setendSale] = useState(false)
  const [failedSale, setFailedSale] = useState(false)
  const [pendingContribute, setPendingContribute] = useState(false)
  const [pendingClaim, setPendingClaim] = useState(false)
  const [pendingWithdraw, setPendingWithdraw] = useState(false)
  const presaleAddress = getPresaleAddress(chainId)
  const timerRef = useRef<NodeJS.Timeout>()
  const [loading, setLoading] = useState(true)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [distributeData, setDistributeData] = useState([0, 0, 0, 0, 0])

  const timeFormatting = (time) => {
    return format(new Date(time), 'yyyy-MM-dd HH:mm')
  }

  const nativeCurrency = chainId === ChainId.ETHEREUM ? 'ETH' : 'BNB'
  const swapName = chainId === ChainId.ETHEREUM ? 'Uniswap' : 'PancakeSwap'
  const PRESALE_DATA = [
    {
      presaleItem: 'Sale ID:',
      presaleValue: param.saleId,
    },
    {
      presaleItem: 'Total Supply:',
      presaleValue: `${numberWithCommas(parseFloat(totalTokenSupply.toString()))} ${tokenData && tokenData.token_symbol}`,
    },
    {
      presaleItem: 'Tokens For Presale:',
      presaleValue: `${tokenData && numberWithCommas(parseFloat((tokenData.hard_cap * tokenData.tier3).toString()))} ${tokenData && tokenData.token_symbol}`,
    },
    {
      presaleItem: 'Tokens For Liquidity:',
      presaleValue: `${tokenData && 
        numberWithCommas(parseFloat((tokenData.listing_rate * tokenData.hard_cap * (tokenData.router_rate + tokenData.default_router_rate) / 100).toString()))
        } ${tokenData && tokenData.token_symbol}`,
    },
    {
      presaleItem: 'Soft Cap:',
      presaleValue: `${tokenData && tokenData.soft_cap} ${nativeCurrency}`,
    },
    {
      presaleItem: 'Hard Cap:',
      presaleValue: `${tokenData && tokenData.hard_cap} ${nativeCurrency}`,
    },
    {
      presaleItem: 'Presale Rate:',
      presaleValue: `${tokenData && numberWithCommas((tokenData.tier3).toString())} ${tokenData && tokenData.token_symbol} per ${nativeCurrency}`,
    },
    {
      presaleItem: 'SphynxSwap Listing Rate:',
      presaleValue: `${tokenData && numberWithCommas(tokenData.listing_rate.toString())} ${tokenData && tokenData.token_symbol
        } per ${nativeCurrency}`,
    },
    {
      presaleItem: 'SphynxSwap Liquidity:',
      presaleValue: `${tokenData && tokenData.default_router_rate}%`,
    },
    {
      presaleItem: `${swapName} Liquidity:`,
      presaleValue: `${tokenData && tokenData.router_rate}%`,
    },
    {
      presaleItem: 'Minimum Contribution:',
      presaleValue: `${tokenData && tokenData.min_buy} ${nativeCurrency}`,
    },
    {
      presaleItem: 'Maximum Contribution:',
      presaleValue: `${tokenData && tokenData.max_buy} ${nativeCurrency}`,
    },
    {
      presaleItem: 'Presale Start Time:',
      presaleValue: `${timeFormatting(tokenData && tokenData.start_time * 1000)}`,
    },
    {
      presaleItem: 'Tier1 End Time:',
      presaleValue: `${timeFormatting(tokenData && tokenData.tier1_time * 1000)}`,
      // presaleValue: `${new Date(tokenData && tokenData.tier1_time * 1000).toString()} (UTC)`,
    },
    {
      presaleItem: 'Tier2 End Time:',
      presaleValue: `${timeFormatting(tokenData && tokenData.tier2_time * 1000)}`,
      // presaleValue: `${new Date(tokenData && tokenData.tier2_time * 1000).toString()} (UTC)`,
    },
    {
      presaleItem: 'Presale End Time:',
      presaleValue: `${timeFormatting(tokenData && tokenData.end_time * 1000)}`,
      // presaleValue: `${new Date(tokenData && tokenData.end_time * 1000).toString()} (UTC)`,
    },
    {
      presaleItem: 'Liquidity Unlock:',
      presaleValue: `${timeFormatting(tokenData && tokenData.lock_time * 1000)}`,
      // presaleValue: `${new Date(tokenData && tokenData.lock_time * 1000).toString()} (UTC)`,
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const abi: any = ERC20_ABI
      const tokenContract = new ethers.Contract(tokenData.token_address, abi, signer)
      const decimals = await tokenContract.decimals()
      const balance = await tokenContract.balanceOf(BURN_ADDRESS)

      const listData = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL2}/getTokenLockList/${param.chainId}/${tokenData.token_address}`,
      )
      const lockList: Array<any> = listData.data
      let lockValue = 0
      for (let i = 0; i < lockList.length; i++) {
        lockValue += lockList[i].lock_supply
      }

      const burnValue = parseFloat(ethers.utils.formatUnits(balance, decimals))
      const presaleValue = tokenData.hard_cap * tokenData.tier3
      const liquidityValue =
        (tokenData.listing_rate * tokenData.hard_cap * (tokenData.router_rate + tokenData.default_router_rate)) / 100
      const unlock = totalTokenSupply - burnValue - lockValue - presaleValue - liquidityValue
      setDistributeData([
        parseFloat(((burnValue / totalTokenSupply) * 100).toFixed(5)),
        parseFloat(((lockValue / totalTokenSupply) * 100).toFixed(5)),
        parseFloat(((presaleValue / totalTokenSupply) * 100).toFixed(5)),
        parseFloat(((liquidityValue / totalTokenSupply) * 100).toFixed(5)),
        parseFloat(((unlock / totalTokenSupply) * 100).toFixed(5)),
      ])
    }

    if (tokenData && totalTokenSupply) {
      fetchData()
    }
  }, [tokenData, totalTokenSupply])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (tokenData) {
        const now = Math.floor(new Date().getTime() / 1000)
        if (parseInt(tokenData.start_time) > now) {
          setPendingSale(true)
        } else if (parseInt(tokenData.start_time) < now && now < parseInt(tokenData.tier1_time)) {
          setPendingSale(false)
          setPrivateSale1(true)
        } else if (parseInt(tokenData.tier1_time) < now && now < parseInt(tokenData.tier2_time)) {
          setPendingSale(false)
          setPrivateSale1(false)
          setPrivateSale2(true)
        } else if (parseInt(tokenData.tier2_time) < now && now < parseInt(tokenData.end_time)) {
          setPendingSale(false)
          setPrivateSale1(false)
          setPrivateSale2(false)
          setPublicSale(true)
        } else if (now >= parseInt(tokenData.end_time)) {
          setPendingSale(false)
          setendSale(true)
        }
      }
    }, 10000)
    return () => {
      clearInterval(timerRef.current!)
    }
  }, [timerRef, tokenData])

  useEffect(() => {
    if (chainId && parseInt(param.chainId) !== chainId) {
      alert(`Please make sure you are on the ${NETWORK_NAMES[parseInt(param.chainId)]}!`)
    }

    const isValue = !Number.isNaN(parseInt(param.saleId))
    if (isValue && param.chainId) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL2}/getPresaleInfo/${param.saleId}/${param.chainId}`)
        .then((response) => {
          if (response.data) {
            setTokenData(response.data)
          }
        })
    }
  }, [param.saleId, chainId])

  useEffect(() => {
    const fetchData = async () => {
      let temp: any
      let value: any
      /* from presale contract */
      temp = (await presaleContract.totalContributionBNB(param.saleId)).toString()
      value = parseFloat(ethers.utils.formatEther(temp))
      setRaise(value)
      if (value < tokenData?.soft_cap && endSale) {
        setFailedSale(true)
      }

      temp = await presaleContract.presaleStatus(param.saleId)
      setPresaleStatus(temp)

      temp = (await presaleContract.userContributionBNB(param.saleId, account)).toString()
      value = parseFloat(ethers.utils.formatEther(temp))
      setUserContributeBNB(value)

      temp = (await presaleContract.userContributionToken(param.saleId, account)).toString()
      value = parseFloat(ethers.utils.formatUnits(temp, tokenData.token_decimal))
      setUserContributeToken(value)

      temp = await presaleContract.isClaimed(param.saleId, account)
      setIsClaimed(temp)

      temp = await presaleContract.isDeposited(param.saleId)
      setIsDeposited(temp)

      temp = await presaleContract.iswhitelist(param.saleId)
      setIsWhiteList(temp)
      /* from token contract */
      const abi: any = ERC20_ABI
      const tokenContract = new ethers.Contract(tokenData.token_address, abi, signer)
      temp = (await tokenContract.totalSupply()).toString()
      value = parseFloat(ethers.utils.formatUnits(temp, tokenData.token_decimal))
      setTotalTokenSupply(value)

      temp = await presaleContract.whitelist1(param.saleId, account)
      setWhiteList1(temp)

      temp = await presaleContract.whitelist2(param.saleId, account)
      setWhiteList2(temp)

      temp = await presaleContract.basewhitelist(account)
      setBaseWhiteList(temp)

      setLoading(false)
    }

    if (tokenData) {
      fetchData()
    }
  }, [presaleContract, tokenData, param.saleId, account, endSale, chainId])

  const handlerChange = (e: any) => {
    setContribute(e.target.value)
  }

  const handleContribute = async () => {
    try {
      if (parseInt(param.chainId) !== chainId) {
        const network = parseInt(param.chainId) === ChainId.ETHEREUM ? 'ETHEREUM MAINNET' : 'Binance Smart Chain'
        alert(`Please make sure you are on the ${network}!`)
        return
      }
      const isValue = !Number.isNaN(parseInt(param.saleId))
      if (isValue && parseFloat(contribute) > 0 && tokenData) {
        const value = ethers.utils.parseEther(contribute)
        setPendingContribute(true)
        const tx = await presaleContract.contribute(param.saleId, { value })
        const receipt = await tx.wait()
        if (receipt.status === 1) {
          axios
            .post(`${process.env.REACT_APP_BACKEND_API_URL2}/contribute`, { saleId: param.saleId, chainId })
            .then((res) => {
              console.log('response', res)
            })
        }
        setPendingContribute(false)
        toastSuccess('Success', 'Operation successfully!')
      }
    } catch (err) {
      setPendingContribute(false)
      if (err.data) {
        toastError('Failed', err.data.message)
      } else {
        toastError('Failed', err.message)
      }
    }
  }

  const handleClaimToken = async () => {
    try {
      if (parseInt(param.chainId) !== chainId) {
        const network = parseInt(param.chainId) === ChainId.ETHEREUM ? 'ETHEREUM MAINNET' : 'Binance Smart Chain'
        alert(`Please make sure you are on the ${network}!`)
        return
      }
      setPendingClaim(true)
      const tx = await presaleContract.claimToken(param.saleId)
      await tx.wait()
      setPendingClaim(false)
      toastSuccess('Success', 'Operation successfully!')
    } catch (err) {
      setPendingClaim(false)
      if (err.data) {
        toastError('Failed', err.data.message)
      } else {
        toastError('Failed', err.message)
      }
    }
  }

  const handleEmergencyWithdraw = async () => {
    try {
      if (parseInt(param.chainId) !== chainId) {
        const network = parseInt(param.chainId) === ChainId.ETHEREUM ? 'ETHEREUM MAINNET' : 'Binance Smart Chain'
        alert(`Please make sure you are on the ${network}!`)
        return
      }
      setPendingWithdraw(true)
      const tx = await presaleContract.emergencyWithdraw(param.saleId)
      await tx.wait()
      setPendingWithdraw(false)
      toastSuccess('Success', 'Operation successfully!')
    } catch (err) {
      setPendingWithdraw(false)
      if (err.data) {
        toastError('Failed', err.data.message)
      } else {
        toastError('Failed', err.message)
      }
    }
  }

  const toSphynxSwap = () => {
    history.push(`/swap/${tokenData.token_address}`)
  }

  return (
    <Wrapper>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Flex alignItems="center">
            <MainLogo width="40" height="40" />
            <Flex flexDirection="column" ml="10px">
              <HeaderTitleText>{t('SphynxSale Automated Warning System')}</HeaderTitleText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row" mt="30px">
          <Flex alignItems="center">
            <WarningIcon2 width="40" height="40" />
            <Flex flexDirection="column" ml="10px">
              <WarningTitleText>{t('1 Warnings Detected')}</WarningTitleText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <FlexWrapper style={{ marginTop: '32px' }}>
        <DefiFlex>
          <WarningTitle>DeFi Zone Warning</WarningTitle>
          <WarningSubTitle>
            This sale is listed in the DeFi Zone. Presales in this area use custom contracts that are not vetted by the
            SphynxSale team. Developers of tokens in this area can block transfers, can stop users from claiming tokens,
            can stop trading on exchanges and requires extra vetting. Participate at your own risk!
          </WarningSubTitle>
        </DefiFlex>
        {/* <SoftFlex>
          <WarningTitle>Soft Cap Warning</WarningTitle>
          <WarningSubTitle>The softcap of this sale is very low.</WarningSubTitle>
        </SoftFlex>
        <LiquidityFlex>
          <WarningTitle style={{ color: '#1A1A3A' }}>Liquidity Percentage Warning</WarningTitle>
          <WarningSubTitle color="#1A1A3A" style={{ opacity: '0.7' }}>
            This sale has a very low liquidity percentage.
          </WarningSubTitle>
        </LiquidityFlex> */}
      </FlexWrapper>
      <TokenPresaleBody isMobile={isMobile}>
        <div className="chart-field">
          <DistributeChart symbol={tokenData && tokenData.token_symbol} distributeData={distributeData} />
        </div>
        <TokenPresaleContainder toggled={menuToggled}>
          <MainCardWrapper>
            <Link style={{ marginBottom: '16px' }} href="/launchpad/listing">
              Back to list
            </Link>
            <TokenContainer>
              <img
                src={tokenData && (tokenData.logo_link === '' ? DefaultLogoIcon : tokenData.logo_link)}
                width="64px"
                height="64px"
                alt="token icon"
              />
              <TokenSymbolWrapper>
                <TokenSymbol>{tokenData && tokenData.token_symbol}</TokenSymbol>
                <TokenName>{tokenData && tokenData.token_name}</TokenName>
              </TokenSymbolWrapper>
            </TokenContainer>
            <TokenDescription>
              <Text fontSize="14px" textAlign="left" color="white">
                {tokenData && tokenData.project_dec}
              </Text>
            </TokenDescription>
            <TokenAddressContainer>
              <AddressFlex>
                <AddressWrapper>
                  <Text color="white" bold>
                    Presale Address:
                  </Text>
                  <Text>{presaleAddress}</Text>
                </AddressWrapper>
                <AddressWrapper>
                  <Text color="white" bold>
                    Token Address:
                  </Text>
                  <Text>{tokenData && tokenData.token_address}</Text>
                </AddressWrapper>
              </AddressFlex>
              <AddressSendError>Do not send {nativeCurrency} to the token address!</AddressSendError>
              <CustomContract>
                <SettingIcon />
                <Text>Custom Contract</Text>
              </CustomContract>
            </TokenAddressContainer>
            <Separate />
            <FlexWrapper>
              <ContributeWrapper>
                {PRESALE_DATA.map((item, index) => {
                  const key = `presale-data-${index}`
                  return (
                    <div key={key}>
                      {index === PRESALE_DATA.length - 1 ? (
                        <DataLatestItem>
                          <Text>{item.presaleItem}</Text>
                          <Text>{item.presaleValue}</Text>
                        </DataLatestItem>
                      ) : (
                        <DataItem>
                          <Text>{item.presaleItem}</Text>
                          <Text>{item.presaleValue}</Text>
                        </DataItem>
                      )}
                    </div>
                  )
                })}
              </ContributeWrapper>
              <WhitelistCard>
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <SocialIconsWrapper>
                      <Link external href={tokenData && tokenData.website_link} aria-label="social2">
                        <IconBox color="#710D89">
                          <SocialIcon2 width="15px" height="15px" />
                        </IconBox>
                      </Link>
                      <Link external href={tokenData && tokenData.github_link} aria-label="social2">
                        <IconBox color="#3f4492">
                          <img src={GitIcon} alt="Git Logo" width="15px" height="15px" />
                        </IconBox>
                      </Link>
                      <Link external href={tokenData && tokenData.twitter_link} aria-label="twitter">
                        <IconBox color="#33AAED">
                          <TwitterIcon width="15px" height="15px" />
                        </IconBox>
                      </Link>
                      <Link external href={tokenData && tokenData.reddit_link} aria-label="discord">
                        <IconBox color="#2260DA">
                          <img src={RedditIcon} alt="Git Logo" width="15px" height="15px" />
                        </IconBox>
                      </Link>
                      <Link external href={tokenData && tokenData.telegram_link} aria-label="telegram">
                        <IconBox color="#3E70D1">
                          <TelegramIcon width="15px" height="15px" />
                        </IconBox>
                      </Link>
                    </SocialIconsWrapper>
                    {publicSale ? (
                      <WhitelistTitle>Public Sale</WhitelistTitle>
                    ) : (
                      <>
                        <WhitelistTitle>{isWhiteList ? 'WhiteList Enabled' : 'Public'} Sale</WhitelistTitle>
                        <WhitelistSubText mb={isWhiteList ? '12px' : '28px'}>
                          {isDeposited
                            ? isWhiteList
                              ? 'Only Whitelisted Wallets can Purchase This Token!'
                              : 'Anybody can Purchase This Token!'
                            : 'This token is not deposited!'}
                        </WhitelistSubText>
                        {isWhiteList && whiteList1 && <Text mb="24px">Your wallet address is on the whitelist1!</Text>}
                        {isWhiteList && whiteList2 && <Text>Your wallet address is on the whitelist2!</Text>}
                        {isWhiteList && !whiteList1 && !whiteList2 && baseWhiteList && (
                          <Text>Your wallet address is on the base whitelist!</Text>
                        )}
                        {isWhiteList && !whiteList1 && !whiteList2 && !baseWhiteList && (
                          <WalletAddressError>
                            <img src={WarningIcon} alt="nuclear icon" />
                            <Text>Your wallet address is not whitelisted</Text>
                          </WalletAddressError>
                        )}
                      </>
                    )}

                    {!failedSale ? (
                      presaleStatus ? (
                        <>
                          <Text textAlign="left" fontSize="14px" fontWeight="500" color="white">
                            This presale has ended. Go back to the dashboard to view others!
                          </Text>
                          {/* <Link external href="https://pancakeswap.finance/swap" style={{ width: '100%' }}>
                      <DarkButton style={{ width: '100%', textDecoration: 'none' }} mt="16px">
                        Trade on PancakeSwap
                      </DarkButton>
                    </Link> */}
                          <DarkButton onClick={toSphynxSwap} style={{ width: '100%' }} mt="16px">
                            Trade on SphynxSwap
                          </DarkButton>
                          <Text textAlign="left" fontSize="14px" fontWeight="500" mt="16px" color="white">
                            If you participated in the presale click the claim button below to claim your tokens!
                          </Text>
                          <ColorButton
                            style={{ width: '100%' }}
                            mt="16px"
                            mb="16px"
                            onClick={handleClaimToken}
                            disabled={isClaimed || pendingClaim}
                          >
                            {pendingClaim && <AutoRenewIcon className="pendingTx" />}
                            Claim Token
                          </ColorButton>
                        </>
                      ) : (
                        <>
                          <WhitelistTitle>
                            Raised: {raise}/{tokenData?.hard_cap}
                          </WhitelistTitle>
                          <ProgressBarWrapper>
                            <ProgressBar>
                              <Progress state={(raise / tokenData?.hard_cap) * 100} />
                            </ProgressBar>
                          </ProgressBarWrapper>
                          <TokenRateView>
                            <Text fontSize="14px" fontWeight="600" color="white" textAlign="left">
                              1 {nativeCurrency} = {tokenData && tokenData.tier3} {tokenData && tokenData.token_symbol}{' '}
                            </Text>
                          </TokenRateView>
                          <ContributeFlex>
                            <InputWrapper>
                              <input placeholder="" onChange={handlerChange} />
                            </InputWrapper>
                            <ColorButton onClick={handleContribute} disabled={pendingContribute}>
                              Contribute
                              {pendingContribute && <AutoRenewIcon className="pendingTx" />}
                            </ColorButton>
                          </ContributeFlex>
                          <Flex alignItems="center" style={{ width: '100%' }}>
                            <StopwatchIcon />
                            <Text fontSize="13px" fontWeight="600" style={{ margin: '0 10px' }}>
                              {privateSale1
                                ? 'Tier 1 sale ends in'
                                : privateSale2
                                  ? 'Tier 2 sale ends in'
                                  : pendingSale
                                    ? 'Presale starts in'
                                    : 'Public sale ends in'}{' '}
                            </Text>
                            <TimerComponent
                              time={
                                tokenData && privateSale1
                                  ? tokenData?.tier1_time
                                  : privateSale2
                                    ? tokenData?.tier2_time
                                    : pendingSale
                                      ? tokenData?.start_time
                                      : tokenData?.end_time
                              }
                            />
                          </Flex>
                          <UnderLine />
                        </>
                      )
                    ) : (
                      <>
                        <Text textAlign="left" fontSize="12px" fontWeight="500" color="white">
                          This presale has failed!
                        </Text>
                        <Text textAlign="left" fontSize="12px" fontWeight="500" mt="16px" color="white">
                          If you participated in the presale click the claim button below to claim your {nativeCurrency}
                          !
                        </Text>
                        <ColorButton
                          style={{ width: '100%' }}
                          mt="16px"
                          mb="16px"
                          onClick={handleClaimToken}
                          disabled={isClaimed || pendingClaim}
                        >
                          Claim {nativeCurrency}
                          {pendingClaim && <AutoRenewIcon className="pendingTx" />}
                        </ColorButton>
                      </>
                    )}
                    <TokenAmountView>
                      <Text fontSize="14px" fontWeight="600" color="white">
                        Your Contributed Account:
                      </Text>
                      <Text fontSize="14px" fontWeight="600" textAlign="center" color="#F2C94C">
                        {userContributeBNB}
                        {nativeCurrency}
                      </Text>
                    </TokenAmountView>
                    <UnderLine />
                    <TokenAmountView>
                      <Text fontSize="14px" fontWeight="600" color="white">
                        Your Reserved Tokens:
                      </Text>
                      <Text fontSize="14px" fontWeight="600" textAlign="center" color="#F2C94C">
                        {userContributeToken} {tokenData && tokenData.token_symbol}
                      </Text>
                    </TokenAmountView>
                    {!presaleStatus && !failedSale ? (
                      <>
                        <Separate />
                        <DarkButton onClick={handleEmergencyWithdraw} disabled={pendingWithdraw}>
                          Emergency Withdraw
                          {pendingWithdraw && <AutoRenewIcon className="pendingTx" />}
                        </DarkButton>
                      </>
                    ) : (
                      ''
                    )}
                  </>
                )}
              </WhitelistCard>
            </FlexWrapper>
            <Separate />
          </MainCardWrapper>
          {/* <SubCardWrapper>
            <ThinkCardWrapper>
              <LightIcon />
              <WhitelistTitle>What do you think?</WhitelistTitle>
              <ItemContainer>
                <ItemWrapper>
                  <ThinkItem>
                    <img src={LikeIcon} alt="think icon" />
                    <Text>Like</Text>
                  </ThinkItem>
                  <ThinkItem>
                    <img src={HillariousIcon} alt="think icon" />
                    <Text>Hillarious</Text>
                  </ThinkItem>
                </ItemWrapper>
                <ItemWrapper>
                  <ThinkItem>
                    <img src={DislikeIcon} alt="think icon" />
                    <Text>Dislike</Text>
                  </ThinkItem>
                  <ThinkItem>
                    <img src={WarningIcon} alt="think icon" />
                    <Text>Scam</Text>
                  </ThinkItem>
                </ItemWrapper>
              </ItemContainer>
              <Separate />
              <Link external href="https://discord.gg/ZEuDaFk4qz" aria-label="discord">
                <ColorButton style={{ width: '180px' }}>Join Community</ColorButton>
              </Link>
            </ThinkCardWrapper>
          </SubCardWrapper> */}
        </TokenPresaleContainder>
      </TokenPresaleBody>
    </Wrapper>
  )
}

export default PresaleLive
