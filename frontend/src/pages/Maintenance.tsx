import { useState, useEffect } from 'react';
import { camionAPI, remorqueAPI, pneuAPI, maintenanceAPI } from '../services/api';
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Paper,
    Divider,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tabs,
    Tab,
} from '@mui/material';
import {
    LocalShipping,
    RvHookup,
    Warning,
    CheckCircle,
    Error as ErrorIcon,
    Add,
    Edit,
    Delete,
    Build,
    LocalGasStation,
    Settings,
    Refresh,
} from '@mui/icons-material';

// Interfaces
interface Pneu {
    _id: string;
    vehiculeId: string;
    vehiculeType: 'camion' | 'remorque';
    position: string;
    marque: string;
    kmInstallation: number;
    kmLimite: number;
    statut: 'bon' | 'use' | 'critique';
}

interface Camion {
    _id: string;
    immatriculation: string;
    marque: string;
    modele: string;
    kilometrage: number;
}

interface MaintenanceRecord {
    _id: string;
    camionId: { _id: string; immatriculation: string } | string;
    type: 'vidange' | 'pneus' | 'revision' | 'reparation';
    description: string;
    datePrevue: string;
    dateRealisee?: string;
    cout?: number;
    statut: 'planifiee' | 'terminee';
}

const typeColors: Record<string, string> = {
    vidange: '#ff9800',
    pneus: '#2196f3',
    revision: '#9c27b0',
    reparation: '#f44336',
};

const typeLabels: Record<string, string> = {
    vidange: 'Vidange',
    pneus: 'Pneus',
    revision: 'Révision',
    reparation: 'Réparation',
};

const typeIcons: Record<string, React.ReactNode> = {
    vidange: <LocalGasStation />,
    pneus: <Settings />,
    revision: <Refresh />,
    reparation: <Build />,
};

const Maintenance = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
    const [camions, setCamions] = useState<Camion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceRecord | null>(null);
    const [formData, setFormData] = useState({
        camionId: '',
        type: 'vidange' as 'vidange' | 'pneus' | 'revision' | 'reparation',
        description: '',
        datePrevue: '',
        dateRealisee: '',
        cout: 0,
        statut: 'planifiee' as 'planifiee' | 'terminee',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [maintenancesRes, camionsRes] = await Promise.all([
                maintenanceAPI.getAll(),
                camionAPI.getAll(),
            ]);
            setMaintenances(maintenancesRes.data || []);
            setCamions(camionsRes.data || []);
            setError('');
        } catch (err: any) {
            console.error('Erreur chargement:', err);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (maintenance?: MaintenanceRecord) => {
        if (maintenance) {
            setEditingMaintenance(maintenance);
            setFormData({
                camionId: typeof maintenance.camionId === 'object' ? maintenance.camionId._id : maintenance.camionId,
                type: maintenance.type,
                description: maintenance.description,
                datePrevue: maintenance.datePrevue.split('T')[0],
                dateRealisee: maintenance.dateRealisee?.split('T')[0] || '',
                cout: maintenance.cout || 0,
                statut: maintenance.statut,
            });
        } else {
            setEditingMaintenance(null);
            setFormData({
                camionId: '',
                type: 'vidange',
                description: '',
                datePrevue: new Date().toISOString().split('T')[0],
                dateRealisee: '',
                cout: 0,
                statut: 'planifiee',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingMaintenance(null);
    };

    const handleSubmit = async () => {
        try {
            const data = {
                ...formData,
                dateRealisee: formData.dateRealisee || null,
                cout: formData.cout || null,
            };

            if (editingMaintenance) {
                await maintenanceAPI.update(editingMaintenance._id, data);
            } else {
                await maintenanceAPI.create(data);
            }
            handleCloseDialog();
            loadData();
        } catch (err: any) {
            setError('Erreur lors de la sauvegarde');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cette maintenance ?')) return;
        try {
            await maintenanceAPI.delete(id);
            loadData();
        } catch (err) {
            setError('Erreur lors de la suppression');
        }
    };

    const getCamionImmat = (camionId: MaintenanceRecord['camionId']): string => {
        if (typeof camionId === 'object' && camionId?.immatriculation) {
            return camionId.immatriculation;
        }
        const camion = camions.find(c => c._id === camionId);
        return camion?.immatriculation || 'Inconnu';
    };

    const formatDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleDateString('fr-FR');
    };

    const isOverdue = (datePrevue: string, statut: string): boolean => {
        return new Date(datePrevue) < new Date() && statut === 'planifiee';
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
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 500, mb: 1, color: '#1a1a1a' }}>
                        Maintenance
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        Gérez les maintenances de vos véhicules
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: 2 }}
                >
                    Nouvelle Maintenance
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
                {(['vidange', 'pneus', 'revision', 'reparation'] as const).map(type => {
                    const count = maintenances.filter(m => m.type === type && m.statut === 'planifiee').length;
                    return (
                        <Card key={type} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: `${typeColors[type]}20`,
                                    color: typeColors[type]
                                }}>
                                    {typeIcons[type]}
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={600}>{count}</Typography>
                                    <Typography variant="body2" color="text.secondary">{typeLabels[type]}</Typography>
                                </Box>
                            </Box>
                        </Card>
                    );
                })}
            </Box>

            {/* Maintenances Table */}
            <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" fontWeight={500}>
                        Liste des maintenances ({maintenances.length})
                    </Typography>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell>Type</TableCell>
                                <TableCell>Camion</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Date prévue</TableCell>
                                <TableCell>Coût</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {maintenances.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            Aucune maintenance enregistrée
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                maintenances.map((m) => (
                                    <TableRow
                                        key={m._id}
                                        sx={{
                                            bgcolor: isOverdue(m.datePrevue, m.statut) ? '#fff3e0' : 'inherit',
                                            '&:hover': { bgcolor: '#f9f9f9' }
                                        }}
                                    >
                                        <TableCell>
                                            <Chip
                                                icon={typeIcons[m.type] as React.ReactElement}
                                                label={typeLabels[m.type]}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${typeColors[m.type]}20`,
                                                    color: typeColors[m.type],
                                                    fontWeight: 500
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocalShipping fontSize="small" color="action" />
                                                {getCamionImmat(m.camionId)}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{m.description}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {formatDate(m.datePrevue)}
                                                {isOverdue(m.datePrevue, m.statut) && (
                                                    <Chip label="En retard" size="small" color="warning" />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {m.cout ? `${m.cout} €` : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={m.statut === 'terminee' ? 'Terminée' : 'Planifiée'}
                                                size="small"
                                                color={m.statut === 'terminee' ? 'success' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleOpenDialog(m)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(m._id)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingMaintenance ? 'Modifier la maintenance' : 'Nouvelle maintenance'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Camion</InputLabel>
                            <Select
                                value={formData.camionId}
                                label="Camion"
                                onChange={(e) => setFormData({ ...formData, camionId: e.target.value })}
                            >
                                {camions.map(c => (
                                    <MenuItem key={c._id} value={c._id}>
                                        {c.immatriculation} - {c.marque} {c.modele}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={formData.type}
                                label="Type"
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            >
                                <MenuItem value="vidange">Vidange</MenuItem>
                                <MenuItem value="pneus">Pneus</MenuItem>
                                <MenuItem value="revision">Révision</MenuItem>
                                <MenuItem value="reparation">Réparation</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={2}
                        />

                        <TextField
                            label="Date prévue"
                            type="date"
                            value={formData.datePrevue}
                            onChange={(e) => setFormData({ ...formData, datePrevue: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Date réalisée"
                            type="date"
                            value={formData.dateRealisee}
                            onChange={(e) => setFormData({ ...formData, dateRealisee: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Coût (€)"
                            type="number"
                            value={formData.cout}
                            onChange={(e) => setFormData({ ...formData, cout: Number(e.target.value) })}
                            fullWidth
                        />

                        <FormControl fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Select
                                value={formData.statut}
                                label="Statut"
                                onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                            >
                                <MenuItem value="planifiee">Planifiée</MenuItem>
                                <MenuItem value="terminee">Terminée</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.camionId || !formData.description}
                    >
                        {editingMaintenance ? 'Modifier' : 'Créer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Maintenance;
