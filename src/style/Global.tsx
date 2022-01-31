import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@sphynxdex/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme { }
}

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto Regular';
    font-display: swap;
    font-style: normal;
    font-weight: normal;
    src: local('/fonts/Roboto Regular'), url('/fonts/Roboto-Regular.woff') format('woff');
  }
  * {
    font-family: 'Montserrat', sans-serif;
    font-display: swap;
  }
  body {
    // background-color: ${({ theme }) => theme.colors.background};
    background-color: #000 !important;

    img {
      height: auto;
      max-width: 100%;
    }
  }
  #simple-menu {
    .MuiMenu-paper {
      background: #151515;
      color: white;
    }
  }

  .marquee-container {
    overflow: hidden !important;
  }

  .MuiPickersBasePicker-pickerView {
    max-width: unset !important;
  }
  div.MuiDialog-paper {
    position: unset !important;
  }
  div.MuiPickersBasePicker-container {
    div.MuiPaper-root {
      top: unset !important;
      left: unset !important;
      width: unset !important;
      button {
        outline: none;
      }
    }
  }
  button {
    outline: none !important;
  }
  div.jHeWKE {
    background: ${({ theme }) => theme.custom.global} !important;
  }
  div.gaKhZj {
    background: ${({ theme }) => theme.custom.global} !important;
    // background: ${({ theme }) => (theme ? '#27262c !important' : '#191c41 !important')};
  }
  div.QBFwQ {
    background: ${({ theme }) => theme.custom.global} !important;
    // background: ${({ theme }) => (theme ? '#27262c !important' : '#191c41 !important')};
  }
  div.hlmFIr {
    background: ${({ theme }) => theme.custom.global} !important;
    // background: ${({ theme }) => (theme ? '#27262c !important' : '#191c41 !important')};
  }
  .eTJGWm {
    background: ${({ theme }) => theme.custom.global} !important;
    // background: ${({ theme }) => (theme ? '#27262c !important' : '#191c41 !important')};
    border: ${({ theme }) => (theme ? '' : '1px solid #2E2E55 !important')}; 
  }
  div.gcFUcx, div.ePwqSE, div.gGntUw {
    background: ${({ theme }) => theme.custom.global} !important;
    // background: ${({ theme }) => (theme ? '#27262c !important' : '#191c41 !important')};
  }
  div.iiTakj, div.lirVuy, div.kmqFVH {
    background: ${({ theme }) => theme.custom.toggleBackground}
  }
  div.iBFoSj { 
    background: ${({ theme }) => theme.custom.pancakePrimary}
  }
  .gJyxrV {
    border: ${({ theme }) => theme.custom.globalBorder}; 
  }
  .gruiCo, .sc-gInthZ {
    border-bottom: ${({ theme }) => theme.custom.globalBorder}; 
  }
  div.ktuRH {
    box-shadow: ${({ theme }) => theme.custom.modalShadow};
    border: ${({ theme }) => theme.custom.globalBorder};
  }
`

export default GlobalStyle
