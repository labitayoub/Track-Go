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
    Avatar,
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

const DRAWER_WIDTH = 280;

interface MenuItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
    chauffeurOnly?: boolean;
}

const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Chauffeurs', path: '/chauffeurs', icon: <People />, adminOnly: true },
    { label: 'Camions', path: '/camions', icon: <LocalShipping />, adminOnly: true },
    { label: 'Remorques', path: '/remorques', icon: <RvHookup />, adminOnly: true },
    { label: 'Pneus', path: '/pneus', icon: <TireRepair /> },
    { label: 'Trajets', path: '/trajets', icon: <Route /> },
    { label: 'Maintenance', path: '/maintenance', icon: <Build /> },
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
                    bgcolor: '#ffffff',
                    borderRight: '1px solid #e0e0e0',
                    boxShadow: '0 0 20px rgba(0,0,0,0.05)',
                },
            }}
        >
            {/* Logo */}
            <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
                        <LocalShipping sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            Track Go
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                            Gestion de flotte
                        </Typography>
                    </Box>
                </Box>

                {/* User info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#e3f2fd', color: '#1976d2', fontSize: '0.875rem' }}>
                        {user?.nom?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.nom}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', textTransform: 'capitalize' }}>
                            {user?.role}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Navigation */}
            <List sx={{ px: 2, py: 3 }}>
                {filteredMenuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 3,
                                    py: 1.5,
                                    px: 2,
                                    bgcolor: isActive ? '#f0f7ff' : 'transparent',
                                    border: isActive ? '1px solid #e3f2fd' : '1px solid transparent',
                                    '&:hover': {
                                        bgcolor: isActive ? '#f0f7ff' : '#f8f9fa',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? '#1976d2' : '#666',
                                        minWidth: 36,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 500 : 400,
                                        fontSize: '0.9rem',
                                        color: isActive ? '#1976d2' : '#1a1a1a',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};

export { DRAWER_WIDTH };
export default Sidebar;
