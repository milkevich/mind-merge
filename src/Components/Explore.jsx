import React, { useEffect, useState } from 'react'
import s from './Explore.module.scss'
import NavigationBar from './NavigationBar'
import { Avatar } from '@mui/material'
import { HiOutlineSearch } from "react-icons/hi";
import { useUserContext } from '../Contexts/UserContext';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';


const Explore = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState([])
    const [users, setUsers] = useState([])
    const { user } = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        const getUserData = () => {
            const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
                setUserData(doc.data());
            });
            return () => {
                unsub();
            };
        };

        if (user && user.uid) {
            getUserData();
        }
    }, [user]);

    useEffect(() => {
        const getUsers = async () => {
            const q = query(
                collection(db, "users"),
                where("username", ">=", username.trim()),
                where("username", "<=", username.trim() + '\uf8ff')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersData);
            });

            return unsubscribe;
        };

        if (username.trim() !== '') {
            getUsers();
        } else {
            setUsers([]);
        }
    }, [username]);

    console.log(users)

    const handleSearch = async (e) => {
        setUsername(e.target.value)
    };

    const goToProfile = (user) => {
        navigate(`/mind-merge/${user.username}`)
        window.location.reload()
    }

    return (
        <div className={s.exploreContainer}>
            <div>
                <div className={s.searchHeader}>
                    <Avatar src={userData.photoURL} />
                    <input value={username} onChange={handleSearch} placeholder='Search' className={s.searchInput} type="text" />
                    <HiOutlineSearch className={s.searchIcon} />
                </div>
                <div className={s.searchResult} >
                    {users && (users)?.map((user, index) => (
                        <div onClick={() => goToProfile(user)} key={user} className={s.userContainer}>
                            <Avatar src={user.photoURL} />
                            <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px", }}>
                                <h5 style={{ margin: "3px" }}>{user.firstName} {user.lastName}</h5>
                                <p style={{ margin: "3px" }}>@{user.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Explore