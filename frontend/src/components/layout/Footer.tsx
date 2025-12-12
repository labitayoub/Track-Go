import { Box, Typography, Link } from '@mui/material';
import { DRAWER_WIDTH } from './Sidebar';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                ml: `${DRAWER_WIDTH}px`,
                py: 2,
                px: 3,
                bgcolor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    © {new Date().getFullYear()} <strong>Track Go</strong>. Tous droits réservés.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Link
                        href="#"
                        underline="hover"
                        sx={{ color: '#64748b', fontSize: '0.875rem' }}
                    >
                        Support
                    </Link>
                    <Link
                        href="#"
                        underline="hover"
                        sx={{ color: '#64748b', fontSize: '0.875rem' }}
                    >
                        Documentation
                    </Link>
                    <Link
                        href="#"
                        underline="hover"
                        sx={{ color: '#64748b', fontSize: '0.875rem' }}
                    >
                        Conditions d'utilisation
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;
