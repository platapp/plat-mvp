import React, { useEffect, useState } from 'react';
import './App.css';
import {
  getCustomerInfo,
  getTransactionInfo,
  getAccountInfo,
  getRewards,
} from './services/fdx';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Container from '@mui/material/Container';
import {
  useLoaderData,
  useSearchParams
} from "react-router-dom";

const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}/${process.env.REACT_APP_CLIENT_ID}`
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

interface AccountInfo {
  count: number,
  totalBalance: number
}
interface Transaction {
  totalTransactions: number,
  averageTransactionSize: number
}
interface Name {
  first: string,
  last: string
}
interface Customer {
  customerLocation: string,
  customerAge: number,
  name: Name
}

interface AccountCardProps {
  accountType: string,
  count?: number,
  totalBalance?: number
}

interface Reward {
  programName: string,
  programUrl: string,
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
  const accessToken = useLoaderData() as string | undefined
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsString = searchParams.toString() //to check if I can load

  const [accounts, setAccounts] = useState<Record<L, AccountInfo> | undefined>(undefined)
  const [customer, setCustomer] = useState<Customer | undefined>(undefined)
  const [transactions, setTransactions] = useState<Transaction | undefined>(undefined)
  const [rewards, setRewards] = useState<Reward[] | undefined>(undefined)
  console.log(accounts)
  console.log(customer)
  console.log(transactions)
  console.log(rewards)

  //remove the search parameters.  I wish I could do this in a redirect in the loader, but I don't believe I can  
  useEffect(() => {
    Array.from(searchParams.keys()).forEach(v => {
      searchParams.delete(v);
    })
    setSearchParams(searchParams); //this forces a reload of this component since this is a redirect
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (accessToken === undefined) {
      window.location.href = LOGIN_URL //redirect to login
    }
    else if (!searchParamsString) { //only load after the searchParam redirect
      console.log(accessToken)
      getCustomerInfo(accessToken).then(setCustomer)
      getTransactionInfo(accessToken).then(setTransactions)
      getAccountInfo(accessToken).then(setAccounts)
      getRewards(accessToken).then(setRewards)
    }
  }, [accessToken, searchParamsString])
  return (
    <Container>
      <div className="display-4 mb-5">Hello {customer?.name.first} {customer?.name.last}</div>
      {
        accounts ? <Grid container spacing={2} rowSpacing={2}>{
          Object.entries(accounts).map(([key, value]) => {
            return <Grid xs={12} sm={6} key={key}>
              <AccountCard accountType={LABELS[key as L]} totalBalance={value.totalBalance} count={value.count} />
            </Grid>
          })}
        </Grid> : <CircularProgress />
      }
    </Container>

  );
}

export default App;
