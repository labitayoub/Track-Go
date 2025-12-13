import { useAuth } from '../context/AuthContext';
import { Box, Typography, Card, Avatar, Button, Chip, CircularProgress, Alert } from '@mui/material';
import { People, LocalShipping, Route, Warning, RvHookup, TireRepair, Build } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { camionAPI, remorqueAPI, adminAPI, trajetAPI, pneuAPI, maintenanceAPI } from '../services/api';

interface VehiculeCritique {
    vehiculeId: string;
    vehiculeType: 'camion' | 'remorque';
    immatriculation: string;
    pneus: Array<{ position: string; marque: string; _id: string }>;
}

interface MaintenanceStats {
    total: number;
    planifiees: number;
    terminees: number;
    enRetard: number;
    aVenir: number;
}

interface Stats {
    camions: number;
    chauffeurs: number;
    remorques: number;
    trajetsActifs: number;
    alertes: number;
    maintenanceEnRetard: number;
}

interface ChauffeurVehicle {
    camionImmat: string;
    camionMarque: string;
    remorqueImmat?: string;
    trajetDepart: string;
    trajetArrivee: string;
    trajetStatut: string;
}

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<Stats>({ camions: 0, chauffeurs: 0, remorques: 0, trajetsActifs: 0, alertes: 0, maintenanceEnRetard: 0 });
    const [vehiculesCritiques, setVehiculesCritiques] = useState<VehiculeCritique[]>([]);
    const [chauffeurVehicles, setChauffeurVehicles] = useState<ChauffeurVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Chargement des données du dashboard...');

            const isAdmin = user?.role === 'admin';

            // Load data based on user role
            if (isAdmin) {
                // Admin loads all data
                const [camionsRes, remorquesRes, chauffeursRes, trajetsRes, critiquesRes, maintenanceStatsRes] = await Promise.all([
                    camionAPI.getAll(),
                    remorqueAPI.getAll(),
                    adminAPI.getChauffeurs(),
                    trajetAPI.getAll(),
                    pneuAPI.getCritiques(),
                    maintenanceAPI.getStats()
                ]);

                const maintenanceStats: MaintenanceStats = maintenanceStatsRes.data || { enRetard: 0, aVenir: 0 };
                const camions = camionsRes.data;
                const remorques = remorquesRes.data;
                const chauffeurs = chauffeursRes.data?.chauffeurs || chauffeursRes.data || [];
                const trajets = trajetsRes.data || [];
                const critiques: VehiculeCritique[] = critiquesRes.data || [];
                const trajetsActifs = trajets.filter((t: any) => t.statut === 'a_faire' || t.statut === 'en_cours').length;

                setVehiculesCritiques(critiques);
                setStats({
                    camions: camions.length,
                    chauffeurs: chauffeurs.length,
                    remorques: remorques.length,
                    trajetsActifs,
                    alertes: critiques.length,
                    maintenanceEnRetard: maintenanceStats.enRetard
                });
            } else {
                // Chauffeur loads only their own data
                const [trajetsRes, critiquesRes] = await Promise.all([
                    trajetAPI.getMyTrajets(),
                    pneuAPI.getCritiques()
                ]);

                const trajets = trajetsRes.data || [];
                const critiquesAll: VehiculeCritique[] = critiquesRes.data || [];

                const trajetsActifs = trajets.filter((t: any) => t.statut === 'a_faire' || t.statut === 'en_cours');

                // Get IDs of chauffeur's vehicles
                const chauffeurVehicleIds = new Set<string>();
                trajetsActifs.forEach((t: any) => {
                    if (t.camionId?._id) chauffeurVehicleIds.add(t.camionId._id);
                    if (t.remorqueId?._id) chauffeurVehicleIds.add(t.remorqueId._id);
                });

                // Filter critical alerts for these vehicles
                const chauffeurCritiques = critiquesAll.filter(c => chauffeurVehicleIds.has(c.vehiculeId));

                // Extract vehicle info from chauffeur's active trajets
                const vehicles: ChauffeurVehicle[] = trajetsActifs.map((t: any) => ({
                    camionImmat: t.camionId?.immatriculation || 'N/A',
                    camionMarque: t.camionId?.marque || '',
                    remorqueImmat: t.remorqueId?.immatriculation || undefined,
                    trajetDepart: t.depart,
                    trajetArrivee: t.arrivee,
                    trajetStatut: t.statut
                }));

                setVehiculesCritiques(chauffeurCritiques);
                setChauffeurVehicles(vehicles);
                setStats({
                    camions: new Set(trajetsActifs.map((t: any) => t.camionId?._id)).size,
                    chauffeurs: 0,
                    remorques: new Set(trajetsActifs.filter((t: any) => t.remorqueId).map((t: any) => t.remorqueId?._id)).size,
                    trajetsActifs: trajetsActifs.length,
                    alertes: chauffeurCritiques.length,
                    maintenanceEnRetard: 0
                });
            }

            console.log('Dashboard chargé avec succès');
        } catch (error: any) {
            console.error('Erreur chargement dashboard:', error);
            setError(error?.message || 'Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 0 }}>
            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 3, mb: 4 }}>
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
                <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#f3e5f5', color: '#9c27b0', width: 48, height: 48 }}>
                            <RvHookup />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                {loading ? <CircularProgress size={24} /> : stats.remorques}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Remorques</Typography>
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
                <Card sx={{
                    p: 3,
                    border: stats.maintenanceEnRetard > 0 ? '2px solid #ff9800' : '1px solid #e0e0e0',
                    boxShadow: stats.maintenanceEnRetard > 0 ? '0 0 10px rgba(255, 152, 0, 0.3)' : 'none',
                    borderRadius: 3,
                    bgcolor: stats.maintenanceEnRetard > 0 ? '#fff8e1' : 'white'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: stats.maintenanceEnRetard > 0 ? '#ff9800' : '#e8f5e9',
                            color: stats.maintenanceEnRetard > 0 ? 'white' : '#388e3c',
                            width: 48,
                            height: 48
                        }}>
                            <Build />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: stats.maintenanceEnRetard > 0 ? '#ff9800' : '#1a1a1a' }}>
                                {loading ? <CircularProgress size={24} /> : stats.maintenanceEnRetard}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Maintenance en retard</Typography>
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
                    {/* Gestion de flotte */}
                    <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                                <LocalShipping />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>Gestion de flotte</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {loading ? '...' : `${stats.camions} Camions • ${stats.remorques} Remorques`}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate('/camions')}
                                sx={{ borderRadius: 2 }}
                            >
                                Camions
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate('/remorques')}
                                sx={{ borderRadius: 2 }}
                            >
                                Remorques
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                color="warning"
                                onClick={() => navigate('/maintenance')}
                                sx={{ ml: 'auto' }}
                            >
                                Maintenance
                            </Button>
                        </Box>
                    </Card>

                    {/* Équipe */}
                    <Card sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }}>
                                <People />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>Équipe</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {loading ? '...' : `${stats.chauffeurs} Chauffeurs actifs`}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate('/chauffeurs')}
                                sx={{ borderRadius: 2 }}
                            >
                                Gérer les chauffeurs
                            </Button>
                        </Box>
                    </Card>
                </Box>
            )}

            {/* Chauffeur Content */}
            {user?.role === 'chauffeur' && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>Mes Véhicules Assignés</Typography>

                    {chauffeurVehicles.length === 0 ? (
                        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5', border: 'none', boxShadow: 'none' }}>
                            <Typography color="text.secondary">Aucun véhicule assigné pour le moment.</Typography>
                        </Card>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                            {chauffeurVehicles.map((vehicle, index) => (
                                <Card key={index} sx={{ p: 3, border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 56, height: 56 }}>
                                                <LocalShipping fontSize="large" />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {vehicle.camionImmat}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {vehicle.camionMarque}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={vehicle.trajetStatut === 'en_cours' ? 'En cours' : 'À faire'}
                                            color={vehicle.trajetStatut === 'en_cours' ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 2, mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Route fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                <strong>Trajet:</strong> {vehicle.trajetDepart} → {vehicle.trajetArrivee}
                                            </Typography>
                                        </Box>
                                        {vehicle.remorqueImmat && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <RvHookup fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    <strong>Remorque:</strong> {vehicle.remorqueImmat}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<Warning />}
                                        onClick={() => navigate('/pneus')}
                                        color="error"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Signaler un problème pneu
                                    </Button>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;