import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, LinkExternal, Skeleton } from '@sphynxdex/uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  totalValueFormatted?: string
  lpLabel?: string
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  color: white;
  font-size: 16px;
  > svg {
    fill: white;
  }
`

const SmallLinkExternal = styled(LinkExternal)`
  font-size: 12px;
  font-weight: 400;
  flex-flow: row-reverse;
  color: white;
  > svg {
    width: 15px;
    fill: white;
    margin-right: 3px;
    margin-left: 0px;
  }
`

const BorderFlex = styled(Flex)`
  color: white;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.custom.global};
  padding: 8px;
`

const UnderLineFlex = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.custom.divider};
  padding: 9px 0;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  infoAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <UnderLineFlex justifyContent="space-between">
        <Text color="white" fontSize="14px" bold>{t('Total Liquidity')}:</Text>
        {totalValueFormatted ? <Text color="#F2C94C" fontSize="14px">{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
      </UnderLineFlex>
      <Flex alignItems='center' flexDirection='column'>
        {!removed && (
          <StyledLinkExternal mt='12px' href={addLiquidityUrl}>{t('Get %symbol%', { symbol: lpLabel })}</StyledLinkExternal>
        )}
        <Flex alignItems='center' flexDirection='row' pt='10px'>
          <BorderFlex mr='2px'>
            <SmallLinkExternal href={bscScanAddress}>{t('View Contract')}</SmallLinkExternal>
          </BorderFlex>
          <BorderFlex ml='2px'>
            <SmallLinkExternal href={infoAddress}>{t('See Pair Info')}</SmallLinkExternal>
          </BorderFlex>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection
