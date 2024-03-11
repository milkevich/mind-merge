import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import s from './Profile.module.scss'
import { useUserContext } from '../Contexts/UserContext';
import Loader from './Loader';
import MindShareInput from './MindShareInput';
import NavigationBar from './NavigationBar';
import Feed from './Feed';

const Profile = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true)
    const { user } = useUserContext()
    console.log(userData)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersCollectionRef = collection(db, 'users');
                const usersQuery = query(usersCollectionRef, where("username", "==", username));
                const querySnapshot = await getDocs(usersQuery);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    setUserData(userDoc.data());
                    setLoading(false)
                } else {
                    console.log('User data not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username]);

    console.log(userData)


    return (
        <>
            {!loading ? (

                <div className={s.profileContainer}>
                    <NavigationBar/>
                    <Header />
                    {userData.uid === user.uid ? (<MindShareInput />) : null}
                    <Feed profileUser={userData} />
                </div>

            ) : <Loader />}
        </>
    );
};

export default Profile;
