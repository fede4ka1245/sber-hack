import React, {useCallback, useLayoutEffect, useState, useMemo} from 'react';
import {Grid, TextField} from "@mui/material";
import classNames from "classnames";
import {StampValidator} from "../../features";

const StampForm = ({ confirm, initialStamp, deleteStamp }) => {
  const [text, setText] = useState('');
  const [timeStampStart, setTimeStampStart] = useState('');
  const [timeStampEnd, setTimeStampEnd] = useState('');

  useLayoutEffect(() => {
    if (!initialStamp) {
      return;
    }

    setText(initialStamp.text);
    setTimeStampStart(initialStamp.stampStart);
    setTimeStampEnd(initialStamp.stampEnd);
  }, []);

  const onConfirmClick = useCallback(() => {
    confirm({ stampStart: timeStampStart, stampEnd: timeStampEnd, text });
  }, [text, timeStampStart, timeStampEnd, confirm]);

  const timeStampStartValid = useMemo(() => {
    return !timeStampStart || StampValidator.isTimeStringValid(timeStampStart);
  }, [timeStampStart]);

  const timeStampEndValid = useMemo(() => {
    return !timeStampEnd || StampValidator.isTimeStringValid(timeStampEnd);
  }, [timeStampEnd]);

  const onTimeStampStartBlur = useCallback(() => {
    if (timeStampStart && !isNaN(timeStampStart)) {
      setTimeStampStart(StampValidator.formatSecondsToString(timeStampStart));
    }
  }, [timeStampStart]);

  const onTimeStampEndBlur = useCallback(() => {
    if (timeStampEnd && !isNaN(timeStampEnd)) {
      setTimeStampEnd(StampValidator.formatSecondsToString(timeStampEnd));
    }
  }, [timeStampEnd]);

  return (
    <Grid container display={'flex'} flexDirection={'column'} width={'100%'}>
      <Grid item mb={2} width={'100%'}>
        <TextField
          fullWidth
          label={'Перевод'}
          onChange={(event) => {
            setText(event.target.value);
          }}
          variant={'outlined'}
          value={text}
        />
      </Grid>
      <Grid item mb={2} width={'100%'}>
        <TextField
          variant={'outlined'}
          label={'Время начала'}
          fullWidth
          onChange={(event) => {
            setTimeStampStart(event.target.value);
          }}
          onBlur={onTimeStampStartBlur}
          error={!timeStampStartValid}
          value={timeStampStart}
        />
      </Grid>
      <Grid item mb={6} width={'100%'}>
        <TextField
          fullWidth
          variant={'outlined'}
          label={'Время конца'}
          onBlur={onTimeStampEndBlur}
          onChange={(event) => {
            setTimeStampEnd(event.target.value);
          }}
          error={!timeStampEndValid}
          value={timeStampEnd}
        />
      </Grid>
      <Grid mb={2}>
        <button onClick={onConfirmClick} className={classNames('app-button', 'app-orange-button')}>
          Подтвердить
        </button>
      </Grid>
      {deleteStamp && <Grid mb={2}>
        <button onClick={deleteStamp} className={classNames('app-button', 'app-danger-button')}>
          Удалить
        </button>
      </Grid>}
    </Grid>
  );
};

export default StampForm;