import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
} from '@mui/material';
import {
    Dashboard,
    LocalShipping,
    RvHookup,
    Route,
    TireRepair,
    Build,
    People,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

interface MenuItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
    chauffeurOnly?: boolean;
}

const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Camions', path: '/camions', icon: <LocalShipping />, adminOnly: true },
    { label: 'Remorques', path: '/remorques', icon: <RvHookup />, adminOnly: true },
    { label: 'Trajets', path: '/trajets', icon: <Route /> },
    { label: 'Pneus', path: '/pneus', icon: <TireRepair />, adminOnly: true },
    { label: 'Maintenance', path: '/maintenance', icon: <Build />, adminOnly: true },
    { label: 'Chauffeurs', path: '/chauffeurs', icon: <People />, adminOnly: true },
];

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const filteredMenuItems = menuItems.filter((item) => {
        if (item.adminOnly && user?.role !== 'admin') return false;
        if (item.chauffeurOnly && user?.role !== 'chauffeur') return false;
        return true;
    });

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: '#1e293b',
                    color: 'white',
                    borderRight: 'none',
                },
            }}
        >
            {/* Logo */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 3,
                    py: 3,
                }}
            >
                <LocalShipping sx={{ fontSize: 36, color: '#3b82f6' }} />
                <Box>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, letterSpacing: 1, color: 'white' }}
                    >
                        Track Go
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        Gestion de Flotte
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: '#334155', mx: 2 }} />

            {/* Navigation */}
            <List sx={{ px: 2, py: 2 }}>
                {filteredMenuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    bgcolor: isActive ? '#3b82f6' : 'transparent',
                                    '&:hover': {
                                        bgcolor: isActive ? '#3b82f6' : '#334155',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? 'white' : '#94a3b8',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: '0.95rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Footer info */}
            <Box sx={{ mt: 'auto', p: 2 }}>
                <Divider sx={{ borderColor: '#334155', mb: 2 }} />
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', textAlign: 'center' }}>
                    Version 1.0.0
                </Typography>
            </Box>
        </Drawer>
    );
};

export { DRAWER_WIDTH };
export default Sidebar;
