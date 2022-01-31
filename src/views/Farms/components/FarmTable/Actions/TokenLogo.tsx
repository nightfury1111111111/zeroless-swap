import React from 'react'
import { useMatchBreakpoints, Flex, Text } from '@sphynxdex/uikit'
import BigNumber from 'bignumber.js'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import Balance from 'components/Balance'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import SphynxTokenLogo from 'assets/images/MainLogo.png'
import styled from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { ActionTitles, ActionContent } from './styles'

const TokenImage = styled.img`
    height: 40px;
    ${({ theme }) => theme.mediaQueries.xs} {
        height: 50px;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
        height: 70px;
    }
`

interface HarvestActionProps extends FarmWithStakedValue {
    userDataReady: boolean
}

const TokenLogo: React.FunctionComponent<HarvestActionProps> = ({ userData, userDataReady }) => {
    const { chainId } = useActiveWeb3React()
    const { isXl } = useMatchBreakpoints()
    const isMobile = !isXl
    const { t } = useTranslation()
    const earningsBigNumber = new BigNumber(userData.earnings)
    const cakePrice = usePriceCakeBusd(chainId)
    let earnings = BIG_ZERO
    let earningsBusd = 0

    // If user didn't connect wallet default balance will be 0
    if (!earningsBigNumber.isZero()) {
        earnings = getBalanceAmount(earningsBigNumber)
        earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
    }

    return (
        <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems='center'>
            <TokenImage src={SphynxTokenLogo} alt="token" />
            <Flex flexDirection="column" alignItems={isMobile ? 'center' : 'flex-start'}>
                <ActionTitles>
                    <Text bold textTransform="uppercase" color="white" fontSize="12px" pr="4px">
                        SPHYNX
                    </Text>
                    <Text bold textTransform="uppercase" color="white" fontSize="12px">
                        {t('Earned')}
                    </Text>
                </ActionTitles>
                <ActionContent>
                    {earningsBusd >= 0 && (
                        <Balance fontSize={isMobile ? '15px' : '24px'} color="white" decimals={2} value={earningsBusd} prefix="$" />
                    )}
                </ActionContent>
            </Flex>
        </Flex >
    )
}

export default TokenLogo
