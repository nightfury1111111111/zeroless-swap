import React, { useEffect, useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  useMatchBreakpoints,
  Flex,
  IconButton,
  CogIcon,
  Button,
  useModal,
} from '@sphynxdex/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
// import { useSelector, useDispatch } from 'react-redux'
import ConnectWalletButton from 'components/ConnectWalletButton'
import SettingsModal from './SettingsModal'

const StyledModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #452a7a;
  opacity: 0.6;
  z-index: 999;
`
// background-color: #452a7a;
// opacity: 0.6;

const StyledModalContainer = styled(ModalContainer)`
  background-color: #191c41;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 450px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 560px;
  }
  z-index: 2000;
  opacity: 1;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  button {
    color: white;
    border-radius: 5px;
    height: 34px;
    background: ${({ theme }) => theme.custom.gradient};
    // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
    font-size: 13px;
    width: 240px;
    outline: none;
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 240px;
    }
  }
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
`

const DivWrapper = styled.div<{ isMobile?: boolean }>`
  margin: auto;
  text-align: center;
  flex-wrap: wrap;
  font-size: ${({ isMobile }) => (isMobile ? '16px' : '22px')};
  line-height: normal;
`

const InfoWrapper = styled.p`
  margin-top: 8px;
`

const BondWrapper = styled.p<{ currentTab: string }>`
  margin: 20px;
  cursor: pointer;
  padding: 5px;
  border-bottom: ${({ currentTab, theme }) => (currentTab === 'Bond' ? `solid ${theme.custom.bondModal}` : 'none')};
  color: ${({ currentTab, theme }) => (currentTab === 'Bond' ? theme.custom.bondModal : '#ffffff ')};
`

const RedeemWrapper = styled.p<{ currentTab: string }>`
  margin: 20px;
  cursor: pointer;
  color: ${({ currentTab, theme }) => (currentTab === 'Redeem' ? theme.custom.bondModal : '#ffffff')};
  padding: 5px;
  border-bottom: ${({ currentTab, theme }) => (currentTab === 'Redeem' ? `solid ${theme.custom.bondModal}` : 'none')}; 
`

const FlexWrapper = styled.div<{ isMobile?: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: white;
  text-align: center; 
  flex-wrap: wrap;
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '15px')};
`

const TabWrapper = styled.div<{ isMobile?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: ${({ isMobile }) => (isMobile ? '16px' : '18px')};
  // width: ${({ isMobile }) => (isMobile ? '80%' : '30%')};
  margin: auto;
  font-weight: 500;
  text-align: center;
  flex-wrap: wrap;
`

const Sperate = styled.div`
  margin-top: 32px;
`

const Title = styled.p`
  text-align: center;
  color: #ffffff;
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
`

const sphynx = 'SPHYNX'

interface Props {
  currentTokenName?: string | null
  onDismiss?: React.Dispatch<React.SetStateAction<boolean>>
}

/* ======================tempdata======================== */
const tempData = {
  bondPrice: null,
  marketPrice: 368.61,
  balance: 0.0,
  willGet: 0.0,
  maxVal: 206.9123,
  roi: null,
  debtRadio: 0.0,
  vestingTerm: null,
}

export default function BondModal({
  onDismiss,

  currentTokenName,
}: Props) {
  const [currentTab, setCurrentTab] = useState('Bond')
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  const handleSettingsModal = useCallback(() => {
    onPresentSettingsModal()
  }, [onPresentSettingsModal])

  const changeTab = (tabName) => {
    setCurrentTab(tabName)
  }

  const handleCloseModal = () => {
    onDismiss(false)
  }

  return (
    <StyledModalBackground onClick={handleCloseModal}>
      <ModalBackground />
      <StyledModalContainer
        minWidth="320px"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <ModalHeader>
          <ModalTitle>
            {/* <img src={`images/net/${currentTokenName}.png`} width="24" height="24" alt="icon" /> */}
            <Title>{currentTokenName}</Title>
          </ModalTitle>
          <Flex>
            <IconButton onClick={handleSettingsModal} variant="text" scale="sm" aria-label="setting modal">
              <CogIcon height={22} width={22} color="#C42BB4" />
            </IconButton>
          </Flex>
          <ModalCloseButton onDismiss={handleCloseModal} />
        </ModalHeader>
        <StyledModalBody>
          <FlexWrapper>
            <DivWrapper isMobile={isMobile}>
              Bond Price
              <br />
              {tempData.bondPrice ? `${tempData.bondPrice} $` : '--'}
            </DivWrapper>
            <DivWrapper isMobile={isMobile}>
              Market Price
              <br />
              {tempData.marketPrice ? `${tempData.marketPrice} $` : '--'}
            </DivWrapper>
          </FlexWrapper>
          <Sperate />
          <TabWrapper isMobile={isMobile}>
            <BondWrapper currentTab={currentTab} onClick={() => changeTab('Bond')}>
              Bond
            </BondWrapper>
            <RedeemWrapper currentTab={currentTab} onClick={() => changeTab('Redeem')}>
              {' '}
              Redeem
            </RedeemWrapper>
          </TabWrapper>
          <Sperate />

          {currentTab === 'Bond' ? (
            <>
              <DivWrapper>
                {account ?
                  <ButtonWrapper>
                    <Button>Approve</Button>
                  </ButtonWrapper>
                  : <ConnectWalletButton />
                }
              </DivWrapper>
              <Sperate />
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>Your Balance</InfoWrapper>
                <InfoWrapper>
                  {tempData.balance ? tempData.balance : 0} {currentTokenName}
                </InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>You Will Get</InfoWrapper>
                <InfoWrapper>
                  {tempData.willGet ? tempData.willGet : 0} {sphynx}
                </InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>Max You Can Buy</InfoWrapper>
                <InfoWrapper>
                  {tempData.maxVal ? tempData.maxVal : 0} {sphynx}
                </InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>ROI</InfoWrapper>
                <InfoWrapper>{tempData.roi ? tempData.roi : '--'}</InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>Debt Ratio</InfoWrapper>
                <InfoWrapper>{tempData.debtRadio ? tempData.debtRadio : 0} %</InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>Vesting Term</InfoWrapper>
                <InfoWrapper>{tempData.vestingTerm ? tempData.vestingTerm : '--'}</InfoWrapper>
              </FlexWrapper>
            </>
          ) : (
            <>
              <DivWrapper>
                {account ? (
                  <>
                    <ButtonWrapper>
                      <Button>Claim</Button>
                    </ButtonWrapper>
                    <Sperate />
                    <ButtonWrapper>
                      <Button>Claim and Autostake</Button>
                    </ButtonWrapper>
                  </>
                ) : (
                  <ConnectWalletButton />
                )}
              </DivWrapper>
              <Sperate />
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>Pending Rewards</InfoWrapper>
                <InfoWrapper>
                  {tempData.balance ? tempData.balance : 0} {currentTokenName}
                </InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>Claimable Rewards</InfoWrapper>
                <InfoWrapper>
                  {tempData.willGet ? tempData.willGet : 0} {sphynx}
                </InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>Time until fully vested</InfoWrapper>
                <InfoWrapper>
                  {tempData.maxVal ? tempData.maxVal : 0} {sphynx}
                </InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>ROI</InfoWrapper>
                <InfoWrapper>{tempData.roi ? tempData.roi : '--'}</InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>Debt Ratio</InfoWrapper>
                <InfoWrapper>{tempData.debtRadio ? tempData.debtRadio : 0} %</InfoWrapper>
              </FlexWrapper>
              <FlexWrapper isMobile={isMobile}>
                <InfoWrapper>Vesting Term</InfoWrapper>
                <InfoWrapper>{tempData.vestingTerm ? tempData.vestingTerm : '--'}</InfoWrapper>
              </FlexWrapper>
            </>
          )}
        </StyledModalBody>
      </StyledModalContainer>
    </StyledModalBackground>
  )
}
