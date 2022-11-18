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
  
  console.log(accounts)
  console.log(customer)
  console.log(transactions)

  useEffect(() => {
    getCustomerInfo().then(setCustomer)
    getTransactionInfo().then(setTransactions)
    getAccountInfo().then(setAccounts)
  }, [])
  return (
		<div>
			<div className="display-4 mb-5">Dashboard</div>
			<div className="row row-cols-1 row-cols-md-2 g-4">
				{
					accounts ? Object.entries(accounts).map(([key, value]) => {
						return <div>
							<div className="col">
								<div className="card">
									<div className="card-body">
										<h5 className="card-title">
											<a
												className="text-capitalize text-decoration-none h4"
												data-bs-toggle="modal" 
												data-bs-target={ "#" + LABELS[key as L] }
												href="#"
											> {LABELS[key as L]} 
											</a>
										</h5>

										<p className="card-text" style={{ minHeight: "10vh" }}
											> 
												{value.count ? 
													`You have ${value.count} ${LABELS[key as L]} with a total balance of $${value.totalBalance}`
													: `You don't have any ${LABELS[key as L]}, open one here or click here to learn more!`}
										</p>

										<div className="modal fade" id={LABELS[key as L]} aria-labelledby="modalLabel" aria-hidden="true">
											<div className="modal-dialog modal-fullscreen">
												<div className="modal-content">
													<div className="modal-header">
														<h1 className="modal-title fs-5 text-capitalize" id="modalLabel">{LABELS[key as L]}</h1>
														<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<p>
															Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
														</p>
													</div>
													<div className="modal-footer">
														<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
													</div>
												</div>
											</div>
										</div>

									</div>
								</div>
							</div>
						</div>
					}) : <CircularProgress />
				}
			</div>
		</div>
		);
	}

export default App;
