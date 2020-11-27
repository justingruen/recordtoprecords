import React from 'react'
import { Button as MuiButton, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0.5)
  },
  label: {
    textTransform: 'none'
  }
}))

export default function Button(props) {

  const { text, size, borderRadius, color, variant, onClick, ...other} = props
  const classes = useStyles()

  return (
    <div>
      <MuiButton
        classes={{root: classes.root, label: classes.label}}
        variant={variant || 'outlined'}
        size={size || 'large'}
        style={{borderRadius: borderRadius}}
        color={color}
        onClick={onClick}
        {...other}
      >
        {text}
      </MuiButton>
    </div>
  )
}
