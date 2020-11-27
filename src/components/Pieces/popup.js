import React from 'react'
import { Dialog, DialogTitle, DialogContent, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  
}))

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup, closePopup, setClosePopup } = props
  const classes = useStyles()

  return (
    // TODO: Center everything
    <Dialog open={openPopup} onClose={closePopup} maxwidth='md' classes={{ root: classes.root }}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        { children }
      </DialogContent>
    </Dialog>
  )
}