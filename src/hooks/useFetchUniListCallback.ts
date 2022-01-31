import { nanoid } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UniChainId } from 'state/lists/hooks'
import { AppDispatch, AppState } from '../state'
import { fetchTokenList } from '../state/lists/actions'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/ENS/resolveENSContentHash'
import useWeb3Provider from './useActiveWeb3React'

function useFetchUniListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { library } = useWeb3Provider()
  const connectedNetworkID = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.connectedNetworkID)
  const dispatch = useDispatch<AppDispatch>()

  const ensResolver = useCallback(
    (ensName: string) => {
      if (connectedNetworkID !== UniChainId.MAINNET) {
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [connectedNetworkID, library],
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      if (sendDispatch) {
        dispatch(fetchTokenList.unipending({ uniRequestId: requestId, uniUrl: listUrl }))
      }
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          if (sendDispatch) {
            dispatch(fetchTokenList.unifulfilled({ uniUrl: listUrl, uniTokenList: tokenList, uniRequestId: requestId }))
          }
          return tokenList
        })
        .catch((error) => {
          console.error(`Failed to get list at url ${listUrl}`, error)
          if (sendDispatch) {
            dispatch(fetchTokenList.unirejected({ uniUrl: listUrl, uniRequestId: requestId, uniErrorMessage: error.message }))
          }
          throw error
        })
    },
    [dispatch, ensResolver],
  )
}

export default useFetchUniListCallback
