import React, { useState, useEffect } from 'react'
import { withFirebase } from '../Firebase'

import useForm, { Form } from '../Pieces/useform'
import Controls from '../Pieces/controls'
import { Grid, Typography, Button as MuiButton, Container, makeStyles, CssBaseline } from '@material-ui/core'
import { TrendingUpSharp } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    //TODO: Make logo bigger
    margin: theme.spacing(2),
    backgroundColor: '#000000',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(0),
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  imageprev: {
    maxWidth: '100%',
    height: 'auto',
  }
}))

const INITIAL_STATE = {
  loading: false,
  itemname: '',
  price: '',
  genre: '',
  image: '',
  imageprev: '',
  error: null
} 

function ItemDetailsBase(props) {
  const validate = (fieldValues = state) => {
    let temp = {...errors}
    if('itemname' in fieldValues)
      temp.itemname = fieldValues.itemname ? '' : 'This field is required'
    if('price' in fieldValues)  // This regex was the best I could find (also found: (/^\d+(,\d{3})*(\.\d{2,2})?$/) )
      temp.price = fieldValues.price ?  (/\d+\.\d{2,2}?$/).test(fieldValues.price) ? '' : 'Price must be in xx.xx format' : 'This field is required'
    if('genre' in fieldValues)
      temp.genre = fieldValues.genre ? '' : 'This field is required'
    if('image' in fieldValues)
      temp.image = fieldValues.image ? '' : 'This field is required'
    setErrors({
      ...temp
    })

    if(fieldValues == state)
      return Object.values(temp).every(x => x === '')
  }

  const classes = useStyles()
  const { state, setState, errors, setErrors, handleInputChange } = useForm(INITIAL_STATE, true, validate)
  const [ originalName, setOriginalName ] = useState('')
  const [ imageChange, setImageChange ] = useState(false)
  const { itemForEdit } = props
  const [firebase] = useState(props.firebase)
  const { setOpenPopup, setNotify, createNew, setCreateNew, itemsList } = props

  function onSubmit(e){
    e.preventDefault()
    if(errors.image) setState({ ...state, error: 'Image field is required'})  //TODO: This doesnt work, it did the thing twice
    if(validate()){

      //1) if new imagename is not equal to old image name
      //2) check for image name in all items
      //3) if you see it, return
      //4) if not, delete the image from the firebase prodimages
      if (createNew){ 
          firebase.prodimage(state.image.name).put(state.image)
          .then(() => {
            firebase.prodimage(state.image.name).getDownloadURL()
            .then(url => {
              firebase.items().push({
                itemname: state.itemname,
                price: state.price,
                genre: state.genre,
                image: state.image.name,
                imageurl: url
              })
            })
          })

//TODO: Currently does not work if same image is uploaded twice. it reuploads so it overwrites download url
//TODO: Also, how does new and update work with images of the same name? Maybe give an image some form of uid?

          // let itemwithsameimage = cartCopy.find(cartItem => cartItem.image === state.image.name)

          // firebase.items()
          //   .orderByChild('image')
          //   .equalTo(state.image.name)
          //   .on("value", snapshot => {
          //     if (snapshot.exists())
          //       console.log(itemsList)
          //     })

        setCreateNew(false)
      } else {
        if(imageChange) {
          firebase.items()
            .orderByChild('image')
            .equalTo(originalName)
            .on("value", snapshot => {
              if (!snapshot.exists())
                firebase.prodimage(originalName).delete()
              })

          firebase.prodimage(state.image.name).put(state.image)
          .then(() => {
            firebase.prodimage(state.image.name).getDownloadURL()
            .then(url => {
              firebase.items().push({
                itemname: state.itemname,
                price: state.price,
                genre: state.genre,
                image: state.image.name,
                imageurl: url
              })
            })
          })
        } else {
          firebase
          .item(state.uid)
          .update({
            itemname: state.itemname,
            price: state.price,
            genre: state.genre,
            image: state.image.name,
            imageurl: state.imageurl
          })
        }
      }
      
      setOpenPopup(false)
      setNotify({
        isOpen: true,
        message: 'Submitted!',
        type: 'success'
      })
    }
  }

  const resetForm = () => {
    setState({
      ...itemForEdit,
      image: {
        name: itemForEdit.image
      },
      imageprev: itemForEdit.imageurl
    })

    setOriginalName(itemForEdit.image)
    setImageChange(false)
  }

  const imageOnChange = (e) => {
    if (e.target.files[0].type !== 'image/jpeg' && e.target.files[0].type !== 'image/png'){
      setState({
        ...state,
        error: 'File must be .jpeg or .png'
      })
      return
    }
    
    let reader = new FileReader()
    let file = e.target.files[0]

    reader.onloadend = () => {
      setState({
        ...state,
        image: file,
        imageprev: reader.result
      })
      setImageChange(true)
    }

    if (e.target.files[0].size > 4000000)
      alert('File size cannot exceed more then 4MB')
    else
      reader.readAsDataURL(file)

  }

  useEffect(() => {
    if(itemForEdit != null){
      // firebase.prodimage(itemForEdit.image).getDownloadURL()
      //   .then(url => {
          setState({
            ...itemForEdit,
            image: {
              name: itemForEdit.image
            },
            imageprev: itemForEdit.imageurl
          })
        // })
      setOriginalName(itemForEdit.image)
    }
  }, [itemForEdit])

  return(
    <div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Form className={classes.form} onSubmit={onSubmit}>
            <Controls.Input
              name='itemname'
              label='Item name'
              margin='normal'
              value={state.itemname || ''}
              onChange={handleInputChange}
              error={ errors.itemname }
              fullWidth
              autoFocus
            />
            <Controls.Input
              name='price'
              label='Price (USD)'
              margin='normal'
              value={state.price || ''}
              onChange={handleInputChange}
              error={ errors.price }
              // type='number'
              fullWidth
            />
            <Controls.Input
              name='genre'
              label='Main Genre'
              margin='normal'
              value={state.genre || ''}
              onChange={handleInputChange}
              error={ errors.genre }
              fullWidth
            />
            <Grid container display='flex' alignItems='center' style={{marginBottom: '20px'}}>
              <Grid item style={{marginRight: '5px'}}>
                <MuiButton
                  variant="contained"
                  component="label"
                  style={{marginTop:'10px'}}
                >
                  Upload File
                  <input
                    type="file"
                    accept='image/*'
                    style={{ display: "none" }}
                    onChange={imageOnChange}
                  />
                </MuiButton>
              </Grid>
              <Grid item>
                <Typography component='div' variant='body1' align='center'>
                    {state?.image?.name}
                </Typography>
              </Grid>
            </Grid>
            {state.imageprev &&
              <img className={classes.imageprev} src={state.imageprev} alt='Not found' />
            }
            {/* {state.imageprev &&
              <img className={classes.imageprev} src={state.imageurl} alt='Not found' />
            } */}
            {state.error && 
              <Typography variant='body1' component='div' align='center' style={{color: 'red'}}>
                {state.error}
              </Typography>
            }
            <Controls.Button
              type='submit'
              variant='contained'
              color='primary'
              size='large'
              text='Submit'
              fullWidth
              className={classes.submit}
            />          
            <Controls.Button
              variant='contained'
              color='primary'
              size='large'
              text='Reset'
              fullWidth
              onClick={resetForm}
            />
          </Form>
        </div>
      </Container>
    </div>
  )
}

const ItemDetails = withFirebase(ItemDetailsBase)

export default ItemDetails

//TODO: Note, this whole image deal-y could definitely stand to be cleaned up. And maybe add download url to the item? this would allow easy url in the table