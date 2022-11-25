
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useEffect, useState } from 'react';
import { getRewards } from '../services/fdx';
import { CircularProgress } from '@mui/material';
import { useRouteLoaderData } from 'react-router-dom';
import { User } from './home';
interface Reward {
    programName: string,
    programUrl: string,
}
const Rewards = () => {
    const user = useRouteLoaderData("root") as User | undefined
    const [rewards, setRewards] = useState<Reward[] | undefined>(undefined)
    const accessToken = user?.accessToken
    useEffect(() => {
        if (accessToken) {
            getRewards(accessToken).then(setRewards)
        }
    }, [accessToken])
    return <Grid container spacing={2} rowSpacing={2}>
        {
            rewards ?
                rewards.map(({ programName, programUrl }, index) => {
                    return <Grid xs={12} sm={6} key={index}>
                        Reward program {programName}.  Url is {programUrl}.
                    </Grid>
                }) : <CircularProgress />
        }
    </Grid>
}
export default Rewards