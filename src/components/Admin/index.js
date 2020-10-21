import React, { Component } from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

import Items from './items'
import ItemsAdd from './itemsadd'

function AdminPage() {
  const history = useHistory();

  return (
    <div>
    <h1>Admin</h1>
    <p>The Admin Page is accessible by every signed in admin user.</p>

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
      <Route exact path={ROUTES.ADMIN_USERDETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADMIN_ITEMS} component={ItemList} />
    </Switch>
  </div>
  )
}

class UserListBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      users: [],
    }
  }

  componentDidMount() {
    this.setState({ loading: true })

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val()

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }))

      this.setState({
        users: usersList,
        loading: false,
      })
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h2>Users</h2>
        {loading && <div>Loading ...</div>}
        <ul>
          {users.map(user => (
            <li key={user.uid}>
              <span>
                <strong>ID:</strong> {user.uid}
              </span>
              <span>
                <strong>E-Mail:</strong> {user.email}
              </span>
              <span>
                <strong>Username:</strong> {user.username}
              </span>
              <br />
              <span>
                <Link
                  to={{
                    pathname: `${ROUTES.ADMIN}/users/${user.uid}`,
                    state: { user },
                  }}
                >
                  Details
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

class UserItemBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
    }
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          loading: false,
        })
      })
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  }

  render() {
    const { user, loading } = this.state;

    return (
      <div>
        <h2>User ({this.props.match.params.id})</h2>
        {loading && <div>Loading ...</div>}

        {user && (
          <div>
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>Username:</strong> {user.username}
            </span>
            <br />
            <span>
              <button
                type="button"
                onClick={this.onSendPasswordResetEmail}
              >
                Send Password Reset
              </button>
            </span>
          </div>
        )}
      </div>
    );
  }
}

class ItemListBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      items: []
    }
  }

  render() {

    return(
      <div>
        <button type='button' onClick={() => {
          this.props.history.push(ROUTES.ADMIN_ITEMSADD)
        }}>
          Add an Item
        </button>

        <br />

        <Route exact path={ROUTES.ADMIN_ITEMSADD} component={ItemsAdd} />
        {/* <Route exact path={ROUTES.ADMIN_ITEMS} component={Items} /> */}
        {/* <Switch>
          <Route exact path={ROUTES.ADMIN_ITEMSADD} component={ItemsAdd} />
          <Route exact path={ROUTES.ADMIN_ITEMS} component={Items} />
        </Switch> */}
      </div>
    )
  }
}

//^^ create an item (should it auto add an id and go to the /admin/additem/:id?
// if so, in component(will? did?)mount set up the id and then add it to the db
// on comcponentunmount, if nothing has been submitted delete the id


const UserList = withFirebase(UserListBase)
const UserItem = withFirebase(UserItemBase)
const ItemList = withFirebase(ItemListBase)

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AdminPage)