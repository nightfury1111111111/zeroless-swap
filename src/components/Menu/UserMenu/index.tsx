import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Text } from '@sphynxdex/uikit'
import useAuth from 'hooks/useAuth'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ReactComponent as UserIcon } from 'assets/svg/icon/UserIcon.svg'

const AvatarWrapper = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
  align-items: center;
`

const UserMenu = () => {
  const { account } = useWeb3React()
  const { logout } = useAuth()

  if (!account) {
    return <ConnectWalletButton />
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* <UIKitUserMenu account={account} avatarSrc="/images/EmptyAvatar.svg">
        <UserMenuItem
          onClick={() => {
            logout()
          }}

          onTouchEnd={()=> {
            logout()
          }}
        >
          <Flex alignItems="center" justifyContent="space-between" width="100%" height="100%">
            {t('Sign out')}
            <LogoutIcon />
          </Flex>
        </UserMenuItem>
      </UIKitUserMenu> */}
      <AvatarWrapper
        onClick={() => {
          logout()
        }}
      >
        <Text color="white" ml={3} textAlign="center" fontSize="13px">
          {`${account.slice(0, 4)}...${account.slice(account.length - 3, account.length)}`}
        </Text>
        <UserIcon />
      </AvatarWrapper>
    </div>
  )
}

export default UserMenu
