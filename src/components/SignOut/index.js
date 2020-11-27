import React from 'react';

import { withFirebase } from '../Firebase'

import { makeStyles } from '@material-ui/styles'
import { Link, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'black',
  }
}));

function SignOut({ firebase }) {
  const classes = useStyles()
  
  return (
    <Typography component='div'>
      <Link
        className={ classes.link }
        variant='body1'
        underline='hover'
        component='button'
        onClick={firebase.doSignOut}
      >
        Sign Out
      </Link>
    </Typography>
  )
}
 
export default withFirebase(SignOut)