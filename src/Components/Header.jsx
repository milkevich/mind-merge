import React from 'react'
import s from './Header.module.scss'
import { Avatar } from '@mui/material'
import * as HiIcons from 'react-icons/hi';

const Header = () => {
  return (
    <div className={s.mainContainer}>
        <div className={s.backdropImg}>
            <Avatar style={{width: "80px", height: "80px"}} className={s.profileImg}/>
        </div>
        <div className={s.headerButtons}>
            <p>smth</p>
            <p>smthsmth</p>
            <p>smthsm</p>
        </div>
        <div className={s.userInfoContainer}>
            <h1>name lastname</h1>
            <p>@username</p>
        </div>
        <div className={s.inputContainer}>
            <Avatar/>
            <input type="text" placeholder="What's up?" />
            <HiIcons.HiOutlinePaperClip className={s.uploadIcon}/>
            <button>Share</button>
        </div>
    </div>
  )
}

export default Header