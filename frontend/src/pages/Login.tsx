import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Alert, 
    Paper, 
    CircularProgress 
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Erreur');
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#f5f5f5'
        }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <LoginIcon sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                        Connexion
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track Go - Gestion de Transport
                    </Typography>
                </Box>
                
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        type="password"
                        label="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        size="large"
                        sx={{ py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
                    </Button>
                </form>
                
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
                    Pas de compte ?{' '}
                    <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                        S'inscrire comme chauffeur
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Login;

