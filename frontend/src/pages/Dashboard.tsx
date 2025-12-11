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
    AppBar,
    Toolbar,
    Container,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Logout,
    People,
    LocalShipping,
    Route,
    DirectionsCar,
} from '@mui/icons-material';

interface Chauffeur {
    _id: string;
    nom: string;
    email: string;
    telephone: string;
    isActive: boolean;
    createdAt: string;
}

const Dashboard = () => {
    const { logout, user } = useAuth();
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

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* AppBar */}
            <AppBar position="static">
                <Toolbar>
                    <LocalShipping sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Track Go
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">{user?.nom}</Typography>
                            <Chip
                                label={user?.role}
                                size="small"
                                color={user?.role === 'admin' ? 'error' : 'success'}
                            />
                        </Box>
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<Logout />}
                            onClick={logout}
                        >
                            Déconnexion
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Welcome */}
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    Bienvenue, {user?.nom}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {user?.role === 'admin' 
                        ? 'Gérez vos chauffeurs et votre flotte' 
                        : 'Consultez vos trajets et véhicules'}
                </Typography>

                {/* Admin Content */}
                {user?.role === 'admin' && (
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <People color="primary" />
                            <Typography variant="h5" fontWeight="600">
                                Gestion des Chauffeurs
                            </Typography>
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : chauffeurs.length === 0 ? (
                            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Aucun chauffeur inscrit
                            </Typography>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#1976d2' }}>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nom</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Téléphone</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Statut</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {chauffeurs.map((c) => (
                                            <TableRow key={c._id} hover>
                                                <TableCell>{c.nom}</TableCell>
                                                <TableCell>{c.email}</TableCell>
                                                <TableCell>{c.telephone}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={c.isActive ? 'Actif' : 'Inactif'}
                                                        color={c.isActive ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color={c.isActive ? 'warning' : 'success'}
                                                        onClick={() => toggleStatus(c._id)}
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
                    <Card elevation={2}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocalShipping color="success" />
                                <Typography variant="h5" fontWeight="600">
                                    Espace Chauffeur
                                </Typography>
                            </Box>
                            <List>
                                <ListItem sx={{ '&:hover': { bgcolor: '#f5f5f5' }, borderRadius: 1, cursor: 'pointer' }}>
                                    <ListItemIcon>
                                        <Route color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Mes trajets" 
                                        secondary="Consultez et gérez vos trajets"
                                    />
                                </ListItem>
                                <ListItem sx={{ '&:hover': { bgcolor: '#f5f5f5' }, borderRadius: 1, cursor: 'pointer' }}>
                                    <ListItemIcon>
                                        <DirectionsCar color="success" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Mon véhicule" 
                                        secondary="Informations sur votre véhicule assigné"
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Box>
    );
};

export default Dashboard;

