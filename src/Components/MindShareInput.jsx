import React, { useEffect, useState } from 'react'
import s from './Header.module.scss'
import { Avatar, LinearProgress, createTheme } from '@mui/material'
import * as HiIcons from 'react-icons/hi';
import { useUserContext } from '../Contexts/UserContext'
import { Timestamp, arrayUnion, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Skeleton } from '@mui/joy';
import Snackbar from '@mui/joy/Snackbar'

const MindShareInput = () => {
  const [userData, setUserData] = useState([]);
  const { user } = useUserContext();
  const [mindText, setMindText] = useState('');
  const [mindImg, setMindImg] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [progressPercent, setProgressPercent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(false)

  const share = async (e) => {
    e.preventDefault();

    const mindId = uuid();
    const mindRef = doc(db, 'minds', mindId);

    try {
      if (mindImg) {
        const storageRef = ref(storage, `images/${uuid()}`);
        const uploadImg = uploadBytesResumable(storageRef, mindImg);

        setUploadInProgress(true);

        uploadImg.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setProgressPercent(Math.round(progress));
          },
          (error) => {
            console.error("Upload error:", error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadImg.snapshot.ref);
              setSnackbar(true)
              setTimeout(() => {
                setSnackbar(false)
              }, 3000);
              await setDoc(mindRef, {
                author: {
                  uid: user.uid,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  photoURL: userData.photoURL,
                  username: userData.username,
                },
                text: mindText,
                likes: 0,
                commentsCount: 0,
                date: Timestamp.now(),
                img: downloadURL,
              });

              setUploadInProgress(false);
              setProgressPercent(null);
              setMindImg(null);
              setMindText('');
            } catch (error) {
              console.error('Error sharing mind with image:', error);
            }
          }
        );
      } else if (mindText.trim('')) {
        setSnackbar(true)
              setTimeout(() => {
                setSnackbar(false)
              }, 3000);
        await setDoc(mindRef, {
          author: {
            uid: user.uid,
            firstName: userData.firstName,
            lastName: userData.lastName,
            photoURL: userData.photoURL,
            username: userData.username,
          },
          text: mindText,
          likes: 0,
          commentsCount: 0,
          date: Timestamp.now(),
        });

        setMindText('');
        console.log('Mind shared successfully');
      }
    } catch (error) {
      console.error('Error sharing mind:', error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      console.log(file.size);
      alert('File size exceeds the maximum limit (5MB). Please choose a smaller file.');
    } else {
      console.log(file.size);
      setMindImg(file);
    }
  };

  useEffect(() => {
    setLoading(true)
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
      setTimeout(() => {
        setLoading(false)
      }, 400);
    }
  }, [user]);

  return (
    <div style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--main-bg-color)" }}>
      <Snackbar sx={{ backgroundColor: "var(--main-bg-color)", border: "1px solid var(--border-color)", color: "var(--main-color)" }} open={snackbar} variant="outlined" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>✅ Shared with the world!</Snackbar>
      {uploadInProgress && progressPercent !== null && (
        <div className={s.uploadLinearProgress}>
          <p><span>{progressPercent}%</span> Publishing Post</p>
          <div style={{ width: `${progressPercent}%`, zIndex: "1000" }} className={s.uploadProgress}></div>
          <div style={{ width: `100%`, backgroundColor: "var(--main-highlight-bg-color)", marginTop: "-2px" }} className={s.uploadProgress}></div>
        </div>
      )}
      <div className={s.inputContainer}>
        <Skeleton loading={loading} animation='wave' variant='circular' width={40} height={40}>
          <Avatar src={userData.photoURL} />
          </Skeleton>
          <textarea
            role="textbox"
            value={mindText}
            onChange={(e) => setMindText(e.target.value)}
            placeholder="What's up?"
            rows={mindText.split('\n').length || 1}
          />
        <label style={{ cursor: "pointer" }} htmlFor="file-upload">
          <HiIcons.HiOutlinePaperClip className={s.uploadIcon} />
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <div>
          <button onClick={share}>Share</button>
        </div>
      </div>
      {mindImg && !uploadInProgress && (
        <div style={{backgroundColor: "var(--main-bg-color)"}} className={s.selectedMedia}>
          <HiIcons.HiOutlineTrash onClick={() => { setMindImg(null) }} className={s.selectedMediaIcon} />
          <div style={{backgroundColor: "var(--main-bg-color)"}} onClick={() => { setMindImg(null) }} className={s.selectedMediaHoverBackDrop}>
            <HiIcons.HiOutlineX className={s.deleteHoverIcon} />
            <img src={URL.createObjectURL(mindImg)} alt="Uploaded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MindShareInput;