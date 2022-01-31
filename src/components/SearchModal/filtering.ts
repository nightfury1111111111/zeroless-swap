import { useMemo } from 'react'
import { Token } from '@sphynxdex/sdk-multichain'
import {BRIDGE_TOKEN_LIST} from 'config/constants/bridge'
import { isAddress } from '../../utils'

export function filterTokens(tokens: Token[], search: string, isBridge : boolean): Token[] {
  const lowerSearchParts = search
  .toLowerCase()
  .split(/\s+/)
  .filter((s) => s.length > 0)

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  if (!isBridge) {
    if (search.length === 0) return tokens
    const searchingAddress = isAddress(search)
    if (searchingAddress) {
      return tokens.filter((token) => token.address === searchingAddress)
    }
    if (lowerSearchParts.length === 0) {
      return tokens
    }
    return tokens.filter((token) => {
      const { symbol, name } = token
      return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
    })
  } 

  return tokens.filter((token) => {
    const { symbol, name } = token;
    return (symbol && BRIDGE_TOKEN_LIST.includes(symbol.toLocaleUpperCase())) 
  })
}

export function useSortedTokensByQuery(tokens: Token[] | undefined, searchQuery: string): Token[] {
  return useMemo(() => {
    if (!tokens) {
      return []
    }

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    if (symbolMatch.length > 1) {
      return tokens
    }

    const exactMatches: Token[] = []
    const symbolSubtrings: Token[] = []
    const rest: Token[] = []

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map((token) => {
      if (token.symbol?.toLowerCase() === symbolMatch[0]) {
        return exactMatches.push(token)
      }
      if (token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())) {
        return symbolSubtrings.push(token)
      }
      return rest.push(token)
    })

    return [...exactMatches, ...symbolSubtrings, ...rest]
  }, [tokens, searchQuery])
}
