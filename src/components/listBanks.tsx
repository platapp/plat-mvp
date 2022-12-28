import React, { useState, useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { routeToFDXLogin } from '../utils';
import { BankLogin } from '../state/bankLogin';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';



//todo, get list of FDX banks (and preferably with icons!) who have registered with Plat
//TODO the routeToFDXLogin should be different per bank in reality
const BankListItem = ({ bankName, isLoggedIn, checked, setChecked }: { bankName: string, isLoggedIn: boolean, checked: boolean, setChecked: () => void }) => {
    const labelId = `checkbox-list-label-${bankName}`;
    return <ListItem
        key={bankName}
        secondaryAction={
            <ListItemButton role={undefined} onClick={isLoggedIn ? setChecked : undefined} dense>
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
            {isLoggedIn ? <IconButton edge="end" aria-label="comments">
                <CheckCircleOutlineIcon />
            </IconButton> : <IconButton edge="end" aria-label="comments" onClick={routeToFDXLogin}>
                <LoginIcon />
            </IconButton>
            }
        </ListItemIcon>
        <ListItemText id={labelId} primary={bankName} />

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
    const bankSearch = searchQuery ? bankInfo.filter(({ bankName }) => bankName.startsWith(searchQuery)) : bankInfo
    return <>
        <Grid container spacing={2}>
            <Grid item lg={12} xl={6}>
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