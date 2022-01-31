// Set of helper functions to facilitate wallet setup

import { CHAIN_LIST, BASE_URL } from 'config'
import { NETWORK_LIST } from 'components/NetworkSwitchModal/NetworkSwitchModal'
import { useSelector, useDispatch } from 'react-redux'
/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */

export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [CHAIN_LIST[0]],
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: `${BASE_URL}/images/tokens/${tokenAddress}.png`,
      },
    },
  })

  return tokenAdded
}

export const switchNetwork = async (chainId: number) => {
  const provider = window.ethereum?.isTrust ? window?.trustwallet?.Provider : window.ethereum
  if (provider) {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }], // chainId must be in hexadecimal numbers
      })
      return true
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      let networkItem
      NETWORK_LIST.forEach((item) => {
        if (item.ChainID === chainId) {
          networkItem = item
        }
        return false
      })

      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: networkItem.params,
          })
        } catch (addError) {
          console.error(addError)
          return false
        }
      }
      console.error(error)
      return false
    }
  } else {
    console.error('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html')
    return false
  }
}

export const getNetworkID = async () => {
  let networkID: any = 56
  const provider = window.ethereum
  if (provider) {
    try {
      networkID = await window.ethereum.request({
        method: 'eth_chainId',
      })

      return networkID
    } catch (error) {
      console.error(error)
    }
  } else {
    console.error('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html')
  }
  return networkID
}
