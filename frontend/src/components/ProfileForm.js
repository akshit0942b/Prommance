import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Typography, Alert, Paper, Grid, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import SvgBalloon from './SvgBalloon'; 
import TextPressure from './TextPressure';

const ProfileForm = () => {
    const [balloonData, setBalloonData] = useState(null);
    const [formData, setFormData] = useState({ name: '', gender: 'Female', bio: '', movies: '', weekendActivity: '', music: '', sports: '', isIntrovert: 'true', textingStyle: '', preferredPartner: 'Male' });
    const [status, setStatus] = useState({ message: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });
        if (!formData.name.trim()) {
            setStatus({ message: 'Please enter your name.', type: 'error' });
            return;
        }
        try {
            const submissionData = { ...formData, isIntrovert: formData.isIntrovert === 'true' };
            await axios.post(`${process.env.REACT_APP_API_URL}/profiles`, submissionData);
            const textLines = [`Thank you,`, formData.name, `Profile Submitted!`];
            setBalloonData({ textLines });
            setFormData({ name: '', gender: 'Female', bio: '', movies: '', weekendActivity: '', music: '', sports: '', isIntrovert: 'true', textingStyle: '', preferredPartner: 'Male' });
            setTimeout(() => { setBalloonData(null); }, 10000);
        } catch (error) {
            setStatus({ message: 'Failed to submit profile. Please try again.', type: 'error' });
            console.error(error);
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, duration: 0.5 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <>
            {balloonData && <SvgBalloon textLines={balloonData.textLines} />}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, maxWidth: 800, mx: 'auto' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <motion.div variants={itemVariants}>
                            <Box sx={{ height: 120, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TextPressure text="Your Perfect Match" stroke={true} textColor="#5D4037" strokeColor="#E6A4B4" width={true} weight={true} italic={true} minFontSize={32} />
                            </Box>
                            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                                Fill out your profile to discover a meaningful connection.
                            </Typography>
                        </motion.div>
                        {status.type === 'error' && <Alert severity="error" sx={{ mb: 2 }}>{status.message}</Alert>}
                        <Grid container spacing={4}>
                            <Grid item xs={12} component={motion.div} variants={itemVariants}><TextField name="name" label="Full Name" value={formData.name} onChange={handleChange} required fullWidth /></Grid>
                            <Grid item xs={12} component={motion.div} variants={itemVariants}><TextField name="bio" label="About You" value={formData.bio} onChange={handleChange} multiline rows={3} required fullWidth helperText="Share a little about your personality, passions, and what you're looking for."/></Grid>
                            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                            <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}><FormControl component="fieldset"><FormLabel component="legend">Your Gender</FormLabel><RadioGroup row name="gender" value={formData.gender} onChange={handleChange}><FormControlLabel value="Female" control={<Radio />} label="Female" /><FormControlLabel value="Male" control={<Radio />} label="Male" /></RadioGroup></FormControl></Grid>
                            <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}><FormControl component="fieldset"><FormLabel component="legend">You're Interested In</FormLabel><RadioGroup row name="preferredPartner" value={formData.preferredPartner} onChange={handleChange}><FormControlLabel value="Female" control={<Radio />} label="Female" /><FormControlLabel value="Male" control={<Radio />} label="Male" /></RadioGroup></FormControl></Grid>
                            <Grid item xs={12} component={motion.div} variants={itemVariants}><FormControl component="fieldset"><FormLabel component="legend">Your Personality Style</FormLabel><RadioGroup row name="isIntrovert" value={formData.isIntrovert} onChange={handleChange}><FormControlLabel value="true" control={<Radio />} label="Introvert" /><FormControlLabel value="false" control={<Radio />} label="Extrovert" /></RadioGroup></FormControl></Grid>
                            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                            <Grid item xs={12} component={motion.div} variants={itemVariants}><Typography variant="h5">Your Interests</Typography></Grid>
                            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField name="movies" label="Favorite Movies/Shows" value={formData.movies} onChange={handleChange} fullWidth/></Grid>
                            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField name="music" label="Favorite Music" value={formData.music} onChange={handleChange} fullWidth/></Grid>
                            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField name="weekendActivity" label="Ideal Weekend" value={formData.weekendActivity} onChange={handleChange} fullWidth/></Grid>
                            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField name="textingStyle" label="Texting Style" value={formData.textingStyle} onChange={handleChange} fullWidth/></Grid>
                            <Grid item xs={12} component={motion.div} variants={itemVariants}><Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: 2, py: 1.5 }}>Find My Match</Button></Grid>
                        </Grid>
                    </Box>
                </Paper>
            </motion.div>
        </>
    );
};

export default ProfileForm;











