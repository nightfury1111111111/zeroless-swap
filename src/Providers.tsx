import React from 'react'
import { ModalProvider, light, dark, PancakeTheme } from '@sphynxdex/uikit'
import { Web3ReactProvider } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { useThemeManager } from 'state/user/hooks'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import store from 'state'
import { defaultTheme, darkTheme, dexTheme, CustomColors } from 'Theme'
import { useDefaultThemeChange } from 'state/application/hooks'

declare module 'styled-components' {
  export interface DefaultTheme extends PancakeTheme {
    custom: CustomColors
  }
}

const ThemeProviderWrapper = (props) => {
  const [currentTheme] = useDefaultThemeChange()
  // const [isDark] = useThemeManager()
  light.modal.background = '#191C41'
  light.colors.text = 'white'
  dark.tooltip.background = 'rgba(0, 0, 0, 0.8)'
  dark.tooltip.text = 'white'
  light.tooltip.background = 'rgba(0, 0, 0, 0.8)'
  light.tooltip.text = 'white'
  console.log(light, dark)
  const themes = [defaultTheme, darkTheme, dexTheme]
  return <ThemeProvider theme={themes[currentTheme]} {...props} />
}

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ToastsProvider>
          <HelmetProvider>
            <ThemeProviderWrapper>
              <LanguageProvider>
                <RefreshContextProvider>
                  <ModalProvider>{children}</ModalProvider>
                </RefreshContextProvider>
              </LanguageProvider>
            </ThemeProviderWrapper>
          </HelmetProvider>
        </ToastsProvider>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
