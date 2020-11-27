import React from 'react'
import { Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 0,
    margin: theme.spacing(0.5)
  },
  primary: {
    backgroundColor: '#ffd0cc',
    '& .MuiButton-label': {
      color: '#ff4081'
    }
  },
  secondary: {
    backgroundColor: '#a9cbff',
    '& .MuiButton-label': {
      color: '#3f51b5'
    }
  },
}))

export default function ActionButton(props) {

  const {color, children, onClick } = props;
  const classes = useStyles()

  return (
    <div>
      <Button
        className={`${classes.root} ${classes[color]}`}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  )
}
