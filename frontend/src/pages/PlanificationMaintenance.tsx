import { useState, useEffect } from 'react';
import { camionAPI, maintenanceRuleAPI } from '../services/api';
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Stack,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Tabs,
    Tab,
    LinearProgress,
} from '@mui/material';
import {
    Warning,
    Error as ErrorIcon,
    CheckCircle,
    Refresh,
    PlayArrow,
    Settings,
    Edit,
    LocalGasStation,
    TireRepair,
    Build,
    DirectionsCar,
} from '@mui/icons-material';

interface MaintenanceRule {
    _id: string;
    type: 'vidange' | 'pneus' | 'revision' | 'gasoil';
    seuilKm: number;
    alerteAvantKm: number;
    actif: boolean;
}

interface Camion {
    _id: string;
    immatriculation: string;
    marque: string;
    modele: string;
    kilometrage: number;
}

interface Alerte {
    type: string;
    urgence: 'critique' | 'urgent' | 'preventive';
    kmRestant: number;
    message: string;
}

const typeLabels: Record<string, string> = {
    vidange: 'Vidange',
    pneus: 'Pneus',
    revision: 'Révision',
    gasoil: 'Gasoil',
};

const typeIcons: Record<string, React.ReactNode> = {
    vidange: <LocalGasStation />,
    pneus: <TireRepair />,
    revision: <Build />,
    gasoil: <DirectionsCar />,
};

const urgenceColors: Record<string, 'error' | 'warning' | 'info'> = {
    critique: 'error',
    urgent: 'warning',
    preventive: 'info',
};

const PlanificationMaintenance = () => {
    const [tab, setTab] = useState(0);
    const [rules, setRules] = useState<MaintenanceRule[]>([]);
    const [camions, setCamions] = useState<Camion[]>([]);
    const [alertes, setAlertes] = useState<Record<string, Alerte[]>>({});
    const [loading, setLoading] = useState(false);
    const [loadingAlertes, setLoadingAlertes] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog pour éditer les règles
    const [editDialog, setEditDialog] = useState(false);
    const [editingRule, setEditingRule] = useState<MaintenanceRule | null>(null);
    const [formData, setFormData] = useState({
        seuilKm: 0,
        alerteAvantKm: 0,
        actif: true,
    });

    const fetchRules = async () => {
        try {
            const res = await maintenanceRuleAPI.getAll();
            setRules(res.data || []);
        } catch (err) {
            console.error('Erreur chargement règles:', err);
        }
    };

    const fetchCamions = async () => {
        try {
            const res = await camionAPI.getAll();
            setCamions(res.data || []);
        } catch (err) {
            console.error('Erreur chargement camions:', err);
        }
    };

    const fetchAlertes = async () => {
        setLoadingAlertes(true);
        const alertesMap: Record<string, Alerte[]> = {};
        
        for (const camion of camions) {
            try {
                const res = await maintenanceRuleAPI.getAlertes(camion._id);
                if (res.data?.length > 0) {
                    alertesMap[camion._id] = res.data;
                }
            } catch (err) {
                console.error(`Erreur alertes pour ${camion.immatriculation}:`, err);
            }
        }
        
        setAlertes(alertesMap);
        setLoadingAlertes(false);
    };

    const loadData = async () => {
        setLoading(true);
        setError('');
        await Promise.all([fetchRules(), fetchCamions()]);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (camions.length > 0 && tab === 1) {
            fetchAlertes();
        }
    }, [camions, tab]);

    const handleSeedRules = async () => {
        try {
            setLoading(true);
            await maintenanceRuleAPI.seed();
            await fetchRules();
            setSuccess('Règles par défaut créées avec succès');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la création des règles');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRule = (rule: MaintenanceRule) => {
        setEditingRule(rule);
        setFormData({
            seuilKm: rule.seuilKm,
            alerteAvantKm: rule.alerteAvantKm,
            actif: rule.actif,
        });
        setEditDialog(true);
    };

    const handleSaveRule = async () => {
        if (!editingRule) return;
        try {
            await maintenanceRuleAPI.update(editingRule._id, formData);
            await fetchRules();
            setEditDialog(false);
            setSuccess('Règle mise à jour');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    };

    const handleGenererMaintenances = async (camionId: string) => {
        try {
            const res = await maintenanceRuleAPI.generer(camionId);
            const count = res.data?.maintenancesCreees || 0;
            setSuccess(`${count} maintenance(s) générée(s)`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la génération');
        }
    };

    const getTotalAlertes = () => {
        let critique = 0, urgent = 0, preventive = 0;
        Object.values(alertes).forEach(list => {
            list.forEach(a => {
                if (a.urgence === 'critique') critique++;
                else if (a.urgence === 'urgent') urgent++;
                else preventive++;
            });
        });
        return { critique, urgent, preventive };
    };

    const stats = getTotalAlertes();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                🔧 Planification Maintenance
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

            {/* Statistiques alertes */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Card sx={{ flex: 1, bgcolor: '#ffebee' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <ErrorIcon sx={{ color: '#f44336', fontSize: 40 }} />
                        <Typography variant="h4" sx={{ color: '#f44336' }}>{stats.critique}</Typography>
                        <Typography variant="body2" color="text.secondary">Critiques</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: 1, bgcolor: '#fff3e0' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Warning sx={{ color: '#ff9800', fontSize: 40 }} />
                        <Typography variant="h4" sx={{ color: '#ff9800' }}>{stats.urgent}</Typography>
                        <Typography variant="body2" color="text.secondary">Urgentes</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: 1, bgcolor: '#e3f2fd' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <CheckCircle sx={{ color: '#2196f3', fontSize: 40 }} />
                        <Typography variant="h4" sx={{ color: '#2196f3' }}>{stats.preventive}</Typography>
                        <Typography variant="body2" color="text.secondary">Préventives</Typography>
                    </CardContent>
                </Card>
            </Stack>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Règles de maintenance" icon={<Settings />} iconPosition="start" />
                <Tab label="Alertes par camion" icon={<Warning />} iconPosition="start" />
            </Tabs>

            {/* Tab 0: Règles */}
            {tab === 0 && (
                <Card>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="h6">Règles automatiques</Typography>
                            {rules.length === 0 && (
                                <Button
                                    variant="contained"
                                    startIcon={<PlayArrow />}
                                    onClick={handleSeedRules}
                                >
                                    Initialiser règles par défaut
                                </Button>
                            )}
                        </Stack>

                        {rules.length === 0 ? (
                            <Alert severity="info">
                                Aucune règle configurée. Cliquez sur "Initialiser règles par défaut" pour commencer.
                            </Alert>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Type</TableCell>
                                            <TableCell align="center">Seuil KM</TableCell>
                                            <TableCell align="center">Alerte avant KM</TableCell>
                                            <TableCell align="center">Statut</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rules.map((rule) => (
                                            <TableRow key={rule._id}>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        {typeIcons[rule.type]}
                                                        <Typography>{typeLabels[rule.type]}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">{rule.seuilKm.toLocaleString()} km</TableCell>
                                                <TableCell align="center">{rule.alerteAvantKm.toLocaleString()} km</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={rule.actif ? 'Actif' : 'Inactif'}
                                                        color={rule.actif ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={() => handleEditRule(rule)} size="small">
                                                        <Edit />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Tab 1: Alertes par camion */}
            {tab === 1 && (
                <Card>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="h6">Alertes par véhicule</Typography>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={fetchAlertes}
                                disabled={loadingAlertes}
                            >
                                Actualiser
                            </Button>
                        </Stack>

                        {loadingAlertes && <LinearProgress sx={{ mb: 2 }} />}

                        {camions.length === 0 ? (
                            <Alert severity="info">Aucun camion enregistré.</Alert>
                        ) : (
                            <Stack spacing={2}>
                                {camions.map((camion) => {
                                    const camionAlertes = alertes[camion._id] || [];
                                    const hasCritique = camionAlertes.some(a => a.urgence === 'critique');
                                    const hasUrgent = camionAlertes.some(a => a.urgence === 'urgent');

                                    return (
                                        <Card
                                            key={camion._id}
                                            variant="outlined"
                                            sx={{
                                                borderColor: hasCritique ? '#f44336' : hasUrgent ? '#ff9800' : '#e0e0e0',
                                                borderWidth: hasCritique || hasUrgent ? 2 : 1,
                                            }}
                                        >
                                            <CardContent>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {camion.immatriculation}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {camion.marque} {camion.modele} • {camion.kilometrage.toLocaleString()} km
                                                        </Typography>
                                                    </Box>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<PlayArrow />}
                                                        onClick={() => handleGenererMaintenances(camion._id)}
                                                        disabled={camionAlertes.length === 0}
                                                    >
                                                        Générer maintenances
                                                    </Button>
                                                </Stack>

                                                {camionAlertes.length === 0 ? (
                                                    <Chip label="Aucune alerte" color="success" size="small" icon={<CheckCircle />} />
                                                ) : (
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {camionAlertes.map((alerte, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                icon={typeIcons[alerte.type] as React.ReactElement}
                                                                label={`${typeLabels[alerte.type]}: ${alerte.message}`}
                                                                color={urgenceColors[alerte.urgence]}
                                                                size="small"
                                                                sx={{ my: 0.5 }}
                                                            />
                                                        ))}
                                                    </Stack>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Stack>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Dialog édition règle */}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Modifier règle: {editingRule && typeLabels[editingRule.type]}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Seuil kilométrage"
                            type="number"
                            value={formData.seuilKm}
                            onChange={(e) => setFormData({ ...formData, seuilKm: Number(e.target.value) })}
                            fullWidth
                            InputProps={{ endAdornment: 'km' }}
                        />
                        <TextField
                            label="Alerte avant (km)"
                            type="number"
                            value={formData.alerteAvantKm}
                            onChange={(e) => setFormData({ ...formData, alerteAvantKm: Number(e.target.value) })}
                            fullWidth
                            InputProps={{ endAdornment: 'km' }}
                        />
                        <TextField
                            select
                            label="Statut"
                            value={formData.actif ? 'actif' : 'inactif'}
                            onChange={(e) => setFormData({ ...formData, actif: e.target.value === 'actif' })}
                            fullWidth
                        >
                            <MenuItem value="actif">Actif</MenuItem>
                            <MenuItem value="inactif">Inactif</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog(false)}>Annuler</Button>
                    <Button variant="contained" onClick={handleSaveRule}>Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PlanificationMaintenance;
