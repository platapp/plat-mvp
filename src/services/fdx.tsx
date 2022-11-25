interface Auth {
    accessToken: string,
    refreshToken: string
}
interface Name {
    first: string,
    last: string
}
export interface Customer {
    customerLocation: string,
    customerAge: number,
    name: Name
}
export const getCustomerInfo = (token: string) => fetch(`/customer?token=${token}`).then(r => r.json()) as Promise<Customer>
export const getTransactionInfo = (token: string) => fetch(`/transactions?token=${token}`).then(r => r.json())
export const getAccountInfo = (token: string) => fetch(`/accounts?token=${token}`).then(r => r.json())
export const getRewards = (token: string) => fetch(`/rewards?token=${token}`).then(r => r.json())
export const getAuth = (code: string) => fetch(`/auth?code=${code}`).then(r => r.json()).then(({ accessToken }: Auth) => accessToken)