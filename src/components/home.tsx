import React, { useEffect, useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import { MenuItems } from '../routes/children'


import {
    useLoaderData,
    useSearchParams,
    NavLink,
    Outlet,
    NavLinkProps
} from "react-router-dom";

import { Customer } from '../services/fdx'


export interface User extends Customer {
    accessToken: string
}
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
    const user = useLoaderData() as User | undefined //will only return User since if not a user, then will redirect
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const [searchParams, setSearchParams] = useSearchParams()

    //remove the search parameters.  I wish I could do this in a redirect in the loader, but I don't believe I can  
    useEffect(() => {
        Array.from(searchParams.keys()).forEach(v => {
            searchParams.delete(v);
        })
        setSearchParams(searchParams); //this forces a reload of this component since this is a redirect
    }, [searchParams, setSearchParams])

    return <Box sx={{ display: 'flex' }}>
        <CssBaseline />
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
                {user ?
                    <><Typography gutterBottom variant="h3" component="div"> Hello {user.name.first} {user.name.last}</Typography><Outlet /></> :
                    <CircularProgress />
                }
            </Container>

        </Box>
    </Box>

}

export default Home;
