import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
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
                        p: 4,
                        mt: 8,
                        minHeight: 'calc(100vh - 64px)',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
