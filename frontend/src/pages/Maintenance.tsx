import { useState, useEffect } from 'react';
import { camionAPI, remorqueAPI, pneuAPI } from '../services/api';
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
} from '@mui/material';
import {
    LocalShipping,
    RvHookup,
    Warning,
    CheckCircle,
    Error as ErrorIcon,
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
}

interface Camion {
    _id: string;
    immatriculation: string;
    marque: string;
    modele: string;
    kilometrage: number;
}

interface Remorque {
    _id: string;
    immatriculation: string;
    type: string;
    capacite: number;
}

const statutColors: Record<string, string> = {
    bon: '#4caf50',
    use: '#ff9800',
    a_changer: '#f44336',
};

const statutLabels: Record<string, string> = {
    bon: 'Bon état',
    use: 'Usé',
    a_changer: 'À changer',
};

// Positions des pneus pour camion (6 pneus)
const camionPositions = [
    { id: 'AV-G', label: 'Avant Gauche', x: 15, y: 20 },
    { id: 'AV-D', label: 'Avant Droit', x: 75, y: 20 },
    { id: 'AR1-G', label: 'Arrière 1 Gauche', x: 15, y: 55 },
    { id: 'AR1-D', label: 'Arrière 1 Droit', x: 75, y: 55 },
    { id: 'AR2-G', label: 'Arrière 2 Gauche', x: 15, y: 75 },
    { id: 'AR2-D', label: 'Arrière 2 Droit', x: 75, y: 75 },
];

// Positions des pneus pour remorque 8 pneus (2 essieux)
const remorque8Positions = [
    { id: 'E1-G1', label: 'Essieu 1 Gauche Ext', x: 10, y: 35 },
    { id: 'E1-G2', label: 'Essieu 1 Gauche Int', x: 25, y: 35 },
    { id: 'E1-D1', label: 'Essieu 1 Droit Int', x: 65, y: 35 },
    { id: 'E1-D2', label: 'Essieu 1 Droit Ext', x: 80, y: 35 },
    { id: 'E2-G1', label: 'Essieu 2 Gauche Ext', x: 10, y: 60 },
    { id: 'E2-G2', label: 'Essieu 2 Gauche Int', x: 25, y: 60 },
    { id: 'E2-D1', label: 'Essieu 2 Droit Int', x: 65, y: 60 },
    { id: 'E2-D2', label: 'Essieu 2 Droit Ext', x: 80, y: 60 },
];

// Positions des pneus pour remorque 12 pneus (3 essieux)
const remorque12Positions = [
    { id: 'E1-G1', label: 'Essieu 1 Gauche Ext', x: 10, y: 25 },
    { id: 'E1-G2', label: 'Essieu 1 Gauche Int', x: 25, y: 25 },
    { id: 'E1-D1', label: 'Essieu 1 Droit Int', x: 65, y: 25 },
    { id: 'E1-D2', label: 'Essieu 1 Droit Ext', x: 80, y: 25 },
    { id: 'E2-G1', label: 'Essieu 2 Gauche Ext', x: 10, y: 50 },
    { id: 'E2-G2', label: 'Essieu 2 Gauche Int', x: 25, y: 50 },
    { id: 'E2-D1', label: 'Essieu 2 Droit Int', x: 65, y: 50 },
    { id: 'E2-D2', label: 'Essieu 2 Droit Ext', x: 80, y: 50 },
    { id: 'E3-G1', label: 'Essieu 3 Gauche Ext', x: 10, y: 75 },
    { id: 'E3-G2', label: 'Essieu 3 Gauche Int', x: 25, y: 75 },
    { id: 'E3-D1', label: 'Essieu 3 Droit Int', x: 65, y: 75 },
    { id: 'E3-D2', label: 'Essieu 3 Droit Ext', x: 80, y: 75 },
];

const Maintenance = () => {
    const [vehiculeType, setVehiculeType] = useState<'camion' | 'remorque'>('camion');
    const [selectedVehiculeId, setSelectedVehiculeId] = useState<string>('');
    const [camions, setCamions] = useState<Camion[]>([]);
    const [remorques, setRemorques] = useState<Remorque[]>([]);
    const [pneus, setPneus] = useState<Pneu[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPneus, setLoadingPneus] = useState(false);
    const [remorqueEssieux, setRemorqueEssieux] = useState<8 | 12>(8);

    useEffect(() => {
        loadVehicules();
    }, []);

    useEffect(() => {
        if (selectedVehiculeId) {
            loadPneus();
        } else {
            setPneus([]);
        }
    }, [selectedVehiculeId, vehiculeType]);

    const loadVehicules = async () => {
        setLoading(true);
        try {
            const [camionsRes, remorquesRes] = await Promise.all([
                camionAPI.getAll(),
                remorqueAPI.getAll(),
            ]);
            setCamions(camionsRes.data.camions || camionsRes.data);
            setRemorques(remorquesRes.data.remorques || remorquesRes.data);
        } catch (error) {
            console.error('Erreur chargement véhicules:', error);
        }
        setLoading(false);
    };

    const loadPneus = async () => {
        if (!selectedVehiculeId) return;
        setLoadingPneus(true);
        try {
            const res = await pneuAPI.getByVehicule(vehiculeType, selectedVehiculeId);
            setPneus(res.data.pneus || res.data);
        } catch (error) {
            console.error('Erreur chargement pneus:', error);
            setPneus([]);
        }
        setLoadingPneus(false);
    };

    const handleVehiculeTypeChange = (_: React.MouseEvent<HTMLElement>, newType: 'camion' | 'remorque' | null) => {
        if (newType) {
            setVehiculeType(newType);
            setSelectedVehiculeId('');
            setPneus([]);
        }
    };

    const getPneuByPosition = (position: string): Pneu | undefined => {
        return pneus.find((p) => p.position === position);
    };

    const getPositions = () => {
        if (vehiculeType === 'camion') return camionPositions;
        return remorqueEssieux === 12 ? remorque12Positions : remorque8Positions;
    };

    const selectedCamion = camions.find((c) => c._id === selectedVehiculeId);
    const selectedRemorque = remorques.find((r) => r._id === selectedVehiculeId);
    const expectedPneus = vehiculeType === 'camion' ? 6 : remorqueEssieux;
    const missingPneus = expectedPneus - pneus.length;

    const pneusStats = {
        bon: pneus.filter((p) => p.statut === 'bon').length,
        use: pneus.filter((p) => p.statut === 'use').length,
        a_changer: pneus.filter((p) => p.statut === 'a_changer').length,
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
                    Maintenance - État des pneus
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Visualisez l'état des pneus de vos véhicules
                </Typography>
            </Box>

            {/* Sélection du véhicule */}
            <Card sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                <Stack spacing={3}>
                    {/* Toggle Camion/Remorque */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            Type de véhicule :
                        </Typography>
                        <ToggleButtonGroup
                            value={vehiculeType}
                            exclusive
                            onChange={handleVehiculeTypeChange}
                            size="small"
                        >
                            <ToggleButton value="camion" sx={{ px: 3 }}>
                                <LocalShipping sx={{ mr: 1 }} /> Camion (6 pneus)
                            </ToggleButton>
                            <ToggleButton value="remorque" sx={{ px: 3 }}>
                                <RvHookup sx={{ mr: 1 }} /> Remorque
                            </ToggleButton>
                        </ToggleButtonGroup>

                        {vehiculeType === 'remorque' && (
                            <ToggleButtonGroup
                                value={remorqueEssieux}
                                exclusive
                                onChange={(_, v) => v && setRemorqueEssieux(v)}
                                size="small"
                            >
                                <ToggleButton value={8}>8 pneus</ToggleButton>
                                <ToggleButton value={12}>12 pneus</ToggleButton>
                            </ToggleButtonGroup>
                        )}
                    </Box>

                    {/* Sélection véhicule spécifique */}
                    <FormControl fullWidth sx={{ maxWidth: 400 }}>
                        <InputLabel>
                            {vehiculeType === 'camion' ? 'Sélectionner un camion' : 'Sélectionner une remorque'}
                        </InputLabel>
                        <Select
                            value={selectedVehiculeId}
                            label={vehiculeType === 'camion' ? 'Sélectionner un camion' : 'Sélectionner une remorque'}
                            onChange={(e) => setSelectedVehiculeId(e.target.value)}
                        >
                            {vehiculeType === 'camion'
                                ? camions.map((c) => (
                                      <MenuItem key={c._id} value={c._id}>
                                          {c.immatriculation} - {c.marque} {c.modele}
                                      </MenuItem>
                                  ))
                                : remorques.map((r) => (
                                      <MenuItem key={r._id} value={r._id}>
                                          {r.immatriculation} - {r.type}
                                      </MenuItem>
                                  ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Card>

            {/* Contenu principal */}
            {selectedVehiculeId ? (
                loadingPneus ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {/* Infos véhicule et stats */}
                        <Card sx={{ flex: '1 1 300px', p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                {vehiculeType === 'camion' ? (
                                    <>
                                        <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        {selectedCamion?.immatriculation}
                                    </>
                                ) : (
                                    <>
                                        <RvHookup sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        {selectedRemorque?.immatriculation}
                                    </>
                                )}
                            </Typography>

                            {vehiculeType === 'camion' && selectedCamion && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedCamion.marque} {selectedCamion.modele}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Kilométrage: {selectedCamion.kilometrage.toLocaleString()} km
                                    </Typography>
                                </Box>
                            )}

                            {vehiculeType === 'remorque' && selectedRemorque && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Type: {selectedRemorque.type}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Capacité: {selectedRemorque.capacite.toLocaleString()} kg
                                    </Typography>
                                </Box>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                État des pneus ({pneus.length}/{expectedPneus})
                            </Typography>

                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircle sx={{ color: statutColors.bon, fontSize: 20 }} />
                                    <Typography variant="body2">Bon état: {pneusStats.bon}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Warning sx={{ color: statutColors.use, fontSize: 20 }} />
                                    <Typography variant="body2">Usé: {pneusStats.use}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ErrorIcon sx={{ color: statutColors.a_changer, fontSize: 20 }} />
                                    <Typography variant="body2">À changer: {pneusStats.a_changer}</Typography>
                                </Box>
                            </Stack>

                            {missingPneus > 0 && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    {missingPneus} pneu{missingPneus > 1 ? 's' : ''} non enregistré{missingPneus > 1 ? 's' : ''}
                                </Alert>
                            )}

                            {pneusStats.a_changer > 0 && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {pneusStats.a_changer} pneu{pneusStats.a_changer > 1 ? 's' : ''} à changer !
                                </Alert>
                            )}
                        </Card>

                        {/* Visualisation graphique */}
                        <Card sx={{ flex: '2 1 400px', p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                                Vue des pneus
                            </Typography>

                            <Paper
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: 400,
                                    height: vehiculeType === 'camion' ? 350 : remorqueEssieux === 12 ? 400 : 320,
                                    mx: 'auto',
                                    bgcolor: '#f5f5f5',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Corps du véhicule */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '30%',
                                        right: '30%',
                                        top: vehiculeType === 'camion' ? '10%' : '15%',
                                        bottom: vehiculeType === 'camion' ? '10%' : '15%',
                                        bgcolor: vehiculeType === 'camion' ? '#1976d2' : '#9c27b0',
                                        borderRadius: vehiculeType === 'camion' ? '8px 8px 4px 4px' : 2,
                                        opacity: 0.3,
                                    }}
                                />

                                {/* Cabine du camion */}
                                {vehiculeType === 'camion' && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: '35%',
                                            right: '35%',
                                            top: '5%',
                                            height: '15%',
                                            bgcolor: '#1976d2',
                                            borderRadius: '8px 8px 0 0',
                                            opacity: 0.5,
                                        }}
                                    />
                                )}

                                {/* Pneus */}
                                {getPositions().map((pos) => {
                                    const pneu = getPneuByPosition(pos.id);
                                    const color = pneu ? statutColors[pneu.statut] : '#bdbdbd';
                                    const statusLabel = pneu ? statutLabels[pneu.statut] : 'Non enregistré';

                                    return (
                                        <Tooltip
                                            key={pos.id}
                                            title={
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {pos.label}
                                                    </Typography>
                                                    {pneu ? (
                                                        <>
                                                            <Typography variant="caption" display="block">
                                                                Marque: {pneu.marque}
                                                            </Typography>
                                                            <Typography variant="caption" display="block">
                                                                État: {statusLabel}
                                                            </Typography>
                                                            <Typography variant="caption" display="block">
                                                                Km: {pneu.kmInstallation.toLocaleString()} / {pneu.kmLimite.toLocaleString()}
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <Typography variant="caption" color="warning.main">
                                                            Pneu non enregistré
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                            arrow
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    left: `${pos.x}%`,
                                                    top: `${pos.y}%`,
                                                    transform: 'translate(-50%, -50%)',
                                                    width: 40,
                                                    height: 60,
                                                    bgcolor: color,
                                                    borderRadius: '8px',
                                                    border: '3px solid #333',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': {
                                                        transform: 'translate(-50%, -50%) scale(1.1)',
                                                        zIndex: 10,
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: '#fff',
                                                        fontWeight: 600,
                                                        fontSize: 9,
                                                        textAlign: 'center',
                                                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                                    }}
                                                >
                                                    {pos.id}
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                    );
                                })}

                                {/* Légende direction */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        color: '#666',
                                        fontWeight: 500,
                                    }}
                                >
                                    ▲ AVANT
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        color: '#666',
                                        fontWeight: 500,
                                    }}
                                >
                                    ▼ ARRIÈRE
                                </Typography>
                            </Paper>

                            {/* Légende des couleurs */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                                <Chip
                                    icon={<CheckCircle sx={{ color: `${statutColors.bon} !important` }} />}
                                    label="Bon état"
                                    variant="outlined"
                                    size="small"
                                />
                                <Chip
                                    icon={<Warning sx={{ color: `${statutColors.use} !important` }} />}
                                    label="Usé"
                                    variant="outlined"
                                    size="small"
                                />
                                <Chip
                                    icon={<ErrorIcon sx={{ color: `${statutColors.a_changer} !important` }} />}
                                    label="À changer"
                                    variant="outlined"
                                    size="small"
                                />
                                <Chip
                                    label="Non enregistré"
                                    variant="outlined"
                                    size="small"
                                    sx={{ borderColor: '#bdbdbd' }}
                                />
                            </Box>
                        </Card>
                    </Box>
                )
            ) : (
                <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 3 }}>
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        {vehiculeType === 'camion' ? (
                            <LocalShipping sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        ) : (
                            <RvHookup sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        )}
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Sélectionnez un véhicule
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Choisissez un {vehiculeType} pour voir l'état de ses pneus
                        </Typography>
                    </Box>
                </Card>
            )}
        </Box>
    );
};

export default Maintenance;
