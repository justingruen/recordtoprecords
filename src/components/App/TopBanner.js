import React from 'react'
import { Container, Typography } from '@material-ui/core'

export default function TopBanner() {
  return ( 
    <Container style={{backgroundColor: '#353535'}} maxWidth={false} disableGutters>
      <Typography component='div' variant='subtitle1' align='center' 
        style={{backgroundColor: '#353535', color: '#FFFFFF', paddingTop: '11px', paddingBottom: '11px', paddingLeft: '10px', paddingRight: '10px'}}
      >
        <b>Enter 'RECORDTOP' at checkout for 10% off in honor of our Grand Opening!</b>
      </Typography>
    </Container>
  )
}
