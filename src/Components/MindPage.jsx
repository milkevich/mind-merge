import React, { useEffect, useState } from "react";
import { useUserContext } from "../Contexts/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Fade, Slide } from "@mui/material";
import { Timestamp, collection, doc, getDoc, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Loader from "./Loader";
import { v4 as uuid } from 'uuid';
import s from './Feed.module.scss'
import { RiChat3Line } from "react-icons/ri";
import * as HiIcons from 'react-icons/hi';


const MindPage = () => {
    const [mind, setMind] = useState(null);
    const [userData, setUserData] = useState([])
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState({});
    const [selectedMind, setSelectedMind] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const navigate = useNavigate();
    const { user } = useUserContext();
    const { mindId } = useParams();

    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};
        setLiked(likedPosts);
    }, []);

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

    useEffect(() => {
        const getComments = async () => {
            const mindDocRef = doc(db, "minds", mindId);
            const commentsRef = collection(mindDocRef, 'comments');

            const unsubscribe = onSnapshot(commentsRef, (querySnapshot) => {
                const commentsData = [];
                querySnapshot.forEach((doc) => {
                    const commentData = { id: doc.id, ...doc.data() };

                    if (commentData.date) {
                        commentData.relativeTime = formatRelativeTime(commentData.date.toDate());
                        commentsData.push(commentData);
                    }
                });

                commentsData.sort((a, b) => b.date - a.date);

                setComments(commentsData);
            });

            return unsubscribe;
        };

        if (user && user.uid) {
            const unsubscribeComments = getComments();
            return () => unsubscribeComments;
        }
    }, [user, mindId]);

    useEffect(() => {
        const fetchMindData = async () => {
            if (!user || !user.uid) return;

            try {
                const mindDocRef = doc(db, "minds", mindId);
                const mindDocSnapshot = await getDoc(mindDocRef);

                if (mindDocSnapshot.exists()) {
                    const mindData = mindDocSnapshot.data();
                    const mindWithRelativeTime = {
                        ...mindData,
                        relativeTime: formatRelativeTime(mindData.date.toDate())
                    };
                    setMind(mindWithRelativeTime);
                } else {
                    console.log("Mind not found");
                }
            } catch (error) {
                console.error("Error fetching mind data:", error);
            }
        };

        fetchMindData();
    }, [user, mindId]);


    if (!mind) {
        return <Loader />;
    }

    console.log(user)

    const handleAddComment = async () => {
        if (commentContent.trim() !== '') {
            try {
                const mindDocRef = doc(db, 'minds', mindId);
                const commentsRef = collection(mindDocRef, 'comments');
                const commentId = uuid();

                await setDoc(doc(commentsRef, commentId), {
                    author: {
                        uid: user.uid,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        photoURL: user.photoURL
                    },
                    content: commentContent,
                    date: Timestamp.now(),
                });

                console.log("Comment added successfully");
                setCommentContent('');
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    const goBack = () => {
        navigate('/mind-merge/minds')
    }

    const toggleLike = async (mindId) => {
        const isLiked = liked[mindId];
        const updatedLikes = { ...liked };

        try {
            const postRef = doc(db, 'minds', mindId);
            const likesUpdate = isLiked ? increment(-1) : increment(1);

            await updateDoc(postRef, {
                likes: likesUpdate,
            });

            const updatedMind = { ...mind };
            updatedMind.likes += isLiked ? -1 : 1;
            setMind(updatedMind);

            updatedLikes[mindId] = !isLiked;
            setLiked(updatedLikes);
            localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
        } catch (error) {
            console.error('Error updating liked status:', error);
        };
    }

    console.log(window.location)

    const formatActivity = (likes) => {
        if (likes >= 1000) {
            return (likes / 1000).toFixed(1) + 'k';
        } else {
            return likes.toString();
        }
    };

    const mindImg = mind?.img

    const handleOpenShare = (mind) => {
        setIsPopupOpen(true);
        setSelectedMind(mind);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <>
            {selectedMind && (
                <Fade in={isPopupOpen} onChange={handleClosePopup}>
                    <div className={`${s.sharePopUpContainer} ${isPopupOpen ? s.slideIn : s.slideOut}`}>
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
            <p onClick={goBack} style={{ display: "flex", alignItems: "center", marginLeft: "20px", position: "fixed", cursor: "pointer" }}><HiIcons.HiArrowNarrowLeft style={{ marginRight: "20px" }} /> Go Back</p>
            <div style={{ display: "flex", maxWidth: mind?.img ? "1200px" : "600px", margin: "auto" }}>
                {mind?.img && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        maxWidth: "600px",
                        maxHeight: "100vh",
                        overflow: "hidden",
                        position: "sticky",
                        top: "0",
                        border: "1px solid var(--border-color)",
                        boxSizing: "border-box",
                        borderRight: "none"
                    }}>
                        <img src={mindImg} alt="Mind Image" style={{
                            maxWidth: "100%",
                            height: "auto",
                            width: "auto",
                            display: "block"
                        }} />
                    </div>
                )}

                <div style={{ maxWidth: "600px", margin: "auto", border: "1px solid var(--border-color)", borderBottom: "none" }}>
                    <div style={{ position: "sticky", width: "560px", top: "0", backgroundColor: "var(--main-bg-color)", zIndex: "100", borderBottom: "none" }} className={s.postContainer}>
                        <Avatar style={{ cursor: "pointer" }} onClick={() => navigate(`/mind-merge/${mind.author.username}`)} className={s.postAvatar} src={mind.author.photoURL} />
                        <div onClick={() => navigate(`/mind-merge/${mind.author.username}`)} style={{ cursor: "pointer" }} className={s.postContent}>
                            <div style={{ display: "flex", alignItems: "end" }}>
                                <h5 className={s.postContentUser}>{mind.author.firstName} {mind.author.lastName}</h5>
                                <span className={s.postContentDate}>{mind.relativeTime}</span>
                            </div>
                            <p className={s.postContentUsername}>@{mind.author.username}</p>
                        </div>
                    </div>
                    <div style={{ backgroundColor: "var(--main-bg-color)", zIndex: "90", borderTop: "none", paddingTop: "0", paddingLeft: "80px", marginTop: "-20px", }} className={s.postContainer}>
                        <p style={{whiteSpace: "pre-line"}}>{mind.text}</p>
                    </div>
                    <div style={{ minHeight: "100vh", overflow: "scroll" }} className={s.feedContainer}>
                        {comments.map((comment, index) => (
                            <div className={s.postContainer} key={comment.id}>
                                <Avatar onClick={() => navigate(`/mind-merge/${mind.author.username}`)} style={{ cursor: "pointer" }} className={s.postAvatar} src={comment.author.photoURL} />
                                <div className={s.postContent}>
                                    <div onClick={() => navigate(`/mind-merge/${mind.author.username}`)} style={{ display: "flex", alignItems: "end", cursor: "pointer" }}>
                                        <h5 className={s.postContentUser}>{comment.author.firstName} {comment.author.lastName}</h5>
                                        <span className={s.postContentDate}>{comment.relativeTime}</span>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={s.postPageInputContainer}>
                        <div className={s.inputContainer}>
                            <input placeholder="What do you think?" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} type="text" />
                            <p style={{ cursor: "pointer" }} onClick={handleAddComment}>Share</p>
                        </div>
                        <div style={{ display: "flex", padding: " 0px 20px 5px 20px", alignItems: "center" }}>
                            <div style={{ display: "flex", flex: "1" }}>
                                <p style={{ alignItems: "center", display: "flex" }}>
                                    {liked[mindId] ?
                                        <HiIcons.HiHeart onClick={() => toggleLike(mindId)} style={{ fontSize: "19px", color: 'var(--like-btn-color)', scale: "1.05" }} className={s.postActivityItem} /> :
                                        <HiIcons.HiOutlineHeart onClick={() => toggleLike(mindId)} style={{ fontSize: "19px", color: 'var(--main-color)', scale: "1.05" }} className={s.postActivityItem} />
                                    }
                                    <span style={{ marginLeft: "5px" }} className={s.postActivityLabel}>{formatActivity(mind.likes)}</span>
                                </p>
                                <p style={{ display: "flex", alignItems: "center", marginBottom: "-10px", marginTop: "-10px" }}>
                                    <RiChat3Line style={{ marginRight: "10px" }} />
                                    <span style={{ color: "var(--main-highlight-color)", fontSize: "16px" }}>{formatActivity(comments.length)}</span>
                                </p>
                            </div>
                            <HiIcons.HiOutlineUpload style={{ fontSize: "19px", scale: "1.05" }} onClick={() => handleOpenShare(mind)} className={s.postActivityItem} />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default MindPage;
