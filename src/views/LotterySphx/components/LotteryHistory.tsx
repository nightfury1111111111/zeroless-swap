import React from 'react'
import styled from 'styled-components'
import { Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { AreaChart, XAxis, YAxis, Area } from 'recharts'

const Container = styled.div`
  max-width: 340px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 340px;
  }
`
const greenData = [
  {
    label: '0',
    value: 22000,
  },
  {
    label: '66',
    value: 30000,
  },
  {
    label: '132',
    value: 45000,
  },
  {
    label: '198',
    value: 13000,
  },
  {
    label: '264',
    value: 48000,
  },
  {
    label: '330',
    value: 27000,
  },
  {
    label: '396',
    value: 25000,
  },
  {
    label: '462',
    value: 15000,
  },
]

export default function History() {
  const { t } = useTranslation()

  return (
    <Container>
      <Text bold fontSize="24px" pt="15px" pl="13px">
        {t('History')}
      </Text>
      <div
        style={{
          background: 'rgba(0, 0, 0, 0)',
          borderRadius: 4,
          marginLeft: '4px',
          padding: '0px 0 8px',
          height: 'fit-content',
          width: '100%',
          fontSize: '8.53988px',
          fontWeight: 'bold',
        }}
      >
        <AreaChart width={340} height={300} data={greenData} margin={{ top: 32, right: 32, left: -16, bottom: 20 }}>
          <XAxis dataKey="label" style={{ fontSize: 10 }} />
          <YAxis dataKey="value" type="number" style={{ fontSize: 10 }} domain={[0, 50000]} tickCount={12} />
          <Area
            stackId="1"
            isAnimationActive={false}
            type="monotone"
            dataKey="value"
            stroke="#8B2A9B"
            strokeWidth={4}
            fillOpacity={0}
          />
        </AreaChart>
      </div>
    </Container>
  )
}
