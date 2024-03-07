import React from 'react'
import { useUserContext } from './Contexts/UserContext'
import { Navigate, Outlet } from 'react-router-dom'
import Loader from './Components/Loader';

const Protected = () => {
  const { user, isInitialized } = useUserContext();

  if (!isInitialized) {
      return <Loader />;
  }

  return user ? <Outlet /> : <Navigate to={'log-in'} />;
}

export default Protected