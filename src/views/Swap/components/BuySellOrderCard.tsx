/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import Spinner from 'components/Loader/Spinner'
import { useTranslation } from 'contexts/Localization'
import { formatPrice } from '../../../utils'

const fontSize = window.screen.width > 768 ? '14px' : '12px'

const TableWrapper = styled.div`
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  border-radius: 8px;
  height: 100%;
  max-height: 500px;
  overflow: auto;
  overflow-x: hidden;
  & table {
    background: transparent;
    width: 100%;
    & tr {
      background: transparent;
    }
    & td {
      padding: 8px;
    }
    & thead {
      & td {
        color: white;
        font-size: 14px;
        text-align: left;
        vertical-align: middle;
        background: transparent;
        padding: 16px 8px;
        font-weight: 600;
        & > div > div {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
    & tbody {
      & tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        & h2 {
          font-size: ${fontSize};
          line-height: 16px;
          word-break: break-word;
          font-weight: 600;
          text-align: left;
          &.success {
            color: ${({ theme }) => (theme.isDark ? '#219653' : '#77BF3E')};
          }
          &.error {
            color: ${({ theme }) => (theme.isDark ? '#EB5757' : '#F84364')};
          }
        }
      }
    }
  }
`

interface BuySellOrderProps {
  buySellOrderData?: any
  isLoading?: boolean
  symbol?: string
}

const BuySellOrderCard: React.FC<BuySellOrderProps> = (props) => {
  const { t } = useTranslation()
  // eslint-disable-next-line no-console
  return (
    <>
      {props.isLoading ? (
        <TableWrapper>
          <table>
            <thead>
              <tr>
                <td style={{ width: '30%', paddingLeft: '12px' }}>{t('Time')}</td>
                <td style={{ width: '17%' }}>{t('Tokens')}</td>
                <td style={{ width: '17%' }}>{t('Token Price')}</td>
                <td style={{ width: '17%' }}>{t('Amount (Buy/Sell)')}</td>
                <td style={{ width: '19%' }}>{t('Tx id')}</td>
              </tr>
            </thead>
            <tbody>
              {props.buySellOrderData.map((data, key) => {
                return (
                  <tr key={key}>
                    <td style={{ width: '30%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'} style={{ marginLeft: '8px', padding: '4px' }}>
                          {data.transactionTime}
                        </h2>
                      </a>
                    </td>
                    <td style={{ width: '17%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>
                          {Number(data.amount)
                            .toFixed(4)
                            .replace(/(\d)(?=(\d{3})+\.)/g, '$&,')}
                          <br />
                          {props.symbol}
                        </h2>
                      </a>
                    </td>
                    <td style={{ width: '17%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>
                          $
                          {data.price < 1
                            ? formatPrice(data.price, 10)
                            : Number(data.price)
                                .toFixed(2)
                                .replace(/(\d)(?=(\d{3})+\.)/g, '$&,')}
                        </h2>
                      </a>
                    </td>
                    <td style={{ width: '17%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>
                          ${(data.price * data.amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$&,')}
                          <br />
                          {Number(data.value)
                            .toFixed(4)
                            .replace(/(\d)(?=(\d{3})+\.)/g, '$&,')}{' '}
                          BNB
                        </h2>
                      </a>
                    </td>
                    <td style={{ width: '19%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>{`${data.tx.slice(0, 15)}..`}</h2>
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableWrapper>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default BuySellOrderCard
