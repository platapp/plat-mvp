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

export const getCustomerInfo = () => wrapFetch(`/customer`) as Promise<Customer>
export const getTransactionInfo = () => wrapFetch(`/transactions`)
export const getAccountInfo = () => wrapFetch(`/accounts`)
export const getRewards = () => wrapFetch(`/rewards`)
export const getAuth = (code: string) => fetch(`/auth?code=${code}`)