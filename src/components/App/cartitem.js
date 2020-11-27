import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Link as MuiLink } from '@material-ui/core'
import { withFirebase } from '../Firebase'

import { makeStyles } from '@material-ui/styles'
import AlbumIcon from '@material-ui/icons/Album'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { Icon,
  Typography,
  Grid,
  Drawer as MuiDrawer,
  Menu,
  MenuItem,
  Paper,
  Button,
  IconButton,
  ButtonBase
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

import Controls from '../Pieces/controls'
import RTRLogo from '../../RTR_Logo.svg'
import SignInPage from '../SignIn/index'
import SignOut from '../SignOut/index'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'

const useStyles = makeStyles((theme) => ({  //not sure what theme does here, but everything has it
  root: {
    flexGrow: 1,
  },
  rootcheckout: {
    flexGrow: 1,
    marginRight: '10px'
  },
  paper: {
    padding: theme.spacing(1),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  menuitem: {
    '&:hover': {
      backgroundColor: "#FFFFFF",
      cursor: 'default',
    }
  },
  checkout: {
    borderRadius: '0px',
    backgroundColor: '#000000',
    width: '100%'
  }
}));

function CartMenu(props) {
  const classes = useStyles()
  const { anchorEl, setAnchorEl, cart, setCartUpdate } = props

  return (
    <React.Fragment>
      {cart.length !== 0 &&
        <Menu 
        anchorEl={anchorEl}
        keepMounted={true}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(false)}
      >
        {cart.map(item => (
          <MenuItem key={item.uid} className={ classes.menuitem } button disableRipple={true}>
            <CartItem item={item} setCartUpdate={setCartUpdate} cart={cart} />
          </MenuItem>
        ))}
        <MenuItem className={ classes.menuitem } button disableRipple={true} >
          <div className={ classes.rootcheckout } >
            <Controls.Button
              type='button'
              variant='contained'
              color='primary'
              text='Checkout'
              size='large'
              fullWidth
              className={classes.checkout}
            />
          </div>

        </MenuItem>
      </Menu>
      }
    </React.Fragment>
  )
}

function CartItemBase({item, setCartUpdate, cart}) {
  const classes = useStyles()

  function onArrowRightClick(itemUID) {
    console.log('right')

    let cartCopy = [...cart]

    //find if item exists, just in case
    let itemIndex = cartCopy.findIndex(item => item.uid == itemUID);

    cartCopy[itemIndex].quantity += 1

    let cartString = JSON.stringify(cartCopy);
    localStorage.setItem('cart', cartString);

    setCartUpdate(true)
  }

  function onArrowLeftClick(itemUID) {
    console.log('left')

    let cartCopy = [...cart]

    //find if item exists, just in case
    let itemIndex = cartCopy.findIndex(item => item.uid == itemUID);

    if (cartCopy[itemIndex].quantity - 1 === 0) {
      cartCopy.splice(itemIndex, 1)
    } else {
      cartCopy[itemIndex].quantity -= 1
    }

    let cartString = JSON.stringify(cartCopy);
    localStorage.setItem('cart', cartString);

    setCartUpdate(true)
  }

  function onRemoveClick(itemUID) {
    let cartCopy = [...cart]

    //find if item exists, just in case
    let itemIndex = cartCopy.findIndex(item => item.uid == itemUID);

    cartCopy.splice(itemIndex, 1)
    
    let cartString = JSON.stringify(cartCopy);
    localStorage.setItem('cart', cartString);

    setCartUpdate(true)
  }

  return (
    <div className={classes.root}>
      {/* <Paper className={classes.paper}> */}
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image} disableRipple={true}>
              <img className={classes.img} alt="complex" src={item.imageurl} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container spacing={2}>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  {item.itemname}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {item.genre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ID: {item.uid}
                </Typography>
                <Typography variant="body1" style={{ paddingTop: '10px'}}>
                  Quantity: 
                  <IconButton onClick={() => onArrowLeftClick(item.uid)}>
                    <ArrowLeftIcon fontSize='large' style={{ color: '#000000'}} />
                  </IconButton>
                  {item.quantity}
                  <IconButton onClick={() => onArrowRightClick(item.uid)}>
                    <ArrowRightIcon fontSize='large' style={{ color: '#000000'}} />
                  </IconButton>
                </Typography>
              </Grid>
              <Grid item>
                <Button onClick={() => onRemoveClick(item.uid)} disableRipple={true} style={{padding: 0, backgroundColor: '#ffffff'}}>
                  <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    Remove
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="subtitle1">${parseFloat((item.price * item.quantity).toFixed(2))}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <hr />
      {/* </Paper> */}
    </div>
  )
}

const CartItem = withFirebase(CartItemBase)

export default CartMenu