import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { ReactComponent as BridgeMarkIcon } from 'assets/svg/icon/BridgeMark.svg'
import BridgeCard from './components/BridgeCard'

const Container = styled(Flex)`
  flex-direction: column;
  margin: 35px 10px 0px;
  font-family: Raleway;
  ${({ theme }) => theme.mediaQueries.xl} {
    margin: 35px 30px 0px;
    font-family: Raleway;
  }
`


const Grid = styled.div`
  justify-content: center;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    align-items: baseline;
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: repeat(4, auto);
  }
`

export default function Bridge() {
  const { t } = useTranslation();

  return (
    <Container>
      <Flex>
        <Flex marginRight="14px">
          <BridgeMarkIcon />
        </Flex>
        <Flex flexDirection="column">
          <Text fontSize="26px" fontWeight="600" color="white" lineHeight="110%">
            {t('Bridge')}
          </Text>
          <Text fontSize="15px" fontWeight="600" color="white" lineHeight="130%" mt="12px">
            {t('Transfer funds to other Blockchain Networks')}
          </Text>
        </Flex>
      </Flex>
      <Grid>
        <BridgeCard label="Sphynx To Bridge" isSphynx />
        <BridgeCard label="Other Tokens To Bridge" isSphynx={false} />
      </Grid>
    </Container>
  )
}
