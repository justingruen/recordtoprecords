import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import useForm, { Form } from '../Pieces/useform'
import Controls from '../Pieces/controls'
import Copyright from '../ExtraComponents/copyright'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'
import * as ERRORS from '../../constants/errors'


import Link from '@material-ui/core/Link'
import AlbumIcon from '@material-ui/icons/Album'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/styles'
import { CssBaseline, Typography } from '@material-ui/core'

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

function SignUpPage() {
  return (
    <div>
      <SignUpForm />
    </div>
  )
}

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null
}

function SignUpTitle() {
  const classes = useStyles()

  return(
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.logo} variant='circle'>
          <AlbumIcon fontSize='small'/>
        </Avatar>
        <Typography component='h1' variant='h6'>
          Sign Up
        </Typography>
      </div>
    </Container>
  )
}

function SignUpFormBase(props) {
  const validate = (fieldValues = state) => {
    let temp = {...errors}
    if('username' in fieldValues)
      temp.username = fieldValues.username ? '' : 'This field is required'
    if('email' in fieldValues)
      temp.email = fieldValues.email ? (/$^|.+@.+..+/).test(fieldValues.email) ? '' : 'Email is not valid' : 'This field is required'
    if('passwordOne' in fieldValues)
      temp.passwordOne = fieldValues.passwordOne ? '' : 'This field is required'
    if('passwordTwo' in fieldValues)
      temp.passwordTwo = fieldValues.passwordTwo ? '' : 'This field is required'
    setErrors({
      ...temp
    })

    if(fieldValues == state)
      return Object.values(temp).every(x => x === '')    
  }

  const { state, setState, errors, setErrors, handleInputChange } = useForm(INITIAL_STATE, true, validate)
  const { setPage, setClosePopupSignUp } = props
  const [firebase] = useState(props.firebase)
  const history = useHistory()
  const classes = useStyles()

  function onSubmit(e) {
    e.preventDefault()
    if(validate()){
      if (state.passwordOne === state.passwordTwo){
        const { username, email, passwordOne, isAdmin } = state;
        const roles = {}
    
        if (isAdmin) {
          roles[ROLES.ADMIN] = ROLES.ADMIN
        }
     
        firebase
          .doCreateUserWithEmailAndPassword(email, passwordOne)
          .then(authUser => {
            // Create a user in your Firebase realtime database
            return firebase
              .user(authUser.user.uid)
              .set({
                username,
                email,
                roles,
              });
          })
          .then(() => {
            setClosePopupSignUp()
            setState({ ...INITIAL_STATE }); // TODO: Is this necessary?
            history.push(ROUTES.ACCOUNT);
          })
          .catch(err => {
            let error = err
            console.log(error.code)
            if (error.code === ERRORS.ERROR_CODE_ACCOUNT_EXISTS) 
              setState({ ...state, error: ERRORS.ERROR_MSG_ACCOUNT_EXISTS })
            if (error.code === ERRORS.ERROR_CODE_WEAK_PASSWORD)
              setState({ ...state, error: ERRORS.ERROR_MSG_WEAK_PASSWORD})
          }); 
      } else {
        setState({
          ...state,
          error: 'Passwords do not match'
        })
      }
    }
  };
  
  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controls.Input
                name='username'
                label='Full name'
                fullWidth
                value={state.username || ''}
                onChange={handleInputChange}
                error={ errors.username }
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <Controls.Input
                name='email'
                label='Email'
                fullWidth
                value={state.email || ''}
                onChange={handleInputChange}
                error={ errors.email }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controls.Input
                name='passwordOne'
                label='Password'
                fullWidth
                type='password'
                value={state.passwordOne || ''}
                onChange={handleInputChange}
                error={ errors.passwordOne }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controls.Input
                name='passwordTwo'
                label='Re-type Password'
                fullWidth
                type='password'
                value={state.passwordTwo || ''}
                onChange={handleInputChange}
                error={ errors.passwordTwo }
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Controls.Checkbox
                name='isAdmin'
                label='Administrator'
                value={state.isAdmin}
                onChange={handleInputChange}
                color='primary'
              />
            </Grid> */}
          </Grid>
          {state.error && <Typography variant='body1' component='div' align='center' style={{color: 'red'}}>
                {state.error}
          </Typography>}
          <Controls.Button
            type='submit'
            text='Sign Up'
            variant='contained'
            color='primary'
            fullWidth
            className={classes.submit}
          />
          <Grid container justify='flex-end'>
            <Grid item>
              <Link href='#' variant='body2' onClick={() => setPage('SignIn')}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Form>
        <Box mt={5}>
          <Copyright />
        </Box>
      </div>
    </Container>
  )
}

// const SignUpLink = () => (
//   <p>
//     Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
//   </p>
// );

const SignUpForm = withFirebase(SignUpFormBase);

export default SignUpPage

export { SignUpForm, SignUpTitle }