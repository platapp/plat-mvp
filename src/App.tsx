import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { getCustomerInfo, getTransactionInfo, getAccountInfo } from './services/fdx';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Container from '@mui/material/Container';
//<Slider aria-label="Volume" value={40} /> 

const Customer = "Clark Kent"

const LABELS = {
  annuityAccount: "annuities",
  depositAccount: "deposit accounts",
  insuranceAccount: "insurance accounts",
  investmentAccount: "investment accounts",
  loanAccount: "loans",
  locAccount: "LOCs",
  totalTransactions: "Number of transaction in last 12 months",
  averageTransactionSize: "Average transaction size"
}

interface AccountInfo {
  count: number,
  totalBalance: number
}
interface Transaction {
  totalTransactions: number,
  averageTransactionSize: number
}
interface Customer {
  customerLocation: string,
  customerAge: number
}

interface AccountCardProps {
  accountType: string,
  count?: number,
  totalBalance?: number
}
const AccountCard = ({ accountType, totalBalance, count }: AccountCardProps) => {
  return <Card >
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {accountType}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {count ? `You have ${count} ${accountType} accounts with a total value of ${totalBalance}` : `You don't have any ${accountType}!`}
      </Typography>
    </CardContent>
    {!count && <CardActions>
      <Button size="small">Create Account</Button>
      <Button size="small" href="http://www.google.com">Learn More</Button>
    </CardActions>}
  </Card>
}

type L = keyof typeof LABELS
function App() {
  const [accounts, setAccounts] = useState<Record<L, AccountInfo> | undefined>(undefined)
  const [customer, setCustomer] = useState<Customer | undefined>(undefined)
  const [transactions, setTransactions] = useState<Transaction | undefined>(undefined)

  console.log(accounts)
  console.log(customer)
  console.log(transactions)

  useEffect(() => {
    getCustomerInfo().then(setCustomer)
    getTransactionInfo().then(setTransactions)
    getAccountInfo().then(setAccounts)
  }, [])
  return (
    <Container>
      <div className="display-4 mb-5">Hello {Customer}</div>
      {
        accounts ? <Grid container spacing={2} rowSpacing={2}>{
          Object.entries(accounts).map(([key, value]) => {
            return <Grid xs={12} sm={6}>
              <AccountCard accountType={LABELS[key as L]} totalBalance={value.totalBalance} count={value.count} />
            </Grid>
          })}
        </Grid> : <CircularProgress />
      }
    </Container>

  );
}

export default App;
