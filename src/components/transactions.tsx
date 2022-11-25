
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useEffect, useState } from 'react';
import { getTransactionInfo } from '../services/fdx';
import { useRouteLoaderData } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import { User } from './home';
interface Transaction {
    totalTransactions: number,
    averageTransactionSize: number
}
const Transactions = () => {
    const user = useRouteLoaderData("root") as User | undefined
    const [transactions, setTransactions] = useState<Transaction | undefined>(undefined)
    const accessToken = user?.accessToken
    useEffect(() => {
        if (accessToken) {
            getTransactionInfo(accessToken).then(setTransactions)
        }
    }, [accessToken])
    return <Grid container spacing={2} rowSpacing={2}>
        {
            transactions ?
                <>
                    <Grid xs={12} sm={6} >
                        Average transaction size: {transactions.averageTransactionSize.toFixed(2)}
                    </Grid>
                    <Grid xs={12} sm={6} >
                        Total transactions: {transactions.totalTransactions}
                    </Grid>
                </>
                : <CircularProgress />
        }
    </Grid>
}
export default Transactions