import React from 'react'
import styled from 'styled-components'
import PyramidImage from 'assets/images/pyramid.png'

const Wrapper = styled.div`
  width: 516px;
  height: 516px;
  position: absolute;
  right: 0px;
  bottom: 0px;
  overflow: hidden;
  & img {
    position: absolute;
    right: -40px;
    bottom: -60px;
  }
`

const BannerWrapper: React.FC = () => {
  return (
    <Wrapper>
      <img src={PyramidImage} alt="Pyramid" />
    </Wrapper>
  )
}

export default BannerWrapper
