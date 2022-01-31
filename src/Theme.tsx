import { light, dark, PancakeTheme } from '@sphynxdex/uikit'

export interface CustomColors {
  background: string
  primary: string
  secondary: string
  tertiary: string
  autoCardBorder: string
  autoCardBackground: string
  communityCardBackground: string
  currencySelectButton: string
  inputPanelBorder: string
  switchModal: string
  invertSwitchModal: string
  global: string
  globalBorder: string
  lineBtn: string
  inputWrapper: string
  cardWrapper: string
  contributeWrapper: string
  tableSuccess: string
  tableError: string
  lpCard: string
  gradient: string
  searchInput: string
  distributeWrapper: string
  watchIcon: string
  distributeContent: string
  activeNetBackground: string
  switchModalBorder: string
  walletBackground: string
  switchNetworkButton: string
  menuBorder: string
  menuShadow: string
  connectButton: string
  toggleBackground: string
  tabBorder: string
  pancakePrimary: string
  autoButtonBorder: string
  coloredBorder: string
  coloredText: string
  howToPlay: string
  divider: string
  topbarShadow: string
  modalShadow: string
  tokenStateCard: string
  zeroEarned: string
  bondModal: string
}

export interface CustomTheme extends PancakeTheme {
  custom: CustomColors
}

export const defaultTheme: CustomTheme = (() => {
  const custom = {
    background: '#14208',
    primary: '#710D89',
    secondary: '#142028',
    tertiary: '#142028;',
    autoCardBorder: '#710D89',
    autoCardBackground: '#20234E',
    communityCardBackground: '#1A1A3A',
    currencySelectButton: '#4A5187',
    inputPanelBorder: '#4A5187',
    switchModal: '#142028',
    invertSwitchModal: '#142028',
    global: '#142028',
    globalBorder: '#2E2E55 1px solid !important',
    lineBtn: '#1A1A3A',
    inputWrapper: '#142028',
    cardWrapper: '#142028',
    contributeWrapper: '#4A5187',
    tableSuccess: '#77BF3E',
    tableError: '#F84364',
    lpCard: '#20234E',
    gradient: '#00b8d8',
    searchInput: '#4A5187',
    distributeWrapper: '#142028',
    watchIcon: '#F2C94C',
    distributeContent: '#F2C94C',
    activeNetBackground: 'linear-gradient(90deg, #610D89 0%, #C42BB4 100%)',
    switchModalBorder: '1px solid #202231',
    walletBackground: 'linear-gradient(90deg, #610d89 0%, #c42bb4 100%)',
    switchNetworkButton: '#142028',
    menuBorder: '1px solid #afafaf',
    menuShadow: '',
    connectButton: '#00b8d8',
    toggleBackground: 'rgba(0, 0, 0, 0.4)',
    tabBorder: 'rgb(0, 140, 47)',
    pancakePrimary: '#8b2a9b',
    autoButtonBorder: '#b314da',
    coloredBorder: '#142028',
    coloredText: 'rgb(0, 140, 47)',
    howToPlay: '#B928AF',
    divider: '#21214A',
    topbarShadow: '',
    modalShadow: '',
    tokenStateCard: '#F75183',
    zeroEarned: '#BDC2C4',
    bondModal: '#C42BB4',
  }
  return { ...light, custom }
})()

export const darkTheme = (() => {
  const custom = {
    background: '#1A1A3A',
    primary: '#710D89',
    secondary: '#0E0E26',
    tertiary: '#0E0E26;',
    autoCardBorder: '#21214A',
    autoCardBackground: 'transparent',
    communityCardBackground: '#142028',
    currencySelectButton: '#2E2E55',
    inputPanelBorder: '#21214A',
    switchModal: '#142028',
    invertSwitchModal: '#142028',
    global: '#27262c',
    globalBorder: '',
    lineBtn: '#222341',
    inputWrapper: '#040413',
    cardWrapper: '#1A1A3A',
    contributeWrapper: '#142028',
    tableSuccess: '#219653',
    tableError: '#EB5757',
    lpCard: '#040413',
    gradient: 'linear-gradient(90deg, #610D89 0%, #C42BB4 100%)',
    searchInput: '#FFFFF',
    distributeWrapper: 'transparent',
    watchIcon: '#A7A7CC',
    distributeContent: 'rgb(0, 140, 47)',
    activeNetBackground: 'linear-gradient(90deg, #610D89 0%, #C42BB4 100%)',
    switchModalBorder: '1px solid #202231',
    walletBackground: 'linear-gradient(90deg, #610d89 0%, #c42bb4 100%)',
    switchNetworkButton: '#142028',
    menuBorder: '1px solid #afafaf',
    menuShadow: '',
    connectButton: 'linear-gradient(90deg, #610D89 0%, #C42BB4 100%)',
    toggleBackground: 'rgba(0, 0, 0, 0.4)',
    tabBorder: 'rgb(0, 140, 47)',
    pancakePrimary: '#8b2a9b',
    autoButtonBorder: '#b314da',
    coloredBorder: '#142028',
    coloredText: 'rgb(0, 140, 47)',
    howToPlay: '#B928AF',
    divider: '#21214A',
    topbarShadow: '',
    modalShadow: '',
    tokenStateCard: 'linear-gradient(90deg, rgb(97, 13, 137) 0%, rgb(196, 43, 180) 100%)',
    zeroEarned: '#FFF',
    bondModal: '#C42BB4',
  }
  return { ...dark, custom }
})()

export const dexTheme = (() => {
  const custom = {
    background: '#0b1217',
    primary: '#23323c',
    secondary: '#142028',
    tertiary: '#142028;',
    autoCardBorder: '#23323c',
    autoCardBackground: 'transparent',
    communityCardBackground: '#23323c',
    currencySelectButton: '#23323c',
    inputPanelBorder: '#23323c',
    switchModal: '#142028',
    invertSwitchModal: '#23323c',
    global: '#23323c',
    globalBorder: 'none',
    lineBtn: '#222341',
    inputWrapper: '#142028',
    cardWrapper: '#23323c',
    contributeWrapper: '#00B8D8',
    tableSuccess: '#219653',
    tableError: '#EB5757',
    lpCard: '#23323c',
    gradient: '#00B8D8',
    searchInput: '#FFFFF',
    distributeWrapper: 'transparent',
    watchIcon: '#A7A7CC',
    distributeContent: '#00B8D8',
    activeNetBackground: '#34434c',
    switchModalBorder: '',
    walletBackground: '#00B8D8',
    switchNetworkButton: '#0b1217',
    menuBorder: 'none',
    menuShadow: '3px 4px 14px rgb(0 0 0 / 30%)',
    connectButton: '#00B8D8',
    toggleBackground: '#00B8D8',
    tabBorder: '#00B8D8',
    pancakePrimary: '#00B8D8',
    autoButtonBorder: '#00B8D8',
    coloredBorder: '#00B8D8',
    coloredText: '#00B8D8',
    howToPlay: '#00B8D8',
    divider: '#23323c',
    topbarShadow: '3px 4px 14px rgb(0 0 0 / 30%)',
    modalShadow: '3px 4px 14px rgb(0 0 0 / 90%)',
    tokenStateCard: '#00B8D8',
    zeroEarned: '#aaa',
    bondModal: '#00B8D8',
  }
  // const dex = { ...dark }
  // dex.colors.overlay = '#142028'
  // dex.colors.primary = '#23323c'
  // dex.shadows.active = ''
  // dex.shadows.focus = ''
  // return { ...dex, custom }
  return {
    ...dark,
    colors: {
      ...dark.colors,
      secondary: '#aaa',
      overlay: '#142028',
      primary: '#00B8D8',
      tertiary: '#142028',
      text: '#FFF',
      textSubtle: '#ADB5BD',
      textDisabled: '#aaa',
      input: '#0b1217',
      failure: '#aaa',
      backgroundDisabled: '#E9EAEB',
    },
    modal: {
      background: '#142028',
    },
    shadows: {
      active: '',
      focus: '',
    },
    custom,
  }
})()
