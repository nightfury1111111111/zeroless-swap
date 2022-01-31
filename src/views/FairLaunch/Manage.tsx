import 'date-fns'
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router'
import { useWeb3React } from '@web3-react/core'
import * as ethers from 'ethers'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { Button, AutoRenewIcon, Link } from '@sphynxdex/uikit'
import { ChainId } from '@sphynxdex/sdk-multichain'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import axios from 'axios'
import { getFairLaunchContract } from 'utils/contractHelpers'
import { ReactComponent as CheckList } from 'assets/svg/icon/CheckList.svg'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import styled, { keyframes } from 'styled-components'
import TimerComponent from 'components/Timer/TimerComponent'
import NETWORK_NAMES from 'config/constants/networknames'

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
  text-align: left;
  .ml16 {
    margin-left: 16px;
  }
  .ml32 {
    margin-left: 32px;
  }
  p {
    line-height: 24px;
  }
  p.w110 {
    width: 110px;
  }
  p.w220 {
    width: 220px;
  }
  p.w80 {
    width: 80px;
  }
  p.w140 {
    width: 140px;
  }
  .pendingTx {
    animation: ${rotate} 2s linear infinite;
  }
  div.MuiTextField-root {
    margin-left: 16px;
    color: white !important;
    background: black;
    border-radius: 8px;
    padding: 10px 14px;
    height: 44px !important;
    border: none;
    outline: none;
    .MuiInput-underline:after {
      border: none !important;
    }
    input {
      color: white;
      width: 140px;
      font-size: 14px;
      margin-top: -3px;
    }
    button {
      color: white;
      margin-right: -15px;
      margin-top: -3px;
    }
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    align-items: flex-start;
  }
`

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
  & > *:first-child {
    margin-right: 16px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 36px;
    line-height: 42px;
  }
`

const Sperate = styled.div`
  margin-top: 32px;
`

const Title = styled.p`
  font-size: 24px;
  font-weight: 700;
`

const NoteWrapper = styled.div`
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.tertiary};
  border-radius: 10px;
  width: 100%;
  padding: 24px;
  color: white;
  padding-left: 12px;
  padding-right: 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-left: 48px;
    padding-right: 48px;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  p.description {
    font-size: 14px;
  }
`

const InlineWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  & > div > div {
    // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
    background: ${({ theme }) => theme.custom.tertiary};
  }
  & > div.MuiFormControl-root {
    // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
    background: ${({ theme }) => theme.custom.tertiary};
  }
`

const MyInput = styled.input`
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.tertiary};
  border-radius: 5px;
  border: 1px solid #4a5187;
  padding: 10px 14px;
  padding-inline-start: 12px;
  height: 38px;
  color: white;
  border: none;
  outline: none;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.custom.pancakePrimary};
  }
`

const StepContainer = styled.div`
  max-width: 1000px;
`

const Notification = styled.p`
  color: white;
  font-size: 14px;
  line-height: 20px;
  & > a {
    font-size: 14px;
    font-weight: 400;
    display: inline;
  }
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: ${({ theme }) => theme.custom.gradient};
  // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  outline: none;
  color: white;
  width: 176px;
`

const TimerWrapper = styled.div`
  & p {
    margin-bottom: 16px;
  }
  & div {
    color: white;
  }
`

const FairLaunchManage: React.FC = () => {
  const { t } = useTranslation()
  const param: any = useParams()
  const { library, chainId } = useActiveWeb3React()
  const signer = library.getSigner()
  const [launchData, setLaunchData] = useState({})
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [logoLink, setLogoLink] = useState('')
  const [webSiteLink, setWebSiteLink] = useState('')
  const [gitLink, setGitLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const [redditLink, setRedditLink] = useState('')
  const [telegramLink, setTelegramLink] = useState('')
  const [launchTime, setLaunchTime] = useState('')
  const [unlockTime, setUnlockTime] = useState('')
  const [projectDec, setProjectDec] = useState('')
  const [updateDec, setUpdateDec] = useState('')
  const [isLaunched, setIsLaunched] = useState(false)
  const [launchStatus, setLaunchStatus] = useState('')
  const [routerAddress, setRouterAddress] = useState('')
  const [isAvailableLaunch, setIsAvailableLaunch] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pendingLiquidity, setPendingLiquidity] = useState(false)
  const [isCanceled, setIsCanceled] = useState(false)
  const [isWithdrawToken, setIsWithdrawToken] = useState(false)
  const [isWithdrawBNB, setIsWithdrawBNB] = useState(false)
  const [pendingCancel, setPendingCancel] = useState(false)
  const [pendingLaunch, setPendingLaunch] = useState(false)
  const [pendingWithdrawToken, setPendingWithdrawToken] = useState(false)
  const [pendingWithdrawNative, setPendingWithdrawNative] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const now = Math.floor(new Date().getTime() / 1000)

  const nativeCurrency = chainId === ChainId.ETHEREUM ? 'ETH' : 'BNB'

  const fairLaunchContract = useMemo(() => getFairLaunchContract(signer, chainId), [signer])

  const handleCancelLaunch = async () => {
    setPendingCancel(true)
    try {
      const tx = await fairLaunchContract.cancel(parseInt(param.launchId))
      await tx.wait()
      setIsCanceled(true)
      setPendingCancel(false)
      toastSuccess('Success', 'Fair launch is cancled!')
    } catch (err) {
      setPendingCancel(false)
      toastSuccess('Failed', 'Your action is failed!')
    }
  }

  const handleWithdrawToken = async () => {
    setPendingWithdrawToken(true)
    try {
      const tx = await fairLaunchContract.tokenWithdraw(parseInt(param.launchId))
      await tx.wait()
      setIsWithdrawToken(true)
      setPendingWithdrawToken(false)
      toastSuccess('Success', 'Operation successfully!')
    } catch (err) {
      setPendingWithdrawToken(false)
      toastSuccess('Failed', 'Your action is failed!')
    }
  }

  const handleWithdrawBNB = async () => {
    setPendingWithdrawNative(true)
    try {
      const tx = await fairLaunchContract.nativeCurrencyWithdraw(parseInt(param.launchId))
      await tx.wait()
      setIsWithdrawBNB(true)
      setPendingWithdrawNative(false)
      toastSuccess('Success', 'Operation successfully!')
    } catch (err) {
      setPendingWithdrawNative(false)
      toastSuccess('Failed', 'Your action is failed!')
    }
  }

  const handleWithdrawLiquidity = async () => {
    setPendingLiquidity(true)
    try {
      const tx = await fairLaunchContract.unlock(parseInt(param.launchId))
      await tx.wait()
      setIsUnlocked(true)
      setPendingLiquidity(false)
      toastSuccess('Success', 'Operation successfully!')
    } catch (err) {
      setPendingLiquidity(false)
      toastSuccess('Failed', 'Your action is failed!')
    }
  }

  const handleLaunchToken = async () => {
    setPendingLaunch(true)
    try {
      const fee = ethers.utils.parseEther('0.00001')
      const tx = await fairLaunchContract.launch(parseInt(param.launchId), { value: fee })
      const receipt = await tx.wait()
      setIsLaunched(true)
      setPendingLaunch(false)
      if (receipt.status === 1) {
        toastSuccess('Success', 'Operation successfully!')
        axios
          .post(`${process.env.REACT_APP_BACKEND_API_URL2}/inserttoken`, {
            name: tokenName,
            address: tokenAddress,
            symbol: tokenSymbol,
            chainId,
          })
          .then((response) => {
            console.log('response', response.data)
          })
      } else {
        toastSuccess('Failed', 'Your action is failed!')
      }
    } catch (err) {
      setPendingLaunch(false)
      toastSuccess('Failed', 'Your action is failed!')
    }
  }

  const handleUpdateInfo = () => {
    const data = {
      ...launchData,
      logo_link: logoLink,
      website_link: webSiteLink,
      github_link: gitLink,
      twitter_link: twitterLink,
      reddit_link: redditLink,
      telegram_link: telegramLink,
      project_dec: projectDec,
      update_dec: updateDec,
    }
    axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/updateFairLaunchInfo`, data).then((response) => {
      if (response.data) {
        toastSuccess('Pushed!', 'Your fairlaunch info is saved successfully.')
      } else {
        toastError('Failed!', 'Your action is failed.')
      }
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      let item = ''
      if (parseInt(launchTime) > now) {
        item = 'Upcoming'
        setIsAvailableLaunch(false)
      } else if (isLaunched) {
        item = 'Success'
      } else if (now > parseInt(launchTime) && now < parseInt(launchTime) + 600) {
        item = 'Active'
        setIsAvailableLaunch(true)
      } else {
        item = 'Failed'
        setIsAvailableLaunch(false)
      }
      setLaunchStatus(item)
      fairLaunchContract.isCanceled(parseInt(param.launchId)).then((response) => {
        setIsCanceled(response)
      })

      fairLaunchContract.withdrawToken(parseInt(param.launchId)).then((response) => {
        setIsWithdrawToken(response)
      })

      fairLaunchContract.withdrawNativeCurrency(parseInt(param.launchId)).then((response) => {
        setIsWithdrawBNB(response)
      })

      fairLaunchContract.isLaunched(parseInt(param.launchId)).then((response) => {
        setIsLaunched(response)
      })
      fairLaunchContract.isUnlocked(parseInt(param.launchId)).then((response) => {
        setIsUnlocked(response)
      })
    }

    fetchData()
  }, [launchTime, fairLaunchContract, isLaunched, param.launchId, chainId])

  useEffect(() => {
    if (chainId && parseInt(param.chainId) !== chainId) {
      alert(`Please make sure you are on the ${NETWORK_NAMES[parseInt(param.chainId)]}!`)
    }

    const fetchData = async () => {
      const launchId = param.launchId
      axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL2}/getFairLaunchInfo/${launchId}/${chainId}`)
        .then((response) => {
          const data = response.data
          setLaunchData(data)
          if (data) {
            setLogoLink(data.logo_link)
            setWebSiteLink(data.website_link)
            setGitLink(data.github_link)
            setTwitterLink(data.twitter_link)
            setTelegramLink(data.telegram_link)
            setRedditLink(data.reddit_link)
            setProjectDec(data.project_dec)
            setUpdateDec(data.update_dec)
            setTokenName(data.token_name)
            setTokenSymbol(data.token_symbol)
            setTokenAddress(data.token_address)
            setLaunchTime(data.launch_time)
            setUnlockTime(data.lock_time)
          }
          const fetchContractData = async () => {
            const isLaunchedFromContract = await fairLaunchContract.isLaunched(launchId.toString())
            const routerAddressFromContract = await fairLaunchContract.router(launchId.toString())
            setIsLaunched(isLaunchedFromContract)
            setRouterAddress(routerAddressFromContract)
          }

          fetchContractData()
        })
    }
    fetchData()
  }, [param, chainId, fairLaunchContract])

  return (
    <Wrapper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <LogoTitle>
          <CheckList /> Manage FairLaunch
        </LogoTitle>
        <Sperate />
        <NoteWrapper>
          <InlineWrapper>
            <Title>Manage settings for your existing fair launch!</Title>
          </InlineWrapper>
          <Sperate />
          <Notification>Congratulations your Fair Launch is scheduled!</Notification>
          <Sperate />
          <p style={{ color: 'white' }}>
            If your token contains special transfers such as burn, rebase or something else you must ensure the
            SphynxSwap Router Address is excluded from these features! Or you must set fees, burns or whatever else to
            be 0 or disabled for the duration of the presale and until the finalize button is clicked!
          </p>
          <Sperate />
          <Notification>
            Router Address: {routerAddress}
            <Sperate />
            - The launch button will become available once your listing countdown ends.
            <br />
            - You must list your token within 10 minutes of this time or your launch will fail!
            <br />
            - Clicking the launch button will list your token on PancakeSwap immediately. Liquidity will be locked by
            SphynxLock.
            <Sperate />
            Here is a summary of your fair launch (more details on the fair launch view page):
          </Notification>
          <Sperate />
          <Notification>Name: {tokenName}</Notification>
          <Notification>Symbol: {tokenSymbol}</Notification>
          <Notification>Token Address: {tokenAddress}</Notification>
          <Notification>Status: {launchStatus} Launch</Notification>
          <Notification>
            Manage Link:{' '}
            <Link
              href={`/launchpad/fair/manage/${param.launchId}/${chainId}`}
            >{`https://thesphynx.co/launchpad/fair/manage/${param.launchId}/${chainId}`}</Link>
          </Notification>
          <Notification>
            Launch Link:{' '}
            <Link
              href={`/launchpad/fair/live/${param.launchId}/${chainId}`}
            >{`https://thesphynx.co/launchpad/fair/live/${param.launchId}/${chainId}`}</Link>
          </Notification>
          <Sperate />
          {isCanceled ? (
            <>
              <Button
                disabled={isWithdrawToken || pendingWithdrawToken}
                mr="20px"
                mt="20px"
                onClick={handleWithdrawToken}
              >
                WITHDRAW TOKEN
                {pendingWithdrawToken && <AutoRenewIcon className="pendingTx" />}
              </Button>
              <Button disabled={isWithdrawBNB || pendingWithdrawNative} mt="20px" onClick={handleWithdrawBNB}>
                WITHDRAW {nativeCurrency}
                {pendingWithdrawNative && <AutoRenewIcon className="pendingTx" />}
              </Button>
            </>
          ) : isLaunched ? (
            <Button
              disabled={isUnlocked || pendingLiquidity || parseInt(unlockTime) >= now}
              mt="20px"
              onClick={handleWithdrawLiquidity}
            >
              WITHDRAW Liquidity
              {pendingLiquidity && <AutoRenewIcon className="pendingTx" />}
            </Button>
          ) : (
            <>
              <TimerWrapper>
                <Notification>{now >= parseInt(launchTime) ? 'Launch ends in:' : 'Launch starts in:'}</Notification>
                <TimerComponent time={now <= parseInt(launchTime) ? launchTime : `${parseInt(launchTime) + 600}`} />
              </TimerWrapper>
              {/* <Button disabled={!isAvailableLaunch} onClick={handleLaunchToken} mr="20px" mt="20px"> */}
              <Button disabled={!isAvailableLaunch || pendingLaunch} onClick={handleLaunchToken} mr="20px" mt="20px">
                LAUNCH TOKEN
                {pendingLaunch && <AutoRenewIcon className="pendingTx" />}
              </Button>
              <Button mt="20px" disabled={pendingCancel} onClick={handleCancelLaunch}>
                CANCEL LAUNCH
                {pendingCancel && <AutoRenewIcon className="pendingTx" />}
              </Button>
            </>
          )}
          <Sperate />
          <Notification>
            If you have trouble with launching please ensure the required addresses are whitelisted or your special
            transfer functions are disabled!
          </Notification>
          <Notification>
            If you still cannot launch then please cancel your sale and test your contract throughly on our supported
            test nets!
          </Notification>
        </NoteWrapper>
        <Sperate />
        <ContentWrapper>
          <div style={{ marginTop: '24px', width: '100%', marginBottom: '24px' }}>
            <StepContainer>
              <p className="description">
                Logo Link: (URL must end with a supported image extension png, jpg, jpeg or gif)
              </p>
              <MyInput onChange={(e) => setLogoLink(e.target.value)} value={logoLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Website Link</p>
              <MyInput onChange={(e) => setWebSiteLink(e.target.value)} value={webSiteLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">GitHub Link</p>
              <MyInput onChange={(e) => setGitLink(e.target.value)} value={gitLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Twitter Link</p>
              <MyInput onChange={(e) => setTwitterLink(e.target.value)} value={twitterLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Reddit Link</p>
              <MyInput onChange={(e) => setRedditLink(e.target.value)} value={redditLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Telegram Link</p>
              <MyInput
                onChange={(e) => setTelegramLink(e.target.value)}
                value={telegramLink}
                style={{ width: '100%' }}
              />
              <Sperate />
              <p className="description">Project Description</p>
              <MyInput onChange={(e) => setProjectDec(e.target.value)} value={projectDec} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Any update you want to provide to participants</p>
              <MyInput onChange={(e) => setUpdateDec(e.target.value)} value={updateDec} style={{ width: '100%' }} />
              <Sperate />
              <ColorButton onClick={handleUpdateInfo}>Update</ColorButton>
            </StepContainer>
          </div>
        </ContentWrapper>
      </MuiPickersUtilsProvider>
    </Wrapper>
  )
}

export default FairLaunchManage
