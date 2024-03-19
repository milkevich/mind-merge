import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {

    const navigate = useNavigate()

    const goBack = () => {
        navigate('/mind-merge/minds')
    }  

  return (
    <div >
        <h1>Oops! We've wandered off the trail!</h1>
        <p>Seems like the path you're seeking doesn't exist. Let's find our way back together!</p>
        <button onClick={goBack}>Go Back</button>
    </div>
  )
}

export default NotFound
