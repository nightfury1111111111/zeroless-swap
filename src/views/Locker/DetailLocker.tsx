import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex, useMatchBreakpoints, Button, AutoRenewIcon, Link } from '@sphynxdex/uikit'
import { getLockerContract } from 'utils/contractHelpers'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import styled, { keyframes, useTheme } from 'styled-components'
import useToast from 'hooks/useToast'
import Spinner from 'components/Loader/Spinner'
import TimerComponent from 'components/Timer/TimerComponent'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useParams } from 'react-router'
import axios from 'axios'
import { ColorButtonStyle } from 'style/buttonStyle'
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
  padding: 5px;
  margin-top: 24px;
  text-align: center;
  font-weight: bold;
  p {
    line-height: 24px;
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

const TokenPresaleBody = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  //   background: ${({ theme }) => (theme ? '#0E0E26' : '#191C41')};
  background: ${({ theme }) => theme.custom.secondary};
  padding: 23px 28px;
  border-radius: 5px;
  margin-top: 30px;
`

const TokenPresaleContainder = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`

const CardWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 10px;
  //   background: ${({ theme }) => (theme ? '#1A1A3A' : '#2A2E60')};
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
  width: 350px;
  padding: 20px 14px;
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
  gap: 16px;
`

const TokenWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  flex: 2;
`

const TokenImg = styled.div`
  img {
    width: 64px;
    height: 64px;
    max-width: unset;
  }
`

const TokenSymbolWrapper = styled.div`
  div:first-child {
    font-weight: bold;
    font-size: 20px;
    text-transform: capitalize;
  }
  div:last-child {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    color: white;
    text-transform: capitalize;
  }
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
    font-size: 12px;
    font-weight: 600;
    word-break: break-word;
    text-align: left;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: space-between;
  }
`

const SaleInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const SaleInfoTitle = styled.div`
  color: white;
  font-weight: 600;
  font-size: 14px;
`

const SaleInfoValue = styled.div`
  color: #f2c94c;
  font-weight: 600;
  font-size: 14px;
`

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px 0px;
`

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.custom.cardWrapper};
  border-radius: 8px;
  height: 100%;
  max-height: 500px;
  overflow: auto;
  overflow-x: hidden;
  margin-top: 10px;
  & table {
    background: transparent;
    width: 100%;
    & tr {
      background: transparent;
    }
    & td {
      padding: 8px;
    }
    & thead {
      & td {
        color: white;
        font-size: 14px;
        text-align: left;
        vertical-align: middle;
        background: transparent;
        padding: 16px 8px;
        font-weight: 600;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        & > div > div {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
    & tbody {
      & tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        & h2 {
          font-size: 12px;
          line-height: 16px;
          word-break: break-word;
          font-weight: 600;
          text-align: left;
          &.success {
            // color: ${({ theme }) => (theme ? '#219653' : '#77BF3E')};
            color: ${({ theme }) => theme.custom.tableSuccess};
          }
          &.error {
            // color: ${({ theme }) => (theme ? '#EB5757' : '#F84364')};
            color: ${({ theme }) => theme.custom.tableError};
          }
        }
      }
    }
  }
`

const DetailLocker: React.FC = () => {
  const param: any = useParams()
  const { account, chainId, library } = useActiveWeb3React()
  const signer = library && library.getSigner()
  const { toastSuccess, toastError } = useToast()
  const lockContract = getLockerContract(signer, chainId)
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const [tokenInfo, setTokenInfo] = useState(null)
  const [cpkSchedules, setCpkSchedules] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [lockCount, setLockCount] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const [pendingUnlock, setPendingUnlock] = useState(false)
  const theme = useTheme()
  
  useEffect(() => {
    const fetchData = async () => {
      const availableBalance = (await lockContract.getAvailableBalance(tokenInfo.lock_id)).toString()
      if (Math.floor(new Date().getTime() / 1000) > parseInt(tokenInfo.end_time) && availableBalance === '0') {
        setIsDisabled(true)
      }
    }

    if (tokenInfo && account.toLowerCase() === tokenInfo.owner_address.toLowerCase()) {
      setIsOwner(true)
      fetchData()
    } else setIsOwner(false)
  }, [account, tokenInfo, lockContract])

  useEffect(() => {
    if (chainId && parseInt(param.chainId) !== chainId) {
      alert(`Please make sure you are on the ${NETWORK_NAMES[parseInt(param.chainId)]}!`)
    }

    const isValue = !Number.isNaN(parseInt(param.lockId))
    if (isValue && chainId) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL2}/getTokenLockInfo/${chainId}/${param.lockId}`)
        .then((response) => {
          if (response.data) {
            setTokenInfo(response.data)
            /* eslint-disable camelcase */
            const vest_num = response.data.vest_num
            const cpk_list: any = []
            if (vest_num > 0) {
              for (let i = 0; i < vest_num; i++) {
                const item = {
                  date: (
                    parseInt(response.data.start_time) +
                    ((parseInt(response.data.end_time) - parseInt(response.data.start_time)) * (i + 1)) / vest_num
                  ).toString(),
                  amount: response.data.lock_supply / vest_num,
                }
                cpk_list.push(item)
              }
              setCpkSchedules(cpk_list)
            }
          }
        })
    }
  }, [param.lockId, chainId])

  useEffect(() => {
    if (chainId && tokenInfo) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL2}/getTokenLockCount/${chainId}/${tokenInfo.lock_address}`)
        .then((response) => {
          if (response.data) {
            console.log('reap count', response.data)
            setLockCount(response.data)
          }
        })
    }
  }, [chainId, tokenInfo])

  const handleUnlockClick = async () => {
    try {
      const availableBalance = (await lockContract.getAvailableBalance(tokenInfo.lock_id)).toString()
      if (availableBalance !== '0') {
        setPendingUnlock(true)
        await lockContract.withdrawToken(tokenInfo.lock_id)
        setPendingUnlock(false)
        toastSuccess('Success', 'Unlock successfully!')
      } else if (Math.floor(new Date().getTime() / 1000) > parseInt(tokenInfo.end_time) && availableBalance === '0') {
        setIsDisabled(true)
      }
    } catch (err) {
      toastError('Failed', 'Your action is failed')
      setPendingUnlock(false)
    }
  }

  return (
    <Wrapper>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Flex alignItems="center">
            <MainLogo width="80" height="80" />
            <Flex flexDirection="column" ml="10px">
              <WelcomeText>{t('SPHYNX LOCKERS/DETAILS')}</WelcomeText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      {!tokenInfo && <Spinner />}
      {tokenInfo && (
        <TokenPresaleBody>
          <TokenPresaleContainder>
            {/* <SubCardWrapper>DYOR Area</SubCardWrapper> */}
            <MainCardWrapper>
              <Link style={{ marginBottom: '16px' }} href="/launchpad/locker">
                Back to list
              </Link>
              <CardHeader>
                <TokenWrapper>
                  <TokenImg>
                    <img src={tokenInfo.logo_link} alt="token icon" />
                  </TokenImg>
                  <TokenSymbolWrapper>
                    <Text>{tokenInfo.token_symbol}</Text>
                    <Text>{tokenInfo.token_name}</Text>
                  </TokenSymbolWrapper>
                </TokenWrapper>
              </CardHeader>
              <AddressWrapper>
                <Text color="white" bold>
                  {tokenInfo.token_type && 'LP '}Token Address:
                </Text>
                <Text>{tokenInfo.lock_address}</Text>
              </AddressWrapper>
              <Divider />
              <SaleInfo>
                <SaleInfoTitle>Lock Timer:</SaleInfoTitle>
                <SaleInfoValue>
                  <TimerComponent time={tokenInfo.end_time} />
                </SaleInfoValue>
              </SaleInfo>
              <Divider />
              <SaleInfo>
                <SaleInfoTitle>Total Supply of {tokenInfo.token_type && 'LP '}Tokens:</SaleInfoTitle>
                <SaleInfoValue>{tokenInfo.total_supply}</SaleInfoValue>
              </SaleInfo>
              <Divider />
              <SaleInfo>
                <SaleInfoTitle>Total Locked {tokenInfo.token_type && 'LP '}Tokens:</SaleInfoTitle>
                <SaleInfoValue>{tokenInfo.lock_supply}</SaleInfoValue>
              </SaleInfo>
              <Divider />
              <SaleInfo>
                <SaleInfoTitle style={{ marginRight: '5px' }}>Unlock Date:</SaleInfoTitle>
                <SaleInfoValue>{new Date(parseInt(tokenInfo.end_time) * 1000).toLocaleString()}</SaleInfoValue>
              </SaleInfo>
              <Divider />
              <SaleInfo>
                <SaleInfoTitle>Total Locks:</SaleInfoTitle>
                <SaleInfoValue>{lockCount}</SaleInfoValue>
              </SaleInfo>
              <Divider />
              {isOwner && (
                <Button disabled={isDisabled || pendingUnlock} onClick={handleUnlockClick} style={{...ColorButtonStyle, background: theme.custom.gradient}}>
                  {t('Unlock')}
                  {pendingUnlock && <AutoRenewIcon className="pendingTx" />}
                </Button>
              )}
            </MainCardWrapper>
            <SubCardWrapper>
              <Text fontSize="20px" bold>
                CPK Vesting Schedule
              </Text>
              <TableWrapper>
                <table>
                  <thead>
                    <tr>
                      <td style={{ width: '15%', textAlign: 'center' }}>{t('No')}</td>
                      <td style={{ width: '50%' }}>{t('Estimated Release Date')}</td>
                      <td style={{ width: '35%' }}>{t('Token Released')}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {cpkSchedules &&
                      cpkSchedules.map((cell, index) => {
                        return (
                          <tr key={cell.date}>
                            <td style={{ width: '15%' }}>
                              <Text fontSize="12px" color="white" style={{ textAlign: 'center' }}>
                                {index + 1}
                              </Text>
                            </td>
                            <td style={{ width: '50%' }}>
                              <Text fontSize="12px" color="white" style={{ textAlign: 'left' }}>
                                {new Date(parseInt(cell.date) * 1000).toLocaleString()}
                              </Text>
                            </td>
                            <td style={{ width: '35%' }}>
                              <Text fontSize="12px" color="white" style={{ textAlign: 'left' }}>
                                {' '}
                                {cell.amount}
                              </Text>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </TableWrapper>
            </SubCardWrapper>
          </TokenPresaleContainder>
        </TokenPresaleBody>
      )}
    </Wrapper>
  )
}

export default DetailLocker
