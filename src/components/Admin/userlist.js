import React, { useState, useEffect } from 'react'
import { withFirebase } from '../Firebase'

import useTable from '../Pieces/usetable'
import UserForm from './userform'
import Controls from '../Pieces/controls'
import { makeStyles, Hidden, Paper, CircularProgress, Toolbar, TableBody, TableRow, TableCell, InputAdornment } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
import Notification from "../Pieces/notification";

import EditIcon from '@material-ui/icons/Edit';
import Popup from '../Pieces/popup'

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  },
  searchInput: {
    width: '75%'
  }
}))

const INITIAL_STATE = {
  loading: true,
  users: [],
}

const headCells = [
  {id: 'username', label: 'Full Name'},
  {id: 'email', label: 'Email'},
  {id: 'isAdmin', label: 'Administrator'},  // TODO: Sorting doesn't work
  {id: 'actions', label: 'Actions', disableSorting: true}
]

function UserListBase(props) {
  const [state, setState] = useState(INITIAL_STATE)
  const [filterFn, setFilterfn] = useState({fn: items => {return items}})
  const [openPopup, setOpenPopup] = useState(false)
  const [userForEdit, setUserForEdit] = useState(null)
  const [notify, setNotify] = useState({isOpen: false, message: '', type: ''})
  const [firebase] = useState(props.firebase)
  const classes = useStyles()
  const { TblContainer,  TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(state.users, headCells, filterFn)

  useEffect(() => {
    setState({ ...state, loading: true })

    firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val()

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }))

      setState({
        users: usersList,
        loading: false,
      })
    });

    return () => firebase.users().off()
  }, [])

  // useEffect(() => {
  //   console.log(state)
  // }, [state])

  const handleSearch = e => {
    let target = e.target
    setFilterfn({
      fn: items => {
        if(target.value == '')
          return items
        else
          return items.filter(x => x.username.includes(target.value))
      }
    })
  }

  const openInPopup = user => {
    setUserForEdit(user)
    setOpenPopup(true)
  }

  return (
    <div>
      <h2>Users</h2>
      <Hidden mdUp>
          <p>Please use a larger screen to view table</p>
      </Hidden>
      <Hidden smDown>
        {state.loading && <CircularProgress />} {/* TODO: Center this? */}
        <Paper className={classes.pageContent}>
          <Toolbar>
            <Controls.Input
              className={classes.searchInput}
              label='Search Users'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                )
              }}
              onChange={handleSearch}
            />
          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPagingAndSorting().map(user =>
                <TableRow key={user.uid}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user?.roles?.ADMIN || ''}</TableCell>
                  <TableCell>  {/* TODO: Buttons next to each other */}
                    <Controls.ActionButton
                      color='secondary'
                      onClick={() => {openInPopup(user)}}
                    >
                      <EditIcon fontSize='small' />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Paper>
        <Popup
          title='Edit User'
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          closePopup={() => setOpenPopup(false)}
        >
          <UserForm 
            userForEdit={userForEdit}
            setOpenPopup={setOpenPopup}
            setNotify={setNotify}
          />
        </Popup>
        <Notification 
          notify={notify}
          setNotify={setNotify}
        />
      </Hidden>
    </div>
  );
}

const UserList = withFirebase(UserListBase)

export default UserList