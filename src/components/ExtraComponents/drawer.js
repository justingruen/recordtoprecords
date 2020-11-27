import React from 'react'

import {Drawer as MuiDrawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {

  },
  drawer: {

  },
}))

function Drawer(props) {
  const classes = useStyles()
  const tabsList = [{text: 'Catalog'}, {text: 'About Us'}, {text: 'Account'}]
  return (
    <MuiDrawer variant='permanent'>
      <List>
        {tabsList.map((item, index) => (
          <ListItem button key={item.text}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </MuiDrawer>
  )
}

export default Drawer