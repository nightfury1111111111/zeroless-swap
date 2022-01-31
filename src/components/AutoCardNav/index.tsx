/* eslint-disable */
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { RouterType, ChainId } from '@sphynxdex/sdk-multichain'
import { useTranslation } from 'contexts/Localization'
import { useSetRouterType } from 'state/application/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Button } from '@sphynxdex/uikit'
import SwapRouter from 'config/constants/swaps'

const StyledNav = styled.div`
  display: flex;
  height: 24px;
  width: 100%;
  justify-content: center;
  background: transparent;
  border-radius: 16px;
  margin-bottom: 16px;
  button:nth-child(1) {
    width: 100%;
    max-width: 120px;
    font-weight: 600;
    font-size: 12px;
    color: white;
    height: 24px;
    padding: 0 16px;
    background: ${({ theme }) => theme.custom.autoCardBackground};
    border: 1px solid ${({ theme }) => theme.custom.autoCardBorder};
    border-radius: 16px 0px 0px 16px;
    box-shadow: none !important;
    outline: none;
    &:hover,
    &.active {
      background: ${({ theme }) => theme.custom.pancakePrimary};
      border: 1px solid ${({ theme }) => theme.custom.primary};
    }
  }
  button:nth-child(2) {
    width: 100%;
    max-width: 120px;
    font-weight: 600;
    font-size: 12px;
    color: white;
    height: 24px;
    padding: 0 16px;
    background: ${({ theme }) => theme.custom.autoCardBackground};
    border: 1px solid ${({ theme }) => theme.custom.autoCardBorder};
    border-radius: 0px 16px 16px 0px;
    box-shadow: none !important;
    outline: none;
    &:hover,
    &.active {
      background: ${({ theme }) => theme.custom.pancakePrimary} !important;
      border: 1px solid ${({ theme }) => theme.custom.primary};
    }
  }
`

const AutoNav = (props) => {
  const { setRouterType } = useSetRouterType()
  const { swapRouter, setSwapRouter, connectedNetworkID } = props

  let { chainId } = useActiveWeb3React()

  if (isNaN(chainId)) {
    chainId = 56
  }

  useEffect(() => {
    setTimeout(() => {
      if (swapRouter === SwapRouter.SPHYNX_SWAP || swapRouter === SwapRouter.SPHYNX_ETH_SWAP) {
        if (chainId === ChainId.MAINNET) setRouterType(RouterType.sphynx)
        if (chainId === ChainId.ETHEREUM) setRouterType(RouterType.sphynxeth)
      } else {
        if (chainId === ChainId.MAINNET) setRouterType(RouterType.pancake)
        if (chainId === ChainId.ETHEREUM) setRouterType(RouterType.uniswap)
      }
    })
  }, [swapRouter])

  const { t } = useTranslation()

  return (
    <StyledNav>
      {/* <Button
        className={swapRouter === SwapRouter.AUTO_SWAP ? 'active' : ''}
        id="auto-nav-link"
        onClick={() => {
          setRouterType(RouterType.sphynx)
          setSwapRouter(SwapRouter.AUTO_SWAP)
        }}
      >
        {t('AUTO')}
      </Button> */}
      <Button
        className={swapRouter === SwapRouter.SPHYNX_SWAP || swapRouter === SwapRouter.SPHYNX_ETH_SWAP ? 'active' : ''}
        id="dgsn-nav-link"
        onClick={() => {
          if (chainId === ChainId.MAINNET) {
            setRouterType(RouterType.sphynx)
            setSwapRouter(SwapRouter.SPHYNX_SWAP)
          }
          if (chainId === ChainId.ETHEREUM) {
            setRouterType(RouterType.sphynxeth)
            setSwapRouter(SwapRouter.SPHYNX_ETH_SWAP)
          }
        }}
      >
        {t('SPHYNX-LP')}
      </Button>
      <Button
        className={swapRouter === SwapRouter.PANCAKE_SWAP || swapRouter === SwapRouter.UNI_SWAP ? 'active' : ''}
        id="pcv-nav-link"
        onClick={() => {
          if (chainId === ChainId.MAINNET) {
            setRouterType(RouterType.pancake)
            setSwapRouter(SwapRouter.PANCAKE_SWAP)
          }
          if (chainId === ChainId.ETHEREUM) {
            setRouterType(RouterType.uniswap)
            setSwapRouter(SwapRouter.UNI_SWAP)
          }
        }}
      >
        {t(Number(connectedNetworkID) === ChainId.MAINNET ? 'PCV2' : 'UNV2')}
      </Button>
    </StyledNav>
  )
}

export default AutoNav
