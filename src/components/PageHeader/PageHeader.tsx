import React from 'react'
import styled from 'styled-components'
import { Box } from '@sphynxdex/uikit'
import Container from '../Layout/Container'

const Outer = styled(Box)<{ background?: string }>`
  background: transparent;
  border-radius: 8px;
  width: 100%;
  margin: 0px;
  max-width: none;
  > div {
    max-width: none;
  }
`

const Inner = styled(Container)``

const PageHeader: React.FC<{ background?: string }> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
