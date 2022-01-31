/* eslint-disable */
import Web3 from 'web3'
import { ethers } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useEffect, useMemo, useState, useCallback } from 'react'
import lottery from 'assets/abis/lottery.json'
import sphynx from 'assets/abis/sphynx.json'
import { simpleRpcProvider } from '../utils/providers'
import { getLotteryV2Address, getSphynxAddress } from 'utils/addressHelpers'
import getNodeUrl from 'utils/getRpcUrl'
import { reverseString } from 'utils'

const lotteryAddress = getLotteryV2Address()
const sphynxAddress = getSphynxAddress()

const providerURL = getNodeUrl()
let web3 = new Web3(new Web3.providers.HttpProvider(providerURL))

const abi: any = lottery.abi
const lotteryContract = new ethers.Contract(lotteryAddress, abi, simpleRpcProvider)
const lotteryContractWeb3 = new web3.eth.Contract(abi, lotteryAddress)
const spxAbi: any = sphynx.abi
const sphxContractWeb3 = new web3.eth.Contract(spxAbi, sphynxAddress)
const sphxContract = new ethers.Contract(sphynxAddress, spxAbi, simpleRpcProvider)

const deepEqual = (object1, object2) => {
  if (object1 === null || object2 === null) return false
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false
    }
  }

  return true
}

const isObject = (object) => {
  return object != null && typeof object === 'object'
}

export const useLotteryBalance = () => {
  const [balance, setBalance] = useState(0)
  const [roundID, setRoundID] = useState(0)
  const [lotteryInfo, setLotteryInfo] = useState(null)
  const [fetchFlag, setRefetch] = useState(true)

  const { account } = useActiveWeb3React()

  useMemo(() => {
    const ac = new AbortController();
    const fetchLotteryID = async () => {
      try {
        await lotteryContractWeb3.methods
          .viewCurrentLotteryId()
          .call()
          .then((data) => {
            setRoundID(data)
          })
          .catch((err) => {
            console.log(' viewCurrentLotteryId error', err)
          })
      } catch {
        console.error('fetch Round error')
      }
    }

    const getBalance = async () => {
      try {
        const data = await sphxContractWeb3.methods.balanceOf(account).call()
        setBalance(data / 10 ** 18)
      } catch {
        console.error('balace try error')
        setBalance(0)
      }
    }

    const viewLotterys = async (rID) => {
      try {
        const data = await lotteryContractWeb3.methods.viewLottery(rID).call()
        if (!deepEqual(data, lotteryInfo)) {
          setLotteryInfo(data)
        }
      } catch {}
    }
    if (fetchFlag) {
      fetchLotteryID()
      getBalance()
      viewLotterys(roundID)
    }

    return () => ac.abort();
  }, [roundID, account, fetchFlag])
  return { balance, roundID, lotteryInfo, setRefetch }
}

export const approveCall = async (signer, setConfig, setToastMessage) => {
  try {
    await sphxContract
      .connect(signer)
      .approve(lotteryAddress, '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      .then(() => {
        setConfig(true)
        setToastMessage({ title: 'Success', message: 'Approved your request' })
        return true
      })
      .catch((err) => {
        setToastMessage({ title: 'Enabled Error', message: err.message })
        return false
      })
    return false
  } catch {
    return false
  }
}

export const buyTickets = async (signer, roundID, ticketNumbers, setConfig, setToastMessage) => {
  try {
    const tx = await lotteryContract.connect(signer).buyTickets(roundID, ticketNumbers)
    const receipt = await tx.wait()
    if (receipt.status === 1) {
      setToastMessage({
        title: 'Success ',
        message: 'Successfully purchase '.concat(ticketNumbers.length.toString()).concat(' tickets'),
      })
      setConfig(true)
    } else setToastMessage({ title: 'Error ', message: 'Transaction failed' })
  } catch {
    setToastMessage({ title: 'Confirm Error', message: 'error' })
  }
}

export const viewLotterys = async (rID, lastLoteryInfo, setLastLottery) => {
  try {
    const data = await lotteryContractWeb3.methods.viewLottery(rID).call()
    if (!deepEqual(lastLoteryInfo, data)) setLastLottery(data)
  } catch {
    setLastLottery(null)
  }
}

export const getApproveAmount = async (account: string) => {
  const response = await sphxContractWeb3.methods.allowance(account, lotteryAddress).call()
  return response
}

export const viewUserInfoForLotteryId = async (
  account: string,
  lotteryId: string,
  cursor: number,
  perRequestLimit: number,
  setUserInfoTickets: any,
) => {
  if (!account) return null
  try {
    const response = await lotteryContract.viewUserInfoForLotteryId(
      account,
      lotteryId,
      cursor.toString(),
      perRequestLimit.toString(),
    )
    const dataArray = response[0].map((item, index) => {
      return {
        id: response[0][index].toString(),
        ticketnumber: reverseString(response[1][index].toString()),
        status: response[2][index],
      }
    })
    setUserInfoTickets(dataArray)
  } catch (error) {
    console.error('viewUserInfoForLotteryId', error)
    return null
  }
}

export const processRawTicketsResponse = (ticketsResponse) => {
  const [ticketIds, ticketNumbers, ticketStatuses] = ticketsResponse

  if (ticketIds?.length > 0) {
    return ticketIds.map((ticketId, index) => {
      return {
        id: ticketId.toString(),
        number: ticketNumbers[index].toString(),
        status: ticketStatuses[index],
      }
    })
  }
  return []
}

export const claimTickets = async (signer, roundID, ticketIds, brackets, setToastMessage) => {
  try {
    await lotteryContract
      .connect(signer)
      .claimTickets(roundID, ticketIds, brackets)
      .then((data) => {
        setToastMessage({ title: 'Success ', message: 'Successfully Claiming Tickets ' })
      })
      .catch((err) => {
        console.log('buyTickets call error', err)
        setToastMessage({ title: 'Error', message: 'Failed Claiming ' })
      })
  } catch {
    console.error('claimTickets Round error')
  }
}
