import React from 'react'
import s from './Feed.module.scss'
import { Avatar } from '@mui/material'
import * as HiIcons from 'react-icons/hi';
import { RiChat3Line } from "react-icons/ri";

const Feed = () => {
    return (
        <div className={s.feedContainer}>
            <div className={s.postContainer}>
                <Avatar className={s.postAvatar} />
                <div className={s.postContent}>
                    <h5 className={s.postContentUser}>user name</h5>
                    <p className={s.postContentText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, saepe sed. Neque nihil magni modi. Aperiam quibusdam culpa a consectetur architecto in neque adipisci exercitationem maxime repudiandae, possimus recusandae animi!</p>
                    <div className={s.postActivityContainer}>
                        <HiIcons.HiOutlineHeart style={{fontSize: "19px"}} className={s.postActivityItem} />
                        <p className={s.postActivityLabel}>2,1k</p>
                        <RiChat3Line className={s.postActivityItem} />
                        <p className={s.postActivityLabel}>1,3k</p>
                    </div>
                </div>
            </div>
            <div className={s.postContainer}>
                <Avatar className={s.postAvatar} />
                <div className={s.postContent}>
                    <h5 className={s.postContentUser}>user name</h5>
                    <p className={s.postContentText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, saepe sed. Neque nihil magni modi. Aperiam quibusdam culpa a consectetur architecto in neque adipisci exercitationem maxime repudiandae, possimus recusandae animi!</p>
                    <div className={s.postActivityContainer}>
                        <HiIcons.HiOutlineHeart style={{fontSize: "19px"}} className={s.postActivityItem} />
                        <p className={s.postActivityLabel}>2,1k</p>
                        <RiChat3Line className={s.postActivityItem} />
                        <p className={s.postActivityLabel}>1,3k</p>
                    </div>
                </div>
            </div>
            <div className={s.postContainer}>
                <Avatar className={s.postAvatar} />
                <div className={s.postContent}>
                    <h5 className={s.postContentUser}>user name</h5>
                    <p className={s.postContentText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, saepe sed. Neque nihil magni modi. Aperiam quibusdam culpa a consectetur architecto in neque adipisci exercitationem maxime repudiandae, possimus recusandae animi!</p>
                    <div className={s.postActivityContainer}>
                        <HiIcons.HiOutlineHeart style={{fontSize: "19px"}} className={s.postActivityItem} />
                        <p className={s.postActivityLabel}>2,1k</p>
                        <RiChat3Line className={s.postActivityItem} />
                        <p className={s.postActivityLabel}>1,3k</p>
                    </div>
                </div>
            </div>
            <div className={s.postContainer}>
                <Avatar className={s.postAvatar} />
                <div className={s.postContent}>
                    <h5 className={s.postContentUser}>user name</h5>
                    <p className={s.postContentText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, saepe sed. Neque nihil magni modi. Aperiam quibusdam culpa a consectetur architecto in neque adipisci exercitationem maxime repudiandae, possimus recusandae animi!</p>
                    <div className={s.postActivityContainer}>
                        <HiIcons.HiOutlineHeart style={{fontSize: "19px"}} className={s.postActivityItem} />
                        <p className={s.postActivityLabel}>2,1k</p>
                        <RiChat3Line className={s.postActivityItem} />
                        <p className={s.postActivityLabel}>1,3k</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feed