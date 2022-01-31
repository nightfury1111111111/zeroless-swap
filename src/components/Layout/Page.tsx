import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import { usePriceCakeBusd } from 'state/farms/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Container from './Container'

const StyledPage = styled(Container)`
  width: 100%;
  max-width: none;
  min-height: calc(100vh - 64px);
  padding: 0px 0px 16px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 10px 10px 24px 10px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 15px 15px 32px 15px;
  }
`

const PageMeta = () => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const { pathname } = useLocation()
  const cakePriceUsd = usePriceCakeBusd(chainId)
  const cakePriceUsdDisplay = cakePriceUsd.gt(0)
    ? `$${cakePriceUsd.toNumber().toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`
    : ''

  const pageMeta = getCustomMeta(pathname, t) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  const pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  )
}

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  )
}

export default Page
