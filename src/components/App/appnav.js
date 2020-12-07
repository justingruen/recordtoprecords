import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Link as MuiLink } from '@material-ui/core'
import { withFirebase } from '../Firebase'

import { makeStyles } from '@material-ui/styles'
import AlbumIcon from '@material-ui/icons/Album'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { Icon,
  Typography,
  Badge,
  Slide,
  useMediaQuery,
  useScrollTrigger,
  Grid,
  Toolbar,
  AppBar,
  Avatar,
  Hidden,
  Container,
  IconButton, 
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem 
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'

import RTRLogo from '../../RTR_Logo.svg'
import SignInPage from '../SignIn/index'
import SignOut from '../SignOut/index'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'

import CartMenu from '../App/cartitem'

const useStyles = makeStyles((theme) => ({  //not sure what theme does here, but everything has it
  appbar: {
    background: 'rgba(255,255,255,0.5)',
    marginBottom: '12px',
  },
  toolbar: {

  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
  albumicon: {
    backgroundColor: '#000000'
  },
  shoppingcarticon: {
    justify: 'flex-end'
  },
  lefttypography: {

  },
  righttypography: {

  },
  containermainPC: {
    paddingTop: '15px',
    paddingBottom: '10px',
    paddingLeft: '22px',
    paddingRight: '45px', //Theres something off, go to catalog page, set this to 22, and look at the title
  },
  containermainMobile: {
    paddingTop: '15px',
    paddingBottom: '0px',
    // paddingLeft: '22px',
    // paddingRight: '22px',
  },
  iconbutton: {
    
  },
  listxs: {
    width: '380px',
  },
  list: {
    [theme.breakpoints.only('xs')]: {
      width: '280px'
    },
    [theme.breakpoints.up('sm')]: {
      width: '380px'
    },
  },
  listitem: {
    '&:hover': {
      backgroundColor: "#FFFFFF"
    }
  }
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const INITIAL_PAGE = {
  home: 'hover',
  catalog: 'hover',
  aboutus: 'hover',
}


function AppNav(props) {
  const { currentPage, authUser, cartUpdate, setCartUpdate } = props
  const [cart, setCart] = useState([])
  var localCart = localStorage.getItem('cart')
  const [itemCount, setItemCount] = useState()
  const [page, setPage] = useState(INITIAL_PAGE)
  const [drawerState, setDrawerState] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles()
  const theme = useTheme()

  const [firebase] = useState(props.firebase)
  const doSignOut = firebase.doSignOut

  const authTabsList = [
  {text: 'Catalog', route: 'CATALOG'}, 
  {text: 'About Us', route: 'ABOUTUS'}, 
  {text: 'Account', route: 'ACCOUNT'},
  {text: 'Log Out', function: doSignOut}, 
  ]

  const nonAuthTabsList = [
    {text: 'Catalog', route: 'CATALOG'}, 
    {text: 'About Us', route: 'ABOUTUS'}, 
    {text: 'Log In', }, 
  ]

  useEffect(() => {
    if (cartUpdate) {
      console.log('rerendering appnav')
      let totalQuantity = 0

      // Retrieve and set local cart
      localCart = JSON.parse(localStorage.getItem('cart'))
      if(localCart) {
        // Set Cart
        setCart(localCart)

        // Set total item count
        localCart.forEach(item => {
          totalQuantity += item.quantity
        })
        setItemCount(totalQuantity)
      }

      setCartUpdate(false)
    }
  },[cartUpdate])

  useEffect(() => {
    for (const property in page) {
      if (property === currentPage){
        setPage({
          ...INITIAL_PAGE,
          [property]: 'always'
        })
        break
      }
    }
  }, [currentPage])

  return (
    <React.Fragment>
      <HideOnScroll {...props}> 
        <AppBar className={ classes.appbar }
          elevation={0}
          position='sticky' // Allows a component to exist above the appbar, but now it can't leave the div the appnav is in
        >
              
          {/* AppBar | PC */}
          <Hidden smDown>
            <Container className={ classes.containermainPC } maxWidth='lg' disableGutters={true}>
              <Toolbar
                className={ classes.toolbar } // nullish coalescance & optional chaining <3
                style={{justifyContent: 'center'}}
              >
                {/* Grid Starts Here */}
                <Grid container justify='center' alignContent='center'>
                  {/* Left Side | Logo */}
                  <Grid item xs={3} align='flex-start'>
                    <Link to={ROUTES.HOME} className={ classes.link }>
                      <img src={RTRLogo} alt='logo' />
                    </Link>
                  </Grid>

                  {/* Middle | Menu Items */}
                  <Grid item container spacing={3} xs={6} justify='center' alignContent='center'>
                    <Grid item>
                      <MuiLink className={ classes.menulink } component='div' underline={page.catalog}>   {/* Not intended to be div */}
                        <Link to={ROUTES.CATALOG} className={ classes.link }>
                          <Typography component='div' variant='body1' style={{color: '#000000'}}>
                            Catalog
                          </Typography>
                        </Link>
                      </MuiLink>
                    </Grid>
                    <Grid item>
                      <MuiLink className={ classes.menulink } component='div' underline={page.aboutus}>
                        <Link to={ROUTES.ABOUTUS} className={ classes.link }>
                          <Typography component='div' variant='body1' style={{color: '#000000'}}>
                            About Us
                          </Typography>
                        </Link>
                      </MuiLink>
                    </Grid>
                  </Grid>

                  {/* Right Side | Account, Cart */}
                  <Grid item container justify='flex-end' alignContent='center' spacing={2} xs={3} direction='row'>
                    {authUser
                        ? <>
                            <Grid item align='center' style={{paddingTop: '11px'}}>  
                              <MuiLink className={ classes.menulink } component='div' underline={page.account} >  
                                <Link to={ROUTES.ACCOUNT} className={ classes.link }>
                                  <Typography component='div' variant='body1' style={{color: '#000000'}}>
                                    Account
                                  </Typography>
                                </Link>
                              </MuiLink> 
                            </Grid>
                            <Grid item style={{paddingTop: '10px'}}>
                              <SignOut />  
                            </Grid>
                          </>
                        : <SignInPage stylelink={{paddingTop: '10px', paddingRight: '15px'}}/>
                      }
                      <IconButton className={ classes.iconbutton } onClick={event => setAnchorEl(event.currentTarget)} edge='end'>
                        <Badge badgeContent={itemCount} color='secondary' >
                          <ShoppingCartIcon style={{color: '#000000'}}/>
                        </Badge>
                      </IconButton>
                  </Grid>
                  {/* <Grid item xs={2} align='end'>
                    <ShoppingCartIcon style={{color: '#000000', marginTop: '5px'}}/>
                  </Grid> */}
                </Grid>
              </Toolbar>
            </Container>
          </Hidden>

          {/* --------------------------------------------------------------------------------------- */}

          {/* AppBar | Mobile */}
          <Hidden mdUp>
            <Container className={ classes.containermainMobile } maxWidth='xl' disableGutters={true}>
              <Toolbar
                className={ classes.toolbar } // nullish coalescance & optional chaining <3
                style={{justifyContent: 'center'}}
              >
                {/* Grid Starts Here */}
                <Grid container spacing={3} justify='space-between'>
                  {/* Left Side | Logo */}
                  <Grid item xs={6}>
                    <Link to={ROUTES.HOME} className={ classes.link }>
                      <img src={RTRLogo} alt='logo' />
                    </Link>
                  </Grid>

                  {/* Middle */}
                  <Grid item xs={3}>

                  </Grid>

                  {/* Right Side | Account, Cart */}
                  <Grid item container xs={3} spacing={3} justify='flex-end' style={{paddingTop: '20px'}} wrap='nowrap'>
                    <Grid item>
                      <IconButton className={ classes.iconbutton } onClick={event => setAnchorEl(event.currentTarget)} edge='end'>
                          <Badge badgeContent={itemCount} color='secondary' >
                            <ShoppingCartIcon style={{color: '#000000'}}/>
                          </Badge>
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton className={ classes.iconbutton } onClick={() => setDrawerState(true)} edge='end'>
                        <MenuIcon style={{color: '#000000'}}/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Toolbar>
            </Container>
          </Hidden>
        </AppBar>
      </HideOnScroll>

      {authUser
        ? <Drawer drawerState={drawerState} setDrawerState={setDrawerState} tabsList={authTabsList} />
        : <Drawer drawerState={drawerState} setDrawerState={setDrawerState} tabsList={nonAuthTabsList} />
      }
      <CartMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} cart={cart} setCartUpdate={setCartUpdate}/>
    </React.Fragment>
  )
}

function Drawer(props) {
  const classes = useStyles()
  const { drawerState, setDrawerState, tabsList } = props

  return (
    <React.Fragment>
      <MuiDrawer anchor='left' open={drawerState} onClose={() => setDrawerState(false)}>
        <Grid container spacing={0} alignContent='center' style={{ paddingTop: '20px', paddingBottom: '10px'}}>
          <Grid item xs={3} align='center'>
            <AlbumIcon fontSize='large' style={{width: '50px', height: '50px'}} />
          </Grid>
          <Grid item xs={6} />
          <Grid item container xs={3} alignContent='center' justify='center'>
            <IconButton onClick={() => setDrawerState(false)}>
              <CloseIcon fontSize='large' style={{width: '40px', height: '40px'}} />
            </IconButton>
          </Grid>
        </Grid>
        <List className={ classes.list }>
          {tabsList.map(tab => (
            <ListItem button key={tab.text} className={ classes.listitem } disableRipple={true} 
              onClick={tab.function}  // This causes log out to auto-close the drawer, is this ok?
            >
              {tab.text !== 'Log In'
              ? <Link to={ROUTES[tab.route] || ''} className={ classes.link } onClick={() => setDrawerState(false)}>
                  <ListItemText primary={tab.text} />
                </Link>
              : <SignInPage />
              }
            </ListItem>
          ))}
        </List>
      </MuiDrawer>
    </React.Fragment>
  )
}

export default withFirebase(AppNav)