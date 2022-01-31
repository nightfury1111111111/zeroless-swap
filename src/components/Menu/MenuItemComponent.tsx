import React, { forwardRef } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { NavLink, NavLinkProps } from 'react-router-dom'
import styled from 'styled-components'

const MenuItemExternal = styled.a`
  display: none;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
  border-radius: 5px;
  text-decoration: none !important;
  padding-left: 16px;
  & > .MuiListItemIcon-root {
    min-width: 32px;
  }
  & p {
    width: calc(100% - 32px);
    font-size: 14px;
    font-weight: 600;
    color: #a7a7cc;
  }
  &:hover,
  &.active {
    background: ${({ theme }) => theme.custom.primary};
    p {
      color: white;
      font-weight: bold;
    }
  }
`

export interface AppMenuItemComponentProps {
  className?: string
  link?: string | null // because the InferProps props allows alows null value
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  handleClickMobileMenu?: any
}

const AppMenuItemComponent: React.FC<AppMenuItemComponentProps> = (props) => {
  const { className, onClick, link, children, handleClickMobileMenu } = props

  // If link is not set return the orinary ListItem
  if (!link || typeof link !== 'string') {
    return (
      <ListItem button className={className} onClick={onClick}>
        {children}
      </ListItem>
    )
  }

  // Return a LitItem with a link component
  return (
    <>
      {link.indexOf('https') === 0 ? (
        <MenuItemExternal
          className={window.location.pathname === link && link !== '/' ? 'active' : ''}
          target="_blank"
          href={link}
          rel="noreferrer"
          onClick={handleClickMobileMenu !== false ? handleClickMobileMenu : undefined}
        >
          {children}
        </MenuItemExternal>
      ) : (
        <ListItem
          button
          className={className}
          component={forwardRef((props: NavLinkProps, ref: any) => (
            <NavLink exact {...props} innerRef={ref} />
          ))}
          to={link}
          onClick={handleClickMobileMenu !== false ? handleClickMobileMenu : undefined}
        >
          {children}
        </ListItem>
      )}
    </>
  )
}

export default AppMenuItemComponent
