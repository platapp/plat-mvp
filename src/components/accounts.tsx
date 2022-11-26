import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useLoaderData } from 'react-router-dom';
interface AccountCardProps {
    accountType: string,
    count?: number,
    totalBalance?: number
}

export interface AccountInfo {
    count: number,
    totalBalance: number
}
const LABELS = {
    annuityAccount: "Annuities",
    depositAccount: "Deposit accounts",
    insuranceAccount: "Insurance accounts",
    investmentAccount: "Investment accounts",
    loanAccount: "Loans",
    locAccount: "LOCs",
    totalTransactions: "Number of transaction in last 12 months",
    averageTransactionSize: "Average transaction size"
}

export type L = keyof typeof LABELS

const AccountCard = ({ accountType, totalBalance, count }: AccountCardProps) => {
    return <Card >
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {accountType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {count ? `You have ${count} ${accountType} with a total value of ${totalBalance}` : `You don't have any ${accountType}!`}
            </Typography>
        </CardContent>
        {!count && <CardActions>
            <Button size="small">Create Account</Button>
            <Button size="small" href="http://www.google.com">Learn More</Button>
        </CardActions>}
    </Card>
}
const Accounts = () => {
    const accounts = useLoaderData() as Record<L, AccountInfo> | undefined
    return <Grid container spacing={2} rowSpacing={2}>{
        accounts && Object.entries(accounts).map(([key, value]) => {
            return <Grid xs={12} sm={6} key={key}>
                <AccountCard accountType={LABELS[key as L]} totalBalance={value.totalBalance} count={value.count} />
            </Grid>
        })}
    </Grid>
}
export default Accounts