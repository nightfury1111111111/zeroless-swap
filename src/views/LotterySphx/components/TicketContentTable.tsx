/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import {FormattedNumber} from './FormattedNumber'

const Container = styled.div`
  border-radius: 16px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(4, auto);
  padding: 20px 20px 0px 20px;
`
const GridHeaderItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  text-align: ${(props) => (props.isLeft ? 'left' : 'right')};
  color: white;
  padding-bottom: 20px;
`
const GridItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: ${(props) => (props.isLeft ? 'left' : 'center')};
  color: white;
  padding: 6px 0px;
`

export default function TicketContentTable(lastLoteryInfo) {
  const [latestInfoArray, setLastInfoArray] = React.useState([])
  React.useEffect(() => {
    const newArray = []
    if (lastLoteryInfo !== null && lastLoteryInfo !== undefined) {
      for (let i = 6; i > 0; i--) {
        newArray.push({
          number: i,
          tokens: (parseInt(lastLoteryInfo.lastLoteryInfo?.sphynxPerBracket[i - 1]) / 10 ** 18).toFixed(5),
          matchNumber: lastLoteryInfo.lastLoteryInfo?.countWinnersPerBracket[i - 1],
        })
      }
    }
    setLastInfoArray(newArray)
  }, [lastLoteryInfo])

  const { t } = useTranslation()
  return (
    <Container>
      <Grid>
        <GridHeaderItem isLeft>{t('Matched')}</GridHeaderItem>
        <GridHeaderItem isLeft={false}>{t('Winners')}</GridHeaderItem>
        <GridHeaderItem isLeft={false}>{t('Amount')}</GridHeaderItem>
        {latestInfoArray.map((item, index) => (
          <React.Fragment key={index}>
            <GridItem isLeft>{item.number}</GridItem>
            <GridItem isLeft={false}>{item.matchNumber}</GridItem>
            <>
              <GridItem isLeft>
                <div style={{ textAlign: 'right' }}>
                  <FormattedNumber prefix="" value={item.tokens} suffix=' SPHYNX'/>
                </div>
              </GridItem>
            </>
          </React.Fragment>
        ))}
      </Grid>
    </Container>
  )
}
