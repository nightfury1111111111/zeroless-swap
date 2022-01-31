import React from 'react'
import styled from 'styled-components'
import { Card } from '@sphynxdex/uikit'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 436px;
  width: 100%;
  z-index: 1;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
const AppBody: React.FC = ({ children }) => {
  return <BodyWrapper>{children}</BodyWrapper>
}

export default AppBody
