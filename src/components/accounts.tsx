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
    locAccount: "LOCs"
}


export type L = keyof typeof LABELS

interface AccountCardProps {
    accountType: L,
    accountLabel: string,
    count: number,
    totalBalance: number,
    checked: boolean,
    setChecked: () => void
}

const DepositCard = ({ totalBalance, count }: AccountInfo) => {
    return totalBalance > 20000 ? <p>Good News! Based on your history at other institutions, we can add an additional 25 basis points on top of our already great rates.
        Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of deposits held <span hidden>for at least 3 years</span> at any institution quality for an additional 25 basis points on their transferred deposits.
    </p> : <p>Based on your history at other institutions, you qualify for our standard pricing. Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of deposits held at any institution quality for an additional 25 basis points on their transferred deposits.</p>
}


const LoanCard = ({ totalBalance, count }: AccountInfo) => {
    return totalBalance > 20000 ? <p>
        Good News! Based on your history at other institutions, we can lower your rate by 25 basis points on top of our already great rates.
        Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of loans held at any institution quality for an additional 25 basis point off their transferred loans.
    </p> : <p>
        Based on your history at other institutions, you qualify for our standard pricing. Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of loans held at any institution quality for an additional 25 basis points off their transferred loans.
    </p>
}

const LOCCard = ({ totalBalance, count }: AccountInfo) => {
    return totalBalance > 20000 ? <p>
        Good News! Based on your history at other institutions, we can lower your rate by 25 basis points on top of our already great rates.
        Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of loans held at any institution quality for an additional 25 basis point off their transferred LOCs.
    </p> : <p>
        Based on your history at other institutions, you qualify for our standard pricing. Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of LOCs held at any institution quality for an additional 25 basis points off their transferred loans.
    </p>
}

const AnnuityCard = ({ totalBalance, count }: AccountInfo) => {
    return totalBalance > 20000 ? <p>
        Good News! Based on your history at other institutions, we can waive fees associated with your annuity!
    </p> : <p>
        Based on your history at other institutions, you qualify for our standard pricing.
    </p>
}

const InsuranceCard = ({ totalBalance, count }: AccountInfo) => {
    return totalBalance > 20000 ? <p>
        Good News! Based on your history at other institutions, we can lower your monthly premium!
    </p> : <p>
        Based on your history at other institutions, you qualify for our standard pricing.
    </p>
}

const InvestmentCard = ({ totalBalance, count }: AccountInfo) => {
    return totalBalance > 20000 ? <p>
        Good News! Based on your history at other institutions, we can waive fees associated with your investments!
    </p> : <p>
        Based on your history at other institutions, you qualify for our standard pricing.
    </p>
}

const accountCard = {
    annuityAccount: AnnuityCard,
    depositAccount: DepositCard,
    insuranceAccount: InsuranceCard,
    investmentAccount: InvestmentCard,
    loanAccount: LoanCard,
    locAccount: LOCCard,
}


const AccountCard = ({ accountType, accountLabel, totalBalance, count, checked, setChecked }: AccountCardProps) => {
    return <Card>
        <CardContent>
            <Typography gutterBottom variant="h6" component="div">
                {accountLabel}
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
                <p>You have {count} {accountLabel} with a total value of ${totalBalance}</p>
                <div>
                    {
                        totalBalance >= 20000 && accountType === "Deposit accounts" ?
                            <p>
                                Good News! Based on your history at other institutions, we can add an additional 25 basis points on top of our already great rates.
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of deposits held at any institution quality for an additional 25 basis points on their transferred deposits.
                            </p>
                        : ""
                    }
                    {
                        totalBalance < 20000 && accountType === "Deposit accounts" ?
                            <p>
                                Based on your history at other institutions, you qualify for our standard pricing. 
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of deposits held at any institution quality for an additional 25 basis points on their transferred deposits.
                            </p> 
                        : ""
                    }
                    {
                        totalBalance >= 20000 && accountType === "Loans" ?
                            <p>
                                Good News! Based on your history at other institutions, we can remove an additional 25 basis points on top of our already great rates.
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of loans held at any institution quality for an additional 25 basis points on their transferred loans.
                            </p>
                        : ""
                    }
                    {
                        totalBalance < 20000 && accountType === "Loans" ?
                            <p>
                                Based on your history at other institutions, you qualify for our standard pricing. 
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of loans held at any institution quality for an additional 25 basis points on their transferred loans.
                            </p> 
                        : ""
                    }
                    {
                        totalBalance >= 20000 && accountType === "LOCs" ?
                            <p>
                                Good News! Based on your history at other institutions, we can remove an additional 25 basis points on top of our already great rates.
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of LOCs held at any institution quality for an additional 25 basis points on their transferred LOCs.
                            </p>
                        : ""
                    }
                    {
                        totalBalance < 20000 && accountType === "LOCs" ?
                            <p>
                                Based on your history at other institutions, you qualify for our standard pricing. 
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of LOCs held at any institution quality for an additional 25 basis points on their transferred LOCs.
                            </p> 
                        : ""
                    }
                    {
                        totalBalance >= 20000 && accountType === "Investment accounts" ?
                            <p>
                                Good News! Based on your history at other institutions, we can remove fees on top of our already great pricing.
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of Investment accounts held at any institution quality for an additional 25 basis points on their transferred Investment accounts.
                            </p>
                        : ""
                    }
                    {
                        totalBalance < 20000 && accountType === "Investment accounts" ?
                            <p>
                                Based on your history at other institutions, you qualify for our standard pricing. 
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of Investment accounts held at any institution quality for an additional 25 basis points on their transferred Investment accounts.
                            </p> 
                        : ""
                    }
                    {
                        totalBalance >= 20000 && accountType === "Insurance accounts" ?
                            <p>
                                Good News! Based on your history at other institutions, we can remove fees on top of our already great pricing.
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of Insurance accounts held at any institution quality for an additional 25 basis points on their transferred Insurance accounts.
                            </p>
                        : ""
                    }
                    {
                        totalBalance < 20000 && accountType === "Insurance accounts" ?
                            <p>
                                Based on your history at other institutions, you qualify for our standard pricing. 
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of Insurance accounts held at any institution quality for an additional 25 basis points on their transferred Insurance accounts.
                            </p> 
                        : ""
                    }
                    {
                        totalBalance >= 20000 && accountType === "Annuities" ?
                            <p>
                                Good News! Based on your history at other institutions, we can remove fees on top of our already great pricing.
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of Annuities held at any institution quality for an additional 25 basis points on their transferred Annuities.
                            </p>
                        : ""
                    }
                    {
                        totalBalance < 20000 && accountType === "Annuities" ?
                            <p>
                                Based on your history at other institutions, you qualify for our standard pricing. 
                                
                                Does your current bank value you as a customer? At ABC Bank, customers with over $20,000 of Annuities held at any institution quality for an additional 25 basis points on their transferred Annuities.
                            </p> 
                        : ""
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
                    .map(([key, value]) => ({ bankName, accountType: key as L, accountLabel: LABELS[key as L], ...value, checked: false }))
            }
        })
    )
    const navigate = useNavigate();

    const setChecked = (bankName: string, accountType: L) => () => setAccountsWithChecked(
        v => v?.map(banks => banks.bankName === bankName ?
            {
                bankName,
                accounts: banks.accounts.map(account => account.accountType === accountType ? { ...account, checked: !account.checked } : account)
            }
            : banks)
    )

    return <div>
        <Grid xs={12} sx={{ mb: 10 }}>
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
                            accounts.map(({ bankName, totalBalance, checked, count, accountType, accountLabel }) => {
                                return <Grid xs={12} key={accountType}>
                                    <div className="singleCard">
                                        <AccountCard
                                            accountType={accountType}
                                            accountLabel={accountLabel}
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