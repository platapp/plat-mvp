import { useState } from 'react'
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useLoaderData, useNavigate } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
interface AccountCardProps {
    accountType: string,
    count: number,
    totalBalance: number,
    checked: boolean,
    setChecked: () => void
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

const AccountCard = ({ accountType, totalBalance, count, checked, setChecked }: AccountCardProps) => {
    return <Card>
        <CardContent>
            <Typography gutterBottom variant="h6" component="div">
                {accountType}
                <CardActions className="alignRight">
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onClick={setChecked}
                                    disableRipple
                                    size="small"
                                />
                            }
                            label={`Transfer`}
                        />
                    </FormGroup>
                </CardActions>
            </Typography>

            <Typography variant="body2">
                <p>You have {count} {accountType} with a total value of ${totalBalance}</p>
                <div>
                    {
                        totalBalance >= 20000 && accountType === "Deposit accounts" ?
                            <p>
                                {totalBalance} Good News! Based on your history at other institutions, we can add an additional 25 basis points on top of our already great rates.
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of deposits held <span hidden>for at least 3 years</span> at any institution quality for an additional 25 basis points on their transferred deposits.
                            </p>
                        : 
                            ""
                    }
                    {
                        totalBalance < 20000 && accountType === "Deposit accounts" ?
                            <p>
                                Based on your history at other institutions, you qualify for our standard pricing. Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of deposits held at any institution quality for an additional 25 basis points on their transferred deposits.
                            </p> 
                        : 
                            ""
                    }
                    {
                        totalBalance >= 20000 && accountType === "Loans" ?
                            <p>
                                Good News! Based on your history at other institutions, we can add an additional 25 basis points on top of our already great rates.
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of loans held at any institution quality for an additional 25 basis points on their transferred loans.
                            </p>
                        : 
                            ""
                    }
                    {
                        totalBalance < 20000 && accountType === "Loans" ?
                            <p>
                                Based on your history at other institutions, you qualify for our standard pricing. Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of loans held at any institution quality for an additional 25 basis points on their transferred loans.
                            </p> 
                        : 
                            ""
                    }
                </div>
            </Typography>
        </CardContent>
    </Card>
}

const Accounts = () => {
    const accounts = useLoaderData() as { account: Record<L, AccountInfo>, bankName: string }[] | undefined
    const [accountsWithChecked, setAccountsWithChecked] = useState(
        accounts && accounts.map(({ bankName, account }) => {
            return {
                bankName,
                accounts: Object.entries(account)
                    .filter(([_key, value]) => value.count)
                    .map(([key, value]) => ({ bankName, accountType: LABELS[key as L], ...value, checked: false }))
            }
        })
    )
    const navigate = useNavigate();

    const setChecked = (bankName: string, accountType: string) => () => setAccountsWithChecked(
        v => v?.map(banks => banks.bankName === bankName ?
            {
                bankName,
                accounts: banks.accounts.map(account => account.accountType === accountType ? { ...account, checked: !account.checked } : account)
            }
            : banks)
    )

    return <div>
        <Grid xs={12} sx={{mb:10}}>
            <h2 className="fw-light">Bring your relationship with you.</h2>
            <h5 className="fw-light">Did you know that your history as a bank customer has value? Customers with great history can save and earn a lot of money.</h5>
        </Grid>

        {
            accountsWithChecked && accountsWithChecked?.map(({ accounts, bankName }) => {
                return <Grid container key={bankName}>
                    <Grid xs={12}>
                        <h3>{bankName}</h3>
                    </Grid>
                    <Grid xs={12} className="cardGroup">
                        {
                            accounts.map(({ bankName, totalBalance, checked, count, accountType }) => {
                                return <Grid xs={12} key={accountType}>
                                    <div className="singleCard">
                                        <AccountCard
                                            accountType={accountType}
                                            totalBalance={totalBalance}
                                            count={count}
                                            checked={checked}
                                            setChecked={setChecked(bankName, accountType)}
                                        /> {/* todo: list all accounts so that customers can choose what to transfer. also display how much money they can earn/save by switching to ABC Bank */}
                                    </div>
                                </Grid>
                            })
                        }
                    </Grid>
                </Grid>
            })
        }
        <Button variant="contained" onClick={() => navigate(`/placeholder`)}>Submit</Button>
    </div>
}
export default Accounts