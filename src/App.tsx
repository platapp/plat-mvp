import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { getCustomerInfo, getTransactionInfo, getAccountInfo } from './services/fdx';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
//<Slider aria-label="Volume" value={40} /> 

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
type L = keyof typeof LABELS
function App() {
  const [accounts, setAccounts] = useState<Record<L, AccountInfo> | undefined>(undefined)
  const [customer, setCustomer] = useState<Customer | undefined>(undefined)
  const [transactions, setTransactions] = useState<Transaction | undefined>(undefined)
  useEffect(() => {
    getCustomerInfo().then(setCustomer)
    getTransactionInfo().then(setTransactions)
    getAccountInfo().then(setAccounts)
  }, [])
  return (
    <div className="App">

      {accounts ? Object.entries(accounts).map(([key, value]) => {
        return <Typography variant="h4" >
          {value.count ? `You have ${value.count} ${LABELS[key as L]}` : `You don't have any ${LABELS[key as L]}, open one here or click here to learn more!`}
        </Typography>
      }) : <CircularProgress />}
    </div>
  );
}

export default App;
