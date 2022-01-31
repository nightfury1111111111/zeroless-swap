import React from 'react'
import { TokenPairImage, ImageProps } from '@sphynxdex/uikit'
import tokens from 'config/constants/tokens'
import { ChainId } from '@sphynxdex/sdk-multichain'
import { useWeb3React } from '@web3-react/core'

const CakeVaultTokenPairImage: React.FC<Omit<ImageProps, 'src'>> = (props) => {
  const { chainId } = useWeb3React()
  const getAddress = (address) => {
    return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
  }
  const primaryTokenSrc = `/images/tokens/${getAddress(tokens.sphynx.address)}.svg`

  return <TokenPairImage primarySrc={primaryTokenSrc} secondarySrc="/images/tokens/autorenew.svg" {...props} />
}

export default CakeVaultTokenPairImage
