import React, { useState, useEffect } from 'react'
import axios from "axios"
import styled from 'styled-components'
import { Flex, Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import Card from 'components/Card'
import PageHeader from 'components/PageHeader'
import Page from 'components/Layout/Page'
import TokenSection from './components/TokenSection'

const Separate = styled.div`
  margin-top: 32px;
`

const Trending = () => {
  const { t } = useTranslation()
  const [realData, setRealData] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_API_URL2}/getTrending`)
    .then(res => {
      const { data } = res
      setRealData(data)
    })
  }, [])

  return (
    <>
      <div style={{ height: 24 }} />
      <PageHeader>
        <Flex>
          <Flex flexDirection="column" ml="10px">
            <Text fontSize="26px" color="white" bold>
              {t('Trending')}
            </Text>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Card borderRadius="0 0 3px 3px" padding="20px 10px">
          <TokenSection tokenNumber={1} initialData={realData[0] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={2} initialData={realData[1] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={3} initialData={realData[2] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={4} initialData={realData[3] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={5} initialData={realData[4] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={6} initialData={realData[5] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={7} initialData={realData[6] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={8} initialData={realData[7] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={9} initialData={realData[8] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={10} initialData={realData[9] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={11} initialData={realData[10] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={12} initialData={realData[11] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={13} initialData={realData[12] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={14} initialData={realData[13] ?? {}}/>
          <Separate />
          <TokenSection tokenNumber={15} initialData={realData[14] ?? {}}/>
        </Card>
      </Page>
    </>
  )
}

export default Trending