import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,

  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {

  Delete as DeleteIcon,

  DirectionsCar as CamionIcon,
  LocalShipping as RemorqueIcon,
} from '@mui/icons-material';
import { pneuAPI, camionAPI, remorqueAPI } from '../services/api';

// Interfaces
interface Pneu {
  _id: string;
  vehiculeType: 'camion' | 'remorque';
  vehiculeId: string;
  position: string;
  marque: string;
  kmInstallation: number;
  kmLimite: number;
  statut: 'bon' | 'usé' | 'critique';
}

interface Vehicule {
  _id: string;
  immatriculation: string;
  nombreEssieux?: number;
}

// Positions des pneus
const camionPositions = ['AV-G', 'AV-D', 'AR1-G', 'AR1-D', 'AR2-G', 'AR2-D'];

const remorque8Positions = [
  'E1-G1', 'E1-G2', 'E1-D1', 'E1-D2',
  'E2-G1', 'E2-G2', 'E2-D1', 'E2-D2',
];

const remorque12Positions = [
  'E1-G1', 'E1-G2', 'E1-D1', 'E1-D2',
  'E2-G1', 'E2-G2', 'E2-D1', 'E2-D2',
  'E3-G1', 'E3-G2', 'E3-D1', 'E3-D2',
];

const Pneus = () => {
  // États
  const [pneus, setPneus] = useState<Pneu[]>([]);
  const [camions, setCamions] = useState<Vehicule[]>([]);
  const [remorques, setRemorques] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sélection du véhicule
  const [vehiculeType, setVehiculeType] = useState<'camion' | 'remorque'>('camion');
  const [selectedVehiculeId, setSelectedVehiculeId] = useState('');

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPneu, setEditingPneu] = useState<Pneu | null>(null);
  const [selectedPosition, setSelectedPosition] = useState('');

  // Formulaire
  const [formData, setFormData] = useState({
    marque: '',
    kmInstallation: 0,
    kmLimite: 50000,
    statut: 'bon' as 'bon' | 'usé' | 'critique',
  });

  // Charger les véhicules au démarrage
  useEffect(() => {
    const loadVehicules = async () => {
      try {
        const [camionsRes, remorquesRes] = await Promise.all([
          camionAPI.getAll(),
          remorqueAPI.getAll(),
        ]);
        setCamions(camionsRes.data);
        setRemorques(remorquesRes.data);
      } catch (err) {
        console.error('Erreur chargement véhicules:', err);
      }
    };
    loadVehicules();
  }, []);

  // Charger les pneus quand un véhicule est sélectionné
  useEffect(() => {
    if (selectedVehiculeId) {
      loadPneus();
    } else {
      setPneus([]);
    }
  }, [selectedVehiculeId, vehiculeType]);

  const loadPneus = async () => {
    if (!selectedVehiculeId) return;
    
    setLoading(true);
    try {
      const response = await pneuAPI.getByVehicule(vehiculeType, selectedVehiculeId);
      setPneus(response.data);
      setError('');
    } catch (err) {
      console.error('Erreur chargement pneus:', err);
      setError('Erreur lors du chargement des pneus');
    } finally {
      setLoading(false);
    }
  };

  // Obtenir les positions selon le type de véhicule
  const getPositions = (): string[] => {
    if (vehiculeType === 'camion') {
      return camionPositions;
    }
    
    const selectedRemorque = remorques.find(r => r._id === selectedVehiculeId);
    if (selectedRemorque?.nombreEssieux === 3) {
      return remorque12Positions;
    }
    return remorque8Positions;
  };

  // Trouver le pneu à une position
  const getPneuAtPosition = (position: string): Pneu | undefined => {
    return pneus.find(p => p.position === position);
  };

  // Couleur selon le statut
  const getStatutColor = (statut: string): string => {
    switch (statut) {
      case 'bon': return '#4caf50';
      case 'usé': return '#ff9800';
      case 'critique': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  // Ouvrir le dialog pour ajouter/modifier
  const handleOpenDialog = (position: string) => {
    const existingPneu = getPneuAtPosition(position);
    setSelectedPosition(position);
    
    if (existingPneu) {
      setEditingPneu(existingPneu);
      setFormData({
        marque: existingPneu.marque,
        kmInstallation: existingPneu.kmInstallation,
        kmLimite: existingPneu.kmLimite,
        statut: existingPneu.statut,
      });
    } else {
      setEditingPneu(null);
      setFormData({
        marque: '',
        kmInstallation: 0,
        kmLimite: 50000,
        statut: 'bon',
      });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPneu(null);
    setSelectedPosition('');
    setFormData({
      marque: '',
      kmInstallation: 0,
      kmLimite: 50000,
      statut: 'bon',
    });
  };

  const handleSubmit = async () => {
    try {
      const data = {
        vehiculeType,
        vehiculeId: selectedVehiculeId,
        position: selectedPosition,
        ...formData,
      };

      if (editingPneu) {
        await pneuAPI.update(editingPneu._id, data);
      } else {
        await pneuAPI.create(data);
      }

      handleCloseDialog();
      loadPneus();
    } catch (err) {
      console.error('Erreur sauvegarde pneu:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce pneu ?')) return;
    
    try {
      await pneuAPI.delete(id);
      loadPneus();
    } catch (err) {
      console.error('Erreur suppression:', err);
      setError('Erreur lors de la suppression');
    }
  };

  // Obtenir le nom du véhicule sélectionné
  const getSelectedVehiculeName = (): string => {
    if (!selectedVehiculeId) return '';
    
    if (vehiculeType === 'camion') {
      const camion = camions.find(c => c._id === selectedVehiculeId);
      return camion?.immatriculation || '';
    } else {
      const remorque = remorques.find(r => r._id === selectedVehiculeId);
      return remorque?.immatriculation || '';
    }
  };

  // Rendu d'un pneu graphique
  const renderTireBox = (position: string) => {
    const pneu = getPneuAtPosition(position);
    const isEmpty = !pneu;
    
    return (
      <Tooltip
        key={position}
        title={
          pneu
            ? `${position}: ${pneu.marque} - ${pneu.statut} (${pneu.kmInstallation} km)`
            : `${position}: Vide - Cliquer pour ajouter`
        }
        arrow
      >
        <Paper
          onClick={() => handleOpenDialog(position)}
          sx={{
            width: 70,
            height: 35,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isEmpty ? '#e0e0e0' : getStatutColor(pneu.statut),
            color: isEmpty ? '#666' : '#fff',
            cursor: 'pointer',
            borderRadius: 1,
            border: isEmpty ? '2px dashed #999' : 'none',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 3,
            },
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            {position}
          </Typography>
        </Paper>
      </Tooltip>
    );
  };

  // Rendu du camion
  const renderCamion = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">AVANT</Typography>
      
      {/* Essieu avant */}
      <Box sx={{ display: 'flex', gap: 4 }}>
        {renderTireBox('AV-G')}
        <Box sx={{ width: 80, height: 35, bgcolor: '#424242', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="white">Cabine</Typography>
        </Box>
        {renderTireBox('AV-D')}
      </Box>

      {/* Carrosserie */}
      <Box sx={{ width: 200, height: 60, bgcolor: '#616161', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CamionIcon sx={{ color: 'white', fontSize: 40 }} />
      </Box>

      {/* Essieu AR1 */}
      <Box sx={{ display: 'flex', gap: 4 }}>
        {renderTireBox('AR1-G')}
        <Box sx={{ width: 80, height: 35, bgcolor: '#424242', borderRadius: 1 }} />
        {renderTireBox('AR1-D')}
      </Box>

      {/* Essieu AR2 */}
      <Box sx={{ display: 'flex', gap: 4 }}>
        {renderTireBox('AR2-G')}
        <Box sx={{ width: 80, height: 35, bgcolor: '#424242', borderRadius: 1 }} />
        {renderTireBox('AR2-D')}
      </Box>

      <Typography variant="subtitle2" color="text.secondary">ARRIÈRE</Typography>
    </Box>
  );

  // Rendu d'un essieu de remorque
  const renderRemorqueEssieu = (essieuNum: number) => (
    <Box key={essieuNum} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {renderTireBox(`E${essieuNum}-G1`)}
        {renderTireBox(`E${essieuNum}-G2`)}
      </Box>
      <Box sx={{ width: 60, height: 35, bgcolor: '#424242', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" color="white">E{essieuNum}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {renderTireBox(`E${essieuNum}-D1`)}
        {renderTireBox(`E${essieuNum}-D2`)}
      </Box>
    </Box>
  );

  // Rendu de la remorque
  const renderRemorque = () => {
    const selectedRemorque = remorques.find(r => r._id === selectedVehiculeId);
    const nombreEssieux = selectedRemorque?.nombreEssieux || 2;
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">AVANT (Attelage)</Typography>
        
        {/* Attelage */}
        <Box sx={{ width: 40, height: 30, bgcolor: '#757575', borderRadius: '50%' }} />
        
        {/* Corps de la remorque */}
        <Box sx={{ width: 280, height: 80, bgcolor: '#616161', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RemorqueIcon sx={{ color: 'white', fontSize: 50 }} />
        </Box>

        {/* Essieux */}
        {Array.from({ length: nombreEssieux }, (_, i) => renderRemorqueEssieu(i + 1))}

        <Typography variant="subtitle2" color="text.secondary">ARRIÈRE</Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Gestion des Pneus
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Sélection du véhicule */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sélectionner un véhicule
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Type de véhicule */}
          <ToggleButtonGroup
            value={vehiculeType}
            exclusive
            onChange={(_, value) => {
              if (value) {
                setVehiculeType(value);
                setSelectedVehiculeId('');
                setPneus([]);
              }
            }}
            size="small"
          >
            <ToggleButton value="camion">
              <CamionIcon sx={{ mr: 1 }} />
              Camion
            </ToggleButton>
            <ToggleButton value="remorque">
              <RemorqueIcon sx={{ mr: 1 }} />
              Remorque
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Sélection du véhicule spécifique */}
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>
              {vehiculeType === 'camion' ? 'Camion' : 'Remorque'}
            </InputLabel>
            <Select
              value={selectedVehiculeId}
              onChange={(e) => setSelectedVehiculeId(e.target.value)}
              label={vehiculeType === 'camion' ? 'Camion' : 'Remorque'}
            >
              {(vehiculeType === 'camion' ? camions : remorques).map((v) => (
                <MenuItem key={v._id} value={v._id}>
                  {v.immatriculation}
                  {v.nombreEssieux && ` (${v.nombreEssieux} essieux)`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Légende */}
      {selectedVehiculeId && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip label="Bon" sx={{ bgcolor: '#4caf50', color: 'white' }} />
          <Chip label="Usé" sx={{ bgcolor: '#ff9800', color: 'white' }} />
          <Chip label="Critique" sx={{ bgcolor: '#f44336', color: 'white' }} />
          <Chip label="Vide" variant="outlined" />
        </Box>
      )}

      {/* Visualisation */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : selectedVehiculeId ? (
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {getSelectedVehiculeName()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Cliquez sur une position pour ajouter ou modifier un pneu
          </Typography>
          
          {vehiculeType === 'camion' ? renderCamion() : renderRemorque()}
          
          {/* Résumé */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Pneus installés: {pneus.length} / {getPositions().length}
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Sélectionnez un véhicule pour visualiser et gérer ses pneus
          </Typography>
        </Paper>
      )}

      {/* Liste des pneus (tableau récapitulatif) */}
      {pneus.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Liste des pneus installés
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {pneus.map((pneu) => (
              <Chip
                key={pneu._id}
                label={`${pneu.position}: ${pneu.marque}`}
                sx={{ bgcolor: getStatutColor(pneu.statut), color: 'white' }}
                onDelete={() => handleDelete(pneu._id)}
                onClick={() => handleOpenDialog(pneu.position)}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Dialog Ajouter/Modifier */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box>
            {editingPneu ? 'Modifier le pneu' : 'Ajouter un pneu'}
            <Typography variant="subtitle2" color="text.secondary" component="div">
              Position: {selectedPosition} - {getSelectedVehiculeName()}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Marque"
              value={formData.marque}
              onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Km à l'installation"
              type="number"
              value={formData.kmInstallation}
              onChange={(e) => setFormData({ ...formData, kmInstallation: Number(e.target.value) })}
              fullWidth
            />
            
            <TextField
              label="Km limite"
              type="number"
              value={formData.kmLimite}
              onChange={(e) => setFormData({ ...formData, kmLimite: Number(e.target.value) })}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value as 'bon' | 'usé' | 'critique' })}
                label="Statut"
              >
                <MenuItem value="bon">Bon</MenuItem>
                <MenuItem value="usé">Usé</MenuItem>
                <MenuItem value="critique">Critique</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          {editingPneu && (
            <Button 
              color="error" 
              onClick={() => {
                handleDelete(editingPneu._id);
                handleCloseDialog();
              }}
              startIcon={<DeleteIcon />}
            >
              Supprimer
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.marque}
          >
            {editingPneu ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pneus;
