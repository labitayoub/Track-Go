import { useAuth } from '../../context/AuthContext';
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
                borderBottom: '1px solid #e2e8f0',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left side - Page title or breadcrumb */}
                <Box>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                        Tableau de bord
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
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
                        <IconButton sx={{ color: '#64748b' }}>
                            <Notifications />
                        </IconButton>
                    </Tooltip>

                    {/* User info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                bgcolor: user?.role === 'admin' ? '#ef4444' : '#22c55e',
                                width: 40,
                                height: 40,
                                fontSize: '0.9rem',
                                fontWeight: 600,
                            }}
                        >
                            {user?.nom ? getInitials(user.nom) : 'U'}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: '#1e293b' }}
                            >
                                {user?.nom}
                            </Typography>
                            <Chip
                                label={user?.role === 'admin' ? 'Administrateur' : 'Chauffeur'}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    bgcolor: user?.role === 'admin' ? '#fef2f2' : '#f0fdf4',
                                    color: user?.role === 'admin' ? '#dc2626' : '#16a34a',
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Logout button */}
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Logout />}
                        onClick={logout}
                        sx={{
                            borderColor: '#e2e8f0',
                            color: '#64748b',
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: '#ef4444',
                                color: '#ef4444',
                                bgcolor: '#fef2f2',
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
