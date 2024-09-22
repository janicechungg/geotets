import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Selection from './components/Selection';
import Game from './components/Game';
import Victory from './components/Victory';
import Loser from './components/Loser';

//creating mui theme for styling
const theme = createTheme({
  palette: {
    background: { default: '#FFF5EE' },
    text: { primary: '#C88C45' },
  },
  components: {
    MuiButton: {
      styleOverrides: { //gives control over default mui attributes
        root: {
          backgroundColor: '#F5D5B0',
          color: '#C88C45',
          '&:hover': { backgroundColor: '#F0C090' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFF0E7',
          borderRadius: '16px',
          border: '8px solid #EDB36F',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#FBE9D5',
          borderRadius: 5,
          height: 20,
        },
        bar: {
          borderRadius: 5,
          backgroundColor: '#DFB59C',
        },
      },
    },
  },
});
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Selection />} />
          <Route path="/game" element={<Game />} />
          <Route path="/victory" element={<Victory />} />
          <Route path="/loser" element={<Loser />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};


export default App;