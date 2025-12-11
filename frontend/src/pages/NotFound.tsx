import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { SentimentVeryDissatisfied, Home } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f5f5f5'
    }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <SentimentVeryDissatisfied sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
        <Typography variant="h1" fontWeight="bold" sx={{ mb: 1 }}>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Page non trouvée
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
          size="large"
        >
          Retour à l'accueil
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;

