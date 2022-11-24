import { averageTransactions, accountTypes, customerMetrics } from '../scores'
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
        expect(accountTypes(accounts)).toEqual({
            depositAccount: { count: 2, totalBalance: 700.0, balanceKey: "currentBalance", },
            loanAccount: { count: 1, totalBalance: 300.0, balanceKey: "principalBalance", },
            locAccount: { count: 0, totalBalance: 0.0, balanceKey: "principalBalance", },
            investmentAccount: { count: 0, totalBalance: 0.0, balanceKey: "currentValue", },
            insuranceAccount: { count: 0, totalBalance: 0.0, balanceKey: "policyCoverageAmount", },
            annuityAccount: { count: 0, totalBalance: 0.0, balanceKey: "surrenderValue", }
        })
    })
})

describe("customerMetrics", () => {
    it("gets rough years old", () => {
        const customer = {
            dateOfBirth: "2002-03-03",
            addresses: [
                {
                    city: "somecity",
                    postalCode: "12345"
                }
            ],
            name: {
                first: "daniel",
                last: "stahl"
            }
        }
        expect(customerMetrics(customer, new Date("2022-04-04"))).toEqual({
            customerAge: 20,
            customerLocation: "12345",
            name: {
                first: "daniel",
                last: "stahl"
            }
        })
    })
    it("gets customer location", () => {
        const customer = {
            dateOfBirth: "2002-03-03",
            addresses: [
                {
                    city: "somecity",
                    postalCode: "12345"
                },
                {
                    city: "somecity",
                    postalCode: "54321"
                },
                {
                    city: "somecity",
                    postalCode: "12345"
                }
            ],
            name: {
                first: "daniel",
                last: "stahl"
            }
        }
        expect(customerMetrics(customer, new Date("2022-04-04"))).toEqual({
            customerAge: 20,
            customerLocation: "12345",
            name: {
                first: "daniel",
                last: "stahl"
            }
        })
    })
})