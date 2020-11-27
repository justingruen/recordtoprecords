import React, { useState } from 'react'

export default function useForm(initialFState, validateOnChange=false, validate) {
  const [state, setState] = useState(initialFState)
  const [errors, setErrors] = useState({})

  const handleInputChange = e => {
    const { name, value } = e.target
    setState({
      ...state,
      [name]: value
    })
    if(validateOnChange)
      validate({[name]: value})
  }

  const resetForm = () => {
    setState(initialFState)
    setErrors({})
  }

  return {
    state, setState, errors, setErrors, handleInputChange, resetForm
  }
}

export function Form(props) {

  const { children, ...other } = props

  return (
    <form autoComplete='off' {...other}>
      {children}
    </form>
  )
}