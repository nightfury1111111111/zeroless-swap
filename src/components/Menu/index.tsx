/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link as ReactLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'state'
import styled from 'styled-components'
import { useLocation } from 'react-router'
import { Button, Link, Toggle } from '@sphynxdex/uikit'
import { addToken, updateToken, deleteTokens } from 'state/wallet/tokenSlice'
import { useMenuToggle, useRemovedAssets } from 'state/application/hooks'
import AppMenuItem from './MenuItem'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { BITQUERY_NETWORK_LIST } from 'config/index'
import MainLogo from 'assets/images/Logo.jpg'
import { v4 as uuidv4 } from 'uuid'
import CloseIcon from '@material-ui/icons/Close'
import Web3 from 'web3'
import ERC20ABI from 'assets/abis/erc20.json'
import ERC20ABIETH from 'assets/abis/erc20ETH.json'
import { isAddress } from 'utils'
import { SPHYNX_PAIR_ADDRESS, SPHYNX_TOKEN_ADDRESS, SPHYNX_OLD_TOKEN_ADDRESS } from 'config/constants'
import { ReactComponent as MenuOpenIcon } from 'assets/svg/icon/MenuOpenIcon.svg'
import { ReactComponent as WalletIcon } from 'assets/svg/icon/WalletIcon.svg'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'
import { ReactComponent as DiscordIcon } from 'assets/svg/icon/DiscordIcon.svg'
import { ReactComponent as CoingeckoIcon } from 'assets/svg/icon/Coingecko.svg'
import { ReactComponent as CoinMarketCapsIcon } from 'assets/svg/icon/CoinMarketCaps.svg'
import axios from 'axios'
import { BITQUERY_API, BITQUERY_API_KEY } from 'config/constants/endpoints'
import storages from 'config/constants/storages'
import addresses from 'config/constants/addresses'
import chainIds from 'config/constants/chainIds'
import { TOKEN_INTERVAL } from 'config/constants/info'
import { BalanceNumber } from 'components/BalanceNumber'
import { useTranslation } from 'contexts/Localization'
import { links } from './config'
import { linksTemp } from './configTemp'
import { Field, replaceSwapState } from '../../state/swap/actions'
import { getBNBPrice } from 'utils/priceProvider'
import { useThemeManager } from 'state/user/hooks'
import { useDefaultThemeChange } from 'state/application/hooks'
import ThemeToggle from 'components/ThemeToggle'

const abiBNB: any = ERC20ABI
const bnbProviderURL = 'https://bsc-dataseed.binance.org/'
const bnbWeb3 = new Web3(new Web3.providers.HttpProvider(bnbProviderURL))

const abiETH: any = ERC20ABIETH
const ethProviderURL = 'https://speedy-nodes-nyc.moralis.io/fbb4b2b82993bf507eaaab13/eth/mainnet/archive'
const ethWeb3 = new Web3(new Web3.providers.HttpProvider(ethProviderURL))

const MenuWrapper = styled.div<{ toggled: boolean }>`
  width: 240px;
  background: #142028;
  border-right: ${({ theme }) => theme.custom.menuBorder};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  box-shadow: ${({ theme }) => theme.custom.menuShadow};
  left: ${(props) => (props.toggled ? '-320px' : 0)};
  transition: left 0.5s;
  z-index: 2;
  height: 100vh;
  a {
    text-decoration: none;
  }

  img {
    margin-top: 20px;
  }

  & p {
    font-size: 16px;
    line-height: 19px;
    color: white;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    left: 0;
    width: ${(props) => (props.toggled ? '51px' : '240px')};
    & p {
      font-size: ${(props) => (props.toggled ? '14px' : '16px')};
      line-height: ${(props) => (props.toggled ? '16px' : '19px')};
    }
  }
`

const MenuIconWrapper = styled.div<{ toggled: boolean }>`
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.toggled ? 'center' : 'space-between')};
  align-items: center;
  padding: ${(props) => (props.toggled ? '0' : '0 24px')};
  & span {
    color: white;
    font-weight: bold;
    font-size: 12px;
    line-height: 16px;
    text-transform: uppercase;
  }
  & button {
    background: transparent !important;
    padding: 10px;
    outline: none;
    & svg path {
      fill: white;
    }
  }
`

const MenuContentWrapper = styled.div<{ toggled: boolean }>`
  width: 100%;
  flex: 1;
  justify-content: center;
  overflow-y: auto;
  padding-bottom: 100px;
`

const WalletHeading = styled.div<{ toggled: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.toggled ? 'center' : 'space-between')};
  align-items: center;
  background: ${({ theme }) => theme.custom.walletBackground};
  width: 100%;
  // height: 56px;
  padding: ${(props) => (props.toggled ? '0' : '0 25px')};
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  & div {
    display: flex;
    align-items: center;
    & svg {
      margin: auto;
    }

    p {
      margin-left: 16px;
    }
  }
`
const TokenItemWrapper = styled.div<{ toggled: boolean }>`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.custom.divider};
  border-radius: 8px;
  margin-top: 2px;
  display: flex;
  justify-content: space-between;
  padding: ${(props) => (props.toggled ? '4px' : '8px 24px 8px 12px')};
  position: relative;
  cursor: pointer;
  & > div:first-child {
    width: ${(props) => (props.toggled ? '100%' : '66%')};
  }
  & > div:last-child {
    width: ${(props) => (props.toggled ? '100%' : '32%')};
  }
  & div p:last-child {
    margin-top: ${(props) => (props.toggled ? '0px' : '8px')};
  }
  & p {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    margin-right: 12px;
    font-size: ${(props) => (props.toggled ? '10px' : '14px')};
  }
`

const ButtonWrapper = styled.div`
  background: ${({ theme }) => theme.custom.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  margin: 10px 0;
  padding: 5px 16px;
  border-radius: 5px;
  cursor: pointer;
  & p {
    width: calc(100% - 32px);
  }
`

const MenuItem = styled.div<{ toggled: boolean }>`
  display: none;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${(props) => (props.toggled ? '5px' : '5px 16px')};
    margin: 5px 0;
    text-decoration: none !important;
    & p {
      width: calc(100% - 32px);
      font-size: 14px;
      font-weight: 600;
      color: white;
    }
    &:hover,
    &.active {
      background: ${({ theme }) => theme.custom.primary};
      p {
        color: white;
      }
    }
  }
  &:hover,
  &.active {
    background: ${({ theme }) => theme.custom.primary};
    p {
      color: white;
    }
  }
`

const MenuItemMobile = styled.a`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 16px;
  margin: 5px 0;
  border-radius: 5px;
  text-decoration: none !important;
  & p {
    width: calc(100% - 32px);
    font-size: 14px;
    font-weight: 600;
    color: white;
  }
  &:hover,
  &.active {
    background: ${({ theme }) => theme.custom.primary};
    p {
      color: white;
    }
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const SocialWrapper = styled.div`
  margin: 10px 0 32px;
  & p {
    font-size: 16px;
    font-weight: 600;
    margin-left: 12px;
    margin-bottom: 10px;
  }
  position: fixed;
  bottom: 0px;
`

const TokenListWrapper = styled.div`
  overflow-y: auto;
  max-height: 330px;
`

const SocialIconsWrapper = styled.div<{ toggled: boolean }>`
  display: flex;
  gap: ${(props) => (props.toggled ? '8px' : '30px')};
  flex-direction: ${(props) => (props.toggled ? 'column' : 'row')};
  margin-left: ${(props) => (props.toggled ? '0px' : '12px')};
  align-items: center;
  margin-bottom: 8px;
  padding-left: ${(props) => (props.toggled ? '0px' : '20px')};
`

const RemoveIconWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 20;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  & svg {
    width: 14px;
    height: 14px;
  }
  & svg path {
    fill: white;
  }
`

const TokenIconContainer = styled.div`
  position: relative;
`

const IconBox = styled.div<{ color?: string }>`
  background: ${({ color }) => color};
  padding: 10px;
  border-radius: 3px;
  display: flex;
  width: fit-content;
  align-items: center;
`

const Menu = () => {
  const { menuToggled, toggleMenu } = useMenuToggle()
  const { removedAssets, setRemovedAssets } = useRemovedAssets()
  const [showAllToken, setShowAllToken] = useState(true)
  const { chainId, account } = useActiveWeb3React()

  const dispatch = useDispatch()
  const { pathname } = useLocation()

  const [sum, setSum] = useState(0)
  const [getAllToken, setAllTokens] = useState([])
  const [updateFlag, setUpdateFlag] = useState(false)
  const [isDark, toggleTheme] = useThemeManager()
  const [currentTheme, toggleDefaultTheme] = useDefaultThemeChange()
  const [clickedBaseUrl, setClickedBaseUrl] = useState('')
  const tokens = useSelector<AppState, AppState['tokens']>((state) => state.tokens)

  const { t } = useTranslation()

  const isMobile = document.body.clientWidth < 768
  const isTablet = document.body.clientWidth > 1080

  useEffect(() => {
    if (isMobile && !menuToggled) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, menuToggled])

  const getDataQuery = `
  {
    ethereum(network: ${BITQUERY_NETWORK_LIST[chainId]}) {
      address(address: {is: "${account}" }){
        balances {
          value
          currency {
            address
            symbol
            tokenType
            decimals
          }
        }
      }
    }
  }`

  const getSphynxQuery = `
  {
  ethereum(network: ${BITQUERY_NETWORK_LIST[chainId]}) {
      dexTrades(
      options: {desc: ["block.height", "tradeIndex"], limit: 1, offset: 0}
      date: {till: null}
      smartContractAddress: {is: "${SPHYNX_PAIR_ADDRESS}"}
      baseCurrency: {is: "${SPHYNX_TOKEN_ADDRESS}"}
      quoteCurrency:{is : "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
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

  const fetchData = async () => {
    if (account) {
      const bnbPrice = await getBNBPrice()

      let removedTokens = JSON.parse(localStorage.getItem(storages.LOCAL_REMOVED_TOKENS))
      if (removedTokens === null) {
        removedTokens = []
      }
      setRemovedAssets(removedTokens)

      const bitConfig = {
        headers: {
          'X-API-KEY': BITQUERY_API_KEY,
        },
      }
      const queryResult = await axios.post(BITQUERY_API, { query: getDataQuery }, bitConfig)
      if (queryResult.data.data) {
        let allsum: any = 0
        let balances = queryResult.data.data.ethereum.address[0].balances
        if (balances === null) return
        balances = balances.filter(
          (balance) =>
            balance.value !== 0 && balance.currency.address.toLowerCase() !== SPHYNX_OLD_TOKEN_ADDRESS.toLowerCase(),
        )
        balances = balances.filter(
          (balance) => balance.currency.address.toLowerCase() !== SPHYNX_OLD_TOKEN_ADDRESS.toLowerCase(),
        )
        if (balances && balances.length > 0) {
          balances = balances.filter((balance) => balance.value !== 0)
          const promises = balances.map((elem) => {
            let address = elem.currency.address
            if (address === '-') {
              switch (chainId) {
                case chainIds.BNB_CHAIN_ID:
                  address = addresses.WBNB_ADDRESS
                  break
                case chainIds.ETH_CHAIN_ID:
                  address = addresses.WETH_ADDRESS
                  break
                default:
                  address = addresses.WBNB_ADDRESS
              }
            }
            return axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/price/${address}/${chainId}`)
          })

          const prices: any = await Promise.all(promises)
          let i = 0

          // eslint-disable-next-line no-restricted-syntax
          for (const elem of balances) {
            const result = isAddress(elem.currency.address)
            if (result) {
              let contract
              switch (chainId) {
                case chainIds.BNB_CHAIN_ID:
                  contract = new bnbWeb3.eth.Contract(abiBNB, elem.currency.address)
                  break
                case chainIds.ETH_CHAIN_ID:
                  contract = new ethWeb3.eth.Contract(abiETH, elem.currency.address)
                  break
                default:
                  contract = new bnbWeb3.eth.Contract(abiBNB, elem.currency.address)
              }
              const tokenBalance = await contract.methods.balanceOf(account).call()
              elem.value = tokenBalance / Math.pow(10, elem.currency.decimals)
            } else if (elem.currency.symbol === 'BNB') {
              const bnbBalance = await bnbWeb3.eth.getBalance(account)
              elem.value = bnbWeb3.utils.fromWei(bnbBalance)
            } else if (elem.currency.symbol === 'ETH') {
              const ethBalance = await ethWeb3.eth.getBalance(account)
              elem.value = ethWeb3.utils.fromWei(ethBalance)
            }

            let sphynxPrice
            if (elem.currency.symbol === 'SPHYNX') {
              const queryResult1 = await axios.post(BITQUERY_API, { query: getSphynxQuery }, bitConfig)
              if (queryResult1.data.data && queryResult1.data.data.ethereum.dexTrades) {
                sphynxPrice = queryResult1.data.data.ethereum.dexTrades[0]?.quotePrice * bnbPrice
              }
              elem.currency.price = sphynxPrice
            } else {
              elem.currency.price = prices[i].data.price
            }

            const dollerprice: any = elem.currency.price * elem.value
            elem.dollarPrice = dollerprice
            i++
            if (removedTokens.indexOf(elem.currency.symbol) === -1) {
              allsum += dollerprice
            }

            if (elem.dollarPrice > 0) {
              let flag = false
              const token = { symbol: elem.currency.symbol, value: elem.value }
              tokens.forEach((cell) => {
                if (cell.symbol === token.symbol) {
                  dispatch(updateToken(token))
                  flag = true
                  return
                }
              })

              if (!flag) dispatch(addToken(token))
            }
          }
          balances = balances.filter((balance) => balance.dollarPrice !== 0)
        } else {
          dispatch(deleteTokens())
        }
        setSum(allsum)
        setAllTokens(balances ? balances : [])
      }
    } else {
      dispatch(deleteTokens())
    }
  }

  const updateWallet = () => {
    let allsum = 0
    getAllToken.forEach((elem) => {
      if (removedAssets.indexOf(elem.currency.symbol) === -1) {
        allsum += elem.dollarPrice
      }
    })

    setSum(allsum)
  }

  const updateData = async () => {
    let allsum: any = 0
    let balances = getAllToken

    if (balances && balances.length > 0 && account) {
      // eslint-disable-next-line no-restricted-syntax
      const sessionData = JSON.parse(sessionStorage.getItem(storages.SESSION_LIVE_PRICE))
      for (const elem of balances) {
        const result = isAddress(elem.currency.address)
        if (result) {
          let contract
          switch (chainId) {
            case chainIds.BNB_CHAIN_ID:
              contract = new bnbWeb3.eth.Contract(abiBNB, elem.currency.address)
              break
            case chainIds.ETH_CHAIN_ID:
              contract = new ethWeb3.eth.Contract(abiETH, elem.currency.address)
              break
            default:
              contract = new bnbWeb3.eth.Contract(abiBNB, elem.currency.address)
          }
          const tokenBalance = await contract.methods.balanceOf(account).call()
          elem.value = tokenBalance / Math.pow(10, elem.currency.decimals)
        } else if (elem.currency.symbol === 'BNB') {
          const bnbBalance = await bnbWeb3.eth.getBalance(account)
          elem.value = bnbWeb3.utils.fromWei(bnbBalance)
        } else if (elem.currency.symbol === 'ETH') {
          const ethBalance = await ethWeb3.eth.getBalance(account)
          elem.value = ethWeb3.utils.fromWei(ethBalance)
        }

        if (sessionData && elem.currency.address === sessionData.input) {
          elem.currency.price = sessionData.price
        }

        const dollerprice: any = elem.currency.price * elem.value
        elem.dollarPrice = dollerprice
        if (removedAssets.indexOf(elem.currency.symbol) === -1) {
          allsum += dollerprice
        }

        if (elem.dollarPrice > 0) {
          let flag = false
          const token = { symbol: elem.currency.symbol, value: elem.value }
          tokens.forEach((cell) => {
            if (cell.symbol === token.symbol) {
              dispatch(updateToken(token))
              flag = true
              return
            }
          })

          if (!flag) dispatch(addToken(token))
        }
      }

      balances = balances.filter((balance) => balance.dollarPrice !== 0)
    } else {
      dispatch(deleteTokens())
    }
    setSum(allsum)
    setAllTokens(balances ? balances : [])
  }

  const checkTokens = () => {
    setUpdateFlag(false)
    setUpdateFlag(true)
  }

  useEffect(() => {
    if (!updateFlag) return
    updateData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFlag])

  useEffect(() => {
    const intervalId = setInterval(checkTokens, TOKEN_INTERVAL)
    return () => {
      clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId])

  useEffect(() => {
    updateWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removedAssets])

  const removeAsset = (asset: any) => {
    const assets = removedAssets.map((val) => val)
    assets.push(asset.currency.symbol)
    setRemovedAssets(assets)
    localStorage.setItem(storages.LOCAL_REMOVED_TOKENS, JSON.stringify(assets))
  }

  const tokenData = getAllToken
    .filter((val) => removedAssets.findIndex((item) => item === val.currency.symbol) === -1)
    .sort((a, b) => (Number(a.dollarPrice) < Number(b.dollarPrice) ? 1 : -1))
    .map((item) => ({
      ...item,
      id: uuidv4(),
    }))
    .map((elem: any) => {
      const { currency, value, dollarPrice, id } = elem

      const handleTokenItem = () => {
        dispatch(
          replaceSwapState({
            outputCurrencyId: 'BNB',
            inputCurrencyId: currency.address,
            typedValue: '',
            field: Field.OUTPUT,
            recipient: null,
          }),
        )
      }

      const handleRemoveAsset = () => {
        removeAsset(elem)
      }
      return (
        <TokenIconContainer key={id}>
          <ReactLink to={`/swap/${currency.address}`}>
            <a>
              <TokenItemWrapper toggled={menuToggled} onClick={handleTokenItem}>
                {menuToggled ? (
                  <>
                    <div>
                      <p>
                        <b>{currency.symbol}</b>
                      </p>
                      <p>
                        <BalanceNumber prefix="$" value={Number(dollarPrice).toFixed(2)} />
                      </p>
                      <p>
                        <BalanceNumber prefix="" value={Number(value).toFixed(2)} />
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p>
                        <b>{currency.symbol}</b>
                      </p>
                      <p>
                        <BalanceNumber prefix="$" value={Number(dollarPrice).toFixed(2)} />
                      </p>
                    </div>
                    <div>
                      <p>
                        <BalanceNumber prefix="" value={Number(value).toFixed(2)} />
                      </p>
                      <p />
                    </div>
                  </>
                )}
              </TokenItemWrapper>
            </a>
          </ReactLink>
          {!menuToggled && (
            <RemoveIconWrapper onClick={handleRemoveAsset}>
              <CloseIcon />
            </RemoveIconWrapper>
          )}
        </TokenIconContainer>
      )
    })

  const showAllRemovedTokens = useCallback(() => {
    localStorage.setItem(storages.LOCAL_REMOVED_TOKENS, null)
    setRemovedAssets([])
  }, [setRemovedAssets])

  const handleToggleMenu = useCallback(() => {
    toggleMenu(!menuToggled)
  }, [menuToggled, toggleMenu])

  const handleClickMainMenuItem = useCallback((baseurl) => {
    setClickedBaseUrl(baseurl)
    handleToggleMenu()
  }, [])

  const handleShowAllToken = useCallback(() => {
    if (!showAllToken) {
      localStorage.setItem(storages.LOCAL_REMOVED_TOKENS, null)
      setRemovedAssets([])
    }
    setShowAllToken(!showAllToken)
  }, [showAllToken])

  const handleMobileMenuItem = useCallback(() => {
    toggleMenu(false)
  }, [toggleMenu])

  const MemoMenuHeader = useMemo(
    () => (
      <>
        <Link external href="https://thesphynx.co">
          <img src={MainLogo} alt="Main Logo" width={menuToggled ? '50' : '100'} height={menuToggled ? '50' : '100'} />
        </Link>
        <MenuIconWrapper toggled={menuToggled}>
          {!menuToggled && <span>{t('Main Menu')}</span>}
          <Button onClick={handleToggleMenu} aria-label="menu toggle">
            {menuToggled ? (
              <svg viewBox="0 0 24 24" width="24px">
                <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" />
              </svg>
            ) : (
              <MenuOpenIcon />
            )}
          </Button>
        </MenuIconWrapper>
        {/* <MenuIconWrapper style={{ marginBottom: '20px' }} toggled={menuToggled}>
          {!menuToggled && <span>{t('Toggle theme')}</span>}
          <ThemeToggle current={currentTheme} toggleFunc={toggleDefaultTheme} />
        </MenuIconWrapper> */}
        {/* {isMobile && isDefault && (
          <MenuIconWrapper toggled={menuToggled} style={{ marginBottom: '12px' }}>
            {!menuToggled && <span>{isDark ? t('Dark Theme') : t('Light Theme')}</span>}
            <Toggle checked={isDark} onChange={toggleTheme} scale="sm" />
          </MenuIconWrapper>
        )} */}
        {/* <WalletHeading toggled={menuToggled}>
          <div>
            <WalletIcon />
            {!menuToggled && <p>{t('Wallet')}</p>}
          </div>
          {!menuToggled && <p>{account ? <BalanceNumber prefix="$ " value={Number(sum).toFixed(2)} /> : ''}</p>}
        </WalletHeading> */}
        {account && !menuToggled && !isMobile ? (
          <div style={{ width: '100%' }}>
            <TokenListWrapper>{showAllToken ? tokenData : tokenData.slice(0, 3)}</TokenListWrapper>
            <ButtonWrapper style={menuToggled ? { justifyContent: 'center' } : {}} onClick={handleShowAllToken}>
              <WalletIcon />
              {!menuToggled && <p>{showAllToken ? t('Show Tokens') : t('Show All Tokens')}</p>}
            </ButtonWrapper>
            {removedAssets.length === 0 ? null : (
              <ButtonWrapper style={menuToggled ? { justifyContent: 'center' } : {}} onClick={showAllRemovedTokens}>
                <WalletIcon />
                {!menuToggled && <p>{t('Refresh')}</p>}
              </ButtonWrapper>
            )}
          </div>
        ) : (
          ''
        )}
      </>
    ),
    [isDark, menuToggled, removedAssets, showAllToken, tokenData, sum],
  )

  // const MemoMenuCollapsed = useMemo(
  //   () => (
  //     <>
  //       {linksTemp
  //         .map((item) => ({
  //           ...item,
  //           id: uuidv4(),
  //         }))
  //         .map((link) => {
  //           const Icon = link.Icon
  //           const href = link.link
  //           if (href) {
  //             return link.link?.indexOf('https') === 0 ? (
  //               <a key={link.id} target="_blank" href={link.link}>
  //                 <MenuItem
  //                   key={link.id}
  //                   className={window.location.pathname == link.link && link.link !== '/' ? 'active' : ''}
  //                   style={menuToggled ? { justifyContent: 'center' } : {}}
  //                   toggled={menuToggled}
  //                 >
  //                   <Icon />
  //                 </MenuItem>
  //               </a>
  //             ) : (
  //               <ReactLink key={link.id} to={link.link}>
  //                 <MenuItem
  //                   key={link.id}
  //                   className={window.location.pathname == link.link && link.link !== '/' ? 'active' : ''}
  //                   style={menuToggled ? { justifyContent: 'center' } : {}}
  //                   toggled={menuToggled}
  //                 >
  //                   <Icon />
  //                 </MenuItem>
  //               </ReactLink>
  //             )
  //           } else {
  //             return (
  //               <MenuItem
  //                 key={link.id}
  //                 className={window.location.pathname.includes(link.baseurl) && link.link !== '/' ? 'active' : ''}
  //                 style={menuToggled ? { justifyContent: 'center' } : {}}
  //                 toggled={menuToggled}
  //                 onClick={() => handleClickMainMenuItem(link.baseurl)}
  //               >
  //                 <Icon />
  //               </MenuItem>
  //             )
  //           }
  //         })}
  //     </>
  //   ),
  //   [menuToggled, pathname],
  // )

  const MemoMenuExpanded = useMemo(
    () => (
      <>
        {linksTemp
          .map((item) => ({
            ...item,
            id: uuidv4(),
          }))
          .map((link) => {
            return (
              <AppMenuItem
                key={link.id}
                {...link}
                isMobile={!isTablet}
                handleClickMobileMenu={handleMobileMenuItem}
                clickedBaseUrl={clickedBaseUrl}
              />
            )
          })}
      </>
    ),
    [menuToggled],
  )

  return (
    <MenuWrapper toggled={menuToggled}>
      {MemoMenuHeader}
      <MenuContentWrapper toggled={menuToggled}>
        {/* {menuToggled && isTablet ? MemoMenuCollapsed : MemoMenuExpanded} */}
        {MemoMenuExpanded}
        <SocialWrapper>
          {!menuToggled && <p>{t('Socials')}</p>}
          <SocialIconsWrapper toggled={menuToggled}>
            <Link external href="https://twitter.com/sphynxswap?s=21" aria-label="twitter">
              <IconBox color="#33AAED">
                <TwitterIcon width="20px" height="20px" />
              </IconBox>
            </Link>
            <Link external href="https://sphynxtoken.co" aria-label="social2">
              <IconBox color="#710D89">
                <SocialIcon2 width="20px" height="20px" />
              </IconBox>
            </Link>
            <Link external href="https://t.me/sphynxswap" aria-label="telegram">
              <IconBox color="#3E70D1">
                <TelegramIcon width="20px" height="20px" />
              </IconBox>
            </Link>
          </SocialIconsWrapper>
          <SocialIconsWrapper toggled={menuToggled}>
            <Link external href="https://discord.gg/ZEuDaFk4qz" aria-label="discord">
              <IconBox color="#2260DA">
                <DiscordIcon width="20px" height="20px" />
              </IconBox>
            </Link>
            <Link external href="https://www.coingecko.com/en" aria-label="coingecko">
              <IconBox color="#55A08A">
                <CoingeckoIcon width="20px" height="20px" />
              </IconBox>
            </Link>
            <Link external href="https://coinmarketcap.com/" aria-label="coinmarketcap">
              <IconBox color="#1150DA">
                <CoinMarketCapsIcon width="20px" height="20px" />
              </IconBox>
            </Link>
          </SocialIconsWrapper>
        </SocialWrapper>
        {/* {!isMobile && isDefault && <Toggle checked={isDark} onChange={toggleTheme} scale="sm" />} */}
      </MenuContentWrapper>
    </MenuWrapper>
  )
}

export default Menu
