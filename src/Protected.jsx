import React from 'react'
import { useUserContext } from './Contexts/UserContext'
import { Navigate, Outlet } from 'react-router-dom'

const Protected = () => {

    const {user} = useUserContext()
    console.log(user)

  return (
       user ? <Outlet/> : alert('You have to be logged in to get access to the chat') || <Navigate to={'log-in'}/> 
  )
}

export default Protected