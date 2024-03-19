import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
  return (
    <div style={{
      position: "fixed",
      width: "100vw",
      height: "100vh",
      margin: "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "var(--main-bg-color)",
      left: "0",
      top: "0",
      zIndex: "100000",
      backgroundImage: "url('/src/imgs/bgBackdrop.png')",
      backgroundSize: "cover",
      backgroundAttachment: "fixed"
    }}>
      <CircularProgress />
    </div>
  );
}

export default Loader;
