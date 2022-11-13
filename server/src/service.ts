import fetch from 'node-fetch';
import path from "path"
const FDX_URL = process.env.FDX_URL || "http://127.0.0.1:4010"

interface UnnestedType<T extends string> {
    type: T
}

export type Account = {
    status: string,
    accountId: string
} & ({ currentBalance: number } | { principalBalance: number })

export type Transaction = {
    transactionId: string,
    transactionCategory: string,
    amount: number,
    description: string,
    postedTimestamp: string //in theory transactionTimestamp should also be here, but not included in the sample payload
}

export enum AccountTypes {
    DepositAccount = "depositAccount",
    LoanAccount = "loanAccount",
    LocAccount = "locAccount",
    InvestmentAccount = "investmentAccount",
    InsuranceAccount = "insuranceAccount",
    AnnuityAccount = "annuityAccount"
}

export enum TransactionTypes {
    DepositTransaction = "depositTransaction",
    LoanTransaction = "loanTransaction",
    LocTransaction = "locTransaction",
    InvestmentTransaction = "investmentTransaction",
    InsuranceTransaction = "insuranceTransaction",
    AnnuityTransaction = "annuityTransaction"
}

type AccountMap = Record<AccountTypes, Account>
export type Accounts = Partial<AccountMap>

type TransactionMap = Record<TransactionTypes, Transaction>
export type Transactions = Partial<TransactionMap>

interface Address {
    city: string,
    postalCode: string
}
export interface Customer {
    dateOfBirth: string,
    addresses: Address[]
}

export const extractObjFromKey = <T extends string, U>(element: Partial<Record<T, U>>): (U & UnnestedType<T>) | undefined => {
    const [elementKey] = Object.keys(element) as T[] //AccountTypes
    const acct: U | undefined = element[elementKey] //Account
    return acct ? {
        ...acct,
        type: elementKey
    } : undefined
}

export const getAccounts = (): Promise<Accounts[]> => {
    return recurseGetPaginated<Accounts>("accounts", path.join(FDX_URL, "accounts"))
}

export const getTransactionsFromAccounts = (accounts: Accounts[]) => {
    return Promise.all(accounts.map(account => {
        const acct = extractObjFromKey(account)
        if (acct) {
            return recurseGetPaginated<Transactions>("transactions", path.join(FDX_URL, "accounts", acct.accountId, "transactions"))
        }
        else {
            return Promise.resolve([])
        }
    })).then(transactions => transactions.flat())
}

/*
export const getTransactions = (): Promise<Transaction[]> => {
    return recurseGetPaginated<Transaction>("payments", path.join(FDX_URL, "payments"))
}*/

interface Next {
    href: string
}
interface Link {
    next: Next | undefined
}
interface Page {
    totalElements: number
}
interface FetchResponse<T> {
    links: Link,
    page: Page,
    [resultKey: string]: T[] | Link | Page,
}

export const recurseGetPaginated = async <T>(resultKey: string, url: string, elements: T[] = []): Promise<T[]> => {
    const { links: { next }, [resultKey]: element, page: { totalElements } } = await fetch(url).then(r => r.json()) as FetchResponse<T>
    elements.push(...element as T[])
    if (next && elements.length < totalElements) {
        return await recurseGetPaginated<T>(resultKey, path.join(FDX_URL, next.href), elements)
    }
    else {
        return Promise.resolve(elements)
    }
}

export const getCustomers = (): Promise<Customer> => fetch(path.join(FDX_URL, "customers", "current")).then(r => r.json()) as Promise<Customer>

