import React, { useState, useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { routeToFDXLogin } from '../utils';
import { BankLogin } from '../state/bankLogin';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


//todo, get list of FDX banks (and preferably with icons!) who have registered with Plat
//TODO the routeToFDXLogin should be different per bank in reality
const BankListItem = ({ bankName, isLoggedIn, checked, setChecked }: { bankName: string, isLoggedIn: boolean, checked: boolean, setChecked: () => void }) => {
    const labelId = `checkbox-list-label-${bankName}`;

    // dialog
    const [open, setOpen] = React.useState(false)
    const handleClickOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    return <ListItem
        key={bankName}
        secondaryAction={
            <ListItemButton
                role={undefined}
                onClick={isLoggedIn ? setChecked : undefined}
                dense
            >
                <Checkbox
                    edge="start"
                    disabled={!isLoggedIn}
                    checked={checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                />
            </ListItemButton>

        }
        disablePadding
    >
        <ListItemIcon>

            {
                isLoggedIn ?
                    <IconButton edge="end" aria-label="comments">
                        <CheckCircleOutlineIcon />
                    </IconButton>
                    : <IconButton edge="end" aria-label="comments" onClick={handleClickOpen}>
                        <LoginIcon />
                    </IconButton>
            }

        </ListItemIcon>

        <ListItemText id={labelId} primary={bankName} />

        <Dialog
            //fullScreen
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Bank Login</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Note that this is a simulated login used to demonstrate a pain-point during an account transfer process. Customers will have to log into each banking platform/website to load their own account during this account transfer process.
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    id="loginUser"
                    label="Username"
                    variant="standard"
                    fullWidth
                    sx={{ mb: 5 }}
                    defaultValue="User1"
                />

                <TextField
                    id="loginPass"
                    label="Password"
                    type="password"
                    variant="standard"
                    fullWidth
                    sx={{ mb: 5 }}
                    defaultValue="Password1"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={routeToFDXLogin}>Login</Button>
            </DialogActions>
        </Dialog>
    </ListItem >
}

export default function ListBanks() {
    const bankLogin = useContext(BankLogin).map(({ bankName, isLoggedIn }) => ({ bankName, isLoggedIn, isChecked: false }))
    const [bankInfo, setBankInfo] = useState(bankLogin)
    const setChecked = (bankName: string) => () => setBankInfo(v => v.map(v => v.bankName === bankName ? ({ ...v, isChecked: !v.isChecked }) : v))
    const navigate = useNavigate();
    const selectedBanks = bankInfo.filter(v => v.isChecked).map(v => v.bankName)
    const [searchQuery, setSearchQuery] = useState("")
    const searchBanks = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const search = event.target.value as string
        setSearchQuery(search)
    }
    const query = selectedBanks.map(v => `${v}=true`).join("&")
    const bankSearch = searchQuery ? bankInfo.filter(({ bankName }) => bankName.toLowerCase().startsWith(searchQuery.toLowerCase())) : bankInfo
    return <>
        <Grid container spacing={2}>
            <Grid item lg={12}>
                <h1>Financial History</h1>
                <p>Let's look your financial history. The more we know about you, the more we can help you save!</p>
                <TextField
                    id="ListBanksSearch"
                    label="Search Banks"
                    variant="standard"
                    type="search"
                    value={searchQuery}
                    sx={{ width: "100%", mb: 2 }}
                    onChange={searchBanks}
                />

                <div className="scrollBox">
                    <List>
                        <li className="bankListHeader MuiListItem-root MuiListItem-gutters css-g28sfz-MuiListItem-root">
                            <div className="MuiListItemIcon-root css-cveggr-MuiListItemIcon-root">Login</div>
                            <div className="MuiListItemText-root css-tlelie-MuiListItemText-root">Financial Institution Name</div>
                            <div className="MuiListItemSecondaryAction-root css-518kzi-MuiListItemSecondaryAction-root">Transfer</div>
                        </li>
                        {
                            bankSearch.map(({ bankName, isLoggedIn, isChecked }) => <BankListItem
                                bankName={bankName}
                                isLoggedIn={isLoggedIn}
                                checked={isChecked}
                                setChecked={setChecked(bankName)}
                                key={bankName}
                            />)
                        }
                    </List>
                </div>

                <Button
                    variant="contained"
                    onClick={() => navigate(`/register?${query}`)}
                > Next
                </Button>
            </Grid>
        </Grid>
    </>
}