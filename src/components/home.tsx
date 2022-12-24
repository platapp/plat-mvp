import React, { useState } from 'react';
import '../styles.css';
import Cookies from 'js-cookie'
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
    NavLink,
    Outlet,
    NavLinkProps,
    useNavigation
} from "react-router-dom";

import { Customer } from '../services/fdx'
import { BankLogin, generateInitialData, BankLoginType } from '../state/bankLogin';

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


const extractBanksFromCookies = (cookieObject: { [name: string]: string }) => {
    return Object.keys(cookieObject).map(k => {
        return k.startsWith("token_") ? k.replace("token_", "") : ""

    }).reduce((aggr, curr) => {
        return curr === "" ? aggr : { ...aggr, [curr]: true }
    }, {})
}

const mergeBanks = (cookieBanks: { [name: string]: boolean }, banks: BankLoginType[]) => {
    return banks.map(({ bankName }) => ({ bankName, isLoggedIn: bankName in cookieBanks }))
}
const initBanks = generateInitialData()
const Home = () => {
    console.log(Cookies.get())
    //const user = useLoaderData() as Customer
    const [mobileOpen, setMobileOpen] = useState(false);
    const bankLogin = mergeBanks(extractBanksFromCookies(Cookies.get()), initBanks)
    console.log(bankLogin)
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const navigation = useNavigation()
    return <div className="full">
        <Box sx={{ display: 'flex' }}>
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

                    <BankLogin.Provider value={bankLogin}>
                        <Outlet />
                    </BankLogin.Provider>
                    <div className="center">
                        {navigation.state === "loading" && <CircularProgress />}
                    </div>
                </Container>
            </Box>
        </Box>
    </div>
}

export default Home;
