import { routeToFDXLogin } from '../utils'
interface Name {
    first: string,
    last: string
}
export interface Customer {
    customerLocation: string,
    customerAge: number,
    name: Name
}

const wrapFetch = async (url: string) => {
    const result = await fetch(url, { credentials: 'include' })
    if (result.status === 401) {
        routeToFDXLogin()
    }
    else {
        return result.json()
    }
}

export const getCustomerInfo = (bank: string) => wrapFetch(`/customer?bank=${bank}`)
export const getTransactionInfo = (bank: string) => wrapFetch(`/transactions?bank=${bank}`)
export const getAccountInfo = (bank: string) => wrapFetch(`/accounts?bank=${bank}`)
export const getRewards = (bank: string) => wrapFetch(`/rewards?bank=${bank}`)
export const getAuth = (code: string) => fetch(`/auth?code=${code}`)