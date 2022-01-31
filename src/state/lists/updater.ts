import { useActiveUniListUrls, useAllLists, useUniAllLists } from 'state/lists/hooks'
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAllInactiveTokens } from 'hooks/Tokens'
import { UNSUPPORTED_LIST_URLS, UNSUPPORTED_UNI_LIST_URLS } from 'config/constants/lists'
import { ChainId } from '@sphynxdex/sdk-multichain'
import useFetchListCallback from 'hooks/useFetchListCallback'
import useFetchUniListCallback from 'hooks/useFetchUniListCallback'
import useInterval from 'hooks/useInterval'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import { AppDispatch, AppState } from '../index'
import { acceptListUpdate } from './actions'
import { useActiveListUrls } from './hooks'

export default function Updater(): null {
  const { library } = useWeb3Provider()
  const dispatch = useDispatch<AppDispatch>()
  const isWindowVisible = useIsWindowVisible()
  const connectedNetworkID = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.connectedNetworkID)

  // get all loaded lists, and the active urls
  let lists = useAllLists()
  let activeListUrls = useActiveListUrls()
  let fetchList = useFetchListCallback()

  const uniLists = useUniAllLists();
  const activeUniListUrls = useActiveUniListUrls();
  const fetchUniList = useFetchUniListCallback()
  if (connectedNetworkID === ChainId.MAINNET) {
    lists = uniLists
    activeListUrls = activeUniListUrls
    fetchList = fetchUniList
  }

  // initiate loading
  useAllInactiveTokens()

  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return
    if (lists === null || lists === undefined) return
    Object.keys(lists).forEach((url) =>
      fetchList(url).catch((error) => console.debug('interval list fetching error', error)),
    )
  }, [fetchList, isWindowVisible, lists])

  // fetch all lists every 10 minutes, but only after we initialize library
  useInterval(fetchAllListsCallback, library ? 1000 * 60 * 10 : null)

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    if (lists === null || lists === undefined) return
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
      }
    })
  }, [dispatch, fetchList, library, lists])

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    Object.keys(UNSUPPORTED_LIST_URLS).forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
      }
    })
  }, [dispatch, fetchList, library, lists])

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    if (lists === null || lists === undefined) return
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version)
        // eslint-disable-next-line default-case
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump')
          // update any active or inactive lists
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl))
        }
      }
    })
  }, [dispatch, lists, activeListUrls])

  return null
}
