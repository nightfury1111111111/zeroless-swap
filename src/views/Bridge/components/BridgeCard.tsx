import React from 'react'
import styled, { css, useTheme } from 'styled-components'
import { Button, Flex, Text, useModal } from '@sphynxdex/uikit'
import { ReactComponent as ArrowRightIcon } from 'assets/svg/icon/ArrowRightBridge.svg'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import BridgeOtherToken from 'assets/svg/icon/BridgeOtherToken.svg'
import { Field } from '../../../state/bridge/actions'
import Tokencard from './TokenCard'
import CurrencyInputPanel from '../../../components/CurrencyInputPanel'
import { useBridge } from '../../../hooks/useBridge'
import BridgeConfirmModal from './BridgeConfirmModal'

const Container = styled.div`
  color: white;
  background: rgba(0, 0, 0, 0.4);
  width: 290px;
  margin: 0px 0px 20px;
  height: fit-content;
  border-radius: 16px;
  padding: 0px 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 372px;
    margin: 0px 60px 20px;
  }
`
const CardHeader = styled.div`
  text-align: center;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 19px;

  margin: 8px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  margin-bottom: 12px;
`
const AmountContainer = styled.div`
  margin-top: 12px;
  padding-right: 10px;
  position: relative;
  height: 84px;
  // border-bottom: 1px solid ${({ theme }) => (theme ? '#21214A' : '#4A5187')};
  border-bottom: 1px solid ${({ theme }) => theme.custom.inputPanelBorder};
`
const BottomLabel = styled.div`
  position: absolute;
  bottom: 7px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: white;
`

const MinMaxContainger = styled.div<{ isMin: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: white;
  // border-bottom: 1px solid ${({ theme }) => (theme ? '#21214A' : '#4A5187')};
  border-bottom: 1px solid ${({ theme }) => theme.custom.inputPanelBorder};
`

const ErrorArea = styled.div`
  font-weight: 400;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: white;
  text-align: -webkit-center;
`

const ArrowWrapper = styled.div<{ clickable: boolean }>`
  border-radius: 12px;
  padding: 2px;
  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
            padding: 3px;
          }
        `
      : null}
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.custom.divider};;
  height: 1px;
  margin: 24px 0px 10px;
  width: 100%;
`

export default function BridgeCard({ label, isSphynx = false }) {
  const {
    account,
    chainId,
    approved,
    formattedAmounts,
    networkToName,
    currency,
    sphynxCurrency,
    maxAmount,
    minAmount,
    networkFromName,
    onFieldSpxInput,
    onFieldOthInput,
    onPresentConnectModal,
    handleToChange,
    handleFromChange,
    handleSwitch,
    handleApprove,
    handleCurrencyASelect,
    onClickNext,
    handleMax,
    bscGasPrice,
    isNextClickable,
  } = useBridge(isSphynx);

  const theme = useTheme();
  const [onPresentSettingsModal] = useModal(<BridgeConfirmModal isSphynx />);

  React.useEffect(() => {

    if (isNextClickable) {
      onPresentSettingsModal();
    }
  }, [bscGasPrice, isNextClickable]);

  const onNextClicked = () => {
    if (!isSphynx) {
      return;
    }
    if (!account) {
      onPresentConnectModal()
    } else {
      onClickNext();
    }
  }

  return (
    <Container>
      <Flex justifyContent='center' pt="22px">
        <img width="60px" height="57px" src={isSphynx ? MainLogo : BridgeOtherToken} alt="Logo" />
      </Flex>
      <CardHeader>{label}</CardHeader>
      <Divider />
      <Flex justifyContent="space-between" mt="20px">
        <Tokencard isFrom networkName={networkFromName} chainId={chainId} handleChange={handleFromChange} />
        <Flex pt="6px" height="fit-content">
          <ArrowWrapper clickable onClick={handleSwitch}>
            <ArrowRightIcon style={{ alignSelf: 'center' }} />
          </ArrowWrapper>
        </Flex>
        <Tokencard isFrom={false} networkName={networkToName} chainId={chainId} handleChange={handleToChange} />
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mt="30px" mr="10px">
        <Flex alignItems="center">
          <img width="35px" height="31px" src={isSphynx ? MainLogo : BridgeOtherToken} alt="Logo" />
          <Text fontSize="14px" fontWeight="600" color="white"> {isSphynx ? 'Sphynx' : 'Token'} to Bridge</Text>
        </Flex>
        <Button
          variant="tertiary"
          style={{
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '12px',
            lineHeight: '14px',
            backgroundColor: '#1A1A3A',
            width: '73px',
            height: '30px',
            color: 'white',
            borderRadius: '4px',
          }}
          onClick={handleMax}
        >
          Max
        </Button>
      </Flex>
      <AmountContainer>
        <CurrencyInputPanel
          value={isSphynx ? formattedAmounts[Field.BRIDGE_TOKENSPX] : formattedAmounts[Field.BRIDGE_TOKENOTH]}
          onUserInput={isSphynx ? onFieldSpxInput : onFieldOthInput}
          onMax={null}
          onCurrencySelect={handleCurrencyASelect}
          showMaxButton={false}
          currency={isSphynx ? sphynxCurrency : currency}
          id="bridge-asset-token"
          disableCurrencySelect={isSphynx}
          isBridge
        />
        <BottomLabel>
          Balance on {isSphynx ? 'Sphynx' : currency !== undefined && currency !== null ? currency.symbol : 'Token'}
        </BottomLabel>
      </AmountContainer>
      <MinMaxContainger isMin={false}>
        <div>Max Bridge Amount</div>
        <Text fontSize="14px" color="#F2C94C" fontWeight="600">
          {maxAmount} {isSphynx ? 'SPX' : currency !== undefined && currency !== null ? currency.symbol : 'Token'}
        </Text>
      </MinMaxContainger>
      <MinMaxContainger isMin>
        <div>Min Bridge Amount</div>
        <Text fontSize="14px" color="#F2C94C" fontWeight="600">
          {minAmount} {isSphynx ? 'SPX' : currency !== undefined && currency !== null ? currency.symbol : 'Token'}
        </Text>
      </MinMaxContainger>
      <ErrorArea>
        {!account ? (
          <>
            <Text fontSize="14px" color="white" style={{ textAlign: 'center', margin: '24px 0px' }}>
              Please connect your wallet to the chain you wish to bridge from!
            </Text>
            <Flex style={{ columnGap: '10px' }} mb="34px" mx="-8px">
              <Button
                variant="tertiary"
                style={{
                  fontStyle: 'normal',
                  fontSize: '12px',
                  lineHeight: '14px',
                  background: theme.custom.gradient,
                  height: '34px',
                  color: 'white',
                  width: '166px',
                  borderRadius: '8px',
                }}
                onClick={handleSwitch}
              >
                Click Here to Switch
              </Button>
              <Button
                variant="tertiary"
                height="40px"
                style={{
                  background: theme.custom.gradient,
                  fontSize: '13px',
                  color: 'white',
                  borderRadius: '8px',
                  height: '34px',
                  width: '166px',
                }}
                onClick={onNextClicked}
              >
                {!account ? 'Connect Wallet' : 'Next'}
              </Button>
            </Flex>
          </>
        ) : (
          <Flex my="34px" mx="-8px" style={{ columnGap: '10px' }}>
            <Button
              variant="tertiary"
              height="40px"
              style={{
                background: !approved ? theme.custom.gradient : 'grey',
                fontSize: '13px',
                color: 'white',
                borderRadius: '8px',
                height: '34px',
                width: '166px',
              }}
              onClick={!account ? onPresentConnectModal : !approved ? handleApprove : null}
              disabled
            >
              {approved ? 'Approved' : 'Approve'}
            </Button>
            <Button
              variant="tertiary"
              height="40px"
              style={{
                background: theme.custom.gradient,
                fontSize: '13px',
                color: 'white',
                borderRadius: '8px',
                height: '34px',
                width: '166px',
              }}
              onClick={onNextClicked}
              disabled
            >
              Next
            </Button>
          </Flex>
        )}
      </ErrorArea>
    </Container>
  )
}
