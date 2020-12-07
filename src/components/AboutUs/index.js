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
              Hello! My name is Justin Gruen. Thank you for stopping by! RecordTop 
              Records is an e-commerce website intended to be my SCE (Senior Capstone 
              Experience) to graduate from college. I built this site using React,
              Nodejs, Firebase, and Material-UI.  In the future I hope to use this site, 
              and others I have developed, to procure a full-time web development role 
              as well as freelance for smaller businesses and nonprofits.

              If you'd like to check out more works of mine, please visit <a href="http://www.justingruen.com/" target="_blank">www.justingruen.com</a>    
            </Typography>
          </Container>
        </Grid>
      </Grid>
    </div>
  )
}
 
export default AboutUs;