import React, { useEffect, useState } from 'react';
import s from './Feed.module.scss';
import { Avatar } from '@mui/material';
import * as HiIcons from 'react-icons/hi';
import { RiChat3Line } from "react-icons/ri";
import { collection, doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUserContext } from '../Contexts/UserContext';
import { ref } from 'firebase/storage';

const Feed = () => {
    const [minds, setMinds] = useState([]);
    const [liked, setLiked] = useState({})
    const { user } = useUserContext();

    useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts'));
    setLiked(likedPosts || {});
  }, []);

    useEffect(() => {
        const getMinds = () => {
            const mindsRef = collection(db, "minds");
            const unsub = onSnapshot(mindsRef, (snapshot) => {
                const mindsData = [];
                snapshot.forEach((doc) => {
                    const mindData = { id: doc.id, ...doc.data() };
                    mindData.relativeTime = formatRelativeTime(mindData.date.toDate());
                    mindsData.push(mindData);
                });

                mindsData.sort((a, b) => b.date - a.date);
                
                setMinds(mindsData);
            });
            return () => {
                unsub();
            };
        };

        if (user && user.uid) {
            getMinds();
        }
    }, [user]);

    const formatRelativeTime = (date) => {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const years = Math.floor(days / 365);
    
        if (years > 0) {
            return `${years}y`;
        } else if (days > 0) {
            return `${days}d`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else if (seconds > 0) {
            return `${seconds}s`;
        } else {
            return "now";
        }
    };

    const toggleLike = async (mindId) => {
        const isLiked = liked[mindId];
        const updatedLikes = { ...liked };
    
        try {
            const postRef = doc(db, 'minds', mindId);
            const likesUpdate = isLiked ? increment(-1) : increment(1);
    
            await updateDoc(postRef, {
                likes: likesUpdate,
            });
    
            updatedLikes[mindId] = !isLiked;
        } catch (error) {
            console.error('Error updating liked status:', error);
        }
    
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
        setLiked(updatedLikes);
    };

    return (
        <div className={s.feedContainer}>
            {minds.map((mind, index) => (
                <div key={mind.id} className={s.postContainer}>
                    <Avatar src={mind.author.photoURL} className={s.postAvatar} />
                    <div className={s.postContent}>
                        <div style={{display: "flex", alignItems: "end"}}>
                            <h5 className={s.postContentUser}>{mind.author.firstName} {mind.author.lastName}</h5>
                            <span className={s.postContentDate}>{mind.relativeTime}</span>
                        </div>
                        <p className={s.postContentText}>{mind.text}</p>
                        <div className={s.postActivityContainer}>
                            {liked[mind.id] ? <HiIcons.HiHeart onClick={() => toggleLike(mind.id)} style={{ fontSize: "19px", color: '#FD1D1D', scale: "1.05"}} className={s.postActivityItem} /> : <HiIcons.HiOutlineHeart onClick={() => toggleLike(mind.id)} style={{ fontSize: "19px"}} className={s.postActivityItem} />}
                            <p className={s.postActivityLabel}>{mind.likes}</p>
                            <RiChat3Line className={s.postActivityItem} />
                            <p className={s.postActivityLabel}>{mind.comments.count}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Feed;
