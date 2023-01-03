import React, { useState } from 'react';
import '../styles.css';
import Cookies from 'js-cookie'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { MenuItems, RELATIONSHIP_URL } from '../routes/children'
import { logout } from '../utils';
import {
    Outlet,
    useNavigation,
    useLocation,
    Link
} from "react-router-dom";


import { BankLogin, generateInitialData, BankLoginType } from '../state/bankLogin';


const welcome = (
    <p>Welcome to Plat Onboarding!  Click <Link to={RELATIONSHIP_URL}>here</Link> to start!</p>
)

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
    const [mobileOpen, setMobileOpen] = useState(false);
    const bankLogin = mergeBanks(extractBanksFromCookies(Cookies.get()), initBanks)
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const navigation = useNavigation()
    const location = useLocation()
    return <div className="full">
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"

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
                component="main"
                sx={{ flexGrow: 1, pt: 3, m: 5 }}
            >
                <Container maxWidth="xl">
                    <Toolbar />
                    <BankLogin.Provider value={bankLogin}>
                        {location.pathname === "/" && welcome}
                        <Stepper activeStep={MenuItems.map(v => v.route).indexOf(location.pathname)} alternativeLabel sx={{mb:10}}>
                            {MenuItems.filter((_, index, arr) => index < arr.length - 1).map(({ name, route, icon }) => {
                                const stepProps: { completed?: boolean } = {};
                                const labelProps: {
                                    optional?: React.ReactNode;
                                } = {};
                                return (
                                    <Step key={name} {...stepProps}>
                                        <StepLabel {...labelProps}>{name}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
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
