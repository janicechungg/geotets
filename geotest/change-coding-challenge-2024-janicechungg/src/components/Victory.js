import React, { useEffect } from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { keyframes } from '@emotion/react';

 {/* Animations*/}
const bounceIn = keyframes`
  0% { transform: scale(0.1); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Victory = () => {
  const location = useLocation();
  const pet = location.state?.pet || 'cat'; //Default to cat if no pet is chosen

  return (
    <Container  sx={{ textAlign: 'center', mt: 8  }}>
      <Typography variant="h3" sx={{ animation: `${bounceIn} 1s` }}>
        Congratulations! You've won the {pet}'s love!
      </Typography>
      {/* Image of the pet */}
      <Box
        component="img"
        sx={{
          width: '100%',
          maxWidth: 300,
          margin: 'auto',
          animation: `${fadeIn} 2s`,
        }}
        alt={`Yay ${pet}`}
        src={`pets/wholesome${pet}.jpg`}
      />
      {/* Gives Options to play again or choose another pet */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4, animation: `${fadeIn} 3s` }}>
        <Button component={Link} to="/game" state={{ pet: pet }} variant="contained" color="primary">
          Play Again
        </Button>
        <Button component={Link} to="/" variant="contained" >
          Choose Another Pet
        </Button>
      </Stack>
    </Container>
  );
};

export default Victory;