import React, { Component, useEffect } from 'react';
import { compose } from 'recompose'

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../Session';
import { PasswordForgetForm } from '../PasswordForget'
import { withFirebase } from '../Firebase'
import PasswordChangeForm from '../PasswordChange'

import { Dialog, Button, Grid, Container } from '@material-ui/core'

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: null,
  },
  {
    id: 'google.com',
    provider: 'googleProvider'
  }
]
 
function AccountPage(props){
  useEffect(() => {
    props.setCurrentPage('account')
  }, [])

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div>
          <h3>Account: {authUser.email}</h3>

          <Container maxWidth='xl' style={{padding: '40px'}}>
            <Grid container direction='column' style={{border: '1px solid #00000050'}}>
              <br />
              <Grid item>
                <p>Change your pass!</p>
                <PasswordChangeForm />
              </Grid>
              <Grid item>
                <br />
                <hr />
                <br />
              </Grid>
              <Grid item>
                <LoginManagement authUser={authUser} />
              </Grid>
            </Grid>
          </Container>

          {/* <PasswordForgetForm /> */}
        </div>
      )}
    </AuthUserContext.Consumer>
  )
}

class LoginManagementBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSignInMethods: [],
      error: null,
    }
  }

  componentDidMount() {
    this.fetchSignInMethods()
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then(activeSignInMethods =>
        this.setState({ activeSignInMethods, error: null }),
      )
      .catch(error => this.setState({ error }));
  }

  onSocialLoginLink = provider => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }))
  }

  onUnlink = providerId => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  }

  onDefaultLoginLink = password => {
    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password,
    )

    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }))
  }

  

  render() {
    const { activeSignInMethods, error } = this.state;

    return (
      <div>
        Sign In Methods:
        <ul>
          {SIGN_IN_METHODS.map(signInMethod => {
            const onlyOneLeft = activeSignInMethods.length === 1;
            const isEnabled = activeSignInMethods.includes(
              signInMethod.id,
            );

            return (
              <li key={signInMethod.id}>
                {signInMethod.id === 'password' ? (
                  <DefaultLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onDefaultLoginLink}
                    onUnlink={this.onUnlink}
                  />
                ) : (
                  <SocialLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onSocialLoginLink}
                    onUnlink={this.onUnlink}
                  />
                )}
              </li>
            );
          })}
        </ul>
        {error && error.message}
      </div>
    );
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) => 
  isEnabled ? (
    <button 
      type='button' 
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactive {signInMethod.id}
    </button>
  ) : (
    <button 
      type='button' 
      onClick={() => onLink(signInMethod.provider)}
    >
      Link {signInMethod.id}
    </button>
  );

class DefaultLoginToggle extends Component {
  constructor(props) {
    super(props);

    this.state = { passwordOne: '', passwordTwo: ''}
  }

  onSubmit = event => {
    event.preventDefault()

    this.props.onLink(this.state.passwordOne)
    this.setState({ passwordOne: '', passwordTwo: ''})
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      onlyOneLeft,
      isEnabled,
      signInMethod,
      onUnlink,
    } = this.props;

    const { passwordOne, passwordTwo } = this.state;

    const isInvalid = 
      passwordOne !== passwordTwo || passwordOne === '';

    return isEnabled ? (
      <button
        type='button'
        onClick={() => onUnlink(signInMethod.id)}
        disabled={onlyOneLeft}
      >
        Deactivate {signInMethod.id}
      </button>
    ) : (
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />

        <button disabled={isInvalid} type='submit'>
          Link {signInMethod.id}
        </button>
      </form>
    )
  }
}

const condition = authUser => !!authUser

const LoginManagement = withFirebase(LoginManagementBase)
 
// without email verification
// export default withAuthorization(condition)(AccountPage)

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage)