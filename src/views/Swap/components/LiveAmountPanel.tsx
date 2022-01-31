import React from 'react'
import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { BalanceNumber } from 'components/BalanceNumber'
import Card from 'components/Card'

const Divider = styled.div`
  // border-bottom: 1px solid ${({ theme }) => (theme ? '#21214A' : '#4A5187')};
  border-bottom: 1px solid ${({ theme }) => theme.custom.inputPanelBorder};
  margin-top: 10px;
`

interface LiveAmountPanelProps {
  symbol: string
  amount: number
  price: number
}

const LiveAmountPanel: React.FC<LiveAmountPanelProps> = ({ symbol, amount, price }: LiveAmountPanelProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Card bgColor={theme.custom.tertiary} borderRadius="3px">
      {/* <Card bgColor={theme ? '#0E0E26' : '#2A2E60'} borderRadius="3px"> */}
      <Flex justifyContent="center">
        <Text color="white" fontSize="16px" style={{ fontWeight: 'bold' }}>
          {t(symbol)}
        </Text>
      </Flex>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" mt={2}>
          <Text color="white" fontSize="14px">
            {t('Amount')}
          </Text>
          <Text color="#00ac1c" fontSize="14px">
            <BalanceNumber prefix="" value={Number(amount).toFixed(2)} />
          </Text>
        </Flex>
        <Divider />
        <Flex justifyContent="space-between" mt={2}>
          <Text color="white" fontSize="14px">
            {t('Balance')}
          </Text>
          <Text color="#00ac1c" fontSize="14px">
            <BalanceNumber prefix="$ " value={Number(amount * price).toFixed(3)} />
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}

export default LiveAmountPanel
