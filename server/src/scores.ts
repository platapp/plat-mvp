import { Transactions, Accounts, Account, AccountTypes, Customer, extractObjFromKey, BalanceType, Statement } from './service'

interface AccountSummary {
    count: number,
    totalBalance: number,
    balanceKey: string,
    minDateOpened: string
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

export const minStatementDate = (statements: Statement[]) => {
    return statements.length > 0 ? statements.map(statement => statement.statementDate).reduce((aggr, curr) => aggr > curr ? curr : aggr) : ""
}

export const accountTypes = (accounts: Accounts[], statements: Statement[]) => {
    const ACCOUNT_TYPE_MAP: HoldAccounts = {
        [AccountTypes.DepositAccount]: { minDateOpened: "", count: 0, totalBalance: 0, balanceKey: "currentBalance" as BalanceType },
        [AccountTypes.LoanAccount]: { minDateOpened: "", count: 0, totalBalance: 0, balanceKey: "principalBalance" as BalanceType },
        [AccountTypes.LocAccount]: { minDateOpened: "", count: 0, totalBalance: 0, balanceKey: "principalBalance" as BalanceType },
        [AccountTypes.InvestmentAccount]: { minDateOpened: "", count: 0, totalBalance: 0, balanceKey: "currentValue" as BalanceType },
        [AccountTypes.InsuranceAccount]: { minDateOpened: "", count: 0, totalBalance: 0, balanceKey: "policyCoverageAmount" as BalanceType },
        [AccountTypes.AnnuityAccount]: { minDateOpened: "", count: 0, totalBalance: 0, balanceKey: "surrenderValue" as BalanceType },
    }
    return accounts.reduce((aggr, curr) => {
        const account = extractObjFromKey(curr)
        const statementsForAccount = statements.filter(statement => statement.accountId === account?.accountId)
        const minStatementDateForAccount = minStatementDate(statementsForAccount)
        if (account && account.status === "OPEN") {
            const element: AccountSummary = aggr[account.type]
            element.count += 1
            const balance = account[element.balanceKey as keyof Account] as number | undefined
            element.totalBalance += balance || 0
            if (element.minDateOpened && minStatementDateForAccount) {
                element.minDateOpened = element.minDateOpened > minStatementDateForAccount ? minStatementDateForAccount : element.minDateOpened
            }
            else if (minStatementDateForAccount) {
                element.minDateOpened = minStatementDateForAccount
            }
        }
        return aggr
    }, ACCOUNT_TYPE_MAP)
}

