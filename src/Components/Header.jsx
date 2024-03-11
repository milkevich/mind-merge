import React, { useEffect, useState } from 'react';
import s from './Header.module.scss';
import { Avatar, Tooltip } from '@mui/material';
import Loader from './Loader';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Header = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSticky, setIsSticky] = useState(false)

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

    if (loading) {
        return <Loader />;
    }

    const backgroundImage = userData.photoURL;
    console.log('Background Image:', backgroundImage);


    return (
        <div className={!isSticky ? `${s.mainContainer}` : `${s.sticky}`}>
            <div className={s.avatarContainer}>
                <div style={{ overflow: "hidden", height: "100px" }}>
                    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: "no-repeat" }} className={s.backdropImg}></div>
                </div>
                <Avatar src={userData.photoURL} style={{ width: "80px", height: "80px" }} className={s.profileImg} />
            </div>
            <div className={s.headerButtons}>
                <p>smth</p>
                <p>smthsmth</p>
                <p>smthsm</p>
            </div>
            <div className={s.userInfoContainer}>
                <div>
                    <h1>{userData?.firstName} {userData?.lastName}</h1>
                    <div onClick={() => {
                        navigator.clipboard.writeText(`${userData.username}`)
                    }} style={{ display: "flex", alignItems: "center", marginTop: "-10px" }}>
                        <Tooltip title='Copy' placement='right'>
                            <p>@{userData?.username}</p>
                        </Tooltip>
                    </div>
                </div>
                <Avatar style={{ display: isSticky ? 'flex' : 'none' }} className={s.stickyAvatar} src={userData?.photoURL} />
            </div>

        </div>
    );
}

export default Header;
