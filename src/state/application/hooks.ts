import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { RouterType } from '@sphynxdex/sdk-multichain'
import {
  toggleMenu as _toggleMenu,
  toggleTheme as _toggleTheme,
  setRouterType as _setRouterType,
  setSwapType as _setSwapType,
  setSwapTransCard as _setSwapTransCard,
  setLiquidityPairA as _setLiquidityPairA,
  setLiquidityPairB as _setLiquidityPairB,
  updateRemovedAssets,
} from './actions'
// eslint-disable-next-line import/no-cycle
import { AppState, AppDispatch } from '../index'

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function useMenuToggle() {
  const dispatch = useDispatch<AppDispatch>()
  const menuToggled = useSelector<AppState, AppState['application']['menuToggled']>(
    (state) => state.application.menuToggled,
  )

  const toggleMenu = (open: boolean) => dispatch(_toggleMenu(open))

  return { menuToggled, toggleMenu }
}

export function useDefaultThemeChange(): [number, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const currentTheme = useSelector<AppState, AppState['application']['theme']>(
    (state) => state.application.theme,
  )
  const toggleDefaultTheme = useCallback(() => {
    dispatch(_toggleTheme())
  }, [dispatch])

  return [currentTheme, toggleDefaultTheme]
}

export function useRemovedAssets() {
  const dispatch = useDispatch<AppDispatch>()
  const removedAssets = useSelector<AppState, AppState['application']['removedAssets']>(
    (state) => state.application.removedAssets,
  )

  const setRemovedAssets = (assets: string[]) => dispatch(updateRemovedAssets(assets))

  return { removedAssets, setRemovedAssets }
}

export function useSetRouterType() {
  const dispatch = useDispatch<AppDispatch>()
  const routerType = useSelector<AppState, AppState['application']['routerType']>(
    (state) => state.application.routerType,
  )

  const setRouterType = (routerType1: RouterType) => dispatch(_setRouterType(routerType1))

  return { routerType, setRouterType }
}

export function useSwapType() {
  const dispatch = useDispatch<AppDispatch>()
  const swapType = useSelector<AppState, AppState['application']['swapType']>((state) => state.application.swapType)

  const setSwapType = (stype: string) => dispatch(_setSwapType(stype))

  return { swapType, setSwapType }
}

export function useSwapTransCard() {
  const dispatch = useDispatch<AppDispatch>()
  const swapTransCard = useSelector<AppState, AppState['application']['swapTransCard']>(
    (state) => state.application.swapTransCard,
  )

  const setSwapTransCard = (stype: string) => dispatch(_setSwapTransCard(stype))

  return { swapTransCard, setSwapTransCard }
}

export function useLiquidityPairA() {
  const dispatch = useDispatch<AppDispatch>()
  const liquidityPairA = useSelector<AppState, AppState['application']['liquidityPairA']>(
    (state) => state.application.liquidityPairA,
  )

  const setLiquidityPairA = (stype: string) => dispatch(_setLiquidityPairA(stype))

  return { liquidityPairA, setLiquidityPairA }
}

export function useLiquidityPairB() {
  const dispatch = useDispatch<AppDispatch>()
  const liquidityPairB = useSelector<AppState, AppState['application']['liquidityPairB']>(
    (state) => state.application.liquidityPairB,
  )

  const setLiquidityPairB = (stype: string) => dispatch(_setLiquidityPairB(stype))

  return { liquidityPairB, setLiquidityPairB }
}

export default useBlockNumber
