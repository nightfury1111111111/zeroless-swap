import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { Button, Text, Flex, Box, useMatchBreakpoints, Link as UILink } from '@sphynxdex/uikit'
import axios from 'axios'
import { getBNBPrice, getETHPrice } from 'utils/priceProvider'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import MainLogo from 'assets/images/Logo.jpg'
import { ReactComponent as BinanceIcon1 } from 'assets/svg/icon/BinanceIcon1.svg'
import { ReactComponent as BinanceIcon2 } from 'assets/svg/icon/BinanceIcon2.svg'
import EthereumIcon from 'assets/png/icon/ethereumIcon.png'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterFullIcon.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramFullIcon.svg'
import { ReactComponent as DocumentIcon } from 'assets/svg/icon/DocumentIcon1.svg'
import { ReactComponent as ReferralIcon } from 'assets/svg/icon/ReferralIcon.svg'
import { ReactComponent as DiscordIcon } from 'assets/svg/icon/DiscordFullIcon.svg'
import TokenIcon from 'assets/images/ZerolessToken.png'
import TVIcon from 'assets/images/sphynxTV.png'
import NFTIcon from 'assets/images/sphynxNFT.png'
import LaunchPadIcon from 'assets/images/launchIcon.png'
import { ReactComponent as NounRaiseIcon } from 'assets/svg/icon/NounRaiseIcon.svg'
import { ReactComponent as NounProjectIcon } from 'assets/svg/icon/NounProjectIcon.svg'
import { ReactComponent as NounUserIcon } from 'assets/svg/icon/NounUserIcon.svg'
import { ReactComponent as NounLockIcon } from 'assets/svg/icon/NounLockIcon.svg'
import styled, { useTheme } from 'styled-components'
import CommunityCard from 'components/CommunityCard'
import ValueCard from 'components/ValueCard'
import ImgCard from 'components/ImgCard'
import { isUndefined } from 'lodash'
import { numberWithCommas } from 'utils'

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

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  flex-wrap: wrap;
`

const FlexWrapperCenter = styled.div`
  flex-flow: column;
  display: flex;
  justify-content: center;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-flow: row;
  }
`

const FlexIconWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  text-align: center;
  flex-wrap: wrap;
  margin-top: 30px;
  padding: 0 30px;
`

const LogoTitle = styled(Text)`
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 18px;
    text-align: left;
  }
`

const SubTitle = styled(Text)`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #ffffff;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 26px;
  }
`

const Sperate = styled.div`
  margin-top: 32px;
`

const Title = styled.p`
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.custom.tabBorder};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: ${({ theme }) => theme.custom.gradient};
  outline: none;
  color: white;
  width: 156px;
`

const PresaleBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0px;
  background: ${({ theme }) => theme.custom.tertiary};
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  border: 1px solid ${({ theme }) => theme.custom.coloredBorder};
  box-sizing: border-box;
  border-radius: 5px;
  padding: 1.5em;
  margin-top: 25px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }
`

const PresaleLogoFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }
`

const PresaleTextFlex = styled(Flex)`
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 0 0 15px 0;
  ${({ theme }) => theme.mediaQueries.xl} {
    align-items: start;
    margin: 0 0 0 15px;
  }
`

const BorderFlex = styled(Flex)`
  height: 40px;
  opacity: 0.1;
  border-right: 1px solid #ffffff;
`

const BinanceCard = styled(Flex)`
  width: 100%;
  background: ${({ theme }) => theme.custom.tertiary};
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  border-radius: 5px;
  flex-flow: column;
  align-items: center;
  justify-content: flex-start;
  padding: 30px 0px;
  position: relative;
  margin: 10px 0;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 48%;
  }
`

const WaterMarkFlex = styled(Flex)`
  position: absolute;
  bottom: 20px;
  right: 20px;
`

const BottomFlex = styled.div`
  width: 100%;
  margin-top: 35px;
  padding: 20px;
  background: ${({ theme }) => theme.custom.tertiary};
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  border-radius: 5px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 60px;
  }
`

const StyledGap = styled.div`
  width: 50px;
`

const NetworkCard = ({ networkName, children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      {children}
      <Sperate />
      <Text fontSize="24px" bold>
        {networkName}
      </Text>
    </div>
  )
}

const Launchpad: React.FC = () => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [liquidity, setLiquidity] = useState('')
  const [project, setProject] = useState(0)
  const [locked, setLocked] = useState('')
  const [contribute, setContribute] = useState(0)
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      if (!Number.isNaN(chainId) && !isUndefined(chainId)) {
        const nativePrice = chainId === ChainId.ETHEREUM ? await getETHPrice() : await getBNBPrice()
        axios.get(`${process.env.REACT_APP_BACKEND_API_URL2}/getLaunchPadInfo/${chainId}`).then((response) => {
          console.log('response', response)
          const data = response.data
          setLiquidity(Number(data.liquidity * nativePrice).toFixed(3))
          setProject(data.project)
          setContribute(data.contribute)
          setLocked(Number(data.lock * nativePrice).toFixed(3))
        })
      }
    }
    fetchData()
  }, [chainId])

  return (
    <Wrapper>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Flex alignItems="center">
            <img src={MainLogo} alt="MainLogo" width="80px" height="80px" />
            <Flex flexDirection="column" ml="10px">
              <WelcomeText>{t('Zeroless PAD')}</WelcomeText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <PresaleBox>
        <PresaleLogoFlex>
          <BinanceIcon1 width="40" height="40" />
          <img src={EthereumIcon} alt="ether icon" width="40" style={{ margin: '4px' }} />
          <PresaleTextFlex>
            <LogoTitle>Binance Chain & Ethereum Decentralized</LogoTitle>
            <LogoTitle>Protocols & Services</LogoTitle>
          </PresaleTextFlex>
        </PresaleLogoFlex>
        {/* {!isMobile&&<BorderFlex /> } */}
        <Flex flexDirection="column" alignItems="start" justifyContent="center">
          {isMobile ? (
            <Text fontSize="14px" color="white" bold textAlign="center">
              Zeroless helps everyone to create their own tokens and token sales in few seconds. Tokens created on
              Zeroless will be verified and published on explorer websites.
            </Text>
          ) : (
            <>
              <Text fontSize="15px" color="white" bold>
                Zeroless helps everyone to create their own tokens and token sales in few seconds. <br /> Tokens created
                on Zeroless will be verified and published on explorer websites.
              </Text>
            </>
          )}
        </Flex>
        <Flex mt={isMobile ? '10px' : '0px'}>
          <Link to="/launchpad/presale">
            <ColorButton>{t('Create Presale')}</ColorButton>
          </Link>
        </Flex>
      </PresaleBox>
      <FlexWrapper style={{ marginTop: '32px' }}>
        <ValueCard
          value={`$ ${numberWithCommas(parseFloat(liquidity))}`}
          desc="Total Liquidity Raised"
          color={theme.custom.gradient}
        >
          <NounRaiseIcon />
        </ValueCard>
        <ValueCard value={`${project}`} desc="Projects">
          <NounProjectIcon />
        </ValueCard>
        <ValueCard value={`${contribute ?? '0'}`} desc="Participants">
          <NounUserIcon />
        </ValueCard>
        <ValueCard value={`$ ${locked ? numberWithCommas(parseFloat(liquidity)) : '0'}`} desc="Total Liquidity Locked">
          <NounLockIcon />
        </ValueCard>
      </FlexWrapper>
      <FlexWrapper style={{ marginTop: '32px' }}>
        <BinanceCard>
          <Title>BLOCKCHAINS</Title>
          <SubTitle>Supported BlockChain</SubTitle>
          <Sperate />
          <div style={{ flexDirection: 'row', display: 'flex', gap: '20px' }}>
            <NetworkCard networkName="Binance">
              <BinanceIcon1 width="130" />
            </NetworkCard>
            <NetworkCard networkName="Ethereum">
              <img src={EthereumIcon} alt="ether icon" width="130" style={{ margin: 'auto 0' }} />
            </NetworkCard>
          </div>
          {/* <WaterMarkFlex>
            {chainId === 56
              ?
              <BinanceIcon2 width="150" />
              :
              <EthereumIcon width="150" />
            }
          </WaterMarkFlex> */}
        </BinanceCard>
        <BinanceCard>
          <Title>ECOSYSTEM</Title>
          <SubTitle>A New Revolutionary</SubTitle>
          <SubTitle>Ecosystem</SubTitle>
          <FlexIconWrapper>
            <ImgCard desc="Zeroless Swap">
              <img src={MainLogo} alt="swap icon" width="130" height="130" />
            </ImgCard>
            <ImgCard desc="Zeroless Token">
              <img src={TokenIcon} alt="token icon" width="130" height="130" />
            </ImgCard>
            <ImgCard desc="Zeroless TV">
              <img src={TVIcon} alt="TV icon" width="130" height="130" />
            </ImgCard>
            {/* <ImgCard desc="Sphynx Wallet">
              <img src={MainLogo1} alt="swap icon" width="130" height="130" />
            </ImgCard>
            <ImgCard desc="Sphynx Sale">
              <img src={MainLogo1} alt="swap icon" width="130" height="130" />
            </ImgCard> */}
            <ImgCard desc="Zeroless NFTs">
              <img src={NFTIcon} alt="NFT icon" width="130" height="130" />
            </ImgCard>
          </FlexIconWrapper>
        </BinanceCard>
      </FlexWrapper>
      {/* <BottomFlex>
        <Title>Community</Title>
        <SubTitle>BE PART OF AN ACTIVE COMMUNITY</SubTitle>
        <Sperate />
        <FlexWrapperCenter>
          <CommunityCard desc="Join us on Telegram">
            <UILink target="_blank" href="https://t.me/sphynxswapsupport">
              <TelegramIcon />
            </UILink>
          </CommunityCard>
          {!isMobile && <StyledGap />}
          <CommunityCard desc="Read our Document">
            <UILink target="_blank" href="/Sphynx Swap Launchpad v0.2.pdf">
              <DocumentIcon />
            </UILink>
          </CommunityCard>
          {!isMobile && <StyledGap />}
          <CommunityCard desc="Launchpad Project submission">
            <UILink target="_blank" href="https://forms.monday.com/forms/49174b245c38f1eb9045c81230d11f68?r=use1">
              <img src={LaunchPadIcon} alt="launchpad icon" width="40px" height="40px" />
            </UILink>
          </CommunityCard>
          {!isMobile && <StyledGap />}
          <CommunityCard desc="Launchpad Referral Form">
            <UILink target="_blank" href="https://forms.monday.com/forms/49174b245c38f1eb9045c81230d11f68?r=use1">
              <ReferralIcon />
            </UILink>
          </CommunityCard>
        </FlexWrapperCenter>
      </BottomFlex> */}
    </Wrapper>
  )
}

export default Launchpad
