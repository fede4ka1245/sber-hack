import React, {useContext, useEffect, useReducer, useRef} from 'react';
import styles from './Video.module.css';
import {VideoContext, videoContextActions} from "../../VideoContext";
import {Typography} from "@mui/material";

const Video = ({ videoParams }) => {
  const videoRef = useRef(null);
  const { dispatch, store } = useContext(VideoContext);

  useEffect(() => {
    if (videoRef.current) {
      dispatch({
        type: videoContextActions.addVideo,
        video: videoRef.current.cloneNode(true)
      });
    }
  }, [store.videoLink])

  useEffect(() => {
    if (!store.video || !store.videoLink) {
      return;
    }

    dispatch({
      type: videoContextActions.loadStamps,
      url: store.videoLink
    });
  }, [store.video, store.videoLink]);

  if (!store.videoLink) {
    return <div
      style={{ width: '100%' }}
    >
      <Typography textAlign={'center'}>
        Нет видео
      </Typography>
    </div>
  }

  return (
    <>
      <video
        ref={videoRef}
        controls
        {...videoParams}
        className={styles.video}
        src={store.videoLink}
      >
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default Video;