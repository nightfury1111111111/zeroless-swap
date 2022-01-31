import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Modal, Button } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'

declare type Handler = () => void

interface DividendModalProps {
  onDismiss?: Handler
  balance?: number
}

const ApplyButton = styled(Button)`
  bottom: 16px;
  outline: none;
  &.selected {
    background-color: ${({ theme }) => theme.custom.pancakePrimary} !important;
  }
`

const DividendModal: React.FC<DividendModalProps> = ({ onDismiss, balance }) => {
  const { t } = useTranslation()

  const [time, setRemainTime] = useState(0)
  const interval = useRef(null)

  useEffect(() => {
    const remainTime = () => {
      const finishDate = new Date('11/01/2021 12:00:00 UTC').getTime()
      let remain = finishDate - new Date().getTime()
      if (remain < 0) {
        for (;;) {
          remain += 3600 * 1000 * 24 * 7
          if (remain > 0) break
        }
      }
      setRemainTime(remain)
    }
    const ab = new AbortController()
    interval.current = setInterval(() => {
      remainTime()
    }, 1000)
    return () => {
      clearInterval(interval?.current)
      ab.abort()
    }
  }, [])

  return (
    <Modal
      title={t('Sphynx Swap Fee Reward')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ maxWidth: '420px' }}
    >
      <Flex justifyContent="space-between" mt={2}>
        <Text>{t('Total Transaction fees collected')}</Text>
        <Text ml={3}>{balance}BNB</Text>
      </Flex>
      <Text textAlign="center" mt={3}>
        {t('Distribution in:')}
      </Text>
      <Text textAlign="center" mt={1}>
        {Math.floor(time / 86400000)} {t('days')}: {Math.floor((time % 86400000) / 3600000)} {t('hrs')}:{' '}
        {Math.floor((time % 3600000) / 60000)} {t('min')}: {Math.floor((time % 60000) / 1000)} {t('sec')}
      </Text>
      <Flex justifyContent="space-between" mt={3}>
        <Text>{t('Previously Distributed')}</Text>
        <Text>{1.32}BNB</Text>
      </Flex>
      <Flex flexDirection="column" mt={3}>
        <ApplyButton className="selected" onClick={onDismiss}>
          {t('Hide Details')}
        </ApplyButton>
      </Flex>
    </Modal>
  )
}

export default DividendModal
