import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useLoaderData } from 'react-router-dom';
export interface Transaction {
    totalTransactions: number,
    averageTransactionSize: number
}
const Transactions = () => {
    const transactions = useLoaderData() as Transaction | undefined
    return <Grid container spacing={2} rowSpacing={2}>
        {
            transactions && <>
                <Grid xs={12} sm={6} >
                    Average transaction size: {transactions.averageTransactionSize.toFixed(2)}
                </Grid>
                <Grid xs={12} sm={6} >
                    Total transactions: {transactions.totalTransactions}
                </Grid>
            </>
        }
    </Grid>
}
export default Transactions