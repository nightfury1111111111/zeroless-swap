import { useEffect, useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { getProvider } from 'utils/providers'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const { library, ...web3React } = useWeb3React()
  let { chainId } = useWeb3React()
  if(Number.isNaN(chainId)) {
    chainId = 56
  }
  const refEth = useRef(library)
  const [provider, setprovider] = useState(library || getProvider(chainId))

  useEffect(() => {
    if (library !== refEth.current) {
      setprovider(library || getProvider(chainId))
      refEth.current = library
    }
  }, [library])

  return { library: provider, chainId: chainId ?? parseInt(window?.ethereum?.networkVersion || window?.trustwallet?.Provider?.chainId), ...web3React }
}

export default useActiveWeb3React
