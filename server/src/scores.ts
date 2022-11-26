import { Transactions, Accounts, Account, AccountTypes, Customer, extractObjFromKey, BalanceType } from './service'

interface AccountSummary {
    count: number,
    totalBalance: number,
    balanceKey: string
}
export type HoldAccounts = Record<AccountTypes, AccountSummary>
export const averageTransactions = (transactions: Transactions[], beginTimestamp: string) => {
    const { total, totalSum } = transactions.reduce((aggr, curr) => {
        const transaction = extractObjFromKey(curr)
        if (transaction && transaction.postedTimestamp > beginTimestamp) {
            aggr.total += 1
            aggr.totalSum += transaction.amount
        }
        return aggr
    }, { total: 0, totalSum: 0 })

    return {
        totalTransactions: total,
        averageTransactionSize: total > 0 ? totalSum / total : 0
    }
}



export const accountTypes = (accounts: Accounts[]) => {
    const ACCOUNT_TYPE_MAP: HoldAccounts = {
        [AccountTypes.DepositAccount]: { count: 0, totalBalance: 0, balanceKey: "currentBalance" as BalanceType },
        [AccountTypes.LoanAccount]: { count: 0, totalBalance: 0, balanceKey: "principalBalance" as BalanceType },
        [AccountTypes.LocAccount]: { count: 0, totalBalance: 0, balanceKey: "principalBalance" as BalanceType },
        [AccountTypes.InvestmentAccount]: { count: 0, totalBalance: 0, balanceKey: "currentValue" as BalanceType },
        [AccountTypes.InsuranceAccount]: { count: 0, totalBalance: 0, balanceKey: "policyCoverageAmount" as BalanceType },
        [AccountTypes.AnnuityAccount]: { count: 0, totalBalance: 0, balanceKey: "surrenderValue" as BalanceType },
    }
    return accounts.reduce((aggr, curr) => {
        const account = extractObjFromKey(curr)
        if (account && account.status === "OPEN") {
            const element: AccountSummary = aggr[account.type]
            element.count += 1
            const balance = account[element.balanceKey as keyof Account] as number | undefined
            element.totalBalance += balance || 0
        }
        return aggr
    }, ACCOUNT_TYPE_MAP)
}

type Location = Record<string, number>
export const customerMetrics = (customer: Customer, currentDate: Date) => {
    const { name, dateOfBirth, addresses } = customer
    return {
        customerAge: currentDate.getFullYear() - new Date(dateOfBirth).getFullYear(),
        name,
        customerLocation: Object.entries(addresses.reduce<Location>((agg, curr) => {
            if (agg[curr.postalCode]) {
                agg[curr.postalCode] += 1
            }
            else {
                agg[curr.postalCode] = 1
            }
            return agg
        }, {})).reduce((aggr, [postalCode, numOccurance]) => {
            if (aggr.occur < numOccurance) {
                return { occur: numOccurance, postalCode }
            }
            else {
                return aggr
            }
        }, { occur: 0, postalCode: "" }).postalCode //selects postal code that shows up most frequently in the address list
    }
}