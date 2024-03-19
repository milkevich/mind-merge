import React, { useEffect, useState } from 'react';
import s from './Header.module.scss';
import { Avatar, Fade, Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import * as HiIcons from 'react-icons/hi';
import Skeleton from '@mui/joy/Skeleton';


const Header = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSticky, setIsSticky] = useState(false);
    let backgroundImage = ''; 

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setIsSticky(offset > 145);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersCollectionRef = collection(db, 'users');
                const usersQuery = query(usersCollectionRef, where('username', '==', username));
                const querySnapshot = await getDocs(usersQuery);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    setUserData(userDoc.data());
                } else {
                    console.log('User data not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username]);

    if (!loading && userData) {
        backgroundImage = userData?.photoURL;
        console.log('Background Image:', backgroundImage);
    }

    return (
        <div className={!isSticky ? `${s.mainContainer}` : `${s.sticky}`}>
            <div className={s.avatarContainer}>
                <Skeleton sx={{ overflow: "hidden", height: "100px" }} loading={loading} variant='overlay'>
                    <div style={{ overflow: "hidden", height: "100px" }}>
                        <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: "no-repeat" }} className={s.backdropImg}></div>
                    </div>
                </Skeleton>
                <Skeleton loading={loading} sx={{ position: "absolute", border: "5px solid var(--main-bg-color)", top: "60px", left: "20px", zIndex: "100" }} animation="wave" variant="circular" width={80} height={80}>
                    <Avatar src={userData?.photoURL} style={{ width: "80px", height: "80px", opacity: isSticky ? 0 : 1 }} className={s.profileImg} />
                </Skeleton>
            </div>
            <div className={s.userInfoContainer}>
                <div>
                    <Skeleton sx={{marginLeft: "20px"}} width={200} height={10} loading={loading} variant='text'>
                        <h1 className={s.userInfoName}>{userData?.firstName} {userData?.lastName}</h1>
                    </Skeleton>
                    <Skeleton sx={{marginLeft: "20px"}} width={100} height={10} loading={loading} variant='text'>
                        <div onClick={() => {
                            navigator.clipboard.writeText(`${userData?.username}`)
                        }} style={{ display: "flex", alignItems: "center", marginTop: "-5px" }}>
                            <Tooltip title='Copy' placement='right-end'>
                                <p style={{marginTop: "-10px"}} className={s.userInfoUsername}>@{userData?.username}</p>
                            </Tooltip>
                        </div>
                    </Skeleton>
                </div>
                <Fade timeout={1000} in={isSticky}>
                    <div>
                        <Skeleton loading={loading} width={30} variant='circular'>
                            <Avatar style={{ display: isSticky ? 'flex' : 'none' }} className={s.stickyAvatar} src={userData?.photoURL} />
                        </Skeleton>
                    </div>
                </Fade>
            </div>
        </div>
    );
}

export default Header;
