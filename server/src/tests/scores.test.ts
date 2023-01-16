import { averageTransactions, accountTypes } from '../scores'
import { Accounts, AccountTypes, TransactionTypes, Transactions } from '../service';

describe('averageTransactions', () => {
    test('averageTransactions returns elements greater than timestamp', () => {
        const transactions: Transactions[] = [
            {
                [TransactionTypes.DepositTransaction]: {
                    postedTimestamp: '2021-11-05T13:15:31.751Z',
                    amount: 4.0,
                    transactionId: "12345",
                    description: "hello world",
                    transactionCategory: "DEPOSIT_ACCOUNT_TRANSACTION"
                }
            },
            {
                [TransactionTypes.DepositTransaction]: {
                    postedTimestamp: '2021-11-05T13:15:31.751Z',
                    amount: 6.0,
                    transactionId: "12345",
                    description: "hello world",
                    transactionCategory: "DEPOSIT_ACCOUNT_TRANSACTION"
                }
            }]
        expect(averageTransactions(transactions, '2017-11-05T13:15:31.751Z')).toEqual({ totalTransactions: 2, averageTransactionSize: 5.0 })
    });
    test('averageTransactions returns no elements if before timestamp', () => {
        const transactions: Transactions[] = [{
            [TransactionTypes.DepositTransaction]: {
                postedTimestamp: '2017-11-05T13:15:31.751Z',
                amount: 4.0,
                transactionId: "12345",
                description: "hello world",
                transactionCategory: "DEPOSIT_ACCOUNT_TRANSACTION"
            }
        },
        {
            [TransactionTypes.DepositTransaction]: {
                postedTimestamp: '2017-11-05T13:15:31.751Z',
                amount: 6.0,
                transactionId: "12345",
                description: "hello world",
                transactionCategory: "DEPOSIT_ACCOUNT_TRANSACTION"
            }
        }]
        expect(averageTransactions(transactions, '2020-11-05T13:15:31.751Z')).toEqual({ totalTransactions: 0, averageTransactionSize: 0 })
    });
});

describe('accountTypes', () => {
    test('open accounts are mapped', () => {
        const accounts: Accounts[] = [{
            [AccountTypes.DepositAccount]: {
                status: "OPEN",
                accountId: "12345",
                currentBalance: 400.0
            }
        },
        {
            [AccountTypes.DepositAccount]: {
                status: "OPEN",
                accountId: "23451",
                currentBalance: 300.0
            }
        },
        {
            [AccountTypes.LoanAccount]: {
                status: "OPEN",
                accountId: "34512",
                principalBalance: 300.0
            }
        }
        ]
        const statements = [{
            accountId: "34512",
            statementDate: "2020-01-01",
            statementId: "1234"
        }, {
            accountId: "34512",
            statementDate: "2021-01-01",
            statementId: "1235"
        }]
        expect(accountTypes(accounts, statements)).toEqual({
            depositAccount: { minDateOpened: "", count: 2, totalBalance: 700.0, balanceKey: "currentBalance", },
            loanAccount: { minDateOpened: "2020-01-01", count: 1, totalBalance: 300.0, balanceKey: "principalBalance", },
            locAccount: { minDateOpened: "", count: 0, totalBalance: 0.0, balanceKey: "principalBalance", },
            investmentAccount: { minDateOpened: "", count: 0, totalBalance: 0.0, balanceKey: "currentValue", },
            insuranceAccount: { minDateOpened: "", count: 0, totalBalance: 0.0, balanceKey: "policyCoverageAmount", },
            annuityAccount: { minDateOpened: "", count: 0, totalBalance: 0.0, balanceKey: "surrenderValue", }
        })
    })
})