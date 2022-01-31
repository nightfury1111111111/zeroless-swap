import { Currency, CurrencyAmount, ETHER, JSBI, Pair, Percent, Price, TokenAmount } from '@sphynxdex/sdk-multichain'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PairState, usePair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'

import { wrappedCurrency, wrappedCurrencyAmount } from 'utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput, othTypeInput } from './actions'


const ZERO = JSBI.BigInt(0)

export function useBridgeState(): AppState['bridge'] {
  return useSelector<AppState, AppState['bridge']>((state) => state.bridge)
}

export function useBridgeActionHandlers(): {
  onFieldSpxInput: (typedValue: string) => void
  onFieldOthInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onFieldSpxInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.BRIDGE_TOKENSPX, typedValue}))
    },
    [dispatch],
  )
  const onFieldOthInput = useCallback(
    (othTypedValue: string) => {
      dispatch(othTypeInput({ field: Field.BRIDGE_TOKENOTH, othTypedValue}))
    },
    [dispatch],
  )
  return {
    onFieldSpxInput,
    onFieldOthInput
  }
}

export function useDerivedBridgeInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): {
  dependentField: Field
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  price?: Price
  noLiquidity?: boolean
  liquidityMinted?: TokenAmount
  poolTokenPercentage?: Percent
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { typedValue, othTypedValue } = useBridgeState()

  const dependentField = Field.BRIDGE_TOKENOTH;
  const independentField = Field.BRIDGE_TOKENOTH;

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.BRIDGE_TOKENSPX]: currencyA ?? undefined,
      [Field.BRIDGE_TOKENOTH]: currencyB ?? undefined,
    }),
    [currencyA, currencyB],
  )

  // pair
  const [pairState, pair] = usePair(currencies[Field.BRIDGE_TOKENSPX], currencies[Field.BRIDGE_TOKENOTH])

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO)) || true

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.BRIDGE_TOKENSPX],
    currencies[Field.BRIDGE_TOKENOTH],
  ])
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.BRIDGE_TOKENSPX]: balances[0],
    [Field.BRIDGE_TOKENOTH]: balances[1],
  }

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(typedValue, currencies[independentField])
  const dependentAmount: CurrencyAmount | undefined = tryParseAmount(othTypedValue, currencies[independentField])

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = useMemo(
    () => ({
      [Field.BRIDGE_TOKENSPX]: independentAmount ,
      [Field.BRIDGE_TOKENOTH]: dependentAmount ,
    }),
    [dependentAmount, independentAmount, independentField],
  );

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const { [Field.BRIDGE_TOKENSPX]: currencyAAmount, [Field.BRIDGE_TOKENOTH]: currencyBAmount } = parsedAmounts
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currencyAAmount, chainId),
      wrappedCurrencyAmount(currencyBAmount, chainId),
    ]
    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
    }
    return undefined
  }, [parsedAmounts, chainId, pair, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
    }
    return undefined
  }, [liquidityMinted, totalSupply])

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (pairState === PairState.INVALID) {
    error = error ?? 'Invalid pair'
  }

  if (!parsedAmounts[Field.BRIDGE_TOKENSPX] || !parsedAmounts[Field.BRIDGE_TOKENOTH]) {
    error = error ?? 'Enter an amount'
  }

  const { [Field.BRIDGE_TOKENSPX]: currencyAAmount, [Field.BRIDGE_TOKENOTH]: currencyBAmount } = parsedAmounts

  if (currencyAAmount && currencyBalances?.[Field.BRIDGE_TOKENSPX]?.lessThan(currencyAAmount)) {
    error = `Insufficient ${currencies[Field.BRIDGE_TOKENSPX]?.symbol} balance`
  }

  if (currencyBAmount && currencyBalances?.[Field.BRIDGE_TOKENOTH]?.lessThan(currencyBAmount)) {
    error = `Insufficient ${currencies[Field.BRIDGE_TOKENOTH]?.symbol} balance`
  }

  return {
    dependentField,
    currencies,
    currencyBalances,
    parsedAmounts,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  }
}

