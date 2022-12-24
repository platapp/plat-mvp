import { useState } from 'react'
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Customer } from '../services/fdx';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useNavigate, useLoaderData } from 'react-router-dom';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

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
    const selectedBank = (selectedCustomerAttributes || (customerWithCheck ? customerWithCheck[0] : { bankName: "" })).bankName
    return <Grid container spacing={2} rowSpacing={2}>
        <Grid xs={12}>
            <Select
                value={selectedBank}
                label="Select bank to populate information"
                onChange={selectBank}
            >
                {customerWithCheck?.map(v => <MenuItem key={v.bankName} value={v.bankName}>{v.bankName}</MenuItem>)}
            </Select>
        </Grid>
        <Grid xs={12}>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="firstName" label="First Name" variant="standard" value={selectedCustomerAttributes?.customer.name.first || ""} />
                <TextField id="lastName" label="Last Name" variant="standard" value={selectedCustomerAttributes?.customer.name.last || ""} />
                <TextField id="dob" label="Date of Birth" variant="standard" value={selectedCustomerAttributes?.customer.dateOfBirth || ""} />
                <TextField id="city" label="City" variant="standard" value={selectedCustomerAttributes?.customer.addresses[0].city || ""} />
                <TextField id="postalCode" label="Zip Code" variant="standard" value={selectedCustomerAttributes?.customer.addresses[0].postalCode || ""} />
            </Box>
        </Grid>
        {/*todo, make this submit to bank prior to redirect to accounts*/}
        <Button variant="contained" onClick={() => navigate(`/accounts?${query}`)}>Create account</Button>
    </Grid >
}
export default Register