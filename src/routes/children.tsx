import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Accounts, { AccountInfo, L } from '../components/accounts'
import { ActionFunctionArgs } from "react-router-dom";

import { getAccountInfo, Customer, getCustomerInfo } from '../services/fdx';
import ListBanks from '../components/listBanks';
import Register from '../components/register';
import Placeholder from '../components/placeholder';
export const RELATIONSHIP_URL = "/relationships"
export const MenuItems = [
    {
        name: "Existing Relationships",
        route: RELATIONSHIP_URL,
        icon: <AccountTreeIcon />,
        element: <ListBanks />
    },
    {
        name: "Register New Bank",
        route: "/register",
        icon: <HowToRegIcon />,
        element: <Register />,
        loader: async ({ request }: ActionFunctionArgs): Promise<{ customer: Customer, bankName: string }[]> => {
            const url = new URL(request.url);
            const bankNames = [...url.searchParams.keys()]
            const customer = await Promise.all(bankNames.map(getCustomerInfo))
            return customer.map((customer, index) => ({ customer, bankName: bankNames[index] }))
        }
    },
    {
        name: "Transfer Accounts",
        route: "/accounts",
        icon: <AccountBalanceWalletIcon />,
        element: <Accounts />,
        loader: async ({ request }: ActionFunctionArgs): Promise<{ account: Record<L, AccountInfo>, bankName: string }[]> => {
            const url = new URL(request.url);
            const bankNames = [...url.searchParams.keys()]
            const accounts = await Promise.all(bankNames.map(getAccountInfo))
            return accounts.map((account, index) => ({ account, bankName: bankNames[index] }))
        }
    },
    {
        name: "Account setup complete",
        route: "/placeholder",
        element: <Placeholder />
    }
]
