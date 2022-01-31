import React, { useEffect, useState } from 'react'
import { Text, Button, useMatchBreakpoints } from '@sphynxdex/uikit'
import Spinner from 'components/Loader/Spinner'
import styled, { keyframes } from 'styled-components'
import BUSDTokenIcon from 'assets/images/BUSD.png'

import BondModal from './BondModal'

const BondTableRow = styled.div`
  display: flex;
  width: 100%;
  padding-top: 10px;
  flex-direction: row;
  border-bottom: 1px solid ${({ theme }) => theme.custom.divider};;
  .coin-img {
    display: flex;
    align-items: center;
    width: 10%;
    padding: 15px;
    text-align: center;
  }
  .bond-name {
    display: flex;
    align-items: center;
    width: 20%;
    padding: 15px;
  }
  .price {
    display: flex;
    align-items: center;
    width: 10%;
    padding: 15px;
  }
  .roi {
    display: flex;
    align-items: center;
    width: 10%;
    padding: 15px;
  }
  .purchased {
    display: flex;
    align-items: center;
    justify-content: right;
    width: 20%;
    padding: 15px;
  }
  .status {
    display: flex;
    align-items: center;
    width: 30%;
    padding: 15px;
  }
`

const TwinkleAnim = keyframes`
 0% { opacity: 1; }
 50% { opacity: 0.1; }
 100% { opacity: 1; }
`

const UnknownField = styled.div`
  width: 100%;
  height: 20px;
  border-radius: 4px;
  background-color: #fff;
  animation-name: ${TwinkleAnim};
  animation-duration: 2s;
  animation-iteration-count: infinite;
`

const BondPageHeader = styled.div<{ isMobile?: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '0' : '20px')};
  .bond-page-header {
    font-size: 20px;
    color: white;
    font-weight: 400;
    line-height: 1.5;
    padding-bottom: 20px;
  }
  .bond-page-subheader {
    display: flex;
    flex-direction: row;
    justify-content: ${({ isMobile }) => (isMobile ? 'space-between' : 'space-around')};
    width: 100%;
    font-size: ${({ isMobile }) => (isMobile ? '13px' : '20px')};
    color: #a7a7cc;
    .subheader-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: ${({ isMobile }) => (isMobile ? '48%' : 'fit-content')};
      padding: ${({ isMobile }) => (isMobile ? '0' : '10px')};
      .item-label {
        padding-bottom: 10px;
      }
      .item-content {
        color: #fff;
      }
    }
  }
`

const MobileCard = styled.div`
  background-color: #191c41;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin: 10px;
  padding: 20px 30px 30px 30px;
  .bond-type {
    display: flex;
    justify-content: flex-start;
    padding-bottom: 20px;
  }
  .item-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 15px;
    padding-bottom: 15px;
    .price,
    .roi {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 50px;
    }
    .purchased {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 80px;
    }
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

interface RowProps {
  id: number
  coinImg: string
  bond: string
  price: number | null
  roi: number | null
  purchased: number | null
  status: string
}

const fakeData: RowProps[] = [
  {
    id: 1,
    coinImg: BUSDTokenIcon,
    bond: 'BUSD',
    price: null,
    roi: null,
    purchased: 946,
    status: 'Sold Out',
  },
]

const BondPanel: React.FC = () => {
  const [bondData, setBondData] = useState<RowProps[]>([])
  const [bondModalShow, setBondModalShow] = useState(false)
  const [currentBond, setCurrentBond] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setBondData(fakeData)
      setIsLoading(false)
    }, 3000)
  }, [])

  const handleSelectBondModal = (bond) => {
    setCurrentBond(bond)
    setBondModalShow(true)
  }

  const renderHeader = () => {
    const Header = (
      <BondPageHeader isMobile={isMobile}>
        <div className="bond-page-header">Bond(1,1)</div>
        <div className="bond-page-subheader">
          <div className="subheader-item">
            <div className="item-label">Treasury Balance</div>
            <UnknownField />
          </div>
          <div className="subheader-item">
            <div className="item-label">Sphynx Price</div>
            <div className="item-content">$387.61</div>
          </div>
        </div>
      </BondPageHeader>
    )

    if (isMobile) {
      return <MobileCard>{Header}</MobileCard>
    }
    return Header
  }

  const renderDeskTopBondPanel = () => {
    const BondHeader = (
      <BondTableRow>
        <div className="coin-img" />
        <Text className="bond-name">Bond</Text>
        <Text className="price">Price</Text>
        <Text className="roi">ROI</Text>
        <Text className="purchased">Purchased</Text>
        <div className="status" />
      </BondTableRow>
    )
    const BondBody = bondData.map((data, index) => (
      <BondTableRow key={data.id}>
        <div className="coin-img">
          <img src={data.coinImg} width={32} height={32} alt="coin_img" />
        </div>
        <Text className="bond-name">{`$${data.bond}`}</Text>
        <Text className="price">
          {data.price ? `$${data.price}` : data.roi || data.purchased ? '--' : <UnknownField />}
        </Text>
        <Text className="roi">
          {data.roi ? `$${data.roi}` : data.price || data.purchased ? '--' : <UnknownField />}
        </Text>
        <Text className="purchased">
          {data.purchased ? `$${data.purchased}` : data.price || data.roi ? '--' : <UnknownField />}
        </Text>
        <div className="status">
          <Button onClick={() => handleSelectBondModal(data.bond)} style={{ width: '100%', fontSize: '' }}>
            {data.status}
          </Button>
        </div>
      </BondTableRow>
    ))

    return (
      <div className="bond-table" style={{ width: '100%' }}>
        {BondHeader}
        {BondBody}
      </div>
    )
  }

  const renderMobileBondPanel = () =>
    bondData.map((data, index) => (
      <MobileCard key={data.id}>
        <div className="bond-type">
          <div className="coin-img">
            <img height="32" width="32" src={data.coinImg} alt="coin_img" />
          </div>
          <Text className="bond-name">{`$${data.bond}`}</Text>
        </div>
        <div className="item-field">
          <Text>Price</Text>
          <Text className="price">
            {data.price ? `$${data.price}` : data.roi || data.purchased ? '--' : <UnknownField />}
          </Text>
        </div>
        <div className="item-field">
          <Text>ROI</Text>
          <Text className="roi">
            {data.roi ? `$${data.roi}` : data.price || data.purchased ? '--' : <UnknownField />}
          </Text>
        </div>
        <div className="item-field">
          <Text>Purchased</Text>
          <Text className="purchased">
            {data.purchased ? `$${data.purchased}` : data.price || data.roi ? '--' : <UnknownField />}
          </Text>
        </div>
        <div className="status">
          <Button onClick={() => handleSelectBondModal(data.bond)} style={{ width: '100%', fontSize: '' }}>
            {data.status}
          </Button>
        </div>
      </MobileCard>
    ))

  return (
    <>
      {isLoading ? (
        <LoadingWrapper>
          <Spinner />
        </LoadingWrapper>
      ) : (
        <div className="bond-page">
          {renderHeader()}
          {isMobile ? renderMobileBondPanel() : renderDeskTopBondPanel()}
          {bondModalShow && <BondModal currentTokenName={currentBond} onDismiss={setBondModalShow} />}
        </div>
      )}
    </>
  )
}

export default BondPanel
