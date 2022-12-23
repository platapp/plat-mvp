import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PaymentsIcon from '@mui/icons-material/Payments';
import Accounts, { AccountInfo, L } from '../components/accounts'
import Transactions, { Transaction } from '../components/transactions'
import Rewards, { Reward } from '../components/rewards'
import { ActionFunctionArgs } from "react-router-dom";

import { getAccountInfo, getTransactionInfo, getRewards } from '../services/fdx';
import ListBanks from '../components/listBanks';
export const MenuItems = [
    {
        name: "Accounts",
        route: "/accounts",
        icon: <AccountBalanceWalletIcon />,
        element: <Accounts />,
        loader: async ({ request }: ActionFunctionArgs): Promise<{ account: Record<L, AccountInfo>, bankName: string }[]> => {
            console.log(request)
            const url = new URL(request.url);
            const bankNames = [...url.searchParams.keys()]
            const accounts = await Promise.all(bankNames.map(getAccountInfo))
            return accounts.map((account, index) => ({ account, bankName: bankNames[index] }))

        }
    },
    {
        name: "Existing Relationships",
        route: "/relationships",
        icon: <AccountTreeIcon />,
        element: <ListBanks />,
        /*loader: async ({ request }: ActionFunctionArgs): Promise<Record<L, AccountInfo>> => {
            return getAccountInfo()
        }*/
    },
    {
        name: "Transactions",
        route: "/transactions",
        icon: <PaymentsIcon />,
        element: <Transactions />,
        //loader: async ({ request }: ActionFunctionArgs): Promise<Transaction> => {
        //return getTransactionInfo()
        //}
    },
    {
        name: "Rewards",
        route: "/rewards",
        icon: <CardMembershipIcon />,
        element: <Rewards />,
        //loader: async ({ request }: ActionFunctionArgs): Promise<Reward[]> => {
        //return getRewards()
        //}
    }
]
