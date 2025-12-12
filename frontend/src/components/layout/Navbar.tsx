import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Logout, Notifications } from '@mui/icons-material';
import { DRAWER_WIDTH } from './Sidebar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Tableau de bord';
            case '/chauffeurs': return 'Gestion des chauffeurs';
            case '/camions': return 'Gestion des camions';
            case '/remorques': return 'Gestion des remorques';
            case '/trajets': return 'Gestion des trajets';
            case '/pneus': return 'Gestion des pneus';
            case '/maintenance': return 'Maintenance';
            default: return 'Tableau de bord';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: `calc(100% - ${DRAWER_WIDTH}px)`,
                ml: `${DRAWER_WIDTH}px`,
                bgcolor: 'white',
                borderBottom: '1px solid #e0e0e0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left side - Page title or breadcrumb */}
                <Box>
                    <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 500 }}>
                        {getPageTitle()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        {new Date().toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Typography>
                </Box>

                {/* Right side - User info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Notifications */}
                    <Tooltip title="Notifications">
                        <IconButton sx={{ color: '#666', '&:hover': { bgcolor: '#f8f9fa' } }}>
                            <Notifications />
                        </IconButton>
                    </Tooltip>

                    {/* User info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                bgcolor: user?.role === 'admin' ? '#1976d2' : '#2e7d32',
                                width: 36,
                                height: 36,
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            }}
                        >
                            {user?.nom ? getInitials(user.nom) : 'U'}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 500, color: '#1a1a1a' }}
                            >
                                {user?.nom}
                            </Typography>
                            <Chip
                                label={user?.role === 'admin' ? 'Admin' : 'Chauffeur'}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 18,
                                    fontSize: '0.7rem',
                                    borderColor: user?.role === 'admin' ? '#1976d2' : '#2e7d32',
                                    color: user?.role === 'admin' ? '#1976d2' : '#2e7d32',
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Logout button */}
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<Logout />}
                        onClick={logout}
                        sx={{
                            color: '#666',
                            textTransform: 'none',
                            borderRadius: 2,
                            '&:hover': {
                                color: '#d32f2f',
                                bgcolor: '#ffebee',
                            },
                        }}
                    >
                        Déconnexion
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
