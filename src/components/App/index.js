import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

 
import Navigation from '../Navigation';
import AboutUsPage from '../AboutUs'
import HomePage from '../Home';
import CatalogPage from '../Catalog';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import AppNav from './appnav'
import TopBanner from './TopBanner'
import Footer from '../Footer'
import Drawer from '../ExtraComponents/drawer'

import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
 
import { AuthUserContext } from '../Session'
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import { makeStyles, CssBaseline, Container, Grid } from '@material-ui/core';

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#457B9D'
      },
      secondary: {
        main: '#E63946'
      },
      background: {
        default: '#ffffff'
      }
    },
    typography: {
      fontFamily: [
        'Montserrat, sans-serif',
      ]
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': []
        }
      }
    },
    props: {
      MuiIconButton: {
        disableRipple: true
      }
    },
    overrides: {
      MuiIconButton: {
        root: {
          '&:hover': {
            backgroundColor: "$labelcolor"
          }
        }
      }
    }
  })

  const useStyles = makeStyles(() => ({
    top: {
      margin: 0,
      minHeight: '100vh',
      display: 'flex',
      flexFlow: 'column',
    },
    main: {
      flexGrow: 1,
    }
  }))
 
function App() {
  const classes = useStyles()
  const [currentPage, setCurrentPage] = useState()
  const [cartUpdate, setCartUpdate] = useState(true)

  return(
    <Router>
      <div className={ classes.top }>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className={ classes.main }>
              {/* <Router> */}
            <div>
              {currentPage === 'home' && <TopBanner />}

              <AuthUserContext.Consumer>
                {authUser =>
                  <React.Fragment>
                    <AppNav 
                      authUser={authUser}
                      currentPage={currentPage}
                      cartUpdate={cartUpdate}
                      setCartUpdate={setCartUpdate}
                    />
                  </React.Fragment>
                }
              </AuthUserContext.Consumer>

              <Route exact path={ROUTES.HOME} render={() => (
                  <HomePage setCurrentPage={setCurrentPage} />
                )}
              />
              <Route exact path={ROUTES.CATALOG} render={() => (
                  <CatalogPage
                    setCurrentPage={setCurrentPage}
                    cartUpdate={cartUpdate}
                    setCartUpdate={setCartUpdate}
                  />
                )}
              />
              <Route path={ROUTES.ABOUTUS} render={() => (
                  <AboutUsPage setCurrentPage={setCurrentPage} />
                )}
              />
              <Route exact path={ROUTES.ACCOUNT} render={() => (
                  <AccountPage setCurrentPage={setCurrentPage} />
                )}
              />
              <Route path={ROUTES.ADMIN} render={() => (
                  <AdminPage setCurrentPage={setCurrentPage} />
                )}
              />
            </div>
          </div>
          <Container maxWidth={false} disableGutters={true}>
            <Footer />
          </Container>
        </ThemeProvider>
      </div>
    </Router>
  )
}

export default withAuthentication(App);