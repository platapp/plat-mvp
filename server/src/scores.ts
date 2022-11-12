import { Transaction, Account, Accounts, AccountTypes } from './service'

interface AccountSummary {
    count: number,
    totalBalance: number
}
export type HoldAccounts = Record<AccountTypes, AccountSummary>
export const averageTransactions = (transactions: Transaction[], beginTimestamp: string) => {
    const { total, totalSum } = transactions.filter(t => t.processedTimestamp > beginTimestamp).reduce((aggr, curr) => {
        aggr.total += 1
        aggr.totalSum += curr.amount
        return aggr
    }, { total: 0, totalSum: 0 })

    return {
        totalTransactions: total,
        averageTransactionSize: total > 0 ? totalSum / total : 0
    }
}

const ACCOUNT_TYPE_MAP: HoldAccounts = {
    [AccountTypes.DepositAccount]: { count: 0, totalBalance: 0 },
    [AccountTypes.LoanAccount]: { count: 0, totalBalance: 0 },
    [AccountTypes.LocAccount]: { count: 0, totalBalance: 0 },
    [AccountTypes.InvestmentAccount]: { count: 0, totalBalance: 0 },
    [AccountTypes.InsuranceAccount]: { count: 0, totalBalance: 0 },
    [AccountTypes.AnnuityAccount]: { count: 0, totalBalance: 0 },
}

export const accountTypes = (accounts: Accounts[]) => {
    return accounts.reduce((aggr, curr) => {
        const [account] = Object.keys(curr) as AccountTypes[]
        const acct: Account | undefined = curr[account]
        const element: AccountSummary = aggr[account]
        if (acct && acct.status === "OPEN") {
            element.count += 1
            element.totalBalance += ("currentBalance" in acct) ? acct.currentBalance : acct.principalBalance
        }
        return aggr
    }, ACCOUNT_TYPE_MAP)
}