import React from 'react'
import { Token } from '@sphynxdex/sdk-multichain'
import { Modal, InjectedModalProps } from '@sphynxdex/uikit'
import ImportToken from 'components/SearchModal/ImportToken'

interface Props extends InjectedModalProps {
  tokens: Token[]
  onCancel: () => void
}

const ImportTokenWarningModal: React.FC<Props> = ({ tokens, onDismiss, onCancel }) => {

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss()
    }
    onCancel()
  }

  return (
    <Modal
      title="Import Token"
      onDismiss={handleDismiss}
      style={{ maxWidth: '420px' }}
    >
      <ImportToken tokens={tokens} handleCurrencySelect={onDismiss} />
    </Modal>
  )
}

export default ImportTokenWarningModal
