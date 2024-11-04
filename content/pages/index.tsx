import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Head from 'next/head';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const LandingPage: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  const handleLearnMore = () => {
    router.push('/about');
  };

  return (
    <>
      <Head>
        <title>Animate Your Images | Welcome</title>
        <meta name="description" content="Create stunning animations from your still images with our AI-powered tool." />
      </Head>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant={isMobile ? 'h3' : 'h2'} component="h1" gutterBottom>
                Animate Your Still Images
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                Transform your photos into captivating animations with AI
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={handleLearnMore}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: 400, width: '100%' }}>
                <Image
                  src="/images/animation-demo.gif"
                  alt="Animation Demo"
                  layout="fill"
                  objectFit="contain"
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={4} sx={{ mt: 6 }}>
            <Grid item xs={12} sm={4}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Easy to Use
                </Typography>
                <Typography>
                  Upload your image and let our AI do the magic. No technical skills required.
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Customizable
                </Typography>
                <Typography>
                  Fine-tune your animations with our intuitive controls and options.
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Share Instantly
                </Typography>
                <Typography>
                  Download or share your animated creations directly on social media.
                </Typography>
              </StyledPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;