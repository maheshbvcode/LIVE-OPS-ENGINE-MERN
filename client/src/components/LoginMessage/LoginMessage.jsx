import React from 'react'

const LoginMessage = ({message}) => {
  return (
    <div className='message'>
      <h1 className='red'>{message}</h1>
    </div>
  )
}

export default LoginMessage
