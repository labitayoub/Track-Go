import { useState, useEffect } from 'react';
import { trajetAPI, camionAPI, remorqueAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
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
    Route,
    PlayArrow,
    CheckCircle,
} from '@mui/icons-material';

interface PopulatedChauffeur {
    _id: string;
    nom: string;
}

interface PopulatedVehicule {
    _id: string;
    immatriculation: string;
}

interface Trajet {
    _id: string;
    chauffeurId: string | PopulatedChauffeur;
    camionId: string | PopulatedVehicule;
    remorqueId?: string | PopulatedVehicule;
    depart: string;
    arrivee: string;
    dateDepart: string;
    dateArrivee?: string;
    kilometrage: number;
    gasoil?: number;
    statut: 'a_faire' | 'en_cours' | 'termine';
    remarques?: string;
    createdAt: string;
}

interface Chauffeur {
    _id: string;
    nom: string;
}

interface Camion {
    _id: string;
    immatriculation: string;
}

interface Remorque {
    _id: string;
    immatriculation: string;
}

const statutColors: Record<string, 'info' | 'warning' | 'success'> = {
    a_faire: 'info',
    en_cours: 'warning',
    termine: 'success',
};

const statutLabels: Record<string, string> = {
    a_faire: 'À faire',
    en_cours: 'En cours',
    termine: 'Terminé',
};

const initialFormState = {
    chauffeurId: '',
    camionId: '',
    remorqueId: '',
    depart: '',
    arrivee: '',
    dateDepart: '',
    dateArrivee: '',
    kilometrage: 0,
    gasoil: 0,
    statut: 'a_faire' as 'a_faire' | 'en_cours' | 'termine',
    remarques: '',
};

const Trajets = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [trajets, setTrajets] = useState<Trajet[]>([]);
    const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
    const [camions, setCamions] = useState<Camion[]>([]);
    const [remorques, setRemorques] = useState<Remorque[]>([]);
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
            const [trajetsRes, camionsRes, remorquesRes] = await Promise.all([
                isAdmin ? trajetAPI.getAll() : trajetAPI.getMyTrajets(),
                camionAPI.getAll(),
                remorqueAPI.getAll(),
            ]);
            setTrajets(trajetsRes.data.trajets || trajetsRes.data);
            setCamions(camionsRes.data.camions || camionsRes.data);
            setRemorques(remorquesRes.data.remorques || remorquesRes.data);

            if (isAdmin) {
                const chauffeursRes = await adminAPI.getChauffeurs();
                setChauffeurs(chauffeursRes.data.chauffeurs || chauffeursRes.data);
            }
        } catch (error) {
            console.error('Erreur chargement données:', error);
        }
        setLoading(false);
    };

    const getChauffeurNom = (chauffeur: string | PopulatedChauffeur): string => {
        if (typeof chauffeur === 'object' && chauffeur?.nom) {
            return chauffeur.nom;
        }
        const found = chauffeurs.find((c) => c._id === chauffeur);
        return found?.nom || 'N/A';
    };

    const getCamionImmat = (camion: string | PopulatedVehicule): string => {
        if (typeof camion === 'object' && camion?.immatriculation) {
            return camion.immatriculation;
        }
        const found = camions.find((c) => c._id === camion);
        return found?.immatriculation || 'N/A';
    };

    const getRemorqueImmat = (remorque?: string | PopulatedVehicule): string => {
        if (!remorque) return '-';
        if (typeof remorque === 'object' && remorque?.immatriculation) {
            return remorque.immatriculation;
        }
        const found = remorques.find((r) => r._id === remorque);
        return found?.immatriculation || 'N/A';
    };

    const getId = (value: string | { _id: string }): string => {
        if (typeof value === 'object' && value?._id) {
            return value._id;
        }
        return value as string;
    };

    const handleOpenDialog = (trajet?: Trajet) => {
        if (trajet) {
            setEditingId(trajet._id);
            setFormData({
                chauffeurId: getId(trajet.chauffeurId),
                camionId: getId(trajet.camionId),
                remorqueId: trajet.remorqueId ? getId(trajet.remorqueId) : '',
                depart: trajet.depart,
                arrivee: trajet.arrivee,
                dateDepart: trajet.dateDepart ? trajet.dateDepart.slice(0, 16) : '',
                dateArrivee: trajet.dateArrivee ? trajet.dateArrivee.slice(0, 16) : '',
                kilometrage: trajet.kilometrage,
                gasoil: trajet.gasoil || 0,
                statut: trajet.statut,
                remarques: trajet.remarques || '',
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
            const payload = {
                ...formData,
                remorqueId: formData.remorqueId || undefined,
                dateArrivee: formData.dateArrivee || undefined,
                gasoil: formData.gasoil || undefined,
                remarques: formData.remarques || undefined,
            };
            if (editingId) {
                await trajetAPI.update(editingId, payload);
            } else {
                await trajetAPI.create(payload);
            }
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) return;
        try {
            await trajetAPI.delete(id);
            loadData();
        } catch (error) {
            console.error('Erreur suppression:', error);
        }
    };

    const handleStartTrajet = async (trajet: Trajet) => {
        try {
            await trajetAPI.update(trajet._id, { ...trajet, statut: 'en_cours' });
            loadData();
        } catch (error) {
            console.error('Erreur démarrage:', error);
        }
    };

    const handleFinishTrajet = async (trajet: Trajet) => {
        try {
            await trajetAPI.update(trajet._id, { 
                ...trajet, 
                statut: 'termine',
                dateArrivee: new Date().toISOString(),
            });
            loadData();
        } catch (error) {
            console.error('Erreur fin:', error);
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
                        {isAdmin ? 'Gestion des trajets' : 'Mes trajets'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        {trajets.length} trajet{trajets.length > 1 ? 's' : ''} enregistré{trajets.length > 1 ? 's' : ''}
                    </Typography>
                </Box>
                {isAdmin && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{ borderRadius: 2 }}
                    >
                        Ajouter un trajet
                    </Button>
                )}
            </Box>

            {/* Content */}
            {trajets.length === 0 ? (
                <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <Route sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Aucun trajet enregistré
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isAdmin ? 'Cliquez sur "Ajouter un trajet" pour commencer' : 'Aucun trajet assigné pour le moment'}
                        </Typography>
                    </Box>
                </Card>
            ) : isMobile ? (
                // Version mobile - Cards
                <Stack spacing={2}>
                    {trajets.map((trajet) => (
                        <Card key={trajet._id} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                        {trajet.depart} → {trajet.arrivee}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Camion: {getCamionImmat(trajet.camionId)}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={statutLabels[trajet.statut]}
                                    color={statutColors[trajet.statut]}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Date départ</Typography>
                                    <Typography variant="body2">
                                        {new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Kilométrage</Typography>
                                    <Typography variant="body2">{trajet.kilometrage.toLocaleString()} km</Typography>
                                </Box>
                                {trajet.gasoil && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Gasoil</Typography>
                                        <Typography variant="body2">{trajet.gasoil} L</Typography>
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                {trajet.statut === 'a_faire' && (
                                    <IconButton size="small" onClick={() => handleStartTrajet(trajet)} color="warning">
                                        <PlayArrow />
                                    </IconButton>
                                )}
                                {trajet.statut === 'en_cours' && (
                                    <IconButton size="small" onClick={() => handleFinishTrajet(trajet)} color="success">
                                        <CheckCircle />
                                    </IconButton>
                                )}
                                <IconButton size="small" onClick={() => handleOpenDialog(trajet)} color="primary">
                                    <Edit />
                                </IconButton>
                                {isAdmin && (
                                    <IconButton size="small" onClick={() => handleDelete(trajet._id)} color="error">
                                        <Delete />
                                    </IconButton>
                                )}
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
                                {isAdmin && <TableCell sx={{ fontWeight: 600 }}>Chauffeur</TableCell>}
                                <TableCell sx={{ fontWeight: 600 }}>Itinéraire</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Camion</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Remorque</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Date départ</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Kilométrage</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trajets.map((trajet) => (
                                <TableRow key={trajet._id} hover>
                                    {isAdmin && <TableCell>{getChauffeurNom(trajet.chauffeurId)}</TableCell>}
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {trajet.depart} → {trajet.arrivee}
                                    </TableCell>
                                    <TableCell>{getCamionImmat(trajet.camionId)}</TableCell>
                                    <TableCell>{getRemorqueImmat(trajet.remorqueId)}</TableCell>
                                    <TableCell>
                                        {new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}
                                    </TableCell>
                                    <TableCell>{trajet.kilometrage.toLocaleString()} km</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statutLabels[trajet.statut]}
                                            color={statutColors[trajet.statut]}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {trajet.statut === 'a_faire' && (
                                            <IconButton size="small" onClick={() => handleStartTrajet(trajet)} color="warning" title="Démarrer">
                                                <PlayArrow />
                                            </IconButton>
                                        )}
                                        {trajet.statut === 'en_cours' && (
                                            <IconButton size="small" onClick={() => handleFinishTrajet(trajet)} color="success" title="Terminer">
                                                <CheckCircle />
                                            </IconButton>
                                        )}
                                        <IconButton size="small" onClick={() => handleOpenDialog(trajet)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        {isAdmin && (
                                            <IconButton size="small" onClick={() => handleDelete(trajet._id)} color="error">
                                                <Delete />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dialog Add/Edit */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingId ? 'Modifier le trajet' : 'Ajouter un trajet'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {isAdmin && (
                            <FormControl fullWidth>
                                <InputLabel>Chauffeur</InputLabel>
                                <Select
                                    value={formData.chauffeurId}
                                    label="Chauffeur"
                                    onChange={(e) => setFormData({ ...formData, chauffeurId: e.target.value })}
                                >
                                    {chauffeurs.map((c) => (
                                        <MenuItem key={c._id} value={c._id}>{c.nom}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Camion</InputLabel>
                                <Select
                                    value={formData.camionId}
                                    label="Camion"
                                    onChange={(e) => setFormData({ ...formData, camionId: e.target.value })}
                                >
                                    {camions.map((c) => (
                                        <MenuItem key={c._id} value={c._id}>{c.immatriculation}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Remorque (optionnel)</InputLabel>
                                <Select
                                    value={formData.remorqueId}
                                    label="Remorque (optionnel)"
                                    onChange={(e) => setFormData({ ...formData, remorqueId: e.target.value })}
                                >
                                    <MenuItem value="">Aucune</MenuItem>
                                    {remorques.map((r) => (
                                        <MenuItem key={r._id} value={r._id}>{r.immatriculation}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Départ"
                                value={formData.depart}
                                onChange={(e) => setFormData({ ...formData, depart: e.target.value })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Arrivée"
                                value={formData.arrivee}
                                onChange={(e) => setFormData({ ...formData, arrivee: e.target.value })}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Date départ"
                                type="datetime-local"
                                value={formData.dateDepart}
                                onChange={(e) => setFormData({ ...formData, dateDepart: e.target.value })}
                                fullWidth
                                required
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                            <TextField
                                label="Date arrivée"
                                type="datetime-local"
                                value={formData.dateArrivee}
                                onChange={(e) => setFormData({ ...formData, dateArrivee: e.target.value })}
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Kilométrage"
                                type="number"
                                value={formData.kilometrage}
                                onChange={(e) => setFormData({ ...formData, kilometrage: parseInt(e.target.value) || 0 })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Gasoil (L)"
                                type="number"
                                value={formData.gasoil}
                                onChange={(e) => setFormData({ ...formData, gasoil: parseInt(e.target.value) || 0 })}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Statut"
                                select
                                value={formData.statut}
                                onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                                fullWidth
                            >
                                <MenuItem value="a_faire">À faire</MenuItem>
                                <MenuItem value="en_cours">En cours</MenuItem>
                                <MenuItem value="termine">Terminé</MenuItem>
                            </TextField>
                        </Box>
                        <TextField
                            label="Remarques"
                            value={formData.remarques}
                            onChange={(e) => setFormData({ ...formData, remarques: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={saving || !formData.camionId || !formData.depart || !formData.arrivee || !formData.dateDepart || (isAdmin && !formData.chauffeurId)}
                    >
                        {saving ? <CircularProgress size={20} /> : editingId ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Trajets;
