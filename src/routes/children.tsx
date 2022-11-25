import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PaymentsIcon from '@mui/icons-material/Payments';
import Accounts from '../components/accounts'
import Transactions from '../components/transactions'
import Rewards from '../components/rewards'
export const MenuItems = [
    {
        name: "Accounts",
        route: "/accounts",
        //loader: getAccountInfo, //todo, how to pass access token??
        icon: < AccountBalanceWalletIcon />,
        element: <Accounts />
    },
    {
        name: "Transactions",
        route: "/transactions",
        //loader: getTransactionInfo,
        icon: <PaymentsIcon />,
        element: <Transactions />
    },
    {
        name: "Rewards",
        route: "/rewards",
        //loader: getRewards,
        icon: <CardMembershipIcon />,
        element: <Rewards />
    }
]
