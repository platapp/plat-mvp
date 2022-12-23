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
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
//todo, get list of FDX banks (and preferably with icons!) who have registered with Plat
//TODO the routeToFDXLogin should be different per bank in reality
const BankListItem = ({ bankName, isLoggedIn, checked, setChecked }: { bankName: string, isLoggedIn: boolean, checked: boolean, setChecked: () => void }) => {
    const labelId = `checkbox-list-label-${bankName}`;
    return <ListItem
        key={bankName}
        secondaryAction={
            isLoggedIn ? <IconButton edge="end" aria-label="comments">
                <CheckCircleOutlineIcon />
            </IconButton> : <IconButton edge="end" aria-label="comments" onClick={routeToFDXLogin}>
                <LoginIcon />
            </IconButton>
        }
        disablePadding
    >
        <ListItemButton role={undefined} onClick={isLoggedIn ? setChecked : undefined} dense>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    disabled={!isLoggedIn}
                    checked={checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                />
            </ListItemIcon>
            <ListItemText id={labelId} primary={bankName} />
        </ListItemButton>
    </ListItem >
}

export default function ListBanks() {
    const bankLogin = useContext(BankLogin).map(({ bankName, isLoggedIn }) => ({ bankName, isLoggedIn, isChecked: false }))
    const [bankInfo, setBankInfo] = useState(bankLogin)
    const setChecked = (bankName: string) => () => setBankInfo(v => v.map(v => v.bankName === bankName ? ({ ...v, isChecked: !v.isChecked }) : v))
    const navigate = useNavigate();
    const selectedBanks = bankInfo.filter(v => v.isChecked).map(v => v.bankName)
    const query = selectedBanks.map(v => `${v}=true`).join("&")
    return <>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                bankInfo.map(({ bankName, isLoggedIn, isChecked }) => <BankListItem
                    bankName={bankName}
                    isLoggedIn={isLoggedIn}
                    checked={isChecked}
                    setChecked={setChecked(bankName)}
                />)
            }
        </List>
        <Button onClick={() => navigate(`/accounts?${query}`)}>Next</Button>
    </>
}