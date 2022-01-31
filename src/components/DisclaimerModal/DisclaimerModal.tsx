import React, { useState } from 'react'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBody,
  InjectedModalProps,
  Heading,
  Text,
  Checkbox,
  Button,
  Link,
} from '@sphynxdex/uikit'
import styled from 'styled-components'
import { TERMS_LIST } from './config'

const StyledModalContainer = styled(ModalContainer)`
  font-size: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 420px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 900px;
  }
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 26px;
`

const TermRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`

const ButtonRow = styled.div`
  display: flex;
  margin-top: 20px;
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const CheckGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const CheckboxWrapper = styled.div`
  width: 32px;
  height: 32px;
`

interface DisclaimerModalProps extends InjectedModalProps {
  modalState?: true,
}

export default function DisclaimerModal({ onDismiss = () => null, modalState }: DisclaimerModalProps) {

  const CHECKEDARRAY_LEN = 10
  const [arrayCheckedState, setArrayCheckedState] = useState([])

  const handleChangeCheckbox = (index: number) => {
    const arr = [...arrayCheckedState]

    if (arr.indexOf(index) > -1) {
      arr.splice(arr.indexOf(index), 1)
      if (index !== CHECKEDARRAY_LEN - 1 && arr.length === CHECKEDARRAY_LEN - 1) {
        arr.splice(arr.indexOf(CHECKEDARRAY_LEN - 1), 1)
      }
      if (index === CHECKEDARRAY_LEN - 1) {
        setArrayCheckedState([])
        return
      }
    } else {
      arr.push(index)
      if (index === CHECKEDARRAY_LEN - 1) {
        for (let i = 0; i < CHECKEDARRAY_LEN; i++) {
          if (arr.indexOf(i) < 0) {
            arr.push(i)
          }
        }
      } else if (arr.length === CHECKEDARRAY_LEN - 1) {
        arr.push(CHECKEDARRAY_LEN - 1)
      }
    }

    setArrayCheckedState(arr)
  }

  const handleConfirm = () => {
    onDismiss()
  }

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>Disclaimer</Heading>
        </ModalTitle>
      </ModalHeader>
      <StyledModalBody>
        <Text fontSize="18px">Please read the Terms and Conditions then agree to all the following to proceed!</Text>
        <CheckGroup>
          {TERMS_LIST.map((item, index) => (
            <TermRow key={item.id}>
              <CheckboxWrapper>
                <Checkbox
                  type="checkbox"
                  key={item.id}
                  checked={(arrayCheckedState.indexOf(index) > -1) as boolean}
                  onChange={() => handleChangeCheckbox(index)}
                />
              </CheckboxWrapper>
              <Text fontSize="16px">{item.text}</Text>
            </TermRow>
          ))}
        </CheckGroup>
        <ButtonRow>
          <ButtonWrapper>
            <Link href="/launchpad">
              <Button style={{borderRadius: "5px"}}>CANCEL</Button>
            </Link>
          </ButtonWrapper>
          <ButtonWrapper>
            <Button  style={{borderRadius: "5px"}} onClick={handleConfirm} disabled={arrayCheckedState.length !== CHECKEDARRAY_LEN}>
              CONFIRM
            </Button>
          </ButtonWrapper>
        </ButtonRow>
      </StyledModalBody>
    </StyledModalContainer>
  )
}
