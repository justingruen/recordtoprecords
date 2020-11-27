import React, { useState } from 'react';

import { withFirebase } from '../Firebase'

import Copyright from '../ExtraComponents/copyright'
import useForm, { Form } from '../Pieces/useform'
import Controls from '../Pieces/controls'
import { makeStyles } from '@material-ui/styles'
import AlbumIcon from '@material-ui/icons/Album'
import { CssBaseline, Link, Container, Avatar, Typography, Grid, Box } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
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
    margin: theme.spacing(3, 0, 2),
  },
}))

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
)

const INITIAL_STATE = {
  email: '',
  error: null,
}

function PasswordForgetFormBase(props) {
  const validate = (fieldValues = state) => {
    let temp = {...errors}
    if('email' in fieldValues)
      temp.email = fieldValues.email ? (/$^|.+@.+..+/).test(fieldValues.email) ? '' : 'Email is not valid' : 'This field is required'
    setErrors({
      ...temp
    })

    if(fieldValues == state)
      return Object.values(temp).every(x => x === '')    
  }

  const { state, setState, errors, setErrors, handleInputChange } = useForm(INITIAL_STATE, true, validate)
  const { setPage, setClosePopupSignUp } = props
  const [firebase] = useState(props.firebase)
  const classes = useStyles()

  function onSubmit(event) {
    const { email } = state

    firebase
      .doPasswordReset(email)
      .then(() => {
        setClosePopupSignUp(false)
        setState({...INITIAL_STATE})
      })
      .catch(error => {
        setState(...state, error)
      })

    event.preventDefault()
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Controls.Input
            name='email'
            label='Email'
            margin='normal'
            value={state.email || ''}
            onChange={handleInputChange}
            error={ errors.email }
            fullWidth
            autoFocus
          />
          <Controls.Button
            type='submit'
            text='Submit'
            variant='contained'
            color='primary'
            fullWidth
            className={classes.submit}
          />
          <Grid container>
            <Grid item xs style={{marginRight: '20px'}}>
              <Link href='#' variant='body2' onClick={() => setPage('SignIn')}> 
                Sign In
              </Link>
            </Grid>
            <Grid item>
              <Link href='#' variant='body2' onClick={() => setPage('SignUp')}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

function PasswordForgetTitle() {
  const classes = useStyles()

  return(
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.logo} variant='circle'>
          <AlbumIcon fontSize='small'/>
        </Avatar>
        <Typography component='h1' variant='h6'>
          Forgot Your Password?
        </Typography>
      </div>
    </Container>
  )
}

// const PasswordForgetLink = () => (
//   <Link href='#' variant='body2' onClick={()}> 
//     Forgot Password?
//   </Link>
// )

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetTitle }