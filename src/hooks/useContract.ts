import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  getBep20Contract,
  getCakeContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getPancakeRabbitContract,
  getProfileContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getMasterchefContract,
  getBondContract,
  getBondTellerContract,
  getBondTreasuryContract,
  getBondStakingContract,
  getBondAuthorityContract,
  getBondCalculatorContract,
  getBondRedeemContract,
  getPointCenterIfoContract,
  getSouschefContract,
  getClaimRefundContract,
  getTradingCompetitionContract,
  getEasterNftContract,
  getErc721Contract,
  getCakeVaultContract,
  getPredictionsContract,
  getChainlinkOracleContract,
  getSouschefV2Contract,
  getLotteryV2Contract,
  getBunnySpecialCakeVaultContract,
  getBunnySpecialPredictionContract,
  getFarmAuctionContract,
} from 'utils/contractHelpers'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH, RouterType } from '@sphynxdex/sdk-multichain'
import { abi as ISphynxPair } from '@sphynxswap/swap-core/build/ISphynxPair.json'
import ENS_PUBLIC_RESOLVER_ABI from '../config/abi/ens-public-resolver.json'
import ENS_ABI from '../config/abi/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../config/abi/erc20'
import ERC20_ABI from '../config/abi/erc20.json'
import WETH_ABI from '../config/abi/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../config/constants/multicall'
import { PANCAKE_FACTORY_ADDRESSES, PANCAKE_FACTORY_ABI } from '../config/constants/pancakeswap'
import { ROUTER_ADDRESS, PANCAKE_ROUTER_ADDRESS, ROUTER_ETH_ADDRESS, UNISWAP_ROUTER_ADDRESS } from '../config/constants'
import { getContract } from '../utils'
import { useSetRouterType } from '../state/application/hooks'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getIfoV1Contract(address, library.getSigner()), [address, library])
}

export const useIfoV2Contract = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getIfoV2Contract(address, library.getSigner()), [address, library])
}

export const useERC20 = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBep20Contract(address, library.getSigner()), [address, library])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getErc721Contract(address, library.getSigner()), [address, library])
}

export const useCake = () => {
  const { library, chainId } = useActiveWeb3React()
  return useMemo(() => getCakeContract(library.getSigner(), chainId), [library])
}

export const useBunnyFactory = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBunnyFactoryContract(library.getSigner()), [library])
}

export const usePancakeRabbits = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getPancakeRabbitContract(library.getSigner()), [library])
}

export const useProfile = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getProfileContract(library.getSigner()), [library])
}

export const useLotteryV2Contract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getLotteryV2Contract(library.getSigner()), [library])
}

export const useMasterchef = () => {
  const { library, chainId } = useActiveWeb3React()
  return useMemo(() => getMasterchefContract(library.getSigner(), chainId), [library])
}

export const useBond = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBondContract(library.getSigner()), [library])
}

export const useBondTeller = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBondTellerContract(library.getSigner()), [library])
}

export const useBondCalculator = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBondCalculatorContract(library.getSigner()), [library])
}

export const useBondRedeemHelper = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBondRedeemContract(library.getSigner()), [library])
}

export const useBondTreasury = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBondTreasuryContract(library.getSigner()), [library])
}

export const useBondStaking = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBondStakingContract(library.getSigner()), [library])
}

export const useBondAuthority = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBondAuthorityContract(library.getSigner()), [library])
}
export const useSousChef = (id) => {
  const { library, chainId } = useActiveWeb3React()
  return useMemo(() => getSouschefContract(id, library.getSigner(), chainId), [id, library])
}

export const useSousChefV2 = (id) => {
  const { library, chainId } = useActiveWeb3React()
  return useMemo(() => getSouschefV2Contract(id, library.getSigner(), chainId), [id, library])
}

export const usePointCenterIfoContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getPointCenterIfoContract(library.getSigner()), [library])
}

export const useBunnySpecialContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBunnySpecialContract(library.getSigner()), [library])
}

export const useClaimRefundContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getClaimRefundContract(library.getSigner()), [library])
}

export const useTradingCompetitionContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getTradingCompetitionContract(library.getSigner()), [library])
}

export const useEasterNftContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getEasterNftContract(library.getSigner()), [library])
}

export const useCakeVaultContract = () => {
  const { library, chainId } = useActiveWeb3React()
  return useMemo(() => getCakeVaultContract(library.getSigner(), chainId), [library])
}

export const usePredictionsContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getPredictionsContract(library.getSigner()), [library])
}

export const useChainlinkOracleContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getChainlinkOracleContract(library.getSigner()), [library])
}

export const useSpecialBunnyCakeVaultContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBunnySpecialCakeVaultContract(library.getSigner()), [library])
}

export const useSpecialBunnyPredictionContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBunnySpecialPredictionContract(library.getSigner()), [library])
}

export const useFarmAuctionContract = () => {
  const { account, library } = useActiveWeb3React()
  // This hook is slightly different from others
  // Calls were failing if unconnected user goes to farm auction page
  // Using library instead of library.getSigner() fixes the problem for unconnected users
  // However, this fix is not ideal, it currently has following behavior:
  // - If you visit Farm Auction page coming from some other page there are no errors in console (unconnceted or connected)
  // - If you go directly to Farm Auction page
  //   - as unconnected user you don't see any console errors
  //   - as connected user you see `unknown account #0 (operation="getAddress", code=UNSUPPORTED_OPERATION, ...` errors
  //     the functionality of the page is not affected, data is loading fine and you can interact with the contract
  //
  // Similar behavior was also noticed on Trading Competition page.
  return useMemo(() => getFarmAuctionContract(account ? library.getSigner() : library), [library, account])
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useRouterAddress() {
  const { routerType } = useSetRouterType()
  return routerType === RouterType.pancake
    ? PANCAKE_ROUTER_ADDRESS
    : routerType === RouterType.uniswap
    ? UNISWAP_ROUTER_ADDRESS
    : routerType === RouterType.sphynxeth
    ? ROUTER_ETH_ADDRESS
    : ROUTER_ADDRESS
}

export function usePcsFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && PANCAKE_FACTORY_ADDRESSES[chainId], PANCAKE_FACTORY_ABI, false)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && WETH[chainId] ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    // eslint-disable-next-line default-case
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.TESTNET:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, ISphynxPair, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}
