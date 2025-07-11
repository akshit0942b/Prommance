import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Alert, CircularProgress, List, Paper, IconButton, Card, CardContent, Grid, Divider, Avatar, ListItem, ListItemText, ListItemIcon, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const MatchPairCard = ({ match, profiles, onDelete }) => {
    const profileA = profiles.find(p => p._id === match.profileA_id);
    const profileB = profiles.find(p => p._id === match.profileB_id);
    if (!profileA || !profileB) return null; 
    return (
        <Card sx={{ mb: 3 }} variant="outlined"><CardContent><Grid container alignItems="center" spacing={2}><Grid item xs={12} md={5}><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar sx={{ bgcolor: 'secondary.main' }}>{profileA.name.charAt(0)}</Avatar><Box sx={{ flexGrow: 1 }}><Typography variant="h6">{profileA.name}</Typography><Typography variant="body2" color="text.secondary">{profileA.gender}, prefers {profileA.preferredPartner}</Typography></Box><IconButton onClick={() => onDelete(profileA._id)} size="small" aria-label={`Delete ${profileA.name}`}><DeleteIcon fontSize="small" /></IconButton></Box></Grid><Grid item xs={12} md={2} sx={{ textAlign: 'center' }}><FavoriteIcon color="primary" sx={{ fontSize: 30 }} /><Typography variant="h5" color="primary">{match.score}%</Typography><Typography variant="caption">Compatibility</Typography></Grid><Grid item xs={12} md={5}><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar sx={{ bgcolor: 'secondary.main' }}>{profileB.name.charAt(0)}</Avatar><Box sx={{ flexGrow: 1 }}><Typography variant="h6">{profileB.name}</Typography><Typography variant="body2" color="text.secondary">{profileB.gender}, prefers {profileB.preferredPartner}</Typography></Box><IconButton onClick={() => onDelete(profileB._id)} size="small" aria-label={`Delete ${profileB.name}`}><DeleteIcon fontSize="small" /></IconButton></Box></Grid><Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="body2"><strong>AI Reasoning:</strong> {match.reasoning}</Typography></Grid></Grid></CardContent></Card>
    );
};

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');

    const [profiles, setProfiles] = useState([]);
    const [displayMatches, setDisplayMatches] = useState([]);
    const [unmatchedProfiles, setUnmatchedProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMatching, setIsMatching] = useState(false);
    const [error, setError] = useState('');
    const [matchResult, setMatchResult] = useState(null);

    useEffect(() => {
        const storedKey = sessionStorage.getItem('admin-secret-key');
        if (storedKey && storedKey === process.env.REACT_APP_ADMIN_SECRET_KEY) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfiles();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');
        if(passwordInput === process.env.REACT_APP_ADMIN_SECRET_KEY) 
        {
            sessionStorage.setItem('admin-secret-key', passwordInput);
            setIsAuthenticated(true);
        } 
        else
        {
            setLoginError('Incorrect password.');
        }
    };

    useEffect(() => { if (profiles.length === 0) { setDisplayMatches([]); setUnmatchedProfiles([]); return; }; const processedPairs = new Set(); const matches = []; const matchedProfileIds = new Set(); profiles.forEach(profile => { if (profile.matches && profile.matches.length > 0) { profile.matches.forEach(match => { const pairKey = [profile._id, match.profileId].sort().join('-'); if (!processedPairs.has(pairKey)) { matches.push({ pairKey, profileA_id: profile._id, profileB_id: match.profileId, score: match.compatibilityScore, reasoning: match.reasoning }); processedPairs.add(pairKey); matchedProfileIds.add(profile._id); matchedProfileIds.add(match.profileId); } }); } }); const unmatched = profiles.filter(p => !matchedProfileIds.has(p._id)); setDisplayMatches(matches); setUnmatchedProfiles(unmatched); }, [profiles]);
    
    const getAuthHeaders = () => ({
        'x-admin-secret-key': sessionStorage.getItem('admin-secret-key')
    });
    
    const fetchProfiles = async () => { setIsLoading(true); setError(''); try { const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/profiles`, { headers: getAuthHeaders() }); setProfiles(response.data); } catch (err) { console.error(err); setError('Failed to fetch profiles. Are you logged in?'); } setIsLoading(false); };
    const handleMatchmaking = async () => { setIsMatching(true); setError(''); setMatchResult(null); try { const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/matchmake`, {}, { headers: getAuthHeaders() }); setMatchResult(response.data); fetchProfiles(); } catch (err) { console.error(err); setError('Matchmaking failed.'); } setIsMatching(false); };
    const handleDeleteProfile = async (profileId) => { try { await axios.delete(`${process.env.REACT_APP_API_URL}/admin/profiles/${profileId}`, { headers: getAuthHeaders() }); fetchProfiles(); } catch (err) { console.error(err); setError('Failed to delete profile.'); } };

    if (!isAuthenticated) 
    {
        return(
            <Paper elevation={6} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
                <Box component="form" onSubmit={handleLogin}>
                    <Typography variant="h5" gutterBottom align="center">Admin Access</Typography>
                    <TextField
                        label="Password"
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    {loginError && <Alert severity="error" sx={{ mt: 1 }}>{loginError}</Alert>}
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                </Box>
            </Paper>
        );
    }
    
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Admin Panel</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}><Typography variant="h5" sx={{ mb: 1 }}>Magic happens here</Typography><Typography color="text.secondary" sx={{ mb: 2 }}></Typography><Button variant="contained" color="primary" onClick={handleMatchmaking} disabled={isMatching || isLoading} size="large">{isMatching ? <CircularProgress size={24} color="inherit" /> : 'Run Matchmaking'}</Button></Paper>
            {matchResult && <Alert severity="success" sx={{ mb: 4 }}>{matchResult.message}</Alert>}
            <Typography variant="h5" gutterBottom>Generated Matches ({displayMatches.length})</Typography>
            {isLoading ? <CircularProgress /> : (displayMatches.length > 0 ? (displayMatches.map(match => <MatchPairCard key={match.pairKey} match={match} profiles={profiles} onDelete={handleDeleteProfile} />)) : (<Typography sx={{ p: 3, textAlign: 'center', fontStyle: 'italic' }}>No matches have been generated yet.</Typography>))}
            <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>Unmatched Profiles ({unmatchedProfiles.length})</Typography>
            {isLoading ? <CircularProgress /> : (unmatchedProfiles.length > 0 ? (<Paper elevation={2}><List>{unmatchedProfiles.map(profile => (<ListItem key={profile._id} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProfile(profile._id)}><DeleteIcon /></IconButton>}><ListItemIcon><PersonOffIcon /></ListItemIcon><ListItemText primary={profile.name} secondary={`${profile.gender}, prefers ${profile.preferredPartner}`} /></ListItem>))}</List></Paper>) : (<Typography sx={{ p: 3, textAlign: 'center', fontStyle: 'italic' }}>All profiles have been matched!</Typography>))}
        </Box>
    );
};

export default AdminDashboard;












