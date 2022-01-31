import React from 'react'
import { ReactComponent as BscscanIcon } from 'assets/svg/icon/Bscscan.svg'
import Column from 'components/Column'
import styled, { useTheme } from 'styled-components'
import { Flex, Text, useMatchBreakpoints } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import DefaultImg from 'assets/images/MainLogo.png'

interface TokenStateProps {
  tokenImg?: string
  cardTitle?: string
  cardValue?: string
  subPriceValue?: string
  variantFill?: boolean
  valueActive?: boolean
  flexGrow?: number
  CardIcon?: any
  fillColor?: string
  tokenAddress?: string
}

const TokenTitleCard = styled(Column)<{ variantFill; flexGrow; fillColor }>`
  background: ${({ variantFill, fillColor, theme }) =>
    fillColor ? `${fillColor}` : variantFill ? theme.custom.connectButton : ''};
  border: 1px solid ${({ theme, fillColor }) => (fillColor ? 'transparent' : theme.colors.primary)};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: ${({ flexGrow }) => flexGrow};
  height: 91px;
`

const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #202342;
  margin-bottom: 12px;
`

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  height: ${({ size }) => (size ? `${size}px` : '32px')};
  width: ${({ size }) => (size ? `${size}px` : '32px')};
  span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const TokenDescription = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  div:nth-child(2) {
    width: 100%;
  }
  div:nth-child(3) {
    width: 100%;
  }
`

const MobileIconWrapper = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: unset
  }
`

export default function TokenStateCard(props: TokenStateProps) {
  const { tokenImg, cardTitle, cardValue, subPriceValue, variantFill, valueActive, flexGrow, CardIcon, fillColor, tokenAddress } =
    props
  const { t } = useTranslation()
  const theme = useTheme()

  const { isSm, isXs } = useMatchBreakpoints()
  const isMobile = document.body.clientWidth < 1500

  const onImgLoadError = (event: any) => {
    const elem = event.target
    elem.src = DefaultImg
  }

  return theme.isDark ? (
    <TokenTitleCard variantFill={variantFill} flexGrow={flexGrow} fillColor={undefined}>
      <Flex>
        {tokenImg !== undefined ? (
          <IconWrapper size={60}>
            <img src={tokenImg} width="32" height="32" onError={onImgLoadError} alt="No icon yet" />
          </IconWrapper>
        ) : (
          ''
        )}
        <TokenDescription style={{ width: '100%' }}>
          <Text
            textAlign={tokenImg === undefined ? 'center' : 'unset'}
            color={tokenImg === undefined ? 'white' : 'white'}
            fontSize={isMobile ? '12px' : '13px'}
            bold
          >
            {t(`${cardTitle}`)}
          </Text>
          <Text
            textAlign={tokenImg === undefined ? 'center' : 'unset'}
            fontSize={isXs ? '14px' : isSm ? '15px' : '16px'}
            bold
            color={valueActive ? parseFloat(cardValue) > 0 ? 'limegreen' : 'red' : 'white'}
          >
            {cardValue}
          </Text>
          <Text
            textAlign={tokenImg === undefined ? 'center' : 'unset'}
            fontSize={isMobile ? '14px' : '16px'}
            bold
            color="limegreen"
          >
            {subPriceValue}
          </Text>
        </TokenDescription>
        {tokenAddress !== undefined && isMobile ? (
          <IconWrapper size={60}>
            <a href={`https://bscscan.com/token/${tokenAddress}`} target="_blank" rel="noreferrer">
              <BscscanIcon />
            </a>
          </IconWrapper>
        ) : (
          ''
        )}
      </Flex>
    </TokenTitleCard>
  ) : (
    <TokenTitleCard
      variantFill={variantFill}
      flexGrow={flexGrow}
      fillColor={fillColor}
      style={isMobile ? {} : { height: '183px' }}
    >
      <Flex>
        {CardIcon !== undefined && isMobile ? (
          <MobileIconWrapper>
            <IconWrapper style={{ width: '42px', marginLeft: '8px' }}>
              <CardIcon width="32" height="32" />
            </IconWrapper>
          </MobileIconWrapper>
        ) : (
          ''
        )}
        {tokenImg !== undefined && isMobile ? (
          <IconWrapper size={60}>
            <img src={tokenImg} width="32" height="32" onError={onImgLoadError} alt="No icon yet" />
          </IconWrapper>
        ) : (
          ''
        )}
        <TokenDescription style={{ width: '100%' }}>
          {tokenImg !== undefined && !isMobile ? (
            <ImgWrapper style={{ width: '80px', height: '80px' }}>
              <img src={tokenImg} width="52" height="52" onError={onImgLoadError} alt="No icon yet" />
            </ImgWrapper>
          ) : (
            ''
          )}
          {CardIcon !== undefined && !isMobile ? (
            <>
              <CardIcon />
              <br />
            </>
          ) : (
            ''
          )}
          <Text
            textAlign={tokenImg === undefined ? 'center' : 'unset'}
            color="white"
            fontSize={isMobile ? '12px' : '14px'}
            bold
          >
            {t(`${cardTitle}`)}
          </Text>
          <Text
            textAlign={tokenImg === undefined ? 'center' : 'unset'}
            fontSize={isMobile ? '14px' : '18px'}
            bold
            color="white"
          >
            {cardValue}
          </Text>
          <Text
            textAlign={tokenImg === undefined ? 'center' : 'unset'}
            fontSize={isMobile ? '14px' : '18px'}
            bold
            color="white"
          >
            {subPriceValue}
          </Text>
        </TokenDescription>
        {tokenAddress !== undefined && isMobile ? (
          <IconWrapper size={60}>
            <a href={`https://bscscan.com/token/${tokenAddress}`} target="_blank" rel="noreferrer">
              <BscscanIcon />
            </a>
          </IconWrapper>
        ) : (
          ''
        )}
      </Flex>
    </TokenTitleCard>
  )
}
