import BigNumber from 'bignumber.js'
import styled, {useTheme} from 'styled-components'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, LinkExternal } from '@sphynxdex/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { DarkButtonStyle, ColorButtonStyle } from 'style/buttonStyle'

const CustomModal = styled(Modal)`
  border-radius: 20px;
  background: #1A1A3A;
`

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  addLiquidityUrl?: string
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '', addLiquidityUrl }) => {
  const [val, setVal] = useState('')
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const theme = useTheme()

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleConfirm = useCallback(async () => {
    setPendingTx(true)
    try {
      await onConfirm(val)
      toastSuccess(t('Staked!'), t('Your funds have been staked in the farm'))
      onDismiss()
    } catch (e) {
      toastError(
        t('Error'),
        t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
      )
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }, [onConfirm, onDismiss, t, toastError, toastSuccess, val])

  return (
    <CustomModal title={t('Stake LP tokens')} onDismiss={onDismiss} headerBackground='#0E0E26'>
      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={t('Stake')}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx} style={DarkButtonStyle}>
          {t('Cancel')}
        </Button>
        <Button
          width="100%"
          style={{...ColorButtonStyle, background: theme.custom.gradient}}
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
          onClick={handleConfirm}
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </ModalActions>
      <LinkExternal href={addLiquidityUrl} style={{ alignSelf: 'center' }}>
        {t('Get %symbol%', { symbol: tokenName })}
      </LinkExternal>
    </CustomModal>
  )
}

export default DepositModal
