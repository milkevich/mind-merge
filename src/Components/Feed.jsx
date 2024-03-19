import React, { useEffect, useState, memo } from 'react';
import s from './Feed.module.scss';
import { Avatar, Fade, Tooltip } from '@mui/material';
import * as HiIcons from 'react-icons/hi';
import { RiChat3Line } from "react-icons/ri";
import { collection, deleteDoc, doc, increment, onSnapshot, orderBy, updateDoc, where } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUserContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import memoizeOne from 'memoize-one';
import Slide from '@mui/material/Slide';
import Skeleton from '@mui/joy/Skeleton';
import Snackbar from '@mui/joy/Snackbar';

const Feed = ({ profileUser }) => {
    const [minds, setMinds] = useState([]);
    const [liked, setLiked] = useState({});
    const [doubleTapAnimationId, setDoubleTapAnimationId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingImg, setLoadingImg] = useState(true);
    const [selectedMind, setSelectedMind] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(null)
    const [openDelete, setOpenDelete] = useState(false)
    const [openDeleteAnimation, setOpenDeleteAnimation] = useState(false)
    const [profileShown, setProfileShown] = useState(false)
    const [sortOpened, setSortOpened] = useState(false)
    const [snackbar, setSnackbar] = useState(false)
    const [snackbarText, setSnackbarText] = useState('✅ Done')
    const [optionSelected, setOptionSelected] = useState('Popular')

    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};
        setLiked(likedPosts);
    }, []);

    useEffect(() => {
        const getMinds = async () => {
            setLoading(true);

            let mindsRef = collection(db, "minds");

            if (profileUser && profileUser.uid) {
                mindsRef = query(mindsRef, where("author.uid", "==", profileUser.uid));
                setProfileShown(true);
                setOptionSelected(() => 'Newest');
            } else {
                setProfileShown(false);
            }

            if (optionSelected === 'Popular') {
                mindsRef = query(mindsRef, orderBy("likes", "desc"));
            } else if (optionSelected === 'Newest') {
                mindsRef = query(mindsRef, orderBy("date", "desc"));
            }

            const unsub = onSnapshot(mindsRef, (snapshot) => {
                const mindsData = snapshot.docs.map(doc => {
                    const mindData = { id: doc.id, ...doc.data() };
                    mindData.relativeTime = formatRelativeTime(mindData.date.toDate());

                    return mindData;
                });
                setMinds(mindsData);
                setLoading(false);
            });

            return () => unsub();
        };

        getMinds();
    }, [profileUser, optionSelected]);




    console.log(`we at ${profileShown}`)
    console.log(user)


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

    const handleOpenOptions = (mindId) => {
        setOptionsOpen(optionsOpen === mindId ? null : mindId);
    };

    const handleOpenDelete = (mindId) => {
        setOpenDelete(true);
        setOpenDeleteAnimation(true)
        setOptionsOpen(false);
        setSelectedMind(mindId);
    }

    const handleCloseDelete = () => {
        setOpenDeleteAnimation(false);
        setTimeout(() => {
            setOpenDelete(false);
        }, 300);
    }
    const deletePost = async () => {
        if (selectedMind) {
            await deleteDoc(doc(db, "minds", selectedMind.id))
            handleCloseDelete();
        }
        setSnackbar(true)
        setSnackbarText('✅ Deleted!')
        setTimeout(() => {
            setSnackbar(false)
        }, 3000);
    }

    const handleOpenSortOptions = () => {
        setSortOpened(!sortOpened)
    }

    const handleSortOptionClick = (option) => {
        setOptionSelected(option);
        setSortOpened(false);
        console.log(optionSelected)
    }

    return (
        <div className={s.feedContainer}>
            <Snackbar sx={{ backgroundColor: "var(--main-bg-color)", border: "1px solid var(--border-color)", color: "var(--main-color)" }} open={snackbar} variant="outlined" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>{snackbarText}</Snackbar>
            {openDelete &&
                <Fade mountOnEnter unmountOnExit in={openDeleteAnimation}>
                    <div className={s.deleteBackdrop}>
                        <Slide direction="up" in={openDeleteAnimation} mountOnEnter unmountOnExit>
                            <div className={s.deleteContainer}>
                                <p>Are you sure you want to delete this post? <br /> <span>You won't be able to access it ever again.</span> </p>
                                <div className={s.btnsContainer}>
                                    <button onClick={deletePost} className={s.deleteBtn}>Delete</button>
                                    <button onClick={handleCloseDelete} className={s.cancelBtn}>Cancel</button>
                                </div>
                            </div>
                        </Slide>
                    </div>
                </Fade>
            }
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
                                            <p className={s.postContentUsername} style={{ color: "var(--main-highlight-color)" }}>@{selectedMind.author.username}</p>
                                        </div>
                                        <p style={{ maxHeight: "40px", overflow: "hidden", marginLeft: "-60px", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "100%" }} className={s.postContentText}>{selectedMind.text}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className={s.shareLink} onClick={() => {
                                        handleClosePopup()
                                        navigator.clipboard.writeText(`${window.location.host}/mind-merge/minds/mind/${selectedMind.id}`);
                                        setSnackbar(true)
                                        setSnackbarText('✅ Copied to clipboard!')
                                        setTimeout(() => {
                                            setSnackbar(false)
                                        }, 3000);
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
            {!profileShown &&
                <div className={s.sortContainer}>
                    <p onClick={handleOpenSortOptions} style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0", cursor: "pointer", width: "80px" }}><HiIcons.HiOutlineSwitchVertical /> Sort by</p>
                    {sortOpened &&
                        <div className={s.sortOptionsContainer}>
                            <p onClick={() => handleSortOptionClick('Popular')}>Popular</p>
                            <p onClick={() => handleSortOptionClick('Newest')}>Newest</p>
                        </div>
                    }
                </div>
            }

            {minds?.map((mind) => (
                <div key={mind.id} className={s.postContainer}>
                    <Skeleton animation='wave' loading={loading} variant='circular' width={43} height={40}>
                        <Avatar onClick={() => navigate(`/mind-merge/${mind.author.username}`)} style={{ cursor: "pointer" }} src={mind.author.photoURL} className={s.postAvatar} />
                    </Skeleton>
                    <div style={{ zIndex: "90" }} className={s.postContent}>
                        <div onClick={() => navigate(`/mind-merge/${mind.author.username}`)} className={s.postContentUserInfo}>
                            <Skeleton loading={loading} sx={{ marginTop: "30px", height: "10px", width: "300px" }} variant='text' >
                                <h5 className={s.postContentUser}>{mind.author.firstName} {mind.author.lastName}</h5>
                            </Skeleton>
                            <Skeleton loading={loading} sx={{ marginTop: "30px", height: "10px", width: "0", position: "relative", left: "435px" }} variant='text' >
                                <span className={s.postContentDate}>{mind.relativeTime}</span>
                            </Skeleton>
                        </div>
                        {mind?.img &&
                            <Skeleton loading={loadingImg} sx={{ marginTop: "20px", marginBottom: "5px", borderRadius: "5px" }} width={300} height={230} animation='wave' variant='regtangular'>
                                <div onDoubleClick={() => doubleLike(mind.id)} className={s.mindImgContainer}>
                                    <HiIcons.HiHeart style={{ scale: doubleTapAnimationId === mind.id ? "1" : "0" }} className={s.minImgLikeIcon} />
                                    <img onLoad={() => setLoadingImg(false)} className={s.mindImg} src={mind.img} />
                                </div>
                            </Skeleton>
                        }
                        <Skeleton loading={loading} variant='text' width={200} height={15}>
                            <p style={{ whiteSpace: "pre-line", marginTop: "20px", maxWidth: "calc(100% - 60px)", wordWrap: "break-word", paddingRight: "20px" }} onClick={() => handleOpenComments(mind)} className={s.hoverFade}>{mind.text}</p>
                        </Skeleton>
                        <div style={{ paddingBottom: loading ? "20px" : 0 }} className={s.postActivityContainer}>
                            <Skeleton loading={loading} sx={{ display: "none" }} variant='overlay' height={0} width={0}>
                                {liked[mind.id] ? (
                                    <HiIcons.HiHeart
                                        onClick={() => toggleLike(mind.id)}
                                        style={{ fontSize: "19px", color: 'var(--like-btn-color)' }}
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
                                    style={{ fontSize: "19px" }}
                                    className={s.postActivityItem}
                                />
                                <div style={{ position: "relative", width: "100%", bottom: "10px", cursor: "pointer" }}>
                                    {mind.author.uid === user.uid &&
                                        <div>
                                            <HiIcons.HiOutlineDotsVertical onClick={() => handleOpenOptions(mind.id)} style={{ flex: "1", position: "absolute", right: "0" }} />
                                            {optionsOpen === mind.id ?
                                                <button onClick={() => handleOpenDelete(mind)} className={s.optionButton}><HiIcons.HiOutlineTrash style={{ paddingRight: "10px" }} /> Delete</button>
                                                : null}
                                        </div>
                                    }
                                </div>
                            </Skeleton>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default memo(Feed);
