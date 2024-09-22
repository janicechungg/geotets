import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PetChoice = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); //controls whether instructions is opened or nott

  const handleChoice = (pet) => navigate('/game', { state: { pet } });
  const toggleInstruction = () => setOpen(!open);

  const petOptions = [
    { name: 'Cat', emoji: '😼', image: 'pets/cats.jpg', alt: 'Cat', petKey: 'cat' },
    { name: 'Dog', emoji: '🐶', image: 'pets/dogs.jpg', alt: 'Dog', petKey: 'dog' }
  ];

  return (
    
    
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom>Welcome to GeoPet!</Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>Choose your pet 🐾</Typography>
       {/* Pet Choices*/}
      <Button onClick={toggleInstruction} sx={{ mb: 4 }}>Instructions</Button>

      <Grid container spacing={4} justifyContent="center">
        {petOptions.map((pet) => (
          <Grid item xs={1} sm={6} key={pet.petKey}>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="img" src={pet.image} alt={pet.alt} sx={{ width: '100%', height: 400,  mb: 2 }} />
              <Button color="primary" onClick={() => handleChoice(pet.petKey)} >
                {pet.emoji}
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

        {/* Instructions Popup */}
      <Dialog open={open} onClose={toggleInstruction}> 
        <DialogTitle>How to Play GeoPet</DialogTitle>
        <DialogContent>
          <Typography>
            1. Choose your pet: Cat or Dog.<br />
            2. Answer geography questions correctly to increase your pet's love for you.<br />
            3. Use hints wisely, as they decrease your pet's love slightly.<br />
            4. Win the game by filling up the love bar completely!<br />
            5. Be careful not to lose all your chances or your pet will no longer love you.<br />
            Have fun!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleInstruction}>Got it!</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PetChoice;
