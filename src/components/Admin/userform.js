import React, { useState, useEffect } from 'react'
import { withFirebase } from '../Firebase'

import useForm, { Form } from '../Pieces/useform'
import Controls from '../Pieces/controls'
import { Container, makeStyles, CssBaseline } from '@material-ui/core'

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
}))

const INITIAL_STATE = {
  loading: false,
  username: '',
  error: null
} 

function UserDetailsBase(props) {
  const validate = (fieldValues = state) => {
    let temp = {...errors}
    if('username' in fieldValues)
      temp.username = fieldValues.username ? '' : 'This field is required'
    setErrors({
      ...temp
    })

    if(fieldValues == state)
      return Object.values(temp).every(x => x === '')
  }

  const classes = useStyles()
  const { state, setState, errors, setErrors, handleInputChange } = useForm(INITIAL_STATE, true, validate)
  const { userForEdit } = props
  const [firebase] = useState(props.firebase)
  const { setOpenPopup, setNotify } = props

  function onSubmit(e){
    e.preventDefault()
    if(validate()){
      firebase
        .user(state.uid)
        .update({
          username: state.username
        })
      
      setOpenPopup(false)
      setNotify({
        isOpen: true,
        message: 'Submitted!',
        type: 'success'
      })
    }
  }

  const resetForm = () => { //
    setState({
      ...userForEdit
    })
  }

  useEffect(() => {
    if(userForEdit != null)
      setState({
        ...userForEdit,
      })
  }, [userForEdit])

  return(
    <div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Form className={classes.form} onSubmit={onSubmit}>
            <Controls.Input
              name='username'
              label='Full name'
              margin='normal'
              value={state.username || ''}
              onChange={handleInputChange}
              error={ errors.username }
              fullWidth
              autoFocus
            />
            <Controls.Button
              type='submit'
              variant='contained'
              color='primary'
              size='large'
              text='Submit'
              fullWidth
              className={classes.submit}
            />          
            <Controls.Button     //TODO: Reset is buggy with errors... I wonder if on reset I could set all errors to null?
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

const UserDetails = withFirebase(UserDetailsBase)

export default UserDetails
