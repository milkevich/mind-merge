import React, { useEffect, useState, memo } from 'react';
import s from './Feed.module.scss';
import { Avatar, Fade } from '@mui/material';
import * as HiIcons from 'react-icons/hi';
import { RiChat3Line } from "react-icons/ri";
import { collection, doc, increment, onSnapshot, updateDoc, where } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUserContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import memoizeOne from 'memoize-one';
import Slide from '@mui/material/Slide';


const Feed = ({ profileUser }) => {
    const [minds, setMinds] = useState([]);
    const [liked, setLiked] = useState({})
    const [doubleTapAnimationId, setDoubleTapAnimationId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMind, setSelectedMind] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};
        setLiked(likedPosts);
    }, []);

    console.log(user)

    useEffect(() => {
        const getMinds = async () => {
            if (!user || !user.uid) return;

            let mindsRef;
            if (profileUser && profileUser.uid === user.uid) {
                mindsRef = collection(db, "minds");
                mindsRef = query(mindsRef, where("author.uid", "==", user.uid));
            } else {
                mindsRef = collection(db, "minds");
            }

            const unsub = onSnapshot(mindsRef, (snapshot) => {
                const mindsData = snapshot.docs.map(doc => {
                    const mindData = { id: doc.id, ...doc.data() };
                    mindData.relativeTime = formatRelativeTime(mindData.date.toDate());

                    return mindData;
                });
                mindsData.sort((a, b) => b.date - a.date);
                setMinds(mindsData);
                setLoading(false);
            });

            return () => unsub();
        };

        getMinds();
    }, [user, profileUser]);

    const formatRelativeTime = memoizeOne((date) => {
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
    });

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

    const handleOpenComments = (mind) => {
        navigate(`/mind-merge/minds/mind/${mind.id}`);
    };

    const handleOpenShare = (mind) => {
        setIsPopupOpen(true);
        setSelectedMind(mind);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const formatActivity = (likes) => {
        if (likes >= 1000) {
            return (likes / 1000).toFixed(1) + 'k';
        } else {
            return likes.toString();
        }
    };

    const doubleLike = async (mindId) => {
        const isLiked = liked[mindId];
        if (!isLiked) {
            const updatedLikes = { ...liked };
            try {
                const postRef = doc(db, 'minds', mindId);
                const likesUpdate = increment(1);
                await updateDoc(postRef, {
                    likes: likesUpdate,
                });
                updatedLikes[mindId] = true;
                localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
                setLiked(updatedLikes);
                setDoubleTapAnimationId(mindId);
                setTimeout(() => {
                    setDoubleTapAnimationId(null);
                }, 1000);
            } catch (error) {
                console.error('Error updating liked status:', error);
            }
        } else {
            setDoubleTapAnimationId(mindId);
                setTimeout(() => {
                    setDoubleTapAnimationId(null);
                }, 1000);
        }
    };

    return (
        <div className={s.feedContainer}>
            {loading && <Loader />}
            {selectedMind && (
                <Fade in={isPopupOpen} onChange={handleClosePopup}>
                    <div className={s.sharePopUpContainer}>
                        <Slide direction="up" in={isPopupOpen} mountOnEnter unmountOnExit>
                            <div className={s.sharePopUp}>
                                <div style={{ borderBottom: "none" }} key={selectedMind.id} className={s.postContainer}>
                                    <Avatar onClick={() => navigate(`/mind-merge/${selectedMind.author.username}`)} style={{ cursor: "pointer" }} src={selectedMind.author.photoURL} className={s.postAvatar} />
                                    <div className={s.postContent}>
                                        <div style={{ cursor: "pointer" }} onClick={() => navigate(`/mind-merge/${selectedMind.author.username}`)}>
                                            <h5 className={s.postContentUser}>{selectedMind.author.firstName} {selectedMind.author.lastName}</h5>
                                            <p style={{ color: "var(--main-highlight-color)" }}>@{selectedMind.author.username}</p>
                                        </div>
                                        <p style={{ maxHeight: "40px", overflow: "hidden", marginLeft: "-60px", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "100%" }} className={s.postContentText}>{selectedMind.text}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className={s.shareLink} onClick={() => {
                                        handleClosePopup()
                                        navigator.clipboard.writeText(`${window.location.host}/mind-merge/minds/mind/${selectedMind.id}`);
                                        setSnackbarOpen(true)
                                        setSnackbarText('Copied to clipboard!')
                                    }}><HiIcons.HiOutlineLink style={{ marginBottom: "-3px", paddingRight: "15px", color: "var(--main-color)" }} />{window.location.host}/mind-merge/minds/mind/{selectedMind.id}</p>
                                </div>
                                <div className={s.goBackBtnContainer}>
                                    <button onClick={handleClosePopup}>Go Back</button>
                                </div>
                            </div>
                        </Slide>
                    </div>
                </Fade>
            )}
            {minds.map((mind, index) => (
                <div key={mind.id} className={s.postContainer}>
                    <Avatar onClick={() => navigate(`/mind-merge/${mind.author.username}`)} style={{ cursor: "pointer" }} src={mind.author.photoURL} className={s.postAvatar} />
                    <div style={{ zIndex: "90" }} className={s.postContent}>
                        <div onClick={() => navigate(`/mind-merge/${mind.author.username}`)} className={s.postContentUserInfo}>
                            <h5 className={s.postContentUser}>{mind.author.firstName} {mind.author.lastName}</h5>
                            <span className={s.postContentDate}>{mind.relativeTime}</span>
                        </div>
                        {mind?.img && (
                        <div className={s.mindImgContainer} onDoubleClick={() => doubleLike(mind.id)}>
                            <HiIcons.HiHeart style={{ scale: doubleTapAnimationId === mind.id ? "1" : "0"}} className={s.minImgLikeIcon}/>
                            <img className={s.mindImg} src={mind?.img} />
                        </div>
                    )}
                        <p style={{ whiteSpace: "pre-line" }} onClick={() => handleOpenComments(mind)} className={s.hoverFade}>{mind.text}</p>
                        <div className={s.postActivityContainer}>
                            {liked[mind.id] ? (
                                <HiIcons.HiHeart
                                    onClick={() => toggleLike(mind.id)}
                                    style={{ fontSize: "19px", color: 'var(--like-btn-color)', scale: "1.05" }}
                                    className={s.postActivityItem}
                                />
                            ) : (
                                <HiIcons.HiOutlineHeart
                                    onClick={() => toggleLike(mind.id)}
                                    style={{ fontSize: "19px" }}
                                    className={s.postActivityItem}
                                />
                            )}
                            <p className={s.postActivityLabel}>{formatActivity(mind.likes)}</p>
                            <RiChat3Line onClick={() => handleOpenComments(mind)} className={s.postActivityItem} />
                            <p className={s.postActivityLabel}>{formatActivity(mind.commentsCount)}</p>
                            <HiIcons.HiOutlineUpload
                                onClick={() => handleOpenShare(mind)}
                                style={{ fontSize: "19px", scale: "1.05" }}
                                className={s.postActivityItem}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default memo(Feed);
