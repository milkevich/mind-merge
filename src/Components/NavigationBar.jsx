import React, { useEffect, useState, useRef } from 'react';
import * as HiIcons from 'react-icons/hi';
import s from './NavigationBar.module.scss';
import { useUserContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Fade, Slide, Tooltip } from '@mui/material';
import logo from '../imgs/MMlogo.png';
import { useThemeContext } from '../Contexts/ThemeContext';
import { FaRegCompass, FaCompass } from 'react-icons/fa';
import Explore from './Explore';

const NavigationBar = () => {
  const { logOut, user } = useUserContext();
  const [userData, setUserData] = useState(null);
  const [tab, setTab] = useState('Feed');
  const [isExploreVisible, setIsExploreVisible] = useState(false);
  const navigate = useNavigate();
  const { toggleTheme, isLightMode } = useThemeContext();
  const exploreRef = useRef(null);

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

  useEffect(() => {
    if (window.location.pathname === '/mind-merge/minds') {
      setTab('Feed');
    } else if (user && userData && userData.username && window.location.pathname === `/mind-merge/${userData.username}`) {
      setTab('Profile');
    } else if (user && userData && userData.username && window.location.pathname === `/mind-merge/explore`) {
      setTab('Explore');
    }
  }, [user, userData]);

  const goToProfile = () => {
    if (user && userData && userData.username) {
      navigate(`/mind-merge/${userData.username}`);
      setIsExploreVisible(false);
    }
  };

  const goToMinds = () => {
    if (user) {
      navigate('/mind-merge/minds');
      setIsExploreVisible(false);
    }
  };

  const toggleExplore = () => {
    setIsExploreVisible(!isExploreVisible);
  };

  return (
    <div>
      <div className={s.mainContainer}>
        <div className={s.topContainer}>
          <Tooltip title="Hey There! 👋" placement="right">
            <div>
              <img onClick={goToMinds} style={{ maxWidth: "20px", cursor: "pointer" }} src={logo} />
            </div>
          </Tooltip>
          <Tooltip title="Feed" placement="right">
            <div>
              {tab === 'Feed' ?
                <HiIcons.HiNewspaper style={{ scale: "1.05" }} onClick={goToMinds} className={s.containerItem} />
                : <HiIcons.HiOutlineNewspaper onClick={goToMinds} className={s.containerItem} />
              }
            </div>
          </Tooltip>
          <Tooltip title="Profile" placement="right">
            <div>
              {tab === 'Profile' ?
                <HiIcons.HiUserCircle style={{ scale: "1.05" }} onClick={goToProfile} className={s.containerItem} />
                : <HiIcons.HiOutlineUserCircle onClick={goToProfile} className={s.containerItem} />
              }
            </div>
          </Tooltip>
          <Tooltip title="Explore" placement="right">
            <div onClick={toggleExplore}>
              {isExploreVisible ?
                <FaCompass style={{ fontSize: "18px", marginLeft: "1.3px" }} className={s.containerItem} />
                : <FaRegCompass style={{ fontSize: "18px", marginLeft: "1.3px" }} className={s.containerItem} />
              }
            </div>
          </Tooltip>
        </div>
        <div onClick={toggleTheme} className={s.bottomContainer}>
          <Tooltip title={isLightMode ? "Light Mode" : "Dark Mode"} placement="right">
            <div>
              {isLightMode ?
                <HiIcons.HiSun className={s.containerItem} />
                : <HiIcons.HiOutlineMoon className={s.containerItem} />
              }
            </div>
          </Tooltip>
          <Tooltip title="Log Out" placement="right">
            <div>
              <HiIcons.HiLogin onClick={logOut} className={s.containerItem} />
            </div>
          </Tooltip>
        </div>
      </div>
      {isExploreVisible &&
        <div style={{ position: "fixed", zIndex: "1000", width: "100%", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.3)", overflow: "hidden", backdropFilter: "blur(3px)" }}>
          <Explore />
        </div>
      }
    </div>
  );
};

export default NavigationBar;
