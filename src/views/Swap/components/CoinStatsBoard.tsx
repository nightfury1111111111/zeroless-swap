import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { utils } from 'ethers'
import styled, { useTheme } from 'styled-components'
import { isAddress } from 'utils'
import { marketCap } from 'state/input/actions'
import { ReactComponent as PriceIcon } from 'assets/svg/icon/PriceIcon.svg'
import { ReactComponent as ChangeIcon } from 'assets/svg/icon/ChangeIcon.svg'
import { ReactComponent as VolumeIcon } from 'assets/svg/icon/VolumeIcon.svg'
import { ReactComponent as LiquidityIcon } from 'assets/svg/icon/LiquidityIcon.svg'
import DefaultImg from 'assets/images/MainLogo.png'
import storages from 'config/constants/storages'
import { getChartStats } from 'utils/apiServices'
import { AppState } from '../../../state'
import TokenStateCard from './TokenStateCard'

const ContainerExtra = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 24px;
  gap: 12px;
  flex-wrap: nowrap;
  & > div:first-child {
    width: unset;
  }
  & > div:nth-child(2) {
    width: unset;
    div {
      white-space: nowrap;
      width: 90%;
    }
  }
  & > div:nth-child(3) {
    width: unset;
    div {
      white-space: nowrap;
      width: 90%;
    }
  }
  & > div:nth-child(4) {
    width: unset;
    div {
      white-space: nowrap;
      width: 90%;
    }
  }
  & > div:nth-child(5) {
    width: unset;
    div {
      white-space: nowrap;
      width: 90%;
    }
  }
`

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 24px;
  gap: 12px;
  flex-wrap: wrap;
  &>div:first-child {
    width: 100%;
  }
  &>div:nth-child(2) {
    width: 47%;
    div {
      white-space: nowrap;
      width: 90%;
    }
  }
  &>div:nth-child(3) {
    width: 47%;
    div {
      white-space: nowrap;
      width: 90%;
    }
  }
  &>div:nth-child(4) {
    width: 13%;
    div {
      white-space: nowrap;
      width: 90%;
    }
  }
  &>div:nth-child(5) {
    width: 13%;
    div {
      white-space: nowrap;
      width: 90%;
    }
  }
}`

export default function CoinStatsBoard(props) {
  const dispatch = useDispatch()
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const marketCapacity = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.marketCapacity)
  const { tokenData, chainId, input, pairAddress, quoteAddress, quoteSymbol } = props
  const interval = useRef(null)
  const tokenAddress = useRef(null)
  tokenAddress.current = input

  const [alldata, setalldata] = useState({
    address: '',
    price: '0',
    change: '0',
    volume: '0',
    liquidityV2: '0',
    liquidityV2BNB: '0',
  })

  const [price, setPrice] = useState<any>(null)
  const [scale, setScale] = useState(2)

  const [linkIcon, setLinkIcon] = useState(DefaultImg)
  const changedecimal: any = parseFloat(alldata.change).toFixed(3)
  const volumedecimal = parseFloat(alldata.volume).toFixed(3)
  const liquidityV2decimal = parseFloat(alldata.liquidityV2).toFixed(3)
  const liquidityV2BNBdecimal = parseFloat(alldata.liquidityV2BNB).toFixed(3)
  const nativeCurrencySymbol = quoteSymbol
  const isExtra = document.body.clientWidth > 1500
  const theme = useTheme()

  const RealContainer = isExtra ? ContainerExtra : Container

  const getTableData = useCallback(async () => {
    try {
      const chartStats: any = await getChartStats(input, routerVersion, chainId, pairAddress, quoteAddress)
      setalldata(chartStats)
      setPrice(chartStats.price)
      setLinkIcon(
        `https://r.poocoin.app/smartchain/assets/${
          input ? utils.getAddress(input) : '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
        }/logo.png`,
      )
    } catch (err) {
      setTimeout(() => getTableData(), 3000)
    }
  }, [input, routerVersion, chainId, pairAddress])

  useEffect(() => {
    const ac = new AbortController()
    getTableData()
    interval.current = setInterval(() => {
      const sessionData = JSON.parse(sessionStorage.getItem(storages.SESSION_LIVE_PRICE))
      if (!sessionData) return
      if (sessionData.input.toLowerCase() !== tokenAddress.current.toLowerCase()) return
      setPrice(sessionData.price)
    }, 2000)

    return () => {
      clearInterval(interval.current)
      ac.abort()
    }
  }, [input, getTableData])

  useEffect(() => {
    if (tokenData) dispatch(marketCap({ marketCapacity: Number(parseInt(tokenData.totalSupply) * parseFloat(price)) }))
    const realPrice = parseFloat(price)
    if (realPrice > 1) {
      setScale(2)
    } else {
      const lg10 = Math.round(Math.abs(Math.log10(realPrice)))
      setScale(lg10 + 2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData, price])

  return (
    <RealContainer>
      <TokenStateCard
        tokenImg={linkIcon}
        cardTitle={tokenData?.symbol ?? ''}
        cardValue={`$ ${marketCapacity.toLocaleString()}`}
        variantFill
        flexGrow={2}
        fillColor={theme.custom.tokenStateCard}
        tokenAddress={tokenAddress.current}
      />
      <TokenStateCard
        CardIcon={PriceIcon}
        cardTitle="Price"
        cardValue={price ? `$ ${Number(price).toFixed(scale).toLocaleString()}` : ''}
        variantFill={false}
        flexGrow={1}
        fillColor="#9B51E0"
      />
      <TokenStateCard
        CardIcon={ChangeIcon}
        cardTitle="24h Change"
        cardValue={changedecimal === 'NaN' ? '0 %' : `${changedecimal}%`}
        valueActive
        variantFill={false}
        flexGrow={1}
        fillColor="#77BF3E"
      />
      <TokenStateCard
        CardIcon={VolumeIcon}
        cardTitle="24h Volume"
        cardValue={
          Number(volumedecimal).toLocaleString() === 'NaN' ? '0 %' : `$ ${Number(volumedecimal).toLocaleString()}`
        }
        variantFill={false}
        flexGrow={1.5}
        fillColor="#21C2CC"
      />
      <TokenStateCard
        CardIcon={LiquidityIcon}
        cardTitle="Liquidity"
        cardValue={
          Number(liquidityV2BNBdecimal).toLocaleString() === 'NaN'
            ? '0'
            : `${Number(liquidityV2BNBdecimal).toLocaleString()} ${nativeCurrencySymbol}`
        }
        fillColor="#2F80ED"
        subPriceValue={
          Number(liquidityV2BNBdecimal).toLocaleString() === 'NaN'
            ? '$ 0'
            : `($ ${Number(liquidityV2decimal).toLocaleString()})`
        }
        variantFill={false}
        flexGrow={1.5}
      />
    </RealContainer>
  )
}
