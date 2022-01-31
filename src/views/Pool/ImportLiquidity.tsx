import React, { useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Text, Button, AddIcon } from '@sphynxdex/uikit'
import { useSelector } from 'react-redux'
import { Currency, Pair, ETHER, ChainId, Token } from '@sphynxdex/sdk-multichain'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { useAllTokens, useAllUniTokens } from 'hooks/Tokens'
import { AppState } from 'state/index'
import { BNB } from 'config/constants/tokens'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { useSetRouterType } from '../../state/application/hooks'
import { toV2LiquidityToken, useUnTrackedTokenPairs } from '../../state/user/hooks'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import Dots from '../../components/Loader/Dots'
import { AppHeader } from '../../components/App'
import FullPositionCard from '../../components/PositionCard'

const ImportField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  #find-lptoken-1,
  #find-lptoken-2 {
    width: 100%;
  }
  .plus-icon {
    color: white;
    font-size: 20px;
    font-weight: 500;
    padding: 10px;
  }
  .import-footer {
    color: white;
    font-size: 14px;
    padding-top: 20px;
    width: 100%;
  }
`

const IconBox = styled.div`
  color: ${({ theme }) => theme.custom.pancakePrimary};
  font-size: 30px;
  font-weight: 500;
  margin: 10px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  text-align: center;
`

interface ImportLiquityProp {
  getResult: (value: any) => void
  handleSwapType: () => void
}

export default function ImportLiquidity({ getResult, handleSwapType }: ImportLiquityProp) {
  const [tokenA, setTokenA] = useState<Currency>(null)
  const [tokenB, setTokenB] = useState<Currency>(null)
  const [lpToken, setLPToken] = useState<Token>(null)
  const [tokenPair, setTokenPair] = useState<Pair>(null)
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const { routerType } = useSetRouterType()
  const theme = useTheme()

  useEffect(() => {
    if (chainId === ChainId.MAINNET) {
      setTokenA(ETHER[ChainId.MAINNET])
    } else if (chainId === ChainId.ETHEREUM) {
      setTokenA(ETHER[ChainId.ETHEREUM])
    }
  }, [chainId])

  const unTrackedTokenPairs = useUnTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      unTrackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken([routerType, ...tokens]), tokens })),
    [unTrackedTokenPairs, routerType],
  )

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )

  const [v2PairsBalances1, fetchingV2PairBalances1] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances1 = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances1[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances1],
  )

  const v2Pairs1 = usePairs(liquidityTokensWithBalances1.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances1 ||
    v2Pairs1?.length < liquidityTokensWithBalances1.length ||
    v2Pairs1?.some((V2Pair) => !V2Pair)
  const allPairs = v2Pairs1.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const connectedNetworkID = useSelector<AppState, AppState['inputReducer']>(
    (state) => state.inputReducer.connectedNetworkID,
  )

  let tokens = useAllTokens()
  const uniTokens = useAllUniTokens()
  if (connectedNetworkID !== ChainId.MAINNET) {
    tokens = uniTokens
  }

  const getLiquidityToken = (tokenA, tokenB) => {
    const tokenPair: Token[] = []
    if (tokenA.symbol === 'BNB') {
      tokenPair[0] = BNB
    } else {
      Object.keys(tokens).forEach((address) => {
        if (tokens[address].symbol === tokenA.symbol) {
          tokenPair[0] = tokens[address]
        }
      })
    }
    if (tokenB.symbol === 'BNB') {
      tokenPair[1] = BNB
    } else {
      Object.keys(tokens).forEach((address) => {
        if (tokens[address].symbol === tokenB.symbol) {
          tokenPair[1] = tokens[address]
        }
      })
    }

    const liquidityToken = toV2LiquidityToken([routerType, tokenPair[0], tokenPair[1]])
    const filteredPairs = allPairs.filter((pair) => pair.liquidityToken.address === liquidityToken.address)

    if (filteredPairs.length > 0) {
      setTokenPair(filteredPairs[0])
      setLPToken(liquidityToken)
    } else {
      setLPToken(null)
      setTokenPair(null)
    }
  }

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, [
    lpToken,
  ])

  const liquidityTokensWithBalances = useMemo(() => {
    if (lpToken) {
      return v2PairsBalances[lpToken.address]?.greaterThan('0')
    }
    return false
  }, [v2PairsBalances])

  const v2Pairs = usePairs([liquidityTokensWithBalances ? [tokenA, tokenB] : [undefined, undefined]])

  useEffect(() => {
    const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))
    if (allV2PairsWithLiquidity.length > 0) getResult(allV2PairsWithLiquidity)
  }, [v2Pairs])

  const onTokenASelect = async (currency) => {
    setTokenA(currency)
    if (tokenB) {
      getLiquidityToken(currency, tokenB)
    }
  }

  const onTokenBSelect = async (currency) => {
    setTokenB(currency)
    if (tokenA) {
      getLiquidityToken(tokenA, currency)
    }
  }

  const footerContent = (() => {
    console.log('lpToken', lpToken)
    if (fetchingV2PairBalances || v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }

    if (tokenA && tokenB) {
      if (lpToken) {
        return (
          <div>
            <Text textAlign="center" mb="2">
              Pool found!
            </Text>
            <FullPositionCard key={tokenPair.liquidityToken.address} pair={tokenPair} />
          </div>
        )
      }
      return (
        <div>
          <Text mb="2" textAlign="center">
            Could not find LPToken
          </Text>
          <Button
            id="join-pool-button"
            onClick={handleSwapType}
            width="100%"
            startIcon={<AddIcon color="white" />}
            style={{
              borderRadius: '5px',
              height: '34px',
              fontSize: '13px',
              background: theme.custom.pancakePrimary,
            }}
          >
            {t('Add Liquidity')}
          </Button>
        </div>
      )
    }
    return 'Select a token to find your liquidity'
  })()

  return (
    <ImportField>
      <AppHeader title={t('Import Liquidity')} backTo="liquidity" subtitle={t('Import an existing pool')} />
      <CurrencyInputPanel
        value="0"
        hideInput
        onUserInput={() => {
          return null
        }}
        showMaxButton={false}
        currency={tokenA}
        onCurrencySelect={onTokenASelect}
        id="find-lptoken-1"
        otherCurrency={tokenB}
        fullWidth
      />
      <IconBox>+</IconBox>
      <CurrencyInputPanel
        value="0"
        hideInput
        onUserInput={() => {
          return null
        }}
        showMaxButton={false}
        currency={tokenB}
        onCurrencySelect={onTokenBSelect}
        id="find-lptoken-2"
        otherCurrency={tokenA}
        fullWidth
      />
      <div className="import-footer">
        {fetchingV2PairBalances ? (
          <Text color="textSubtle" textAlign="center">
            <Dots>{t('Loading')}</Dots>
          </Text>
        ) : lpToken ? (
          <div>
            <Text style={{ paddingBottom: '10px' }}>Could not find LPToken</Text>
            <Button id="join-pool-button" onClick={handleSwapType} width="100%" startIcon={<AddIcon color="white" />}>
              {t('Add Liquidity')}
            </Button>
          </div>
        ) : (
          'Select a token to find your liquidity'
        )}
      </div>
      <div className="import-footer">{footerContent}</div>
    </ImportField>
  )
}
