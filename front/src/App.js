import Video from "./components/video/Video";
import {useCallback, useEffect, useState} from "react";
import Stamp from "./components/stamp/Stamp";
import {Drawer, Grid, Backdrop, CircularProgress} from "@mui/material";
import StampForm from "./components/stampForm/StampForm";
import Field from "./components/field/Field";
import "./App.css";
import classNames from "classnames";
import {useReducerAsync} from "use-reducer-async";
import {VideoContext, videoReducer, videoContextActions, asyncActionHandlers} from "./VideoContext";
import {useLocation, useNavigate} from 'react-router-dom';
import {createClient} from '@supabase/supabase-js'

function App() {
  const navigate = useNavigate();
  const [store, dispatch] = useReducerAsync(
    videoReducer,
    {
      stamps: [],
      loading: false,
      video: null,
      videoLink: '',
      supabase: createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY)
    },
    asyncActionHandlers
  );
  const [isStampFormOpen, setIsStampFormOpen] = useState(false);
  const location = useLocation();

  const openStampForm = useCallback(() => {
    setIsStampFormOpen(true);
  }, []);

  const closeStampForm = useCallback(() => {
    setIsStampFormOpen(false);
  }, []);

  const addStamp = useCallback((stamp) => {
    closeStampForm();
    dispatch({ type: videoContextActions.addStampAsync, stamp });
  }, [dispatch]);

  useEffect(() => {
    try {
      const search = location.search.substring(1);
      const { videoLink } = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

      if (videoLink) {
        dispatch({
          type: videoContextActions.setVideoLink,
          videoLink: videoLink
        })
      }
    } catch {
      alert("Укажите ссылку в search params")
    }
  }, [location]);

  const onSaveClick = useCallback(async () => {
    if (!store.video) {
      return;
    }

    dispatch({ type: videoContextActions.load })
    try {
      const search = location.search.substring(1);
      const { videoLink } = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

      const { data, error } = await store.supabase
        .from('Translations')
        .insert(store.stamps.map(({ stampStart, stampEnd, text, imgSrc, id }) => ({
          timestampStart: stampStart,
          timestampEnd: stampEnd,
          translation: text,
          image: imgSrc,
          video: videoLink,
          id
        })))
        .select()
    } finally {
      dispatch({ type: videoContextActions.stopLoad })
    }
  }, [store.video]);

  return (
    <VideoContext.Provider value={{ store, dispatch }}>
      <Backdrop
        sx={{ color: '#fff' }}
        open={store?.loading}
      >
        <CircularProgress sx={{ color: "#95D4D6" }} size={60}/>
      </Backdrop>
      <header className={'app-header'}>
        <div className={'app-header-content'}>
          <p className={'app-header-text'}>
            Surdogram.Разметка
          </p>
        </div>
      </header>
      <Grid display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Grid display={'flex'} width={'1380px'} mt={2}>
          <Grid flex={1}>
            <Field style={{ width: '100%' }}>
              <Grid overflow={'hidden'} width={'100%'} height={'540px'} p={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Video
                  videoParams={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '20px'
                  }}
                />
              </Grid>
            </Field>
          </Grid>
          <Grid width={'max-content'} pl={2}>
            <Field style={{ overflow: 'hidden' }}>
              <Grid
                display={'flex'}
                flexDirection={'column'}
                p={2}
                borderRadius={'15px'}
                width={'450px'}
                maxHeight={'540px'}
                minHeight={'540px'}
                className={'scroll'}
              >
                {store.stamps.map(({ stampStart, stampEnd, text, imgSrc, id }) => (
                  <Grid key={id} mb={1}>
                    <Stamp
                      stampStart={stampStart}
                      stampEnd={stampEnd}
                      imgSrc={imgSrc}
                      text={text}
                      id={id}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid p={2}>
                <Grid mb={'10px'}>
                  <button onClick={openStampForm} className={classNames('app-orange-button', 'app-button')}>
                    Добавить
                  </button>
                </Grid>
                <Grid mb={1}>
                  <button onClick={onSaveClick} className={classNames('app-purple-button', 'app-button')}>
                    Сохранить
                  </button>
                </Grid>
                <Drawer anchor={'right'} open={isStampFormOpen} onClose={closeStampForm}>
                  <Grid display={'flex'} width={'500px'} p={4}>
                    <StampForm
                      confirm={addStamp}
                    />
                  </Grid>
                </Drawer>
              </Grid>
            </Field>
          </Grid>
        </Grid>
      </Grid>
    </VideoContext.Provider>
  );
}

export default App;
