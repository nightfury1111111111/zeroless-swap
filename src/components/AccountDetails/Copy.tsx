import React from 'react'
import styled from 'styled-components'
import { CheckCircle, Copy } from 'react-feather'
import useCopyClipboard from 'hooks/useCopyClipboard'

import { LinkStyledButton } from '../Shared'

const CopyIcon = styled(LinkStyledButton)`
  color: ${({ theme }) => theme.colors.textDisabled};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`

const TransactionStatusText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.825rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
`

interface CopyHelperProps {
  toCopy: string,
}

const CopyHelper: React.FC<CopyHelperProps> = ({ toCopy, children }) => {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <CopyIcon onClick={() => setCopied(toCopy)} aria-label="copy helper">
      {isCopied ? (
        <TransactionStatusText>
          <CheckCircle size="16" />
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <Copy size="16" />
        </TransactionStatusText>
      )}
      {isCopied ? '' : children}
    </CopyIcon>
  )
}

export default CopyHelper
