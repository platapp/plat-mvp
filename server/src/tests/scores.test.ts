//const { describe, expect, test } from '@jest/globals';
import { averageTransactions, accountTypes } from '../scores'
import { Accounts, AccountTypes } from '../service';
describe('averageTransactions', () => {
    test('averageTransactions returns elements greater than timestampe', () => {
        const transactions = [{
            processedTimestamp: '2021-03-15T13:29:19+0000',
            amount: 4.0
        },
        {
            processedTimestamp: '2021-03-15T13:29:19+0000',
            amount: 6.0
        }]
        expect(averageTransactions(transactions, '2020-03-15T13:29:19+0000')).toEqual({ totalTransactions: 2, averageTransactionSize: 5.0 })
    });
    test('averageTransactions returns no elements if before timestamp', () => {
        const transactions = [{
            processedTimestamp: '2020-03-15T13:29:19+0000',
            amount: 4.0
        },
        {
            processedTimestamp: '2020-03-15T13:29:19+0000',
            amount: 6.0
        }]
        expect(averageTransactions(transactions, '2021-03-15T13:29:19+0000')).toEqual({ totalTransactions: 0, averageTransactionSize: 0 })
    });
});

describe('accountTypes', () => {
    test('open accounts are mapped', () => {
        const accounts: Accounts[] = [{
            [AccountTypes.DepositAccount]: {
                status: "OPEN",
                currentBalance: 400.0
            }
        },
        {
            [AccountTypes.DepositAccount]: {
                status: "OPEN",
                currentBalance: 300.0
            }
        },
        {
            [AccountTypes.LoanAccount]: {
                status: "OPEN",
                currentBalance: 300.0
            }
        }
        ]
        expect(accountTypes(accounts)).toEqual({
            depositAccount: { count: 2, totalBalance: 700.0 },
            loanAccount: { count: 1, totalBalance: 300.0 },
            locAccount: { count: 0, totalBalance: 0.0 },
            investmentAccount: { count: 0, totalBalance: 0.0 },
            insuranceAccount: { count: 0, totalBalance: 0.0 },
            annuityAccount: { count: 0, totalBalance: 0.0 }
        })
    })
})