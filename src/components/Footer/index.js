import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router} from 'react-router-dom'

import Copyright from '../ExtraComponents/copyright'
import Navigation from '../Navigation/index'

import { makeStyles, Container, Grid, Typography, Link as MuiLink, Box, useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  maincontainer: {
    backgroundColor: '#f6f6f6',
    color: '#000000',
    // marginTop: 'calc(5% + 60px)',
    bottom: 0,
    marginTop: '65px'
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
  topgrid: {
    flexGrow: 1,
  },
  quicklinks: {
    [theme.breakpoints.only('xs')]: {
      paddingLeft: '40px'
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: '80px'
    },
  }
}))

function Footer() {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <div>
      <Container className={ classes.maincontainer } maxWidth={false} disableGutters={true} style={{paddingBottom: '15px'}}>
        <Container maxWidth='lg' style={{paddingTop: '40px', paddingBottom: '15px'}}>
          <Grid container spacing={3} className={ classes.topgrid } 
            direction={useMediaQuery(theme.breakpoints.only('xs')) ? 'column' : 'row'} 
            justify='space-around' 
          >
            <Grid item container xs={6} sm={3} alignContent={useMediaQuery(theme.breakpoints.only('xs')) ? 'flex-start' : 'flex-end'} direction='column' className={ classes.gridlinks }> 
              <Grid item>
                <Typography component='div' variant='body1' align='left' style={{fontWeight: 'bold'}}>
                  Quick Links
                </Typography>
              </Grid>
              <br />
              <Grid item>
                <Navigation />
              </Grid>
            </Grid>
            <Grid item xs={1} sm={6} />
            <Grid item container xs={6} sm={3}  direction='column'>
              <Grid item>
                <Typography component='div' variant='body1' align='left' style={{fontWeight: 'bold'}}>
                  Contact
                </Typography>
              </Grid>
              <br />
              <Grid item>
                <Typography component='div' variant='body1' align='left' style={{marginBottom: '10px'}}>
                  Email - rtr123@gmail.com
                </Typography>
              </Grid>
              <Grid item>
                <Typography component='div' variant='body1' align='left' style={{marginBottom: '10px'}}>
                  Twitter - @rtrofficial
                </Typography>
              </Grid>
              <Grid item>
                <Typography component='div' variant='body1' align='left'>
                  Ig - @rtrofficial
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth='md'>
          <Copyright style={{padding: 20, color: '#000000'}} />
        </Container>
      </Container>
    </div>
  )
}

export default Footer