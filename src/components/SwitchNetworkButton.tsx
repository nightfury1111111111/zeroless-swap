import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, Text, Flex, useModal } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'state'
import { setConnectedNetworkID } from 'state/input/actions'
import { getNetworkID } from 'utils/wallet'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { NETWORK_LIST } from 'components/NetworkSwitchModal/NetworkSwitchModal'
import NetworkSwitchModal from './NetworkSwitchModal/NetworkSwitchModal'

const SwitchNetworkButtonWrapper = styled.div`
  button {
    padding: 9px 18px;
    color: white;
    background: ${({ theme }) => theme.custom.switchNetworkButton};
    border-radius: 5px;
    height: 34px;
  }
`

const SwitchNetworkButton = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const ref = useRef(null)
  const [currentNet, setCurrentNet] = useState(0)
  const { chainId } = useActiveWeb3React()

  getNetworkID().then((networkID: string) => {
    dispatch(setConnectedNetworkID({ connectedNetworkID: Number(networkID) }))
  })

  const disableNetworkSelect = false

  useEffect(() => {
    NETWORK_LIST.forEach((item, index) => {
      if (item.ChainID === chainId) {
        setCurrentNet(index)
      }
    })
    // if (connectedNetworkID === ChainId.MAINNET) {
    //   ref.current.src = '/images/net/bsc.png'
    // } else {
    //   ref.current.src = '/images/net/ethereum.png'
    // }
  }, [chainId])

  const [onPresentNetworkModal] = useModal(<NetworkSwitchModal />)

  const handleSelectNetworkModal = () => {
    if (!disableNetworkSelect) {
      onPresentNetworkModal()
    }
  }

  return (
    <SwitchNetworkButtonWrapper>
      <Button onClick={handleSelectNetworkModal} {...props} variant="tertiary">
        <Flex alignItems="center">
          <img
            ref={ref}
            src={NETWORK_LIST[currentNet].btIcon}
            style={{ width: '16px', height: '16px', borderRadius: '0.375rem' }}
            alt="network"
          />
          <Text color="white" ml={2} textAlign="center">
            {NETWORK_LIST[currentNet].networkName}
          </Text>
        </Flex>
      </Button>
    </SwitchNetworkButtonWrapper>
  )
}

export default SwitchNetworkButton
