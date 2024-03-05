import React from 'react'
import * as HiIcons from 'react-icons/hi';
import s from './NavigationBar.module.scss'

const NavigationBar = () => {
  return (
    <div className={s.mainContainer}>
        <div className={s.topContainer}>
            <HiIcons.HiViewGrid className={s.containerItem}/>
            <HiIcons.HiOutlinePencilAlt className={s.containerItem}/>
        </div>
        <div className={s.bottomContainer}>
            <HiIcons.HiLogin className={s.containerItem}/>
        </div>
    </div>
  )
}

export default NavigationBar