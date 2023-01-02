import { useState } from 'react'
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Customer } from '../services/fdx';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useNavigate, useLoaderData } from 'react-router-dom';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const Register = () => {
    const customerData = useLoaderData() as { customer: Customer, bankName: string }[] | undefined
    const query = customerData?.map(v => `${v.bankName}=true`).join("&")
    const navigate = useNavigate();
    const [customerWithCheck, setCustomerWithCheck] = useState(
        customerData && customerData.map(({ bankName, customer }) => {
            return {
                bankName,
                selected: false,
                customer
            }
        })
    )

    const selectBank = (event: SelectChangeEvent) => {
        const selection = event.target.value as string
        setCustomerWithCheck(v => v?.map(v => v.bankName === selection ? { ...v, selected: true } : { ...v, selected: false }))
    }
    const selectedCustomerAttributes = customerWithCheck?.find(v => v.selected)
    const selectedBank = selectedCustomerAttributes?.bankName// || ""

    return <div>
        <Grid container spacing={2} rowSpacing={2}>
            <Grid xs={6}>
                <h1>Account Registration</h1>
                <p>Choose which profile you would like to register with us.</p>
                <br/>
                <FormControl sx={{ m: 1, minWidth: '100%' }}>
                    <InputLabel id="demo-simple-select-helper-label">Choose Bank</InputLabel>
                    <Select
                        value={selectedBank}
                        label="Select bank to populate information"
                        onChange={selectBank}
                    >
                        {customerWithCheck?.map(v => <MenuItem key={v.bankName} value={v.bankName}>{v.bankName}</MenuItem>)}
                    </Select>
                </FormControl>

                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField fullWidth id="firstName" label="First Name" variant="standard" value={selectedCustomerAttributes?.customer.name.first || ""} />
                    <TextField fullWidth id="lastName" label="Last Name" variant="standard" value={selectedCustomerAttributes?.customer.name.last || ""} />
                    <TextField fullWidth id="dob" label="Date of Birth" variant="standard" value={selectedCustomerAttributes?.customer.dateOfBirth || ""} />
                    <TextField fullWidth id="city" label="City" variant="standard" value={selectedCustomerAttributes?.customer.addresses[0].city || ""} />
                    <TextField fullWidth id="postalCode" label="Zip Code" variant="standard" value={selectedCustomerAttributes?.customer.addresses[0].postalCode || ""} />
                </Box>
                <Button 
                    variant="contained" 
                    onClick={() => navigate(`/accounts?${query}`)}
                    sx={{ mt:5 }}
                > Create account
                </Button> {/*todo, make this submit to bank prior to redirect to accounts*/}
            </Grid>
        </Grid >
    </div>
}
export default Register