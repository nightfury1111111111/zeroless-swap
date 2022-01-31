import 'date-fns'
import React, { useState, useEffect } from 'react'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { SPHYNX_ROUTER, V2_ROUTER } from 'config/constants/routers'
import { ReactComponent as BellIcon } from 'assets/svg/icon/Bell.svg'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import * as ethers from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { isAddress } from '@ethersproject/address'
import moment from 'moment'
import useToast from 'hooks/useToast'
import styled, { keyframes } from 'styled-components'
import { ERC20_ABI } from 'config/abi/erc20'
import { useModal, AutoRenewIcon } from '@sphynxdex/uikit'
import { ChainId } from '@sphynxdex/sdk-multichain'
import DisclaimerModal from 'components/DisclaimerModal/DisclaimerModal'
import Select from 'components/Select/Select'
import axios from 'axios'
import { getFairLaunchContract } from 'utils/contractHelpers'
import { useWeb3React } from '@web3-react/core'
import { getFairLaunchAddress } from 'utils/addressHelpers'
import { useHistory } from 'react-router-dom'

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
    background: ${({ theme }) => theme.custom.tertiary};
  }
  & > div.MuiFormControl-root {
    background: ${({ theme }) => theme.custom.tertiary};
  }
`

const CardWrapper = styled.div`
  background: ${({ theme }) => theme.custom.tertiary};
  border: 1px solid ${({ theme }) => theme.custom.divider};;
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
  // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  background: ${({ theme }) => theme.custom.gradient};
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
      <MainLogo style={{ width: '60px', height: '60px' }} />
      <Sperate />
      <FeeWrapper>
        <p>
          Current Fee: <span>0.1{nativeCurrency}</span>
        </p>
        <VerticalSperator />
        <p>
          Tokens Listed: <span>1.75%</span>
        </p>
        <VerticalSperator />
      </FeeWrapper>
    </CardWrapper>
  )
}

const MyInput = styled.input`
  background: ${({ theme }) => theme.custom.tertiary};
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
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
  background: ${({ theme }) => theme.custom.lineBtn};
  // background: ${({ theme }) => (theme ? '#222341' : '#1A1A3A')};
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
  const { library, account, chainId } = useActiveWeb3React()
  const signer = library.getSigner()
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenName, setName] = useState('')
  const [tokenSymbol, setSymbol] = useState('')
  const [tokenDecimal, setDecimal] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const [bnbAmount, setBnbAmount] = useState('')
  const [balanceAmount, setBalanceAmount] = useState('')
  const [logoLink, setLogoLink] = useState('')
  const [webSiteLink, setWebSiteLink] = useState('')
  const [gitLink, setGitLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const [redditLink, setRedditLink] = useState('')
  const [telegramLink, setTelegramLink] = useState('')
  const [projectDec, setProjectDec] = useState('')
  const [updateDec, setUpdateDec] = useState('')
  const [liquidityType, setLiquidityType] = useState('sphynxswap')
  const [launchTime, setLaunchTime] = useState(new Date())
  const [unlockTime, setUnlockTime] = useState(new Date())
  const [step, setStep] = useState(1)
  const [disclaimerModalShow, setDisclaimerModalShow] = useState(true)
  const [routerOptions, setRouterOptions] = useState([])
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const fairLaunchContract = getFairLaunchContract(signer, chainId)
  const history = useHistory()

  const nativeCurrency = chainId === ChainId.ETHEREUM ? 'ETH' : 'BNB'

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
        const total = await tokenContract.totalSupply()
        const balance = await tokenContract.balanceOf(account)
        setName(name)
        setSymbol(symbol)
        setDecimal(decimals)
        setBalanceAmount(ethers.utils.formatUnits(balance, decimals))
        setTotalSupply(ethers.utils.formatUnits(total, decimals))
      } catch (err) {
        console.log('error', err.message)
      }
    }
  }

  const handleTokenAmount = (e) => {
    setTokenAmount(e.target.value)
  }

  const handleBnbAmount = (e) => {
    setBnbAmount(e.target.value)
  }

  const validate = async () => {
    if (!tokenAddress || !tokenName || !tokenSymbol) {
      toastError('Oops, we can not parse token data, please input correct token address!')
      setStep(1)
      return
    }
    if (!parseFloat(tokenAmount) || !parseFloat(bnbAmount)) {
      toastError('Please input launch rate correctly!')
      setStep(2)
      return
    }

    setPendingTx(true)

    const now = Math.floor(new Date().getTime() / 1000)
    const launchTimeStamp = Math.floor(new Date(launchTime).getTime() / 1000)
    const lockTimeStamp = Math.floor(new Date(unlockTime).getTime() / 1000)

    if (now + 600 >= launchTimeStamp) {
      toastError('Launch time should be greater than 10 minutes from now!')
      setStep(4)
      return
    }
    if (launchTimeStamp + 60 * 24 * 30 >= lockTimeStamp) {
      toastError('Lock time should be greater than 1 months from launch time!')
      setStep(4)
      return
    }
    const router = liquidityType === 'sphynxswap' ? SPHYNX_ROUTER[chainId] : V2_ROUTER[chainId]
    try {
      const launchId = (await fairLaunchContract.currentLaunchId()).toString()
      const fee = ethers.utils.parseEther('0.1')
      const abi: any = ERC20_ABI
      const tokenContract = new ethers.Contract(tokenAddress, abi, signer)
      const allowance = await tokenContract.allowance(account, getFairLaunchAddress())
      if (allowance < tokenAmount) {
        const tx = await tokenContract.approve(getFairLaunchAddress(chainId), '0xfffffffffffffffffffffffffffffffff')
        await tx.wait()
      }

      const tx = await fairLaunchContract.createFairLaunch(
        tokenAddress,
        ethers.utils.parseUnits(tokenAmount, tokenDecimal),
        ethers.utils.parseEther(bnbAmount),
        launchTimeStamp,
        router,
        lockTimeStamp,
        { value: fee.add(ethers.utils.parseEther(bnbAmount)) },
      )
      const receipt = await tx.wait()
      const data = {
        chain_id: chainId,
        launch_id: launchId,
        owner_address: account,
        token_address: tokenAddress,
        token_name: tokenName,
        token_symbol: tokenSymbol,
        token_decimals: tokenDecimal,
        total_supply: totalSupply,
        token_amount: tokenAmount,
        native_amount: bnbAmount,
        launch_time: launchTimeStamp,
        lock_time: lockTimeStamp,
        logo_link: logoLink,
        website_link: webSiteLink,
        github_link: gitLink,
        twitter_link: twitterLink,
        reddit_link: redditLink,
        telegram_link: telegramLink,
        project_dec: projectDec,
        update_dec: updateDec,
      }
      setPendingTx(false)
      if (receipt.status === 1) {
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/insertFairLaunchInfo`, data).then((response) => {
          if (response.data) {
            toastSuccess('Pushed!', 'Your fairlaunch info is saved successfully.')
            history.push(`/launchpad/fair/manage/${launchId}/${chainId}`)
          } else {
            toastError('Failed!', 'Your action is failed.')
          }
        })
      }
    } catch (err) {
      console.log('error', err)
      setPendingTx(false)
      toastError('Failed!', 'Your action is failed.')
    }
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
      setRouterOptions([
        {
          label: chainId === ChainId.ETHEREUM ? t('UniSwap') : t('Pancakeswap'),
          value: 'pancakeswap',
        },
      ])
    } else {
      setRouterOptions([
        {
          label: t('SphynxSwap'),
          value: 'sphynxswap',
        },
        {
          label: chainId === ChainId.ETHEREUM ? t('UniSwap') : t('Pancakeswap'),
          value: 'pancakeswap',
        },
      ])
    }
  }, [chainId])

  return (
    <Wrapper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <NoteWrapper>
          <InlineWrapper>
            <Title>Schedule Your FairLaunch</Title>
          </InlineWrapper>
          <Sperate />
          <Notification>Get started in just a few simple steps!</Notification>
          <Sperate />
          <Notification>
            Disclaimer: This process is entirely decentralized, we cannot be held responsible for incorrect entry of
            information or be held liable for anything related to your use of our platform. Please ensure you enter all
            your details to the best accuracy possible and that you are in compliance with your local laws and
            regulations.
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
            <StepWrapper number="1" stepName="Token" step={step} onClick={() => setStep(1)}>
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
                <p className="description w110">Total Supply</p>
                <MyInput className="ml16" value={totalSupply} readOnly />
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
            <StepWrapper number="2" stepName="Launch Rate" step={step} onClick={() => setStep(2)}>
              <p className="description">Your wallet balance: {balanceAmount}</p>
              <Sperate />
              <p className="description">Please enter the amount of tokens for listing:</p>
              <MyInput value={tokenAmount} type="number" onChange={handleTokenAmount} />
              <Sperate />
              <p className="description">Please enter the amount of {nativeCurrency} you will add:</p>
              <MyInput value={bnbAmount} type="number" onChange={handleBnbAmount} />
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(1)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(3)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="3" stepName="Router" step={step} onClick={() => setStep(3)}>
              <InlineWrapper>
                <p className="description w140">Liquidity</p>
                <Select
                  options={routerOptions}
                  onChange={(option: any) => {
                    setLiquidityType(option.value)
                  }}
                />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(2)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(4)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="4" stepName="Timing" step={step} onClick={() => setStep(4)}>
              <Sperate />
              <p className="description">Please set the start time for your launch and the liquidity lock time!</p>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w110">Fair Launch Start Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value={launchTime}
                    onChange={(date, value) => setLaunchTime(date)}
                  />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w110">Liquidity Unlock Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value={unlockTime}
                    onChange={(date, value) => setUnlockTime(date)}
                  />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(3)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(5)}>
                  Finish
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="5" stepName="Additional Information" step={step} onClick={() => setStep(5)}>
              <p className="description">
                Note the information in this section can be updated at any time by the presale creator while the presale
                is active. Any links left blank will not be displayed on your sale.
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
              <InlineWrapper>
                <LineBtn onClick={() => setStep(4)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(6)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="6" stepName="Finalize" step={step} onClick={() => setStep(6)}>
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
                  <p className="description w220">Token Amount</p>
                  <p className="description w220">{tokenAmount}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">{nativeCurrency} Amount</p>
                  <p className="description w220">{bnbAmount}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Launch Timings</p>
                  <p className="description">{moment(launchTime).format('MMMM Do YYYY, h:mm a')}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Unlock Time</p>
                  <p className="description w220">{moment(unlockTime).format('MMMM Do YYYY, h:mm a')}</p>
                </FlexWrapper>
                <Sperate />
                <InlineWrapper>
                  <LineBtn onClick={() => setStep(1)}>Edit</LineBtn>
                  <FillBtn className="ml16" onClick={validate} disabled={pendingTx}>
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
