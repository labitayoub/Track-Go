import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
    Box,
    Button,
    Typography,
    Chip,
    CircularProgress,
    Card,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery,
    useTheme,
    Stack,
} from '@mui/material';
import {
    People,
    Phone,
    Email,
} from '@mui/icons-material';

interface Chauffeur {
    _id: string;
    nom: string;
    email: string;
    telephone: string;
    isActive: boolean;
    createdAt: string;
}

const Chauffeurs = () => {
    const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        loadChauffeurs();
    }, []);

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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 500, mb: 1, color: '#1a1a1a' }}>
                    Gestion des chauffeurs
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    {chauffeurs.length} chauffeur{chauffeurs.length > 1 ? 's' : ''} enregistré{chauffeurs.length > 1 ? 's' : ''}
                </Typography>
            </Box>

            {/* Content */}
            {chauffeurs.length === 0 ? (
                <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <People sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Aucun chauffeur enregistré
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Les chauffeurs apparaîtront ici une fois inscrits
                        </Typography>
                    </Box>
                </Card>
            ) : isMobile ? (
                // Version mobile
                <Stack spacing={2}>
                    {chauffeurs.map((chauffeur) => (
                        <Card key={chauffeur._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                <Avatar sx={{ 
                                    bgcolor: chauffeur.isActive ? '#e8f5e8' : '#ffebee', 
                                    color: chauffeur.isActive ? '#2e7d32' : '#d32f2f',
                                    width: 48,
                                    height: 48
                                }}>
                                    {chauffeur.nom.charAt(0)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                                        {chauffeur.nom}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Email sx={{ fontSize: 16, color: '#666' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {chauffeur.email}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Phone sx={{ fontSize: 16, color: '#666' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {chauffeur.telephone}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Inscrit le {new Date(chauffeur.createdAt).toLocaleDateString('fr-FR')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Chip
                                    label={chauffeur.isActive ? 'Actif' : 'Inactif'}
                                    color={chauffeur.isActive ? 'success' : 'error'}
                                    size="small"
                                    variant="outlined"
                                />
                                <Button
                                    variant={chauffeur.isActive ? 'outlined' : 'contained'}
                                    size="small"
                                    color={chauffeur.isActive ? 'error' : 'success'}
                                    onClick={() => toggleStatus(chauffeur._id)}
                                    sx={{ borderRadius: 2, minWidth: 90 }}
                                >
                                    {chauffeur.isActive ? 'Désactiver' : 'Activer'}
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            ) : (
                // Version desktop
                <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#fafafa' }}>
                                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', py: 2 }}>Chauffeur</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', py: 2 }}>Contact</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', py: 2 }}>Inscription</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', py: 2 }} align="center">Statut</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {chauffeurs.map((chauffeur) => (
                                    <TableRow 
                                        key={chauffeur._id} 
                                        sx={{ 
                                            '&:hover': { bgcolor: '#f8f9fa' },
                                            '&:last-child td': { border: 0 }
                                        }}
                                    >
                                        <TableCell sx={{ py: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ 
                                                    width: 40, 
                                                    height: 40, 
                                                    bgcolor: chauffeur.isActive ? '#e8f5e8' : '#ffebee',
                                                    color: chauffeur.isActive ? '#2e7d32' : '#d32f2f',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {chauffeur.nom.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {chauffeur.nom}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Email sx={{ fontSize: 14, color: '#666' }} />
                                                    <Typography variant="body2">
                                                        {chauffeur.email}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Phone sx={{ fontSize: 14, color: '#666' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {chauffeur.telephone}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(chauffeur.createdAt).toLocaleDateString('fr-FR')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                                <Chip
                                                    label={chauffeur.isActive ? 'Actif' : 'Inactif'}
                                                    color={chauffeur.isActive ? 'success' : 'error'}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ minWidth: 70 }}
                                                />
                                                <Button
                                                    variant={chauffeur.isActive ? 'outlined' : 'contained'}
                                                    size="small"
                                                    color={chauffeur.isActive ? 'error' : 'success'}
                                                    onClick={() => toggleStatus(chauffeur._id)}
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        minWidth: 90,
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    {chauffeur.isActive ? 'Désactiver' : 'Activer'}
                                                </Button>
                                            </Box>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}
        </Box>
    );
};

export default Chauffeurs;