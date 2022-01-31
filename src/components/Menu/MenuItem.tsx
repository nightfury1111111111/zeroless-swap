import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { makeStyles, createStyles, createTheme, ThemeProvider } from '@material-ui/core/styles'
// import { SvgIconProps } from '@material-ui/core/SvgIcon'

import List from '@material-ui/core/List'

import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'

import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'
import { v4 as uuidv4 } from 'uuid'
import { useDefaultThemeChange } from 'state/application/hooks'

import AppMenuItemComponent from './MenuItemComponent'

// React runtime PropTypes
export const AppMenuItemPropTypes = {
  baseurl: PropTypes.string,
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  Icon: PropTypes.elementType,
  items: PropTypes.array,
  isMobile: PropTypes.bool,
  clickedBaseUrl: PropTypes.string,
  handleClickMobileMenu: PropTypes.func,
}

declare module '@material-ui/core/styles' {
  interface Theme {
    active: string
  }
  // // allow configuration using `createTheme`
  interface ThemeOptions {
    active: string
  }
}

// TypeScript compile-time props type, infered from propTypes
// https://dev.to/busypeoples/notes-on-typescript-inferring-react-proptypes-1g88
type AppMenuItemPropTypes = PropTypes.InferProps<typeof AppMenuItemPropTypes>
type AppMenuItemPropsWithoutItems = Omit<AppMenuItemPropTypes, 'items'>

// Improve child items declaration
export type AppMenuItemProps = AppMenuItemPropsWithoutItems & {
  items?: AppMenuItemProps[]
}

const ThemeWrapper: React.FC<AppMenuItemProps> = (props) => {
  const [currentTheme] = useDefaultThemeChange()
  const active = currentTheme === 2 ? '#23323c' : '#710D89'
  const theme = createTheme({
    active,
  })

  return (
    <ThemeProvider theme={theme}>
      <AppMenuItem {...props} />
    </ThemeProvider>
  )
}

const AppMenuItem: React.FC<AppMenuItemProps> = (props) => {
  const { baseurl, name, link, Icon, items = [], isMobile, clickedBaseUrl, handleClickMobileMenu } = props
  const isExpandable = items && items.length > 0
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isClickedSubMenu = pathname.includes(baseurl)
  const classes = useStyles()

  const handleClick = () => {
    setOpen(!open)
  }

  useEffect(() => {
    if (isClickedSubMenu || baseurl.includes(clickedBaseUrl)) {
      setOpen(true)
    }
  }, [isClickedSubMenu, clickedBaseUrl, baseurl])

  return (
    <>
      <AppMenuItemComponent
        className={isClickedSubMenu ? classes.menuItemWithSub : classes.menuItem}
        link={link}
        onClick={handleClick}
        handleClickMobileMenu={isMobile && handleClickMobileMenu}
      >
        {/* Display an icon if any */}
        {!!Icon && (
          <ListItemIcon className={classes.menuItemIcon}>
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText primary={name} inset={!Icon} className={classes.menuItemText} />
        {/* Display the expand menu if the item has children */}
        {isExpandable && !open && <IconExpandMore />}
        {isExpandable && open && <IconExpandLess />}
      </AppMenuItemComponent>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Divider />
        <List component="div" disablePadding>
          {items
            .map((item) => ({
              ...item,
              id: uuidv4(),
            }))
            .map((item) => (
              <AppMenuItemComponent
                key={item.id}
                className={classes.subMenuItem}
                link={item.link}
                handleClickMobileMenu={isMobile && handleClickMobileMenu}
              >
                <ListItemText key={item.id} primary={item.name} inset={!Icon} className={classes.menuItemText} />
              </AppMenuItemComponent>
            ))}
        </List>
      </Collapse>
    </>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    menuItem: {
      '&.active': {
        backgroundColor: 'white',
        '& .MuiListItemIcon-root': {
          color: '#fff',
        },
        '& .MuiListItemText-root': {
          color: 'white',
        },
      },
      '& .MuiListItemIcon-root': {
        minWidth: 32,
      },
      '& .MuiListItemText-root': {
        color: '#a7a7cc',
      },
      '& svg': {
        fill: '#a7a7cc',
      },
      '&.MuiListItem-button:hover': {
        backgroundColor: `${theme.active} !important`,
        // backgroundColor: `${theme.custom.primary} !important`,
      },
      '&.MuiListItem-root': {
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
      },
    },
    menuItemWithSub: {
      // backgroundColor: `${theme.active} !important`,
      backgroundColor: '#e04e69 !important',
      '&.active': {
        // backgroundColor: `${theme.active} !important`,
        backgroundColor: '#e04e69 !important',
        '& .MuiTypography-root': {
          color: 'white',
          fontWeight: 'bold',
        },
      },
      '&.MuiListItem-root': {
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
      },
      '&.MuiListItem-button:hover': {
        // backgroundColor: `${theme.active} !important`,
        backgroundColor: '#e04e69 !important',
      },
      '& .MuiListItemIcon-root': {
        minWidth: 32,
      },
      '& svg': {
        fill: '#a7a7cc',
      },
    },
    menuItemIcon: {
      color: '#97c05c',
    },
    menuItemText: {
      color: '#a7a7cc',
    },
    subMenuItem: {
      paddingLeft: 48,
      '&.MuiListItem-button:hover': {
        // backgroundColor: `${theme.active} !important`,
        backgroundColor: '#e04e69 !important',
      },
      '&.MuiListItem-root': {
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
      },
      '&.active': {
        '& .MuiTypography-root': {
          color: '#fff',
          fontWeight: 'bold',
        },
      },
    },
  }),
)

export default ThemeWrapper
