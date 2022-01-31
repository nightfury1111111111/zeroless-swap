import React from 'react'
import { Flex, Text } from '@sphynxdex/uikit'
import LotteryLatestMark from 'assets/svg/icon/LotteryLatestMarkSmall.svg'

const BackgroundColors = {
  0: '#F75183',
  1: '#9B51E0',
  2: '#77BF3E',
  3: '#21C2CC',
  4: '#2E80EC',
  5: '#ECAB2E',
}

export default function LatestWinningNumbers({ winningCardNumbers, size, numberWidth, numberHeight }) {
  return (
    <Flex style={{ columnGap: '5px' }}>
      {winningCardNumbers.map((item, index) => {
        const key = `lastest-win-num-${index}`
        return (
          <Flex key={key} flexDirection="column" alignItems="center" style={{ rowGap: '5px' }} >
            <img src={LotteryLatestMark} width={numberWidth} height={numberHeight} alt="" />
            <Flex style={{
              width: `${size}px`,
              height: `${size}px`,
              background: BackgroundColors[index],
              borderRadius: size / 2,
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white"> {item === '' ? '?' : item} </Text>
            </Flex>
          </Flex>
      )})}
    </Flex>
  )
}
