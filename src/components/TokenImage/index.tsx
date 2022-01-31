import React from 'react'
import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from '@sphynxdex/uikit'
import tokens from 'config/constants/tokens'
import { Token } from 'config/constants/types'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { useWeb3React } from '@web3-react/core'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token
  secondaryToken: Token
}

const getImageUrlFromToken = (token: Token, chainId: number) => {
  const getAddress = (address) => {
    return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
  }
  const address = getAddress(token.symbol === 'BNB' ? tokens.wbnb.address : token.address)
  return `/images/tokens/${address}.svg`
}

const getImageUrlFromAddress = (address: string) => {
  return `/images/tokens/${address}.svg`
}

export const TokenPairImage: React.FC<TokenPairImageProps> = ({ primaryToken, secondaryToken, ...props }) => {
  const { chainId } = useWeb3React()
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromToken(primaryToken, chainId)}
      secondarySrc={getImageUrlFromToken(secondaryToken, chainId)}
      {...props}
    />
  )
}

interface TokenImageProps extends ImageProps {
  token: Token
}

interface TokenImageAddressProps extends ImageProps {
  address: string
}

export const TokenImage: React.FC<TokenImageProps> = ({ token, ...props }) => {
  const { chainId } = useWeb3React()
  return <UIKitTokenImage src={getImageUrlFromToken(token, chainId)} {...props} />
}

export const TokenImageAddress: React.FC<TokenImageAddressProps> = ({ address, ...props }) => {
  return <UIKitTokenImage src={getImageUrlFromAddress(address)} {...props} />
}
