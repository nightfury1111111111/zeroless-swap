import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit'
import { TokenList, Version } from '@uniswap/token-lists'

export const fetchTokenList: Readonly<{
  pending: ActionCreatorWithPayload<{ url: string; requestId: string }>
  fulfilled: ActionCreatorWithPayload<{ url: string; tokenList: TokenList; requestId: string }>
  rejected: ActionCreatorWithPayload<{ url: string; errorMessage: string; requestId: string }>
  unipending: ActionCreatorWithPayload<{ uniUrl: string; uniRequestId: string }>
  unifulfilled: ActionCreatorWithPayload<{ uniUrl: string; uniTokenList: TokenList; uniRequestId: string }>
  unirejected: ActionCreatorWithPayload<{ uniUrl: string; uniErrorMessage: string; uniRequestId: string }>
}> = {
  pending: createAction('lists/fetchTokenList/pending'),
  fulfilled: createAction('lists/fetchTokenList/fulfilled'),
  rejected: createAction('lists/fetchTokenList/rejected'),
  unipending: createAction('lists/fetchTokenList/unipending'),
  unifulfilled: createAction('lists/fetchTokenList/unifulfilled'),
  unirejected: createAction('lists/fetchTokenList/unirejected'),
}
// add and remove from list options
export const addList = createAction<string>('lists/addList')
export const removeList = createAction<string>('lists/removeList')

// select which lists to search across from loaded lists
export const enableList = createAction<string>('lists/enableList')
export const disableList = createAction<string>('lists/disableList')

// versioning
export const acceptListUpdate = createAction<string>('lists/acceptListUpdate')
export const rejectVersionUpdate = createAction<Version>('lists/rejectVersionUpdate')

// Uniswap 
export const addUniList = createAction<string>('lists/addUniList')
export const removeUniList = createAction<string>('lists/removeUniList')

export const enableUniList = createAction<string>('lists/enableUniList')
export const disableUniList = createAction<string>('lists/disableUniList')

export const acceptUniListUpdate = createAction<string>('lists/acceptUniListUpdate')
export const rejectUniVersionUpdate = createAction<Version>('lists/rejectUniVersionUpdate')
