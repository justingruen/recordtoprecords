import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

import UserList from './userlist'
import ItemList from './itemslist'

import { makeStyles } from '@material-ui/core';

//TODO: Set this page
const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  }
}))

function AdminPage(props) {
  const history = useHistory();

  useEffect(() => {
    props.setCurrentPage('admin')
  }, [])

  return (
    <div style={{paddingTop: '30px'}}>
      <button type='button' onClick={() => {
        history.push(ROUTES.ADMIN_USERS)
      }}>
        User Details
      </button>

      <button type='button' onClick={() => {
        history.push(ROUTES.ADMIN_ITEMS)
      }}>
        Item Details
      </button>

      <br />
      ______________________________________________________________

      <Switch>
        <Route exact path={ROUTES.ADMIN_USERS} component={UserList} />
        <Route exact path={ROUTES.ADMIN_ITEMS} component={ItemList} />
      </Switch>
    </div>
  )
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AdminPage)