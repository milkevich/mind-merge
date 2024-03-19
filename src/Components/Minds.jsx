import React from 'react'
import NavigationBar from './NavigationBar'
import Feed from './Feed'
import MindShareInput from './MindShareInput'
import s from './Minds.module.scss'

const Minds = () => {
  return (
    <div className={s.mindsMainContainer}>
            <NavigationBar/>
      <div className={s.mindsContainer}>
      <MindShareInput/>
        <Feed/>
      </div>
    </div>
  )
}

export default Minds