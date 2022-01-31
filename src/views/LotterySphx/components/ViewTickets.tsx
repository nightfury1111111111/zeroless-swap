/* eslint-disable */

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Modal, InjectedModalProps, Button, Input } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Spinner from 'components/Loader/Spinner'
import { useLotteryBalance, viewUserInfoForLotteryId, claimTickets } from '../../../hooks/useLottery'
import useToast from 'hooks/useToast'

// eslint-disable

const ApplyButton = styled(Button)`
  bottom: 16px;
  outline: none;
  background: ${({ theme }) => theme.custom.pancakePrimary};
  &:active {
    outline: none;
  }
  &:hover {
    outline: none;
  }
  &:focus {
    outline: none;
  }
`
const TicketContainer = styled(Flex)`
  & > input:first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
  & > input:last-child {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
`

const TicketInput = styled(Input)`
  bottom: 16px;
  outline: none;
  background: white;
  border-radius: inherit;
  color: black;
  &:active {
    outline: none;
  }
  &:hover {
    outline: none;
  }
  &:focus {
    outline: unset;
    box-shadow: unset !important;
    border: unset;
  }
`
interface ViewTicketModalProps extends InjectedModalProps {
  roundID: string
  winningCards: any
}

const ViewTicketModal: React.FC<ViewTicketModalProps> = ({ roundID, winningCards, onDismiss }) => {
  const { account, library } = useActiveWeb3React()
  const signer = library.getSigner()
  const [isLoading, setLoading] = useState(false)
  const [isFetch, setIsFetch] = useState(false)
  const { t } = useTranslation()
  const [userTicketInfos, setInfoTickets] = React.useState([])
  const [isClaimable, setClaimable] = React.useState(true)
  const { toastSuccess, toastError } = useToast()

  interface ToastMessage {
    title: string
    message: string
  }

  const setToastMessage = (toastMessage: ToastMessage) => {
    if (toastMessage.title !== '' && toastMessage.title.includes('Error')) {
      toastError(t(toastMessage.title), t(toastMessage.message))
    }
    if (toastMessage.title !== '' && toastMessage.title.includes('Success')) {
      toastSuccess(t(toastMessage.title), t(toastMessage.message))
    }
  }

  const setTickets = (tickets) => {
    setInfoTickets(tickets)
    if (userTicketInfos?.length > 0) {
      userTicketInfos.map((item) => {
        if (item.status === true) {
          setClaimable(false)
        }
      })
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      await viewUserInfoForLotteryId(account, roundID.toString(), 0, 2500, setTickets)
      setTimeout(() => setIsFetch(true), 2000)
    }
    fetchData()
  }, [account, roundID])

  const handleClaimTickets = async () => {
    const ticketIDS = []
    const brackets = []
    userTicketInfos.map((ticket) => {
      let bracket = -1
      for (let i = 0; i <= 5; i++) {
        if (ticket.ticketnumber.charAt(i) !== winningCards[i]) {
          break
        }
        bracket = i
      }
      if (bracket >= 0) {
        ticketIDS.push(ticket.id)
        brackets.push(bracket)
      }
    })
    setLoading(true)
    if (ticketIDS.length === 0) {
      toastError('Notification', 'You have no tickets to claim')
      onDismiss()
      return
    }
    await claimTickets(signer, roundID, ticketIDS, brackets, setToastMessage)
    setLoading(false)
  }

  return (
    <Modal
      title={'Round '.concat(roundID.toString()).concat(' Tickets')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ minWidth: '380px', maxWidth: '380px' }}
    >
      {userTicketInfos.length > 0 && (
        <Flex flexDirection="column" color="white">
          {userTicketInfos?.map((ticket, index) => (
            <Flex key={index} flexDirection="column" marginBottom="12px">
              <Text fontSize="13px" mb="8px">
                #
                {ticket.id.length === 1
                  ? '00'.concat(ticket.id)
                  : ticket.id.length === 2
                  ? '0'.concat(ticket.id)
                  : ticket.id}
              </Text>
              <TicketContainer>
                {ticket.ticketnumber.split('').map((ticketChar, subIndex) =>
                  subIndex !== 6 ? (
                    <TicketInput
                      key={subIndex}
                      id={index.toString().concat(subIndex).concat('videw-ticket')}
                      placeholder="0"
                      scale="lg"
                      value={ticketChar}
                      onChange={null}
                      readOnly={true}
                      style={{
                        textAlign: 'center',
                        border: !ticket.error ? 'none' : '1px red',
                        borderRadius: 'none !important',
                      }}
                      maxLength={1}
                      pattern="\d*"
                    />
                  ) : (
                    <></>
                  ),
                )}
              </TicketContainer>
            </Flex>
          ))}

          {isClaimable && (
            <ApplyButton className="selected" onClick={handleClaimTickets} style={{ width: '100%', marginTop: '20px' }}>
              {isLoading ? <Spinner /> : t(`Check Tickets`)}
            </ApplyButton>
          )}
        </Flex>
      )}
      {userTicketInfos.length === 0 && isFetch === false && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {userTicketInfos.length === 0 && isFetch === true && (
        <Flex justifyContent="center">
          <Flex style={{ color: 'red', margin: '20px 0px', fontSize: '24px', textAlign: 'center' }}>
            You have no tickets on this round.
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}

export default ViewTicketModal
