import React, {useCallback, useContext, useMemo, useState} from 'react';
import {Drawer, Grid, IconButton} from "@mui/material";
import styles from './Stamp.module.css';
import StampForm from "../stampForm/StampForm";
import {VideoContext, videoContextActions} from "../../VideoContext";

const Stamp = ({ stampStart, stampEnd, text, imgSrc, id }) => {
  const { dispatch } = useContext(VideoContext);
  const [isStampFormOpen, setIsStampFormOpen] = useState(false);
  const openStampForm = useCallback(() => {
    setIsStampFormOpen(true);
  }, []);

  const closeStampForm = useCallback(() => {
    setIsStampFormOpen(false);
  }, []);

  const timestampsLabel = useMemo(() => {
    return `${stampStart} - ${stampEnd}`;
  }, [stampStart, stampEnd]);

  const edit = useCallback((stamp) => {
    closeStampForm();
    dispatch({
      type: videoContextActions.editStampAsync,
      id,
      stamp
    })
  }, []);

  const deleteStamp = useCallback(() => {
    dispatch({
      type: videoContextActions.deleteStamp,
      id
    });
    closeStampForm();
  }, [id]);

  return (
    <div className={styles.main}>
      <Grid ml={'10px'} width={'85px'} height={'85px'} overflow={'hidden'} className={styles.img}>
        <img alt={'stamp-image'} src={imgSrc} />
      </Grid>
      <Grid ml={2} flex={1} display={'flex'} height={'100%'} flexDirection={'column'}>
        <p className={styles.text}>
          {text}
        </p>
        <p className={styles.stamp}>
          {timestampsLabel}
        </p>
      </Grid>
      <Grid ml={1} mr={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <IconButton onClick={openStampForm}>
          <svg width="7" height="27" viewBox="0 0 7 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="3.5" cy="3.5" r="3.5" fill="#FEAC00"/>
            <circle cx="3.5" cy="23.5" r="3.5" fill="#FEAC00"/>
            <circle cx="3.5" cy="13.5" r="3.5" fill="#FEAC00"/>
          </svg>
        </IconButton>
      </Grid>
      <Drawer anchor={'right'} open={isStampFormOpen} onClose={closeStampForm}>
        <Grid display={'flex'} width={'500px'} p={4}>
          <StampForm
            confirm={edit}
            deleteStamp={deleteStamp}
            initialStamp={{ stampStart, stampEnd, text, imgSrc, id }}
          />
        </Grid>
      </Drawer>
    </div>
  );
};

export default Stamp;