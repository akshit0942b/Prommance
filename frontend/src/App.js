import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, ThemeProvider, CssBaseline, Box } from '@mui/material';
import ProfileForm from './components/ProfileForm';
import AdminDashboard from './components/AdminDashboard';
import VantaBackground from './components/VantaBackground';
import { romanceTheme } from './theme';
import './App.css';
import { motion } from 'framer-motion';

const appBarVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.2, when: "beforeChildren", staggerChildren: 0.2, }, }, };
const navItemVariants = { hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 }, }, };

const AnimatedNavButton = ({ to, children }) => {
  return (
    <motion.div variants={navItemVariants}>
      <Button component={RouterLink} to={to} color="inherit" sx={{ position: 'relative', overflow: 'hidden', '&::after': { content: '""', position: 'absolute', bottom: 4, left: '-100%', width: '100%', height: '2px', backgroundColor: 'primary.main', transition: 'left 0.3s ease-in-out', }, '&:hover::after': { left: '0%', }, }}>
        {children}
      </Button>
    </motion.div>
  );
};

function App() {
  return (
    <ThemeProvider theme={romanceTheme}>
      <CssBaseline />
      <VantaBackground>
        <Router>
          <motion.div variants={appBarVariants} initial="hidden" animate="visible">
            <AppBar position="static" color="transparent" elevation={0} sx={{ p: 1 }}>
              <Toolbar>
                <motion.div variants={navItemVariants} style={{ flexGrow: 1 }}>
                    <Typography component={RouterLink} to="/" variant="h5" sx={{ color: 'text.primary', textDecoration: 'none', transition: 'text-shadow 0.3s ease', '&:hover': { textShadow: `0 0 10px ${romanceTheme.palette.primary.main}`, }, }}>
                      Prommance
                    </Typography>
                </motion.div>
                <AnimatedNavButton to="/">Create Profile</AnimatedNavButton>
                <AnimatedNavButton to="/admin">Admin Panel</AnimatedNavButton>
              </Toolbar>
            </AppBar>
          </motion.div>
          <Container sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<ProfileForm />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Container>
        </Router>
        <Box sx={{ position: 'fixed', bottom: 15, right: 20, zIndex: 1, textAlign: 'right', color: romanceTheme.palette.background.default, fontSize: '1rem', fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)', pointerEvents: 'none' }}>
          Credits - Akshit,
          <br />
          THE DANCE CREW
        </Box>
      </VantaBackground>
    </ThemeProvider>
  );
}

export default App;