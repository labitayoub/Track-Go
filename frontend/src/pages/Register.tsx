import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";

const Register = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const role = "chauffeur";
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas");
    }

    if (password.length < 6) {
      return setError("Le mot de passe doit contenir au moins 6 caractères");
    }

    try {
      await register({ nom, email, password, telephone, role });
      alert("Inscription réussie ! Votre compte est en attente d'activation par un administrateur.");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Erreur");
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f5f5f5',
      py: 4
    }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <PersonAdd sx={{ fontSize: 50, color: '#2e7d32', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Inscription
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Créer un compte chauffeur
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            type="tel"
            label="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          
          <TextField
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            type="password"
            label="Confirmer mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            color="success"
            size="large"
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Se connecter
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;

