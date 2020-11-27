import React, { useState, useEffect } from 'react'
import { withFirebase } from '../Firebase'

import AppNav from '../App/appnav'
import Controls from '../Pieces/controls'

import { makeStyles,
  Grid,
  Paper,
  Container,
  ButtonBase,
  Typography,
  Hidden
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 256,
    height: 256,
  },
  img: {
    margin: 'auto',
    display: 'block',
    // width: '100%',
    // height: '100%',
    maxWidth: '100%',
    maxHeight: '256px',
    minWidth: '256px',
    minHeight: '256px',
    objectFit: 'fill',
  },
  addButton: {
    borderRadius: '0px',
    backgroundColor: '#000000'
  }
}));

const INITIAL_STATE = {
  loading: true,
  items: [],
  itemsmatrix2: [[],[]],
  itemsmatrix3: [[],[],[]],
}

function CatalogBase(props) {
  const [state, setState] = useState(INITIAL_STATE)
  const [firebase] = useState(props.firebase)
  const classes = useStyles()
  const [callBack, setCallBack] = useState(false)

  const [cart, setCart] = useState([])
  var localCart = localStorage.getItem('cart')

  useEffect(() => {
    props.setCurrentPage('catalog')
  }, [])

  useEffect(() => {
    setState({ ...state, loading: true})

    firebase.items().once('value', snapshot => {
      const itemsObject = snapshot.val()

      if (itemsObject === null) {
        setState({
          ...state,
          loading: false
        })
      } else {
        const itemsList = Object.keys(itemsObject).map(key => ({
          ...itemsObject[key],
          uid: key,
        }))

        // Two Column Matrix
        let cols2 = [[],[]]   // There's got to be a better way of doing this
        let col2 = 0
        itemsList.forEach(item => {
          cols2[col2].push(item)
          col2++
          if (col2 === 2) col2 = 0
        });

        if (cols2[1].length < cols2[0].length) {
          cols2[1].push({
            uid: 'a',
            donotuse: true,
          })
        }

        // Three Column Matrix
        let cols3 = [[],[],[]]   // There's got to be a better way of doing this
        let col3 = 0
        itemsList.forEach(item => {
          cols3[col3].push(item)
          col3++
          if (col3 === 3) col3 = 0
        });

        if (cols3[1].length < cols3[0].length) {
          cols3[1].push({
            uid: 'a',
            donotuse: true,
          })
        }
        if (cols3[2].length < cols3[0].length) {
          cols3[2].push({
            uid: 'b',
            donotuse: true,
          })
        }

        setState({
          items: itemsList,
          itemsmatrix2: cols2,
          itemsmatrix3: cols3,
          loading: false,
        })

        setCallBack(true)
      }
    })


    return () => firebase.items().off()
  }, [])

  useEffect(() => {
    if (props.cartUpdate) {
      console.log('rerendering catalog')
      
      // Set cart
      localCart = JSON.parse(localCart)
      if (localCart) setCart(localCart)

      props.setCartUpdate(false)
    }
  },[props.cartUpdate])

  function addItem(item) {
    // Create a copy of our cart state, avoid overwriting existing state
    let cartCopy = [...cart]

    // Assuming we have an ID field in our item
    let {uid} = item
    let tempitem = item

    // Look for item in cart array
    let existingItem = cartCopy.find(cartItem => cartItem.uid === uid)

    // If item already exists
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      tempitem = {
        ...tempitem,
        quantity: 1
      }
      cartCopy.push(tempitem)
    }

    // Update state
    setCart(cartCopy)

    // Make cart a string and store in local
    let stringCart = JSON.stringify(cartCopy)
    localStorage.setItem('cart', stringCart)

    props.setCartUpdate(true)
  }

  function CustomPaper({item}) {
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={2} justify='center' direction='column'>
            <Grid item className={classes.img}>
              <img className={classes.img} alt="complex" src={item.imageurl} />
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>
                {item.itemname}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {item.genre}
              </Typography>
              <Typography variant="body2" gutterBottom>
                ${item.price}
              </Typography>
            </Grid>
            <Grid item>
              <Controls.Button
                type='submit'
                variant='contained'
                color='primary'
                text='Add To Cart'
                size='large'
                fullWidth
                className={classes.addButton}
                onClick={() => addItem(item)}
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }

  return (
    <div>
        <Container maxWidth='lg' className={classes.root}>
          <Typography variant='h4' align='center' gutterBottom={true} style={{fontWeight: 'bold', marginTop: '20px', marginBottom: '20px'}}>
            Products
          </Typography>
          <Typography variant='body1' align='center' gutterBottom={true} style={{fontStyle: 'italic', marginTop: '20px', marginBottom: '20px'}}>
            {state.items.length} Products
          </Typography>
          {/* Non-mobile 3 */}
          <Hidden mdDown>
            <Grid container spacing={3} justify='center'>
                {state.itemsmatrix3.map(row =>
                  <Grid container item xs={4} spacing={3} direction='column' key={state.itemsmatrix3.indexOf(row)}>
                    {row.map(item =>
                      <div key={item.uid}>
                        {item.uid !== 'a' && item.uid !== 'b'
                        ?   <Grid item align='center' style={{padding: '15px'}}>
                              <CustomPaper item={item}/>
                            </Grid>
                        :   item.uid === 'a'  ?   <Grid item></Grid> : item.uid === 'b'
                        ?   <Grid item></Grid> : null
                        }
                      </div>
                    )}
                  </Grid>
                )}
            </Grid>
          </Hidden>

          {/* Non-mobile 2 */}
          <Hidden smDown lgUp>
            <Grid container spacing={3} justify='center'>
                {state.itemsmatrix2.map(row =>
                  <Grid container item xs={6} spacing={3} direction='column' key={state.itemsmatrix2.indexOf(row)}>
                    {row.map(item =>
                      <div key={item.uid}>
                        {item.uid !== 'a' && item.uid !== 'b'
                        ?   <Grid item align='center' style={{padding: '15px'}}>
                              <CustomPaper item={item}/>
                            </Grid>
                        :   item.uid === 'a'  ?   <Grid item></Grid> : item.uid === 'b'
                        ?   <Grid item></Grid> : null
                        }
                      </div>
                    )}
                  </Grid>
                )}
            </Grid>
          </Hidden>

        {/* Mobile */}
        <Hidden mdUp>
          <Grid container spacing={3} justify='center' direction='column'>
            {state.items.map(item =>
              <Grid item key={item.uid} align='center' style={{padding: '15px'}}>
                <CustomPaper item={item}/>
              </Grid>
            )}
          </Grid>
        </Hidden>
      </Container>
    </div>

      // {/* {state.items.map(item =>
      //   <div key={item.uid}>
      //     <p>{item.itemname}</p>
      //     <p>{item.price}</p>
      //   </div> 
      // )} */}
  )
}

const Catalog = withFirebase(CatalogBase)

export default Catalog