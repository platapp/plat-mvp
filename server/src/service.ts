import fetch from 'node-fetch';
import path from "path"
const FDX_URL = process.env.FDX_URL || "http://127.0.0.1:4010"

export interface Transaction {
    processedTimestamp: string,
    amount: number
}

export type Account = {
    status: string
} & ({ currentBalance: number } | { principalBalance: number })

export enum AccountTypes {
    DepositAccount = "depositAccount",
    LoanAccount = "loanAccount",
    LocAccount = "locAccount",
    InvestmentAccount = "investmentAccount",
    InsuranceAccount = "insuranceAccount",
    AnnuityAccount = "annuityAccount"
}

type AccountMap = Record<AccountTypes, Account>
export type Accounts = Partial<AccountMap>

export const getAccounts = (): Promise<Accounts[]> => {
    return recurseGetPaginated<Accounts>("accounts", path.join(FDX_URL, "accounts")).then(accounts => accounts)
}
export const getTransactions = (): Promise<Transaction[]> => {
    return recurseGetPaginated<Transaction>("payments", path.join(FDX_URL, "payments")).then(transactions => transactions)
}
export const recurseGetPaginated = async <T>(resultKey: string, url: string, elements: T[] = []): Promise<T[]> => {
    const { links: { next }, [resultKey]: element, page: { totalElements } } = await fetch(url).then(r => r.json())
    elements.push(...element)
    if (next && elements.length < totalElements) {
        return await recurseGetPaginated<T>(resultKey, path.join(FDX_URL, next.href), elements)
    }
    else {
        return Promise.resolve(elements)
    }
}

export const getCustomers = () => fetch(path.join(FDX_URL, "customers", "current")).then(r => r.json())

