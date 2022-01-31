import React from 'react'
import { useMatchBreakpoints, Text, useModal, Flex, TooltipText, useTooltip, Skeleton, Heading } from '@sphynxdex/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { PoolCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { useCakeVault } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import SphynxTokenLogo from 'assets/images/MainLogo.png'
import { ChainId } from '@sphynxdex/sdk-multichain'
import styled, { useTheme } from 'styled-components'

import { ActionTitles, ActionContent } from './styles'
import CollectModal from '../../PoolCard/Modals/CollectModal'
import UnstakingFeeCountdownRow from '../../CakeVaultCard/UnstakingFeeCountdownRow'

const TokenImage = styled.img`
    height: 40px;
    ${({ theme }) => theme.mediaQueries.xs} {
        height: 50px;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
        height: 70px;
    }
`

interface HarvestActionProps extends Pool {
    userDataLoaded: boolean
}

const TokenLogo: React.FunctionComponent<HarvestActionProps> = ({
    sousId,
    poolCategory,
    earningToken,
    userData,
    userDataLoaded,
    isAutoVault,
    earningTokenPrice,
}) => {
    const { t } = useTranslation()
    const { account, chainId } = useActiveWeb3React()
    const index = chainId === undefined ? ChainId.MAINNET : chainId
    const { isXl } = useMatchBreakpoints()
    const isMobile = !isXl
    const theme = useTheme();

    const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
    // These will be reassigned later if its Auto SPHYNX vault
    let earningTokenBalance = getBalanceNumber(earnings, earningToken[index].decimals)
    let earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken[index].decimals)
    let hasEarnings = earnings.gt(0)
    // const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
    // const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
    // const isCompoundPool = sousId === 0
    // const isBnbPool = poolCategory === PoolCategory.BINANCE

    // Auto SPHYNX vault calculations
    const {
        userData: { cakeAtLastUserAction, userShares },
        pricePerFullShare,
        fees: { performanceFee },
    } = useCakeVault()
    const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
        account,
        cakeAtLastUserAction,
        userShares,
        pricePerFullShare,
        earningTokenPrice,
    )

    earningTokenBalance = isAutoVault ? autoCakeToDisplay : earningTokenBalance
    hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings
    earningTokenDollarBalance = isAutoVault ? autoUsdToDisplay : earningTokenDollarBalance

    // const [onPresentCollect] = useModal(
    //     <CollectModal
    //         formattedBalance={formattedBalance}
    //         fullBalance={fullBalance}
    //         earningToken={earningToken}
    //         earningsDollarValue={earningTokenDollarBalance}
    //         sousId={sousId}
    //         isBnbPool={isBnbPool}
    //         isCompoundPool={isCompoundPool}
    //     />,
    // )

    // const { targetRef, tooltip, tooltipVisible } = useTooltip(
    //     t('Subtracted automatically from each yield harvest and burned.'),
    //     { placement: 'bottom-start' },
    // )

    const actionTitle = isAutoVault ? (
        <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
            {t('Recent SPHYNX profit')}
        </Text>
    ) : (
        <>
            <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
                {earningToken[index].symbol}{' '}
            </Text>
            <Text fontSize="12px" bold color="white" as="span" textTransform="uppercase">
                {t('Earned')}
            </Text>
        </>
    )

    if (!account) {
        return (
            <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems='center'>
                <TokenImage src={SphynxTokenLogo} alt="token" />
                <Flex flexDirection="column" alignItems={isMobile ? 'center' : 'flex-start'}>
                    <ActionTitles>{actionTitle}</ActionTitles>
                    <Text fontSize={isMobile ? '15px' : '24px'} color="textDisabled">
                        $0
                    </Text>
                </Flex>
            </Flex>
        )
    }

    if (!userDataLoaded) {
        return (
            <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems='center'>
                <TokenImage src={SphynxTokenLogo} alt="token" />
                <Flex flexDirection="column">
                    <ActionTitles>{actionTitle}</ActionTitles>
                </Flex>
            </Flex>
        )
    }
    return (
        <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems='center'>
            <TokenImage src={SphynxTokenLogo} alt="token" />
            <Flex flexDirection="column" alignItems={isMobile ? 'center' : 'flex-start'}>
                <ActionTitles>{actionTitle}</ActionTitles>
                <Flex>
                    <>
                        {hasEarnings ? (
                            <>
                                {/* <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={earningTokenBalance} /> */}
                                {earningTokenPrice > 0 && (
                                    <Balance
                                        display="inline"
                                        fontSize={isMobile ? '15px' : '24px'}
                                        color="white"
                                        decimals={2}
                                        prefix="$"
                                        value={earningTokenDollarBalance}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {/* <Heading color="textDisabled">0</Heading> */}
                                <Text fontSize={isMobile ? '15px' : '24px'} color="textDisabled">
                                    $0
                                </Text>
                            </>
                        )}
                    </>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default TokenLogo
