
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useLoaderData } from 'react-router-dom';
export interface Reward {
    programName: string,
    programUrl: string,
}
const Rewards = () => {
    const rewards = useLoaderData() as Reward[] | undefined
    return <Grid container spacing={2} rowSpacing={2}>
        {
            rewards && rewards.map(({ programName, programUrl }, index) => {
                return <Grid xs={12} sm={6} key={index}>
                    Reward program {programName}.  Url is {programUrl}.
                </Grid>
            })
        }
    </Grid>
}
export default Rewards