import fetch from 'node-fetch';
import path from "path"


//
const FDX_URL = process.env.FDX_URL as string
const FDX_OIDC_URL = process.env.FDX_OIDC_URL as string

interface UnnestedType<T extends string> {
    type: T
}


export interface BalanceTypes {
    currentBalance: number,
    principalBalance: number,
    currentValue: number,
    policyCoverageAmount: number,
    surrenderValue: number
}

export type BalanceType = keyof BalanceTypes

type BaseAccount = {
    status: string;
    accountId: string;
}
export type Account = {
    [key in BalanceType]: number;
}

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

type AccountMap = Record<AccountTypes, Partial<Account> & BaseAccount>
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

const applyToken = (token: string) => {
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
}

export const extractObjFromKey = <T extends string, U>(element: Partial<Record<T, U>>): (U & UnnestedType<T>) | undefined => {
    const [elementKey] = Object.keys(element) as T[] //AccountTypes
    const acct: U | undefined = element[elementKey] //Account
    return acct ? {
        ...acct,
        type: elementKey
    } : undefined
}

export const getAccounts = (token: string): Promise<Accounts[]> => {
    const fetchWithToken = (url: string) => fetch(url, applyToken(token))
    return recurseGetPaginated<Accounts>("accounts", path.join(FDX_URL, "accounts"), fetchWithToken)
}

export const getTransactionsFromAccounts = (token: string, accounts: Accounts[]) => {
    const fetchWithToken = (url: string) => fetch(url, applyToken(token))
    return Promise.all(accounts.map(account => {
        const acct = extractObjFromKey(account)
        if (acct) {
            return recurseGetPaginated<Transactions>("transactions", path.join(FDX_URL, "accounts", acct.accountId, "transactions"), fetchWithToken)
        }
        else {
            return Promise.resolve([])
        }
    })).then(transactions => transactions.flat())
}


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

interface Reward {
    programName: string,
    programUrl: string,
}

interface Rewards {
    rewardPrograms: Reward[]
}

export const recurseGetPaginated = async <T>(resultKey: string, url: string, fetchWithToken: (url: string) => Promise<any>, elements: T[] = []): Promise<T[]> => {
    const { links, [resultKey]: element } = await fetchWithToken(url).then(r => r.json()) as FetchResponse<T>
    elements.push(...element as T[])
    if (links && links.next) {
        return await recurseGetPaginated<T>(resultKey, path.join(FDX_URL, links.next.href), fetchWithToken, elements)
    }
    else {
        return Promise.resolve(elements)
    }
}

export const getCustomers = (token: string): Promise<Customer> => {
    return fetch(path.join(FDX_URL, "customers", "current"), applyToken(token)).then(r => r.json()) as Promise<Customer>
}

export const getRewards = (token: string): Promise<Rewards> => {
    return fetch(path.join(FDX_URL, "reward-programs"), applyToken(token)).then(r => r.json()) as Promise<Rewards>
}

interface Auth {
    access_token: string,
    refresh_token: string
}
export const auth = (
    code: string,
    redirectUri: string,
    clientId: string,
    clientSecret: string
) => fetch(FDX_OIDC_URL,
    {
        method: "POST",
        headers: {
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: Object.entries({ code, redirect_uri: redirectUri, grant_type: "authorization_code" }).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&')
    }).then(r => r.json()).then(({ access_token, refresh_token }: Auth) => ({
        accessToken: access_token,
        refreshToken: refresh_token
    }))