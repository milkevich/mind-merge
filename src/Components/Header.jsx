import React, { useEffect, useState } from 'react'
import s from './Header.module.scss'
import { Avatar } from '@mui/material'
import * as HiIcons from 'react-icons/hi';
import { useUserContext } from '../Contexts/UserContext'
import { Timestamp, arrayUnion, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Loader from './Loader';
import { v4 as uuid } from 'uuid';

const Header = () => {
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(true)
    const [mind, setMind] = useState('')
    const [minds, setMinds] = useState([])
    const { user } = useUserContext();


    useEffect(() => {
        const getUserData = () => {
          const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            setUserData(doc.data());
            setLoading(false)
          });
          return () => {
            unsub();
          };
        };
    
        if (user && user.uid) {
          getUserData();
        }
      }, [user]);

      

      const share = async (e) => {
        e.preventDefault()
        
        const mindId = uuid();

        const mindRef = doc(db, 'minds', mindId);
    
        try {
            await setDoc(mindRef, {
                author: {
                    uid: user.uid,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    photoURL: userData.photoURL
                },
                text: mind,
                likes: 0,
                comments: { 
                    count: 0,
                },
                date: Timestamp.now(),
            }); 
            setMind('')
            console.log('Mind shared successfully');
        } catch (error) {
            console.error('Error sharing mind:', error);
        }
    };

    
    const backgroundImage = userData.photoURL

    return (
        <>
        {loading && <Loader/>}
        <div className={s.mainContainer}>
            <div className={s.avatarContainer}>
                <div style={{ overflow: "hidden", height: "100px" }}>
                    <div style={{ background: `url(${backgroundImage})`, backgroundRepeat: "no-repeat" }} className={s.backdropImg}></div>
                </div>
                <Avatar src={userData.photoURL} style={{ width: "80px", height: "80px" }} className={s.profileImg} />
            </div>
            <div className={s.headerButtons}>
                <p>smth</p>
                <p>smthsmth</p>
                <p>smthsm</p>
            </div>
            <div className={s.userInfoContainer}>
                <h1>{userData.firstName} {userData.lastName}</h1>
                <p>@{userData.username}</p>
            </div>
            <div className={s.inputContainer}>
                <Avatar src={userData.photoURL} />
                <input value={mind} onChange={(e) => setMind(e.target.value)} type="text" placeholder="What's up?" />
                <HiIcons.HiOutlinePaperClip className={s.uploadIcon} />
                <button onClick={share}>Share</button>
            </div>
        </div>
        </>
    )
}

export default Header