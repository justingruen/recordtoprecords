import React, { useEffect } from 'react';

import RTRLogo from '../../RTR_Logo.svg'

import { Grid, Container, Typography } from '@material-ui/core'
 
function AboutUs(props) {
  useEffect(() => {
    props.setCurrentPage('aboutus')
  }, [])

  return (
    <div>
      <Grid container spacing={3} direction='column' alignContent='center' style={{paddingTop: '30px'}}>
        <Grid item xs align='center'>
          <img src={RTRLogo}  />
        </Grid>
        <Grid item xs align='center'>
          <Container maxWidth='md'>
            <Typography component='div' variant='body1' style={{color: '#000000'}}>
              Hello! My name is Justin Gruen. RecordTop Records is an e-commerce website intended
              to be my SCE (Senior Capstone Experience) to graduate from college. 
            </Typography>
          </Container>
        </Grid>
      </Grid>
    </div>
  )
}
 
export default AboutUs;