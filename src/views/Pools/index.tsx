import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Text, useMatchBreakpoints, Button } from '@sphynxdex/uikit'
import { orderBy, partition, isUndefined } from 'lodash'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { ethers } from 'ethers'
import { useFetchPublicPoolsData, usePools, useFetchCakeVault, useCakeVault } from 'state/pools/hooks'
import { usePollFarmsData } from 'state/farms/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import masterChefAbi from 'config/abi/masterchef.json'
import autoVaultAbi from 'config/abi/cakeVault.json'
import { Pool } from 'state/types'
import Loading from 'components/Loading'
import PoolLogo from 'assets/png/icon/PoolIcon2.png'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import SearchPannel from './components/SearchPannel'
import BountyCard from './components/BountyCard'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView/ToggleView'
import { getAprData, getCakeVaultEarnings } from './helpers'
import { SwapTabs, SwapTabList, SwapTab, SwapTabPanel } from '../../components/Tab/tab'
import Card from '../../components/Card'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

const WrapFlex = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 10px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 0px 10px;
  }
`

const CardLayout = styled(FlexLayout)`
  justify-content: center;
  padding: 47px 69px 0;
`

const LogoContent = styled(Flex)<{ isMobile?: boolean }>`
  align-items: ${({ isMobile }) => (isMobile ? 'start-flex' : 'center')};
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  ${({ theme }) => theme.mediaQueries.md} {
  }
`

const LogoTitle = styled.div`
  display: block;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
  }
`

const LogoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

const PoolText = styled(Text)`
  color: white;
  font-size: 13px;
  font-weight: bold;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 20px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 26px;
  }
`

const PoolDetailText = styled(Text)`
  color: white;
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 13px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 15px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12
const supportedChainID = [1, 4, 56]

const originMasterChef = '0x39dDE712D0B08C3Ce11AF7bd5b6E2ef9A495D3Be'
const originAutoVault = '0xb1518ed058C5df45168e338e9b1e75941b690307'

const Pools: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const theme = useTheme()
  const { account, chainId, library } = useActiveWeb3React()
  const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account, chainId)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'pancake_pool_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_pool_view' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const signer = library.getSigner()
  const [chainIdState, setChainIdState] = useState(56)

  useEffect(() => {
    if (!Number.isNaN(chainId) && !isUndefined(chainId) && chainId !== chainIdState) {
      setChainIdState(chainId)
    }
  }, [chainId])

  const chosenPoolsLength = useRef(0)
  const {
    userData: { cakeAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useCakeVault()
  const accountHasVaultShares = userShares && userShares.gt(0)
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  const pools1 = useMemo(() => {
    const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0)
    const cakeAutoVault = { ...cakePool, isAutoVault: true }
    return [cakeAutoVault, ...poolsWithoutAutoVault]
  }, [poolsWithoutAutoVault])

  const pools = pools1.filter((pool) => pool.contractAddress[chainId] !== '')
  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools, accountHasVaultShares],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools, accountHasVaultShares],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsData(chainId)
  useFetchCakeVault()
  useFetchPublicPoolsData(chainId)

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
          if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
            return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
          }
          return poolsCurrentlyVisible
        })
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const showFinishedPools = location.pathname.includes('history')

  const selectedTab = (tabIndex: number): void => {
    if (tabIndex === 0) {
      location.pathname = '/pools'
    } else {
      location.pathname = '/pools/history'
    }
  }

  const handleWithdrawFarm = async () => {
    const masterChef = new ethers.Contract(originMasterChef, masterChefAbi, signer)
    const tx = await masterChef.emergencyWithdraw(0)
    await tx.wait()
  }

  const handleWithdrawVault = async () => {
    const autoVault = new ethers.Contract(originAutoVault, autoVaultAbi, signer)
    const tx = await autoVault.withdrawAll()
    await tx.wait()
  }

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
          'desc',
        )
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.isAutoVault
              ? getCakeVaultEarnings(
                  account,
                  cakeAtLastUserAction,
                  userShares,
                  pricePerFullShare,
                  pool.earningTokenPrice,
                ).autoUsdToDisplay
              : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.isAutoVault ? totalCakeInVault.toNumber() : pool.totalStaked.toNumber()),
          'desc',
        )
      default:
        return poolsToSort
    }
  }

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
  }

  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    chosenPools = chosenPools.filter((pool) =>
      latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
    )
  }

  chosenPools = sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  chosenPoolsLength.current = chosenPools.length

  chosenPools = chosenPools.map((cell) => {
    const temp = cell
    temp.totalStaked = cell.isAutoVault ? totalCakeInVault : cell.totalStaked
    return temp
  })
  const cardLayout = (
    <CardLayout>
      {chosenPools.map((pool) =>
        pool.isAutoVault ? (
          <CakeVaultCard key="auto-cake" pool={pool} showStakedOnly={stakedOnly} />
        ) : (
          <PoolCard key={pool.sousId} pool={pool} account={account} />
        ),
      )}
    </CardLayout>
  )
  const tableLayout = <PoolsTable pools={chosenPools} account={account} userDataLoaded={userDataLoaded} />

  return supportedChainID.indexOf(chainIdState) !== -1 ? (
    <>
      <WrapFlex>
        <div style={{ height: 24 }} />
        <PageHeader>
          <Flex justifyContent="space-between" flexDirection="row">
            <Flex flexGrow={5} alignItems="center">
              <LogoContent isMobile={isMobile}>
                <img
                  src={PoolLogo}
                  alt="Pool Logo"
                  width={isMobile ? '50' : '100'}
                  style={{ padding: `${isMobile ? '0px' : '0 10px 10px 10px'}` }}
                />
                <LogoTitleWrapper>
                  <LogoTitle>
                    <PoolText>{t('Sphynx Pools')}</PoolText>
                    <PoolDetailText>{t('Just stake some tokens to earn.')}</PoolDetailText>
                    <PoolDetailText>{t('High APR, low risk.')}</PoolDetailText>
                  </LogoTitle>
                </LogoTitleWrapper>
              </LogoContent>
            </Flex>
            <Flex flexGrow={3} height="fit-content" justifyContent="center" alignItems="center">
              <BountyCard />
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
            setSearchQuery={setSearchQuery}
          />
          <p style={{ color: 'white', textAlign: 'center', margin: '16px' }}>
            If you have tokens on previous pools, please use below button to withdraw!
          </p>
          <Flex justifyContent="center">
            <Button disabled={chainId !== 56} onClick={handleWithdrawFarm} style={{ margin: '16px' }}>
              Withdraw From Manual Pool
            </Button>
            <Button disabled={chainId !== 56} onClick={handleWithdrawVault} style={{ margin: '16px' }}>
              Withdraw From Auto Pool
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
            </SwapTabList>
            {/* <Card bgColor={theme ? "#0E0E26" : "#2A2E60"} borderRadius="0 0 3px 3px" padding="20px 10px"> */}
            <Card bgColor={theme.custom.tertiary} borderRadius="0 0 3px 3px" padding="20px 10px">
              <SwapTabPanel>
                {account && !userDataLoaded && stakedOnly && (
                  <Flex justifyContent="center" mb="4px">
                    <Loading />
                  </Flex>
                )}
                {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
                <div ref={loadMoreRef} />
              </SwapTabPanel>
              <SwapTabPanel>
                {showFinishedPools && (
                  <Flex justifyContent="center">
                    <Text fontSize="20px" color="failure" pb="32px" pt="32px">
                      {t('These pools are no longer distributing rewards. Please unstake your tokens.')}
                    </Text>
                  </Flex>
                )}
                {account && !userDataLoaded && stakedOnly && (
                  <Flex justifyContent="center" mb="4px">
                    <Loading />
                  </Flex>
                )}
                {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
                <div ref={loadMoreRef} />
              </SwapTabPanel>
            </Card>
          </SwapTabs>
        </Page>
      </WrapFlex>
    </>
  ) : (
    <Flex justifyContent="center" alignItems="center" style={{ height: 'calc(100vh - 57px)', color: 'red' }}>
      <h3>Please switch to BSC mainnet!</h3>
    </Flex>
  )
}

export default Pools
