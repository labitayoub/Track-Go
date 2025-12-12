import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    People,
    LocalShipping,
    Route,
    DirectionsCar,
    TrendingUp,
    CheckCircle,
} from '@mui/icons-material';

interface Chauffeur {
    _id: string;
    nom: string;
    email: string;
    telephone: string;
    isActive: boolean;
    createdAt: string;
}

// Stat Card Component
const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', height: '100%' }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const DashboardPage = () => {
    const { user } = useAuth();
    const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.role === 'admin') {
            loadChauffeurs();
        }
    }, [user]);

    const loadChauffeurs = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getChauffeurs();
            setChauffeurs(res.data.chauffeurs);
        } catch (error) {
            console.error('Erreur chargement chauffeurs');
        }
        setLoading(false);
    };

    const toggleStatus = async (id: string) => {
        try {
            await adminAPI.toggleChauffeurStatus(id);
            loadChauffeurs();
        } catch (error) {
            console.error('Erreur toggle status');
        }
    };

    const activeCount = chauffeurs.filter(c => c.isActive).length;

    return (
        <Box>
            {/* Welcome Message */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    Bienvenue, {user?.nom} 👋
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    {user?.role === 'admin'
                        ? 'Gérez votre flotte et vos chauffeurs depuis ce tableau de bord.'
                        : 'Consultez vos trajets et informations véhicule.'}
                </Typography>
            </Box>

            {/* Admin Stats Cards */}
            {user?.role === 'admin' && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Total Chauffeurs"
                            value={chauffeurs.length}
                            icon={<People sx={{ color: 'white' }} />}
                            color="#3b82f6"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Chauffeurs Actifs"
                            value={activeCount}
                            icon={<CheckCircle sx={{ color: 'white' }} />}
                            color="#22c55e"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Camions"
                            value="--"
                            icon={<LocalShipping sx={{ color: 'white' }} />}
                            color="#f59e0b"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Trajets ce mois"
                            value="--"
                            icon={<TrendingUp sx={{ color: 'white' }} />}
                            color="#8b5cf6"
                        />
                    </Grid>
                </Grid>
            )}

            {/* Admin Content - Chauffeurs Table */}
            {user?.role === 'admin' && (
                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <People sx={{ color: '#3b82f6' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            Gestion des Chauffeurs
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : chauffeurs.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <People sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                            <Typography sx={{ color: '#64748b' }}>
                                Aucun chauffeur inscrit
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Nom</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Téléphone</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#475569' }} align="center">Statut</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#475569' }} align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {chauffeurs.map((c) => (
                                        <TableRow key={c._id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{c.nom}</TableCell>
                                            <TableCell sx={{ color: '#64748b' }}>{c.email}</TableCell>
                                            <TableCell sx={{ color: '#64748b' }}>{c.telephone}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={c.isActive ? 'Actif' : 'Inactif'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: c.isActive ? '#dcfce7' : '#fee2e2',
                                                        color: c.isActive ? '#16a34a' : '#dc2626',
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => toggleStatus(c._id)}
                                                    sx={{
                                                        textTransform: 'none',
                                                        borderColor: c.isActive ? '#fbbf24' : '#22c55e',
                                                        color: c.isActive ? '#d97706' : '#16a34a',
                                                        '&:hover': {
                                                            bgcolor: c.isActive ? '#fffbeb' : '#f0fdf4',
                                                        },
                                                    }}
                                                >
                                                    {c.isActive ? 'Désactiver' : 'Activer'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            )}

            {/* Chauffeur Content */}
            {user?.role === 'chauffeur' && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <Route sx={{ color: '#3b82f6' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        Mes Trajets
                                    </Typography>
                                </Box>
                                <List disablePadding>
                                    <ListItem
                                        sx={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 2,
                                            mb: 1,
                                            '&:hover': { bgcolor: '#f8fafc' },
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Route sx={{ color: '#22c55e' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Voir tous mes trajets"
                                            secondary="Consultez l'historique de vos trajets"
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <DirectionsCar sx={{ color: '#22c55e' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        Mon Véhicule
                                    </Typography>
                                </Box>
                                <List disablePadding>
                                    <ListItem
                                        sx={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 2,
                                            '&:hover': { bgcolor: '#f8fafc' },
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <ListItemIcon>
                                            <LocalShipping sx={{ color: '#f59e0b' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Informations véhicule"
                                            secondary="Détails de votre véhicule assigné"
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default DashboardPage;
