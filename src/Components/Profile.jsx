import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import s from './Profile.module.scss'
import { useUserContext } from '../Contexts/UserContext';
import MindShareInput from './MindShareInput';
import NavigationBar from './NavigationBar';
import Feed from './Feed';

const Profile = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [noUser, setNoUser] = useState(false)
    const { user } = useUserContext()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersCollectionRef = collection(db, 'users');
                const usersQuery = query(usersCollectionRef, where("username", "==", username));
                const querySnapshot = await getDocs(usersQuery);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    setUserData(userDoc.data());
                    console.log(userData)
                } else {
                    console.log('User data not found');
                    setNoUser(true)
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setNoUser(true)
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username]);

    const navigate = useNavigate()

    const goBack = () => {
        navigate('/mind-merge/minds')
    }

    return (
        <>
            {noUser &&
                <div className={s.noUserContainer}>
                    <div className={s.noUserContent}>
                    <h1>We couldn't find anything :(</h1>
                    <p>Let's get you back!</p>
                    <button onClick={goBack}>Go Back</button>
                    </div>
                </div>
            }
            {!noUser && userData &&
                <div className={s.profileContainer}>
                    <NavigationBar />
                    <div className={s.profileContainerMargin}>
                    <Header />
                    {userData.uid === user.uid && (<MindShareInput />)} 
                    <Feed profileUser={userData} />
                    </div>
                </div>
            }
        </>
    );
};

export default Profile;
