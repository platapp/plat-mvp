import React from 'react';
import Grid from '@mui/material/Grid';
const Placeholder = () => {
    return <Grid container spacing={2}>
        <Grid item lg={12} xl={6}>
            <h1>Placeholder for submission</h1>
            <h4 className="fw-light">Congrats! You have finished transferring your accounts (but not for real!).  A real implementation would have to actually do the transfer and account open work.</h4>
        </Grid>
    </Grid>
}
export default Placeholder