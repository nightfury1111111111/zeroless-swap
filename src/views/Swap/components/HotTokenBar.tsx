/* eslint-disable */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Marquee from 'react-easy-marquee'
import { useTranslation } from 'contexts/Localization'
import { HotTokenType } from './types'
import axios from 'axios'

export interface HotTokenBarProps {
  tokens?: HotTokenType[] | null
}

const StyledBar = styled.div`
  width: 100%;
  display: flex;
  & span {
    font-family: 'Roboto Regular';
  }
`

const FlowBar = styled.div`
  width: calc(100% - 100px);
  background-color: transparent;
  border-radius: 0px 12px 12px 0px;
  padding: 6px;
`

const BarIntro = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  background-color: transparent;
  border-radius: 8px 0px 0px 8px;
  & span {
    color: white;
    font-size: 12px;
    font-weight: bold;
    line-height: 14px;
    text-transform: uppercase;
  }
`

const temp = [
  {
    currency: {
      symbol: 'SPHYNX BSC',
      name: 'SPHYNX BSC',
      address: '0xe64972C311840cFaf2267DCfD365571F9D9544d9',
    },
  },
  {
    currency: {
      symbol: 'MESSDOGE',
      name: 'MessiahDoge',
      address: '0x4551e4dd3ff4d3f379ffd4a6f992823bb1ac964a',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
  {
    currency: {
      symbol: '??',
      name: '??',
      address: '',
    },
  },
]

export default function HotTokenBar() {
  const [realData, setRealData] = useState(temp)

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_API_URL2}/getTrending`).then((res) => {
      let { data } = res
      data = data.map((oneData) => {
        return {
          currency: {
            symbol: oneData.token_symbol,
            name: oneData.token_symbol,
            address: oneData.token_address,
          },
        }
      })

      setRealData(data)
    })
  }, [])

  const { t } = useTranslation()

  return (
    <>
      <StyledBar>
        <BarIntro>
          <span>{t('Top Pairs')}</span>
        </BarIntro>

        {/* <FlowBar>
          <Marquee pauseOnHover duration={20000} reverse={true} height="36px" width="100%">
            <>
              <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'center' }}>
                {realData.map((elem: any, index) => {
                  return elem.currency.address !== '' ? (
                    <li
                      key={`${index + 1}.${elem.currency.symbol}`}
                      style={{ color: 'white', padding: '12', paddingInlineEnd: '24px' }}
                    >
                      <a href={`/swap/${elem.currency.address}`} style={{ marginRight: 20, textDecoration: 'none' }}>
                        <span style={{ color: index === 0 ? 'yellow' : index === 1 ? 'grey' : 'white', fontSize: '14px', fontWeight: 'bold' }}>{`${
                          index + 1
                        }. `}</span>
                        {`${elem.currency.symbol}`}
                      </a>
                    </li>
                  ) : (
                    <li
                      key={`${index + 1}.${elem.currency.symbol}`}
                      style={{ color: 'white', padding: '12', paddingInlineEnd: '24px' }}
                    >
                      <span style={{ color: index === 0 ? 'yellow' : index === 1 ? 'sliver' : 'white', fontSize: '14px' }}>{`${
                        index + 1
                      }. `}</span>
                      {`${elem.currency.symbol}`}
                    </li>
                  )
                })}
              </ul>
              <div style={{ width: document.body.clientWidth > 1080 ? '720px' : document.body.clientWidth * 0.7 + 'px' }} />
            </>
          </Marquee>
        </FlowBar> */}

        <div className="paddingRight: 30px" />
      </StyledBar>
    </>
  )
}
