import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useToast from 'hooks/useToast'
import styled from 'styled-components'

const TokenInputWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  ${({ theme }) => theme.mediaQueries.xl} {
    align-items: flex-end;
  }
`

const Number = styled.div`
  background: ${({ theme }) => theme.custom.gradient};
  // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  width: 28px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 4px;
  margin-right: 8px;
  margin-top: 4px;
`
const InputSectionWrapper = styled.div`
  width: 100%;
  text-align: left;
  font-weight: bold;
  line-height: 24px;
  color: white;
  margin-bottom: 12px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 20%;
    margin-bottom: 0px;
  }
`

const MyInput = styled.input`
  // background: ${({ theme }) => (theme ? '#0E0E26' : '#2A2E60')};
  background: ${({ theme }) => theme.custom.tertiary};
  border-radius: 5px;
  border: 1px solid #4a5187;
  padding: 10px 14px;
  padding-inline-start: 12px;
  height: 38px;
  color: white;
  border: none;
  outline: none;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.custom.pancakePrimary};
  }
`

const FillBtn = styled.button`
  height: 35px;
  background: ${({ theme }) => theme.custom.gradient};
  // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  width: 125px;
  border: 1px solid ${({ theme }) => theme.custom.pancakePrimary};
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 2px;
  &:hover {
    background: linear-gradient(90deg, #722da9 0%, #e44bd4 100%);
    border: 1px solid #9b3aab;
  }
  &:disabled {
    background: linear-gradient(90deg, #722da9 0%, #e44bd4 100%);
    border: 1px solid #444;
    cursor: not-allowed;
  }
`

const GroupLayout = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: -webkit-fill-available;
  flex-direction: column;
  align-items: flex-start;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
    align-items: flex-end;
  }
`

const TokenSection = (props) => {
  const { toastSuccess, toastError } = useToast()
  const { tokenNumber, initialData } = props
  const [tokenData, setTokenData] = useState({
    tokenAddress: '',
    tokenName: '',
    tokenSymbol: '',
    chainId: 0,
  })

  useEffect(() => {
    setTokenData({
      tokenAddress: initialData.token_address,
      tokenName: initialData.token_name,
      tokenSymbol: initialData.token_symbol,
      chainId: initialData.chain_id,
    })
  }, [initialData])
  const handleChange = (e) => {
    console.log(e.target.value)
    // setTokenAddress(e.target.value)
    setTokenData({
      ...tokenData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdate = async () => {
    const data = {
      tokenAddress: tokenData.tokenAddress,
      tokenName: tokenData.tokenName,
      tokenSymbol: tokenData.tokenSymbol,
      chainId: tokenData.chainId,
      id: tokenNumber,
    }

    axios
      .post(`${process.env.REACT_APP_BACKEND_API_URL2}/updateTrendingInfo`, data)
      .then((res) => {
        toastSuccess('Success', 'Operation Successfully!')
      })
      .catch((err) => {
        toastError('Error', 'Your action is failed!')
      })
  }

  return (
    <TokenInputWrapper>
      <Number>{tokenNumber}</Number>
      <GroupLayout>
        <InputSectionWrapper>
          <p className="description">Token Address</p>
          <MyInput
            onChange={handleChange}
            name="tokenAddress"
            value={tokenData.tokenAddress}
            style={{ width: '100%' }}
          />
        </InputSectionWrapper>
        <InputSectionWrapper>
          <p className="description">Token Name</p>
          <MyInput onChange={handleChange} name="tokenName" value={tokenData.tokenName} style={{ width: '100%' }} />
        </InputSectionWrapper>
        <InputSectionWrapper>
          <p className="description">Token Symbol</p>
          <MyInput onChange={handleChange} name="tokenSymbol" value={tokenData.tokenSymbol} style={{ width: '100%' }} />
        </InputSectionWrapper>
        <InputSectionWrapper>
          <p className="description">Chain ID</p>
          <MyInput onChange={handleChange} name="chainId" value={tokenData.chainId} style={{ width: '100%' }} />
        </InputSectionWrapper>
        <FillBtn onClick={handleUpdate}>Update</FillBtn>
      </GroupLayout>
    </TokenInputWrapper>
  )
}

export default TokenSection
