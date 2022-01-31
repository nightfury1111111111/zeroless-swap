import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { ResetCSS, Button } from '@sphynxdex/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useMenuToggle } from 'state/application/hooks'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { DatePickerPortal } from 'components/DatePicker'
import ConnectWalletButton from 'components/ConnectWalletButton'
import LanguageOptionButton from 'components/LanguageOptionButton'
import SwitchNetworkButton from 'components/SwitchNetworkButton'
import Loader from 'components/myLoader/Loader'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import HotTokenBar from './views/Swap/components/HotTokenBar'
import Menu from './components/Menu'
import UserMenu from './components/Menu/UserMenu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import EasterEgg from './components/EasterEgg'
import GlobalStyle from './style/Global'
import Swap from './views/Swap'

const NotFound = lazy(() => import('./views/NotFound'))
// const Farms = lazy(() => import('./views/Farms'))
// const Pools = lazy(() => import('./views/Pools'))
const Launchpad = lazy(() => import('./views/Launchpad'))
const Presale = lazy(() => import('./views/Launchpad/presale'))
const Listings = lazy(() => import('./views/Launchpad/Listings'))
const PresaleLive = lazy(() => import('./views/Launchpad/PresaleLive'))
const PresaleManage = lazy(() => import('./views/Launchpad/PresaleManage'))
// const FairLaunch = lazy(() => import('./views/FairLaunch'))
// const FairLaunchListing = lazy(() => import('./views/FairLaunch/Listings'))
// const FairLaunchManage = lazy(() => import('./views/FairLaunch/Manage'))
// const FairLaunchLive = lazy(() => import('./views/FairLaunch/Live'))
// const Locker = lazy(() => import('./views/Locker'))
// const DetailLocker = lazy(() => import('./views/Locker/DetailLocker'))
// const ManageLocker = lazy(() => import('./views/Locker/ManageLocker'))
// const Lottery = lazy(() => import('./views/LotterySphx'))
// const Trending = lazy(() => import('./views/Trending'))
// const Bridge = lazy(() => import('./views/Bridge'))
// const FAQ = lazy(() => import('./views/FAQ'))

const BodyWrapper = styled.div<{ toggled: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
  min-height: calc(100vh - 152px);
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  background: ${({ theme }) => theme.custom.background};
  position: relative;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: ${(props) => (props.toggled ? 'calc(100% - 51px)' : 'calc(100% - 240px)')};
    margin-left: ${(props) => (props.toggled ? '51px' : '240px')};
    padding: 0 32px;
  }
`

const BodyOverlay = styled.div<{ toggled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  opacity: 0.2;
  z-index: 9;
  display: ${(props) => (props.toggled ? 'none' : 'block')};
  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const FlexWrapper = styled.div<{ gap?: string; mobile?: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mobile ? '' : 'space-between')};
  align-items: center;
  width: 100%;
  padding: 6px 0;
  gap: ${(props) => props.gap};
  div:nth-child(1) {
    flex: ${(props) => (props.mobile ? '1' : '')};
  }
  div:nth-child(2) {
    flex: ${(props) => (props.mobile ? '1' : '')};
    button {
      width: ${(props) => (props.mobile ? '100%' : '')};
    }
  }
  div:nth-child(3) {
    flex: ${(props) => (props.mobile ? '1' : '')};
  }
`

const TopBar = styled.div<{ toggled: boolean; mobile: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  z-index: 999;
  width: ${(props) => (props.mobile ? '100%' : props.toggled ? 'calc(100% - 52px)' : 'calc(100% - 320px)')};
  height: ${(props) => (props.mobile ? 'auto' : '57px')};
  flex-flow: ${(props) => (props.mobile ? 'column' : 'row')};
  flex-wrap: wrap;
  padding: ${(props) => (props.mobile ? '8px 12px' : '0 20px')};
  background-color: ${({ theme }) => theme.custom.secondary};
  box-shadow: ${({ theme }) => theme.custom.topbarShadow};
`

const AccountWrapper = styled.div<{ mobile?: boolean }>`
  display: flex;
  align-items: center;
  & > div:first-child {
    padding: 9px;
    border-radius: 6px;
    height: 34px;
    color: white;
    background: ${({ theme }) => theme.custom.gradient};
    font-size: 16px;
    font-weight: 700;
    margin-right: ${(props) => (props.mobile ? '0px' : '24px')};
  }
  & > div:last-child {
    display: flex;
    align-items: center;
    & p {
      font-size: 16px;
      line-height: 19px;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: white;
      margin: 0 4px 0 8px;
    }
  }
`

const PageContent = styled.div<{ isMobile: boolean }>`
  width: 100%;
  min-height: 100vh;
  margin-top: ${(props) => (props.isMobile ? '180px' : '57px')};
`

const MenuOpenButton = styled(Button)`
  background: transparent;
  outline: none;
  padding: 0;
  width: 111px;
  box-shadow: none;
  justify-content: left;
  & svg {
    fill: white;
    width: 32px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const TokenBarDesktop = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.xl} {
    display: block;
  }
`

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  useEagerConnect()
  const { account, chainId } = useActiveWeb3React()
  const { menuToggled, toggleMenu } = useMenuToggle()
  const isMobile = document.body.clientWidth <= 1024
  const { t } = useTranslation()
  usePollBlockNumber(chainId)
  usePollCoreFarmData(chainId)

  return (
    <>
      <Router>
        <Suspense fallback={<Loader />}>
          <ResetCSS />
          <GlobalStyle />
          <Menu />
          <BodyWrapper toggled={menuToggled}>
            <BodyOverlay toggled={menuToggled} onClick={() => toggleMenu(false)} />
            <TopBar toggled={menuToggled} mobile={isMobile}>
              {isMobile ? (
                <>
                  <FlexWrapper>
                    <MenuOpenButton onClick={() => toggleMenu(!menuToggled)}>
                      <svg viewBox="0 0 24 24" width="24px">
                        <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" />
                      </svg>
                    </MenuOpenButton>
                    <img alt="mainLogo" src={MainLogo} width="70px" height="70px" />
                    <div>
                      <UserMenu />
                    </div>
                  </FlexWrapper>
                  <HotTokenBar />
                  <FlexWrapper gap="8px" mobile={isMobile}>
                    <LanguageOptionButton />
                    <SwitchNetworkButton />
                    {account ? (
                      <AccountWrapper mobile={isMobile}>
                        <div>{t('Connected')}</div>
                      </AccountWrapper>
                    ) : (
                      ''
                    )}
                  </FlexWrapper>
                </>
              ) : (
                <>
                  <MenuOpenButton onClick={() => toggleMenu(!menuToggled)}>
                    <svg viewBox="0 0 24 24" width="24px">
                      <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" />
                    </svg>
                  </MenuOpenButton>
                  <TokenBarDesktop style={{ width: `calc(100% - ${account ? 620 : 540}px` }}>
                    <HotTokenBar />
                  </TokenBarDesktop>
                  <LanguageOptionButton />
                  <SwitchNetworkButton />
                  {account ? (
                    <AccountWrapper>
                      <div>{t('Connected')}</div>
                      <div>
                        <UserMenu />
                      </div>
                    </AccountWrapper>
                  ) : (
                    <ConnectWalletButton />
                  )}
                </>
              )}
            </TopBar>
            <PageContent isMobile={isMobile}>
              <SuspenseWithChunkError fallback={<Loader />}>
                <Switch>
                  <Route path="/" exact>
                    <Redirect to="/launchpad" />
                  </Route>
                  {/* <Route path="/swap" component={Swap} />
                  <Route exact strict path="/farms" component={Farms} />
                  <Route exact strict path="/farms/history" component={Farms} />
                  <Route exact strict path="/pools" component={Pools} />
                  <Route exact strict path="/pools/history" component={Pools} /> */}
                  <Route exact strict path="/launchpad" component={Launchpad} />
                  <Route exact strict path="/launchpad/presale" component={Presale} />
                  <Route exact strict path="/listing" component={Listings} />
                  <Route exact strict path="/launchpad/live/:saleId/:chainId" component={PresaleLive} />
                  <Route exact strict path="/launchpad/presale/:saleId/:chainId" component={PresaleManage} />
                  {/* <Route exact strict path="/launchpad/fair" component={FairLaunch} />
                  <Route exact strict path="/launchpad/fair/listing" component={FairLaunchListing} />
                  <Route exact strict path="/launchpad/fair/manage/:launchId/:chainId" component={FairLaunchManage} />
                  <Route exact strict path="/launchpad/fair/live/:launchId/:chainId" component={FairLaunchLive} />
                  <Route exact strict path="/launchpad/locker" component={Locker} />
                  <Route exact strict path="/launchpad/locker/tokendetail/:lockId/:chainId" component={DetailLocker} />
                  <Route exact strict path="/launchpad/locker/manage" component={ManageLocker} />
                  <Route exact strict path="/lottery" component={Lottery} />
                  <Route exact strict path="/trending" component={Trending} />
                  <Route exact strict path="/bridge" component={Bridge} />
                  <Route exact strict path="/faq" component={FAQ} /> */}
                  <Route component={NotFound} />
                </Switch>
              </SuspenseWithChunkError>
            </PageContent>
          </BodyWrapper>
          <EasterEgg iterations={2} />
          <ToastListener />
          <DatePickerPortal />
        </Suspense>
      </Router>
    </>
  )
}

export default App
