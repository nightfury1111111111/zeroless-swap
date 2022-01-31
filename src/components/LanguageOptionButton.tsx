import React, { useCallback, useMemo } from 'react'
import Select from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import { EN, ZHCN } from '../config/localization/languages'

const LANGUAGE_OPTIONS = [
  {
    label: EN.language,
    value: EN.code,
  },
  {
    label: ZHCN.language,
    value: ZHCN.code,
  },
]

const LanguageOptionButton = () => {
  const { setLanguage, currentLanguage } = useTranslation()

  const language = useMemo(() => {
    return LANGUAGE_OPTIONS.findIndex((option) => option.value === currentLanguage.code) ?? 0
  }, [currentLanguage])

  const handleLanguageOptionChange = useCallback((option) => {
    switch (option.value) {
      case EN.code:
        setLanguage(EN)
        break
      case ZHCN.code:
        setLanguage(ZHCN)
        break
      default:
        setLanguage(EN)
    }
  }, [setLanguage])

  return (
    <Select options={LANGUAGE_OPTIONS} defaultValue={language} onChange={handleLanguageOptionChange} />
  )
}

export default LanguageOptionButton
