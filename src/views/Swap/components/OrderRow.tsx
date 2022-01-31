import React, { useState, useRef, useEffect, useMemo } from 'react'
import * as ethers from 'ethers'
import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '@sphynxdex/uikit'
import { TokenImageAddress } from 'components/TokenImage'
import { ReactComponent as ArrowRightIcon } from 'assets/svg/icon/ArrowRightBridge.svg'
import { useTranslation } from 'contexts/Localization'
import { useCurrency, useToken } from 'hooks/Tokens'

interface OrderRowProps {
    tokenAAddress: string,
    tokenBAddress: string,
    amountA: string,
    amountB: string
}

const OrderRow: React.FC<OrderRowProps> = ({tokenAAddress, tokenBAddress, amountA, amountB}) => {
  const tokenA: any = useCurrency(tokenAAddress)
  const tokenB: any = useCurrency(tokenBAddress)
  const realAmountA = ethers.utils.formatUnits(amountA, tokenA.decimals).toString()
  const realAmountB = ethers.utils.formatUnits(amountB, tokenA.decimals).toString()

  const Wrapper = styled.div`
    margin-top: 12px;
    width: 100%;
    color: white;
    position: relative;
    gap: 8px;
  `

  const Comp = useMemo(() => (
    <Wrapper>
      <Flex justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
        <Flex justifyContent="center" alignItems="center" style={{flexFlow: 'column'}}>
          <TokenImageAddress address={tokenA.address} width={32} height={32} />
          <Text>
            {realAmountA}
            {tokenA.symbol}
          </Text>
        </Flex>
        <ArrowRightIcon />
        <Flex justifyContent="center" alignItems="center" style={{flexFlow: 'column'}}>
          <TokenImageAddress address={tokenB.address} width={32} height={32} />
          <Text>
            {realAmountB}
            {tokenB.symbol}
          </Text>
        </Flex>
      </Flex>
    </Wrapper>
  ), [])

  return Comp
}

export default OrderRow
