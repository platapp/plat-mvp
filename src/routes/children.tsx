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
        icon: < AccountBalanceWalletIcon />,
        element: <Accounts />
    },
    {
        name: "Transactions",
        route: "/transactions",
        icon: <PaymentsIcon />,
        element: <Transactions />
    },
    {
        name: "Rewards",
        route: "/rewards",
        icon: <CardMembershipIcon />,
        element: <Rewards />
    }
]
