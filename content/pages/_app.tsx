import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { SessionProvider } from "next-auth/react";
import { AnimationProvider } from '@/components/animation/AnimationProvider';
import { ProjectProvider } from '@/components/project/ProjectProvider';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#FFC107',
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProjectProvider>
          <AnimationProvider>
            <Component {...pageProps} />
          </AnimationProvider>
        </ProjectProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;