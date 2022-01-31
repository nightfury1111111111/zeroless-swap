/* eslint-disable */
import React from 'react'
import styled, { useTheme } from 'styled-components'
import { Box } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { FormattedNumber } from './FormattedNumber'

const Container = styled.div`
  // background: ${({ theme }) => (theme ? '#1A1A3A' : '#20234E')};
  background: ${({ theme }) => theme.custom.background};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(4, auto);
  padding: 15px 20px 0px;
`
const GridHeaderItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: ${(props) => (props.isLeft ? 'left' : 'right')};
  color: white;
  margin-bottom: 20px;
`
const GridItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: ${(props) => (props.isLeft ? 'left' : 'right')};
  color: white;
  padding: 6px 0px;
`

export default function PotContentTable({ isDetail, lotteryInfo }) {
  const [latestInfoArray, setLastInfoArray] = React.useState([])
  React.useEffect(() => {
    const newArray = []
    if (lotteryInfo !== null) {
      for (let i = 6; i > 0; i--) {
        newArray.push({
          number: i,
          tokens:
            (parseInt(lotteryInfo?.sphynxPerBracket[i - 1]) / 10 ** 18) * lotteryInfo?.countWinnersPerBracket[i - 1],
          matchNumber: lotteryInfo?.countWinnersPerBracket[i - 1],
          eachTokens:
            lotteryInfo?.countWinnersPerBracket[i - 1] === '0'
              ? '0'
              : parseInt(lotteryInfo?.sphynxPerBracket[i - 1]) / 10 ** 18,
        })
      }
    }
    setLastInfoArray(newArray)
  }, [lotteryInfo])

  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Container>
      <Box>
        <Grid>
          <GridHeaderItem isLeft style={{ borderRight: `1px solid ${theme.custom.divider}` }}>
            {t('No. Matched')}
          </GridHeaderItem>
          <GridHeaderItem isLeft={false} style={{ borderLeft: `1px solid ${theme.custom.divider}` }}>
            {t('Player Matched')}
          </GridHeaderItem>
        </Grid>
        <Box style={{ borderBottom: `1px solid ${theme.custom.divider}`, margin: '0px 20px' }}></Box>
      </Box>
      <Box overflowY="auto" maxHeight="196px">
        {latestInfoArray.map((item, key) => (
          <Box key={key}>
            <Grid style={{ width: '100%' }} key={key}>
              <GridItem isLeft>{item.number}</GridItem>
              {isDetail ? (
                <>
                  <GridItem isLeft={false}>
                    <Box style={{ textAlign: 'right', color: theme.custom.distributeContent }}>
                      <FormattedNumber prefix="" value={item.tokens} suffix=" SPHYNX" />
                      <Box style={{ fontSize: '12px' }}>
                        <FormattedNumber prefix="" value={item.eachTokens} suffix=" each" />
                      </Box>
                    </Box>
                  </GridItem>
                </>
              ) : (
                <GridItem isLeft={false} style={{ color: theme.custom.distributeContent }}>
                  {item.matchNumber.toString()}
                </GridItem>
              )}
            </Grid>
            <Box style={{ borderBottom: `1px solid ${theme.custom.divider}`, margin: '0px 20px' }}></Box>
          </Box>
        ))}
      </Box>
    </Container>
  )
}
