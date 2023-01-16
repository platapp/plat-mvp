import fetch from 'node-fetch';
import path from "path"
import { URLSearchParams } from 'url'


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

export type Statement = {
    statementId: string,
    statementDate: string,
    accountId: string
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
interface Name {
    first: string,
    last: string
}
export interface Customer {
    dateOfBirth: string,
    addresses: Address[],
    name: Name
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
type QueryParams = {
    [key: string]: string
}
export const fdxServices = (apiUrl: string) => (token: string) => {
    const fetchWithToken = (optionalQueryParams: QueryParams = {}) => (endpoint: string) => {
        const url = new URL(path.join(apiUrl, endpoint))
        Object.entries(optionalQueryParams).forEach(([key, value]) => {
            url.searchParams.set(key, value)
        })
        return fetch(url.href, applyToken(token))
    }
    return {
        getAccounts: (): Promise<Accounts[]> => {
            return recurseGetPaginated<Accounts>("accounts", "accounts", fetchWithToken({ resultType: "details" }))
        },
        getTransactionsFromAccounts: (accounts: Accounts[]) => {
            return Promise.all(accounts.map(account => {
                const acct = extractObjFromKey(account)
                if (acct) {
                    return recurseGetPaginated<Transactions>("transactions", path.join("accounts", acct.accountId, "transactions"), fetchWithToken())
                }
                else {
                    return Promise.resolve([])
                }
            })).then(transactions => transactions.flat())
        },
        getStatementsFromAccounts: (accounts: Accounts[]) => {
            return Promise.all(accounts.map(account => {
                const acct = extractObjFromKey(account)
                if (acct) {
                    return recurseGetPaginated<Statement>("statements", path.join("accounts", acct.accountId, "statements"), fetchWithToken())
                }
                else {
                    return Promise.resolve([])
                }
            })).then(statements => statements.flat())
        },
        getCustomers: (): Promise<Customer> => {
            return fetchWithToken()(path.join("customers", "current")).then(r => r.json()) as Promise<Customer>
        },
        getRewards: (): Promise<Rewards> => {
            return fetchWithToken()("reward-programs").then(r => r.json()) as Promise<Rewards>
        },

    }
}

export const fdxAuth = (
    authUrl: string,
    redirectUri: string,
    clientId: string,
    clientSecret: string
) => {
    const headers = {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    return {
        auth: (code: string) => fetch(authUrl,
            {
                method: "POST",
                headers,
                body: new URLSearchParams({ code, redirect_uri: redirectUri, grant_type: "authorization_code" }).toString()
            }).then(r => r.json()).then(({ access_token, refresh_token }: Auth) => ({
                accessToken: access_token,
                refreshToken: refresh_token
            })),
        refresh: (refreshToken: string) => fetch(authUrl,
            {
                method: "POST",
                headers,
                body: new URLSearchParams({ refresh_token: refreshToken, grant_type: "refresh_token" }).toString()
            }).then(r => r.json()).then(({ access_token, refresh_token }: Auth) => ({
                accessToken: access_token,
                refreshToken: refresh_token
            }))
    }
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
        return await recurseGetPaginated<T>(resultKey, links.next.href, fetchWithToken, elements)
    }
    else {
        return Promise.resolve(elements)
    }
}


interface Auth {
    access_token: string,
    refresh_token: string
}
