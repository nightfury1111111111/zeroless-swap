/* eslint-disable */

import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Modal, InjectedModalProps, Button, Input } from '@sphynxdex/uikit'
import {ChainId } from '@sphynxdex/sdk-multichain'
import { useTranslation } from 'contexts/Localization'
import { useBridge } from 'hooks/useBridge'
import { ethers } from 'ethers'
import QuestionHelper from 'components/QuestionHelper'

// eslint-disable

const ApplyButton = styled(Button)`
  bottom: 16px;
  background: linear-gradient(90deg, rgb(97, 13, 137) 0%, rgb(196, 43, 180) 100%);
  &:active {
    outline: none;
  }
  &:hover {
    outline: none;
  }
  &:focus {
    outline: none;
  }
`

const BalanceButton = styled(Button)`
  bottom: 16px;
  outline: none;
  border-radius: 16px;
  box-shadow: inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1);
  background-color: rgba(74, 74, 104, 0.1);
  color: #1fc7d4;
  margin: 10px 0px;
  height: 26px;
  &:active {
    outline: none;
  }
  &:hover {
    outline: none;
  }
  &:focus {
    outline: none;
  }
`
const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #372f47;
  border-radius: 16px;
  box-shadow: inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1);
  & > input {
    &:focus {
      border: none !important;
      box-shadow: none !important;
      border-radius: none !important;
    }
  }
`
const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(4, auto);
  justify-content: space-between;
  margin-top: 20px;
`
const GridItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: ${(props) => (props.isLeft ? 'left' : 'right')};
  color: white;
  padding: 6px 0px;
`
const TicketContainer = styled(Flex)`
  & > input:first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
  & > input:last-child {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
`

const TicketInput = styled(Input)`
  bottom: 16px;
  outline: none;
  background: white;
  border-radius: inherit;
  color: black;
  &:active {
    outline: none;
  }
  &:hover {
    outline: none;
  }
  &:focus {
    outline: unset;
    box-shadow: unset !important;
    border: unset;
  }
`


interface BridgeConfirmModalProps extends InjectedModalProps {
  isSphynx: boolean
}

const BridgeConfirmModal: React.FC<BridgeConfirmModalProps> = ({ isSphynx, onDismiss }) => {
  const { t } = useTranslation()
  const {
    onConfrimClicked,
    bscGasPrice,
    bscSwapFee,
    ethSwapFee,
    typedValue,
    chainId,
    setNextClickable,
  } = useBridge(isSphynx);
  const [forceUpdate, setForceUpdate] = React.useState(0)
  React.useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [bscGasPrice, bscGasPrice]);

  return (
    <Modal
      title={t('Bridge Transfer')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ minWidth: '500px', maxWidth: '500px' }}
      onBack={null}
    >
      <Flex flexDirection="column">
        <Text fontSize='24px' style={{ alignSelf: 'center' }}> Trasanctions </Text>
        <Text marginTop={24}>
          Bridge transfer has two step.
          <br></br>
          1. The fist step is to send from source network to swap-agent.
          <br></br>
          2. Second step is to send from swap agent to desination network.
        </Text>
        {chainId === ChainId.MAINNET && (
          <Flex margin="0px 10px 0px" alignItems="center">
            <Grid style={{ marginTop: '12px' }}>
              <GridItem isLeft>
                <Text bold style={{ textAlign: 'left' }} color="white" fontSize="16px">
                  Bsc Gas Price
                </Text>
              </GridItem>
              <GridItem isLeft>
                <Flex alignItems={'center'}>
                  <Text bold style={{ textAlign: 'right', marginRight: '6px' }} color="white" fontSize="16px">
                    {ethers.utils.formatEther(bscSwapFee)}BNB
                  </Text>
                  <QuestionHelper
                    text={t(
                      'This fee will send to bsc swap agent. It will be used to make ETH transaction',
                    )}
                  />
                </Flex>
              </GridItem>
            </Grid>
          </Flex>
        )}
        {chainId === ChainId.ETHEREUM && (
          <Flex margin="0px 10px 0px" alignItems="center">
            <Grid style={{ marginTop: '12px' }}>
              <GridItem isLeft>
                <Text bold style={{ textAlign: 'left' }} color="white" fontSize="16px">
                  Eth Gas Price
                </Text>
              </GridItem>
              <GridItem isLeft={false}>
                <Flex alignItems={'center'}>
                  <Text bold style={{ textAlign: 'right', marginRight: '10px' }} color="white" fontSize="16px">
                    {ethers.utils.formatEther(ethSwapFee)}ETH
                  </Text>
                  <QuestionHelper
                    text={t(
                      'This fee will send to eth swap agent. It will be used to make BSC transaction',
                    )}
                  />
                </Flex>
              </GridItem>
            </Grid>
          </Flex>
        )}
        <Flex margin="0px 10px 0px" alignItems="center">
          <Grid style={{ marginTop: '12px' }}>
            <GridItem isLeft>
              <Text bold style={{ textAlign: 'left' }} color="white" fontSize="16px">
                Amount
              </Text>
            </GridItem>
            <GridItem isLeft>
              <Text bold style={{ textAlign: 'right' }} color="white" fontSize="16px">
                {typedValue} Sphynx
              </Text>
            </GridItem>
          </Grid>
        </Flex>
      </Flex>
      <Flex marginTop={40}>
        <ApplyButton
          className="selected"
          onClick={()=> {
            setNextClickable(false);
            onDismiss();
          }}
          style={{
            width: '100%',
            color: 'white',
            marginRight: '10px'
          }}
        >
          Close
        </ApplyButton>
        <ApplyButton
          className="selected"
          onClick={() => onConfrimClicked(typedValue)}
          style={{
            width: '100%',
            color: 'white',
            marginLeft: '10px'
          }}
        >
          Confirm
        </ApplyButton>
      </Flex>
    </Modal>
  )
}

export default BridgeConfirmModal
