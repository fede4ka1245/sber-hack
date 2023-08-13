import { createContext } from 'react';
import {capturePhotoFromVideo, getStamps, StampValidator} from "./features";

export const videoContextActions = {
  deleteStamp: 'deleteStamp',
  editStamp: 'editStamp',
  addStamp: 'addStamp',
  setStamps: 'setStamps',
  editStampAsync: 'editStampAsync',
  addStampAsync: 'addStampAsync',
  addVideo: 'addVideo',
  capturePhotoFromVideo: 'capturePhotoFromVideo',
  loadStamps: 'loadStamps',
  load: 'load',
  stopLoad: 'stopLoad',
  setVideoLink: 'setVideoLink'
}

export const asyncActionHandlers = {
  [videoContextActions.loadStamps]: ({ dispatch, getState }) => async (action) => {
    const store = getState();
    dispatch({
      type: videoContextActions.load,
    })
    try {
      const stamps = await getStamps(action.url);

      const formattedStamps = await Promise.all(stamps.map(async (stamp) => {
        return {
          stampStart: StampValidator.formatSecondsToString(Math.floor(stamp.timestamp_start)),
          stampEnd: StampValidator.formatSecondsToString(Math.floor(stamp.timestamp_end)),
          text: stamp.translation,
          imgSrc: await capturePhotoFromVideo(
            store.video,
            stamp.timestamp_start
          ),
          id: new Date().getTime()
        }
      }));

      dispatch({
        type: videoContextActions.setStamps,
        stamps: formattedStamps
      });
    } finally {
      dispatch({
        type: videoContextActions.stopLoad,
      })
    }
  },
  [videoContextActions.editStampAsync]: ({ dispatch, getState }) => async (action) => {
    const store = getState();
    const stamp = StampValidator.formatStringToSeconds(action.stamp.stampStart)

    dispatch({
      type: videoContextActions.editStamp,
      stamp: {
        ...action.stamp,
        imgSrc: await capturePhotoFromVideo(
          store.video,
          stamp
        )
      },
      id: action.id
    });
  },
  [videoContextActions.addStampAsync]: ({ dispatch, getState }) => async (action) => {
    const store = getState();
    const stamp = StampValidator.formatStringToSeconds(action.stamp.stampStart)

    dispatch({
      type: videoContextActions.addStamp,
      stamp: {
        ...action.stamp,
        imgSrc: await capturePhotoFromVideo(
          store.video,
          stamp
        )
      },
    });
  },
};

export function videoReducer(store, action) {
  switch (action.type) {
    case videoContextActions.setVideoLink: {
      return {
        ...store,
        videoLink: action.videoLink
      }
    }
    case videoContextActions.setStamps: {
      return {
        ...store,
        stamps: action.stamps
      }
    }
    case videoContextActions.addStamp: {
      return {
        ...store,
        stamps: [
          ...store.stamps,
          {
            id: new Date().getTime(),
            ...action.stamp
          }
        ]
      }
    }
    case videoContextActions.deleteStamp: {
      return {
        ...store,
        stamps: store.stamps.filter(({id}) => id !== action.id)
      }
    }
    case videoContextActions.load: {
      return {
        ...store,
        loading: true
      }
    }
    case videoContextActions.stopLoad: {
      return {
        ...store,
        loading: false
      }
    }
    case videoContextActions.editStamp: {
      const targetIndex = store.stamps.findIndex(({ id }) => id === action.id);
      store.stamps[targetIndex] = {
        ...store.stamps[targetIndex],
        ...action.stamp
      };

      return {
        ...store,
        stamps: store.stamps
      }
    }
    case videoContextActions.addVideo: {
      return {
        ...store,
        video: action.video
      }
    }
    default: {
      return store;
    }
  }
}

export const VideoContext = createContext(null);