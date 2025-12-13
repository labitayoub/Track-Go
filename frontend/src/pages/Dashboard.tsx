import { useAuth } from '../context/AuthContext';
import { Box, Typography, Card, Avatar, Button, Chip, CircularProgress } from '@mui/material';
import { People, LocalShipping, Route, DirectionsCar, Warning, RvHookup, TireRepair } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { camionAPI, remorqueAPI, adminAPI, trajetAPI, pneuAPI } from '../services/api';

interface VehiculeCritique {
    vehiculeId: string;
    vehiculeType: 'camion' | 'remorque';
    immatriculation: string;
    pneus: Array<{ position: string; marque: string; _id: string }>;
}

interface Stats {
    camions: number;
    chauffeurs: number;
    trajetsActifs: number;
    alertes: number;
}

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<Stats>({ camions: 0, chauffeurs: 0, trajetsActifs: 0, alertes: 0 });
    const [vehiculesCritiques, setVehiculesCritiques] = useState<VehiculeCritique[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Load all data in parallel
            const [camionsRes, remorquesRes, chauffeursRes, trajetsRes, critiquesRes] = await Promise.all([
                camionAPI.getAll(),
                remorqueAPI.getAll(),
                user?.role === 'admin' ? adminAPI.getChauffeurs() : Promise.resolve({ data: [] }),
                user?.role === 'admin' ? trajetAPI.getAll() : trajetAPI.getMyTrajets(),
                pneuAPI.getCritiques()
            ]);

            const camions = camionsRes.data;
            const remorques = remorquesRes.data;
            const chauffeurs = chauffeursRes.data || [];
            const trajets = trajetsRes.data || [];
            const critiques: VehiculeCritique[] = critiquesRes.data || [];

            console.log('Critiques reçus:', critiques);

            // Count active trajets
            const trajetsActifs = trajets.filter((t: any) => t.statut === 'a_faire' || t.statut === 'en_cours').length;

            setVehiculesCritiques(critiques);
            setStats({
                camions: camions.length,
                chauffeurs: chauffeurs.length,
                trajetsActifs,
                alertes: critiques.length
            });
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

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
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                {loading ? <CircularProgress size={24} /> : stats.camions}
                            </Typography>
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
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                {loading ? <CircularProgress size={24} /> : stats.chauffeurs}
                            </Typography>
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
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                {loading ? <CircularProgress size={24} /> : stats.trajetsActifs}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Trajets actifs</Typography>
                        </Box>
                    </Box>
                </Card>
                <Card sx={{ 
                    p: 3, 
                    border: stats.alertes > 0 ? '2px solid #f44336' : '1px solid #e0e0e0', 
                    boxShadow: stats.alertes > 0 ? '0 0 10px rgba(244, 67, 54, 0.3)' : 'none', 
                    borderRadius: 3,
                    bgcolor: stats.alertes > 0 ? '#fff5f5' : 'white'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                            bgcolor: stats.alertes > 0 ? '#f44336' : '#fce4ec', 
                            color: stats.alertes > 0 ? 'white' : '#c2185b', 
                            width: 48, 
                            height: 48,
                            animation: stats.alertes > 0 ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.1)' },
                                '100%': { transform: 'scale(1)' }
                            }
                        }}>
                            <Warning />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: stats.alertes > 0 ? '#f44336' : '#1a1a1a' }}>
                                {loading ? <CircularProgress size={24} /> : stats.alertes}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Alertes pneus</Typography>
                        </Box>
                    </Box>
                </Card>
            </Box>

            {/* Section Alertes Urgentes - Pneus Critiques */}
            {vehiculesCritiques.length > 0 && (
                <Card sx={{ 
                    p: 3, 
                    mb: 4, 
                    border: '2px solid #f44336', 
                    borderRadius: 3,
                    bgcolor: '#fff8f8'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar sx={{ bgcolor: '#f44336', color: 'white' }}>
                            <TireRepair />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                                🚨 Alertes Urgentes - Pneus Critiques
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {vehiculesCritiques.length} véhicule(s) nécessitent un remplacement de pneus immédiat
                            </Typography>
                        </Box>
                        <Button 
                            variant="contained" 
                            color="error"
                            startIcon={<TireRepair />}
                            onClick={() => navigate('/pneus')}
                            sx={{ borderRadius: 2 }}
                        >
                            Gérer les pneus
                        </Button>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                        {vehiculesCritiques.map((vehicule, index) => (
                            <Card 
                                key={index} 
                                sx={{ 
                                    p: 2, 
                                    border: '1px solid #ffcdd2',
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)'
                                    }
                                }}
                                onClick={() => navigate('/pneus')}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ 
                                        bgcolor: vehicule.vehiculeType === 'camion' ? '#e3f2fd' : '#f3e5f5',
                                        color: vehicule.vehiculeType === 'camion' ? '#1976d2' : '#9c27b0'
                                    }}>
                                        {vehicule.vehiculeType === 'camion' ? <LocalShipping /> : <RvHookup />}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {vehicule.immatriculation}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {vehicule.vehiculeType === 'camion' ? 'Camion' : 'Remorque'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Chip 
                                            label={`${vehicule.pneus.length} pneu(s)`}
                                            color="error"
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#666' }}>
                                            {vehicule.pneus.map(p => p.position).join(', ')}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </Card>
            )}

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