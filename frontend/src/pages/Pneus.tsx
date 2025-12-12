import { useState, useEffect } from 'react';
import { pneuAPI, camionAPI, remorqueAPI } from '../services/api';
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
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    TireRepair,
} from '@mui/icons-material';

interface Pneu {
    _id: string;
    vehiculeId: string;
    vehiculeType: 'camion' | 'remorque';
    position: string;
    marque: string;
    kmInstallation: number;
    kmLimite: number;
    statut: 'bon' | 'use' | 'a_changer';
    createdAt: string;
}

interface Vehicule {
    _id: string;
    immatriculation: string;
}

const statutColors: Record<string, 'success' | 'warning' | 'error'> = {
    bon: 'success',
    use: 'warning',
    a_changer: 'error',
};

const statutLabels: Record<string, string> = {
    bon: 'Bon état',
    use: 'Usé',
    a_changer: 'À changer',
};

const initialFormState = {
    vehiculeId: '',
    vehiculeType: 'camion' as 'camion' | 'remorque',
    position: '',
    marque: '',
    kmInstallation: 0,
    kmLimite: 0,
    statut: 'bon' as 'bon' | 'use' | 'a_changer',
};

const Pneus = () => {
    const [pneus, setPneus] = useState<Pneu[]>([]);
    const [camions, setCamions] = useState<Vehicule[]>([]);
    const [remorques, setRemorques] = useState<Vehicule[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(initialFormState);
    const [saving, setSaving] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [pneusRes, camionsRes, remorquesRes] = await Promise.all([
                pneuAPI.getAll(),
                camionAPI.getAll(),
                remorqueAPI.getAll(),
            ]);
            setPneus(pneusRes.data.pneus || pneusRes.data);
            setCamions(camionsRes.data.camions || camionsRes.data);
            setRemorques(remorquesRes.data.remorques || remorquesRes.data);
        } catch (error) {
            console.error('Erreur chargement données:', error);
        }
        setLoading(false);
    };

    const getVehiculeImmat = (vehiculeId: string, vehiculeType: string): string => {
        const list = vehiculeType === 'camion' ? camions : remorques;
        const vehicule = list.find((v) => v._id === vehiculeId);
        return vehicule?.immatriculation || 'N/A';
    };

    const handleOpenDialog = (pneu?: Pneu) => {
        if (pneu) {
            setEditingId(pneu._id);
            setFormData({
                vehiculeId: pneu.vehiculeId,
                vehiculeType: pneu.vehiculeType,
                position: pneu.position,
                marque: pneu.marque,
                kmInstallation: pneu.kmInstallation,
                kmLimite: pneu.kmLimite,
                statut: pneu.statut,
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
                await pneuAPI.update(editingId, formData);
            } else {
                await pneuAPI.create(formData);
            }
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce pneu ?')) return;
        try {
            await pneuAPI.delete(id);
            loadData();
        } catch (error) {
            console.error('Erreur suppression:', error);
        }
    };

    const vehiculeOptions = formData.vehiculeType === 'camion' ? camions : remorques;

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
                        Gestion des pneus
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        {pneus.length} pneu{pneus.length > 1 ? 's' : ''} enregistré{pneus.length > 1 ? 's' : ''}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: 2 }}
                >
                    Ajouter un pneu
                </Button>
            </Box>

            {/* Content */}
            {pneus.length === 0 ? (
                <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <TireRepair sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Aucun pneu enregistré
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cliquez sur "Ajouter un pneu" pour commencer
                        </Typography>
                    </Box>
                </Card>
            ) : isMobile ? (
                // Version mobile - Cards
                <Stack spacing={2}>
                    {pneus.map((pneu) => (
                        <Card key={pneu._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                        {pneu.marque} - {pneu.position}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {pneu.vehiculeType === 'camion' ? 'Camion' : 'Remorque'}: {getVehiculeImmat(pneu.vehiculeId, pneu.vehiculeType)}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={statutLabels[pneu.statut]}
                                    color={statutColors[pneu.statut]}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Km Installation</Typography>
                                    <Typography variant="body2">{pneu.kmInstallation.toLocaleString()} km</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Km Limite</Typography>
                                    <Typography variant="body2">{pneu.kmLimite.toLocaleString()} km</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <IconButton size="small" onClick={() => handleOpenDialog(pneu)} color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete(pneu._id)} color="error">
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
                                <TableCell sx={{ fontWeight: 600 }}>Véhicule</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Marque</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Km Installation</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Km Limite</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pneus.map((pneu) => (
                                <TableRow key={pneu._id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {getVehiculeImmat(pneu.vehiculeId, pneu.vehiculeType)}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={pneu.vehiculeType === 'camion' ? 'Camion' : 'Remorque'} 
                                            size="small" 
                                            variant="outlined"
                                            color={pneu.vehiculeType === 'camion' ? 'primary' : 'secondary'}
                                        />
                                    </TableCell>
                                    <TableCell>{pneu.position}</TableCell>
                                    <TableCell>{pneu.marque}</TableCell>
                                    <TableCell>{pneu.kmInstallation.toLocaleString()} km</TableCell>
                                    <TableCell>{pneu.kmLimite.toLocaleString()} km</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statutLabels[pneu.statut]}
                                            color={statutColors[pneu.statut]}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpenDialog(pneu)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(pneu._id)} color="error">
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
                    {editingId ? 'Modifier le pneu' : 'Ajouter un pneu'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Type de véhicule</InputLabel>
                                <Select
                                    value={formData.vehiculeType}
                                    label="Type de véhicule"
                                    onChange={(e) => setFormData({ 
                                        ...formData, 
                                        vehiculeType: e.target.value as 'camion' | 'remorque',
                                        vehiculeId: '' 
                                    })}
                                >
                                    <MenuItem value="camion">Camion</MenuItem>
                                    <MenuItem value="remorque">Remorque</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Véhicule</InputLabel>
                                <Select
                                    value={formData.vehiculeId}
                                    label="Véhicule"
                                    onChange={(e) => setFormData({ ...formData, vehiculeId: e.target.value })}
                                >
                                    {vehiculeOptions.map((v) => (
                                        <MenuItem key={v._id} value={v._id}>
                                            {v.immatriculation}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Position"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                fullWidth
                                required
                                placeholder="Ex: Avant gauche, Arrière droit..."
                            />
                            <TextField
                                label="Marque"
                                value={formData.marque}
                                onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Km Installation"
                                type="number"
                                value={formData.kmInstallation}
                                onChange={(e) => setFormData({ ...formData, kmInstallation: parseInt(e.target.value) || 0 })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Km Limite"
                                type="number"
                                value={formData.kmLimite}
                                onChange={(e) => setFormData({ ...formData, kmLimite: parseInt(e.target.value) || 0 })}
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
                            <MenuItem value="bon">Bon état</MenuItem>
                            <MenuItem value="use">Usé</MenuItem>
                            <MenuItem value="a_changer">À changer</MenuItem>
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
                        disabled={saving || !formData.vehiculeId || !formData.position || !formData.marque}
                    >
                        {saving ? <CircularProgress size={20} /> : editingId ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Pneus;
