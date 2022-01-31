import React from 'react'
import styled from 'styled-components'
import { Text } from '@sphynxdex/uikit'
import { ReactComponent as UserIcon } from 'assets/svg/icon/UserIcon.svg'

const AvatarWrapper = styled.div`
  display: flex;
  gap: 10px;
`

const UserAvatar = () => {
  return (
    <AvatarWrapper>
        <Text color="white" ml={3} textAlign="center" fontSize="13px">
          John D.
        </Text>
      <UserIcon />
    </AvatarWrapper>
  )
}

export default UserAvatar
