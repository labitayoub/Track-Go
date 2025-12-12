import { useState, useEffect } from 'react';
import { remorqueAPI } from '../services/api';
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
    RvHookup,
} from '@mui/icons-material';

interface Remorque {
    _id: string;
    immatriculation: string;
    type: string;
    capacite: number;
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
    type: '',
    capacite: 0,
    statut: 'disponible' as 'disponible' | 'en_mission' | 'maintenance',
};

const Remorques = () => {
    const [remorques, setRemorques] = useState<Remorque[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(initialFormState);
    const [saving, setSaving] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        loadRemorques();
    }, []);

    const loadRemorques = async () => {
        setLoading(true);
        try {
            const res = await remorqueAPI.getAll();
            setRemorques(res.data.remorques || res.data);
        } catch (error) {
            console.error('Erreur chargement remorques:', error);
        }
        setLoading(false);
    };

    const handleOpenDialog = (remorque?: Remorque) => {
        if (remorque) {
            setEditingId(remorque._id);
            setFormData({
                immatriculation: remorque.immatriculation,
                type: remorque.type,
                capacite: remorque.capacite,
                statut: remorque.statut,
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
                await remorqueAPI.update(editingId, formData);
            } else {
                await remorqueAPI.create(formData);
            }
            handleCloseDialog();
            loadRemorques();
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette remorque ?')) return;
        try {
            await remorqueAPI.delete(id);
            loadRemorques();
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
                        Gestion des remorques
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        {remorques.length} remorque{remorques.length > 1 ? 's' : ''} enregistrée{remorques.length > 1 ? 's' : ''}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: 2 }}
                >
                    Ajouter une remorque
                </Button>
            </Box>

            {/* Content */}
            {remorques.length === 0 ? (
                <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <RvHookup sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Aucune remorque enregistrée
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cliquez sur "Ajouter une remorque" pour commencer
                        </Typography>
                    </Box>
                </Card>
            ) : isMobile ? (
                // Version mobile - Cards
                <Stack spacing={2}>
                    {remorques.map((remorque) => (
                        <Card key={remorque._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                        {remorque.immatriculation}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {remorque.type}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={statutLabels[remorque.statut]}
                                    color={statutColors[remorque.statut]}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Capacité</Typography>
                                    <Typography variant="body2">{remorque.capacite.toLocaleString()} kg</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <IconButton size="small" onClick={() => handleOpenDialog(remorque)} color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete(remorque._id)} color="error">
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
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Capacité</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {remorques.map((remorque) => (
                                <TableRow key={remorque._id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{remorque.immatriculation}</TableCell>
                                    <TableCell>{remorque.type}</TableCell>
                                    <TableCell>{remorque.capacite.toLocaleString()} kg</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statutLabels[remorque.statut]}
                                            color={statutColors[remorque.statut]}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpenDialog(remorque)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(remorque._id)} color="error">
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
                    {editingId ? 'Modifier la remorque' : 'Ajouter une remorque'}
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
                        <TextField
                            label="Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            fullWidth
                            required
                            placeholder="Ex: Plateau, Benne, Frigorifique..."
                        />
                        <TextField
                            label="Capacité (kg)"
                            type="number"
                            value={formData.capacite}
                            onChange={(e) => setFormData({ ...formData, capacite: parseInt(e.target.value) || 0 })}
                            fullWidth
                            required
                        />
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
                        disabled={saving || !formData.immatriculation || !formData.type}
                    >
                        {saving ? <CircularProgress size={20} /> : editingId ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Remorques;
