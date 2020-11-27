import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import TurnTableImg from '../../turntable_1.jpg'
import RecordPlayer from '../../record-player.jpg'
import Vinyl from '../../vinyl_1.jpg'
import TurnTable2 from '../../turntable_2.jpg'
import Controls from '../Pieces/controls'

import { Container, Typography, Grid, makeStyles, Button, useMediaQuery, useTheme } from '@material-ui/core'

import * as ROUTES from '../../constants/routes';

const useStyles = makeStyles(theme => ({
  main: {
    width: '100%',
    background: `url(${TurnTableImg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  gridmain: {
    paddingTop: '40px',
    paddingBottom: '40px',
  },
  title: {
    fontWeight: 600,
    color: '#ffffff',
  },
  subtitle: {
    fontWeight: 500,
    color: '#ffffff'
  },
  catalogbutton: {
    borderRadius: '0px',
    backgroundColor: 'rgb(53,53,53)',
  }
}))
 
function Home(props) {
  const classes = useStyles()
  const theme = useTheme()

  const matches = {   //Could also use MUI Hidden component, which is cleaner?
    xs: useMediaQuery(theme.breakpoints.only('xs')),
    sm: useMediaQuery(theme.breakpoints.only('sm')),
    md: useMediaQuery(theme.breakpoints.only('md')),
    lg: useMediaQuery(theme.breakpoints.only('lg')),
    xl: useMediaQuery(theme.breakpoints.only('xl')),
    downsm: useMediaQuery(theme.breakpoints.down('sm')),
  }

  useEffect(() => {
    props.setCurrentPage('home')
  }, [])

  return (
    <div>
      <div>
        <Container maxWidth='false' disableGutters={true} className={ classes.main }>
          <Grid container spacing={3} alignContent='center' direction='column' className={classes.gridmain}>
            <Grid item xs align='center'>
              <Typography component='div' variant='h2' className={ classes.title }>
                Record Top Records
              </Typography>
            </Grid>
            <Grid item xs align='center'>
              <Typography component='div' variant={matches.xs ? 'h6' : 'h5'} className={ classes.subtitle }>
                Records for your record needs
              </Typography>
            </Grid>
            <Grid item xs align='center'>
              <Link to={ROUTES.CATALOG} style={{ textDecoration: 'none' }}>
                <Controls.Button
                  type='button'
                  variant='contained'
                  color='primary'
                  text='Catalog'
                  size='large'
                  className={ classes.catalogbutton }
                />          
              </Link>
            </Grid>
          </Grid>
        </Container>
        <Grid container spacing={false} alignContent='center' direction='column' style={{paddingTop: '80px'}}>
          <Grid item xs align='center' style={{paddingBottom: '80px'}}>
            <Container maxWidth='md'>
              <Typography component='div' variant='body1' style={{fontSize: '20px'}}>
                Welcome to RecordTop Records! This site is a marketplace for all things records,
                as long as those things are records. Please feel free to visit our Catalog page to 
                view our inventory and our About Us page to learn more about who we are! Also, follow
                us @rtrofficial on both Twitter and Instagram for updates! Thanks for stopping by!
              </Typography>
            </Container>
          </Grid>
          <Grid item container xs alignContent='center' justify='center'>
            <Grid item>
              <img src={RecordPlayer} width='100%'/>
            </Grid>
            <Grid item>
              <img src={Vinyl} width='100%'/>
            </Grid>
            <Grid item>
              <img src={TurnTable2} width='100%'/>
            </Grid>
          </Grid>
        </Grid>

      </div>
      {/* <img src={TurnTableImg} alt="turntable" /> */}
    </div>
  )
}
 
export default Home;