import React, { useEffect } from 'react'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  InjectedModalProps,
  Heading,
  Text,
  Box,
} from '@sphynxdex/uikit'
import styled from 'styled-components'
import { AutoRow } from 'components/Row'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'state'
import { setConnectedNetworkID } from 'state/input/actions'
import { switchNetwork } from 'utils/wallet'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const StyledModalContainer = styled(ModalContainer)`
  // background-color: ${({ theme }) => (theme ? '#191C41' : '#2A2E60')};
  background-color: ${({ theme }) => theme.custom.switchModal};
  border: none;
  div:first-child {
    border-bottom: none;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 420px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 680px;
  }
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
`

const NetworkList = styled.div`
  display: grid;
  grid-gap: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`
// ? `${({ theme }) => (theme.isDark ? '#191C41' : '#2A2E60')}`

const NetworkItem = styled(Box)<{ selected?: boolean }>`
  display: flex;
  background: ${({ selected, theme }) => (!selected ? theme.custom.switchModal : theme.custom.activeNetBackground)};
  color: white;
  border-radius: 0.625rem;
  padding: 2px;
  border: ${({ theme }) => theme.custom.switchModalBorder};
  text-decoration: 'none';
  cursor: pointer;

  div {
    background: ${({ theme }) => theme.custom.invertSwitchModal};
    display: flex;
    padding: 0.4rem 0.8rem;
    border-radius: 0.625rem;
    img {
      border-radius: 0.375rem;
    }
  }

  &: ${({ selected, theme }) =>
    !selected &&
    `hover {
    background: ${theme.custom.activeNetBackground};
    div { 
      background: ${theme.custom.invertSwitchModal};
    }
  }`};
`

interface AddEthereumChainParameter {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: 18
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}

interface NetworkData {
  ChainID: number
  btIcon: string
  networkName: string
  selected: boolean
  params?: AddEthereumChainParameter[]
}

interface NetworkSearchModalProps extends InjectedModalProps {
  selectedNetwork?: NetworkData | null
  otherSelectedNetwork?: NetworkData | null
  showCommonBases?: boolean
}

export const NETWORK_LIST = [
  {
    ChainID: 56,
    btIcon: '/images/net/bsc.png',
    networkName: 'BSC',
    selected: false,
    params: [
      {
        chainName: 'Binance Smart Chain Mainnet',
        nativeCurrency: {
          name: 'Binance Chain Native Token',
          symbol: 'BNB',
          decimals: 18,
        },
        chainId: '0x38',
        rpcUrls: [
          'https://bsc-dataseed1.binance.org',
          'https://bsc-dataseed2.binance.org',
          'https://bsc-dataseed3.binance.org',
          'https://bsc-dataseed4.binance.org',
          'https://bsc-dataseed1.defibit.io',
          'https://bsc-dataseed2.defibit.io',
          'https://bsc-dataseed3.defibit.io',
          'https://bsc-dataseed4.defibit.io',
          'https://bsc-dataseed1.ninicoin.io',
          'https://bsc-dataseed2.ninicoin.io',
          'https://bsc-dataseed3.ninicoin.io',
          'https://bsc-dataseed4.ninicoin.io',
          'wss://bsc-ws-node.nariox.org',
        ],
      },
    ],
  },
  {
    ChainID: 1,
    btIcon: '/images/net/ethereum.png',
    networkName: 'Ethereum',
    selected: false,
  },
  {
    ChainID: 137,
    btIcon: '/images/net/polygon.png',
    networkName: 'Polygon',
    selected: false,
    params: [
      {
        chainName: 'Polygon',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC', // 2-6 characters long
          decimals: 18,
        },
        chainId: '0x89',
        rpcUrls: [
          'https://polygon-rpc.com',
          'https://rpc-mainnet.matic.network',
          'https://rpc-mainnet.maticvigil.com',
          'https://rpc-mainnet.matic.quiknode.pro',
        ],
        blockExplorerUrls: ['https://polygonscan.com'],
      },
    ],
  },
  {
    ChainID: 250,
    btIcon: '/images/net/fantom.png',
    networkName: 'Fantom',
    selected: false,
    params: [
      {
        chainName: 'Fantom Opera',
        nativeCurrency: {
          name: 'FTM',
          symbol: 'FTM', // 2-6 characters long
          decimals: 18,
        },
        chainId: '0xfa',
        rpcUrls: ['https://rpc.ftm.tools'],
        blockExplorerUrls: ['https://ftmscan.com'],
      },
    ],
  },
  {
    ChainID: 42161,
    btIcon: '/images/net/arbitrum.png',
    networkName: 'Arbitrum',
    selected: false,
    params: [
      {
        chainName: 'Arbitrum One',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'AETH', // 2-6 characters long
          decimals: 18,
        },
        chainId: '0xa4b1',
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io'],
      },
    ],
  },
  {
    ChainID: 66,
    btIcon: '/images/net/okex.png',
    networkName: 'OKEx',
    selected: false,
    params: [
      {
        chainName: 'OKExChain Mainnet',
        nativeCurrency: {
          name: 'OKExChain Global Utility Token in testnet',
          symbol: 'OKT', // 2-6 characters long
          decimals: 18,
        },
        chainId: '0x42',
        rpcUrls: ['https://exchainrpc.okex.org'],
        blockExplorerUrls: ['https://www.oklink.com/okexchain'],
      },
    ],
  },
  {
    ChainID: 128,
    btIcon: '/images/net/heco.png',
    networkName: 'HECO',
    selected: false,
    params: [
      {
        chainName: 'Huobi ECO Chain Mainnet',
        nativeCurrency: {
          name: 'Huobi ECO Chain Native Token',
          symbol: 'HT',
          decimals: 18,
        },
        chainId: '0x80',
        rpcUrls: ['https://http-mainnet.hecochain.com', 'wss://ws-mainnet.hecochain.com'],
      },
    ],
  },
  {
    ChainID: 100,
    btIcon: '/images/net/xdai.png',
    networkName: 'xDai',
    selected: false,
    params: [
      {
        chainName: 'xDAI Chain',
        nativeCurrency: {
          name: 'xDAI',
          symbol: 'xDAI',
          decimals: 18,
        },
        chainId: '0x64',
        rpcUrls: [
          'https://rpc.xdaichain.com',
          'https://xdai.poanetwork.dev',
          'wss://rpc.xdaichain.com/wss',
          'wss://xdai.poanetwork.dev/wss',
          'http://xdai.poanetwork.dev',
          'https://dai.poa.network',
          'ws://xdai.poanetwork.dev:8546',
        ],
      },
    ],
  },
  {
    ChainID: 1666600000,
    btIcon: '/images/net/harmonyone.png',
    networkName: 'Harmony',
    selected: false,
    params: [
      {
        chainName: 'Harmony Mainnet Shard 0',
        nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
        chainId: '0x63564c40',
        rpcUrls: ['https://api.harmony.one'],
      },
    ],
  },
  {
    ChainID: 43114,
    btIcon: '/images/net/avalanche.png',
    networkName: 'Avalanche',
    selected: false,
    params: [
      {
        chainName: 'Avalanche Mainnet',
        nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
        chainId: '0xa86a',
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
      },
    ],
  },
  {
    ChainID: 42220,
    btIcon: '/images/net/celo.png',
    networkName: 'Celo',
    selected: false,
    params: [
      {
        chainName: 'Celo Mainnet',
        nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
        chainId: '0xa4ec',
        rpcUrls: ['https://forno.celo.org', 'wss://forno.celo.org/ws'],
      },
    ],
  },
  {
    ChainID: 11297108109,
    btIcon: '/images/net/palm.png',
    networkName: 'Palm',
    selected: false,
    params: [
      {
        chainName: 'palm',
        nativeCurrency: { name: 'PALM', symbol: 'PALM', decimals: 18 },
        chainId: '0x2a15c308d',
        rpcUrls: ['https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b'],
      },
    ],
  },
  {
    ChainID: 1285,
    btIcon: '/images/net/moonriver.png',
    networkName: 'Moonriver',
    selected: false,
    params: [
      {
        chainName: 'Moonriver',
        nativeCurrency: { name: 'Moonriver', symbol: 'MOVR', decimals: 18 },
        chainId: '0x505',
        rpcUrls: ['https://rpc.moonriver.moonbeam.network', 'wss://wss.moonriver.moonbeam.network'],
      },
    ],
  },
]

export default function NetworkSwitchModal({
  onDismiss = () => null,
  selectedNetwork,
  otherSelectedNetwork,
  showCommonBases = false,
}: NetworkSearchModalProps) {
  const dispatch = useDispatch()
  const { chainId } = useActiveWeb3React()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleNetworkItemClick = (networkItem) => {
    if (!switchNetwork(networkItem.ChainID)) {
      console.error('network switch error!')
    }
    onDismiss()
  }

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>Select a Network</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        <NetworkList>
          {NETWORK_LIST.map((item) => (
            <NetworkItem
              key={item.ChainID}
              onClick={() => handleNetworkItemClick(item)}
              selected={item.ChainID === chainId}
            >
              <AutoRow>
                <img src={item.btIcon} width="32" height="32" alt="icon" />
                <Text bold fontSize="14px">
                  {item.networkName}
                </Text>
              </AutoRow>
            </NetworkItem>
          ))}
        </NetworkList>
      </StyledModalBody>
    </StyledModalContainer>
  )
}
