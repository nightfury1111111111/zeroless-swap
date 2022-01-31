import { ChainId, Token } from '@sphynxdex/sdk-multichain'
import { Tags, TokenInfo, TokenList } from '@uniswap/token-lists'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_LIST_OF_LISTS, DEFAULT_UNI_LIST_OF_LISTS, UNSUPPORTED_UNI_LIST_URLS } from 'config/constants/lists'
import DEFAULT_UNI_TOKEN_LIST from '@uniswap/default-token-list'
import { AppState } from '../index'
import DEFAULT_TOKEN_LIST from '../../config/constants/tokenLists/pancake-default.tokenlist.json'
import { UNSUPPORTED_LIST_URLS } from '../../config/constants/lists'
import UNSUPPORTED_TOKEN_LIST from '../../config/constants/tokenLists/pancake-unsupported.tokenlist.json'

const SPHYNX = 
  {
    address: "0x94DFd4E2210Fa5B752c3CD0f381edad9dA6640f8",
    chainId: 1,
    decimals: 18,
    logoURI: "https://thesphynx.co/MainLogo.png",
    name: "Sphynx ETH",
    symbol: "SPHYNX",
  }

const DEFAULT_SPHYNX_UNI_TOKEN_LIST = (() => {
  const TOKEN_LIST = {...DEFAULT_UNI_TOKEN_LIST};
  TOKEN_LIST.tokens = [SPHYNX, ...TOKEN_LIST.tokens]
  .filter(token => [1,3,4,5,42].includes(token.chainId))
  return  TOKEN_LIST;
})();

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

// use ordering of default list of lists to assign priority
function sortByListPriority(urlA: string, urlB: string) {
  const first = DEFAULT_LIST_OF_LISTS.includes(urlA) ? DEFAULT_LIST_OF_LISTS.indexOf(urlA) : Number.MAX_SAFE_INTEGER
  const second = DEFAULT_LIST_OF_LISTS.includes(urlB) ? DEFAULT_LIST_OF_LISTS.indexOf(urlB) : Number.MAX_SAFE_INTEGER

  // need reverse order to make sure mapping includes top priority last
  if (first < second) return 1
  if (first > second) return -1
  return 0
}

function sortByUniListPriority(urlA: string, urlB: string) {
  const first = DEFAULT_UNI_LIST_OF_LISTS.includes(urlA) ? DEFAULT_UNI_LIST_OF_LISTS.indexOf(urlA) : Number.MAX_SAFE_INTEGER
  const second = DEFAULT_UNI_LIST_OF_LISTS.includes(urlB) ? DEFAULT_UNI_LIST_OF_LISTS.indexOf(urlB) : Number.MAX_SAFE_INTEGER

  // need reverse order to make sure mapping includes top priority last
  if (first < second) return 1
  if (first > second) return -1
  return 0
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo

  public readonly tags: TagInfo[]

  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }

  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<{
  [chainId in ChainId]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }>
}>

export enum UniChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
}

export type UniTokenAddressMap = Readonly<{
  [chainId in UniChainId]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }>
}>

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.MAINNET]: {},
  [ChainId.TESTNET]: {},
  [ChainId.ETHEREUM] : {},
  4 : {}
}

const EMPTY_UNI_LIST: UniTokenAddressMap = {
  [UniChainId.MAINNET]: {},
  [UniChainId.ROPSTEN]: {},
  [UniChainId.RINKEBY]: {},
  [UniChainId.GOERLI]: {},
  [UniChainId.KOVAN]: {},
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

const listUniCache: WeakMap<TokenList, UniTokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, UniTokenAddressMap>() : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list,
          },
        },
      }
    },
    { ...EMPTY_LIST },
  )
  listCache?.set(list, map)
  return map
}

export function listToUniTokenMap(list: TokenList): UniTokenAddressMap {
  const result = listUniCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<UniTokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)

      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list,
          },
        },
      }
    },
    { ...EMPTY_UNI_LIST },
  )
  listUniCache?.set(list, map)
  return map
}

export function useAllLists(): {
  readonly [url: string]: {
    readonly current: TokenList | null
    readonly pendingUpdate: TokenList | null
    readonly loadingRequestId: string | null
    readonly error: string | null
  }
} {
  return useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl)
}

export function useUniAllLists(): {
  readonly [url: string]: {
    readonly current: TokenList | null
    readonly pendingUpdate: TokenList | null
    readonly loadingRequestId: string | null
    readonly error: string | null
  }
} {
  return useSelector<AppState, AppState['lists']['byUniUrl']>((state) => state.lists.byUniUrl)
}

function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  return {
    [ChainId.ETHEREUM]: { ...map1[ChainId.ETHEREUM], ...map2[ChainId.ETHEREUM] },
    4: { ...map1[4], ...map2[4] },
    [ChainId.MAINNET]: { ...map1[ChainId.MAINNET], ...map2[ChainId.MAINNET] },
    [ChainId.TESTNET]: { ...map1[ChainId.TESTNET], ...map2[ChainId.TESTNET] },
  }
}

function combineUniMaps(map1: UniTokenAddressMap, map2: UniTokenAddressMap): UniTokenAddressMap {
  return {
    [UniChainId.MAINNET]: { ...map1[UniChainId.MAINNET], ...map2[UniChainId.MAINNET] },
    [UniChainId.ROPSTEN]: { ...map1[UniChainId.ROPSTEN], ...map2[UniChainId.ROPSTEN] },
    [UniChainId.RINKEBY]: { ...map1[UniChainId.RINKEBY], ...map2[UniChainId.RINKEBY] },
    [UniChainId.GOERLI]: { ...map1[UniChainId.GOERLI], ...map2[UniChainId.GOERLI] },
    [UniChainId.KOVAN]: { ...map1[UniChainId.KOVAN], ...map2[UniChainId.KOVAN] },

  }
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists()

  return useMemo(() => {
    if (!urls) return EMPTY_LIST

    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            const newTokens = Object.assign(listToTokenMap(current))
            return combineMaps(allTokens, newTokens)
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, EMPTY_LIST)
    )
  }, [lists, urls])
}

function useCombinedUniTokenMapFromUrls(urls: string[] | undefined): UniTokenAddressMap {
  const lists = useUniAllLists()

  return useMemo(() => {
    if (!urls) return EMPTY_UNI_LIST

    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByUniListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            const newTokens = Object.assign(listToUniTokenMap(current))
            return combineUniMaps(allTokens, newTokens)
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, EMPTY_UNI_LIST)
    )
  }, [lists, urls])
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  return useSelector<AppState, AppState['lists']['activeListUrls']>((state) => state.lists.activeListUrls)?.filter(
    (url) => !UNSUPPORTED_LIST_URLS.includes(url),
  )
}

export function useActiveUniListUrls(): string[] | undefined {
  return useSelector<AppState, AppState['lists']['activeUniListUrls']>((state) => state.lists.activeUniListUrls)?.filter(
    (url) => !UNSUPPORTED_UNI_LIST_URLS.includes(url),
  )
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url))
}

export function useInactiveUniListUrls(): string[] {
  const lists = useUniAllLists()
  const allActiveListUrls = useActiveUniListUrls()
  if (lists === null || lists === undefined) return []
  return Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_UNI_LIST_URLS.includes(url))
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  const defaultTokenMap = listToTokenMap(DEFAULT_TOKEN_LIST)
  return combineMaps(activeTokens, defaultTokenMap)
}


export function useCombinedUniActiveList(): UniTokenAddressMap {
  const activeUniListUrls = useActiveUniListUrls()
  const activeTokens = useCombinedUniTokenMapFromUrls(activeUniListUrls)
  const defaultTokenMap = listToUniTokenMap(DEFAULT_SPHYNX_UNI_TOKEN_LIST)
  return combineUniMaps(activeTokens, defaultTokenMap)
}

// all tokens from inactive lists
export function useCombinedInactiveList(): TokenAddressMap {
  const allInactiveListUrls: string[] = useInactiveListUrls()
  return useCombinedTokenMapFromUrls(allInactiveListUrls)
}

export function useCombinedUniInactiveList(): UniTokenAddressMap {
  const allInactiveUniListUrls: string[] = useInactiveUniListUrls()
  return useCombinedUniTokenMapFromUrls(allInactiveUniListUrls)
}

// used to hide warnings on import for default tokens
export function useDefaultTokenList(): TokenAddressMap {
  return listToTokenMap(DEFAULT_TOKEN_LIST)
}

export function useDefaultUniTokenList(): UniTokenAddressMap {
  return listToUniTokenMap(DEFAULT_SPHYNX_UNI_TOKEN_LIST)
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST)

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(UNSUPPORTED_LIST_URLS)

  // format into one token address map
  return combineMaps(localUnsupportedListMap, loadedUnsupportedListMap)
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}
