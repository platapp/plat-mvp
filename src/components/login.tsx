import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

const Login = () => {
    return <Grid container spacing={2} rowSpacing={2}>
        <Grid xs={12} sm={6} >
            Logging in, please wait..
        </Grid>
    </Grid>
}
export default Login