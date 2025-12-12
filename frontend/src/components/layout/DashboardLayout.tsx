import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const DashboardLayout = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: `calc(100% - ${DRAWER_WIDTH}px)`,
                }}
            >
                {/* Navbar */}
                <Navbar />

                {/* Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        mt: 8, // Offset for fixed AppBar
                    }}
                >
                    <Toolbar /> {/* Spacer */}
                    <Outlet />
                </Box>

                {/* Footer */}
                <Footer />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
