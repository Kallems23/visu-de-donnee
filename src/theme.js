// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Rouge-rose pour le thème pizza
      light: '#FF8E8E',
      dark: '#FF4848',
    },
    secondary: {
      main: '#4CAF50', // Vert pour les accents
      light: '#6FBF73',
      dark: '#357A38',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 500,
    },
  },
});

export default theme;