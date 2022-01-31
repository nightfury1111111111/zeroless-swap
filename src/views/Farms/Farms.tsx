import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useMatchBreakpoints, Heading, RowType, Toggle, Text, Flex, Button } from '@sphynxdex/uikit'
import { ChainId } from '@sphynxdex/sdk-multichain'
import styled, { useTheme } from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'
import { ERC20_ABI } from 'config/abi/erc20'
import { getBNBPrice, getTokenPrice } from 'utils/priceProvider'
import { useFarms, usePollFarmsData, usePriceCakeBusd } from 'state/farms/hooks'
import usePersistState from 'hooks/usePersistState'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import { orderBy, isUndefined } from 'lodash'
import isArchivedPid from 'utils/farmHelpers'
import { latinise } from 'utils/latinise'
import { useUserFarmStakedOnly } from 'state/user/hooks'
import PageHeader from 'components/PageHeader'
import { getSphynxAddress, getMasterChefAddress, getWbnbAddress } from 'utils/addressHelpers'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import Loading from 'components/Loading'
import { ReactComponent as FarmLogo } from 'assets/svg/icon/FarmIcon2.svg'
import masterChefAbi from 'config/abi/masterchef.json'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import { SwapTabs, SwapTabList, SwapTab, SwapTabPanel } from '../../components/Tab/tab'
import SearchPannel from './components/SearchPannel'
import Table from './components/FarmTable/FarmTable'
import { RowProps } from './components/FarmTable/Row'
import { DesktopColumnSchema, ViewMode } from './components/types'
import Card from '../../components/Card'
import Bond from './components/Bond/Bond'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

const originMasterChef = '0x39dDE712D0B08C3Ce11AF7bd5b6E2ef9A495D3Be'
const NUMBER_OF_FARMS_VISIBLE = 12

const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}

const supportedChainID = [1, 4, 56]

const Farms: React.FC = () => {
  // const [totalLiquidityUSD, setTotalLiquidity] = useState('')
  // const [farmApr, setFarmApr] = useState(null)

  // useEffect(() => {
  //   const lpAddress = '0x93561354a5a4687c54a64cf0aba56a0a392ae882'
  //   const masterChef = getMasterChefAddress()
  //   const sphynxToken = getSphynxAddress()
  //   const wBNBAddr = getWbnbAddress()

  //   const parseData = async () => {
  //     try {
  //       const lpToken = new ethers.Contract(lpAddress, ERC20_ABI, simpleRpcProvider)
  //       const wBNB = new ethers.Contract(wBNBAddr, ERC20_ABI, simpleRpcProvider)
  //       const bnbBalance = await wBNB.balanceOf(lpAddress)
  //       const bnbPrice = await getBNBPrice()
  //       const totalSupply = await lpToken.totalSupply()
  //       const masterChefBalance = await lpToken.balanceOf(masterChef)
  //       const tokenPrice = await getTokenPrice(sphynxToken)
  //       const totalLiquidity = (((bnbBalance * 2) / 10 ** 18) * bnbPrice * masterChefBalance) / totalSupply
  //       const apr = ((tokenPrice * 112.5) / totalLiquidity) * 1000 * 365 * 100 * 24
  //       setTotalLiquidity(totalLiquidity.toFixed(2))
  //       setFarmApr(apr.toFixed(2))
  //     } catch (err) {
  //       console.log('error', err)
  //     }
  //   }

  //   parseData()
  // }, [])

  const { path } = useRouteMatch()
  const location = useLocation()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const theme = useTheme()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_farm_view' })
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('hot')
  const [detailed, setDetailed] = useState(0)
  const chosenFarmsLength = useRef(0)
  const { chainId, library } = useActiveWeb3React()
  const index = chainId === undefined ? ChainId.MAINNET : chainId
  const cakePrice = usePriceCakeBusd(chainId)
  const signer = library.getSigner()
  const [chainIdState, setChainIdState] = useState(ChainId.MAINNET)
  useEffect(() => {
    if (!Number.isNaN(chainId) && !isUndefined(chainId) && chainId !== chainIdState) {
      setChainIdState(chainId)
    }
  }, [chainId])

  // const isArchived = pathname.includes('archived')
  // const isInactive = pathname.includes('history')
  const [isArchived, setIsArchived] = useState(false)
  const [isInactive, setIsInactive] = useState(false)
  const isActive = !isInactive && !isArchived

  usePollFarmsData(chainId, isArchived)

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)

  const activeFarms = farmsLP.filter(
    (farm) =>
      farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid) && farm.lpAddresses[chainId] !== '',
  )
  const inactiveFarms = farmsLP.filter(
    (farm) =>
      farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid) && farm.lpAddresses[chainId] !== '',
  )
  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid) && farm.lpAddresses[chainId] !== '')

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(new BigNumber(farm.poolWeight), cakePrice, totalLiquidity, farm.lpAddresses[index])
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        // const temp = new BigNumber(totalLiquidityUSD)
        // return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: new BigNumber(totalLiquidityUSD) }
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol[index].toLowerCase()).includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [cakePrice, query, isActive],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }
    if (isActive) {
      chosenFarms = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFarms = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFarms = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
  ])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    const ac = new AbortController()
    const showMoreFarms = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
          if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
            return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
          }
          return farmsCurrentlyVisible
        })
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreFarms, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }

    return () => ac.abort()
  }, [chosenFarmsMemoized, observerIsSet])

  const rowData = chosenFarmsMemoized.map((farm) => {
    const { token, quoteToken } = farm
    const tokenAddress = token[index].address
    const quoteTokenAddress = quoteToken[index].address
    const lpLabel = farm.lpSymbol[index] && farm.lpSymbol[index].split(' ')[0].toUpperCase().replace('PANCAKE', '')

    const row: RowProps = {
      apr: {
        // value: farm.apr.toString(),
        value: getDisplayApr(farm.apr, farm.lpRewardsApr),
        // value: farmApr,
        multiplier: farm.multiplier,
        lpLabel,
        tokenAddress,
        quoteTokenAddress,
        cakePrice,
        originalValue: farm.apr,
        // originalValue: farmApr
      },
      farm: {
        label: lpLabel,
        pid: farm.pid,
        token: farm.token[index],
        quoteToken: farm.quoteToken[index],
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity,
        // liquidity: new BigNumber(totalLiquidityUSD),
      },
      multiplier: {
        multiplier: farm.multiplier,
        // multiplier: '100x',
      },
      details: farm,
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
      const columnSchema = DesktopColumnSchema

      const columns = columnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case 'farm':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }

              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      }))

      return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
    }
    const viewDetail = (value) => {
      setDetailed(value)
    }
    return (
      <FlexLayout>
        <Route exact path={`${path}`}>
          {chosenFarmsMemoized.map((farm) => (
            <FarmCard
              key={farm.pid}
              farm={farm}
              displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
              cakePrice={cakePrice}
              account={account}
              removed={false}
              detailed={detailed}
              viewDetail={viewDetail}
            />
          ))}
        </Route>
        {/* <Route exact path={`${path}/history`}>
          {chosenFarmsMemoized.map((farm) => (
            <FarmCard
              key={farm.pid}
              farm={farm}
              displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
              cakePrice={cakePrice}
              account={account}
              removed
            />
          ))}
        </Route>
        <Route exact path={`${path}/archived`}>
          {chosenFarmsMemoized.map((farm) => (
            <FarmCard
              key={farm.pid}
              farm={farm}
              displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
              cakePrice={cakePrice}
              account={account}
              removed
            />
          ))}
        </Route> */}
      </FlexLayout>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const handleWithdrawFarm = async (pid) => {
    const masterChef = new ethers.Contract(originMasterChef, masterChefAbi, signer)
    const tx = await masterChef.emergencyWithdraw(pid)
    await tx.wait()
  }

  const selectedTab = (tabIndex: number): void => {
    if (tabIndex === 0) {
      location.pathname = '/farms'
      setIsArchived(false)
      setIsInactive(false)
    } else {
      location.pathname = '/farms/history'
      setIsInactive(true)
    }
  }

  return supportedChainID.indexOf(chainIdState) !== -1 ? (
    <>
      <div style={{ height: 24 }} />
      <PageHeader>
        <Flex>
          <FarmLogo width="80" height="60" />
          <Flex flexDirection="column" ml="10px">
            <Text fontSize="26px" color="white" bold>
              {t('Farms')}
            </Text>
            <Text fontSize="15px">{t('Stake LP tokens to earn.')}</Text>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <SearchPannel
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setSortOption={setSortOption}
          setQuery={setQuery}
        />
        <p style={{ color: 'white', textAlign: 'center', margin: '16px' }}>
          If you have tokens on previous farms, please use below button to withdraw!
        </p>
        <Flex justifyContent="center">
          <Button disabled={chainId !== 56} style={{ margin: '16px' }} onClick={() => handleWithdrawFarm(1)}>
            Withdraw SPHYNX-BNB
          </Button>
          <Button disabled={chainId !== 56} style={{ margin: '16px' }} onClick={() => handleWithdrawFarm(2)}>
            Withdraw SPHYNX-BUSD
          </Button>
        </Flex>
        <SwapTabs
          selectedTabClassName="is-selected"
          selectedTabPanelClassName="is-selected"
          onSelect={(tabIndex) => selectedTab(tabIndex)}
        >
          <SwapTabList>
            <SwapTab>
              <Text>{t('Live')}</Text>
            </SwapTab>
            <SwapTab>
              <Text>{t('Finished')}</Text>
            </SwapTab>
            {/* <SwapTab>
              <Text>{t('Bond')}</Text>
            </SwapTab> */}
          </SwapTabList>
          {/* <Card bgColor={theme ? '#0E0E26' : '#2A2E60'} borderRadius="0 0 3px 3px" padding="20px 10px"> */}
          <Card bgColor={theme.custom.tertiary} borderRadius="0 0 3px 3px" padding="20px 10px">
            <SwapTabPanel>
              {renderContent()}
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center">
                  <Loading />
                </Flex>
              )}
              <div ref={loadMoreRef} />
            </SwapTabPanel>
            <SwapTabPanel>
              {renderContent()}
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center">
                  <Loading />
                </Flex>
              )}
              <div ref={loadMoreRef} />
            </SwapTabPanel>
            {/* <SwapTabPanel>
              <Bond />
            </SwapTabPanel> */}
          </Card>
        </SwapTabs>
      </Page>
    </>
  ) : (
    <Flex justifyContent="center" alignItems="center" style={{ height: 'calc(100vh - 57px)', color: 'red' }}>
      <h3>Please switch to BSC mainnet!</h3>
    </Flex>
  )
}

export default Farms
