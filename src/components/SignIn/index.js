
import React, { useState, useEffect } from 'react';
import { useHistory, Link as ReactLink } from 'react-router-dom';

import useForm, { Form } from '../Pieces/useform'
import Controls from '../Pieces/controls'
import Popup from '../Pieces/popup'
import Copyright from '../ExtraComponents/copyright'
import { PasswordForgetForm, PasswordForgetTitle } from '../PasswordForget';
import { SignUpForm, SignUpTitle } from '../SignUp'
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ERRORS from '../../constants/errors'

import Link from '@material-ui/core/Link'
import Container from '@material-ui/core/Container'
import AlbumIcon from '@material-ui/icons/Album'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import { CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'

import GoogleLogo from '../../btn_google_signin_light_normal_web.png'

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const useStyles = makeStyles((theme) => ({
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

function SignInPage(props) {
  const [openPopup, setOpenPopup] = useState(false)
  const [page, setPage] = useState('SignIn')

  function setClosePopupSignUp() {
    setOpenPopup(false)
    setPage('SignIn')
  }

  return(
    <>
      <Typography component='div' align={props.align} style={props.stylelink}>
        <Link
          style={{ color: 'black' }}
          variant='body1'
          underline='hover'
          component='button'
          onClick={() => setOpenPopup(true)}
        >
          Login
        </Link>
      </Typography>
      <Popup
        title={page === 'SignIn' 
          ? <SignInTitle /> : page === 'SignUp' 
          ? <SignUpTitle /> : page === 'PasswordForget'
          ? <PasswordForgetTitle /> : null}
        useLogo={true}
        openPopup={openPopup}
        setOpenpop={setOpenPopup}
        closePopup={setClosePopupSignUp}
      >
        {page === 'SignIn'    // I feel like theres a better way of doing this
          ? <SignInForm setOpenPopup={setOpenPopup} setPage={setPage}/> 
          : page === 'SignUp'
            ? <SignUpForm setClosePopupSignUp={setClosePopupSignUp} setPage={setPage}/>
            : page === 'PasswordForget'
              ? <PasswordForgetForm setClosePopupSignUp={setClosePopupSignUp} setPage={setPage}/> 
              : null
        }

        {/* <SignInGoogle />
        <PasswordForgetLink />
        <SignUpLink />  */}
      </Popup>      
    </>    
  )
}

function SignInTitle() {
  const classes = useStyles()

  return(
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.logo} variant='circle'>
          <AlbumIcon fontSize='small'/>
        </Avatar>
        <Typography component='h1' variant='h6'>
          Sign In
        </Typography>
      </div>
    </Container>
  )
}

function SignInFormBase(props){
  const validate = (fieldValues = state) => {
    let temp = {...errors}
    if('email' in fieldValues)
      temp.email = fieldValues.email ? (/$^|.+@.+..+/).test(fieldValues.email) ? '' : 'Email is not valid' : 'This field is required'
    if('password' in fieldValues)
      temp.password = fieldValues.password ? '' : 'This field is required'
    setErrors({
      ...temp
    })

    if(fieldValues == state)
      return Object.values(temp).every(x => x === '')
  }

  const { state, setState, errors, setErrors, handleInputChange } = useForm(INITIAL_STATE, true, validate)
  const { setPage, setOpenPopup } = props
  const [firebase] = useState(props.firebase)
  const history = useHistory()
  const classes = useStyles()

  function onSubmit(e) {
    e.preventDefault()

    if(validate()){
      const { email, password } = state;

      firebase
        .doSignInWithEmailAndPassword(email, password)
        .then(() => {
          setOpenPopup(false)
          setState({ ...INITIAL_STATE });
          history.push(ROUTES.HOME);  //Do we want to keep this?
        })
        .catch(err => {
          let error = err
          if (error.code === ERRORS.ERROR_CODE_ACCOUNT_NOTFOUND) 
            setState({ ...state, error: ERRORS.ERROR_MSG_ACCOUNT_NOTFOUND})
          if (error.code === ERRORS.ERROR_CODE_ACCOUNT_WRONGPASS) 
            setState({ ...state, error: ERRORS.ERROR_MSG_ACCOUNT_WRONGPASS})
        });
    }
  };  

  return(
      <div>
        <Container component="main" maxWidth="xs">
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
              <Controls.Input
                name='password'
                label='Password'
                type='password'
                margin='normal'
                value={state.password || ''}
                onChange={handleInputChange}
                error={ errors.password }
                fullWidth
              />
              {state.error && <Typography variant='body1' component='div' align='center' style={{color: 'red'}}>
                {state.error}
              </Typography>}
              <Controls.Button
                type='submit'
                text='Sign In'
                variant='contained'
                color='primary'
                fullWidth
                className={classes.submit}
              />
              <Grid container>
                <Grid item xs>
                  <Link href='#' variant='body2' onClick={() => setPage('PasswordForget')}>
                    Forgot Password?
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
          <br />
          <Typography component='div' variant='body1'>
            <hr />
          </Typography>
          <br />
          {/* <Grid container justify='center'>
            <Grid item>
              <SignInGoogle />
            </Grid>
          </Grid> */}
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </div>
  )
}

{/* {useLogo &&<Title />} */}
{/* <Typography variant='h6' component='div' align='center'>
  {title}
</Typography> */}

function SignInGoogleBase(props) {
  const [state, setState] = useState({...INITIAL_STATE})
  const [firebase] = useState(props.firebase)
  const history = useHistory()

  function onSubmit(event) {
    firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase realtime db too
        return firebase
          .user(socialAuthUser.user.uid)
          .set({
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {},
          })
      })
      .then(() => {
        setState({ error: null });
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERRORS.ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERRORS.ERROR_MSG_ACCOUNT_EXISTS
        }
      });

    event.preventDefault();
  }

  const { error } = state;

  return (
    <form onSubmit={onSubmit}>
      <button type='submit' style={{padding: '0px', border: '0', }}>
        <img src={GoogleLogo}/>  
      </button>

      { error && <p>{error.message}</p>}
    </form>
  )
}

const SignInForm = withFirebase(SignInFormBase)

const SignInGoogle = withFirebase(SignInGoogleBase)
 
export default SignInPage;

export { SignInForm, SignInGoogle }