import React, { useState, useRef, useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import WatchIcon from 'components/Icon/WatchIcon'

const DistributionWrapper = styled.div`
  display: flex;
  padding: 6px 12px;
  justify-content: center;
  width: 100%;
  .dateString {
    font-size: 9px;
  }
  .titleString {
    font-size: 12px;
  }
  .timeString {
    fontsize: 11px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
    justify-content: center;
    color: white;
    width: 100%;
    max-width: 360px;
    padding: 12px 18px;
    margin: 12px;
    height: 80px;
    // background-color: ${({ theme }) => (theme ? 'transparent' : '#2A2E60')};
    background-color: ${({ theme }) => theme.custom.distributeWrapper};
    border-radius: 10px;
    .dateString {
      font-size: 12px;
    }
    .titleString {
      font-size: 16px;
    }
    .timeString {
      fontsize: 14px;
    }
  }
`

const DistributionContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  margin-left: 12px;
`

const TimeSpan = styled.div`
  display: block;
`

const TimeContent = styled.div`
  display: flex;
  flex-directioin: column;
  justify-content: space-between;
  max-width: 232px;
`

const RewardsPanel: React.FC = () => {
  const { t } = useTranslation()
  const [time, setRemainTime] = useState(0)
  const interval = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    const remainTime = () => {
      const finishDate = new Date('11/29/2021 12:00:00 UTC').getTime()
      let remain = finishDate - new Date().getTime()
      if (remain < 0) {
        for (;;) {
          remain += 3600 * 1000 * 24 * 7
          if (remain > 0) break
        }
      }
      setRemainTime(remain)
    }
    const ab = new AbortController()
    interval.current = setInterval(() => {
      remainTime()
    }, 1000)
    return () => {
      clearInterval(interval?.current)
      ab.abort()
    }
  }, [])

  return (
    <DistributionWrapper>
      <Flex justifyContent="flex-end" alignItems="center">
        {/* <img src={StopwatchIcon} alt="stopwatch icon" width="90" height="90" /> */}
        <WatchIcon
          width={document.body.clientWidth > 768 ? '61px' : '24px'}
          height={document.body.clientWidth > 768 ? '72px' : '24px'}
          color={theme.custom.watchIcon}
          // color={theme ? '#A7A7CC' : '#F2C94C'}
        />
        <DistributionContent>
          <Text color={theme.custom.distributeContent} bold className="titleString">
            {/* <Text color={theme ? '#C32BB4' : '#F2C94C'} bold className="titleString"> */}
            {t('Distribution In:')}
          </Text>
          <TimeContent>
            <TimeSpan>
              <Text color="white" textAlign="center" bold className="timeString">
                {Math.floor(time / 86400000).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </Text>
              <Text color="white" textTransform="uppercase" className="dateString">
                {t('days')}
              </Text>
            </TimeSpan>
            <Text>:</Text>
            <TimeSpan>
              <Text color="white" textAlign="center" bold className="timeString">
                {Math.floor((time % 86400000) / 3600000).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </Text>
              <Text color="white" textTransform="uppercase" className="dateString">
                {t('hrs')}
              </Text>
            </TimeSpan>
            <Text color="white">:</Text>
            <TimeSpan>
              <Text color="white" textAlign="center" bold className="timeString">
                {Math.floor((time % 3600000) / 60000).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </Text>
              <Text color="white" textTransform="uppercase" className="dateString">
                {t('min')}
              </Text>
            </TimeSpan>
            <Text color="white">:</Text>
            <TimeSpan>
              <Text color="white" textAlign="center" bold className="timeString">
                {Math.floor((time % 60000) / 1000).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </Text>
              <Text color="white" textTransform="uppercase" className="dateString">
                {t('sec')}
              </Text>
            </TimeSpan>
          </TimeContent>
        </DistributionContent>
      </Flex>
    </DistributionWrapper>
  )
}

export default RewardsPanel
