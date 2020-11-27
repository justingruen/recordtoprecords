import React, { useState, useEffect } from 'react'
import { withFirebase } from '../Firebase'

import useTable from '../Pieces/usetable'
import ConfirmDialog from '../Pieces/confirmdialog'
import ItemForm from './itemform'
import Controls from '../Pieces/controls'
import { makeStyles, Hidden, Button as MuiButton, Paper, CircularProgress, Toolbar, TableBody, TableRow, TableCell, InputAdornment } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
import Notification from "../Pieces/notification"

import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import Popup from '../Pieces/popup'

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: '75%'
  },
  newButton: {
    position: 'absolute',
    right: '10px',
    marginBottom: '50px'
  }
}))

const INITIAL_STATE = {
  loading: true,
  items: [],
}

const headCells = [
  {id: 'itemname', label: 'Item Name'},
  {id: 'price', label: 'Price (USD)'},
  {id: 'genre', label: 'Genre'},
  {id: 'image', label: 'Image'},
  {id: 'actions', label: 'Actions', disableSorting: true},
]

function ItemListBase(props) {
  const [state, setState] = useState(INITIAL_STATE)
  const [filterFn, setFilterfn] = useState({fn: items => {return items}})
  const [openPopup, setOpenPopup] = useState(false)
  const [itemForEdit, setItemForEdit] = useState(null)
  const [notify, setNotify] = useState({isOpen: false, message: '', type: ''})
  const [firebase] = useState(props.firebase)
  const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subTitle: ''})
  const [createNew, setCreateNew] = useState(false)
  const classes = useStyles()
  const { TblContainer,  TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(state.items, headCells, filterFn)

  useEffect(() => {
    setState({ ...state, loading: true })

    firebase.items().on('value', snapshot => {
      const itemsObject = snapshot.val()

      if (itemsObject === null){
        setState({
          ...state,
          loading: false
        })
      } else {
        const itemsList = Object.keys(itemsObject).map(key => ({
          ...itemsObject[key],
          uid: key,
        }))
  
        setState({
          items: itemsList,
          loading: false,
        })
      }
    });

    return () => firebase.items().off()
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
          return items.filter(x => x.itemname.includes(target.value))
      }
    })
  }

  const openInPopup = item => {
    setItemForEdit(item)
    setOpenPopup(true)
  }

  const deleteRecord = (uid, image) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })

    firebase
    .item(uid)
    .remove()
    .then(() => {
      firebase.items()    //TODO: Does this even work?
        .orderByChild('image')
        .equalTo(image)
        .on("value", snapshot => {
          if (!snapshot.exists())
            firebase.prodimage(image).delete()
          })
    }).then(
      setNotify({
        isOpen: true,
        message: 'Deleted Successfully!',
        type: 'error'
      })
    )
  }

  return (
    <div>
      <h2>Items</h2>
        <Hidden mdUp>
          <p>Please use a larger screen to view table</p>
        </Hidden>
        <Hidden smDown>
          {state.loading && <CircularProgress />} {/* TODO: Center this? */}
          <Paper className={classes.pageContent}>
            <Toolbar>
              <Controls.Input
                className={classes.searchInput}
                label='Search Items'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search />
                    </InputAdornment>
                  )
                }}
                onChange={handleSearch}
              />
              <Controls.Button
                className={classes.newButton}
                color='primary'
                text='Add New'
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={() => {
                  setCreateNew(true)
                  openInPopup()
                }}
              />
            </Toolbar>
            <TblContainer>
              <TblHead />
              <TableBody>
                {recordsAfterPagingAndSorting().map(item =>
                  <TableRow key={item.uid}>
                    <TableCell>{item.itemname}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.genre}</TableCell>
                    <TableCell><a href={item.imageurl} target="_blank">Link</a></TableCell>
                    <TableCell>  {/* TODO: Buttons next to each other */}
                      <Controls.ActionButton
                        color='secondary'
                        onClick={() => {openInPopup(item)}}
                      >
                        <EditIcon fontSize='small' />
                      </Controls.ActionButton>
                      <Controls.ActionButton
                          color='primary'
                          onClick={() => 
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Are you sure you want to delete this record?',
                              subTitle: "You can't undo this operation.",
                              onConfirm: () => {deleteRecord(item.uid, item.image)}
                            })
                          }
                        >
                          <CloseIcon fontSize='small' />
                        </Controls.ActionButton>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TblContainer>
            <TblPagination />
          </Paper>
          <Popup
            title='Edit Item'
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            closePopup={() => setOpenPopup(false)}
          >
            <ItemForm 
              itemForEdit={itemForEdit}
              setOpenPopup={setOpenPopup}
              setNotify={setNotify}
              createNew={createNew}
              setCreateNew={setCreateNew}
              itemsList={state.items}
            />
          </Popup>
          <Notification 
            notify={notify}
            setNotify={setNotify}
          />
          <ConfirmDialog 
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        </Hidden>
    </div>
  );
}

const ItemList = withFirebase(ItemListBase)

export default ItemList