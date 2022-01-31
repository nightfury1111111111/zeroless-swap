import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Modal, Input, Text } from '@sphynxdex/uikit'

import { useTranslation } from 'contexts/Localization'

export default function SettingModal({ onDismiss = () => null }) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [slippageInput, setSlippageInput] = useState('')
  const [addressInput, setAddressInput] = useState(account || '')

  const Sperate = styled.div`
    margin-top: 32px;
  `

  const inputChange = (e) => {
    switch (e.target.name) {
      case 'slippageInput':
        setSlippageInput(e.target.value)
        break
      case 'addressInput':
        setAddressInput(e.target.value)
        break
      default:
        break
    }
  }

  return (
    <Modal title={t('Settings')} onDismiss={onDismiss} style={{ maxWidth: '400px' }}>
      <Text>Slippage</Text>
      <Input name="slippageInput" value={slippageInput} onChange={inputChange} />
      <Text fontSize="12px" margin="10px">
        Transaction may revert if price changes by more than slippage %
      </Text>
      <Sperate />
      <Text>Recipient Address</Text>
      <Input name="addressInput" value={addressInput} onChange={inputChange} />
      <Text fontSize="12px" margin="10px">
        Choose recipient address. By default, this is your currently connected address
      </Text>
    </Modal>
  )
}
