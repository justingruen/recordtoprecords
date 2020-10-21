import React, { Component } from 'react';
import { compose } from 'recompose'

import { withAuthorization, withEmailVerification } from '../Session'
import { withFirebase } from '../Firebase'

const HomePage = () => (
  <div>
    <h1>Home</h1>
    <p>The Home Page is accessible by every signed in user.</p>

    <Items />
  </div>
);

class ItemsBase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      items: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true })

    this.props.firebase.items().on('value', snapshot => {
      // convert items list from snapshot

      this.setState({ loading: false })
    });
  }

  componentWillUnmount() {
    this.props.firebase.items().off()
  }

  render() {
    const { items, loading } = this.state;

    return (
      <div>
        {loading && <div>Loading...</div>}

        <ItemList items={items} />
      </div>
    );
  }
}

const ItemList = ({ items }) => (
  <ul>
    {items.map(item => (
      <ItemItem key={item.uid} item={item} />
    ))}
  </ul>
)

const ItemItem = ({ item }) => (
  <li>
    <strong>{item.userId}</strong> 
    {item.text}
  </li>
)

const Items = withFirebase(ItemsBase)

const condition = authUser => !!authUser
// const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN]
 
// without email verification
// export default withAuthorization(condition)(HomePage)

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage)