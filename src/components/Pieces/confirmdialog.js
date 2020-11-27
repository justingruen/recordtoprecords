import React from 'react'
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography, makeStyles } from '@material-ui/core'
import Controls from './controls'
import { NotListedLocation } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  dialog: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5),
  },
  dialogTitle: {
    textAlign: 'center'
  },
  dialogContent: {
    textAlign: 'center'
  },
  dialogActions: {
    justifyContent: 'center'
  },
  titleIcon: {
    backgroundColor: '#ffd0cc',
    color: '#ff4081',
    '&:hover': {
      backgroundColor: '#ffd0cc',
      cursor: 'default'
    },
    '& .MuiSvgIcon-root': {
      fontSize: '8rem',
    }
  },
}))

export default function ConfirmDialog(props) {

  const { confirmDialog, setConfirmDialog } = props
  const classes = useStyles()

  return (
    <Dialog classes={{paper: classes.dialog}} open={confirmDialog.isOpen}>
      <DialogTitle className={classes.dialogTitle}>
        <IconButton disableRipple className={classes.titleIcon}>
          <NotListedLocation />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant='h6'>
          {confirmDialog.title}
        </Typography>
        <Typography variant='subtitle2'>
          {confirmDialog.subtitle}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Controls.Button
          text='No'
          color='default'
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false})}
        />
        <Controls.Button
          text='Yes'
          color='secondary'
          onClick={confirmDialog.onConfirm}
        />
      </DialogActions>
    </Dialog>
  )
}