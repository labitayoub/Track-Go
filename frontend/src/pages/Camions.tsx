import { useState, useEffect } from 'react';
import { camionAPI } from '../services/api';
import {
    Box,
    Button,
    Typography,
    Chip,
    CircularProgress,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    LocalShipping,
} from '@mui/icons-material';

interface Camion {
    _id: string;
    immatriculation: string;
    marque: string;
    modele: string;
    annee: number;
    kilometrage: number;
    statut: 'disponible' | 'en_mission' | 'maintenance';
    createdAt: string;
}

const statutColors: Record<string, 'success' | 'warning' | 'error'> = {
    disponible: 'success',
    en_mission: 'warning',
    maintenance: 'error',
};

const statutLabels: Record<string, string> = {
    disponible: 'Disponible',
    en_mission: 'En mission',
    maintenance: 'Maintenance',
};

const initialFormState = {
    immatriculation: '',
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    kilometrage: 0,
    statut: 'disponible' as const,
};

const Camions = () => {
    const [camions, setCamions] = useState<Camion[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(initialFormState);
    const [saving, setSaving] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        loadCamions();
    }, []);

    const loadCamions = async () => {
        setLoading(true);
        try {
            const res = await camionAPI.getAll();
            setCamions(res.data.camions || res.data);
        } catch (error) {
            console.error('Erreur chargement camions:', error);
        }
        setLoading(false);
    };

    const handleOpenDialog = (camion?: Camion) => {
        if (camion) {
            setEditingId(camion._id);
            setFormData({
                immatriculation: camion.immatriculation,
                marque: camion.marque,
                modele: camion.modele,
                annee: camion.annee,
                kilometrage: camion.kilometrage,
                statut: camion.statut,
            });
        } else {
            setEditingId(null);
            setFormData(initialFormState);
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingId(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            if (editingId) {
                await camionAPI.update(editingId, formData);
            } else {
                await camionAPI.create(formData);
            }
            handleCloseDialog();
            loadCamions();
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce camion ?')) return;
        try {
            await camionAPI.delete(id);
            loadCamions();
        } catch (error) {
            console.error('Erreur suppression:', error);
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
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 500, mb: 1, color: '#1a1a1a' }}>
                        Gestion des camions
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        {camions.length} camion{camions.length > 1 ? 's' : ''} enregistré{camions.length > 1 ? 's' : ''}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: 2 }}
                >
                    Ajouter un camion
                </Button>
            </Box>

            {/* Content */}
            {camions.length === 0 ? (
                <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <LocalShipping sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Aucun camion enregistré
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cliquez sur "Ajouter un camion" pour commencer
                        </Typography>
                    </Box>
                </Card>
            ) : isMobile ? (
                // Version mobile - Cards
                <Stack spacing={2}>
                    {camions.map((camion) => (
                        <Card key={camion._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                        {camion.immatriculation}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {camion.marque} {camion.modele}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={statutLabels[camion.statut]}
                                    color={statutColors[camion.statut]}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Année</Typography>
                                    <Typography variant="body2">{camion.annee}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Kilométrage</Typography>
                                    <Typography variant="body2">{camion.kilometrage.toLocaleString()} km</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <IconButton size="small" onClick={() => handleOpenDialog(camion)} color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete(camion._id)} color="error">
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            ) : (
                // Version desktop - Table
                <TableContainer component={Card} sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Immatriculation</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Marque</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Modèle</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Année</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Kilométrage</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {camions.map((camion) => (
                                <TableRow key={camion._id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{camion.immatriculation}</TableCell>
                                    <TableCell>{camion.marque}</TableCell>
                                    <TableCell>{camion.modele}</TableCell>
                                    <TableCell>{camion.annee}</TableCell>
                                    <TableCell>{camion.kilometrage.toLocaleString()} km</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statutLabels[camion.statut]}
                                            color={statutColors[camion.statut]}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpenDialog(camion)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(camion._id)} color="error">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dialog Add/Edit */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingId ? 'Modifier le camion' : 'Ajouter un camion'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Immatriculation"
                            value={formData.immatriculation}
                            onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
                            fullWidth
                            required
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Marque"
                                value={formData.marque}
                                onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Modèle"
                                value={formData.modele}
                                onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Année"
                                type="number"
                                value={formData.annee}
                                onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Kilométrage"
                                type="number"
                                value={formData.kilometrage}
                                onChange={(e) => setFormData({ ...formData, kilometrage: parseInt(e.target.value) })}
                                fullWidth
                                required
                            />
                        </Box>
                        <TextField
                            label="Statut"
                            select
                            value={formData.statut}
                            onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                            fullWidth
                        >
                            <MenuItem value="disponible">Disponible</MenuItem>
                            <MenuItem value="en_mission">En mission</MenuItem>
                            <MenuItem value="maintenance">Maintenance</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={saving || !formData.immatriculation || !formData.marque || !formData.modele}
                    >
                        {saving ? <CircularProgress size={20} /> : editingId ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Camions;
