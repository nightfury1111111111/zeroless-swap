/* eslint-disable */
import styled, { ThemeConsumer, useTheme } from 'styled-components'
import { Text, Flex, Box } from '@sphynxdex/uikit'
import LotteryLatestMark from 'assets/svg/icon/LotteryLatestMark.svg'

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.custom.background};
  // background: ${({ theme }) => (theme ? '#1A1A3A' : '#20234E')};
  border-radius: 10px;
  min-height: 400px;
  position: relative;
  ${({ theme }) => theme.mediaQueries.md} {
    min-height: 500px;
  }
`

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  padding: 20px 20px 0px 20px;
  grid-gap: 10px;
`
const GridItem = styled.div`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: center;
  color: white;
  padding: 6px 0px;
`
const WinningNumber = styled(Flex)`
  width: 68px;
  height: 68px;
  background: #0e0e26;
  border-radius: 5px;
  border: 1px solid #2e2e55;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 6px 0px;
`

const WinningNumberContainer = styled(Box)`
  margin-top: 37px ${({ theme }) => theme.mediaQueries.lg} {
    min-width: 87px;
  }
`

export default function LatestWinningCard({ winningCards }) {
  const theme = useTheme()

  return (
    <Container>
      <Flex flexDirection="column" alignItems="center">
        <Box pt="42px">
          <img src={LotteryLatestMark} alt="Logo" />
        </Box>
        <Text fontSize="20px" fontWeight="600" mt="1rem" textAlign="center">
          Latest Winning Numbers
        </Text>
        <WinningNumberContainer>
          <Grid>
            {winningCards.map((item, key) => (
              <GridItem key={key}>
                <WinningNumber>
                  <Text fontSize="25px" fontWeight="500"> {item === '' ? '?' : item} </Text>
                </WinningNumber>
              </GridItem>
            ))
            }
          </Grid>
        </WinningNumberContainer>
      </Flex>
    </Container>
  )
}
