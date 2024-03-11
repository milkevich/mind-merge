import React, { useEffect, useState } from 'react';
import * as HiIcons from 'react-icons/hi';
import s from './NavigationBar.module.scss';
import { useUserContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Tooltip } from '@mui/material';
import logo from '../imgs/MMlogo.png'

const NavigationBar = () => {
  const { logOut, user } = useUserContext();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = () => {
      if (user && user.uid) {
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
          setUserData(doc.data());
        });
        return () => {
          unsub();
        };
      }
    };

    getUserData();
  }, [user]);

  const goToProfile = () => {
    if (user && userData && userData.username) {
      navigate(`/mind-merge/${userData.username}`);
    }
  };

  const goToMinds = () => {
    if (user) {
      navigate('/mind-merge/minds');
    }
  };

  return (
    <div className={s.mainContainer}>
      <div className={s.topContainer}>
        <Tooltip title="Hey There! 👋" placement="right">
          <div>
              <img onClick={goToMinds} style={{maxWidth: "20px", cursor: "pointer"}} src={logo}/>
          </div>
        </Tooltip>
        <Tooltip title="Feed" placement="right">
          <div>
            <HiIcons.HiOutlineNewspaper onClick={goToMinds} className={s.containerItem} />
          </div>
        </Tooltip>
        <Tooltip title="Profile" placement="right">
          <div>
            <HiIcons.HiOutlineUserCircle onClick={goToProfile} className={s.containerItem} />
          </div>
        </Tooltip>
        <Tooltip title="New Mind" placement="right">
          <div>
            <HiIcons.HiOutlinePencilAlt className={s.containerItem} />
          </div>
        </Tooltip>
      </div>
      <div className={s.bottomContainer}>
        <Tooltip title="Dark Mode" placement="right">
          <div>
            <HiIcons.HiOutlineMoon className={s.containerItem} />
          </div>
        </Tooltip>
        <Tooltip title="Log Out" placement="right">
          <div>
            <HiIcons.HiLogin onClick={logOut} className={s.containerItem} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default NavigationBar;
