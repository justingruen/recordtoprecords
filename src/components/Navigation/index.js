import React from 'react';
import { Link } from 'react-router-dom'
import { Link as MuiLink, makeStyles, Typography } from '@material-ui/core'

import SignOutButton from '../SignOut'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'
import SignInPage from '../SignIn/index'

import { AuthUserContext } from '../Session'

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    color: 'black',
  },
}))
 
const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

function NavigationAuth({authUser}) {
  const classes = useStyles()

  return(
    <div>
      {/* Home */}
      <MuiLink component='div'>
        <Link to={ROUTES.HOME} className={ classes.link }>
          <Typography component='div' variant='body1' align='left' style={{color: '#000000', marginBottom: '10px'}}>
            Home
          </Typography>
        </Link>
      </MuiLink>
      {/* Catalog */}
      <MuiLink component='div'>
        <Link to={ROUTES.CATALOG} className={ classes.link }>
          <Typography component='div' variant='body1' align='left' style={{color: '#000000', marginBottom: '10px'}}>
            Catalog
          </Typography>
        </Link>
      </MuiLink>
      {/* Account */}
      <MuiLink component='div'>
        <Link to={ROUTES.ACCOUNT} className={ classes.link }>
          <Typography component='div' variant='body1' align='left' style={{color: '#000000', marginBottom: '10px'}}>
            Account
          </Typography>
        </Link>
      </MuiLink>
      {/* Admin */}
      {!!authUser.roles[ROLES.ADMIN] && (
        <MuiLink component='div'>
          <Link to={ROUTES.ADMIN} className={ classes.link }>
            <Typography component='div' variant='body1' align='left' style={{color: '#000000', marginBottom: '10px'}}>
              Admin
            </Typography>
          </Link>
        </MuiLink>
      )}

      <SignOutButton />
    </div>
  )
}

function NavigationNonAuth() {
  const classes = useStyles()

  return(
    <div>
      {/* Home */}
      <MuiLink component='div'>
        <Link to={ROUTES.HOME} className={ classes.link }>
          <Typography component='div' variant='body1' align='left' style={{color: '#000000', marginBottom: '10px'}}>
            Home
          </Typography>
        </Link>
      </MuiLink>
      {/* Catalog */}
      <MuiLink component='div'>
        <Link to={ROUTES.CATALOG} className={ classes.link }>
          <Typography component='div' variant='body1' align='left' style={{color: '#000000', marginBottom: '10px'}}>
            Catalog
          </Typography>
        </Link>
      </MuiLink>
      {/* Sign In */}
      <SignInPage align={'left'} />
    </div>
  )
}

// const NavigationAuth = ({ authUser }) => (
//   <div>
//       <MuiLink component='div'>
//         <Link to={ROUTES.HOME} className={ classes?.link}>
//           <Typography component='div' variant='body1' style={{color: '#000000'}}>
//             Home
//           </Typography>
//         </Link>
//       </MuiLink>
//       {/* <Link to={ROUTES.HOME}>Landing</Link> */}
//       <Link to={ROUTES.HOME}>Home</Link>
//       <Link to={ROUTES.ACCOUNT}>Account</Link>
//     {!!authUser.roles[ROLES.ADMIN] && (
//         <Link to={ROUTES.ADMIN}>Admin</Link>
//     )}
//       <SignOutButton />
//   </div>
// );

// const NavigationNonAuth = () => (
//   <div>
//       <Link to={ROUTES.HOME}>Landing</Link>
//       <Link to={ROUTES.SIGN_IN}>Sign In</Link>
//   </div>
// )
 
export default Navigation;