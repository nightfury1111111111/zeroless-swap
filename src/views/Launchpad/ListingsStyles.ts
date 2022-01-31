import styled from 'styled-components'
import { Text } from '@sphynxdex/uikit'

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  margin: 24px 0 40px;
  text-align: left;
  .ml16 {
    margin-left: 16px;
  }
  .ml32 {
    margin-left: 32px;
  }
  p {
    line-height: 24px;
  }
  p.w110 {
    width: 110px;
  }
  p.w80 {
    width: 80px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    align-items: flex-start;
  }
`

export const LogoTitle = styled.h2`
  font-size: 24px;
  line-height: 24px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 36px;
    line-height: 42px;
  }
`
export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const TitleWrapper = styled.div`
  display: flex;
  img {
    margin-right: 14px;
  }
`

export const Title = styled.div`
  span {
    font-size: 12px;
    color: white;
  }
`

export const NetworkButtonWrapper = styled.div`
  button {
    color: white;
    border-radius: 5px;
    height: 34px;
    background: ${({ theme }) => theme.custom.gradient};
    // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
    font-weight: 600;
    font-size: 13px;
    width: 102px;
    outline: none;

    img {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      width: 176px;
    }
  }
`

export const InputWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
  div:last-child {
    input {
      border-radius: 8px;
      border: unset;
      height: 34px;
      max-width: 192px;
      width: 100%;
      background: ${({ theme }) => theme.custom.inputWrapper};
      // background: ${({ theme }) => (theme ? '#040413' : '#2A2E60')};
    }
  }
`

export const SelectWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
  div: last-child {
    background: ${({ theme }) => theme.custom.inputWrapper};
    // background: ${({ theme }) => (theme ? '#040413' : '#2A2E60')};
    border-radius: 8px;
    div {
      border-radius: 8px;
      border: unset;
      background: ${({ theme }) => theme.custom.inputWrapper};
      // background: ${({ theme }) => (theme ? '#040413' : '#2A2E60')};
    }
  }
`

export const FilterContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  padding: 8px 0px;
  justify-content: flex-end;
  ${({ theme }) => theme.mediaQueries.xs} {
    flex-direction: column;
    align-items: end;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: unset;
    align-items: center;
  }
`

export const LoadMoreWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  width: 100%;
  justify-content: center;
`

export const TokenListContainder = styled.div<{ toggled: boolean }>`
  margin-top: 24px;
  display: grid;
  grid-gap: 20px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(${(props) => (props.toggled ? '3' : '2')}, 1fr);
  }
  @media screen and (min-width: 1320px) {
    grid-template-columns: repeat(${(props) => (props.toggled ? '4' : '3')}, 1fr);
  }
  @media screen and (min-width: 1720px) {
    grid-template-columns: repeat(${(props) => (props.toggled ? '5' : '4')}, 1fr);
  }
`

export const PaginationWrapper = styled.div`
  margin: 50px auto;
  .MuiPagination-root {
    .MuiPagination-ul {
      flex-wrap: nowrap;
      li {
        > .MuiPaginationItem-ellipsis {
          color: white;
        }
        &:first-child {
          flex-basis: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          > button::after {
            content: 'Previous';
            color: white;
          }
          > button {
            border: none;
            opacity: 1;
          }
          > .MuiPaginationItem-page.Mui-disabled {
            opacity: 1;
          }
          > button.Mui-disabled::after {
            color: #aaaaaa;
          }
        }
        &:last-child {
          flex-basis: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          border: none;
          > button::before {
            content: 'Next';
            color: white;
          }
          > button {
            border: none;
            opacity: 1;
          }
          > .MuiPaginationItem-page.Mui-disabled {
            opacity: 1;
          }
          > button.Mui-disabled::before {
            color: #aaaaaa;
          }
        }
        & .MuiPaginationItem-icon {
          display: none;
        }
        & button {
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        & button.Mui-selected {
          border: none;
          background: ${({ theme }) => theme.custom.gradient};
          // background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
        }
      }
    }
  }
`
