import { useAuth } from '../context/AuthContext';
import { Box, Typography, Card, Avatar, Button } from '@mui/material';
import { People, LocalShipping, Route, DirectionsCar, Warning } from '@mui/icons-material';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <Box sx={{ p: 0 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 300, mb: 1, color: '#1a1a1a' }}>
                    Bonjour, {user?.nom}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
                    {user?.role === 'admin' ? 'Tableau de bord administrateur' : 'Votre espace de travail'}
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 48, height: 48 }}>
                            <LocalShipping />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>12</Typography>
                            <Typography variant="body2" color="text.secondary">Camions</Typography>
                        </Box>
                    </Box>
                </Card>
                <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', width: 48, height: 48 }}>
                            <People />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>8</Typography>
                            <Typography variant="body2" color="text.secondary">Chauffeurs</Typography>
                        </Box>
                    </Box>
                </Card>
                <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#fff3e0', color: '#f57c00', width: 48, height: 48 }}>
                            <Route />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>24</Typography>
                            <Typography variant="body2" color="text.secondary">Trajets actifs</Typography>
                        </Box>
                    </Box>
                </Card>
                <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#fce4ec', color: '#c2185b', width: 48, height: 48 }}>
                            <Warning />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>3</Typography>
                            <Typography variant="body2" color="text.secondary">Alertes</Typography>
                        </Box>
                    </Box>
                </Card>
            </Box>

            {/* Admin Content */}
            {user?.role === 'admin' && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                                <LocalShipping />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>Gestion de flotte</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Gérez vos camions, remorques et maintenance
                        </Typography>
                        <Button variant="outlined" sx={{ borderRadius: 2 }}>Voir la flotte</Button>
                    </Card>
                    <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }}>
                                <People />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>Équipe</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Gérez vos chauffeurs et leurs affectations
                        </Typography>
                        <Button variant="outlined" sx={{ borderRadius: 2 }}>Voir les chauffeurs</Button>
                    </Card>
                </Box>
            )}

            {/* Chauffeur Content */}
            {user?.role === 'chauffeur' && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                                <Route />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>Mes trajets</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Consultez et gérez vos trajets assignés
                        </Typography>
                        <Button variant="outlined" sx={{ borderRadius: 2 }}>Voir les trajets</Button>
                    </Card>
                    <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }}>
                                <DirectionsCar />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>Mon véhicule</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Informations sur votre véhicule assigné
                        </Typography>
                        <Button variant="outlined" sx={{ borderRadius: 2 }}>Voir le véhicule</Button>
                    </Card>
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
