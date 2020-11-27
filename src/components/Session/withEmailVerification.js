import React from 'react'

import AuthUserContext from './context'
import { withFirebase } from '../Firebase'

const needsEmailVerification = authUser => 
  authUser && 
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider =>provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props)

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }))
    }

    render() {
      return(
        <AuthUserContext.Consumer>
          {authUser => 
            needsEmailVerification(authUser) ? (
              <div>
                {this.state.isSent ? (
                  <p>
                    Email confirmation sent: Check your inbox (Spam
                    folder included) for a confirmation rmail.
                    Refresh this page once you confirmed your rmail.
                  </p>
                ) : (
                  <p>
                    Verify your Email: Click the button to
                    send a confirmation email, then check your 
                    inbox (Spam folder included) or send
                    another.
                  </p>
                )}

                {/* TODO: Change button to fancier button and CSS this page */}
                <button
                  type='button'
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                >
                  Send confirmation Email
                </button>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      )
    }
  }

  return withFirebase(WithEmailVerification);
}

export default withEmailVerification;