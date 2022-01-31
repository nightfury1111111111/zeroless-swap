import 'date-fns'
import React, { useState, useEffect } from 'react'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { ReactComponent as BellIcon } from 'assets/svg/icon/Bell.svg'
import MainLogo from 'assets/images/Logo.jpg'
import { ReactComponent as CheckList } from 'assets/svg/icon/CheckList.svg'
import * as ethers from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { isAddress } from '@ethersproject/address'
import useToast from 'hooks/useToast'
import styled, { keyframes } from 'styled-components'
import { ERC20_ABI } from 'config/abi/erc20'
import { useModal, AutoRenewIcon, Link } from '@sphynxdex/uikit'
import DisclaimerModal from 'components/DisclaimerModal/DisclaimerModal'
import Select from 'components/Select/Select'
import axios from 'axios'
import { getPresaleContract } from 'utils/contractHelpers'
import { useWeb3React } from '@web3-react/core'
import { getRouterAddress } from 'utils/addressHelpers'
import { useHistory } from 'react-router-dom'
import { SEARCH_OPTION } from 'config/constants/launchpad'
import { ChainId } from '@sphynxdex/sdk-multichain'

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
  font-weight: bold;
  .mb4 {
    margin-bottom: 4px;
  }
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
  .pendingTx {
    animation: ${rotate} 2s linear infinite;
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

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const MarginWrapper = styled.div`
  margin-top: 32px;
  margin-left: 0px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 32px;
    margin-top: 0px;
    width: 0%;
  }
`

const InlineWrapper = styled.div`
  display: flex;
  align-items: center;
  & > div > div {
    // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
    background: ${({ theme }) => theme.custom.tertiary};
  }
  & > div.MuiFormControl-root {
    // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
    background: ${({ theme }) => theme.custom.tertiary};
  }
`

const CardWrapper = styled.div`
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.tertiary};
  border: 1px solid ${({ theme }) => theme.custom.divider};
  width: 100%;
  padding: 24px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  height: max-content;
  h3 {
    font-size: 30px;
    text-align: center;
  }
`

const NumberWrapper = styled.div`
  background: ${({ theme }) => theme.custom.gradient};
  // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  width: 28px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`

const FeeWrapper = styled.div`
  margin-left: 16px;
  display: flex;
  flex-flow: column;
  font-weight: 700;
  max-width: 1080px;
  & > p {
    line-height: 36px;
    & > span {
      color: #f2c94c;
      margin-left: 8px;
    }
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-flow: row;
    flex-grow: 1;
    justify-content: space-around;
  }
`

const VerticalSperator = styled.div`
  width: 0px;
  height: 0px;
  ${({ theme }) => theme.mediaQueries.xl} {
    border-right: 1px solid #ffffff12;
    height: 36px;
  }
`

const FeeCard = ({ nativeCurrency }) => {
  return (
    <CardWrapper>
      <img src={MainLogo} alt="MainLogo" width="50px" height="50px" />
      <Sperate />
      <FeeWrapper>
        <p>
          Current Fee: <span>0.1{nativeCurrency}</span>
        </p>
        <VerticalSperator />
        <p>
          Tokens Sold: <span>1.75%</span>
        </p>
        <VerticalSperator />
        <p>
          {nativeCurrency} Raised: <span>1.75%</span>
        </p>
      </FeeWrapper>
    </CardWrapper>
  )
}

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

const LineBtn = styled.button`
  height: 35px;
  // background: ${({ theme }) => (theme ? '#222341' : '#1A1A3A')};
  background: ${({ theme }) => theme.custom.lineBtn};
  width: 125px;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  border: none;
  &:hover {
    background: #3a3a5a;
  }
  &:disabled {
    background: #777;
    border: 1px solid #444;
  }
`
const FillBtn = styled.button`
  height: 35px;
  background: ${({ theme }) => theme.custom.gradient};
  // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  width: 125px;
  border: 1px solid ${({ theme }) => theme.custom.pancakePrimary};
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  &:hover {
    background: linear-gradient(90deg, #722da9 0%, #e44bd4 100%);
    border: 1px solid #9b3aab;
  }
  &:disabled {
    background: linear-gradient(90deg, #722da9 0%, #e44bd4 100%);
    border: 1px solid #444;
    cursor: not-allowed;
  }
`

const StepContainer = styled.div`
  max-width: 1000px;
`

const Notification = styled.p`
  color: white;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
`

const WarningPanel = styled.div`
  background: #e04e69;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  width: 100%;
  color: white;
  font-size: 14px;
`

const NumberMark = ({ number }) => {
  return <NumberWrapper>{number}</NumberWrapper>
}

const StepWrapper = ({ number, stepName, children, step, onClick }) => {
  return (
    <StepContainer>
      <InlineWrapper style={{ cursor: 'pointer' }} onClick={onClick}>
        <NumberMark number={number} />
        <Title style={{ color: 'white', marginLeft: '8px' }}>{stepName}</Title>
      </InlineWrapper>
      {parseInt(number) === step ? (
        <>
          <Sperate />
          {children}
        </>
      ) : (
        ''
      )}
    </StepContainer>
  )
}

const Presale: React.FC = () => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const { library } = useActiveWeb3React()
  const signer = library.getSigner()
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenName, setName] = useState('')
  const [tokenSymbol, setSymbol] = useState('')
  const [tokenDecimal, setDecimal] = useState('')
  const [tier1, setTier1] = useState('')
  const [tier2, setTier2] = useState('')
  const [tier3, setTier3] = useState('')
  const [softCap, setSoftCap] = useState('')
  const [hardCap, setHardCap] = useState('')
  const [minBuy, setMinBuy] = useState('')
  const [maxBuy, setMaxBuy] = useState('')
  const [pancakeLiquidityRate, setPancakeLiquidityRate] = useState('')
  const [sphynxLiquidityRate, setSphynxLiquidityRate] = useState('')
  const [listingRate, setListingRate] = useState('')
  const [logoLink, setLogoLink] = useState('')
  const [webSiteLink, setWebSiteLink] = useState('')
  const [gitLink, setGitLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const [redditLink, setRedditLink] = useState('')
  const [telegramLink, setTelegramLink] = useState('')
  const [projectDec, setProjectDec] = useState('')
  const [updateDec, setUpdateDec] = useState('')
  const [certikAudit, setCertikAudit] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [sphynxSwapLiquidEditable, setSphynxSwapLiquidEditable] = useState(true)

  const [selectedCount, setSelectedCount] = useState(0)

  const [doxxedTeam, setDoxxedTeam] = useState(false)
  const [utility, setUtility] = useState(false)
  const [kyc, setKYC] = useState(false)
  const [presaleStart, setPresaleStart] = useState(new Date())
  const [presaleEnd, setPresaleEnd] = useState(new Date())
  const [tier1Time, setTier1Time] = useState(new Date())
  const [tier2Time, setTier2Time] = useState(new Date())
  const [liquidityLock, setLiquidityLock] = useState(new Date())
  const [step, setStep] = useState(1)
  const [disclaimerModalShow, setDisclaimerModalShow] = useState(true)
  const { toastSuccess, toastError } = useToast()
  const presaleContract = getPresaleContract(signer, chainId)
  const history = useHistory()

  const nativeCurrency = chainId === ChainId.ETHEREUM ? 'ETH' : 'BNB'

  const handleChecked = (value) => {
    if (value) {
      setSelectedCount((c) => c + 1)
    } else if (selectedCount > 0) setSelectedCount((c) => c - 1)
  }

  const handleChange = async (e) => {
    const value = e.target.value
    setTokenAddress(value)
    const address = isAddress(value)
    if (address) {
      try {
        const abi: any = ERC20_ABI
        const tokenContract = new ethers.Contract(value, abi, signer)
        const name = await tokenContract.name()
        const symbol = await tokenContract.symbol()
        const decimals = await tokenContract.decimals()
        setName(name)
        setSymbol(symbol)
        setDecimal(decimals)
      } catch (err) {
        console.log('error', err.message)
      }
    }
  }

  const handleTier1 = (e) => {
    setTier1(e.target.value)
  }

  const handleTier2 = (e) => {
    setTier2(e.target.value)
  }

  const handleTier3 = (e) => {
    setTier3(e.target.value)
  }

  const validate = async () => {
    if (!tokenAddress || !tokenName || !tokenSymbol) {
      toastError('Oops, we can not parse token data, please input correct token address!')
      setStep(1)
      return
    }
    if (
      !parseFloat(tier1) ||
      !parseFloat(tier2) ||
      !parseFloat(tier3) ||
      parseFloat(tier1) < parseFloat(tier2) ||
      parseFloat(tier2) < parseFloat(tier3)
    ) {
      toastError('Please input presale rate correctly!')
      setStep(2)
      return
    }
    if (!parseFloat(softCap) || !parseFloat(hardCap)) {
      toastError('Please input soft cap & hard cap!')
      setStep(3)
      return
    }
    if (parseFloat(softCap) * 2 < parseFloat(hardCap)) {
      toastError('Softcap should be at least half of hardcap')
      setStep(3)
      return
    }
    if (parseFloat(hardCap) < parseFloat(softCap)) {
      toastError('Hardcap should be greater than softcap')
      setStep(3)
      return
    }
    if (!parseFloat(minBuy) || !parseFloat(maxBuy)) {
      toastError('Please input contribution limit correctly!')
      setStep(4)
      return
    }
    if (parseFloat(minBuy) > parseFloat(maxBuy)) {
      toastError('Max buy amount should be greater than min buy amount!')
      setStep(4)
      return
    }
    if (parseFloat(hardCap) < parseFloat(maxBuy)) {
      toastError('HardCap amount should be greater than max buy amount!')
      setStep(4)
      return
    }
    if (Number.isNaN(parseInt(sphynxLiquidityRate))) {
      toastError('Please input Zeroless Liquidity amount correctly!')
      setStep(5)
      return
    }
    if (Number.isNaN(parseInt(pancakeLiquidityRate))) {
      toastError('Please input Pancake Liquidity amount correctly!')
      setStep(6)
      return
    }
    if (parseFloat(sphynxLiquidityRate) + parseFloat(pancakeLiquidityRate) < 70) {
      toastError('Sum of Liquidity amount should be greater than 70%!')
      setStep(5)
      return
    }
    if (parseFloat(sphynxLiquidityRate) + parseFloat(pancakeLiquidityRate) > 100) {
      toastError('Sum of Liquidity amount should be less than 100%!')
      setStep(5)
      return
    }
    if (!parseFloat(listingRate)) {
      toastError('Please input listing rate!')
      setStep(7)
      return
    }

    if (new Date(presaleStart).getTime() < new Date().getTime() + 600000) {
      toastError('Presale start time must be more than 10 minutes after now!')
      setStep(9)
      return
    }
    if (
      new Date(presaleStart).getTime() > new Date(presaleEnd).getTime() ||
      new Date(presaleStart).getTime() + 3600 * 1000 * 24 * 2 <= new Date(presaleEnd).getTime()
    ) {
      toastError('Presale period must be less than 3 days!')
      setStep(9)
      return
    }
    if (new Date(presaleStart).getTime() > new Date(tier1Time).getTime()) {
      toastError('Presale tier1 time must be greater than the presale start time!')
      setStep(9)
      return
    }
    if (new Date(tier1Time).getTime() > new Date(tier2Time).getTime()) {
      toastError('Presale tier2 time must be greater than the presale tier1 time!')
      setStep(9)
      return
    }
    if (new Date(liquidityLock).getTime() <= new Date(presaleEnd).getTime() + 3 * 30 * 24 * 3600 * 1000) {
      toastError('Liquidity lock time must be greater than 3 month from presale end time!')
      setStep(9)
      return
    }

    setPendingTx(true)
    const presaleId = (await presaleContract.currentPresaleId()).toString()
    const routerAddress = getRouterAddress(chainId)
    const startTime = Math.floor(new Date(presaleStart).getTime() / 1000)
    const tierOneTime = Math.floor(new Date(tier1Time).getTime() / 1000)
    const tierTwoTime = Math.floor(new Date(tier2Time).getTime() / 1000)
    const endTime = Math.floor(new Date(presaleEnd).getTime() / 1000)
    const liquidityLockTime = Math.floor(new Date(liquidityLock).getTime() / 1000)

    const value: any = {
      saleId: presaleId,
      token: tokenAddress,
      minContributeRate: ethers.utils.parseEther(minBuy),
      maxContributeRate: ethers.utils.parseEther(maxBuy),
      startTime: startTime.toString(),
      tier1Time: tierOneTime.toString(),
      tier2Time: tierTwoTime.toString(),
      endTime: endTime.toString(),
      liquidityLockTime: liquidityLockTime.toString(),
      routerId: routerAddress,
      tier1Rate: ethers.utils.parseUnits(tier1, tokenDecimal),
      tier2Rate: ethers.utils.parseUnits(tier2, tokenDecimal),
      publicRate: ethers.utils.parseUnits(tier3, tokenDecimal),
      liquidityRate: ethers.utils.parseUnits(listingRate, tokenDecimal),
      softCap: ethers.utils.parseEther(softCap),
      hardCap: ethers.utils.parseEther(hardCap),
      routerRate: pancakeLiquidityRate,
      defaultRouterRate: sphynxLiquidityRate,
      isGold: kyc && utility && doxxedTeam && certikAudit,
    }

    const fee = ethers.utils.parseEther('0.1')

    let tokenLevel: number
    switch (selectedCount) {
      case 0:
        tokenLevel = SEARCH_OPTION.OTHER
        break
      case 1:
        tokenLevel = SEARCH_OPTION.BRONZE
        break
      case 2:
      case 3:
        tokenLevel = SEARCH_OPTION.SILVER
        break
      case 4:
      default:
        tokenLevel = SEARCH_OPTION.GOLD
        break
    }

    presaleContract
      .createPresale(value, { value: fee })
      .then((res) => {
        /* if presale created successfully */
        const data: any = {
          chain_id: chainId,
          sale_id: presaleId,
          owner_address: account,
          token_address: tokenAddress,
          token_name: tokenName,
          token_symbol: tokenSymbol,
          token_decimal: tokenDecimal,
          tier1,
          tier2,
          tier3,
          soft_cap: softCap,
          hard_cap: hardCap,
          min_buy: minBuy,
          max_buy: maxBuy,
          router_rate: pancakeLiquidityRate,
          default_router_rate: sphynxLiquidityRate,
          listing_rate: listingRate,
          logo_link: logoLink,
          website_link: webSiteLink,
          github_link: gitLink,
          twitter_link: twitterLink,
          reddit_link: redditLink,
          telegram_link: telegramLink,
          project_dec: projectDec,
          update_dec: updateDec,
          token_level: tokenLevel,
          start_time: startTime,
          end_time: endTime,
          tier1_time: tierOneTime,
          tier2_time: tierTwoTime,
          lock_time: liquidityLockTime,
          certik_audit: certikAudit,
          doxxed_team: doxxedTeam,
          kyc,
          utility,
        }

        setPendingTx(false)
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/insertPresaleInfo`, { data }).then((response) => {
          if (response.data) {
            toastSuccess('Pushed!', 'Your presale info is saved successfully.')
            history.push(`/launchpad/presale/${presaleId}/${chainId}`)
          } else {
            toastError('Failed!', 'Your action is failed.')
          }
        })
      })
      .catch((err) => {
        setPendingTx(false)
        toastError('Failed!', 'Your action is failed.')
      })
  }

  const [onDisclaimerModal] = useModal(<DisclaimerModal />, false)

  useEffect(() => {
    if (disclaimerModalShow) {
      onDisclaimerModal()
      setDisclaimerModalShow(false)
    }
  }, [disclaimerModalShow, setDisclaimerModalShow, onDisclaimerModal])

  useEffect(() => {
    if (chainId === ChainId.ETHEREUM) {
      setSphynxSwapLiquidEditable(false)
      setSphynxLiquidityRate('0')
    } else {
      setSphynxSwapLiquidEditable(true)
    }
  }, [chainId])

  return (
    <Wrapper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <LogoTitle>
          <CheckList /> Create/Manage Presale
        </LogoTitle>
        <Sperate />
        <NoteWrapper>
          <InlineWrapper>
            <Title>Create Sale</Title>
          </InlineWrapper>
          <Sperate />
          <Notification>Get started in just a few simple steps!</Notification>
          <Sperate />
          <Notification>
            This process is entirely decentralized, we cannot be held reponsible for incorrect entry of information or
            be held liable for anything related to your use of our platform. Please ensure you enter all your details to
            the best accuracy possible and that you are in compliance with your local laws and regulations. If your
            local laws require KYC and AML please use the security menu option to first KYC your account!
          </Notification>
          <Sperate />
          <WarningPanel>
            <BellIcon style={{ flexShrink: 0.3 }} />
            <p className="ml16" style={{ fontSize: '18px', fontWeight: 'bold' }}>
              For tokens with burns, rebase or other special transfers please ensure you have a way to whitelist
              multiple addresses or turn off the special transfer events (By setting fees to 0 for example for the
              duration of the presale)
            </p>
          </WarningPanel>
        </NoteWrapper>
        <Sperate />
        <ContentWrapper>
          <FeeCard nativeCurrency={nativeCurrency} />
          <div style={{ marginTop: '24px', width: '100%', marginBottom: '24px' }}>
            <StepWrapper number="1" stepName="Token Address" step={step} onClick={() => setStep(1)}>
              <p className="description">Enter your token Address</p>
              <MyInput onChange={handleChange} value={tokenAddress} style={{ width: '100%' }} />
              <Sperate />
              <InlineWrapper>
                <p className="description w110">Token Name</p>
                <MyInput className="ml16" value={tokenName} readOnly />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w110">Token Symbol</p>
                <MyInput className="ml16" value={tokenSymbol} readOnly />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w110">Token Decimal</p>
                <MyInput className="ml16" value={tokenDecimal} readOnly />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn disabled>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(2)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="2" stepName="Presale Rate" step={step} onClick={() => setStep(2)}>
              <p>* (set the same rate for single tier presale)</p>
              <Sperate />
              <InlineWrapper>
                <p className="description w140">Tier 1 *(Per {nativeCurrency})</p>
                <MyInput className="ml16" value={tier1} onChange={handleTier1} />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w140">Tier 2 *(Per {nativeCurrency})</p>
                <MyInput className="ml16" value={tier2} onChange={handleTier2} />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w140">Public *(Per {nativeCurrency})</p>
                <MyInput className="ml16" value={tier3} onChange={handleTier3} />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(1)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(3)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="3" stepName="Soft/Hard Cap" step={step} onClick={() => setStep(3)}>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w140">Soft Cap *({nativeCurrency})</p>
                  <MyInput className="ml16" onChange={(e) => setSoftCap(e.target.value)} value={softCap} />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w140">Hard Cap *({nativeCurrency})</p>
                  <MyInput className="ml16" onChange={(e) => setHardCap(e.target.value)} value={hardCap} />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(2)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(4)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="4" stepName="Contribution Limits" step={step} onClick={() => setStep(4)}>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w110">Min Buy *(Per {nativeCurrency})</p>
                  <MyInput className="ml16" onChange={(e) => setMinBuy(e.target.value)} value={minBuy} />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w110">Max Buy *(Per {nativeCurrency})</p>
                  <MyInput className="ml16" onChange={(e) => setMaxBuy(e.target.value)} value={maxBuy} />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(3)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(5)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="5" stepName="ZerolessSwap Liquidity" step={step} onClick={() => setStep(5)}>
              <p className="description mb4">
                Enter the percentage of raised funds that should be allocated to Liquidity on ZerolessSwap (Min 0%, Max
                100%, We recommend &gt; 70%)
              </p>
              {!sphynxSwapLiquidEditable ? (
                <p className="description mb4">* ZerolessSwap on ETH is not supported yet!</p>
              ) : null}
              <MyInput
                onChange={(e) => setSphynxLiquidityRate(e.target.value)}
                value={sphynxLiquidityRate}
                disabled={!sphynxSwapLiquidEditable}
              />
              &nbsp; %
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(4)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(6)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper
              number="6"
              stepName={chainId === ChainId.ETHEREUM ? 'UniSwap Liquidity' : 'PancakeSwap Liquidity'}
              step={step}
              onClick={() => setStep(6)}
            >
              <p className="description">
                Enter the percentage of raised funds that should be allocated to Liquidity on{' '}
                {chainId === ChainId.ETHEREUM ? 'UniSwap' : 'PancakeSwap'} (Min 0%, Max 100%, We recommend ZerolessSwap)
              </p>
              <MyInput onChange={(e) => setPancakeLiquidityRate(e.target.value)} value={pancakeLiquidityRate} />
              &nbsp; %
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(5)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(7)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper
              number="7"
              stepName={
                chainId === ChainId.ETHEREUM
                  ? 'ZerolessSwap/UniSwap Listing Rate'
                  : 'ZerolessSwap/PancakeSwap Listing Rate'
              }
              step={step}
              onClick={() => setStep(7)}
            >
              <p className="description">
                Enter the ZerolessSwap/Pancake swap listing price: (If I buy 1 {nativeCurrency} worth on Swap how many
                tokens do I get? Usually this amount is lower than presale rate to allow for a higher listing price on
                Swap)
              </p>
              <MyInput onChange={(e) => setListingRate(e.target.value)} value={listingRate} /> (Per {nativeCurrency})
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(6)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(8)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="8" stepName="Additional Information" step={step} onClick={() => setStep(8)}>
              <p className="description">
                Please fill out the additional information below to display it on your presale. (Information in this
                section is optional, but a description and logo link is recommended) Note the information in this
                section can be updated at any time by the presale creator while the presale is active. Any links left
                blank will not be displayed on your sale.
              </p>
              <Sperate />
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
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w140">Certik audit</p>
                  <Select
                    options={[
                      {
                        label: t('No'),
                        value: false,
                      },
                      {
                        label: t('Yes'),
                        value: true,
                      },
                    ]}
                    onChange={(option: any) => {
                      setCertikAudit(option.value)
                      handleChecked(option.value)
                    }}
                  />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w140">Doxxed team</p>
                  <Select
                    options={[
                      {
                        label: t('No'),
                        value: false,
                      },
                      {
                        label: t('Yes'),
                        value: true,
                      },
                    ]}
                    onChange={(option: any) => {
                      setDoxxedTeam(option.value)
                      handleChecked(option.value)
                    }}
                  />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w140">Utility information</p>
                  <Select
                    options={[
                      {
                        label: t('No'),
                        value: false,
                      },
                      {
                        label: t('Yes'),
                        value: true,
                      },
                    ]}
                    onChange={(option: any) => {
                      setUtility(option.value)
                      handleChecked(option.value)
                    }}
                  />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w140">KYC</p>
                  <Select
                    options={[
                      {
                        label: t('No'),
                        value: false,
                      },
                      {
                        label: t('Yes'),
                        value: true,
                      },
                    ]}
                    onChange={(option: any) => {
                      setKYC(option.value)
                      handleChecked(option.value)
                    }}
                  />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <p className="description">
                *to verify your tier, please reach out to{' '}
                <Link
                  target="_blank"
                  style={{ display: 'inline', textDecoration: 'underline', fontWeight: 500 }}
                  href="https://t.me/Zerolessswapsupport"
                >
                  https://t.me/Zerolessswapsupport
                </Link>{' '}
                and submit your information
              </p>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(7)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(9)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="9" stepName="Timing" step={step} onClick={() => setStep(9)}>
              <p>* (set the same timer all the same for all tiers for single tier presale)</p>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w110">Tier 1 Start Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value={presaleStart}
                    onChange={(date, value) => setPresaleStart(date)}
                  />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w110">Presale End Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value={presaleEnd}
                    onChange={(date, value) => setPresaleEnd(date)}
                  />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w110">Tier2 Start Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value={tier1Time}
                    onChange={(date, value) => setTier1Time(date)}
                  />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w110">Public Start Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value={tier2Time}
                    onChange={(date, value) => setTier2Time(date)}
                  />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w110">Liquidity Lock Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value={liquidityLock}
                    onChange={(date, value) => setLiquidityLock(date)}
                  />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description">Minimum 3 Months</p>
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(8)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(10)}>
                  Finish
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="10" stepName="Finalize" step={step} onClick={() => setStep(10)}>
              <NoteWrapper style={{ maxWidth: 'unset' }}>
                <FlexWrapper>
                  <p className="description w220">Token Name</p>
                  <p className="description w220">{tokenName}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Token Symbol</p>
                  <p className="description w220">{tokenSymbol}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Presale Rate(Per {nativeCurrency})</p>
                  <p className="description w220">
                    {tier3}/{nativeCurrency}
                  </p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Soft/Hard Caps({nativeCurrency})</p>
                  <p className="description w220">
                    Soft Cap({nativeCurrency}): {softCap}
                  </p>
                  <p className="description w220">
                    Hard Cap({nativeCurrency}): {hardCap}
                  </p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Contribution Limits({nativeCurrency})</p>
                  <p className="description w220">Min: {minBuy}</p>
                  <p className="description w220">Max: {maxBuy}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Presale Timings</p>
                  <p className="description w220">Starts: {presaleStart.toDateString()}</p>
                  <p className="description w220">Ends: {presaleEnd.toDateString()}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">ZerolessSwap Liquidity</p>
                  <p className="description w220">{sphynxLiquidityRate}</p>
                  <p className="description">Liquidity Locked: {liquidityLock.toDateString()}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">
                    {chainId === ChainId.ETHEREUM ? 'UniSwap Liquidity' : 'PancakeSwap Liquidity'}
                  </p>
                  <p className="description w220">{pancakeLiquidityRate}</p>
                  <p className="description">
                    ZerolessSwap Rate(Per {nativeCurrency}): {listingRate}
                  </p>
                </FlexWrapper>
                <Sperate />
                <InlineWrapper>
                  <LineBtn onClick={() => setStep(1)}>Edit</LineBtn>
                  <FillBtn disabled={pendingTx} className="ml16" onClick={validate}>
                    Submit
                    {pendingTx && <AutoRenewIcon className="pendingTx" />}
                  </FillBtn>
                </InlineWrapper>
              </NoteWrapper>
            </StepWrapper>
          </div>
        </ContentWrapper>
      </MuiPickersUtilsProvider>
    </Wrapper>
  )
}

export default Presale
