import React from 'react'
import { HelpIcon, useTooltip, Box, BoxProps } from '@sphynxdex/uikit'
import styled from 'styled-components'

interface Props extends BoxProps {
  text: string | React.ReactNode
}

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`

const QuestionHelper: React.FC<Props> = ({ text, ...props }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement: document.body.clientWidth > 768 ? 'right-end' : 'top-end', trigger: 'hover' })

  return (
    <Box {...props}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        <HelpIcon color="white" width="16px" />
      </QuestionWrapper>
    </Box>
  )
}

export default QuestionHelper
