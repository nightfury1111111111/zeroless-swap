import React, { useEffect, useState, useRef } from 'react'
import { useTheme } from 'styled-components'
import { Text } from '@sphynxdex/uikit'

interface TimeProps {
  time?: string
}

const TimerComponent: React.FC<TimeProps> = ({ time }) => {
  const now = Math.floor(new Date().getTime() / 1000)
  const [index, setIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()
  const [day, setDay] = useState('0')
  const [hour, setHour] = useState('0')
  const [min, setMin] = useState('0')
  const [sec, setSec] = useState('0')
  const theme = useTheme()

  useEffect(() => {
    if (time) {
      timerRef.current = setInterval(() => {
        setIndex((i) => (i > 0 ? i - 1 : 0))
      }, 1000)
    }

    return () => {
      if (time) {
        clearInterval(timerRef.current!)
      }
    }
  }, [timerRef, setIndex, time])

  useEffect(() => {
    if (time) {
      const i = parseInt(time) - now
      if (i > 0) setIndex(parseInt(time) - now)
      else setIndex(0)
    }
  }, [time, setIndex, now])

  useEffect(() => {
    const s = index % 60
    const m = Math.floor((index / 60) % 60)
    const h = Math.floor((index / 60 / 60) % 24)
    const d = Math.floor(index / 60 / 60 / 24)

    if (s < 10) setSec(`0${s}`)
    else setSec(s.toString())

    if (m < 10) setMin(`0${m}`)
    else setMin(m.toString())

    if (h < 10) setHour(`0${h}`)
    else setHour(h.toString())

    if (d < 10) setDay(`0${d}`)
    else setDay(d.toString())
  }, [index])

  return (
    <Text color="white" fontSize="14px" bold>
      <span
        style={{
          margin: '8px',
          background: theme.custom.pancakePrimary,
          borderRadius: '4px',
          width: '34px',
          height: '34px',
          display: 'inline-block',
          textAlign: 'center',
          lineHeight: '34px',
        }}
      >
        {day}
      </span>
      <span
        style={{
          margin: '8px',
          background: theme.custom.pancakePrimary,
          borderRadius: '4px',
          width: '34px',
          height: '34px',
          display: 'inline-block',
          textAlign: 'center',
          lineHeight: '34px',
        }}
      >
        {hour}
      </span>
      <span
        style={{
          margin: '8px',
          background: theme.custom.pancakePrimary,
          borderRadius: '4px',
          width: '34px',
          height: '34px',
          display: 'inline-block',
          textAlign: 'center',
          lineHeight: '34px',
        }}
      >
        {min}
      </span>
      <span
        style={{
          margin: '8px',
          background: theme.custom.pancakePrimary,
          borderRadius: '4px',
          width: '34px',
          height: '34px',
          display: 'inline-block',
          textAlign: 'center',
          lineHeight: '34px',
        }}
      >
        {sec}
      </span>
    </Text>
  )
}

export default TimerComponent
