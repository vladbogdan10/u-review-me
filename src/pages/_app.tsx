import * as React from 'react';
import type { AppProps } from 'next/app';
import '@fontsource/roboto/latin-300.css';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import '../../styles/globals.css';
import '../../styles/quill-custom.css';
import { SessionProvider } from 'next-auth/react';
import {
  createTheme,
  createStyles,
  makeStyles,
  Theme,
  ThemeProvider,
  useTheme,
} from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from '../components/Header/Header';
import { GlobalContextProvider } from '../context/global-context';
import Notifications from '../components/Notfications/Notifications';
import CreatePostDialog from '../components/PostCreator/CreatePostDialog';
import TrackingScripts from '../components/Scripts/TrackingScripts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    },
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  const classes = useStyles();
  const theme = useTheme();
  // const prefersDarkMode = useMediaQuery('@media (prefers-color-scheme: dark)');

  const appTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: 'dark',
          brand: '#f0bc17',
          blue: '#396dd7',
          primary: { main: '#f0bc17' },
          secondary: { main: '#396dd7' },
          // background: { default: '#25282c', paper: '#33363a' },
        },
        overrides: {
          MuiPaper: {
            rounded: {
              [theme.breakpoints.down('xs')]: {
                borderRadius: 'initial',
                border: 'none !important',
              },
            },
          },
          MuiContainer: {
            root: {
              [theme.breakpoints.down('xs')]: {
                paddingLeft: 0,
                paddingRight: 0,
              },
              maxWidth: 1050,
            },
          },
          MuiGrid: {
            root: {
              [theme.breakpoints.down('xs')]: {
                margin: '0 !important',
                width: '100% !important',
              },
            },
            item: {
              [theme.breakpoints.down('xs')]: {
                paddingLeft: '0 !important',
                paddingRight: '0 !important',
              },
            },
          },
        },
      }),
    []
  );

  return (
    <>
      <TrackingScripts />
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <GlobalContextProvider>
          <SessionProvider session={pageProps.session}>
            {/* <React.StrictMode> */}
            <div className={classes.root}>
              <Header />
              <Component {...pageProps} />
              <CreatePostDialog />
              <Notifications />
            </div>
            {/* </React.StrictMode> */}
          </SessionProvider>
        </GlobalContextProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
