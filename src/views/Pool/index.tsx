import React from 'react'
import CardNav from 'components/CardNav'
import LiquidityWidget from './LiquidityWidget'

export default function Pool() {
  return (
    <>
      <CardNav activeIndex={1} />
      <LiquidityWidget />
    </>
  )
}
