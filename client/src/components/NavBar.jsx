import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}))

const Navbar = () => {
    const { logout, user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();

    const handleMenu = (event) => {
        if (anchorEl) {
            setAnchorEl(null);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

    const menuItems = user ? [
        { text: 'Dashboard', link: '/dashboard-navigation' },
        { text: 'Profile', link: '/profile' },
        { text: 'Logout', onClick: handleLogout }
    ] : [
        { text: 'Login', link: '/login' },
        { text: 'Register', link: '/register' }
    ];

    return (
        <StyledAppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Environmental Monitoring
                    </Link>
                </Typography>
                {location.pathname !== '/' && <ThemeToggle />}
                {isMobile ? (
                    <Box>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenu}
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    marginTop: '8px', // Add some top margin
                                },
                            }}
                        >
                            {menuItems.map((item) => (
                                <MenuItem
                                    key={item.text}
                                    onClick={item.onClick || handleClose}
                                    component={item.link ? Link : 'li'}
                                    to={item.link}
                                >
                                    {item.text}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                ) : (
                    <>
                        {menuItems.map((item) => (
                            <Button
                                key={item.text}
                                color="inherit"
                                component={item.link ? Link : 'button'}
                                to={item.link}
                                onClick={item.onClick}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </>
                )}
            </Toolbar>
        </StyledAppBar>
    );
};

export default Navbar;