import React from 'react'
import {Typography, Container} from '@material-ui/core';
import Link from '@material-ui/core/Link'

export default function Copyright(props) {
  const { ...other } = props
  return(
    <Container {...other}>
      <Typography variant='body2' align='center'>
        {'Copyright © '}
        <Link color='inherit' href='https://justingruen.com/' target='_blank'>
          Justin Gruen
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Container>
  )
}