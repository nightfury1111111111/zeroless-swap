import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Button, Text, Flex, Link } from '@sphynxdex/uikit'
import { ChainId } from '@sphynxdex/sdk-multichain'
import NETWORK_NAMES from 'config/constants/networknames'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import axios from 'axios'
import { useTranslation } from 'contexts/Localization'
import { useMenuToggle } from 'state/application/hooks'
import { getFairLaunchContract } from 'utils/contractHelpers'
import { ReactComponent as MainLogo } from 'assets/svg/icon/WarningIcon.svg'
import { ReactComponent as WarningIcon2 } from 'assets/svg/icon/WarningIcon2.svg'
import { ReactComponent as SettingIcon } from 'assets/svg/icon/SettingIcon.svg'
import { ReactComponent as LightIcon } from 'assets/svg/icon/LightIcon.svg'
import LikeIcon from 'assets/images/LikeIcon.png'
import DislikeIcon from 'assets/images/DislikeIcon.png'
import HillariousIcon from 'assets/images/HillariousIcon.png'
import WarningIcon from 'assets/images/WarningIcon.png'
import { getPresaleAddress } from 'utils/addressHelpers'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  padding: 5px;
  margin-top: 24px;
  text-align: center;
  p {
    line-height: 24px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
  }
`

const PageHeader = styled.div`
  width: 100%;
`

const HeaderTitleText = styled(Text)`
  color: white;
  font-weight: 600;
  line-height: 1.5;
  font-size: 14px;
  text-align: left;
  padding: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 30px;
  }
`

const WarningTitleText = styled(HeaderTitleText)`
  font-size: 15px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
`

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  flex-wrap: wrap;
`

const TokenPresaleContainder = styled.div<{ toggled: boolean }>`
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
  background: ${({ theme }) => (theme ? '#1A1A3A' : '#2A2E60')};
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
  width: 300px;
  padding: 30px;
`

const DefiFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
  background: #e93f33;
  border: 1px solid ${({ theme }) => theme.custom.coloredBorder};
  border-radius: 5px;
  padding: 17px;
  margin-bottom: 10px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 57%;
    margin-bottom: 0px;
  }
`

const SoftFlex = styled(Flex)`
  width: 49%;
  flex-direction: column;
  background: #e97f33;
  border: 1px solid ${({ theme }) => theme.custom.coloredBorder};
  border-radius: 5px;
  padding: 17px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 19%;
  }
`

const LiquidityFlex = styled(Flex)`
  width: 49%;
  flex-direction: column;
  background: #ffb800;
  border: 1px solid ${({ theme }) => theme.custom.coloredBorder};
  border-radius: 5px;
  padding: 17px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 19%;
  }
`

const WarningTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: white;
  padding-bottom: 4px;
  text-align: left;
  font-weight: 600;
`

const WarningSubTitle = styled(Text)`
  font-size: 12px;
  text-align: left;
  font-weight: 500;
`

const Separate = styled.div`
  margin-top: 30px;
`

const TokenContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 16px;
`

const TokenSymbol = styled.div`
  font-weight: 600;
  font-size: 22px;
  text-align: left;
`

const TokenName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: white;
`

const TokenSymbolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TokenAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 30px;
`

const AddressFlex = styled(Flex)`
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid #31314e;
  justify-content: space-between;
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

const AddressSendError = styled.div`
  margin-top: -8px;
  font-style: italic;
  font-weight: normal;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.15em;
  color: #e93f33;
  text-align: left;
`

const CustomContract = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  div:last-child {
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    color: white;
  }
`

const WhitelistTitle = styled(Text)`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
`

const ContributeWrapper = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
  // border: 1px solid ${({ theme }) => (theme ? '#5E2B60' : '#4A5187')};
  border-radius: 5px;
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
  width: 98px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 156px;
  }
`

const DataItem = styled.div`
  display: flex;
  justify-content: center;
  div:first-child {
    flex: 1;
    align-items: center;
    display: flex;
    padding: 5px 0 5px 5px;
    ${({ theme }) => theme.mediaQueries.sm} {
      padding: 5px 20px;
    }
    text-align: start;
    font-size: 12px;
    color: white;
    font-style: normal;
    font-weight: 600;
    border-bottom: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
    border-right: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
  }
  div:last-child {
    flex: 1;
    align-items: center;
    display: flex;
    padding: 5px 20px;
    text-align: start;
    font-size: 12px;
    color: #f2c94c;
    font-style: normal;
    font-weight: 600;
    border-bottom: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
  }
`

const DataLatestItem = styled(DataItem)`
  div:first-child {
    border-bottom: 0px;
  }
  div:last-child {
    border-bottom: 0px;
  }
`

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`

const ThinkItem = styled.div`
  border: 1px solid ${({ theme }) => theme.custom.contributeWrapper};
  box-sizing: border-box;
  border-radius: 11px;
  display: flex;
  height: fit-content;
  padding: 10px;
  flex-direction: column;
  width: 40%;
  align-items: center;
  margin: 9px 9px;
  img {
    width: 25px;
    height: 25px;
  }
  div {
    margin-top: 5px;
    font-weight: 500;
    font-size: 12px;
    color: white;
  }
`

const TokenPresaleBody = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#191C41')};
  background: ${({ theme }) => theme.custom.secondary};
  padding: 23px 28px;
  border-radius: 5px;
  margin-top: 30px;
`

const ThinkCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LaunchNotifyText = styled(Text)`
  text-align: left;
`

const FairLaunchLive: React.FC = () => {
  const { t } = useTranslation()
  const param: any = useParams()
  const { chainId, library } = useActiveWeb3React()
  const signer = library.getSigner()
  const { menuToggled } = useMenuToggle()
  const [statusDescription, setStatusDescription] = useState('')
  const [isLaunched, setIsLaunched] = useState(false)
  const fairLaunchContract = useMemo(() => getFairLaunchContract(signer, chainId), [signer])
  const history = useHistory()
  const nativeCurrency = chainId === ChainId.ETHEREUM ? 'ETH' : 'BNB'

  const [fairLaunchData, setFairLaunchData] = useState({
    logo_link: '',
    token_name: '',
    token_symbol: '',
    token_address: '',
    launch_id: '',
    total_supply: 0,
    token_amount: 0,
    native_amount: 0,
    listing_rate: 0,
    launch_time: '',
    lock_time: '',
  })

  const handleClickTrade = () => {
    history.push(`/swap/${fairLaunchData.token_address}`)
  }

  useEffect(() => {
    if (chainId && parseInt(param.chainId) !== chainId) {
      alert(`Please make sure you are on the ${NETWORK_NAMES[parseInt(param.chainId)]}!`)
    }

    (async function fetchData() {
      const RetrieverDataProcess = async () => {
        const launchId = param.launchId
        axios
          .get(`${process.env.REACT_APP_BACKEND_API_URL2}/getFairLaunchInfo/${launchId}/${chainId}`)
          .then((response) => {
            const data = response.data
            if (data) {
              setFairLaunchData({
                ...fairLaunchData,
                logo_link: data.logo_link,
                token_name: data.token_name,
                token_symbol: data.token_symbol,
                token_address: data.token_address,
                launch_id: data.launch_id,
                total_supply: data.total_supply,
                token_amount: data.token_amount,
                native_amount: data.native_amount,
                listing_rate: data.token_amount / data.native_amount,
                launch_time: data.launch_time,
                lock_time: data.lock_time,
              })
              fairLaunchContract.isLaunched(parseInt(param.launchId)).then((res) => {
                setIsLaunched(res)
              })
            }
          })
      }
      await RetrieverDataProcess()
    })()
  }, [param, chainId])

  useEffect(() => {
    const fetchData = async () => {
      const now = Math.floor(new Date().getTime() / 1000)
      if (parseInt(fairLaunchData.launch_time) > now) {
        setStatusDescription('FairLaunch is upcoming!')
      } else if (isLaunched) {
        setStatusDescription('FairLaunch has already launched! Use the links below to trade the token.')
      } else if (parseInt(fairLaunchData.launch_time) <= now && now <= parseInt(fairLaunchData.launch_time) + 600) {
        setStatusDescription('FairLaunch is active!')
      } else {
        setStatusDescription('FairLaunch is failed!')
      }
    }
    fetchData()
  }, [isLaunched, fairLaunchData])

  return (
    <Wrapper>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Flex alignItems="center">
            <MainLogo width="40" height="40" />
            <Flex flexDirection="column" ml="10px">
              <HeaderTitleText>{t('SphynxSale Automated Warning System')}</HeaderTitleText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row" mt="30px">
          <Flex alignItems="center">
            <WarningIcon2 width="40" height="40" />
            <Flex flexDirection="column" ml="10px">
              <WarningTitleText>{t('1 Warnings Detected')}</WarningTitleText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <FlexWrapper style={{ marginTop: '32px' }}>
        <DefiFlex>
          <WarningTitle>Token Dump Warning</WarningTitle>
          <WarningSubTitle style={{ fontSize: '14px', opacity: '0.9' }}>
            Too many tokens are held outside this sale. Make sure these tokens are burned, locked or the owner has a
            valid reason to hold them. Tokens held by teams can be sold to pull out liquidity and should be carefully
            examined.
          </WarningSubTitle>
        </DefiFlex>
      </FlexWrapper>
      <TokenPresaleBody>
        <TokenPresaleContainder toggled={menuToggled}>
          <MainCardWrapper>
            <Link style={{ marginBottom: '16px' }} href="/launchpad/fair/listing">
              Back to list
            </Link>
            <TokenContainer>
              <img src={fairLaunchData && fairLaunchData.logo_link} width="64px" height="64px" alt="token icon" />
              <TokenSymbolWrapper>
                <TokenSymbol>{fairLaunchData && fairLaunchData.token_symbol}</TokenSymbol>
                <TokenName>{fairLaunchData && fairLaunchData.token_name}</TokenName>
              </TokenSymbolWrapper>
            </TokenContainer>
            <TokenAddressContainer>
              <AddressFlex>
                <AddressWrapper>
                  <Text color="white" bold>
                    Token Address:
                  </Text>
                  <Text>{fairLaunchData.token_address}</Text>
                </AddressWrapper>
              </AddressFlex>
              <AddressSendError>Do not send {nativeCurrency} to the token address!</AddressSendError>
              <CustomContract>
                <SettingIcon />
                <Text>Custom Contract</Text>
              </CustomContract>
            </TokenAddressContainer>
            <Separate />
            <LaunchNotifyText bold>{statusDescription}</LaunchNotifyText>
            <Separate />
            {isLaunched && (
              <ColorButton style={{ width: '100%' }} onClick={handleClickTrade}>
                Trade
              </ColorButton>
            )}
            <Separate />
            <ContributeWrapper>
              <DataItem>
                <Text>Sale ID</Text>
                <Text>{fairLaunchData.launch_id}</Text>
              </DataItem>
              <DataItem>
                <Text>Total Supply</Text>
                <Text>{`${fairLaunchData.total_supply} ${fairLaunchData.token_name}`}</Text>
              </DataItem>
              <DataItem>
                <Text>Tokens For Launch</Text>
                <Text>{`${fairLaunchData.token_amount} ${fairLaunchData.token_name}`}</Text>
              </DataItem>
              <DataItem>
                <Text>Initial Liquidity</Text>
                <Text>
                  {fairLaunchData.native_amount} {nativeCurrency}
                </Text>
              </DataItem>
              <DataItem>
                <Text>Listing Rate</Text>
                <Text>
                  {fairLaunchData.token_amount / fairLaunchData.native_amount} {fairLaunchData.token_symbol}/
                  {nativeCurrency}
                </Text>
              </DataItem>
              <DataItem>
                <Text>Launch Time</Text>
                <Text>{`${new Date(fairLaunchData && Number(fairLaunchData.launch_time) * 1000).toString()}`}</Text>
              </DataItem>
              <DataLatestItem>
                <Text>Liquidity Unlock Date</Text>
                <Text>{`${new Date(fairLaunchData && Number(fairLaunchData.lock_time) * 1000).toString()}`}</Text>
              </DataLatestItem>
            </ContributeWrapper>
          </MainCardWrapper>
          {/* <SubCardWrapper>
            <ThinkCardWrapper>
              <LightIcon />
              <WhitelistTitle>What do you think?</WhitelistTitle>
              <ItemContainer>
                <ItemWrapper>
                  <ThinkItem>
                    <img src={LikeIcon} alt="think icon" />
                    <Text>Like</Text>
                  </ThinkItem>
                  <ThinkItem>
                    <img src={HillariousIcon} alt="think icon" />
                    <Text>Hillarious</Text>
                  </ThinkItem>
                </ItemWrapper>
                <ItemWrapper>
                  <ThinkItem>
                    <img src={DislikeIcon} alt="think icon" />
                    <Text>Dislike</Text>
                  </ThinkItem>
                  <ThinkItem>
                    <img src={WarningIcon} alt="think icon" />
                    <Text>Scam</Text>
                  </ThinkItem>
                </ItemWrapper>
              </ItemContainer>
              <Separate />
              <ColorButton style={{ width: '95%' }}>Join Community</ColorButton>
            </ThinkCardWrapper>
          </SubCardWrapper> */}
        </TokenPresaleContainder>
      </TokenPresaleBody>
    </Wrapper>
  )
}

export default FairLaunchLive
