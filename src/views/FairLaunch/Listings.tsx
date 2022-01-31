import React, { useEffect, useState, useMemo } from 'react'
import Pagination from '@material-ui/lab/Pagination'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import axios from 'axios'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { FILTER_OPTION, FAIRLAUNCH_NUM_PER_PAGE } from 'config/constants/fairlaunch'
import { getFairLaunchContract } from 'utils/contractHelpers'
import ListIcon from 'assets/svg/icon/ListIcon.svg'
import { useMenuToggle } from 'state/application/hooks'
import Spinner from 'components/Loader/Spinner'
import TokenCard from './components/TokenCard'
import SearchPannel from './components/SearchPanel'

import {
  Wrapper,
  HeaderWrapper,
  TitleWrapper,
  Title,
  LogoTitle,
  TokenListContainder,
  PaginationWrapper,
} from './ListingsStyles'

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const FairLaunchListing: React.FC = () => {
  const { chainId, library } = useActiveWeb3React()
  const { t } = useTranslation()
  const { menuToggled } = useMenuToggle()
  const [tokenList, setTokenList] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterOption, setFilterOption] = useState(FILTER_OPTION.ALL)
  const [searchKey, setSearchKey] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const fairLaunchContract = useMemo(() => getFairLaunchContract(library, chainId), [library])

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        filter: filterOption,
        chain_id: chainId,
        key: searchKey,
        page_index: pageIndex,
        num_per_page: FAIRLAUNCH_NUM_PER_PAGE,
      }

      axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/getAllFairLaunchInfo`, data).then(async (response) => {
        if (response.data) {
          let pages = 1
          if (response.data.length > 0) pages = Math.ceil(parseInt(response.data[0].count) / FAIRLAUNCH_NUM_PER_PAGE)
          setPageCount(pages)
          try {
            const list = await Promise.all(
              response.data.map(async (cell) => {
                const item = {
                  launch_id: cell.launch_id,
                  ownerAddress: cell.owner_address,
                  tokenName: cell.token_name,
                  tokenSymbol: cell.token_symbol,
                  tokenLogo: cell.logo_link,
                  launchTime: cell.launch_time,
                  tokenAmount: cell.token_amount,
                  nativeAmount: cell.native_amount,
                  tokenState: 'active',
                }

                const isLaunched = await fairLaunchContract.isLaunched(cell.launch_id.toString())
                /* is deposited */
                const now = Math.floor(new Date().getTime() / 1000)
                if (parseInt(cell.launch_time) > now) {
                  item.tokenState = 'upcoming'
                } else if (isLaunched) {
                  item.tokenState = 'success'
                } else if (now >= parseInt(cell.launch_time) && now <= (parseInt(cell.launch_time) + 600)) {
                  item.tokenState = 'active'
                } else {
                  item.tokenState = 'failed'
                }
                return item
              }),
            )
            setTokenList(list)
            setIsLoading(false)
          } catch (error) {
            console.log('error', error)
            setIsLoading(false)
          }
        }
      })
    }

    if (chainId) fetchData()
  }, [chainId, filterOption, pageIndex, searchKey, fairLaunchContract])

  const handlePageIndex = (e, page) => {
    setPageIndex(page - 1)
  }

  return (
    <Wrapper>
      <HeaderWrapper>
        <TitleWrapper>
          <img src={ListIcon} alt="listIcon" />
          <Title>
            <LogoTitle>Fair LaunchPad Directory</LogoTitle>
          </Title>
        </TitleWrapper>
      </HeaderWrapper>
      <SearchPannel setSearchOption={setFilterOption} setSearchKey={setSearchKey} setPageIndex={setPageIndex} />
      {isLoading && (
        <LoadingWrapper>
          <Spinner />
        </LoadingWrapper>
      )}
      <TokenListContainder toggled={menuToggled}>
        {tokenList &&
          tokenList.map((item) => (
            <TokenCard
              key={item.launch_id}
              launchId={item.launch_id}
              ownerAddress={item.ownerAddress}
              tokenName={item.tokenName}
              tokenSymbol={item.tokenSymbol}
              tokenLogo={item.tokenLogo}
              tokenAmount={item.tokenAmount}
              nativeAmount={item.nativeAmount}
              tokenState={item.tokenState}
              launchTime={item.launchTime}
            >
              <img src={item.tokenLogo} alt="token icon" />
            </TokenCard>
          ))}
      </TokenListContainder>
      <PaginationWrapper>
        <Pagination count={pageCount} siblingCount={0} onChange={handlePageIndex} />
      </PaginationWrapper>
    </Wrapper>
  )
}

export default FairLaunchListing
