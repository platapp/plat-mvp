import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { MenuItems } from '../routes/children'
import { logout } from '../utils';
import {
    useLoaderData,
    NavLink,
    Outlet,
    NavLinkProps,
    useNavigation
} from "react-router-dom";

import { Customer } from '../services/fdx'


const navLinkCssClasses = (otherClasses: string) => ({ isActive }: { isActive: boolean }): string => {
    return isActive ? `${otherClasses} Mui-selected` : otherClasses
}
const MyOwnNavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps & { className: string }>((props: NavLinkProps & { className: string }, ref) => {
    return <NavLink ref={ref} {...props} className={navLinkCssClasses(props.className || "")} />
})
const drawer = (
    <div>
        <Toolbar />
        <Divider />
        <List>
            {MenuItems.map(({ name, route, icon }) => (
                <ListItem key={name} disablePadding>
                    <ListItemButton component={MyOwnNavLink} to={route} >
                        <ListItemIcon>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </div>
);

const drawerWidth = 240 //TODO, make this variable
const container = window !== undefined ? () => window.document.body : undefined;

const Home = () => {
    const user = useLoaderData() as Customer
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const navigation = useNavigation()
    return <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Plat
                </Typography>
                <Tooltip title="Token refresh">
                    <IconButton
                        color="inherit"
                        aria-label="logout"
                        edge="end"
                        onClick={logout}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box >
        <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
            <Container>
                <Toolbar />
                <Typography gutterBottom variant="h3" component="div">
                    {user && `Hello ${user.name.first} ${user.name.last}`}
                </Typography>
                <Outlet />
                {navigation.state === "loading" && <CircularProgress />}
            </Container>
        </Box>
    </Box>

}

export default Home;
