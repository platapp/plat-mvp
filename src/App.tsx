import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {
  getCustomerInfo,
  getTransactionInfo,
  getAccountInfo,
  getRewards,
  getAuth
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
} from "react-router-dom";

const Customer = "Clark Kent"
//TODO make client id a variable
const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}/${process.env.REACT_APP_CLIENT_ID}`
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
  const [accounts, setAccounts] = useState<Record<L, AccountInfo> | undefined>(undefined)
  const [customer, setCustomer] = useState<Customer | undefined>(undefined)
  const [transactions, setTransactions] = useState<Transaction | undefined>(undefined)
  const [rewards, setRewards] = useState<Reward[] | undefined>(undefined)
  console.log(accessToken)
  console.log(accounts)
  console.log(customer)
  console.log(transactions)
  console.log(rewards)

  useEffect(() => {
    console.log("inside get info effect")
    if (accessToken === undefined) {
      window.location.href = LOGIN_URL //redirect to login
    }
    else {
      getCustomerInfo(accessToken).then(setCustomer)
      getTransactionInfo(accessToken).then(setTransactions)
      getAccountInfo(accessToken).then(setAccounts)
      getRewards(accessToken).then(setRewards)
    }
  }, [accessToken])
  return (
    <Container>

      <div className="display-4 mb-5">Hello {Customer}</div>
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
