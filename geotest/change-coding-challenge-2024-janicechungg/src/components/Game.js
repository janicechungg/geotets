import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Box, Button, LinearProgress, IconButton } from '@mui/material';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Game = () => {
  // State to manage all game-related data
  const [gameState, setGameState] = useState({
    questions: [],
    currentQuestion: 0,
    score: 0,
    lives: 3,
    love: 0,
    hintUsed: false,
    isMuted: false,
  });

  const navigate = useNavigate();
  const { pet = 'cat' } = useLocation().state || {}; // Default to cat if no pet is chosen

  // Sound effect references
  const sounds = {
    correct: new Audio(pet === 'cat' ? '/video/cat.mp3' : '/video/dog.mp3'),
    wrong: new Audio('/video/bruh.mp3'),
    background: useRef(new Audio('/video/background.mp3')),
  };

  // Handles background music
  useEffect(() => {
    const music = sounds.background.current;
    music.loop = true;
    music.volume = 0.2;
    // Play music and handle any errors
    music.play().catch(console.error);
    
    // Cleanup function to stop music when component unmounts
    return () => {
      music.pause();
      music.currentTime = 0;
    };
  }, []);

  // Effect to handle muting/unmuting of background music
  useEffect(() => {
    sounds.background.current.muted = gameState.isMuted;
  }, [gameState.isMuted]);

  // Effect to fetch questions from API
  useEffect(() => {
    axios.get('http://localhost:5000/api/questions')
      .then(response => setGameState(prev => ({ ...prev, questions: response.data })))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  // Effect to handle game over conditions
  useEffect(() => {
    if (gameState.love === 100) navigate('/victory', { state: { pet } });
    if (gameState.lives === 0) navigate('/loser', { state: { pet } });
  }, [gameState.love, gameState.lives, navigate, pet]);

  // Function to play sound effects
  const playSound = useCallback((type) => {
    if (!gameState.isMuted) {
      sounds[type].currentTime = 0;
      sounds[type].play().catch(error => console.error('Error playing sound:', error));
    }
  }, [gameState.isMuted, sounds]);

  // Function to handle answer submission
  const handleAnswer = async (answer) => {
    try {
      const response = await axios.post('http://localhost:5000/api/check-answer', {
        userAnswer: answer,
        correctAnswer: gameState.questions[gameState.currentQuestion].correct_answer
      });

      setGameState(prev => {
        const isCorrect = response.data.isCorrect;
        return {
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          lives: isCorrect ? prev.lives : prev.lives - 1,
          love: isCorrect ? Math.min(prev.love + 20, 100) : Math.max(prev.love - 10, 0),
          currentQuestion: (prev.currentQuestion + 1) % prev.questions.length,
          hintUsed: false,
        };
      });

      playSound(response.data.isCorrect ? 'correct' : 'wrong');
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  // Function to handle hint usage
  const handleHint = () => {
    setGameState(prev => ({
      ...prev,
      hintUsed: true,
      love: Math.max(prev.love - 5, 0)
    }));
  };

  // Function to get the appropriate pet image based on game state
  const getImageSource = () => {
    if (gameState.lives === 0) return `pets/${pet}Loaf.png`;
    if (gameState.love >= 75) return `pets/${pet}4.png`;
    if (gameState.love >= 50) return `pets/${pet}3.png`;
    if (gameState.love >= 25) return `pets/${pet}2.png`;
    return `pets/${pet}1.png`;
  };

  // Function to toggle mute state
  const toggleMute = () => setGameState(prev => ({ ...prev, isMuted: !prev.isMuted }));

  // Show loading state if questions haven't been fetched yet
  if (gameState.questions.length === 0) return <div>Loading... Please wait...</div>;

  const currentQ = gameState.questions[gameState.currentQuestion];
  // Shuffle answers for current question
  const answers = [currentQ.correct_answer, ...currentQ.incorrect_answers].sort(() => Math.random() - 0.5);

  return (
    <Box sx={{ maxWidth: '1200px', mt: 4, mx: 'auto', p: 4, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      {/* Header section with game title and mute button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, position: 'relative' }}>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#EDB36F', 
          textAlign: 'center',
        }}>
          GeoPet
        </div>
        <IconButton 
          onClick={toggleMute} 
          color="primary" 
          sx={{color: '#DFB59C', position: 'absolute', right: 0 }}
        >
          {gameState.isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
      </Box>

      {/* Score and lives display */}
      <div style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '4px' }}>
        Score: {gameState.score} | Chances: {gameState.lives}
      </div>

      {/* Love bar */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <div style={{ marginBottom: '0.5rem', color: 'rgba(0, 0, 0, 0.6)' }}>
          Love Bar
        </div>
        <LinearProgress variant="determinate" value={gameState.love} />
      </Box>

      {/* Main game content */}
      <Box sx={{ 
        display: 'flex',  
        gap: 4,
        height: '550px',
      }}>
        {/* Question and answer section */}
        <Box sx={{ 
          flex: 1, 
          p: 4, 
          border: '3px solid #C88C45', 
          borderRadius: '12px', 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#FFF0E7',
        }}>
          {/* Question display */}
          <Box sx={{mb: 2, flex: 1 }}> 
            <div style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}>
              {currentQ.question}
            </div>
            {/* Hint display */}
            {gameState.hintUsed && (
              <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.6)' }}>
                Hint: The answer starts with "{currentQ.correct_answer[0]}"
              </div>
            )}
          </Box>
          {/* Answer buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {answers.map((answer, index) => (
              <Button
                key={index}
                fullWidth
                variant="contained"
                onClick={() => handleAnswer(answer)}
                sx={{ 
                  height: '60px', 
                  backgroundColor: '#F5D5B0',
                  color: '#C88C45',
                  '&:hover': {
                    backgroundColor: '#F0C090',
                  },
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: answer }} />
              </Button>
            ))}
          </Box>
          {/* Hint button */}
          <Button
            variant="outlined"
            onClick={handleHint}
            disabled={gameState.hintUsed}
            sx={{ 
              mt: 2,
              borderColor: '#C88C45',
              color: '#C88C45',
              '&:hover': {
                borderColor: '#EDB36F',
                backgroundColor: 'rgba(237, 179, 111, 0.1)',
              },
            }}
          >
            Get Hint
          </Button>
        </Box>
        {/* Pet image display */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          border: '3px solid #C88C45', 
          borderRadius: '12px',
          backgroundColor: '#FFF0E7'
        }}>
          <img 
            src={getImageSource()}
            alt={`${pet} at different stages`}
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Game;