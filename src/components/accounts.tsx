import { useState } from 'react'
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useLoaderData } from 'react-router-dom';
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
            </Typography>
            <Typography variant="body2" color="text.secondary">
                You have {count} {accountType} with a total value of ${totalBalance}
            </Typography>
        </CardContent>
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
                    label={ `Transfer` }
                />
            </FormGroup>
        </CardActions>
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

    const setChecked = (bankName: string, accountType: string) => () => setAccountsWithChecked(
        v => v?.map(banks => banks.bankName === bankName ?
            {
                bankName,
                accounts: banks.accounts.map(account => account.accountType === accountType ? { ...account, checked: !account.checked } : account)
            }
            : banks)
    )

    return <div>
            {
                accountsWithChecked && accountsWithChecked?.map(({ accounts, bankName }) => {
                    return <Grid container key={bankName}>
                        <Grid xs={12}>
                            <h3>{bankName}</h3>
                        </Grid>
                        <Grid xs={12} xl={8} className="cardGroup">
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
        <Button variant="contained" onClick={() => alert("Submitted, placeholder for now")}>Submit</Button>
    </div>
}
export default Accounts