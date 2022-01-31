import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { AppState } from 'state'
import { autoSlippage } from 'state/flags/actions'
import { useDispatch, useSelector } from 'react-redux'
import {
  Text,
  Flex,
  Heading,
  IconButton,
  ArrowBackIcon,
  NotificationDot,
  Button,
  CogIcon,
  useModal,
} from '@sphynxdex/uikit'
import SettingsModal from 'components/Menu/GlobalSettings/SettingsModal'
import { useTranslation } from 'contexts/Localization'
import { useSwapType } from 'state/application/hooks'
import { useExpertModeManager } from 'state/user/hooks'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle?: string
  helper?: string
  backTo?: string
  showAuto?: boolean
  noConfig?: boolean
  showHistory?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
  width: 100%;
`

const TransparentIconButton = styled(IconButton)`
  background-color: transparent;
  margin: 0px 5px;
  min-width: 40px;
  height: 40px;
`

const AutoButton = styled(Button)`
  color: white;
  background: ${({ theme }) => theme.custom.background};
  padding: 4px 12px;
  margin-right: 8px;
  height: 25px;
  outline: none;
  font-weight: 600;
  font-size: 12px;
  box-shadow: none !important;
  border: 1px solid ${({ theme }) => theme.custom.autoButtonBorder};
  border-radius: 12px;
  &.focused {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.custom.pancakePrimary} !important;
  }
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, showAuto, noConfig = false, showHistory }) => {
  const [expertMode] = useExpertModeManager()

  const { setSwapType } = useSwapType()
  const autoSlippageFlag = useSelector<AppState, AppState['autoSwapReducer']>(
    (state) => state.autoSwapReducer.autoSlippageFlag,
  )
  const [autoFocused, setAutoFocused] = useState(autoSlippageFlag)
  const dispatch = useDispatch()

  const { t } = useTranslation()

  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  const handleSwapType = useCallback(() => {
    setSwapType(backTo)
  }, [backTo, setSwapType])

  const handleAutoFocused = useCallback(() => {
    setAutoFocused(!autoFocused)
    dispatch(autoSlippage({ autoSlippageFlag: !autoFocused }))
  }, [autoFocused, dispatch])

  const handleSettingsModal = useCallback(() => {
    onPresentSettingsModal()
    setAutoFocused(false)
  }, [onPresentSettingsModal])

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" style={{ flex: 1 }}>
        {backTo && (
          <TransparentIconButton onClick={handleSwapType}>
            <ArrowBackIcon width="32px" />
          </TransparentIconButton>
        )}
        <Flex flexDirection="column">
          <Heading as="h3" mb="1" color="white">
            {title}
          </Heading>
          {subtitle && (
            <Flex alignItems="center">
              {helper && <QuestionHelper text={helper} mr="4px" />}
              <Text color="textSubtle" fontSize="14px">
                {subtitle}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
      {showAuto && (
        <AutoButton className={autoFocused ? 'focused' : ''} onClick={handleAutoFocused}>
          {t('Auto')}
        </AutoButton>
      )}
      {!noConfig && (
        <Flex alignItems="center">
          <NotificationDot show={expertMode}>
            <Flex>
              <IconButton onClick={handleSettingsModal} variant="text" scale="sm" aria-label="setting modal">
                <CogIcon height={22} width={22} color="white" />
              </IconButton>
            </Flex>
          </NotificationDot>
          {showHistory ? <Transactions /> : <></>}
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader
