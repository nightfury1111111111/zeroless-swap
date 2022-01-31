import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex, useMatchBreakpoints, Button, AutoRenewIcon } from '@sphynxdex/uikit'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import styled, { keyframes, useTheme } from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import * as ethers from 'ethers'
import { ERC20_ABI } from 'config/abi/erc20'
import { isAddress } from '@ethersproject/address'
import axios from 'axios'
import { MaxUint256 } from '@ethersproject/constants'
import { getLockerContract } from 'utils/contractHelpers'
import { useHistory } from 'react-router-dom'
import { TOKEN_LOCK_PAYABLE_BNB, LP_LOCK_PAYABLE_BNB } from 'config/constants/lock'
import useToast from 'hooks/useToast'
import Select, { OptionProps } from 'components/Select/Select'
import Slider from 'react-rangeslider'
import { DarkButtonStyle, ColorButtonStyle } from 'style/buttonStyle'
import { getLockerAddress } from 'utils/addressHelpers'
/* eslint-disable camelcase */
import LPToken_ABI from 'config/abi/lpToken.json'

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
  align-items: start;
  flex-flow: column;
  color: white;
  padding: 5px;
  margin-top: 24px;
  text-align: center;
  font-weight: bold;
  .progressButtons {
    & > button {
      background: black;
      color: white;
      padding: 8px;
      margin: 8px;
      font-size: 12px;
      height: 24px;
    }
  }
  p {
    line-height: 24px;
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
  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 24px;
  }
  .pendingTx {
    animation: ${rotate} 2s linear infinite;
  }
`

const PageHeader = styled.div`
  width: 100%;
`

const WelcomeText = styled(Text)`
  color: white;
  font-weight: 600;
  line-height: 1.5;
  font-size: 20px;
  text-align: left;
  padding: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 30px;
  }
`

const PageBody = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  p.description {
    text-align: left;
    margin-right: 20px;
    font-size: 14px;
  }
  p.w110 {
    color: white;
  }
  p.w120 {
    color: white;
  }
`

const MyInput = styled.input`
  width: 100%;
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

const Sperate = styled.div`
  margin-top: 32px;
`

const InlineWrapper = styled.div`
  display: flex;
  align-items: center;
`

const ControlStretch = styled(Flex)<{ isMobile?: boolean }>`
  height: 47px;
  margin: 12px 0;
  width: 100%;
  max-width: 1000px;
  // background: ${({ theme }) => (theme ? '#1a1a3a' : '#20234e')};
  background: ${({ theme }) => theme.custom.background};
  > div {
    flex: 1;
    height: 47px;
    box-sizing: border-box;
    // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
    background: ${({ theme }) => theme.custom.tertiary};
    > div {
      // border: 1px solid ${({ theme }) => (theme ? '#2E2E55' : '#4A5187')};
      border: 1px solid ${({ theme }) => theme.custom.currencySelectButton};
      height: 47px;
      // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
      background: ${({ theme }) => theme.custom.tertiary};
      > div {
        color: white;
      }
    }
  }
`

const ManageLocker: React.FC = () => {
  const { account, library, chainId } = useActiveWeb3React()
  const history = useHistory()
  const signer = library.getSigner()
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { toastSuccess, toastError } = useToast()
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenName, setName] = useState('')
  const [token0, setToken0] = useState('')
  const [token1, setToken1] = useState('')
  const [lpName0, setLpName0] = useState('')
  const [lpName1, setLpName1] = useState('')
  const [tokenSymbol, setSymbol] = useState('')
  const [totalSupply, setTotalSupply] = useState(0)
  const [userBalance, setUserBalance] = useState(0)
  const [userRealBalance, setUserRealBalance] = useState(ethers.BigNumber.from('0'))
  const [tokenDecimals, setDecimals] = useState(18)
  const lockContract = getLockerContract(signer, chainId)
  const [isLPToken, setIsLPToken] = useState(false)
  const [unLock, setUnLock] = useState(new Date())
  const [logoLink, setLogoLink] = useState('')
  const [vestId, setVestId] = useState(1)
  const [percent, setPercent] = useState(0)
  const [isApprove, setIsApprove] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [pendingApprove, setPendingApprove] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState(false)
  const theme = useTheme()
  
  const options = [
    {
      label: t('No vesting, all tokens will be released at unlock time!'),
      value: 1,
    },
    {
      label: t('Vest twice (Unlock 50% tokens in 2 periods, 1 halfway and 1 at unlock time)'),
      value: 2,
    },
    {
      label: t('Vest four times (25% of your tokens are unlocked in 4 periods)'),
      value: 4,
    },
    {
      label: t('Vest five times'),
      value: 5,
    },
    {
      label: t('Vest ten times'),
      value: 10,
    },
    {
      label: t('Vest twenty times'),
      value: 20,
    },
    {
      label: t('Vest twenty-five times'),
      value: 25,
    },
    {
      label: t('Vest fifty times'),
      value: 50,
    },
    {
      label: t('Vest one-hundred times'),
      value: 100,
    },
  ]

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 25,
      label: '25',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 75,
      label: '75',
    },
    {
      value: 100,
      label: '100',
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const abi: any = ERC20_ABI
        const tokenContract = new ethers.Contract(tokenAddress, abi, library)
        const allowance = await tokenContract.allowance(account, getLockerAddress(chainId))
        const value = parseFloat(ethers.utils.formatUnits(allowance, tokenDecimals))

        if (value > (totalSupply * percent) / 100) {
          setIsApprove(false)
          setIsSubmit(true)
        } else {
          setIsApprove(true)
          setIsSubmit(false)
        }
      } catch (err) {
        console.log('error', err.message)
        setIsApprove(false)
      }
    }

    if (account && totalSupply) {
      fetchData()
    } else {
      setIsSubmit(false)
      setIsApprove(false)
    }
  }, [totalSupply, percent, account, tokenAddress, tokenDecimals, library])

  const isLPTokenAddress = async (address) => {
    try {
      const lpAbi: any = LPToken_ABI
      const lpContract = new ethers.Contract(address, lpAbi, signer)
      await lpContract.token0()
      return true
    } catch (err) {
      return false
    }
  }

  const handleChange = async (e) => {
    const value = e.target.value
    setTokenAddress(value)
    const address = isAddress(value)
    if (address) {
      try {
        const isLP = await isLPTokenAddress(value)
        if (isLP) {
          /* eslint-disable camelcase */
          const lpAbi: any = LPToken_ABI
          const lpContract = new ethers.Contract(value, lpAbi, signer)
          const decimals = await lpContract.decimals()
          const bgSupply = await lpContract.totalSupply()
          const uBalance = await lpContract.balanceOf(account)
          const supply = parseFloat(ethers.utils.formatUnits(bgSupply, decimals))
          const balance = parseFloat(ethers.utils.formatUnits(uBalance, decimals))
          setTotalSupply(supply)
          setDecimals(decimals)
          setUserBalance(balance)
          setUserRealBalance(uBalance)

          const address0 = await lpContract.token0()
          const address1 = await lpContract.token1()
          setToken0(address0)
          setToken1(address1)

          const lpTokenContract0 = new ethers.Contract(address0, lpAbi, signer)
          const name0 = await lpTokenContract0.name()
          setLpName0(name0)

          const lpTokenContract1 = new ethers.Contract(address1, lpAbi, signer)
          const name1 = await lpTokenContract1.name()
          setLpName1(name1)

          setIsLPToken(true)
        } else {
          const abi: any = ERC20_ABI
          const tokenContract = new ethers.Contract(value, abi, signer)
          const name = await tokenContract.name()
          const symbol = await tokenContract.symbol()
          const decimals = await tokenContract.decimals()
          const bgSupply = await tokenContract.totalSupply()
          const uBalance = await tokenContract.balanceOf(account)
          const supply = parseFloat(ethers.utils.formatUnits(bgSupply, decimals))
          const balance = parseFloat(ethers.utils.formatUnits(uBalance, decimals))
          setName(name)
          setSymbol(symbol)
          setTotalSupply(supply)
          setUserBalance(balance)
          setUserRealBalance(uBalance)
          setDecimals(decimals)
          setIsLPToken(false)
        }
      } catch (err) {
        console.log('error', err.message)
        setName('')
        setSymbol('')
        setTotalSupply(0)
        setUserBalance(0)
        setToken0('')
        setToken1('')
        setLpName0('')
        setLpName1('')
      }
    } else {
      setName('')
      setSymbol('')
      setTotalSupply(0)
      setUserBalance(0)
      setToken0('')
      setToken1('')
      setLpName0('')
      setLpName1('')
    }
  }

  const handleVestOptionChange = (option: OptionProps): void => {
    setVestId(option.value)
  }

  const handleChangePercent = (sliderPercent: number) => {
    setPercent(sliderPercent)
  }

  const valueLabelFormat = (value: number) => {
    return marks.findIndex((mark) => mark.value === value) + 1
  }

  const valuetext = (value: number) => {
    return `${value}%`
  }

  const handleApproveClick = async () => {
    try {
      setPendingApprove(true)
      const abi: any = ERC20_ABI
      const tokenContract = new ethers.Contract(tokenAddress, abi, signer)
      const tx = await tokenContract.approve(getLockerAddress(chainId), MaxUint256)
      await tx.wait()
      setIsApprove(false)
      setIsSubmit(true)
      setPendingApprove(false)
      toastSuccess('Success', 'Operation successfully!')
    } catch (err) {
      setPendingApprove(false)
      toastError('Failed', err.message)
      console.log('error', err.message)
      setName('')
      setSymbol('')
      setTotalSupply(0)
      setToken0('')
      setToken1('')
    }
  }

  const handleSubmitClick = async () => {
    try {
      setPendingSubmit(true)
      const lockId = (await lockContract.currentLockId()).toString()
      const lockTime = Math.floor(new Date(unLock).getTime() / 1000)
      const lockAmount = userRealBalance.mul(ethers.BigNumber.from(percent).div(100))

      const fee = ethers.utils.parseEther(isLPToken ? LP_LOCK_PAYABLE_BNB : TOKEN_LOCK_PAYABLE_BNB)
      lockContract
        .createLock(lockTime.toString(), vestId, lockAmount, tokenAddress, isLPToken, { value: fee })
        .then((res) => {
          /* If token locked successfully */
          const data: any = {
            chain_id: chainId,
            lock_id: lockId,
            owner_address: account,
            lock_address: tokenAddress,
            token_type: isLPToken,
            token_name: isLPToken ? lpName1 : tokenName,
            token_symbol: isLPToken ? lpName0 : tokenSymbol,
            lock_supply: (userBalance * percent) / 100,
            total_supply: totalSupply,
            start_time: Math.floor(new Date().getTime() / 1000),
            end_time: Math.floor(new Date(unLock).getTime() / 1000),
            logo_link: logoLink,
            vest_num: vestId,
          }
          axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/insertTokenLockInfo`, { data }).then((response) => {
            if (response.data) {
              toastSuccess('Pushed!', 'Your lock info is saved successfully.')
              history.push(`/launchpad/locker/tokendetail/${lockId}/${chainId}`)
            } else {
              toastError('Failed!', 'Your action is failed.')
            }
          })
          setPendingSubmit(false)
        })
        .catch((err) => {
          console.log('error', err)
          setPendingSubmit(false)
          toastError('Failed!', 'Your action is failed.')
        })
    } catch (err) {
      console.log('error', err)
      setPendingSubmit(false)
      toastError('Failed!', 'Your action is failed.')
    }
  }

  return (
    <Wrapper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <PageHeader>
          <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
            <Flex alignItems="center">
              <MainLogo width="80" height="80" />
              <Flex flexDirection="column" ml="10px">
                <WelcomeText>{t('SPHYNX LOCKERS/MANAGE')}</WelcomeText>
              </Flex>
            </Flex>
          </Flex>
        </PageHeader>
        <Sperate />
        <PageBody>
          <p className="description w110" style={{ marginBottom: '5px' }}>
            Token or Pair Address:
          </p>
          <InlineWrapper>
            <MyInput onChange={handleChange} value={tokenAddress} style={{ maxWidth: '1000px' }} />
          </InlineWrapper>
          <Sperate />
          {isLPToken ? (
            <>
              <InlineWrapper>
                <p className="description w110">{lpName0}:</p>
                <p className="description w120">{token0}</p>
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w110">{lpName1}:</p>
                <p className="description w120">{token1}</p>
              </InlineWrapper>
            </>
          ) : (
            <>
              <InlineWrapper>
                <p className="description w110">Token Name:</p>
                <p className="description w120">{tokenName}</p>
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w110">Token Symbol:</p>
                <p className="description w120">{tokenSymbol}</p>
              </InlineWrapper>
            </>
          )}
          <Sperate />
          <InlineWrapper>
            <p className="description w110">Total Supply:</p>
            <p className="description w120">{totalSupply}</p>
          </InlineWrapper>
          <Sperate />
          <InlineWrapper>
            <p className="description w110">UnLock Time</p>
            <KeyboardDateTimePicker
              format="yyyy-MM-dd HH:mm:ss"
              value={unLock}
              onChange={(date, value) => setUnLock(date)}
            />
          </InlineWrapper>
          <Sperate />
          <p className="description w110" style={{ marginBottom: '5px' }}>
            Logo Link: (URL must end with a supported image extension png, jpg, jpeg or gif)
          </p>
          <InlineWrapper>
            <MyInput onChange={(e) => setLogoLink(e.target.value)} value={logoLink} style={{ maxWidth: '1000px' }} />
          </InlineWrapper>
          <Sperate />
          <InlineWrapper>
            <ControlStretch isMobile={isMobile}>
              <Select defaultValue={vestId} options={options} onChange={handleVestOptionChange} />
            </ControlStretch>
          </InlineWrapper>
          <Sperate />
          <p className="description w110">Select % of your Tokens to Lock</p>
          <Slider
            min={0}
            max={100}
            value={percent}
            onChange={(value) => handleChangePercent(Math.ceil(value))}
            name="lock"
            getAriaValueText={valuetext}
            aria-label="Always visible"
            valueLabelFormat={valueLabelFormat}
            step={1}
            valueLabelDisplay="auto"
            marks={marks}
          />
          <Flex justifyContent="center" alignItems="center" className="progressButtons">
            <Button onClick={() => handleChangePercent(25)}>25%</Button>
            <Button onClick={() => handleChangePercent(50)}>50%</Button>
            <Button onClick={() => handleChangePercent(75)}>75%</Button>
            <Button onClick={() => handleChangePercent(100)}>100%</Button>
          </Flex>
          <InlineWrapper>
            <p className="description w110">Your Tokens to be Locked:</p>
            <p className="description w120">
              {(userBalance * percent) / 100}/{userBalance}
            </p>
          </InlineWrapper>
          <Sperate />
          <Button
            onClick={handleApproveClick}
            disabled={!isApprove || pendingApprove}
            mr="20px"
            style={DarkButtonStyle}
          >
            {t('Approve')}
            {pendingApprove && <AutoRenewIcon className="pendingTx" />}
          </Button>
          <Button onClick={handleSubmitClick} disabled={!isSubmit || pendingSubmit} style={{...ColorButtonStyle, background: theme.custom.gradient}}>
            {t('Submit')}
            {pendingSubmit && <AutoRenewIcon className="pendingTx" />}
          </Button>
          <Sperate />
          {/* <Text color='#E93F33'>For tokens with special transfers burns, tax or other fees make sure the DxLock address is whitelisted(excludeFromFee) before you deposit or you won&apos;t be able to withdraw!
          </Text> */}
          {/* <InlineWrapper style={{ justifyContent: 'center' }}>
            <p className="description w110">DxLock Address:</p>
            <p className="description w120">0xbB93f97fB792e9ebb81768d71a1b8998639cEA35</p>
          </InlineWrapper> */}
        </PageBody>
      </MuiPickersUtilsProvider>
    </Wrapper>
  )
}

export default ManageLocker
