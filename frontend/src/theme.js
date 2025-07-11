// src/theme.js
import { createTheme } from '@mui/material/styles';

const palette = {
  background: '#FCF8F7', 
  text: '#5D4037',     
  primary: '#E6A4B4',    
  secondary: '#F5C6AA',  
  accent: '#A084E8',   
};

export const romanceTheme = createTheme({
  palette: {
    mode: 'light', 
    background: {
      default: palette.background,
      paper: '#FFFFFF', 
    },
    primary: {
      main: palette.primary,
    },
    secondary: {
      main: palette.secondary,
    },
    text: {
      primary: palette.text,
      secondary: 'rgba(93, 64, 55, 0.7)',
    },
  },
  typography: {
    fontFamily: "'Lato', sans-serif",
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
      color: palette.text,
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      color: palette.text,
    },
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
      borderRadius: '20px', 
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 10px 30px -5px rgba(230, 164, 180, 0.2)', 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
            color: '#fff',
        }
      }
    }
  },
});