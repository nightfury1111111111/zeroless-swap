import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Flex, useMatchBreakpoints } from '@sphynxdex/uikit'
import styled from 'styled-components'
import Spinner from 'components/Loader/Spinner'
import axios from 'axios'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMenuToggle } from 'state/application/hooks'
import Pagination from '@material-ui/lab/Pagination'
import { PaginationWrapper } from 'views/Launchpad/ListingsStyles'
import { LOCK_NUM_PER_PAGE } from 'config/constants/lock'
import SearchPannel from './SearchPannel'
import TokenCard from './TokenCard'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  padding: 5px;
  margin-top: 24px;
  text-align: center;
  font-weight: bold;
  p {
    line-height: 24px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
  }
`

const SaleInfo = styled.div`
    display: flex;
    justify-content: space-between;
`

const SaleInfoTitle = styled.div`
    color: white;
    font-weight: 600;
    font-size: 14px;
    margin-right: 5px;
`

const SaleInfoValue = styled.div`
    color: #F2C94C;
    font-weight: 600;
    font-size: 14px;
`

const TokenListContainder = styled.div<{ toggled: boolean }>`
  margin-top: 24px;
  display: grid;
  grid-gap: 20px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: ${(props) => (props.toggled ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)')};
  }
  @media screen and (min-width: 1600px) {
    grid-template-columns: ${(props) => (props.toggled ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)')};
  }
  @media screen and (min-width: 1920px) {
    grid-template-columns: ${(props) => (props.toggled ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)')};
  }
`

const TokenLocker: React.FC = () => {
  const { t } = useTranslation()
  const { menuToggled } = useMenuToggle()
  const { chainId } = useActiveWeb3React()
  const [tokenList, setTokenList] = useState(null)
  const [searchKey, setSearchKey] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        chain_id: chainId,
        type: false, /* token lock type */
        key: searchKey,
        page_index: pageIndex,
        num_per_page: LOCK_NUM_PER_PAGE,
      }
      axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/getAllTokenLockInfo`, { data }).then(async (response) => {
        if (response.data) {
          console.log("response", response.data)
          let pages = 1
          if(response.data.length > 0)
           pages = Math.ceil(parseInt(response.data[0].count) / LOCK_NUM_PER_PAGE)
          setPageCount(pages)
          setTokenList(response.data)
        }
      })
    }

    if (chainId)
      fetchData()
  }, [chainId, searchKey, pageIndex])

  const handlePageIndex = (e, page) => {
    setPageIndex(page - 1)
  }

  return (
    <Wrapper>
      <SearchPannel setSearchKey={setSearchKey} setPageIndex={setPageIndex} />
      {!tokenList && (<Flex justifyContent="center" mb="4px">
        <Spinner />
      </Flex>)}
      {tokenList && (<SaleInfo>
        <SaleInfoTitle>
          Total Token Locks:
        </SaleInfoTitle>
        <SaleInfoValue>
          {!tokenList ? 0 : tokenList.length}
        </SaleInfoValue>
      </SaleInfo>)}
      <TokenListContainder toggled={menuToggled}>
        {tokenList && tokenList.map((cell) => (
          <TokenCard
            key={cell.lock_id}
            id={cell.lock_id}
            tokenLogo={cell.logo_link}
            tokenName={cell.token_name}
            tokenSymbol={cell.token_symbol}
            startTime={cell.start_time}
            endTime={cell.end_time}
            amount={cell.lock_supply}
            vestingRate={100 / cell.vest_num}
            tokenAddress={cell.lock_address}
          />
        ))}
      </TokenListContainder>
      <PaginationWrapper>
        <Pagination
          count={pageCount}
          siblingCount={0}
          onChange={handlePageIndex}
        />
      </PaginationWrapper>
    </Wrapper>
  )
}

export default TokenLocker
